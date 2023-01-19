import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { Snake } from "./Snake"

export class SnakeBoard {
	private entities: Entity[]

	constructor(private _width: number, private _height: number) {
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

	query(position: Vector2): Entity | null {
		return null
	}

	startGame() {
		this.entities = [
			new Snake(this, { x: 1, y: Math.floor(this.height / 2) }, 3),
		]
	}

	loseGame() {}
}
