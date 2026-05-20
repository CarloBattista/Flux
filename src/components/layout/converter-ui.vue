<template>
  <div v-if="tool" class="max-w-2xl mx-auto">
    <div class="space-y-8">
      <div class="w-full flex flex-col gap-8">
        <hrInput v-model.number="value" label="Valore" placeholder="0" @input="autoConvert" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <hrSelect
          v-model="from"
          label="Da"
          :options="tool.config.units.map((u) => ({ label: tool.config.labels ? tool.config.labels[u] : u, value: u }))"
          @update:modelValue="autoConvert"
        />
        <hrSelect
          v-model="to"
          label="A"
          :options="tool.config.units.map((u) => ({ label: tool.config.labels ? tool.config.labels[u] : u, value: u }))"
          @update:modelValue="autoConvert"
        />
      </div>
      <!-- Mobile Result -->
      <div v-if="result !== null" class="p-6 rounded-2xl bg-[#8e48ff] shadow-inner shadow-white/20 text-white animate-fade-in">
        <span class="text-xs font-bold uppercase tracking-widest opacity-80">Risultato Finale</span>
        <div class="text-3xl font-black mt-1">
          {{ result }} <span class="text-xl font-medium opacity-90 ml-1">{{ tool.config.labels ? tool.config.labels[to] : to }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hrInput from '../input/hr-input.vue';
import hrSelect from '../input/hr-select.vue';

export default {
  name: 'converter-ui',
  components: {
    hrInput,
    hrSelect,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      value: 0,
      from: '',
      to: '',
      result: null,
    };
  },
  methods: {
    autoConvert() {
      if (this.value !== null && this.from && this.to) {
        this.result = this.tool.convert(this.value, this.from, this.to);
      }
    },
    resetUnits() {
      if (this.tool) {
        this.from = this.tool.config.units[0];
        this.to = this.tool.config.units[1] || this.tool.config.units[0];
        this.autoConvert();
      }
    },
  },
  watch: {
    tool: {
      handler: 'resetUnits',
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
