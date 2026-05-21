<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <hrTextarea v-model="inputText" label="Testo di Input" placeholder="Inserisci il testo qui..." class="font-mono" />
      <div class="relative group">
        <hrTextarea v-model="outputText" label="Risultato" :readonly="true" class="font-mono" />
        <div v-if="error" class="absolute top-0 right-0 text-red-400 text-xs font-medium px-1">{{ error }}</div>
        <hrButtonCopy v-if="outputText" :data="outputText" class="absolute top-10 right-3" />
      </div>
    </div>

    <div class="flex flex-wrap gap-4 items-center">
      <hrButton variant="core-primary" label="Codifica (Encode)" @click="handleEncode" />
      <hrButton variant="secondary" label="Decodifica (Decode)" @click="handleDecode" />
    </div>
  </div>
</template>

<script>
import hrTextarea from '../input/hr-textarea.vue';
import hrButton from '../button/hr-button.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'base64-converter-ui',
  components: {
    hrTextarea,
    hrButton,
    hrButtonCopy,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      inputText: '',
      outputText: '',
      error: null,
    };
  },
  methods: {
    handleEncode() {
      this.error = null;
      const result = this.tool.encodeBase64(this.inputText);
      if (result.success) {
        this.outputText = result.data;
      } else {
        this.error = result.error;
      }
    },
    handleDecode() {
      this.error = null;
      const result = this.tool.decodeBase64(this.inputText);
      if (result.success) {
        this.outputText = result.data;
      } else {
        this.error = result.error;
      }
    },
  },
};
</script>
