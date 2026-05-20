<template>
  <navigation />
  <div></div>
</template>

<script>
import { tools } from '../toolsRegistry';

import navigation from '../components/navigation/navigation.vue';

export default {
  name: 'Home',
  components: {
    navigation,
  },
  data() {
    return {
      tools,
    };
  },
};
</script>

<style scoped></style>
