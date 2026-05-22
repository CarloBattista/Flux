<template>
  <div>
    <RouterView />
    <hrSearchbar />
  </div>
</template>

<script>
import { getAuthUser } from './api/auth';

import hrSearchbar from './components/searchbar/hr-searchbar.vue';

export default {
  name: 'App',
  components: {
    hrSearchbar,
  },
  async mounted() {
    await getAuthUser();
  },
};
</script>

<style></style>
