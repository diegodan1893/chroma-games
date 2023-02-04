import classNames from "classnames"
import { ReactNode } from "react"

interface BasePageProps {
	titleComponent: ReactNode
	bodyComponent: ReactNode
}

export const BasePage = ({ titleComponent, bodyComponent }: BasePageProps) => {
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
					"py-10",
					"bg-razer-dark-gray"
				)}
			>
				{bodyComponent}
			</div>
		</div>
	)
}
