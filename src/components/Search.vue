<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/store.js';
import { watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';

const showModal = ref(false);
const selectedMovie = ref(null);
const videoUrl = ref('');

const route = useRoute()
const store = useStore();
const query = route.params.query;
const TMDB_SEARCH = import.meta.env.VITE_TMDB_SEARCH
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE
const STREAM_URL = import.meta.env.VITE_STREAM_URL

const fetchSearch = (query) => {
    const params = {
        language: 'en-US',
        page: 1,
        query: query,
        include_adult: false,
    }
    store.fetchSearches(params, TMDB_SEARCH);
}

watchEffect(() => {
    const query = route.params.query;
    if (query) {
        fetchSearch(query);
    }
});

onMounted(() => {
    const query = route.params.query;
    if (query) {
        fetchSearch(query);
    }
})

const openModal = (movie) => {
    selectedMovie.value = movie;
    videoUrl.value = `${STREAM_URL}?video_id=${movie.id}&tmdb=1`;
    showModal.value = true;
};
</script>

<template>
    <section class="movies container" id="search">
        <div class="movie-content">
            <div v-for="movie in store.searchMovies" class="movie-box">
                <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                <div class="box-text">
                    <h2 class="movie-title">{{ movie.original_title }}</h2>
                    <span class="movie-date"></span>
                    <a href="#" @click.prevent="openModal(movie)" class="watch-btn play-btn">
                        <i class='bx bx-right-arrow animate'></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

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
