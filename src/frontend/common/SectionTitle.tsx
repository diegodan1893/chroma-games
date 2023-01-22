import { ReactNode } from "react"

interface SectionTitleProps {
	children: ReactNode
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
	return (
		<h1 className="font-light text-3xl text-white uppercase">{children}</h1>
	)
}
