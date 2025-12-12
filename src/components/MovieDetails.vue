<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from '@/store/store.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useStore();
const loading = ref(true);
const playerSection = ref(null);

const movieId = route.params.id;
const TMDB_MOVIE_DETAILS = import.meta.env.VITE_TMDB_MOVIE_DETAILS;
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;
const STREAM_URL = import.meta.env.VITE_STREAM_URL;

const fetchMovieDetails = async () => {
  try {
    loading.value = true;
    const fullUrl = `${TMDB_MOVIE_DETAILS}/${movieId}`;
    await store.fetchMovieDetails(fullUrl);
  } finally {
    loading.value = false;
  }
};

const scrollToPlayer = () => {
  playerSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const videoUrl = computed(() => {
  return `${STREAM_URL}/movie/${movieId}`;
});

onMounted(fetchMovieDetails);
</script>

<template>
  <div v-if="loading" class="loader-container">
    <div class="spinner"></div>
  </div>

  <section v-else class="hero container" id="home">
    <template v-if="store.movieDetails">
      <img
        :src="TMDB_IMAGE + (store.movieDetails.backdrop_path ?? store.movieDetails.poster_path)"
        :alt="store.movieDetails.name"
        class="home-img"
        loading="lazy"
      />
      <div class="home-text">
        <h1 class="home-title">{{ store.movieDetails.original_title }}</h1>
        <p>{{ store.movieDetails.overview }}</p>
        <a href="#" @click.prevent="scrollToPlayer" class="watch-btn">
          <i class="bx bx-right-arrow animate"></i>
          <span>WATCH NOW</span>
        </a>
      </div>
    </template>
  </section>

  <div ref="playerSection" class="video-wrapper" v-if="videoUrl">
    <iframe
      :src="videoUrl"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      class="video-iframe"
    ></iframe>
  </div>
</template>

<style scoped>
  .video-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    padding: 0 20px;
  }

  .video-iframe {
    width: 100%;
    max-width: 80rem;
    height: 500px;
    border-radius: 10px;
    border: none;
    background: #000;
  }
</style>
