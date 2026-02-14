<template>
	<div class="flex items-center justify-center w-full">
		<label
			for="dropzone-file"
			class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
			@dragover.prevent
			@drop.prevent="uploadFiles"
		>
			<div class="flex flex-col items-center justify-center pt-5 pb-6">
				<SvgIcon
					name="ic24_upload"
					class="text-gray-500 dark:text-gray-400"
				/>
				<SimpleText
					class="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"
				>
					<SimpleText class="font-semibold">
						Натисніть, щоб завантажити
					</SimpleText>
					або перетягніть, файл в форматі .mp3
				</SimpleText>
				<!--        <SimpleText class="text-xs text-gray-500 dark:text-gray-400">-->
				<!--          SVG, PNG, JPG or GIF (MAX. 800x400px)-->
				<!--         -->
				<!--        </SimpleText>-->
			</div>
			<input
				id="dropzone-file"
				name="files"
				type="file"
				multiple
				class="hidden"
				accept=".mp3,audio/mpeg"
				@change="uploadFiles"
			/>
		</label>
	</div>

	<!--  <button @click="toast.showToast({message: 'Файли успішно завантажено!'})"> Button</button>-->
</template>

<script setup>
import SvgIcon from '@/components/Icons/SvgIcon.vue'
import SimpleText from '@/components/common/SimpleText/SimpleText.vue'
import { ref } from 'vue'

import { useToastStore } from '@stores'

const toast = useToastStore()

const backend = !import.meta.env.DEV
	? import.meta.env.VITE_API_URL
	: import.meta.env.VITE_API_URL_DEV
const files = ref([])

const uploadFiles = async (event) => {
	if (event?.type === 'change') {
		files.value = [...event.target.files]
	}
	if (event?.type === 'drop') {
		files.value = [...files.value, ...event.dataTransfer.files]
	}
	if (!files.value.length) return

	const formData = new FormData()
	for (const file of files.value) {
		formData.append('files', file)
	}

	try {
		const response = await fetch(`${backend}/upload-music`, {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			const error = await response.json()
			alert('Помилка завантаження: ' + (error.error || response.statusText))
			return
		}

		await response.json()
		toast.showToast({ message: 'Файли успішно завантажено!' })
	} catch (err) {
		toast.showToast({ message: 'Помилка мережі' })
		console.error('UploadFile', err.message)
	}
}
</script>
