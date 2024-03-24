<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';

const inputQuery = ref('')
const router = useRouter()

const goToSearch = (event) => {
    event.preventDefault();
    router.push({ name: 'search', params: { query: inputQuery.value }});
}
</script>

<template>
    <header>
        <div class="nav container">

            <router-link to="/" class="logo">
                <span>Vue</span>Movies
            </router-link>

            <div class="search-box">
                <input v-model="inputQuery" type="search" name="" id="search-input" placeholder="Search a movie">
                <a @click="goToSearch($event)">
                    <i class='bx bx-search'></i>
                </a>
            </div>
        </div>
    </header>
</template>
