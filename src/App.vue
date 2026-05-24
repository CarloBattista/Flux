<template>
  <div>
    <RouterView />
    <tlToastContainer />
    <hrSearchbar />
  </div>
</template>

<script>
import { getAuthUser } from './api/auth';
import { authStore } from './data/authStore';

import tlToastContainer from './components/toast/tl-toast-container.vue';
import hrSearchbar from './components/searchbar/hr-searchbar.vue';

export default {
  name: 'App',
  components: {
    tlToastContainer,
    hrSearchbar,
  },
  data() {
    return {
      authStore,
    };
  },
  async mounted() {
    await getAuthUser();
  },
};
</script>

<style></style>
