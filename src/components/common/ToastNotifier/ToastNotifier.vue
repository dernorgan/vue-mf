<template>
	<div
		v-if="toasts?.length"
		class="toast-wrapper"
	>
		<template
			v-for="toast in toasts"
			:key="toast.id"
		>
			<div
				:class="['toast-notifier', toast.type, { show: toast.visible }]"
				class="flex gap-4 items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
				role="alert"
			>
				<div
					class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
				>
					<SvgIcon name="ic24_check" />
				</div>

				<SimpleText
					tag="div"
					class="text-sm font-normal"
				>
					{{ toast.message }}
				</SimpleText>
				<button
					type="button"
					class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
					data-dismiss-target="#toast-success"
					aria-label="Close"
					@click="handleRemoveToast(toast.id)"
				>
					<SvgIcon name="ic24_close" />
				</button>
			</div>
		</template>
	</div>
</template>

<script setup>
import SvgIcon from '@/components/Icons/SvgIcon.vue'
import SimpleText from '@/components/common/SimpleText/SimpleText.vue'

import { useToastStore } from '@stores'

const toastStore = useToastStore()
const toasts = toastStore.toasts

// Видалити конкретне повідомлення за допомогою методу з Pinia
const handleRemoveToast = (index) => {
	toastStore.removeToast(index)
}
</script>

<style scoped lang="sass">
.toast-wrapper
  position: fixed
  bottom: 0
  left: 50%
  transform: translateX(-50%)
  pointer-events: none
  z-index: 100

  .toast-notifier
    transition: transform .3s ease
    pointer-events: initial
    transform: translateY(50vh)
    margin-bottom: 16px

  .show
    transform: translateY(-24px)
</style>
