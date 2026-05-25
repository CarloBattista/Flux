<template>
  <div class="card-tool group w-full flex items-center gap-4 p-2 rounded-2xl transition-all duration-200">
    <div
      v-if="icon"
      class="h-8 aspect-square rounded-xl flex items-center justify-center shrink-0 bg-white/5 group-hover:bg-white/20 text-white/70 group-hover:text-white"
    >
      <component :is="icon" size="18" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span v-if="firstLine" class="text-white font-semibold truncate" :class="{ 'text-base': type === 'large', 'text-sm': type === 'mini' }">{{
          firstLine
        }}</span>
        <span v-if="badge" class="bg-green-600/40 text-green-400 text-[10px] font-bold py-0.5 px-1.5 rounded-md">NEW</span>
      </div>
      <p v-if="secondLine" class="text-white/40 text-xs truncate">{{ secondLine }}</p>
    </div>
    <component v-if="action" :is="actionIcon" size="18" class="text-white/70" />
  </div>
</template>

<script>
// ICONS
import {
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Thermometer,
  Clock,
  Gauge,
  Zap,
  Headphones,
  Braces,
  Binary,
  ShieldCheck,
  ShieldAlert,
  Regex,
  Calendar,
  Fingerprint,
  Palette,
  ImageDown,
} from '@lucide/vue';

export default {
  name: 'card-tool',
  components: {
    ChevronRight,
    ImageIcon,
    VideoIcon,
    Thermometer,
    Clock,
    Gauge,
    Zap,
    Headphones,
    Braces,
    Binary,
    ShieldCheck,
    ShieldAlert,
    Regex,
    Calendar,
    Fingerprint,
    Palette,
    ImageDown,
  },
  props: {
    keyCard: String,
    selectedIndex: Number,
    type: {
      type: String,
      default: 'large',
    },
    icon: String,
    firstLine: String,
    secondLine: String,
    badge: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Boolean,
      default: false,
    },
    actionIcon: {
      type: String,
      default: 'ChevronRight',
    },
  },
};
</script>

<style scoped></style>
