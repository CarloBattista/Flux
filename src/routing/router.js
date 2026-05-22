import { createRouter, createWebHistory } from 'vue-router';
import { authMiddleware } from './middleware/authMiddleware';

const APP_NAME = 'Flux';

const routes = [
  // Onboarding
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Onboarding/Signup.vue'),
    meta: { requiresGuest: true },
    props: true,
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Onboarding/Signin.vue'),
    meta: { requiresGuest: true },
    props: true,
  },
  {
    path: '/confirm-email',
    name: 'confirm-email',
    component: () => import('../views/Onboarding/Confirm-email.vue'),
    meta: { requiresGuest: true },
    props: true,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/Onboarding/Reset-password.vue'),
    meta: { requiresGuest: true },
    props: true,
  },
  {
    path: '/new-password',
    name: 'new-password',
    component: () => import('../views/Onboarding/New-password.vue'),
    meta: { requiresGuest: true },
    props: true,
  },

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

  // Legal
  {
    path: '/legal/:slug',
    name: 'legal',
    component: () => import('../views/Legal/Legal.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Riporta in alto la pagina ad ogni cambio di rotta
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(authMiddleware);

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
