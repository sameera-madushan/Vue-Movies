<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from '@/store/store.js';

const store = useStore();
const TMDB_EXPLORE = import.meta.env.VITE_TMDB_EXPLORE;
const TMDB_IMAGE = import.meta.env.VITE_TMDB_IMAGE;
const STREAM_URL = import.meta.env.VITE_STREAM_URL;

const page = ref(1);
const totalPages = ref(10);
const maxVisibleButtons = 5;

const fetchMovies = (pageNumber) => {
    const params = {
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: pageNumber,
        sort_by: "popularity.desc"
    };

    store.fetchMovies(params, TMDB_EXPLORE).then(response => {
        totalPages.value = 100;
    });
}

onMounted(() => fetchMovies(page.value));

const getNext = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchMovies(page.value);
    }
};

const getPrev = () => {
    if (page.value > 1) {
        page.value--;
        fetchMovies(page.value);
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
        fetchMovies(page.value);
    }
};
</script>

<template>
    <section class="movies container" id="explore">
        <div class="movie-content">
            <div v-for="movie in store.exploreMovies" :key="movie.id" class="movie-box">
                <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                <div class="box-text">
                    <h2 class="movie-title">{{ movie.original_title }}</h2>
                    <span class="movie-date">{{ movie.release_date }}</span>
                    <a :href="STREAM_URL + '?video_id=' + movie.id + '&tmdb=1'" class="watch-btn play-btn" target="_blank">
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

<style>
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
