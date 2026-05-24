<template>
  <navigation />
  <div class="relative pt-24 px-6 pb-20">
    <div class="w-full max-w-[1024px] mx-auto">
      <div v-if="tool">
        <!-- Breadcrumbs -->
        <nav class="flex mb-8 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <RouterLink to="/" class="hover:text-white transition-colors">Home</RouterLink>
            </li>
            <li v-if="category" class="flex items-center space-x-2">
              <ChevronRight size="14" />
              <span class="hover:text-white transition-colors cursor-default">{{ category.label }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <ChevronRight size="14" />
              <span class="text-white">{{ tool.metadata.title }}</span>
            </li>
          </ol>
        </nav>

        <!-- Header -->
        <div class="w-full mb-12 flex flex-col items-center text-center gap-6">
          <div
            class="relative h-16 aspect-square rounded-3xl bg-white/5 flex items-center justify-center text-[#8e48ff] shadow-xl shadow-[#8e48ff]/5 border border-white/10"
          >
            <component :is="tool.metadata.icon" size="32" stroke-width="1.5" />
            <span
              v-if="tool.metadata.new"
              class="absolute top-0 right-1.5 translate-x-[50%] translate-y-[-50%] bg-green-600/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-600/30"
            >
              NEW
            </span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-center gap-3">
              <h1 class="md:text-4xl text-2xl font-extrabold text-white sm:text-5xl tracking-tight">
                {{ tool.metadata.title }}
              </h1>
            </div>
            <p v-if="tool.metadata.description" class="md:text-lg text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {{ tool.metadata.description }}
            </p>
          </div>
        </div>

        <!-- Tool UI -->
        <div class="min-h-[400px]">
          <component :is="toolComponent" :tool="tool" />
        </div>

        <!-- Related Tools -->
        <div v-if="relatedTools.length > 0" class="mt-24">
          <h3 class="text-xl font-bold text-white mb-8">Altri strumenti in {{ category?.label }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <RouterLink
              v-for="related in relatedTools"
              :key="related.metadata.slug"
              :to="'/tool/' + related.metadata.slug"
              class="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <div class="flex items-center gap-4">
                <div
                  class="h-12 aspect-square rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#8e48ff] transition-colors"
                >
                  <component :is="related.metadata.icon" size="24" />
                </div>
                <div>
                  <h4 class="text-white font-semibold group-hover:text-white transition-colors">{{ related.metadata.title }}</h4>
                  <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ related.metadata.description }}</p>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-300">Strumento non trovato</h2>
        <RouterLink to="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">Torna alla Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { tools } from '../toolsRegistry';
import { handleTool } from '../api/userTools';

import navigation from '../components/navigation/navigation.vue';
import hrButton from '../components/button/hr-button.vue';

// UI
import converterUi from '../components/layout/converter-ui.vue';
import imageConverterUi from '../components/layout/image-converter-ui.vue';
import videoConverterUi from '../components/layout/video-converter-ui.vue';
import audioConverterUi from '../components/layout/audio-converter-ui.vue';
import imageCompressorUi from '../components/layout/image-compressor-ui.vue';
import videoCompressorUi from '../components/layout/video-compressor-ui.vue';
import jsonFormatterUi from '../components/layout/json-formatter-ui.vue';
import base64ConverterUi from '../components/layout/base64-converter-ui.vue';
import jwtDecoderUi from '../components/layout/jwt-decoder-ui.vue';
import regexTesterUi from '../components/layout/regex-tester-ui.vue';
import timestampConverterUi from '../components/layout/timestamp-converter-ui.vue';
import uuidGeneratorUi from '../components/layout/uuid-generator-ui.vue';
import colorPickerConverterUi from '../components/layout/color-picker-converter-ui.vue';

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
  Regex,
  Calendar,
  Fingerprint,
  Palette,
  ImageDown,
} from '@lucide/vue';

export default {
  name: 'Tool',
  components: {
    navigation,
    hrButton,

    converterUi,
    imageConverterUi,
    videoConverterUi,
    audioConverterUi,
    imageCompressorUi,
    videoCompressorUi,
    jsonFormatterUi,
    base64ConverterUi,
    jwtDecoderUi,
    regexTesterUi,
    timestampConverterUi,
    uuidGeneratorUi,
    colorPickerConverterUi,

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
    Regex,
    Calendar,
    Fingerprint,
    Palette,
    ImageDown,
  },
  data() {
    return {
      categories: {
        media: {
          label: 'Media',
          tools: [tools['image-converter'], tools['image-compressor'], tools['video-converter'], tools['video-compressor'], tools['audio-converter']],
        },
        units: {
          label: 'Unità',
          tools: [tools.temperature, tools.time, tools.velocity, tools['data-transfer-rate']],
        },
        devtools: {
          label: 'DevTools',
          tools: [
            tools['json-formatter'],
            tools['base64-converter'],
            tools['jwt-decoder'],
            tools['regex-tester'],
            tools['timestamp-converter'],
            tools['uuid-generator'],
            tools['color-picker-converter'],
          ],
        },
      },
    };
  },
  computed: {
    tool() {
      const slug = this.$route.params.slug;
      return tools[slug] || null;
    },
    toolComponent() {
      if (!this.tool) return 'converterUi';

      const typeMap = {
        'file-converter': 'imageConverterUi',
        'video-converter': 'videoConverterUi',
        'audio-converter': 'audioConverterUi',
        'image-tool': 'imageCompressorUi',
        'video-compressor': 'videoCompressorUi',
        'json-formatter': 'jsonFormatterUi',
        'base64-converter': 'base64ConverterUi',
        'jwt-decoder': 'jwtDecoderUi',
        'regex-tester': 'regexTesterUi',
        'timestamp-converter': 'timestampConverterUi',
        'uuid-generator': 'uuidGeneratorUi',
        'color-picker-converter': 'colorPickerConverterUi',
      };

      return typeMap[this.tool.metadata.type] || 'converterUi';
    },
    category() {
      if (!this.tool) return null;
      for (const key in this.categories) {
        if (this.categories[key].tools.some((t) => t.metadata.slug === this.tool.metadata.slug)) {
          return this.categories[key];
        }
      }
      return null;
    },
    relatedTools() {
      if (!this.category || !this.tool) return [];
      return this.category.tools.filter((t) => t.metadata.slug !== this.tool.metadata.slug).slice(0, 3);
    },
  },
  watch: {
    tool: {
      handler(newTool) {
        if (newTool) {
          document.title = `${newTool.metadata.title} - Flux`;
          handleTool(newTool);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
