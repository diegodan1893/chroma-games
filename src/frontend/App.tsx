import "./main.css"

import { createHashRouter, RouterProvider } from "react-router-dom"
import { SnakePage } from "./games/SnakePage"
import { TetrisPage } from "./games/TetrisPage"
import { GameMenu } from "./games/GameMenu"

const router = createHashRouter([
	{
		path: "/",
		element: <GameMenu />,
	},
	{
		path: "/snake",
		element: <SnakePage />,
	},
	{
		path: "/tetris",
		element: <TetrisPage />,
	},
])

export const App = () => {
	return <RouterProvider router={router} />
}
