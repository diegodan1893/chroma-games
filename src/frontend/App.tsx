import "./main.css"

import { createHashRouter, RouterProvider } from "react-router-dom"
import { SnakePage } from "./games/SnakePage"
import { TetrisPage } from "./games/TetrisPage"
import { GameMenu } from "./games/GameMenu"
import { ErrorPage } from "./ErrorPage"

const router = createHashRouter([
	{
		path: "/",
		element: <GameMenu />,
		errorElement: <ErrorPage />,
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
