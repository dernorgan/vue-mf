<template>
	<AVWaveform
		canv-fill-color="#00AAFF"
		:playtime-line-width="0.8"
		:canv-height="120"
		:canv-width="600"
		playtime-line-color="#ABC123"
		:noplayed-line-width="1"
		noplayed-line-color="#808080"
		:playtime="true"
		:playtime-with-ms="true"
		:playtime-font-size="14"
		playtime-font-family="monaco"
		playtime-font-color="#00f"
		playtime-text-bottom
		:playtime-slider="true"
		playtime-slider-color="#fafafa"
		:playtime-slider-width="2.5"
		:playtime-clickable="true"
		:src="src"
	/>
</template>

<script setup>
import { AVWaveform } from 'vue-audio-visual'

defineProps({
	src: {
		type: String,
		required: true,
	},
})
</script>
