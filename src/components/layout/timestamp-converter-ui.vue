<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-8">
    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <h3 class="text-xl font-bold text-white">Da Timestamp a Data</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <hrInput v-model="timestampInput" label="Timestamp (s o ms)" placeholder="Es: 1716249600" />
        <div class="flex items-end pb-1">
          <hrButton variant="core-primary" label="Converti in Data" @click="handleToDate" class="w-full" />
        </div>
      </div>

      <div v-if="dateResults" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <span class="text-xs font-medium text-gray-400 uppercase">Locale</span>
          <div class="text-white font-mono mt-1 break-all">{{ dateResults.local }}</div>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <span class="text-xs font-medium text-gray-400 uppercase">ISO 8601</span>
          <div class="text-white font-mono mt-1 break-all">{{ dateResults.iso }}</div>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <span class="text-xs font-medium text-gray-400 uppercase">UTC</span>
          <div class="text-white font-mono mt-1 break-all">{{ dateResults.utc }}</div>
        </div>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <h3 class="text-xl font-bold text-white">Da Data a Timestamp</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <hrInput v-model="dateInput" label="Data (ISO, Locale, ecc.)" placeholder="Es: 2024-05-21T00:00:00Z" />
        <div class="flex items-end pb-1">
          <hrButton variant="core-primary" label="Converti in Timestamp" @click="handleFromDate" class="w-full" />
        </div>
      </div>

      <div v-if="timestampResults" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div class="relative group p-3 rounded-xl bg-white/5 border border-white/10">
          <span class="text-xs font-medium text-gray-400 uppercase">Secondi</span>
          <div class="text-white font-mono text-xl mt-1">{{ timestampResults.seconds }}</div>
          <hrButtonCopy :data="timestampResults.seconds.toString()" class="absolute top-2 right-2" />
        </div>
        <div class="relative group p-3 rounded-xl bg-white/5 border border-white/10">
          <span class="text-xs font-medium text-gray-400 uppercase">Millisecondi</span>
          <div class="text-white font-mono text-xl mt-1">{{ timestampResults.milliseconds }}</div>
          <hrButtonCopy :data="timestampResults.milliseconds.toString()" class="absolute top-2 right-2" />
        </div>
      </div>
    </div>

    <div class="flex">
      <hrButton variant="secondary" label="Usa Timestamp Attuale" @click="useNow" />
    </div>

    <div v-if="error" class="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-center">
      {{ error }}
    </div>
  </div>
</template>

<script>
import hrInput from '../input/hr-input.vue';
import hrButton from '../button/hr-button.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'timestamp-converter-ui',
  components: {
    hrInput,
    hrButton,
    hrButtonCopy,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      timestampInput: '',
      dateInput: '',
      dateResults: null,
      timestampResults: null,
      error: null,
    };
  },
  methods: {
    handleToDate() {
      this.error = null;
      this.timestampResults = null;
      const result = this.tool.toDate(this.timestampInput);
      if (result.success) {
        this.dateResults = result.data;
      } else {
        this.error = result.error;
        this.dateResults = null;
      }
    },
    handleFromDate() {
      this.error = null;
      this.dateResults = null;
      const result = this.tool.fromDate(this.dateInput);
      if (result.success) {
        this.timestampResults = result.data;
      } else {
        this.error = result.error;
        this.timestampResults = null;
      }
    },
    useNow() {
      const now = Date.now();
      this.timestampInput = Math.floor(now / 1000).toString();
      this.dateInput = new Date().toISOString();
      this.handleToDate();
      this.handleFromDate();
    },
  },
  mounted() {
    this.useNow();
  },
};
</script>
