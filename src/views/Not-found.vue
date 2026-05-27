<template>
  <div class="w-full h-svh flex flex-col items-center justify-center text-center">
    <h2 class="text-2xl font-semibold">{{ $t('notFound.title') }}</h2>
    <p class="text-white brightness-50 text-base font-normal mt-1">{{ $t('notFound.description') }}</p>
    <RouterLink to="/" class="mt-6">
      <hrButton variant="secondary" :label="$t('common.goBack')" />
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
