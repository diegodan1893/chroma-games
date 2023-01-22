import { useEffect, useRef, useState } from "react"
import { Game } from "../../games/common/Game"
import { Chroma } from "../../chroma/Chroma"

type GameFactory = (chroma: Chroma) => Game

export const useGameLoader = (
	title: string,
	description: string,
	createGame: GameFactory
) => {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	const chroma = useRef<Chroma>()
	const game = useRef<Game>()

	useEffect(() => {
		const prepareGame = async () => {
			chroma.current = new Chroma()

			const success = await chroma.current.init({
				title: title,
				description: description,
				authorName: "Diego Iáñez Ávila",
				authorContact: "https://github.com/diegodan1893",
				supportedDevices: ["keyboard"],
				category: "game",
			})

			if (success) {
				game.current = createGame(chroma.current)
				game.current.startGame()
			} else {
				setError(true)
			}

			setLoading(false)
		}

		prepareGame()

		return () => {
			console.log("uninit")
			if (chroma.current) {
				chroma.current.uninitialize()
			}

			if (game.current) {
				game.current.stopGame()
			}
		}
	}, [title, description, createGame])

	return {
		loading,
		error,
	}
}
