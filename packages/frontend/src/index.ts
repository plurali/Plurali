import { createApp } from 'vue'
import { router } from './router'
import { RouterView } from 'vue-router'
import longPress from 'vue3-directive-long-press'

import './assets/app.css'

createApp(RouterView).use(router).use(longPress).mount('#app')
