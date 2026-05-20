<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {{ tool.metadata.title || 'Convertitore' }}
      </h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">
        {{ tool.metadata.description }}
      </p>
    </div>

    <imageConverterUi v-if="tool.metadata.type === 'file-converter'" :tool="tool" />
    <videoConverterUi v-else-if="tool.metadata.type === 'video-converter'" :tool="tool" />
    <converterUi v-else :tool="tool" />

    <div class="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
      <h3 class="text-indigo-800 font-bold mb-2">Suggerimento</h3>
      <p class="text-indigo-700 text-sm">
        {{
          tool.metadata.type === 'file-converter'
            ? 'Carica un file, scegli il formato di destinazione e clicca su Converti.'
            : 'Inserisci il valore e seleziona le unità di misura per ottenere istantaneamente la conversione.'
        }}
      </p>
    </div>
  </div>
  <div v-else class="text-center py-20">
    <h2 class="text-2xl font-bold text-gray-400">Strumento non trovato</h2>
    <RouterLink to="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">Torna alla Home</RouterLink>
  </div>
</template>

<script>
import { tools } from '../toolsRegistry';

import converterUi from '../components/layout/converter-ui.vue';
import imageConverterUi from '../components/layout/image-converter-ui.vue';
import videoConverterUi from '../components/layout/video-converter-ui.vue';

export default {
  name: 'Tool',
  components: {
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
