import classNames from "classnames"
import { ReactNode } from "react"

interface KeyboardPromptProps {
	children: ReactNode
}

export const KeyboardPrompt = ({ children }: KeyboardPromptProps) => {
	return (
		<span
			className={classNames(
				"px-1.5",
				"py-1",
				"align-middle",
				"rounded-[4px]",
				"uppercase",
				"text-xs",
				"font-light",
				"bg-gray-800",
				"text-white"
			)}
		>
			{children}
		</span>
	)
}
