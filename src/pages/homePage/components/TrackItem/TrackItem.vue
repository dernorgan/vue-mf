<template>
	<div class="flex items-start gap-4">
		<AdvancedImage
			:src="data?.picture ? data?.picture : '/default.jpg'"
			:alt="data?.name"
			width="600"
			height="400"
			:lazy="true"
		/>
		<div class="flex flex-col gap-2">
			<div
				v-if="data?.name"
				class="flex items-center gap-3"
			>
				<button @click="toggleAudio">
					<SvgIcon
						:name="isPlayingRef ? 'ic24_pause' : 'ic24_play'"
						class="text-cyan-600"
					/>
				</button>

				<button @click="stopTrack">
					<SvgIcon
						name="ic24_stop"
						class="text-cyan-600"
					/>
				</button>

				<button @click="copyText(`${data?.url}`)">
					<SvgIcon
						name="ic24_copy"
						class="text-cyan-600"
					/>
				</button>
				<div>
					{{ data?.name }}
				</div>
			</div>
			<AudioVisualizer
				:audio-src="`../../../../assets/music/${data?.track}`"
				:width="800"
				:height="180"
				:progress-height="15"
				:bar-color="barColor"
				:stop-track="stopTrackRef"
				:is-playing="isPlayingRef"
				@update:is-playing="(val) => (isPlayingRef = val)"
			>
				<template
					#default="{
						analyser,
						dataArray,
						audioElement,
						width,
						height,
						progressHeight,
					}"
				>
					<WaveformVisualizer
						:analyser="analyser"
						:data-array="dataArray"
						:width="width"
						:height="height"
						:bar-color="barColor"
						visualization-type="bars"
					/>
					<ProgressBar
						:audio-element="audioElement"
						:width="width"
						:height="progressHeight"
						progress-bar-color="#2A9BA8"
						progress-background-color="#eee"
						handle-color="#333"
						:show-handle="false"
						@seek="
							(percent) => {
								audioElement.currentTime = percent * audioElement.duration
							}
						"
					/>
				</template>
			</AudioVisualizer>
		</div>
	</div>
</template>

<script setup>
import SvgIcon from '@/components/Icons/SvgIcon.vue'
import AdvancedImage from '@/components/common/AdvancedImage/AdvancedImage.vue'
import AudioVisualizer from '@/components/common/AudioVisualizer/AudioVisualizer.vue'
import WaveformVisualizer from '@/components/common/AudioVisualizer/WaveformVisualizer/WaveformVisualizer.vue'
import ProgressBar from '@/components/common/AudioVisualizer/ProgressBar/ProgressBar.vue'
import { ref, watch } from 'vue'

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(['update:activeTrack'])

const isPlayingRef = ref(false)
const stopTrackRef = ref(false)

const toggleAudio = () => {
	isPlayingRef.value = !isPlayingRef.value
	stopTrackRef.value = false
	emit('update:activeTrack', { id: props.data?.id })
}

const copyText = async (value) => {
	try {
		await navigator.clipboard.writeText(value)
	} catch (err) {
		console.error('Помилка копіювання:', err)
	}
}

const stopTrack = () => {
	stopTrackRef.value = true
}

const barColor = (barHeight) => `rgb(0, ${barHeight + 50}, 200)`

watch(
	() => props.data?.activeTrack,
	(newVal) => {
		if (newVal !== props.data?.id) {
			isPlayingRef.value = false
		}
	},
)
</script>
<style lang="sass" scoped>
.picture
  max-width: 300px

button
  &:hover
    svg
      transform: scale(1.1)

  svg
    transition: transform .3s ease-out
</style>
