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
          :options="tool.units.map((u) => ({ label: tool.labels ? tool.labels[u] : u, value: u }))"
          @update:modelValue="autoConvert"
        />
        <hrSelect
          v-model="to"
          label="A"
          :options="tool.units.map((u) => ({ label: tool.labels ? tool.labels[u] : u, value: u }))"
          @update:modelValue="autoConvert"
        />
      </div>
      <div class="p-6 rounded-2xl bg-[#8e48ff] shadow-inner shadow-white/20 text-white animate-fade-in">
        <span class="text-xs font-bold uppercase tracking-widest opacity-80">Risultato Finale</span>
        <div class="min-w-0 text-3xl font-black mt-1 flex items-baseline">
          <span
            @click="actionCopy"
            class="min-w-0 px-2 py-1 block rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 max-one-line cursor-pointer"
            >{{ result }}</span
          >
          <span class="text-xl font-medium opacity-90 ml-1">{{ tool.labels ? tool.labels[to] : to }}</span>
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
  props: { tool: Object, access: Boolean },
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
      if (this.tool && this.tool.units) {
        this.from = this.tool.units[0];
        this.to = this.tool.units[1] || this.tool.units[0];
        this.autoConvert();
      }
    },
    actionCopy() {
      if (this.result !== null) {
        navigator.clipboard.writeText(this.result);
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
