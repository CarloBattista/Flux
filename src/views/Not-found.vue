<template>
  <div class="w-full h-svh flex flex-col items-center justify-center text-center">
    <h2 class="text-2xl font-semibold">Pagina non trovata</h2>
    <p class="text-white brightness-50 text-base font-normal mt-1">Spiacenti, questa pagina non esiste.</p>
    <RouterLink to="/" class="mt-6">
      <hrButton variant="secondary" label="Indietro" />
    </RouterLink>
  </div>
</template>

<script>
import hrButton from '../components/button/hr-button.vue';

export default {
  name: 'Not-found',
  components: {
    hrButton,
  },
};
</script>

<style scoped></style>
