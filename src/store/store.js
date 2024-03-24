import { defineStore, createPinia  } from "pinia";
import API_GET from '@/assets/js/api.js';

export const useStore = defineStore({
    id:'main',
    state: () => ({
        heroImages: [],
        exploreMovies: [],
        searchMovies: [],
    }),
    actions:{
        async fetchImages(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data){
                this.heroImages = data.results;
            }
        },
        async fetchMovies(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data) {
                this.exploreMovies = data.results;
            }
        },
        async fetchSearches(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data){
                this.searchMovies = data.results;
            }
        }
    }
})

export const pinia = createPinia();