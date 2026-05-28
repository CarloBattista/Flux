<template>
  <div
    v-if="store.featureFlags.maintenance_mode?.is_active"
    class="sticky z-999999 top-0 left-0 w-full px-6 md:py-3 py-4 flex md:flex-row flex-col md:items-center items-start justify-center bg-[#161616]"
  >
    <span class="text-white text-sm font-semibold">{{ isUnderMaintenance ? 'Siamo in manutenzione' : 'Prossima manutenzione' }}</span>
    <span class="mx-2 text-sm brightness-50 md:block hidden">•</span>
    <div class="flex items-center text-sm brightness-50">
      <span>dal&nbsp;{{ formatDate(store.featureFlags.maintenance_mode?.value.start, true, 'expanded', true) }}</span>
      <span>&nbsp;al&nbsp;{{ formatDate(store.featureFlags.maintenance_mode?.value.end, true, 'expanded', true) }}</span>
    </div>
  </div>
  <div>
    <RouterView />
    <tlToastContainer />
    <hrSearchbar />
  </div>
  <Analytics />
  <SpeedInsights />
</template>

<script>
import { Analytics } from '@vercel/analytics/vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';

import { getAuthUser } from './api/auth';
import { getTools } from './api/tools';
import { authStore } from './data/authStore';
import { store } from './data/store';
import { getFeatureFlags } from './api/featureFlags';
import { formatDate } from './utils/format';

import tlToastContainer from './components/toast/tl-toast-container.vue';
import hrSearchbar from './components/searchbar/hr-searchbar.vue';

export default {
  name: 'App',
  components: {
    Analytics,
    SpeedInsights,
    tlToastContainer,
    hrSearchbar,
  },
  data() {
    return {
      authStore,
      store,
    };
  },
  methods: {
    formatDate,
  },
  async mounted() {
    await getAuthUser();
    await getFeatureFlags();
    await getTools();
  },
};
</script>

<style></style>
