<template>
  <navigation />
  <div class="relative pt-28 px-6">
    <div class="w-full max-w-[1024px] mx-auto">
      <div v-if="tool">
        <div class="w-full mb-8 text-center flex flex-col gap-4">
          <h2 v-if="tool.metadata.title" class="text-3xl font-extrabold text-white sm:text-4xl">
            {{ tool.metadata.title || 'Convertitore' }}
          </h2>
          <p v-if="tool.metadata.description" class="text-lg text-gray-300 max-w-2xl mx-auto">
            {{ tool.metadata.description }}
          </p>
        </div>

        <imageConverterUi v-if="tool.metadata.type === 'file-converter'" :tool="tool" />
        <videoConverterUi v-else-if="tool.metadata.type === 'video-converter'" :tool="tool" />
        <converterUi v-else :tool="tool" />
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

import navigation from '../components/navigation/navigation.vue';
import converterUi from '../components/layout/converter-ui.vue';
import imageConverterUi from '../components/layout/image-converter-ui.vue';
import videoConverterUi from '../components/layout/video-converter-ui.vue';

export default {
  name: 'Tool',
  components: {
    navigation,
    converterUi,
    imageConverterUi,
    videoConverterUi,
  },
  computed: {
    tool() {
      const slug = this.$route.params.slug;
      return tools[slug] || null;
    },
  },
};
</script>

<style scoped></style>
