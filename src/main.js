import './assets/css/main.css'
import 'swiper/css';
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from '@/store/store.js';
import { createVfm } from 'vue-final-modal'

const app = createApp(App)
const vfm = createVfm()

app.use(router)
app.use(pinia)
app.use(vfm)

app.mount('#app')
