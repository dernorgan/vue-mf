<template>
	<div>
		<audio
			ref="audio"
			controls
			preload="metadata"
			:src="audioSrc"
			:loop="loop"
			crossorigin="anonymous"
		></audio>

		<canvas
			ref="canvas"
			:width="canvasWidth"
			:height="canvasHeight"
			style="width: 100%; height: auto"
		></canvas>

		<canvas
			ref="progressCanvas"
			:width="canvasWidth"
			:height="progressHeight"
			style="width: 100%; height: auto; margin-top: 10px"
			@click="seekAudio"
			@mousedown="handleSeekStart"
		></canvas>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
	audioSrc: {
		type: String,
		required: true,
	},
	width: {
		type: Number,
		default: 600,
	}, // базова ширина canvas
	height: {
		type: Number,
		default: 200,
	}, // висота для візуалізації
	progressHeight: {
		type: Number,
		default: 30,
	}, // висота прогрес-бару
	barColor: {
		type: Function,
		default: (barHeight) => `rgb(${barHeight + 100}, 100, 150)`,
	},
	isPlaying: {
		type: Boolean,
		default: false,
	},
	loop: {
		type: Boolean,
		default: false,
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
	visualizationType: {
		type: String,
		default: 'bars', // або "wave"
		validator: (val) => ['bars', 'wave'].includes(val),
	},
})

const emit = defineEmits(['update:isPlaying'])

const audio = ref(null)
const canvas = ref(null)
const progressCanvas = ref(null)
const isPlayingLocal = ref(false)

let audioContext = null
let analyser = null
let source = null
let dataArray = null
let animationId = null
let isSeeking = false

// Локальні реактивні ширина та висота canvas
const canvasWidth = ref(props.width)
const canvasHeight = ref(props.height)

watch(
	() => props.width,
	(val) => {
		canvasWidth.value = val
		updateCanvasSizes()
	},
)
watch(
	() => props.height,
	(val) => {
		canvasHeight.value = val
		updateCanvasSizes()
	},
)
watch(
	() => props.progressHeight,
	() => {
		updateCanvasSizes()
	},
)

function updateCanvasSizes() {
	if (canvas.value) {
		canvas.value.width = canvasWidth.value
		canvas.value.height = canvasHeight.value
	}
	if (progressCanvas.value) {
		progressCanvas.value.width = canvasWidth.value
		progressCanvas.value.height = props.progressHeight
	}
	drawProgress()
	if (animationId) draw()
}

const clearCanvas = () => {
	const ctx = canvas.value?.getContext('2d')
	if (ctx) ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

const stopDrawing = () => {
	if (animationId) cancelAnimationFrame(animationId)
	animationId = null
	clearCanvas()
}

const draw = () => {
	const ctx = canvas.value.getContext('2d')
	const bufferLength = analyser.frequencyBinCount

	const barWidth = canvasWidth.value / bufferLength

	const renderFrame = () => {
		animationId = requestAnimationFrame(renderFrame)
		analyser.getByteFrequencyData(dataArray)
		ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

		if (props.visualizationType === 'bars') {
			let x = 0
			for (let i = 0; i < bufferLength; i++) {
				const barHeight = dataArray[i]
				ctx.fillStyle = props.barColor(barHeight, i)
				ctx.fillRect(
					x,
					canvasHeight.value - barHeight / 2,
					barWidth - 1,
					barHeight / 2,
				)
				x += barWidth
			}
		} else if (props.visualizationType === 'wave') {
			ctx.beginPath()
			ctx.lineWidth = 2
			ctx.strokeStyle = props.barColor(128, 0)
			const sliceWidth = canvasWidth.value / bufferLength
			let x = 0
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 255.0
				const y = v * canvasHeight.value
				if (i === 0) ctx.moveTo(x, y)
				else ctx.lineTo(x, y)
				x += sliceWidth
			}
			ctx.stroke()
		}

		drawProgress()
	}

	renderFrame()
}

const drawProgress = () => {
	if (!progressCanvas.value) return
	const ctx = progressCanvas.value.getContext('2d')
	const duration = audio.value?.duration || 0
	const currentTime = audio.value?.currentTime || 0
	const progress = duration ? currentTime / duration : 0

	ctx.clearRect(0, 0, canvasWidth.value, props.progressHeight)

	ctx.fillStyle = props.progressBackgroundColor
	ctx.fillRect(0, 0, canvasWidth.value, props.progressHeight)

	ctx.fillStyle = props.progressBarColor
	ctx.fillRect(0, 0, canvasWidth.value * progress, props.progressHeight)

	// Кружок-повзунок
	ctx.beginPath()
	ctx.arc(
		canvasWidth.value * progress,
		props.progressHeight / 2,
		6,
		0,
		Math.PI * 2,
	)
	ctx.fillStyle = props.handleColor
	ctx.fill()
}

const seekAudio = (event) => {
	const rect = progressCanvas.value.getBoundingClientRect()
	const offsetX = event.clientX - rect.left
	const percent = Math.min(Math.max(offsetX / rect.width, 0), 1)
	const duration = audio.value.duration
	if (!isNaN(duration)) {
		audio.value.currentTime = percent * duration
		drawProgress()
	}
}

const handleSeekStart = () => {
	isSeeking = true
	window.addEventListener('mousemove', handleSeekMove)
	window.addEventListener('mouseup', handleSeekEnd)
}

const handleSeekMove = (event) => {
	if (!isSeeking) return
	const rect = progressCanvas.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const percent = Math.max(0, Math.min(x / rect.width, 1))
	const duration = audio.value.duration
	if (!isNaN(duration)) {
		audio.value.currentTime = percent * duration
		drawProgress()
	}
}

const handleSeekEnd = () => {
	isSeeking = false
	window.removeEventListener('mousemove', handleSeekMove)
	window.removeEventListener('mouseup', handleSeekEnd)
}

const startAudio = () => {
	if (!audioContext) {
		audioContext = new AudioContext()
		source = audioContext.createMediaElementSource(audio.value)
		analyser = audioContext.createAnalyser()
		analyser.fftSize = 256

		source.connect(analyser)
		analyser.connect(audioContext.destination)

		const bufferLength = analyser.frequencyBinCount
		dataArray = new Uint8Array(bufferLength)
	}

	audioContext.resume()
	draw()
}

const toggleAudio = async () => {
	if (!audioContext) startAudio()
	await audioContext.resume()

	if (props.isPlaying) {
		audio.value.play()
		draw()
	} else {
		audio.value.pause()
		stopDrawing()
	}
}

watch(
	() => props.isPlaying,
	() => {
		isPlayingLocal.value = props.isPlaying
		toggleAudio()
	},
)

onMounted(() => {
	updateCanvasSizes()

	drawProgress()

	audio.value.addEventListener('timeupdate', drawProgress)

	audio.value.addEventListener('ended', () => {
		if (!props.loop) stopDrawing()
		isPlayingLocal.value = false
		emit('update:isPlaying', false)
	})
})

onBeforeUnmount(() => {
	stopDrawing()
	if (audioContext) audioContext.close()
})
</script>

<style lang="sass">
canvas
  max-width: 100%
  display: block
</style>
