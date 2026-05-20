<template>
  <navigation />
  <div class="relative w-full h-svh pt-24 px-6">
    <div class="absolute z-10 top-0 left-0 w-full h-full pointer-events-none">
      <img src="/_resources/imgs/background.png" alt="background" draggable="false" style="filter: blur(500px) brightness(0.2)" />
    </div>
    <div class="relative z-40 w-full max-w-[1024px] mx-auto">
      <h1 class="md:text-6xl text-3xl md:leading-20 leading-12 font-semibold text-center whitespace-nowrap">
        Converti qualsiasi cosa, <br />
        in pochi secondi.
      </h1>
      <div class="mt-6 flex gap-2 items-center justify-center">
        <hrButton variant="primary" label="Vedi prezzi" />
        <hrButton variant="secondary" label="Inizia ora" />
      </div>
    </div>
  </div>
</template>

<script>
import { tools } from '../toolsRegistry';

import navigation from '../components/navigation/navigation.vue';
import hrButton from '../components/button/hr-button.vue';

export default {
  name: 'Home',
  components: {
    navigation,
    hrButton,
  },
  data() {
    return {
      tools,
    };
  },
};
</script>

<style scoped></style>
