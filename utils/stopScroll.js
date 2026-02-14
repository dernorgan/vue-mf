export const disableHtmlScroll = () => {
	document.documentElement.className = 'stop-scroll'
}

export const enableHtmlScroll = () => {
	document.documentElement.classList.remove('stop-scroll')
}
