import './assets/css/main.css'
import 'swiper/css/navigation';
import 'vue3-toastify/dist/index.css';
import 'swiper/css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from '@/store/store.js';
import Vue3Toastify from 'vue3-toastify';

const app = createApp(App)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "dark", 
});

app.use(router)
app.use(pinia)

app.mount('#app')
