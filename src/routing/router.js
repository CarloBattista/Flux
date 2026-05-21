import { createRouter, createWebHistory } from 'vue-router';

const APP_NAME = 'Flux';

const routes = [
  // General
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    props: true,
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../views/Pricing.vue'),
    props: true,
  },

  // Tools
  {
    path: '/tool/:slug',
    name: 'tool',
    component: () => import('../views/Tool.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const pageTitle = to.meta.title;
  if (pageTitle) {
    document.title = pageTitle;
  } else {
    document.title = APP_NAME;
  }
  next();
});

export default router;
