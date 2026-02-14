<template>
	<div class="picture">
		<picture>
			<source
				v-if="webpSrc"
				:srcset="webpSrc"
				type="image/webp"
			/>
			<img
				:src="src"
				:alt="alt"
				:width="width"
				:height="height"
				:loading="lazy ? 'lazy' : 'eager'"
				:class="imgClass"
			/>
		</picture>
	</div>
</template>

<script setup>
defineProps({
	src: {
		type: String,
		required: true,
	},
	webpSrc: {
		type: String,
		default: '',
	},
	alt: {
		type: String,
		default: '',
	},
	width: {
		type: [String, Number],
		default: null,
	},
	height: {
		type: [String, Number],
		default: null,
	},
	lazy: {
		type: Boolean,
		default: true,
	},
	imgClass: {
		type: String,
		default: '',
	},
})
</script>
