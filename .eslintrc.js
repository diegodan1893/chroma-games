module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	overrides: [],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react", "react-hooks", "@typescript-eslint"],
	ignorePatterns: ["/*", "!/src"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/no-empty-function": "off",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
}
