<script setup>
import {onMounted, ref} from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useStore } from '@/store/store.js';
import { Autoplay } from 'swiper/modules';
import { useRouter } from 'vue-router';

const router = useRouter()
const loading = ref(true);

const store = useStore();
const modules = [Autoplay];

const randomNumber = Math.floor(Math.random() * 5) + 1;
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

const goToMovie = (movie) => {
    router.push({ name: 'moviedetails', params: { id: movie.id } });
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
                    <img :src="TMDB_IMAGE + movie.backdrop_path" :alt="movie.original_title" class="home-img" loading="lazy">
                    <div class="home-text">
                        <h1 class="home-title">
                            {{ movie.original_title }}
                        </h1>
                        <p>{{ movie.overview }}</p>
                        <a href="#" @click.prevent="goToMovie(movie)" class="watch-btn">
                            <i class='bx bx-right-arrow animate'></i>
                            <span>WATCH NOW</span>
                        </a>
                    </div>
                </section>
            </swiper-slide>
        </swiper>
    </div>
</template>
