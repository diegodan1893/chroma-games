export const filledMatrix = (
	width: number,
	height: number,
	fillValue: number
): number[][] => {
	return new Array(height).fill(0).map(() => new Array(width).fill(fillValue))
}
