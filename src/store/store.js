import { defineStore, createPinia } from "pinia";
import API_GET from '@/assets/js/api.js';
import { toast } from 'vue3-toastify';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    heroImages: [],
    exploreMedia: [],
    searchMovies: [],
    seriesDetails: null,
    seasonEpisodes: {},
  }),
  actions: {
    async _fetchMediaData(params, url, stateKey) {
      try {
        const data = await API_GET.fetchMovieDb(params, url);
        if (data?.results) {
          this[stateKey] = data.results;
        }
        return data;
      } catch {
        toast.error('An error occurred while fetching data. Please try again later.');
        this[stateKey] = [];
        return null;
      }
    },

    async fetchImages(params, url) {
      return this._fetchMediaData(params, url, 'heroImages');
    },

    async fetchMedia(params, url) {
      return this._fetchMediaData(params, url, 'exploreMedia');
    },

    async fetchSearches(params, url) {
      return this._fetchMediaData(params, url, 'searchMovies');
    },

    async fetchSeriesDetails(fullUrl) {
      this.clearSeriesData();
      try {
        const data = await API_GET.fetchRaw(fullUrl);
        if (data) {
          this.seriesDetails = data;
        }
        return data;
      } catch {
        toast.error('An error occurred while fetching data. Please try again later.');
        this.seriesDetails = null;
        return null;
      }
    },

    async fetchSeasonEpisodes(fullUrl) {
      try {
        const data = await API_GET.fetchRaw(fullUrl);
        if (data?.episodes) {
          const seasonNumber = this._extractSeasonNumber(fullUrl);
          if (seasonNumber !== null) {
            this.setSeasonEpisodes(seasonNumber, data.episodes);
          }
        }
        return data;
      } catch {
        toast.error('An error occurred while fetching data. Please try again later.');
        return null;
      }
    },

    setSeasonEpisodes(seasonNumber, episodes) {
      this.seasonEpisodes = { ...this.seasonEpisodes, [seasonNumber]: episodes };
    },

    _extractSeasonNumber(url) {
      const matches = url.match(/tv\/(\d+)\/season\/(\d+)/);
      return matches ? Number(matches[2]) : null;
    },

    clearSeriesData() {
      this.seriesDetails = null;
      this.seasonEpisodes = {};
    }
  }
});

export const pinia = createPinia();
