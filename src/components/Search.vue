<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store/store.js';
import { watchEffect } from 'vue';

const loading = ref(true);

const route = useRoute()
const router = useRouter()
const store = useStore();

const TMDB_SEARCH = import.meta.env.VITE_TMDB_SEARCH
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE

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

const goToMedia = (media) => {
    const routeMap = {
        movie: 'moviedetails',
        tv: 'seriesdetails',
    };

    const routeName = routeMap[media.media_type];
    if (routeName) {
        router.push({ name: routeName, params: { id: media.id } });
    } else {
        console.warn('Unknown media type:', media.media_type);
    }
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
                    <a href="#" @click.prevent="goToMedia(movie)" class="watch-btn play-btn">
                        <i class='bx bx-right-arrow animate'></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
