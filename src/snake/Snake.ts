import { Matrix } from "../math/Matrix"
import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { SnakeBoard } from "./SnakeBoard"

const ALIVE_SNAKE_COLOR = 0x00ff00
const DEAD_SNAKE_COLOR = 0x0000ff

enum Direction {
	None,
	Up,
	Down,
	Left,
	Right,
}

class InputBuffer {
	private buffer: Direction[]
	private start: number
	private end: number
	private length: number

	constructor(private maxLength: number) {
		this.buffer = new Array(maxLength)
		this.start = 0
		this.end = 0
		this.length = 0
	}

	enqueue(input: Direction) {
		if (this.buffer[this.end - 1] === input) {
			// Input is the same as the last one, discard
			return
		}

		if (this.length === this.maxLength) {
			// Queue is full, discard input
			return
		}

		++this.length
		this.buffer[this.end] = input
		this.end = (this.end + 1) % this.maxLength
	}

	dequeue(): Direction | undefined {
		if (this.length === 0) {
			return undefined
		}

		--this.length
		const input = this.buffer[this.start]
		this.start = (this.start + 1) % this.maxLength

		return input
	}
}

class SnakeBlock implements Entity {
	private next?: SnakeBlock
	private direction: Direction = Direction.None
	private inputBuffer?: InputBuffer
	private alive: boolean

	constructor(
		private board: SnakeBoard,
		private snake: Snake,
		private position: Vector2,
		private prev?: SnakeBlock
	) {
		if (!prev) {
			// This is the head, handle input
			this.inputBuffer = new InputBuffer(3)
		}

		this.alive = true
	}

	update() {
		this.processInput()

		if (this.next) {
			this.next.update()
		}

		if (this.snake.alive) {
			const currentDirection = this.direction

			if (this.prev) {
				this.direction = this.prev.direction
			}

			if (currentDirection === Direction.None) {
				// If the snake is not moving, don't test for collisions
				return
			}

			const newPosition = this.getNextPosition(currentDirection)

			if (!this.prev) {
				// This is the head, check for collisions
				const collision = this.board.query(newPosition)

				if (collision) {
					collision.handleCollision(this.snake)
				}
			}

			this.position = newPosition
		} else if (this.alive) {
			// Dead animation
			if (this.prev) {
				this.alive = this.prev.alive
			} else {
				// This is the head
				this.alive = false
			}
		}
	}

	draw(screen: Matrix) {
		screen.set(
			this.position.x,
			this.position.y,
			this.alive ? ALIVE_SNAKE_COLOR : DEAD_SNAKE_COLOR
		)

		if (this.next) {
			this.next.draw(screen)
		}
	}

	testCollision(position: Vector2): boolean {
		if (position.x === this.position.x && position.y === this.position.y) {
			return true
		}

		if (this.next) {
			return this.next.testCollision(position)
		}

		return false
	}

	handleCollision() {
		this.snake.kill()
		this.board.loseGame()
	}

	handleInput(key: string) {
		if (!this.inputBuffer) {
			return
		}

		let newDirection = this.direction

		switch (key) {
			case "ArrowUp":
				newDirection = Direction.Up
				break
			case "ArrowDown":
				newDirection = Direction.Down
				break
			case "ArrowRight":
				newDirection = Direction.Right
				break
			case "ArrowLeft":
				newDirection = Direction.Left
				break
			default:
				break
		}

		this.inputBuffer.enqueue(newDirection)
	}

	grow(length: number) {
		if (length <= 0) {
			return
		}

		if (this.next) {
			this.next.grow(length)
		} else {
			this.next = new SnakeBlock(
				this.board,
				this.snake,
				this.position,
				this
			)
			this.next.grow(length - 1)
		}
	}

	private getNextPosition(direction: Direction): Vector2 {
		const newPosition = { x: this.position.x, y: this.position.y }

		switch (direction) {
			case Direction.None:
				// Do nothing
				break
			case Direction.Up:
				// With the modulo operation, this is equivalent to substracting 1
				// to the current position, while avoiding negative numbers
				newPosition.y =
					(newPosition.y + this.board.height - 1) % this.board.height
				break
			case Direction.Down:
				newPosition.y = (newPosition.y + 1) % this.board.height
				break
			case Direction.Left:
				// With the modulo operation, this is equivalent to substracting 1
				// to the current position, while avoiding negative numbers
				newPosition.x =
					(newPosition.x + this.board.width - 1) % this.board.width
				break
			case Direction.Right:
				newPosition.x = (newPosition.x + 1) % this.board.width
				break
		}

		return newPosition
	}

	private processInput() {
		if (!this.inputBuffer) {
			return
		}

		let nextInput = this.inputBuffer.dequeue()
		let acceptedInput = false

		while (nextInput && !acceptedInput) {
			// Don't allow the snake to crash into itself by reversing its
			// movement
			const nextPosition = this.getNextPosition(nextInput)

			if (
				!this.next ||
				this.next.position.x !== nextPosition.x ||
				this.next.position.y !== nextPosition.y
			) {
				this.direction = nextInput
				acceptedInput = true
			} else {
				nextInput = this.inputBuffer.dequeue()
			}
		}
	}
}

export class Snake implements Entity {
	private head: SnakeBlock
	private _alive: boolean

	constructor(private board: SnakeBoard, position: Vector2, length: number) {
		this.head = new SnakeBlock(board, this, position, undefined)
		this.grow(length - 1)

		this._alive = true
	}

	get alive() {
		return this._alive
	}

	update() {
		this.head.update()
	}

	draw(screen: Matrix) {
		this.head.draw(screen)
	}

	testCollision(position: Vector2) {
		return this.head.testCollision(position)
	}

	handleCollision() {
		this.head.handleCollision()
	}

	handleInput(key: string) {
		this.head.handleInput(key)
	}

	grow(length = 1) {
		this.head.grow(length)
	}

	kill() {
		this._alive = false
	}
}
