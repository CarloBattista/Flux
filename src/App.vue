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
</template>

<script>
import { Analytics } from '@vercel/analytics/vue';
import { getAuthUser } from './api/auth';
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
    tlToastContainer,
    hrSearchbar,
  },
  data() {
    return {
      authStore,
      store,
      currentTime: new Date().getTime(),
      timer: null,
    };
  },
  computed: {
    isUnderMaintenance() {
      const maintenance = this.store.featureFlags.maintenance_mode?.value;
      if (!maintenance?.start || !maintenance?.end) return false;

      const start = new Date(maintenance.start).getTime();
      const end = new Date(maintenance.end).getTime();

      return this.currentTime >= start && this.currentTime <= end;
    },
  },
  methods: {
    formatDate,
  },
  async mounted() {
    await getAuthUser();
    await getFeatureFlags();

    // Aggiorna l'ora ogni secondo per rendere reattivo il banner
    this.timer = setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>

<style></style>
