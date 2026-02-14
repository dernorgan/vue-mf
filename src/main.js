import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@assets/style/base.sass'
import { useDeviceStore } from '@stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const deviceStore = useDeviceStore()
deviceStore.detectDevice()
app.mount('#app')
