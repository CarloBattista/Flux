<template>
  <div class="li-item relative w-full p-4 rounded-[10px] flex gap-2.5 items-center">
    <div v-if="icon" class="h-full flex items-center justify-center">
      <component :is="icon" size="20" />
    </div>
    <div class="flex flex-col">
      <h2 v-if="firstLine" class="text-xs font-normal brightness-75">{{ firstLine }}</h2>
      <p v-if="secondLine" class="text-sm font-semibold">{{ secondLine }}</p>
    </div>
    <div v-if="action" class="h-full ml-auto flex items-center justify-center">
      <component :is="iconAction" size="20" />
    </div>
  </div>
</template>

<script>
// ICONS
import { ChevronRight, Languages, LockKeyhole, CreditCard } from '@lucide/vue';

export default {
  name: 'list-item',
  components: {
    // ICONS
    ChevronRight,
    Languages,
    LockKeyhole,
    CreditCard,
  },
  props: {
    icon: String,
    firstLine: String,
    secondLine: String,
    action: {
      type: Boolean,
      default: true,
    },
    iconAction: {
      type: String,
      default: 'ChevronRight',
    },
  },
};
</script>

<style scoped>
.li-item {
  cursor: pointer;
  transition-property: background-color, color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.li-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
