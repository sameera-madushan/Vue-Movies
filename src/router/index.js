import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieView from '../views/MovieView.vue'
import SearchView from '../views/SearchView.vue'
import SeriesView from '../views/SeriesView.vue'
import SeriesDetailsView from '../views/SeriesDetailsView.vue'
import MovieDetailsView from '../views/MovieDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movies',
      name: 'movies',
      component: MovieView
    },
    {
      path: '/movies/:id',
      name: 'moviedetails',
      component: MovieDetailsView
    },
    {
      path: '/tv',
      name: 'tv',
      component: SeriesView
    },
    {
      path: '/tv/:id',
      name: 'seriesdetails',
      component: SeriesDetailsView
    },
    {
      path: '/search/:query?',
      name: 'search',
      component: SearchView
    },
  ]
})

export default router
