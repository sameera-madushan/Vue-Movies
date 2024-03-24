<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useStore } from '@/store/store.js';
import { Autoplay } from 'swiper/modules';

const store = useStore();
const modules = [Autoplay];

const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE
const STREAM_URL = import.meta.env.VITE_STREAM_URL

</script>

<template>
    <section class="popular container" id="container">
        <div class="heading">
            <h2 class="heading-title">
                <span>Trending</span> Movies
            </h2>
        </div>
        <div>
            <swiper 
                :breakpoints="{
                    280: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    510: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    758: {
                        slidesPerView: 3,
                        spaceBetween: 15
                    },
                    900: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    },
                
                }"
                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false
                }"
                :modules="modules"
                >
                <swiper-slide v-for="movie in store.heroImages" :key="movie.id">
                    <div class="movie-box">
                        <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                        <div class="box-text">
                            <h2 class="movie-title">{{ movie.original_title }}</h2>
                            <span class="movie-date">{{ 'Release Date: ' +  movie.release_date }}</span>
                            <a :href="STREAM_URL + '?video_id=' + movie.id + '&tmdb=1'" class="watch-btn play-btn" target="_blank">
                                <i class='bx bx-right-arrow animate'></i>
                            </a>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>