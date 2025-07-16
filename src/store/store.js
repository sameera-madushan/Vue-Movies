import { defineStore, createPinia  } from "pinia";
import API_GET from '@/assets/js/api.js';

export const useStore = defineStore({
    id:'main',
    state: () => ({
        heroImages: [],
        exploreMedia: [],
        searchMovies: [],
        seriesDetails: null,
        seasonEpisodes: {},
    }),
    actions:{
        async fetchImages(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data){
                this.heroImages = data.results;
            }
        },
        async fetchMedia(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data) {
                this.exploreMedia = data.results;
            }
        },
        async fetchSearches(params, url){
            const data = await API_GET.fetchMovieDb(params, url);
            if (data){
                this.searchMovies = data.results;
            }
        },
        async fetchSeriesDetails(fullUrl) {
            const data = await API_GET.fetchRaw(fullUrl);
            if (data) {
                this.seriesDetails = data;
            }
        },
        async fetchSeasonEpisodes(fullUrl) {
            const data = await API_GET.fetchRaw(fullUrl);
            if (data && data.episodes) {
                const matches = fullUrl.match(/tv\/(\d+)\/season\/(\d+)/);
                    if (matches) {
                        const seasonNumber = matches[2];
                        this.seasonEpisodes[seasonNumber] = data.episodes;
                    }
            }
            return data;
        }
    }
})

export const pinia = createPinia();