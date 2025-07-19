<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from '@/store/store.js';
import { useRoute } from 'vue-router';
import Episodes from '@/components/Episodes.vue';

const route = useRoute();
const store = useStore();
const loading = ref(true);
const episodesSection = ref(null);

const seriesId = route.params.id;
const TMDB_SERIES_DETAILS = import.meta.env.VITE_TMDB_SERIES_DETAILS;
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;

const fetchSeriesDetails = async () => {
  try {
    loading.value = true;
    const fullUrl = `${TMDB_SERIES_DETAILS}/${seriesId}`;
    await store.fetchSeriesDetails(fullUrl);
  } finally {
    loading.value = false;
  }
};

const scrollToEpisodes = () => {
  episodesSection.value?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(fetchSeriesDetails);
</script>

<template>
  <div v-if="loading" class="loader-container">
    <div class="spinner"></div>
  </div>

  <section v-else class="hero container" id="home">
    <template v-if="store.seriesDetails">
      <img
        :src="TMDB_IMAGE + (store.seriesDetails.backdrop_path ?? store.seriesDetails.poster_path)"
        :alt="store.seriesDetails.name"
        class="home-img"
        loading="lazy"
      />
      <div class="home-text">
        <h1 class="home-title">{{ store.seriesDetails.name }}</h1>
        <p>{{ store.seriesDetails.overview }}</p>
        <a href="#" @click.prevent="scrollToEpisodes" class="watch-btn">
          <i class="bx bx-right-arrow animate"></i>
          <span>WATCH NOW</span>
        </a>
      </div>
    </template>
  </section>

  <div ref="episodesSection">
    <Episodes
      v-if="store.seriesDetails"
      :seriesId="seriesId"
      :seasons="store.seriesDetails.seasons"
    />
  </div>
</template>
