<template>
	<header class="">
		<nav class="bg-black shadow-custom flex items-center justify-center py-5">
			<div class="flex items-center justify-center">
				<router-link
					v-for="link of links"
					:key="link.text"
					class="text-neutral-200 text-sm font-semibold hover:text-neutral-400 px-5"
					:to="link?.href"
				>
					{{ link.text }}
				</router-link>
			</div>
		</nav>
	</header>
</template>

<script setup>
const links = [
	{
		text: 'Home',
		href: '/',
	},
	{
		text: 'Discover',
		href: 'discover/',
	},
	{
		text: 'Playlists',
		href: 'playlists/',
	},
	{
		text: 'About',
		href: 'about/',
	},
]
</script>

<style scoped lang="sass">
.active
  @apply text-neutral-500;
</style>
