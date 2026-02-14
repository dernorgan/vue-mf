<template>
	<canvas
		ref="canvas"
		:width="width"
		:height="height"
		style="width: 100%; height: auto; cursor: pointer"
		@click="seek"
		@mousedown="startSeeking"
	/>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
	audioElement: {
		type: Object,
		required: true,
	},
	width: {
		type: Number,
		default: 600,
	},
	height: {
		type: Number,
		default: 30,
	},
	progressBarColor: {
		type: String,
		default: '#2A9BA8',
	},
	progressBackgroundColor: {
		type: String,
		default: '#eee',
	},
	handleColor: {
		type: String,
		default: '#333',
	},
	showHandle: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits(['seek'])

const canvas = ref(null)
let ctx = null
let animationFrameId = null
let isSeeking = false

const draw = () => {
	if (!canvas.value || !props.audioElement) return

	const { duration, currentTime } = props.audioElement
	const progress = duration ? currentTime / duration : 0

	ctx.clearRect(0, 0, props.width, props.height)

	// Background
	ctx.fillStyle = props.progressBackgroundColor
	ctx.fillRect(0, 0, props.width, props.height)

	// Progress bar
	ctx.fillStyle = props.progressBarColor
	ctx.fillRect(0, 0, props.width * progress, props.height)

	// Handle (circle)
	if (props.showHandle) {
		ctx.beginPath()
		ctx.arc(props.width * progress, props.height / 2, 6, 0, Math.PI * 2)
		ctx.fillStyle = props.handleColor
		ctx.fill()
	}

	animationFrameId = requestAnimationFrame(draw)
}

const seek = (event) => {
	const rect = canvas.value.getBoundingClientRect()
	const offsetX = event.clientX - rect.left
	const percent = Math.max(0, Math.min(offsetX / rect.width, 1))
	emit('seek', percent)
}

const startSeeking = () => {
	isSeeking = true
	window.addEventListener('mousemove', onMouseMove)
	window.addEventListener('mouseup', stopSeeking)
}

const onMouseMove = (event) => {
	if (!isSeeking) return
	const rect = canvas.value.getBoundingClientRect()
	const offsetX = event.clientX - rect.left
	const percent = Math.max(0, Math.min(offsetX / rect.width, 1))
	emit('seek', percent)
}

const stopSeeking = () => {
	isSeeking = false
	window.removeEventListener('mousemove', onMouseMove)
	window.removeEventListener('mouseup', stopSeeking)
}

onMounted(() => {
	ctx = canvas.value.getContext('2d')
	draw()
})

onBeforeUnmount(() => {
	cancelAnimationFrame(animationFrameId)
	window.removeEventListener('mousemove', onMouseMove)
	window.removeEventListener('mouseup', stopSeeking)
})
</script>

<style scoped>
canvas {
	display: block;
}
</style>
