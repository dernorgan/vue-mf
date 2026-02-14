<template>
	<component
		:is="componentData?.component"
		v-bind="componentData?.attributes"
		:class="['', variantClass, disabled ? 'opacity-50 cursor-not-allowed' : '']"
		@click="onClick"
	>
		<slot />
	</component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	variant: {
		type: String,
		default: 'primary', // варианты: primary, secondary, danger
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		default: 'button',
		validator: (value) => ['button', 'submit', 'reset'].includes(value),
	},
	href: {
		type: String,
		default: '',
	},
})

const emit = defineEmits(['click'])

function onClick(event) {
	if (!props.disabled) {
		emit('click', event)
	}
}

const variantClass = computed(() => {
	switch (props.variant) {
		case 'secondary':
			return 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'
		case 'danger':
			return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
		case 'primary':
		default:
			return 'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
	}
})

const componentData = computed(() => {
	if (props.href)
		return {
			component: 'a',
			attributes: {
				href: props.href,
			},
		}
	else
		return {
			component: 'button',
			attributes: {
				type: props.type,
			},
		}
})
</script>
