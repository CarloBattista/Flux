<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="grid grid-cols-1 gap-4">
      <div class="relative group">
        <hrTextarea
          v-model="outputText"
          label="UUID Generati"
          :readonly="true"
          class="font-mono"
          rows="8"
          placeholder="Gli UUID generati appariranno qui..."
        />
        <hrButtonCopy v-if="outputText" :data="outputText" class="absolute top-10 right-3" />
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6 items-end">
      <div class="w-full md:w-48">
        <hrInput v-model.number="count" type="number" label="Quantità" min="1" max="100" />
      </div>

      <div class="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="uppercase"
          v-model="uppercase"
          class="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
        />
        <label for="uppercase" class="text-sm font-medium text-gray-300">Maiuscolo</label>
      </div>

      <div class="flex-1 flex justify-end">
        <hrButton variant="core-primary" label="Genera UUID" @click="handleGenerate" class="w-full md:w-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import hrTextarea from '../input/hr-textarea.vue';
import hrInput from '../input/hr-input.vue';
import hrButton from '../button/hr-button.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'uuid-generator-ui',
  components: {
    hrTextarea,
    hrInput,
    hrButton,
    hrButtonCopy,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      outputText: '',
      count: 1,
      version: 'v4',
      uppercase: false,
      hyphens: true,
      braces: false,
    };
  },
  methods: {
    handleGenerate() {
      const validCount = Math.max(1, Math.min(100, parseInt(this.count) || 1));
      this.count = validCount;

      this.outputText = this.tool.generateUUID({
        count: this.count,
        version: this.version,
        uppercase: this.uppercase,
        hyphens: this.hyphens,
        braces: this.braces,
      });
    },
  },
  watch: {
    // Rigenera automaticamente quando cambiano le opzioni di formattazione
    uppercase() {
      this.handleGenerate();
    },
    hyphens() {
      this.handleGenerate();
    },
    braces() {
      this.handleGenerate();
    },
    version() {
      this.handleGenerate();
    },
  },
  mounted() {
    this.handleGenerate();
  },
};
</script>
