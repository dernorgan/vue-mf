<template>
	<div>
		<audio
			ref="audioElement"
			:src="audioSrc"
			:loop="loop"
			preload="metadata"
			crossorigin="anonymous"
		></audio>
		<slot
			v-if="audioContext && analyser && dataArray"
			:audio-context="audioContext"
			:analyser="analyser"
			:data-array="dataArray"
			:audio-element="audioElement"
			:width="width"
			:height="height"
			:progress-height="progressHeight"
			:bar-color="barColor"
		/>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useDeviceStore } from '@stores/modules/device.js'

const device = useDeviceStore()
const props = defineProps({
	audioSrc: {
		type: String,
		required: true,
	},
	width: {
		type: Number,
		default: 800,
	},
	height: {
		type: Number,
		default: 180,
	},
	progressHeight: {
		type: Number,
		default: 25,
	},
	barColor: {
		type: [String, Function],
		default: '#2A9BA8',
	},
	loop: {
		type: Boolean,
		default: false,
	},
	isPlaying: Boolean,
	stopTrack: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['update:isPlaying'])

const audioElement = ref(null)
const audioContext = ref(null)
const analyser = ref(null)
const dataArray = ref(null)
const source = ref(null)

const resetAudio = () => {
	audioElement.value.pause()
	audioElement.value.currentTime = 0
}

function handleStopTrack() {
	if (audioElement.value) {
		resetAudio()
	}
}

watch(
	() => props.isPlaying,
	(val) => {
		if (!audioElement.value) return
		if (val) {
			audioElement.value.play()
		} else {
			audioElement.value.pause()
		}
	},
)

watch(
	() => props.stopTrack,
	() => {
		if (props.stopTrack) handleStopTrack()
	},
)

onMounted(() => {
	const audio = audioElement.value

	// Не створюйте AudioContext одразу!
	const initAudio = () => {
		if (!audioContext.value) {
			audioContext.value = new AudioContext()
			source.value = audioContext.value.createMediaElementSource(audio)
			analyser.value = audioContext.value.createAnalyser()
			analyser.value.fftSize = device?.device === 'desktop' ? 256 : 128
			const bufferLength = analyser.value.frequencyBinCount
			dataArray.value = new Uint8Array(bufferLength)

			source.value.connect(analyser.value)
			analyser.value.connect(audioContext.value.destination)
		}
	}

	audio.addEventListener('play', async () => {
		await audioContext.value.resume() // Обов'язково
		emit('update:isPlaying', true)
	})

	audio.addEventListener('pause', () => emit('update:isPlaying', false))
	audio.addEventListener('ended', () => {
		resetAudio()
		emit('update:isPlaying', false)
	})

	// Наприклад, тут ініціалізуйте після кліку
	document.addEventListener('click', initAudio, { once: true })
})
onUnmounted(() => {
	if (audioContext.value) {
		audioContext.value.close()
	}
})
</script>
