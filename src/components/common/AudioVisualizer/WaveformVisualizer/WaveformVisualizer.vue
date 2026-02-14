<template>
	<canvas
		ref="canvas"
		:width="width"
		:height="height"
		style="width: 100%; height: auto"
	></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
	analyser: {
		type: Object,
		required: true,
	},
	dataArray: {
		type: Uint8Array,
		required: true,
	},
	width: {
		type: Number,
		required: true,
	},
	height: {
		type: Number,
		required: true,
	},
	barColor: {
		type: Function,
		default: (barHeight) => `rgb(${barHeight + 100}, 100, 150)`,
	},
	visualizationType: {
		type: String,
		default: 'bars',
		validator: (val) => ['bars', 'wave'].includes(val),
	},
})

const canvas = ref(null)
let animationId = null

const draw = () => {
	const ctx = canvas.value.getContext('2d')
	const bufferLength = props.analyser.frequencyBinCount
	const barWidth = props.width / bufferLength
	const sliceWidth = props.width / bufferLength

	const renderFrame = () => {
		animationId = requestAnimationFrame(renderFrame)
		props.analyser.getByteFrequencyData(props.dataArray)
		ctx.clearRect(0, 0, props.width, props.height)

		if (props.visualizationType === 'bars') {
			let x = 0
			for (let i = 0; i < bufferLength; i++) {
				const barHeight = props.dataArray[i]
				ctx.fillStyle = props.barColor(barHeight, i)
				ctx.fillRect(
					x,
					props.height - barHeight / 2,
					barWidth - 1,
					barHeight / 2,
				)
				x += barWidth
			}
		} else if (props.visualizationType === 'wave') {
			ctx.beginPath()
			ctx.lineWidth = 2
			ctx.strokeStyle = props.barColor(128, 0)
			let x = 0
			for (let i = 0; i < bufferLength; i++) {
				const v = props.dataArray[i] / 255.0
				const y = v * props.height
				if (i === 0) ctx.moveTo(x, y)
				else ctx.lineTo(x, y)
				x += sliceWidth
			}
			ctx.stroke()
		}
	}

	renderFrame()
}

watch(() => props.width, draw)
watch(() => props.height, draw)

onMounted(draw)

onBeforeUnmount(() => {
	if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
canvas {
	display: block;
	max-width: 100%;
}
</style>
