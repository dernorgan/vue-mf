/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			boxShadow: {
				custom: '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F',
				'shadow-x': '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F',
			},
			colors: {
				'test-primary': 'var(--dangerColor)',
			},
		},
	},
	plugins: [],
}
