import { filledMatrix } from "../math/Matrix"
import { Chroma } from "../chroma/Chroma"
import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { Snake } from "./Snake"
import { Food } from "./Food"

export class SnakeBoard {
	private entities: Entity[]
	private interval?: ReturnType<typeof setTimeout>

	constructor(
		private chroma: Chroma,
		private _width: number,
		private _height: number,
		private offsetX: number,
		private offsetY: number
	) {
		this.entities = []
	}

	get width() {
		return this._width
	}

	get height() {
		return this._height
	}

	update() {
		this.entities.forEach((entity) => entity.update())
	}

	draw() {
		const screen = filledMatrix(this.width, this.height, 0)

		this.entities.forEach((entity) => entity.draw(screen))

		this.chroma.drawKeyboard(this.offsetX, this.offsetY, screen)
	}

	query(position: Vector2): Entity | undefined {
		return this.entities.find((entity) => entity.testCollision(position))
	}

	startGame() {
		this.entities = [
			new Snake(this, { x: 1, y: Math.floor(this.height / 2) }, 3),
			new Food(this),
		]

		this.interval = setInterval(async () => {
			this.update()
			this.draw()
		}, 150)
	}

	loseGame() {
		if (this.interval) {
			clearInterval(this.interval)
		}
	}
}
