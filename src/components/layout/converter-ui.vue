<template>
  <div v-if="tool" class="max-w-2xl mx-auto">
    <div class="space-y-8">
      <!-- Input Value and Result (Desktop) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Valore</label>
          <div class="relative">
            <input
              v-model.number="value"
              type="number"
              class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all text-xl font-bold text-gray-900"
              placeholder="0"
              @input="autoConvert"
            />
          </div>
        </div>

        <div class="hidden md:block space-y-3">
          <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Risultato</label>
          <div class="h-[60px] px-5 flex items-center bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-black text-2xl text-indigo-700">
            {{ result !== null ? result : '---' }}
          </div>
        </div>
      </div>

      <!-- Unit Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Da</label>
          <select
            v-model="from"
            class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all text-lg font-medium text-gray-900 appearance-none cursor-pointer"
            @change="autoConvert"
          >
            <option v-for="u in tool.config.units" :key="u" :value="u">
              {{ tool.config.labels ? tool.config.labels[u] : u }}
            </option>
          </select>
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">A</label>
          <select
            v-model="to"
            class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all text-lg font-medium text-gray-900 appearance-none cursor-pointer"
            @change="autoConvert"
          >
            <option v-for="u in tool.config.units" :key="u" :value="u">
              {{ tool.config.labels ? tool.config.labels[u] : u }}
            </option>
          </select>
        </div>
      </div>

      <!-- Mobile Result -->
      <div v-if="result !== null" class="md:hidden p-6 bg-indigo-600 rounded-2xl shadow-inner text-white animate-fade-in">
        <span class="text-xs font-bold uppercase tracking-widest opacity-80">Risultato Finale</span>
        <div class="text-3xl font-black mt-1">
          {{ result }} <span class="text-xl font-medium opacity-90 ml-1">{{ tool.config.labels ? tool.config.labels[to] : to }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'converter-ui',
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
