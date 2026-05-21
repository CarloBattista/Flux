<template>
  <div class="flex items-center gap-1.5">
    <span class="w-fit px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white/20 border border-white/10">{{ icon }}</span>
    <span v-if="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'hr-button-shortcut',
  props: {
    icon: String,
    label: String,
  },
};
</script>

<style scoped></style>
