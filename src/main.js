import { createApp } from 'vue';
import './style/style.css';
import App from './App.vue';

import router from './routing/router';
import i18n from './services/i18n';

import { inject } from '@vercel/analytics';

inject();

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
