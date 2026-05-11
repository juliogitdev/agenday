
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
	globalIgnores(['dist', 'node_modules', '*.config.{js,ts}', 'vite.config.*']),

	{
		files: ['**/*.{ts,tsx}'],
		plugins: { react,},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			prettierConfig
		],

		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},

		settings: {
			react: { version: 'detect', },
		},

		rules: {
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
						'[Agenday] Auth Tokens NEVER in localStorage. ' +
						'For UI preferences (theme, language), ignore with: // eslint-disable-next-line no-restricted-globals',
				},
				{
					name: 'sessionStorage',
					message:
						'[Agendary] Sensitive data should not go to sessionStorage. ' +
						'For UI preferences, ignore with: // eslint-disable-next-line no-restricted-globals',
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
		},
	},
])
