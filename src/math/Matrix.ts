import { Vector2 } from "./Vector2"

export class Matrix {
	/**
	 * If set to a number, cells whose value equals to the mask won't be
	 * copied to other matrixes
	 */
	public mask: number | undefined

	private _data: number[][]

	constructor(
		private _width: number,
		private _height: number,
		private fillValue: number = 0
	) {
		this._data = new Array(_height)
			.fill(0)
			.map(() => new Array(_width).fill(fillValue))
	}

	/**
	 * Create a Matrix from raw data.
	 * @param data A 2 dimensional array with the matrix data.
	 * All rows MUST be of the same length.
	 * @param fillValue The value all elements will be set to when
	 * calling clear().
	 */
	static from2dArray(data: number[][], fillValue = 0) {
		const matrix = new Matrix(data[0].length, data.length, fillValue)
		matrix._data = data

		return matrix
	}

	get width() {
		return this._width
	}

	get height() {
		return this._height
	}

	get data() {
		return this._data
	}

	clear() {
		for (let y = 0; y < this._height; ++y) {
			for (let x = 0; x < this._width; ++x) {
				this._data[y][x] = this.fillValue
			}
		}
	}

	get(x: number, y: number) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			// Consider the matrix expands infinitely in all directions
			// with the fill value
			return this.fillValue
		}
		return this._data[y][x]
	}

	set(x: number, y: number, value: number) {
		this._data[y][x] = value
	}

	copy(matrix: Matrix, offset?: Vector2) {
		const copyOffset = offset ?? { x: 0, y: 0 }

		matrix._data.forEach((row, y) =>
			row.forEach((value, x) => {
				const destX = x + copyOffset.x
				const destY = y + copyOffset.y

				if (
					value !== matrix.mask &&
					destX < this.width &&
					destY < this.height
				) {
					this._data[destY][destX] = value
				}
			})
		)
	}
}
