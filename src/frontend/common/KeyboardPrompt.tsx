import classNames from "classnames"
import { ReactNode } from "react"

interface KeyboardPromptProps {
	className?: string
	children: ReactNode
}

export const KeyboardPrompt = ({
	className,
	children,
}: KeyboardPromptProps) => {
	return (
		<span
			className={classNames(
				"inline-block",
				"px-1.5",
				"py-1",
				"align-middle",
				"rounded-[4px]",
				"uppercase",
				"text-xs",
				"font-light",
				"bg-gray-500",
				"text-white",
				className
			)}
		>
			{children}
		</span>
	)
}
