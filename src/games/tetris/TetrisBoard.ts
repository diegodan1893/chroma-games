import { Vector2 } from "../../math/Vector2"
import { Matrix } from "../../math/Matrix"
import { Rect } from "../../math/Rect"
import { shuffle } from "../../math/Random"
import { Chroma } from "../../renderers/Chroma"
import { Game } from "../common/Game"
import { Piece } from "./Piece"

enum GameState {
	Stopped,
	Playing,
	GameOver,
}

export class TetrisBoard implements Game {
	private state: GameState
	private board: Matrix

	private nextPieces: Piece[]
	private currentPiece?: Piece
	private bagPiece?: Piece

	private gravityIntervalMS: number

	private interval?: ReturnType<typeof setTimeout>
	private inputAbortController?: AbortController

	constructor(
		private renderer: Chroma,
		private boardDimensions: Rect = { x: 2, y: 1, width: 11, height: 4 },
		private bagPosition: Vector2 = { x: 18, y: 1 },
		private initialGravityIntervalMS = 1000
	) {
		this.state = GameState.Stopped
		this.board = new Matrix(
			this.boardDimensions.width,
			this.boardDimensions.height
		)
		this.nextPieces = []
		this.gravityIntervalMS = initialGravityIntervalMS
	}

	query(position: Vector2) {
		const outOfBounds =
			position.x < this.boardDimensions.x ||
			position.y < this.boardDimensions.y ||
			position.y >= this.boardDimensions.y + this.boardDimensions.height

		return (
			outOfBounds ||
			this.board.get(
				position.x - this.boardDimensions.x,
				position.y - this.boardDimensions.y
			) !== 0
		)
	}

	startGame() {
		if (this.state !== GameState.Stopped) {
			this.stopGame()
		}

		this.nextPieces = []
		this.currentPiece = undefined
		this.bagPiece = undefined
		this.gravityIntervalMS = this.initialGravityIntervalMS
		this.board.clear()

		this.state = GameState.Playing

		this.inputAbortController = new AbortController()
		document.addEventListener(
			"keydown",
			(event) => {
				this.handleInput(event.key)
			},
			{
				signal: this.inputAbortController.signal,
			}
		)

		// Perform a first draw so that the state of the new game
		// is reflected immediately without waiting for the interval
		this.draw()

		this.refreshUpdateInterval()
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

	private refreshUpdateInterval() {
		if (this.interval) {
			clearInterval(this.interval)
		}

		this.interval = setInterval(() => {
			this.update()
			this.draw()
		}, this.gravityIntervalMS)
	}

	private update() {
		if (this.state !== GameState.Playing) {
			return
		}

		if (!this.currentPiece) {
			this.currentPiece = this.getNextPiece()
		}

		this.dropCurrentPiece()
	}

	private draw() {
		this.renderer.clear()
		this.renderer.copy({
			matrix: this.board,
			offset: {
				x: this.boardDimensions.x,
				y: this.boardDimensions.y,
			},
		})

		if (this.currentPiece) {
			this.currentPiece.drawGhost(this.renderer, this.boardDimensions)
			this.currentPiece.draw(this.renderer, this.boardDimensions)
		}

		if (this.bagPiece) {
			this.bagPiece.draw(this.renderer)
		}

		this.renderer.present()
	}

	private handleInput(key: string) {
		if (key === "Backspace") {
			this.startGame()
		} else {
			if (this.currentPiece) {
				switch (key) {
					case "ArrowUp":
						this.currentPiece.attemptMove({ x: 0, y: -1 })
						this.draw()
						break
					case "ArrowDown":
						this.currentPiece.attemptMove({ x: 0, y: +1 })
						this.draw()
						break
					case "ArrowLeft":
						this.dropCurrentPiece()
						this.draw()

						// Reset the interval so that the piece doesn't move
						// again just after the player moves it
						this.refreshUpdateInterval()
						break
					case "ArrowRight":
						while (this.currentPiece) {
							this.dropCurrentPiece()
						}

						this.draw()
						break
					case "Shift":
						this.currentPiece.attemptCounterClockwiseRotation()
						this.draw()
						break
					case "Control":
						this.currentPiece.attemptClockwiseRotation()
						this.draw()
						break
				}
			}
		}
	}

	private getNextPiece() {
		if (!this.nextPieces.length) {
			const spawnArea = {
				x: this.boardDimensions.x + this.boardDimensions.width - 1,
				y: this.boardDimensions.y,
				width: 4,
				height: this.boardDimensions.height,
			}

			this.nextPieces = shuffle([
				Piece.createI(this, spawnArea),
				Piece.createJ(this, spawnArea),
				Piece.createL(this, spawnArea),
				Piece.createO(this, spawnArea),
				Piece.createS(this, spawnArea),
				Piece.createT(this, spawnArea),
				Piece.createZ(this, spawnArea),
			])
		}

		// This is never going to be undefined, we control for that above
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.nextPieces.pop()!
	}

	private dropCurrentPiece() {
		if (!this.currentPiece) {
			return
		}

		const pieceMoved = this.currentPiece.attemptMove({ x: -1, y: 0 })

		if (!pieceMoved) {
			this.placeCurrentPiece()
		}
	}

	private placeCurrentPiece() {
		if (!this.currentPiece) {
			return
		}

		const pieceBoardPosition = {
			x: this.currentPiece.position.x - this.boardDimensions.x,
			y: this.currentPiece.position.y - this.boardDimensions.y,
		}

		this.board.copy({
			matrix: this.currentPiece.shape,
			offset: pieceBoardPosition,
			tint: this.currentPiece.color,
		})

		let dstLine = pieceBoardPosition.x + this.currentPiece.leftSpaceSize
		let srcLine = dstLine

		if (dstLine >= this.boardDimensions.width) {
			// A piece was placed fully out of bounds
			this.state = GameState.GameOver
		}

		while (dstLine < this.boardDimensions.width) {
			if (srcLine < this.boardDimensions.width) {
				if (this.testLineClear(srcLine)) {
					++srcLine
				} else {
					this.copyLine(srcLine, dstLine)

					++srcLine
					++dstLine
				}
			} else {
				this.emptyLine(dstLine)
				++dstLine
			}
		}

		this.currentPiece = undefined
	}

	private testLineClear(line: number) {
		for (let y = 0; y < this.boardDimensions.height; ++y) {
			if (this.board.get(line, y) === 0) {
				return false
			}
		}

		return true
	}

	private copyLine(srcLine: number, dstLine: number) {
		if (srcLine !== dstLine) {
			for (let y = 0; y < this.boardDimensions.height; ++y) {
				this.board.set(dstLine, y, this.board.get(srcLine, y))
			}
		}
	}

	private emptyLine(line: number) {
		for (let y = 0; y < this.boardDimensions.height; ++y) {
			this.board.set(line, y, 0)
		}
	}
}
