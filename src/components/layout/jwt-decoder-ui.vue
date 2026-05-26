<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col gap-6">
      <div class="space-y-2">
        <hrTextarea
          v-model="token"
          label="JWT Token"
          placeholder="Inserisci qui il tuo JWT..."
          class="font-mono min-h-[120px]"
          @input="handleDecode"
        />
        <div v-if="error" class="text-red-400 text-sm font-medium">{{ error }}</div>
      </div>

      <div
        v-if="expirationInfo || algorithm"
        class="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between gap-4 flex-wrap"
      >
        <div class="flex items-center gap-6">
          <div v-if="algorithm" class="flex flex-col">
            <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Algoritmo</span>
            <span class="text-sm font-mono text-[#8e48ff]">{{ algorithm }}</span>
          </div>

          <div v-if="expirationInfo" class="flex items-center gap-3">
            <div :class="['w-2 h-2 rounded-full', expirationInfo.isExpired ? 'bg-red-500' : 'bg-green-500']"></div>
            <span class="text-sm text-gray-300">
              {{ expirationInfo.isExpired ? 'Scaduto il:' : 'Scade il:' }}
              <span class="font-medium text-white">{{ expirationInfo.expirationDate }}</span>
            </span>
          </div>
        </div>

        <div v-if="expirationInfo && !expirationInfo.isExpired" class="text-xs text-gray-400">
          Scade tra circa {{ formatTimeLeft(expirationInfo.timeLeft) }}
        </div>
      </div>

      <div v-if="decoded" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative group">
          <div class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Header</div>
          <div class="relative">
            <pre class="p-4 rounded-xl border border-white/10 bg-white/5 text-xs text-blue-300 font-mono overflow-auto max-h-[300px]">{{
              JSON.stringify(decoded.header, null, 2)
            }}</pre>
            <hrButtonCopy :data="JSON.stringify(decoded.header, null, 2)" class="absolute top-2 right-2" />
          </div>
        </div>

        <div class="relative group">
          <div class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Payload</div>
          <div class="relative">
            <pre class="p-4 rounded-xl border border-white/10 bg-white/5 text-xs text-purple-300 font-mono overflow-auto max-h-[300px]">{{
              JSON.stringify(decoded.payload, null, 2)
            }}</pre>
            <hrButtonCopy :data="JSON.stringify(decoded.payload, null, 2)" class="absolute top-2 right-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hrTextarea from '../input/hr-textarea.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'jwt-decoder-ui',
  components: {
    hrTextarea,
    hrButtonCopy,
  },
  props: { tool: Object, access: Boolean },
  data() {
    return {
      token: '',
      decoded: null,
      expirationInfo: null,
      error: null,
      algorithm: null,
    };
  },
  methods: {
    handleDecode() {
      this.error = null;
      if (!this.token.trim()) {
        this.decoded = null;
        this.expirationInfo = null;
        this.algorithm = null;
        return;
      }

      const result = this.tool.decodeJWT(this.token.trim());
      if (result.success && result.data) {
        this.decoded = result.data;
        this.algorithm = this.decoded.header.alg || 'N/A';
        this.expirationInfo = this.tool.getExpirationInfo(this.decoded.payload);
      } else {
        this.decoded = null;
        this.expirationInfo = null;
        this.algorithm = null;
        this.error = result.error || 'Token non valido';
      }
    },
    formatTimeLeft(seconds) {
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
      return `${Math.floor(seconds / 86400)}d`;
    },
  },
};
</script>

<style scoped>
pre {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
pre::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
