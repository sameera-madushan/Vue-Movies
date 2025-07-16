<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from '@/store/store.js';
import { useRouter } from 'vue-router';

const router = useRouter()
const loading = ref(true);

const store = useStore();
const TMDB_SERIES = import.meta.env.VITE_TMDB_DISCOVER_TV;
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;

const page = ref(1);
const totalPages = ref(10);
const maxVisibleButtons = 5;

const fetchMedia = (pageNumber) => {
    const params = {
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: pageNumber,
        sort_by: "popularity.desc"
    };

    loading.value = true;

    store.fetchMedia(params, TMDB_SERIES).then(response => {
        totalPages.value = 100;
    }).finally(() => {
        loading.value = false;
    });
};

onMounted(() => fetchMedia(page.value));

const getNext = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchMedia(page.value);
    }
};

const getPrev = () => {
    if (page.value > 1) {
        page.value--;
        fetchMedia(page.value);
    }
};

const paginationButtons = computed(() => {
    const startPage = Math.max(1, page.value - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages.value, startPage + maxVisibleButtons - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});

const goToPage = (pageNumber) => {
    if (pageNumber !== page.value && pageNumber >= 1 && pageNumber <= totalPages.value) {
        page.value = pageNumber;
        fetchMedia(page.value);
    }
};

const goToSeries = (series) => {
    router.push({ name: 'seriesdetails', params: { id: series.id } });
};
</script>

<template>
    <section class="movies container" id="explore">
        <div class="movie-content">
            <div class="loader-container"  v-if="loading">
                <div class="spinner"></div>
            </div>
            <div v-for="series in store.exploreMedia" :key="series.id" class="movie-box">
                <img :src="TMDB_IMAGE + series.poster_path" :alt="series.original_name" class="movie-box-img">
                <div class="box-text">
                    <h2 class="movie-title">{{ series.original_name }}</h2>
                    <span class="movie-date">{{ series.first_air_date }}</span>
                    <a href="#" @click.prevent="goToSeries(series)" class="watch-btn play-btn">
                        <i class='bx bx-right-arrow animate'></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <div class="pagination">
        <button @click="getPrev" :disabled="page === 1">Previous</button>

        <button
            v-for="pageNumber in paginationButtons"
            :key="pageNumber"
            @click="goToPage(pageNumber)"
            :class="{'active': pageNumber === page}"
        >
            {{ pageNumber }}
        </button>

        <button @click="getNext" :disabled="page === totalPages">Next</button>
    </div>

</template>

<style scoped>
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .pagination button {
        margin: 0 5px;
        padding: 10px 15px;
        border: none;
        background-color: #47c7a2;
        cursor: pointer;
        color: #000;
    }

    .pagination button.active {
        background-color: #fff;
        color: #000;
    }

    .pagination button:disabled {
        background-color: #bbb;
        cursor: not-allowed;
    }
</style>
