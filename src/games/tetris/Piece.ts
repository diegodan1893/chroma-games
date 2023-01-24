import { Vector2 } from "../../math/Vector2"
import { Rect } from "../../math/Rect"
import { Matrix } from "../../math/Matrix"
import { Renderer } from "../../renderers/Renderer"
import { TetrisBoard } from "./TetrisBoard"

// Piece colors
const I = 0xffff00
const J = 0xff2222
const L = 0x0033ff
const O = 0x00ffff
const S = 0x00ff00
const T = 0xff0099
const Z = 0x0000ff

export class Piece {
	public position: Vector2

	constructor(
		private board: TetrisBoard,
		private _shape: Matrix,
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
			[0, 0, I, 0],
			[0, 0, I, 0],
			[0, 0, I, 0],
			[0, 0, I, 0],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createJ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, J, J],
			[0, J, 0],
			[0, J, 0],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createL(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, L, 0],
			[0, L, 0],
			[0, L, L],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createO(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 0, 0],
			[0, O, O, 0],
			[0, O, O, 0],
			[0, 0, 0, 0],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createS(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, S, 0],
			[0, S, S],
			[0, 0, S],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createT(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, T, 0],
			[0, T, T],
			[0, T, 0],
		])

		return new Piece(board, shape, spawnArea)
	}

	static createZ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, Z],
			[0, Z, Z],
			[0, Z, 0],
		])

		return new Piece(board, shape, spawnArea)
	}

	draw(renderer: Renderer) {
		renderer.copy(this.shape, this.position)
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
