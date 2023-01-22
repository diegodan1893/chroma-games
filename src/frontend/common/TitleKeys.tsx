import classNames from "classnames"
import { ReactNode } from "react"

interface TitleKeysProps {
	className: string
	children: ReactNode
}

export const TitleKeys = ({ className, children }: TitleKeysProps) => {
	return (
		<span
			className={classNames(
				"text-4xl",
				"tracking-[.6em]",
				"font-thin",
				className
			)}
		>
			{children}
		</span>
	)
}
