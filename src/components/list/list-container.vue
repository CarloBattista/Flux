<template>
  <div class="li-container relative w-full p-2 rounded-xl border border-solid border-white/10 bg-black">
    <div class="w-full h-full flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-container',
};
</script>

<style scoped></style>
