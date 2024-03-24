<script setup>
import {onMounted, ref} from 'vue';
import { useStore } from '@/store/store.js';

const store = useStore();
const TMDB_EXPLORE = import.meta.env.VITE_TMDB_EXPLORE
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE
const STREAM_URL = import.meta.env.VITE_STREAM_URL

const page = ref(1);

const getNext = () => {
    page.value ++ 

    const params = {
        include_adult:"false",
        include_video:"false",
        language:"en-US",
        page:page.value,
        sort_by:"popularity.desc"
    }

    store.fetchMovies(params, TMDB_EXPLORE);
}

onMounted(getNext) 

</script>

<template>
    <section class="movies container" id="explore">
        <div class="movie-content">
            <div v-for="movie in store.exploreMovies" class="movie-box">
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

    <div class="next-page">
        <button @click="getNext" class="next-btn">Next Page</button>
    </div>
</template>