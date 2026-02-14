<template>
	<template v-if="popups.length">
		<div
			v-for="popup in popups"
			:key="popup.id"
			class="modal-wrapper overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
		>
			<div
				class="modal-backdrop"
				@click="closePopup(popup.id)"
			></div>

			<div class="modal-inner relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
				<!-- Modal header -->
				<div class="modal-header flex items-center justify-between gap-2 p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
					<button
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-hide="default-modal"
						type="button"
						@click="closePopup(popup.id)"
					>
						<SvgIcon name="ic24_close" />
					</button>
				</div>
				<div class="modal-body">
					<component
						:is="popup.component"
						v-bind="popup.props"
						@click="closePopup(popup.id)"
					/>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { usePopup } from '@hooks/usePopup'
import SvgIcon from '@components/Icons/SvgIcon.vue'

const { popups, closePopup } = usePopup()
</script>

<style lang="sass">
.modal-wrapper
  background-color: rgba(0, 0, 0, .3)
  height: 100%

  .modal-backdrop
    position: absolute
    width: 100%
    height: 100%

  .modal-inner
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    max-height: calc(100% - 44px)
    max-width: 600px
    width: 100%
    display: flex
    flex-direction: column
    padding: 14px

  .modal-header
    position: absolute
    right: 0
    top: 0

  .modal-body
    overflow-y: auto
    display: flex
    flex-direction: column
</style>
