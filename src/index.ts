import { Chroma } from "./chroma/Chroma"
import { SnakeBoard } from "./snake/SnakeBoard"

const main = async () => {
	const body = JSON.stringify({
		title: "Razer Snake",
		description: "Snake Game for Razer Chroma Keyboards",
		author: {
			name: "Diego Iáñez Ávila",
			contact: "https://github.com/diegodan1893",
		},
		device_supported: ["keyboard"],
		category: "game",
	})

	const chroma = new Chroma()
	const success = await chroma.init({
		title: "Razer Snake",
		description: "Snake Game for Razer Chroma Keyboards",
		authorName: "Diego Iáñez Ávila",
		authorContact: "https://github.com/diegodan1893",
		supportedDevices: ["keyboard"],
		category: "game",
	})

	if (success) {
		const snakeBoard = new SnakeBoard(chroma, 11, 4, 2, 1)
		snakeBoard.startGame()
	}
}

main()
