<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Color Preview & Picker -->
      <div class="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
        <div class="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl" :style="{ backgroundColor: color }"></div>
        <div class="flex flex-col gap-2 w-full max-w-xs">
          <label class="text-sm font-medium text-gray-400">Seleziona Colore</label>
          <input
            type="color"
            v-model="color"
            @input="updateFromHex"
            class="w-full h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer"
          />
        </div>
      </div>

      <!-- Result Formats -->
      <div class="space-y-4">
        <div v-for="(val, format) in formats" :key="format" class="relative group">
          <hrInput :label="format.toUpperCase()" v-model="formats[format]" :readonly="true" class="font-mono" />
          <hrButtonCopy :data="val" class="absolute top-8 right-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hrInput from '../input/hr-input.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'color-picker-converter-ui',
  components: {
    hrInput,
    hrButtonCopy,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      color: '#6366f1',
      formats: {
        hex: '#6366F1',
        rgb: 'rgb(99, 102, 241)',
        hsl: 'hsl(239, 84%, 67%)',
        cmyk: 'cmyk(59%, 58%, 0%, 5%)',
      },
    };
  },
  methods: {
    updateFromHex() {
      const result = this.tool.parseColor(this.color);
      if (result.success) {
        this.formats = result.data;
      }
    },
  },
  mounted() {
    if (this.tool?.config?.defaultColor) {
      this.color = this.tool.config.defaultColor;
      this.updateFromHex();
    }
  },
};
</script>
