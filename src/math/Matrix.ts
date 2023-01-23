import { Vector2 } from "./Vector2"

export class Matrix {
	private _data: number[][]

	constructor(
		private width: number,
		private height: number,
		private fillValue: number = 0
	) {
		this._data = new Array(height)
			.fill(0)
			.map(() => new Array(width).fill(fillValue))
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

	get data() {
		return this._data
	}

	clear() {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				this._data[y][x] = this.fillValue
			}
		}
	}

	set(x: number, y: number, value: number) {
		this._data[y][x] = value
	}

	copy(matrix: Matrix, offset?: Vector2) {
		const copyOffset = offset ?? { x: 0, y: 0 }

		matrix._data.forEach((row, y) =>
			row.forEach(
				(value, x) =>
					(this._data[y + copyOffset.y][x + copyOffset.x] = value)
			)
		)
	}
}
