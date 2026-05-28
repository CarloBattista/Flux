<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <hrTextarea v-model="inputJson" label="Input JSON" placeholder='{"key": "value"}' class="font-mono" />
      <div class="relative group">
        <hrTextarea v-model="outputJson" label="Output JSON" :readonly="true" class="font-mono" />
        <div v-if="error" class="absolute top-0 right-0 text-red-400 text-xs font-medium px-1">{{ error }}</div>
        <hrButtonCopy v-if="outputJson" :data="outputJson" class="absolute top-10 right-3" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex-1 min-w-[200px]">
        <hrSelect v-model="indent" label="Indentazione" :options="tool.indentationOptions" />
      </div>
      <div class="flex gap-2">
        <hrButton variant="core-primary" label="Formatta" @click="handleFormat" />
        <hrButton variant="secondary" label="Minifica" @click="handleMinify" />
      </div>
    </div>
  </div>
</template>

<script>
import hrTextarea from '../input/hr-textarea.vue';
import hrSelect from '../input/hr-select.vue';
import hrButton from '../button/hr-button.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'json-formatter-ui',
  components: {
    hrTextarea,
    hrSelect,
    hrButton,
    hrButtonCopy,
  },
  props: { tool: Object, access: Boolean },
  data() {
    return {
      inputJson: '',
      outputJson: '',
      indent: 2,
      error: null,
    };
  },
  methods: {
    handleFormat() {
      this.error = null;
      const result = this.tool.formatJSON(this.inputJson, this.indent);
      if (result.success) {
        this.outputJson = result.data;
      } else {
        this.error = 'JSON non valido';
      }
    },
    handleMinify() {
      this.error = null;
      const result = this.tool.minifyJSON(this.inputJson);
      if (result.success) {
        this.outputJson = result.data;
      } else {
        this.error = 'JSON non valido';
      }
    },
  },
};
</script>

<style scoped></style>
