import { createApp } from 'vue';
import './style/style.css';
import App from './App.vue';

import router from './routing/router';

import { inject } from '@vercel/analytics';

inject();

const app = createApp(App);
app.use(router);
app.mount('#app');
