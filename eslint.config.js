import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
	{
		name: 'app/files-to-lint',
		files: ['**/*.{js,mjs,jsx,vue}'],
	},

	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},

	js.configs.recommended,
	...pluginVue.configs['flat/recommended'],
	skipFormatting,

	{
		files: ['**/*.vue'],
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					trailingComma: 'all',
					bracketSpacing: true,
					printWidth: 80,
				},
			],
			'vue/multi-word-component-names': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/multiline-html-element-content-newline': 'off',
			'vue/html-closing-bracket-newline': [
				'error',
				{
					singleline: 'never',
					multiline: 'always',
				},
			],
			// Форматування об’єктів через ESLint:
			'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
			'object-curly-newline': [
				'error',
				{
					ObjectPattern: { multiline: true, consistent: true },
					ObjectExpression: { multiline: true, consistent: true },
				},
			],
			'comma-dangle': ['error', 'always-multiline'],
			quotes: ['error', 'single'],
		},
	},
])
