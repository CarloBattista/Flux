<template>
  <div>
    <RouterView />
    <hrSearchbar />
  </div>
</template>

<script>
import { getAuthUser } from './api/auth';
import { authStore } from './data/authStore';

import hrSearchbar from './components/searchbar/hr-searchbar.vue';

export default {
  name: 'App',
  components: {
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
