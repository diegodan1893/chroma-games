/**
 * Returns a random number in the range [start, end)
 */
export const randomInRange = (start: number, end: number): number => {
	return Math.random() * (end - start) + start
}
