<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store/store.js';
import { watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';

const showModal = ref(false);
const selectedMovie = ref(null);
const videoUrl = ref('');
const loading = ref(true);

const route = useRoute()
const router = useRouter()
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

    loading.value = true;

    store.fetchSearches(params, TMDB_SEARCH).finally(() => {
        loading.value = false;
    });
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

const openModal = (media) => {
    if (media.media_type === 'movie') {
        selectedMovie.value = media;
        videoUrl.value = `${STREAM_URL}/movie/${media.id}`;
        showModal.value = true;
    } else if (media.media_type === 'tv') {
        goToSeries(media);
    }
};

const goToSeries = (series) => {
    router.push({ name: 'seriesdetails', params: { id: series.id } });
};
</script>

<template>
    <section class="movies container" id="search">
        <div class="movie-content">
            <div class="loader-container"  v-if="loading">
                <div class="spinner"></div>
            </div>
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
