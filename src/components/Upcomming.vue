<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useStore } from '@/store/store.js';
import { Autoplay } from 'swiper/modules';
import {onMounted} from 'vue';

const store = useStore();
const modules = [Autoplay];

const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE
const STREAM_URL = import.meta.env.VITE_STREAM_URL
const TMDB_EXPLORE = import.meta.env.VITE_TMDB_EXPLORE

var today = new Date();

var formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

const params = {
    "language": "en-US",
    "page": 1,
    "certification_country": "US",
    "release_date.gte": "2025-01-01",
    "release_date.lte": "2025-12-31",
    "sort_by": "popularity.desc",
    "vote_average.lte": 10,
    "watch_region": "US",

}

onMounted(() => {
    store.fetchUpcoming(params , TMDB_EXPLORE)
})

</script>

<template>
    <section class="popular container" id="container">
        <div class="heading">
            <h2 class="heading-title">
                <span>Upcoming</span> Movies
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
                <swiper-slide v-for="movie in store.upcomingMovies" :key="movie.id">
                    <div class="movie-box">
                        <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                        <div class="box-text">
                            <h2 class="movie-title">{{ movie.original_title }}</h2>
                            <span class="movie-date">{{ 'Release Date: ' +  movie.release_date }}</span>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>