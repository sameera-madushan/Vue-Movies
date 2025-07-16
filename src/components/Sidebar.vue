<script setup>
</script>

<template>
    <div class="sidebar">
        <router-link to="/" class="nav-link" exact active-class="nav-active">
            <i class='bx bx-home'></i>
            <span class="nav-link-title">Home</span>
        </router-link>

        <router-link to="/movies" class="nav-link" exact active-class="nav-active">
            <i class='bx bx-movie-play' ></i>
            <span class="nav-link-title">Movies</span>
        </router-link>

        <router-link to="/tv" class="nav-link" exact active-class="nav-active">
            <i class='bx bx-tv' ></i>
            <span class="nav-link-title">TV Shows</span>
        </router-link>
    </div>
</template>