const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const tsplugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = defineConfig([
    js.configs.recommended,
	{
		languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                browser: "readonly",

            },
        },
		plugins: {"@typescript-eslint": tsplugin},
		rules: {
			...tsplugin.configs.recommended.rules,
		},
        
	},
]);