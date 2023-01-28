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
	private holdPiece?: Piece
	private pieceSpawnArea: Rect

	private gravityIntervalMS: number
	private canSwapHoldPiece: boolean

	private interval?: ReturnType<typeof setTimeout>
	private inputAbortController?: AbortController

	constructor(
		private renderer: Chroma,
		private boardArea: Rect = { x: 2, y: 1, width: 11, height: 4 },
		private holdArea: Rect = { x: 18, y: 1, width: 4, height: 4 },
		private initialGravityIntervalMS = 1000
	) {
		this.state = GameState.Stopped
		this.board = new Matrix(this.boardArea.width, this.boardArea.height)
		this.nextPieces = []
		this.gravityIntervalMS = initialGravityIntervalMS
		this.canSwapHoldPiece = true

		this.pieceSpawnArea = {
			x: this.boardArea.x + this.boardArea.width - 1,
			y: this.boardArea.y,
			width: 4,
			height: this.boardArea.height,
		}
	}

	query(position: Vector2) {
		const outOfBounds =
			position.x < this.boardArea.x ||
			position.y < this.boardArea.y ||
			position.y >= this.boardArea.y + this.boardArea.height

		return (
			outOfBounds ||
			this.board.get(
				position.x - this.boardArea.x,
				position.y - this.boardArea.y
			) !== 0
		)
	}

	startGame() {
		if (this.state !== GameState.Stopped) {
			this.stopGame()
		}

		this.nextPieces = []
		this.currentPiece = undefined
		this.holdPiece = undefined
		this.gravityIntervalMS = this.initialGravityIntervalMS
		this.board.clear()

		this.state = GameState.Playing

		this.inputAbortController = new AbortController()
		document.addEventListener(
			"keydown",
			(event) => {
				// Prevent the tab key from switching the focus
				event.preventDefault()
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
				x: this.boardArea.x,
				y: this.boardArea.y,
			},
		})

		if (this.currentPiece) {
			this.currentPiece.drawGhost(this.renderer, this.boardArea)
			this.currentPiece.draw(this.renderer, this.boardArea)
		}

		if (this.holdPiece) {
			this.holdPiece.draw(this.renderer)
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
					case "Tab":
						if (this.canSwapHoldPiece) {
							const previousHoldPiece = this.holdPiece

							this.holdPiece = this.currentPiece
							this.holdPiece.respawn(this.holdArea)

							if (previousHoldPiece) {
								this.currentPiece = previousHoldPiece
								this.currentPiece.respawn(this.pieceSpawnArea)
							} else {
								this.currentPiece = this.getNextPiece()
							}

							this.canSwapHoldPiece = false
							this.draw()

							// Reset the interval so that the piece doesn't move
							// just after the player swaps it
							this.refreshUpdateInterval()
							break
						}
				}
			}
		}
	}

	private getNextPiece() {
		if (!this.nextPieces.length) {
			this.nextPieces = shuffle([
				Piece.createI(this, this.pieceSpawnArea),
				Piece.createJ(this, this.pieceSpawnArea),
				Piece.createL(this, this.pieceSpawnArea),
				Piece.createO(this, this.pieceSpawnArea),
				Piece.createS(this, this.pieceSpawnArea),
				Piece.createT(this, this.pieceSpawnArea),
				Piece.createZ(this, this.pieceSpawnArea),
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
			x: this.currentPiece.position.x - this.boardArea.x,
			y: this.currentPiece.position.y - this.boardArea.y,
		}

		this.board.copy({
			matrix: this.currentPiece.shape,
			offset: pieceBoardPosition,
			tint: this.currentPiece.color,
		})

		let dstLine = pieceBoardPosition.x + this.currentPiece.leftSpaceSize
		let srcLine = dstLine

		if (dstLine >= this.boardArea.width) {
			// A piece was placed fully out of bounds
			this.state = GameState.GameOver
		}

		while (dstLine < this.boardArea.width) {
			if (srcLine < this.boardArea.width) {
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
		this.canSwapHoldPiece = true
	}

	private testLineClear(line: number) {
		for (let y = 0; y < this.boardArea.height; ++y) {
			if (this.board.get(line, y) === 0) {
				return false
			}
		}

		return true
	}

	private copyLine(srcLine: number, dstLine: number) {
		if (srcLine !== dstLine) {
			for (let y = 0; y < this.boardArea.height; ++y) {
				this.board.set(dstLine, y, this.board.get(srcLine, y))
			}
		}
	}

	private emptyLine(line: number) {
		for (let y = 0; y < this.boardArea.height; ++y) {
			this.board.set(line, y, 0)
		}
	}
}
