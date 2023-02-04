/**
 * Returns a random number in the range [start, end)
 */
export const randomInRange = (start: number, end: number): number => {
	return Math.random() * (end - start) + start
}

export const shuffle = <T>(array: T[]) => {
	const shuffled: T[] = array.slice()

	for (let i = 0; i < shuffled.length; ++i) {
		const j = Math.floor(randomInRange(i, shuffled.length))
		const temp = shuffled[i]
		shuffled[i] = shuffled[j]
		shuffled[j] = temp
	}

	return shuffled
}
