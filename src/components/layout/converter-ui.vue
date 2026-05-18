<template>
  <div v-if="tool" class="bg-white shadow-sm rounded-xl p-6 border border-gray-100 max-w-2xl mx-auto">
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Input Value -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Valore da convertire</label>
          <input 
            v-model.number="value" 
            type="number" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="0"
          />
        </div>

        <!-- Result Display (Desktop) -->
        <div class="hidden md:flex flex-col justify-end space-y-2">
          <label class="block text-sm font-medium text-gray-700">Risultato</label>
          <div class="h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-indigo-700">
            {{ result !== null ? result : '-' }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- From Unit -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Da</label>
          <select 
            v-model="from" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
          >
            <option disabled value="">Seleziona unità</option>
            <option v-for="u in tool.config.units" :key="u" :value="u">
              {{ u }}
            </option>
          </select>
        </div>

        <!-- To Unit -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">A</label>
          <select 
            v-model="to" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
          >
            <option disabled value="">Seleziona unità</option>
            <option v-for="u in tool.config.units" :key="u" :value="u">
              {{ u }}
            </option>
          </select>
        </div>
      </div>

      <!-- Action Button -->
      <button 
        @click="convert" 
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-indigo-200/50"
      >
        Converti Ora
      </button>

      <!-- Mobile Result -->
      <div v-if="result !== null" class="md:hidden mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
        <span class="text-sm text-indigo-600 font-medium">Risultato:</span>
        <div class="text-2xl font-bold text-indigo-900">{{ result }} {{ to }}</div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-64 text-gray-500 italic">
    <div class="animate-pulse">Caricamento strumento in corso...</div>
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
      from: this.tool ? this.tool.config.units[0] : '',
      to: this.tool ? this.tool.config.units[1] || this.tool.config.units[0] : '',
      result: null,
    };
  },
  methods: {
    convert() {
      this.result = this.tool.convert(this.value, this.from, this.to);
    },
    resetUnits() {
      if (this.tool) {
        this.from = this.tool.config.units[0];
        this.to = this.tool.config.units[1] || this.tool.config.units[0];
        this.result = null;
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
