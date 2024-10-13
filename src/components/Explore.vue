<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from '@/store/store.js';
import Modal from '@/components/Modal.vue';

const showModal = ref(false);
const selectedMovie = ref(null);
const videoUrl = ref('');
const loading = ref(true);

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

    loading.value = true;

    store.fetchMovies(params, TMDB_EXPLORE).then(response => {
        totalPages.value = 100;
    }).finally(() => {
        loading.value = false;
    });
};

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

const openModal = (movie) => {
    selectedMovie.value = movie;
    videoUrl.value = `${STREAM_URL}?video_id=${movie.id}&tmdb=1`;
    showModal.value = true;
};
</script>

<template>
    <section class="movies container" id="explore">
        <div class="movie-content">
            <div class="loader-container"  v-if="loading">
                <div class="spinner"></div>
            </div>
            <div v-for="movie in store.exploreMovies" :key="movie.id" class="movie-box">
                <img :src="TMDB_IMAGE + movie.poster_path" :alt="movie.original_title" class="movie-box-img">
                <div class="box-text">
                    <h2 class="movie-title">{{ movie.original_title }}</h2>
                    <span class="movie-date">{{ movie.release_date }}</span>
                    <a href="#" @click.prevent="openModal(movie)" class="watch-btn play-btn">
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

.spinner {
    border: 8px solid #fff;
    border-top: 8px solid #42d392;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

.loader-container {
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
