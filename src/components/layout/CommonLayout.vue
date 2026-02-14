<template>
	<!--  <header>-->
	<!--    <div class="wrapper">-->
	<!--      <nav>-->
	<!--        <RouterLink to="/">Home</RouterLink>-->
	<!--        <RouterLink to="/about">About</RouterLink>-->
	<!--      </nav>-->
	<!--    </div>-->
	<!--  </header>-->

	<PopupBox />

	<AppHeadr />
	<RouterView />
	<ToastNotifier />
	<AppFooter />
</template>

<script setup>
import { RouterView } from 'vue-router'
// import { RouterLink, RouterView } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import AppFooter from '@components/layout/AppFooter/AppFooter.vue'
import AppHeadr from '@components/layout/AppHeader/AppHeadr.vue'

const ToastNotifier = defineAsyncComponent(
	() => import('@components/common/ToastNotifier/ToastNotifier.vue'),
)
const PopupBox = defineAsyncComponent(
	() => import('@components/common/PopupBox/PopupBox.vue'),
)
</script>
