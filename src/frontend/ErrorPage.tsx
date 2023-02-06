import { Link } from "react-router-dom"
import { BasePage } from "./common/BasePage"
import { TitleKeys } from "./common/TitleKeys"

const PageTitle = () => {
	return (
		<TitleKeys className="text-red-400 text-glow-red-400">
			PAGE NOT FOUND
		</TitleKeys>
	)
}

const PageBody = () => {
	return (
		<>
			<p className="mb-10">
				The page you are trying to visit does not exist
			</p>
			<Link to="/" className="link">
				Return to the Main Menu {">"}
			</Link>
		</>
	)
}

export const ErrorPage = () => {
	return (
		<BasePage titleComponent={<PageTitle />} bodyComponent={<PageBody />} />
	)
}
