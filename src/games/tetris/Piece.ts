import { Vector2 } from "../../math/Vector2"
import { Rect } from "../../math/Rect"
import { Matrix } from "../../math/Matrix"
import { Renderer } from "../../renderers/Renderer"
import { TetrisBoard } from "./TetrisBoard"
import {
	WallKickData,
	JLSTZ_WALL_KICK_DATA,
	I_WALL_KICK_DATA,
	O_WALL_KICK_DATA,
} from "./WallKickData"

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
	private _position: Vector2
	private orientation: number

	constructor(
		private board: TetrisBoard,
		private _shape: Matrix,
		private _color: number,
		private wallKickData: WallKickData,
		spawnArea: Rect
	) {
		_shape.mask = 0

		this._position = {
			x: Math.floor(spawnArea.x + spawnArea.width / 2 - this.size / 2),
			y: Math.floor(spawnArea.y + spawnArea.height / 2 - this.size / 2),
		}

		this.orientation = 0
	}

	get position() {
		return this._position
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

		return new Piece(board, shape, I_COLOR, I_WALL_KICK_DATA, spawnArea)
	}

	static createJ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0],
		])

		return new Piece(board, shape, J_COLOR, JLSTZ_WALL_KICK_DATA, spawnArea)
	}

	static createL(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		])

		return new Piece(board, shape, L_COLOR, JLSTZ_WALL_KICK_DATA, spawnArea)
	}

	static createO(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		])

		return new Piece(board, shape, O_COLOR, O_WALL_KICK_DATA, spawnArea)
	}

	static createS(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1],
		])

		return new Piece(board, shape, S_COLOR, JLSTZ_WALL_KICK_DATA, spawnArea)
	}

	static createT(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 1, 0],
			[0, 1, 1],
			[0, 1, 0],
		])

		return new Piece(board, shape, T_COLOR, JLSTZ_WALL_KICK_DATA, spawnArea)
	}

	static createZ(board: TetrisBoard, spawnArea: Rect) {
		const shape = Matrix.from2dArray([
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0],
		])

		return new Piece(board, shape, Z_COLOR, JLSTZ_WALL_KICK_DATA, spawnArea)
	}

	draw(renderer: Renderer, dstRect?: Rect) {
		renderer.copy({
			matrix: this.shape,
			offset: this.position,
			dstRect,
			tint: this.color,
		})
	}

	drawGhost(renderer: Renderer, dstRect?: Rect) {
		let ghostX = this.position.x

		while (this.isValidPosition({ x: ghostX - 1, y: this.position.y })) {
			--ghostX
		}

		renderer.copy({
			matrix: this.shape,
			offset: { x: ghostX, y: this.position.y },
			dstRect,
			tint: GHOST_COLOR,
		})
	}

	attemptMove(move: Vector2) {
		const newPosition = {
			x: this.position.x + move.x,
			y: this.position.y + move.y,
		}

		if (this.isValidPosition(newPosition)) {
			this._position = newPosition
			return true
		}

		return false
	}

	attemptClockwiseRotation() {
		const newOrientation = (this.orientation + 1) % 4

		this.attemptRotation(
			this.shape.rotateClockwise(),
			newOrientation,
			this.wallKickData.clockwise[newOrientation]
		)
	}

	attemptCounterClockwiseRotation() {
		const newOrientation = (this.orientation + 3) % 4

		this.attemptRotation(
			this.shape.rotateCounterClockwise(),
			newOrientation,
			this.wallKickData.counterClockwise[newOrientation]
		)
	}

	private attemptRotation(
		rotated: Matrix,
		newOrientation: number,
		wallKicks: Vector2[]
	) {
		for (const wallKick of wallKicks) {
			const newPosition = {
				x: this.position.x + wallKick.x,
				y: this.position.y + wallKick.y,
			}

			if (this.isValidPosition(newPosition, rotated)) {
				this._shape = rotated
				this._position = newPosition
				this.orientation = newOrientation
				return
			}
		}
	}

	private isValidPosition(position: Vector2, shape = this.shape) {
		for (let y = 0; y < shape.height; ++y) {
			for (let x = 0; x < shape.width; ++x) {
				const boardPosition = { x: x + position.x, y: y + position.y }
				if (shape.get(x, y) !== 0 && this.board.query(boardPosition)) {
					return false
				}
			}
		}

		return true
	}
}
