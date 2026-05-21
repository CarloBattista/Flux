<template>
  <div>
    <RouterView />
    <hrSearchbar />
  </div>
</template>

<script>
import hrSearchbar from './components/searchbar/hr-searchbar.vue';

export default {
  name: 'App',
  components: {
    hrSearchbar,
  },
};
</script>

<style></style>
