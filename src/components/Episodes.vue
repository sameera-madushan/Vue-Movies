<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper/modules';
import { useStore } from '@/store/store.js';
import Modal from '@/components/Modal.vue';

const props = defineProps({
  seriesId: Number,
  seasons: Array,
});

const store = useStore();

const loadingSeasons = ref(new Set());
const expandedSeasons = ref(new Set());
const failedSeasons = ref(new Set());
const selectedEpisode = ref(null);
const showModal = ref(false);

const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;
const STREAM_URL = import.meta.env.VITE_STREAM_URL;
const TMDB_SERIES_DETAILS = import.meta.env.VITE_TMDB_SERIES_DETAILS;

const modules = [Autoplay, Navigation];

const seasonEpisodes = computed(() => store.seasonEpisodes);

const videoUrl = computed(() => {
  const ep = selectedEpisode.value;
  if (!ep) return '';
  return `${STREAM_URL}/tv/${props.seriesId}/${ep.season_number}/${ep.episode_number}`;
});

const filteredSeasons = computed(() =>
  props.seasons.filter(
    (season) => season?.season_number && season.season_number !== 0
  )
);

const calculateRetryDelay = (retryCount) => {
  const baseDelay = 1000;
  const jitter = Math.random() * 500;
  return baseDelay * Math.pow(2, retryCount) + jitter;
};

const maxRetries = 3;

const fetchSeasonEpisodes = async (seasonNumber, retryCount = 0) => {
  if (loadingSeasons.value.has(seasonNumber)) return;

  loadingSeasons.value.add(seasonNumber);

  try {
    const url = `${TMDB_SERIES_DETAILS}/${props.seriesId}/season/${seasonNumber}`;
    const data = await store.fetchSeasonEpisodes(url);

    if (!data?.episodes) throw new Error('No episodes data');
    failedSeasons.value.delete(seasonNumber);
  } catch (error) {
    if (!failedSeasons.value.has(seasonNumber)) {
      toast.error('Failed to load episodes. Please try again later.');
    }
    failedSeasons.value.add(seasonNumber);

    if (retryCount < maxRetries) {
      await new Promise((res) => setTimeout(res, calculateRetryDelay(retryCount)));
      return fetchSeasonEpisodes(seasonNumber, retryCount + 1);
    }
  } finally {
    loadingSeasons.value.delete(seasonNumber);
  }
};

const toggleSeason = async (seasonNumber) => {
  if (expandedSeasons.value.has(seasonNumber)) {
    expandedSeasons.value.delete(seasonNumber);
  } else {
    expandedSeasons.value.add(seasonNumber);
    if (!seasonEpisodes.value[seasonNumber]) {
      await fetchSeasonEpisodes(seasonNumber);
    }
  }
};

const getEpisodeImage = (episode) => {
  if (episode.still_path) {
    return TMDB_IMAGE + episode.still_path;
  }

  const fallback =
    store.seriesDetails?.backdrop_path || store.seriesDetails?.poster_path;
  return fallback ? TMDB_IMAGE + fallback : '/fallback.jpg';
};

const openModal = (episode) => {
  selectedEpisode.value = episode;
  showModal.value = true;
};
</script>

<template>
  <section class="episodes container">
    <div v-for="season in filteredSeasons" :key="season.id" class="season-block">
      <div class="heading flex justify-between items-center mb-2">
        <h2 class="heading-title">Season {{ season.season_number }}</h2>
        <button class="toggle-btn" @click="toggleSeason(season.season_number)">
          {{ expandedSeasons.has(season.season_number) ? 'Hide Episodes' : 'View Episodes' }}
        </button>
      </div>

      <div v-if="expandedSeasons.has(season.season_number)">
        <div v-if="loadingSeasons.has(season.season_number)">
          <div class="spinner"></div>
        </div>

        <swiper
          v-else
          :breakpoints="{
            280: { slidesPerView: 1, spaceBetween: 10 },
            320: { slidesPerView: 2, spaceBetween: 10 },
            510: { slidesPerView: 1, spaceBetween: 10 },
            758: { slidesPerView: 3, spaceBetween: 15 },
            900: { slidesPerView: 4, spaceBetween: 20 }
          }"
          :navigation="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :modules="modules"
        >
          <swiper-slide
            v-for="(episode, index) in seasonEpisodes[season.season_number] || []"
            :key="`${season.season_number}-${episode.episode_number}`"
            :class="{ 'no-margin': index === 0 }"
          >
            <div class="movie-box">
              <img
                :src="getEpisodeImage(episode)"
                :alt="episode.name || 'Episode Image'"
                :title="episode.name"
                class="movie-box-img"
                loading="lazy"
              />
              <div class="box-text">
                <h2 class="movie-title">{{ episode.name }}</h2>
                <span class="movie-date">
                  Episode {{ episode.episode_number }} • {{ episode.air_date }}
                </span>
                <a href="#" @click.prevent="openModal(episode)" class="watch-btn play-btn">
                  <i class="bx bx-right-arrow animate"></i>
                </a>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

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
  </section>
</template>

<style scoped>
.spinner {
  margin-bottom: 40px;
}

.heading-title {
  color: var(--main-color);
}
</style>
