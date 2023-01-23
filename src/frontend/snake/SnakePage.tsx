import { Chroma } from "../../renderers/Chroma"
import { SnakeBoard } from "../../games/snake/SnakeBoard"
import { GamePage } from "../common/GamePage"
import { KeyboardPrompt } from "../common/KeyboardPrompt"
import { SectionTitle } from "../common/SectionTitle"
import { TitleKeys } from "../common/TitleKeys"
import { useGameLoader } from "../hooks/useGameLoader"

const PageTitle = () => {
	return (
		<div className="flex text-[0]">
			<TitleKeys className="text-razer-green text-glow-razer-green">
				RAZER
			</TitleKeys>
			<TitleKeys className="text-gray-800">SNA</TitleKeys>
			<TitleKeys className="text-white text-glow-white">K</TitleKeys>
			<TitleKeys className="text-gray-800">E</TitleKeys>
		</div>
	)
}

const PageBody = () => {
	return (
		<div className="flex flex-col justify-center space-y-5">
			<SectionTitle>Look at your keyboard</SectionTitle>
			<ul>
				<li>
					Use <KeyboardPrompt>⯅</KeyboardPrompt>{" "}
					<KeyboardPrompt>⯇</KeyboardPrompt>{" "}
					<KeyboardPrompt>⯆</KeyboardPrompt>{" "}
					<KeyboardPrompt>⯈</KeyboardPrompt> to move the snake
				</li>
				<li>
					Reset the game with{" "}
					<KeyboardPrompt>← Backspace</KeyboardPrompt>
				</li>
			</ul>
		</div>
	)
}

const createGame = (chroma: Chroma) => new SnakeBoard(chroma)

export const SnakePage = () => {
	const { loading, error } = useGameLoader(
		"Razer Snake",
		"Snake Game for Razer Chroma Keyboards",
		createGame
	)

	return (
		<GamePage
			titleComponent={<PageTitle />}
			bodyComponent={<PageBody />}
			loading={loading}
			error={error}
		/>
	)
}
