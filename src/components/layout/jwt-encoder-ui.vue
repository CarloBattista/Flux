<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div class="space-y-2">
          <hrSelect v-model="selectedAlgorithm" label="Algoritmo di Firma" :options="algorithms" @update:modelValue="updateHeaderAlg" />
        </div>

        <div class="space-y-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Header (JSON)</div>
          <hrTextarea v-model="headerStr" class="font-mono min-h-[100px]" @input="handleEncode" />
        </div>

        <div class="space-y-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payload (JSON)</div>
          <hrTextarea v-model="payloadStr" class="font-mono min-h-[180px]" @input="handleEncode" />
        </div>

        <div v-if="selectedAlgorithm !== 'none'" class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {{ isAsymmetric ? 'Private Key (PKCS#8 PEM)' : 'Secret Key' }}
            </div>
          </div>
          <hrTextarea
            v-model="secret"
            :placeholder="isAsymmetric ? '-----BEGIN PRIVATE KEY-----...' : 'Inserisci il segreto HMAC...'"
            class="font-mono min-h-[120px]"
            @input="handleEncode"
          />
          <p v-if="isAsymmetric" class="text-[10px] text-gray-500 italic">
            Nota: Per RS/PS/ES è richiesta una chiave privata in formato PEM (PKCS#8).
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Generated JWT</div>
        <div class="relative">
          <div
            class="p-4 rounded-xl border border-white/10 bg-white/5 text-sm font-mono break-all min-h-[350px] text-gray-300"
            :class="{ 'text-red-400': error }"
          >
            <template v-if="error">{{ error }}</template>
            <template v-else-if="encodedToken">
              <span class="text-blue-400">{{ tokenParts.header }}</span
              ><span class="text-white">.</span> <span class="text-purple-400">{{ tokenParts.payload }}</span
              ><span class="text-white">.</span>
              <span class="text-pink-400">{{ tokenParts.signature }}</span>
            </template>
          </div>
          <hrButtonCopy v-if="encodedToken && !error" :data="encodedToken" class="absolute top-2 right-2" />
        </div>
        <div v-if="warning" class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs">{{ warning }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import hrTextarea from '../input/hr-textarea.vue';
import hrSelect from '../input/hr-select.vue';
import hrButtonCopy from '../button/hr-button-copy.vue';

export default {
  name: 'jwt-encoder-ui',
  components: {
    hrTextarea,
    hrSelect,
    hrButtonCopy,
  },
  props: { tool: Object, access: Boolean },
  data() {
    return {
      selectedAlgorithm: 'HS256',
      algorithms: [
        { label: 'HS256', value: 'HS256' },
        { label: 'HS384', value: 'HS384' },
        { label: 'HS512', value: 'HS512' },
        { label: 'RS256', value: 'RS256' },
        { label: 'RS384', value: 'RS384' },
        { label: 'RS512', value: 'RS512' },
        { label: 'PS256', value: 'PS256' },
        { label: 'PS384', value: 'PS384' },
        { label: 'PS512', value: 'PS512' },
        { label: 'ES256', value: 'ES256' },
        { label: 'ES384', value: 'ES384' },
        { label: 'ES512', value: 'ES512' },
        { label: 'none', value: 'none' },
      ],
      headerStr: JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2),
      payloadStr: JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: Math.floor(Date.now() / 1000) }, null, 2),
      secret: 'your-256-bit-secret',
      encodedToken: '',
      error: null,
      warning: null,
    };
  },
  computed: {
    isAsymmetric() {
      return /^(RS|PS|ES)/.test(this.selectedAlgorithm);
    },
    tokenParts() {
      if (!this.encodedToken) return { header: '', payload: '', signature: '' };
      const parts = this.encodedToken.split('.');
      return { header: parts[0] || '', payload: parts[1] || '', signature: parts[2] || '' };
    },
  },
  methods: {
    updateHeaderAlg() {
      try {
        const header = JSON.parse(this.headerStr);
        header.alg = this.selectedAlgorithm;
        this.headerStr = JSON.stringify(header, null, 2);
        this.handleEncode();
      } catch (e) {
        this.handleEncode();
      }
    },
    async handleEncode() {
      this.error = null;
      this.warning = null;
      try {
        const header = JSON.parse(this.headerStr);
        const payload = JSON.parse(this.payloadStr);
        if (header.alg && header.alg !== this.selectedAlgorithm) {
          const found = this.algorithms.find((a) => a.value === header.alg);
          if (found) this.selectedAlgorithm = header.alg;
        }
        const result = await this.tool.encodeJWT(header, payload, this.secret);
        if (result.success) {
          this.encodedToken = result.data;
          this.warning = result.warning;
        } else {
          this.error = result.error;
          this.encodedToken = '';
        }
      } catch (err) {
        this.error = err.message;
        this.encodedToken = '';
      }
    },
  },
  mounted() {
    this.handleEncode();
  },
};
</script>

<style scoped>
.break-all {
  word-break: break-all;
}
</style>
