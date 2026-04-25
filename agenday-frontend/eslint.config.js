
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const firstLineBlankRule = {
	meta: {
		type: 'layout',
		fixable: 'whitespace',
		docs: {
			description:
				'The first line of each file must be a blank line, except for files with mandatory headers (<!DOCTYPE, shebang).',
		},
		schema: [],
		messages: {
			missingBlankLine: 'The first line of the file must be a blank line.',
		},
	},
	create(context) {
		return {
			Program(node) {
				const sourceCode = context.getSourceCode()
				const text = sourceCode.getText()

				const hasDoctype = /^\s*<!DOCTYPE/i.test(text)
				const hasShebang = /^#!/.test(text)
				if (hasDoctype || hasShebang) return

				const firstLine = text.split('\n')[0]
				if (firstLine.trim() !== '') {
					context.report({
						node,
						loc: { line: 1, column: 0 },
						messageId: 'missingBlankLine',
						fix(fixer) {
							return fixer.insertTextBefore(node, '\n')
						},
					})
				}
			},
		}
	},
}


const agendayPlugin = {
	meta: { name: 'agenday' },
	rules: {
		'first-line-blank': firstLineBlankRule,
	},
}

export default defineConfig([
	globalIgnores(['dist', 'node_modules', '*.config.{js,ts}', 'vite.config.*']),

	{
		files: ['**/*.{ts,tsx}'],

		plugins: {
			agenday: agendayPlugin,
			react,
		},

		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],

		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},

		settings: {
			react: {
				version: 'detect',
			},
		},

		rules: {

			'agenday/first-line-blank': 'error',


			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports' },
			],


			'react/no-danger': 'error',


			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',


			'no-restricted-globals': [
				'warn',
				{
					name: 'localStorage',
					message:
						'[Agenday] Tokens de auth NUNCA em localStorage. ' +
						'Para preferências de UI (tema, idioma), ignore com: // eslint-disable-next-line no-restricted-globals',
				},
				{
					name: 'sessionStorage',
					message:
						'[Agenday] Dados sensíveis não devem ir para sessionStorage. ' +
						'Para preferências de UI, ignore com: // eslint-disable-next-line no-restricted-globals',
				},
			],


			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			curly: ['error', 'all'],
			'object-shorthand': ['error', 'always'],
			'arrow-body-style': ['error', 'as-needed'],


			'sort-imports': [
				'warn',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
				},
			],
		},
	},


	{
		files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'no-console': 'off',
			'no-restricted-globals': 'off',
			'agenday/first-line-blank': 'off',
		},
	},
])
