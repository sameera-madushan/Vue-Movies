import './assets/css/main.css'
import 'swiper/css/navigation';
import 'swiper/css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from '@/store/store.js';

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
