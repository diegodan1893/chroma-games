import { Vector2 } from "../../math/Vector2"
import { Rect } from "../../math/Rect"
import { Matrix } from "../../math/Matrix"
import { Renderer } from "../../renderers/Renderer"
import { TetrisBoard } from "./TetrisBoard"

// Piece colors
const I_COLOR = 0xffff00
const J_COLOR = 0xff2222
const L_COLOR = 0x0033ff
const O_COLOR = 0x00ffff
const S_COLOR = 0x00ff00
const T_COLOR = 0xff0099
const Z_COLOR = 0x0000ff
const GHOST_COLOR = 0x444444

export class Piece {
	public position: Vector2

	constructor(
		private board: TetrisBoard,
		private _shape: Matrix,
		private _color: number,
		spawnArea: Rect
	) {
		_shape.mask = 0

		this.position = {
			x: Math.floor(spawnArea.x + spawnArea.width / 2 - this.size / 2),
			y: Math.floor(spawnArea.y + spawnArea.height / 2 - this.size / 2),
		}
	}

	get size() {
		return this.shape.height
	}

	get shape() {
		return this._shape
	}

	get color() {
		return this._color
	}

	get leftSpaceSize() {
		for (let x = 0; x < this.size; ++x) {
			for (let y = 0; y < this.size; ++y) {
				if (this.shape.get(x, y) !== 0) {
					return x
				}
			}
		}

		return this.size
	}

	static createI(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
		])

		return new Piece(board, shape, I_COLOR, spawnArea)
	}

	static createJ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0],
		])

		return new Piece(board, shape, J_COLOR, spawnArea)
	}

	static createL(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		])

		return new Piece(board, shape, L_COLOR, spawnArea)
	}

	static createO(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		])

		return new Piece(board, shape, O_COLOR, spawnArea)
	}

	static createS(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1],
		])

		return new Piece(board, shape, S_COLOR, spawnArea)
	}

	static createT(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 1],
			[0, 1, 0],
		])

		return new Piece(board, shape, T_COLOR, spawnArea)
	}

	static createZ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0],
		])

		return new Piece(board, shape, Z_COLOR, spawnArea)
	}

	draw(renderer: Renderer, dstRect?: Rect) {
		renderer.copy({
			matrix: this.shape,
			offset: this.position,
			dstRect,
			tint: this.color,
		})
	}

	drawGhost(renderer: Renderer) {
		let ghostX = this.position.x

		while (this.isValidPosition({ x: ghostX - 1, y: this.position.y })) {
			--ghostX
		}

		renderer.copy({
			matrix: this.shape,
			offset: { x: ghostX, y: this.position.y },
			tint: GHOST_COLOR,
		})
	}

	attemptMove(move: Vector2) {
		const newPosition = {
			x: this.position.x + move.x,
			y: this.position.y + move.y,
		}

		if (this.isValidPosition(newPosition)) {
			this.position = newPosition
			return true
		}

		return false
	}

	private isValidPosition(position: Vector2) {
		for (let y = 0; y < this.shape.height; ++y) {
			for (let x = 0; x < this.shape.width; ++x) {
				const boardPosition = { x: x + position.x, y: y + position.y }
				if (
					this.shape.get(x, y) !== 0 &&
					this.board.query(boardPosition)
				) {
					return false
				}
			}
		}

		return true
	}
}
