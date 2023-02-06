import snakeIcon from "../../assets/snake.png"
import tetrisIcon from "../../assets/tetris.png"

import { Link } from "react-router-dom"
import { BasePage } from "../common/BasePage"
import { TitleKeys } from "../common/TitleKeys"
import classNames from "classnames"

const PageTitle = () => {
	return (
		<div className="flex text-[0]">
			<TitleKeys className="text-orange-600 text-glow-orange-600">
				CH
			</TitleKeys>
			<TitleKeys className="text-yellow-400 text-glow-yellow-400">
				RO
			</TitleKeys>
			<TitleKeys className="text-green-600 text-glow-green-600">
				MA
			</TitleKeys>
			<span className="w-5" />
			<TitleKeys className="text-cyan-500 text-glow-cyan-500">
				G
			</TitleKeys>
			<TitleKeys className="text-blue-500 text-glow-blue-500">
				AM
			</TitleKeys>
			<TitleKeys className="text-purple-400 text-glow-purple-400">
				ES
			</TitleKeys>
		</div>
	)
}

interface GameButtonProps {
	path: string
	title: string
	icon: string
}

const GameButton = ({ path, title, icon }: GameButtonProps) => {
	return (
		<Link
			to={path}
			className={classNames(
				"flex",
				"flex-col",
				"items-center",
				"space-y-3",
				"p-3",
				"rounded-xl",
				"transition-colors",
				"bg-black",
				"hover:bg-razer-mid-gray"
			)}
		>
			<img
				src={icon}
				width={128}
				height={128}
				className="rounded-lg bg-black"
			/>
			<p className="uppercase text-white">{title}</p>
		</Link>
	)
}

const PageBody = () => {
	return (
		<div className="flex flex-col space-y-10">
			<p>
				A collection of games to play on your Razer Chroma keyboard.
				<br />
				Play directly in the browser, no downloads required.
			</p>
			<div className="flex flex-row justify-center space-x-10">
				<GameButton path="/snake" title="Snake" icon={snakeIcon} />
				<GameButton path="/tetris" title="Tetris" icon={tetrisIcon} />
			</div>
			<a
				href="https://github.com/diegodan1893/chroma-games"
				className="link"
			>
				View Source Code {">"}
			</a>
			<p className="text-sm">This website is not affiliated with Razer</p>
		</div>
	)
}

export const GameMenu = () => {
	return (
		<BasePage titleComponent={<PageTitle />} bodyComponent={<PageBody />} />
	)
}
