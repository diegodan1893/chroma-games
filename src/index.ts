import { Chroma } from "./chroma/Chroma"
import { SnakeBoard } from "./snake/SnakeBoard"

import "./main.css"

const toggleVisibility = (element: HTMLElement | null, visible: boolean) => {
	if (!element) {
		return
	}

	if (visible) {
		element.classList.remove("hidden")
		element.classList.add("flex")
	} else {
		element.classList.remove("flex")
		element.classList.add("hidden")
	}
}

const main = async () => {
	const loadingCard = document.getElementById("loading")
	const playingCard = document.getElementById("playing")
	const errorCard = document.getElementById("error")

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

	toggleVisibility(loadingCard, false)

	if (success) {
		const snakeBoard = new SnakeBoard(chroma, 11, 4, 2, 1)
		snakeBoard.startGame()

		toggleVisibility(playingCard, true)
	} else {
		toggleVisibility(errorCard, true)
	}
}

main()
