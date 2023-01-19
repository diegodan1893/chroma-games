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
				switch (e.key) {
					case "ArrowUp":
						this.direction = Direction.Up
						break
					case "ArrowDown":
						this.direction = Direction.Down
						break
					case "ArrowRight":
						this.direction = Direction.Right
						break
					case "ArrowLeft":
						this.direction = Direction.Left
					default:
						break
				}
			})
		}
	}

	update() {
		const newPosition = { x: this.position.x, y: this.position.y }
		const currentDirection = this.direction

		if (this.prev) {
			this.direction = this.prev.direction
		}

		switch (currentDirection) {
			case Direction.None:
				// Do nothing
				return
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

		this.position = newPosition

		const collision = this.board.query(newPosition)

		if (collision) {
			collision.handleCollision(this)
		}

		if (this.next) {
			this.next.update()
		}
	}

	draw(screen: number[][]) {
		screen[this.position.y][this.position.x] = SNAKE_COLOR

		if (this.next) {
			this.next.draw(screen)
		}
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

	handleCollision(entity: Entity) {
		this.head.handleCollision(entity)
	}

	grow(length: number = 1) {
		this.head.grow(length)
	}
}
