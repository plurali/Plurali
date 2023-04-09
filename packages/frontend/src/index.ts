import { createApp } from 'vue'
import { router } from './router'
import { RouterView } from 'vue-router'

import './assets/app.css'

createApp(RouterView).use(router).mount('#app')
