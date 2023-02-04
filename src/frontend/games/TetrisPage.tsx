import { Chroma } from "../../renderers/Chroma"
import { GamePage } from "../common/GamePage"
import { KeyboardPrompt } from "../common/KeyboardPrompt"
import { SectionTitle } from "../common/SectionTitle"
import { TitleKeys } from "../common/TitleKeys"
import { useGameLoader } from "../hooks/useGameLoader"
import { TetrisBoard } from "../../games/tetris/TetrisBoard"

const PageTitle = () => {
	return (
		<div className="flex flex-col text-[0] text-left">
			<div>
				<TitleKeys className="text-tetris-i text-glow-tetris-i">
					R
				</TitleKeys>
				<TitleKeys className="text-tetris-s text-glow-tetris-s">
					AZ
				</TitleKeys>
				<TitleKeys className="text-tetris-t text-glow-tetris-t">
					E
				</TitleKeys>
				<TitleKeys className="text-tetris-l text-glow-tetris-l">
					R
				</TitleKeys>
			</div>
			<div>
				<TitleKeys className="text-tetris-s text-glow-tetris-s">
					TE
				</TitleKeys>
				<TitleKeys className="text-tetris-l text-glow-tetris-l">
					TRI
				</TitleKeys>
				<TitleKeys className="text-gray-800">S</TitleKeys>
			</div>
		</div>
	)
}

const PageBody = () => {
	return (
		<div className="flex flex-col justify-center space-y-5">
			<SectionTitle>Look at your keyboard</SectionTitle>
			<div className="flex flex-row justify-center items-end space-x-5 text-xs">
				<div className="flex flex-row space-x-5 mb-9">
					<div className="flex flex-col items-start space-y-1">
						<p>
							<KeyboardPrompt className="w-14">
								Tab →
							</KeyboardPrompt>{" "}
							Hold
						</p>
						<p>
							<KeyboardPrompt className="w-14">
								Shift
							</KeyboardPrompt>{" "}
							Rotate left
						</p>
						<p>
							<KeyboardPrompt className="w-14">
								Ctrl
							</KeyboardPrompt>{" "}
							Rotate right
						</p>
					</div>
					<div>
						Reset game <KeyboardPrompt>← Backspace</KeyboardPrompt>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<p className="mb-1 w-7">Move Up</p>
					<div>
						<KeyboardPrompt>⯅</KeyboardPrompt>
					</div>
					<div className="flex flex-row space-x-1 items-center">
						<span className="w-7">Soft Drop</span>
						<KeyboardPrompt>⯇</KeyboardPrompt>
						<KeyboardPrompt>⯆</KeyboardPrompt>
						<KeyboardPrompt>⯈</KeyboardPrompt>
						<span className="w-7">Hard Drop</span>
					</div>
					<p className="w-7">Move Down</p>
				</div>
			</div>
		</div>
	)
}

const createGame = (chroma: Chroma) => new TetrisBoard(chroma)

export const TetrisPage = () => {
	const { loading, error } = useGameLoader(
		"Razer Tetris",
		"Tetris for Razer Chroma Keyboards",
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
