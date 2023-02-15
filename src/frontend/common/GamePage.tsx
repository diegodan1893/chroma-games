import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { BasePage } from "./BasePage"
import { Spinner } from "./Spinner"

interface PageBodyProps {
	bodyComponent: ReactNode
	loading?: boolean
	error?: boolean
}

const PageBody = ({ bodyComponent, loading, error }: PageBodyProps) => {
	return (
		<>
			<div className="flex flex-col h-60 justify-center space-y-5">
				{loading ? (
					<Spinner />
				) : error ? (
					<>
						<p>
							We were unable to start a connection with Razer
							Synapse
							<br />
							Make sure Razer Synapse is installed and running and
							try again
						</p>
						<p>
							Brave and some ad blockers can block connections to
							Synapse, you may need to disable tracking protection
						</p>
					</>
				) : (
					bodyComponent
				)}
			</div>
			<div className="flex flex-row space-x-16">
				<Link to="/" className="link">
					More Games {">"}
				</Link>
				<a
					href="https://github.com/diegodan1893/chroma-games"
					className="link"
				>
					View Source Code {">"}
				</a>
			</div>
		</>
	)
}

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
		<BasePage
			titleComponent={titleComponent}
			bodyComponent={
				<PageBody
					bodyComponent={bodyComponent}
					loading={loading}
					error={error}
				/>
			}
		/>
	)
}
