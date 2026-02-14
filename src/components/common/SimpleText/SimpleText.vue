<template>
	<component
		:is="tag"
		v-bind="$attrs"
	>
		<slot></slot>
	</component>
</template>

<script setup>
defineProps({
	tag: {
		type: String,
		default: 'p',
	},
})
</script>
