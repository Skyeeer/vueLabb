import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import QuizPage from '@/views/QuizPage.vue';
import ResultsPage from '@/views/ResultsPage.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/quiz/:category', name: 'QuizPage', component: QuizPage },
  { path: '/results', name: 'ResultsPage', component: ResultsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
