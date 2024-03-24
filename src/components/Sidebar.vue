<script setup>
</script>

<template>
    <div class="sidebar">
        <router-link to="/" class="nav-link" exact active-class="nav-active">
            <i class='bx bx-home'></i>
            <span class="nav-link-title">Home</span>
        </router-link>

        <router-link to="/explore" class="nav-link" exact active-class="nav-active">
            <i class='bx bx-compass' ></i>
            <span class="nav-link-title">Explore</span>
        </router-link>
    </div>
</template>