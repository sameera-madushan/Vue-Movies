<script setup>
import {onMounted, ref} from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useStore } from '@/store/store.js';
import { Autoplay } from 'swiper/modules';
import Modal from '@/components/Modal.vue';

const showModal = ref(false);
const selectedMovie = ref(null);
const videoUrl = ref('');
const loading = ref(true);

const store = useStore();
const modules = [Autoplay];

const randomNumber = Math.floor(Math.random() * 5) + 1;
const STREAM_URL = import.meta.env.VITE_STREAM_URL
const TMDB_POPULAR = import.meta.env.VITE_TMDB_POPULAR
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE

const params = {
    language: 'en-US',
    page: randomNumber
}

onMounted(() => {
    loading.value = true;
    store.fetchImages(params, TMDB_POPULAR).finally(() => {
        loading.value = false;
    });
});

const openModal = (movie) => {
    selectedMovie.value = movie;
    videoUrl.value = `${STREAM_URL}?video_id=${movie.id}&tmdb=1`;
    showModal.value = true;
};

</script>


<template>
    <div class="slider-container">

        <div class="loader-container" v-if="loading">
            <div class="spinner"></div>
        </div>

        <swiper 
            :slides-per-view="1" 
            :space-between="10"
            :modules="modules"
            :autoplay="{
                delay: 10000,
                disableOnInteraction: false
            }">
            <swiper-slide v-for="movie in store.heroImages" :key="movie.id">
                <section class="hero container" id="home">
                    <img :src="TMDB_IMAGE + movie.backdrop_path" :alt="movie.original_title" class="home-img">
                    <div class="home-text">
                        <h1 class="home-title">
                            {{ movie.original_title }}
                        </h1>
                        <p>{{ movie.overview }}</p>
                        <a href="#" @click.prevent="openModal(movie)" class="watch-btn">
                            <i class='bx bx-right-arrow animate'></i>
                            <span>WATCH NOW</span>
                        </a>
                    </div>
                </section>
            </swiper-slide>
        </swiper>
    </div>

    <Modal v-model="showModal" :videoUrl="videoUrl">
        <iframe
            v-if="videoUrl"
            :src="videoUrl"
            width="100%"
            height="400"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
        ></iframe>
    </Modal>
</template>
