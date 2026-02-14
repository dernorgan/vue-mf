<template>
	<div style="padding: 2rem">
		<button @click="showPopup">TESt</button>

		<h1>🎵 Моя музика</h1>
		<div
			v-if="tracks?.length"
			class="flex flex-col gap-8"
		>
			<TrackItem
				v-for="track in tracks"
				:key="track?.name"
				:data="{ track, backend, activeTrack }"
				@update:active-track="updateActiveTrack"
			/>
		</div>
		<div v-else>Завантаження треків...</div>
	</div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue'
import TrackItem from '@/pages/homePage/components/TrackItem/TrackItem.vue'
import { usePopup } from '@hooks/usePopup.js'

const UploadPopup = defineAsyncComponent(
	() => import('@pages/homePage/components/Popup/UploadPopup/UploadPopup.vue'),
)

const { openPopup } = usePopup()

function showPopup() {
	openPopup('my-form1', UploadPopup, { someProp: 'hello' })
}

const activeTrack = ref('')

const tracks = ref({ files: [] })

const backend = !import.meta.env.DEV
	? import.meta.env.VITE_API_URL
	: import.meta.env.VITE_API_URL_DEV

const updateActiveTrack = (track) => {
	activeTrack.value = track?.id
}

onMounted(async () => {
	// try {
	// 	// const res = await fetch(`${backend}/api/music-list`)
	// 	const res = await fetch(`${backend}/db`)
	// 	tracks.value = await res.json()
	// } catch (err) {
	// 	console.error('❌ Помилка завантаження треків:', err)
	// }
	const modules = import.meta.glob('@/assets/music/*.mp3', {
		eager: true,
		import: 'default',
	})

	tracks.value = Object.entries(modules).map(([path, url]) => {
		const name = path.split('/').pop().replace('.mp3', '')
		return {
			name,
			url,
			id: crypto.randomUUID(),
		}
	})
})
</script>
