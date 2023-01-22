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

	copy(matrix: Matrix, offsetX = 0, offsetY = 0) {
		matrix._data.forEach((row, y) =>
			row.forEach(
				(value, x) => (this._data[y + offsetY][x + offsetX] = value)
			)
		)
	}
}
