import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { SnakeBoard } from "./SnakeBoard"

const SNAKE_COLOR = 0x00ff00

enum Direction {
	None,
	Up,
	Down,
	Left,
	Right,
}

class SnakeBlock implements Entity {
	private next?: SnakeBlock
	private direction: Direction = Direction.None

	constructor(
		private board: SnakeBoard,
		private position: Vector2,
		private prev?: SnakeBlock
	) {
		if (!prev) {
			// This is the head, handle input
			document.addEventListener("keydown", (e) => {
				let newDirection = this.direction

				switch (e.key) {
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
					default:
						break
				}

				// Don't allow the snake to crash into itself by reversing its
				// movement
				const nextPosition = this.getNextPosition(newDirection)

				if (
					!this.next ||
					this.next.position.x !== nextPosition.x ||
					this.next.position.y !== nextPosition.y
				) {
					this.direction = newDirection
				}
			})
		}
	}

	update() {
		if (this.next) {
			this.next.update()
		}

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
				collision.handleCollision(this)
			}
		}

		this.position = newPosition
	}

	draw(screen: number[][]) {
		screen[this.position.y][this.position.x] = SNAKE_COLOR

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

	handleCollision(entity: Entity) {
		this.board.loseGame()
	}

	grow(length: number) {
		if (length <= 0) {
			return
		}

		if (this.next) {
			this.next.grow(length)
		}

		this.next = new SnakeBlock(this.board, this.position, this)
		this.next.grow(length - 1)
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
}

export class Snake implements Entity {
	private head: SnakeBlock

	constructor(private board: SnakeBoard, position: Vector2, length: number) {
		this.head = new SnakeBlock(board, position, undefined)
		this.grow(length - 1)
	}

	update() {
		this.head.update()
	}

	draw(screen: number[][]) {
		this.head.draw(screen)
	}

	testCollision(position: Vector2) {
		return this.head.testCollision(position)
	}

	handleCollision(entity: Entity) {
		this.head.handleCollision(entity)
	}

	grow(length: number = 1) {
		this.head.grow(length)
	}
}
