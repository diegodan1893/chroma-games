/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin")

module.exports = {
	content: ["./{public,src}/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"razer-light-gray": "#888",
				"razer-mid-gray": "#222",
				"razer-dark-gray": "#111",
				"razer-green": "#44d62c",
			},
			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
			},
		},
	},
	plugins: [
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					"text-glow": (value) => ({
						textShadow: `0 0 25px ${value}, 0 0 25px ${value}, 0 0 25px ${value}`,
					}),
				},
				{ values: theme("colors") }
			)
		}),
	],
}
