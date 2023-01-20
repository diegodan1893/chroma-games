import { filledMatrix } from "../math/Matrix"
import { Chroma } from "../chroma/Chroma"
import { Vector2 } from "../math/Vector2"
import { Entity } from "./Entity"
import { Snake } from "./Snake"
import { Food } from "./Food"

enum GameState {
	Stopped,
	Playing,
	GameOver,
}

export class SnakeBoard {
	private state: GameState
	private entities: Entity[]
	private interval?: ReturnType<typeof setTimeout>
	private inputAbortController?: AbortController

	constructor(
		private chroma: Chroma,
		private _width: number,
		private _height: number,
		private offsetX: number,
		private offsetY: number
	) {
		this.entities = []
		this.state = GameState.Stopped
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
		if (this.state !== GameState.Stopped) {
			this.stopGame()
		}

		this.entities = [
			new Snake(this, { x: 1, y: Math.floor(this.height / 2) }, 3),
			new Food(this),
		]

		this.state = GameState.Playing

		this.inputAbortController = new AbortController()
		document.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Backspace") {
					// Restart the game on backspace
					this.startGame()
				} else {
					this.entities.forEach((entity) => {
						if (entity.handleInput) {
							entity.handleInput(event.key)
						}
					})
				}
			},
			{ signal: this.inputAbortController.signal }
		)

		this.interval = setInterval(async () => {
			this.update()
			this.draw()
		}, 200)
	}

	stopGame() {
		this.state = GameState.Stopped

		if (this.inputAbortController) {
			this.inputAbortController.abort()
		}

		if (this.interval) {
			clearInterval(this.interval)
			this.interval = undefined
		}
	}

	loseGame() {
		this.state = GameState.GameOver
	}
}
