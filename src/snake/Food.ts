import { Matrix } from "../math/Matrix"
import { randomInRange } from "../math/Random"
import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { Snake } from "./Snake"
import { SnakeBoard } from "./SnakeBoard"

const FOOD_COLOR = 0xffffff

export class Food implements Entity {
	private position: Vector2

	constructor(private board: SnakeBoard) {
		this.position = { x: 0, y: 0 }
		this.regenerate()
	}

	update() {}

	draw(screen: Matrix) {
		screen.set(this.position.x, this.position.y, FOOD_COLOR)
	}

	testCollision(position: Vector2) {
		return this.position.x == position.x && this.position.y == position.y
	}

	handleCollision(entity: Entity) {
		if (entity instanceof Snake) {
			entity.grow(1)
			this.regenerate()
		}
	}

	private regenerate() {
		let newPosition: Vector2

		do {
			newPosition = {
				x: Math.floor(randomInRange(0, this.board.width)),
				y: Math.floor(randomInRange(0, this.board.height)),
			}
		} while (this.board.query(newPosition))

		this.position = newPosition
	}
}
