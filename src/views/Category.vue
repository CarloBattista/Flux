<template>
  <navigation />
  <div class="relative w-full px-6 pt-24 pb-20">
    <div class="relative z-20 w-full max-w-[1024px] mx-auto">
      <div v-if="categoryData">
        <!-- Breadcrumbs -->
        <nav class="flex mb-8 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <RouterLink to="/" class="hover:text-white transition-colors">Home</RouterLink>
            </li>
            <li class="flex items-center space-x-2">
              <ChevronRight size="14" />
              <span class="text-white">{{ categoryData.label }}</span>
            </li>
          </ol>
        </nav>

        <div class="w-full mb-16">
          <h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">{{ categoryData.label }}</h1>
          <p class="text-xl text-gray-400 leading-relaxed">Esplora tutti i nostri strumenti dedicati a {{ categoryData.label.toLowerCase() }}.</p>
        </div>

        <div class="w-full flex flex-col">
          <div v-if="store.tools.loading" class="w-full flex items-center justify-center">
            <loader />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <RouterLink
              v-for="tool in categoryData.tools"
              :key="tool.metadata.slug"
              :to="'/tool/' + tool.metadata.slug"
              class="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8e48ff]/50 transition-all duration-300"
            >
              <div class="flex flex-col gap-4">
                <div class="w-full flex items-start">
                  <div
                    class="h-12 aspect-square rounded-2xl bg-[#8e48ff]/10 flex flex-none items-center justify-center text-[#8e48ff] group-hover:scale-110 transition-transform duration-300"
                  >
                    <component :is="tool.metadata.icon" size="24" />
                  </div>
                  <div class="w-full flex gap-2 items-center justify-end">
                    <hrBadge v-if="tool.metadata.new" variant="success" size="sm" label="New" />
                    <hrBadge v-if="tool.metadata.access === 'plus'" variant="plus" size="sm" label="Plus" />
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-white text-lg font-bold group-hover:text-white transition-colors">{{ tool.metadata.title }}</h3>
                  </div>
                  <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ tool.metadata.description }}</p>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-300">Categoria non trovata</h2>
        <RouterLink to="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">Torna alla Home</RouterLink>
      </div>
    </div>
  </div>
  <contentInfo />
</template>

<script>
import { categories } from '../data/categories';
import { store } from '../data/store';
import { toolTypeMap } from '../utils/toolMapping';

import navigation from '../components/navigation/navigation.vue';
import contentInfo from '../components/navigation/content-info.vue';
import hrBadge from '../components/badge/hr-badge.vue';
import loader from '../components/global/loader.vue';

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
  Maximize,
} from '@lucide/vue';

export default {
  name: 'Category',
  components: {
    navigation,
    contentInfo,
    hrBadge,
    loader,

    // ICONS
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
    Maximize,
  },
  data() {
    return {
      store,
    };
  },
  computed: {
    categorySlug() {
      return this.$route.params.slug;
    },
    categoryData() {
      const cat = categories[this.categorySlug];
      if (!cat) return null;

      const toolsWithMetadata = cat.tools
        .map((slug) => {
          const dbTool = this.store.tools.data.find((t) => t.slug === slug);
          if (!dbTool) return null;
          return {
            metadata: {
              ...dbTool,
              access: dbTool.is_plus ? 'plus' : 'free',
              new: dbTool.is_new,
              type: toolTypeMap[slug] || 'converter',
            },
          };
        })
        .filter((t) => t !== null);

      return {
        ...cat,
        tools: toolsWithMetadata,
      };
    },
  },
  mounted() {
    if (this.categoryData) {
      document.title = `${this.categoryData.label} - Flux`;
    }
  },
};
</script>

<style scoped></style>
