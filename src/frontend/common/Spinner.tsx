export const Spinner = () => {
	return (
		<span className="flex h-10 w-10 relative">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-razer-green opacity-75"></span>
			<span className="relative inline-flex rounded-full h-10 w-10 bg-razer-green"></span>
		</span>
	)
}
