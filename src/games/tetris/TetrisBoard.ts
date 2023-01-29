import { Vector2 } from "../../math/Vector2"
import { Matrix } from "../../math/Matrix"
import { Rect } from "../../math/Rect"
import { shuffle } from "../../math/Random"
import { wait } from "../../util/time"
import { Renderer } from "../../renderers/Renderer"
import { Game } from "../common/Game"
import { Piece } from "./Piece"

const LINE_CLEAR_FLASH_COLOR = 0xffffff

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

	private canSwapHoldPiece: boolean

	private playerLevel: number
	private linesToNextLevel: number

	private interval?: ReturnType<typeof setTimeout>
	private inputAbortController?: AbortController

	constructor(
		private renderer: Renderer,
		private boardArea: Rect = { x: 2, y: 1, width: 11, height: 4 },
		private holdArea: Rect = { x: 18, y: 1, width: 4, height: 4 },
		private lineClearDelayMS = 350,
		private maxPlayerLevel = 10,
		private linesPerLevel = 10
	) {
		this.state = GameState.Stopped
		this.board = new Matrix(this.boardArea.width, this.boardArea.height)
		this.nextPieces = []
		this.canSwapHoldPiece = true
		this.playerLevel = 1
		this.linesToNextLevel = this.linesPerLevel

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

	async startGame() {
		if (this.state !== GameState.Stopped) {
			this.stopGame()
		}

		this.nextPieces = []
		this.currentPiece = undefined
		this.holdPiece = undefined
		this.playerLevel = 1
		this.linesToNextLevel = this.linesPerLevel
		this.board.clear()

		this.state = GameState.Playing

		this.inputAbortController = new AbortController()
		document.addEventListener(
			"keydown",
			async (event) => {
				// Prevent the tab key from switching the focus
				event.preventDefault()
				await this.handleInput(event.key)
			},
			{
				signal: this.inputAbortController.signal,
			}
		)

		// Perform a first draw so that the state of the new game
		// is reflected immediately without waiting for the interval
		await this.draw()

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

		// Formula taken from the 2009 Tetris Design Guideline
		const gravityIntervalSeconds = Math.pow(
			0.8 - (this.playerLevel - 1) * 0.007,
			this.playerLevel - 1
		)

		this.interval = setInterval(async () => {
			await this.update()
			await this.draw()
		}, gravityIntervalSeconds * 1000)
	}

	private async update() {
		if (this.state !== GameState.Playing) {
			return
		}

		if (!this.currentPiece) {
			this.currentPiece = this.getNextPiece()
		} else {
			await this.dropCurrentPiece()
		}
	}

	private async draw() {
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

		await this.renderer.present()
	}

	private async handleInput(key: string) {
		if (key === "Backspace") {
			this.startGame()
		} else {
			if (this.currentPiece) {
				switch (key) {
					case "ArrowUp":
						this.currentPiece.attemptMove({ x: 0, y: -1 })
						await this.draw()
						break
					case "ArrowDown":
						this.currentPiece.attemptMove({ x: 0, y: +1 })
						await this.draw()
						break
					case "ArrowLeft":
						await this.dropCurrentPiece()
						await this.draw()

						// Reset the interval so that the piece doesn't move
						// again just after the player moves it
						this.refreshUpdateInterval()
						break
					case "ArrowRight":
						while (this.currentPiece) {
							await this.dropCurrentPiece()
						}

						await this.draw()
						break
					case "Shift":
						this.currentPiece.attemptCounterClockwiseRotation()
						await this.draw()
						break
					case "Control":
						this.currentPiece.attemptClockwiseRotation()
						await this.draw()
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
							await this.draw()

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

	private async dropCurrentPiece() {
		if (!this.currentPiece) {
			return
		}

		const pieceMoved = this.currentPiece.attemptMove({ x: -1, y: 0 })

		if (!pieceMoved) {
			await this.placeCurrentPiece()
		}
	}

	private async placeCurrentPiece() {
		if (!this.currentPiece) {
			return
		}

		const pieceBoardPosition = {
			x: this.currentPiece.position.x - this.boardArea.x,
			y: this.currentPiece.position.y - this.boardArea.y,
		}

		this.currentPiece.drawToMatrix(this.board, pieceBoardPosition)

		const placementLine =
			pieceBoardPosition.x + this.currentPiece.leftSpaceSize

		if (placementLine >= this.boardArea.width) {
			// A piece was placed fully out of bounds
			this.state = GameState.GameOver
		}

		const clearedLines = new Set<number>()

		for (let line = placementLine; line < this.boardArea.width; ++line) {
			if (this.testLineClear(line)) {
				clearedLines.add(line)
			}
		}

		if (clearedLines.size > 0) {
			await this.clearLinesWithAnimation(placementLine, clearedLines)

			this.linesToNextLevel -= clearedLines.size
			if (this.linesToNextLevel <= 0) {
				this.playerLevel = Math.min(
					this.playerLevel + 1,
					this.maxPlayerLevel
				)
				this.linesToNextLevel = this.linesPerLevel
			}
		}

		this.currentPiece = undefined
		this.canSwapHoldPiece = true
	}

	private async clearLinesWithAnimation(
		placementLine: number,
		clearedLines: Set<number>
	) {
		// Pause the game while we play the animation
		if (this.interval) {
			clearInterval(this.interval)
		}

		// Draw the board in its current state
		await this.draw()

		// Draw a flash over the lines that are going to be cleared
		const lineMatrix = new Matrix(1, this.boardArea.height, 1)

		clearedLines.forEach((line) => {
			this.renderer.copy({
				matrix: lineMatrix,
				offset: {
					x: this.boardArea.x + line,
					y: this.boardArea.y,
				},
				tint: LINE_CLEAR_FLASH_COLOR,
			})
		})

		this.renderer.present()
		await wait(this.lineClearDelayMS / 2)

		clearedLines.forEach((line) => {
			this.renderer.copy({
				matrix: lineMatrix,
				offset: {
					x: this.boardArea.x + line,
					y: this.boardArea.y,
				},
				tint: 0,
			})
		})

		this.renderer.present()
		await wait(this.lineClearDelayMS / 2)

		// Update the board
		let dstLine = placementLine
		let srcLine = dstLine

		while (dstLine < this.boardArea.width) {
			if (srcLine < this.boardArea.width) {
				if (clearedLines.has(srcLine)) {
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

		// Resume the game
		this.refreshUpdateInterval()
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
