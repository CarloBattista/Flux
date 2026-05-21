<template>
  <button
    @click="actionCopy"
    class="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
    :class="{ 'text-green-400 bg-green-400/10': copied }"
  >
    <component :is="copied ? 'Check' : 'Copy'" size="16" />
    <span v-if="copied" class="text-xs font-bold">Copiato!</span>
  </button>
</template>

<script>
// ICONS
import { Copy, Check } from '@lucide/vue';

export default {
  name: 'hr-button-copy',
  components: {
    // ICONS
    Copy,
    Check,
  },
  props: {
    data: String,
  },
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    actionCopy() {
      if (!this.data) return;

      navigator.clipboard.writeText(this.data);

      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
  },
};
</script>

<style scoped></style>
