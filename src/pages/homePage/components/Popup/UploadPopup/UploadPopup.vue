<template>
	<SimpleText
		tag="h3"
		class="text-xl font-semibold text-gray-900 dark:text-white mb-5"
	>
		Завантаження треків
	</SimpleText>
	<UploadFile />

	<BaseButton
		variant="primary"
		type="button"
		class="mt-6"
	>
		Завершити
	</BaseButton>
</template>

<script setup>
import UploadFile from '@components/common/UploadFile/UploadFile.vue'
import SimpleText from '@components/common/SimpleText/SimpleText.vue'
import BaseButton from '@components/common/BaseButton/BaseButton.vue'
</script>

<style scoped lang="sass"></style>
