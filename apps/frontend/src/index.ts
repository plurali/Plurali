import { createApp } from 'vue';
import { router } from './router';
import { RouterView } from 'vue-router';
import { polyfill as sanitizer } from '@plurali/sanitizer';

import './assets/app.css';

sanitizer(true);

createApp(RouterView).use(router).mount('#app');
