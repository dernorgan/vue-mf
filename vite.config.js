import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), svgLoader()],
	resolve: {
		alias: {
			'@components': fileURLToPath(
				new URL('./src/components', import.meta.url),
			),
			'@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
			'@styles': fileURLToPath(new URL('./src/assets/style/', import.meta.url)),
			'@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
			'@hooks': fileURLToPath(new URL('./hooks', import.meta.url)),
			'@utils': fileURLToPath(new URL('./utils', import.meta.url)),
			'@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
