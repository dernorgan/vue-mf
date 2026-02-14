import { defineStore } from 'pinia'
import { UAParser } from 'ua-parser-js'

export const useDeviceStore = defineStore('device', {
	state: () => ({
		device: null,
		browser: null,
		os: null,
	}),

	actions: {
		detectDevice() {
			const parser = new UAParser()
			const result = parser.getResult()

			this.device = result.device.type || 'desktop'
			this.browser = result.browser.name || 'browser not defined'
			this.os = result.os.name || 'os not defined'

			document.documentElement.setAttribute('device', this.device)
		},
	},
})
