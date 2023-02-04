/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin")
const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")

module.exports = {
	content: ["./{public,src}/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"razer-light-gray": "#888",
				"razer-mid-gray": "#222",
				"razer-dark-gray": "#111",
				"razer-green": "#44d62c",
				"tetris-l": "#ff3300",
				"tetris-s": "#00ff00",
				"tetris-t": "#9900ff",
				"tetris-i": "#00ffff",
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
				{ values: flattenColorPalette(theme("colors")) }
			)
		}),
	],
}
