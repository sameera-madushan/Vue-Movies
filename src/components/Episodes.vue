<script setup>
import { onMounted, ref, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper/modules';
import { useStore } from '@/store/store.js';
import Modal from '@/components/Modal.vue';

const props = defineProps({
  seriesId: Number,
  seasons: Array,
});

const store = useStore();
const loading = ref(true);

const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;
const STREAM_URL = import.meta.env.VITE_STREAM_URL;
const TMDB_SERIES_DETAILS = import.meta.env.VITE_TMDB_SERIES_DETAILS;

const showModal = ref(false);
const selectedEpisode = ref(null);
const videoUrl = ref('');
const modules = [Autoplay, Navigation];

const seasonEpisodes = computed(() => store.seasonEpisodes);

const filteredSeasons = computed(() => {
  return props.seasons.filter(season => season?.season_number && season.season_number !== 0);
});

const fetchSeasonEpisodes = async (seasonNumber) => {

  const url = `${TMDB_SERIES_DETAILS}/${props.seriesId}/season/${seasonNumber}`;
  const data = await store.fetchSeasonEpisodes(url);
  
  if (data && data.episodes) {
    seasonEpisodes.value = {
      ...seasonEpisodes.value,
      [seasonNumber]: data.episodes
    };
  }
};

const fetchAllSeasonEpisodes = async () => {
  loading.value = true;
  const fetchPromises = filteredSeasons.value.map(season => fetchSeasonEpisodes(season.season_number));
  await Promise.all(fetchPromises);
  loading.value = false;
};


onMounted(() => {
    fetchAllSeasonEpisodes();
});

const openModal = (episode) => {
  selectedEpisode.value = episode;
  videoUrl.value = `${STREAM_URL}?video_id=${props.seriesId}&tmdb=1&s=${episode.season_number}&e=${episode.episode_number}`;
  showModal.value = true;
};
</script>

<template>
    <section class="episodes container">

    <div class="loader-container" v-if="loading">
        <div class="spinner"></div>
    </div>

    <template v-else>
        <div v-for="season in filteredSeasons" :key="season?.id">
        <div class="heading">
            <h2 class="heading-title">
            <span>Season {{ season.season_number }}</span>
            </h2>
        </div>

        <swiper
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
            :key="episode.id"
            :class="{ 'no-margin': index === 0 }"
            >
            <div class="movie-box">
                <img :src="TMDB_IMAGE + episode.still_path" :alt="episode.name" class="movie-box-img" />
                <div class="box-text">
                <h2 class="movie-title">{{ episode.name }}</h2>
                <span class="movie-date">Episode {{ episode.episode_number }} • {{ episode.air_date }}</span>
                <a href="#" @click.prevent="openModal(episode)" class="watch-btn play-btn">
                    <i class='bx bx-right-arrow animate'></i>
                </a>
                </div>
            </div>
            </swiper-slide>
        </swiper>
        </div>
    </template>

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
.movie-box {
  margin-bottom: 20px;
}

.no-margin .movie-box {
  margin-bottom: 0;
}

</style>