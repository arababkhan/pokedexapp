import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import PokemonDetailView from '../views/PokemonDetailView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/profile', component: ProfileView },
  { path: '/pokemon/:id', component: PokemonDetailView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
