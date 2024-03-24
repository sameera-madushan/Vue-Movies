<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/store.js';

const route = useRoute()
const store = useStore();
const query = route.params.query;
const TMDB_SEARCH = import.meta.env.VITE_TMDB_SEARCH
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE
const STREAM_URL = import.meta.env.VITE_STREAM_URL

const params = {
    language: 'en-US',
    page: 1,
    query: query,
    include_adult: "false",
}

onMounted(() => {
    store.fetchSearches(params, TMDB_SEARCH)
})

</script>

<template>
    <section class="movies container" id="search">
        <div class="movie-content">
            <div v-for="movie in store.searchMovies" class="movie-box">
                <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                <div class="box-text">
                    <h2 class="movie-title">{{ movie.original_title }}</h2>
                    <span class="movie-date"></span>
                    <a :href="STREAM_URL + '?video_id=' + movie.id + '&tmdb=1'" class="watch-btn play-btn" target="_blank">
                        <i class='bx bx-right-arrow animate'></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
