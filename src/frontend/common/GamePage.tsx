import classNames from "classnames"
import { ReactNode } from "react"
import { Spinner } from "./Spinner"

interface GamePageProps {
	titleComponent: ReactNode
	bodyComponent: ReactNode
	loading?: boolean
	error?: boolean
}

export const GamePage = ({
	titleComponent,
	bodyComponent,
	loading,
	error,
}: GamePageProps) => {
	return (
		<div
			className={classNames(
				"flex",
				"flex-col",
				"min-h-screen",
				"min-w-screen",
				"justify-center",
				"text-razer-light-gray",
				"font-roboto",
				"text-lg",
				"font-normal",
				"text-center"
			)}
		>
			<div
				className={classNames(
					"flex",
					"flex-1",
					"justify-center",
					"items-end",
					"py-10",
					"bg-black"
				)}
			>
				{titleComponent}
			</div>
			<div
				className={classNames(
					"flex",
					"flex-1",
					"flex-col",
					"items-center",
					"h-48",
					"py-10",
					"bg-razer-dark-gray"
				)}
			>
				<div className="flex h-60 items-center">
					{loading ? (
						<Spinner />
					) : error ? (
						<p>
							We were unable to start a connection with Razer
							Synapse
							<br />
							Make sure Razer Synapse is installed and running and
							try again
						</p>
					) : (
						bodyComponent
					)}
				</div>
				<a
					href="https://github.com/diegodan1893/razer-snake"
					className="link"
				>
					View Source Code {">"}
				</a>
			</div>
		</div>
	)
}
