<template>
  <div v-if="tool" class="max-w-4xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <hrInput v-model="pattern" label="Espressione Regolare" placeholder="([a-z]+)" class="font-mono" @input="handleTest" />
      </div>
      <div>
        <hrInput v-model="flags" label="Flags" placeholder="gi" class="font-mono" @input="handleTest" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <hrTextarea
        v-model="testText"
        label="Testo da testare"
        placeholder="Inserisci il testo qui..."
        class="font-mono min-h-[200px]"
        @input="handleTest"
      />
      <div class="relative flex flex-col h-full">
        <span class="text-xs font-bold text-white/50 tracking-widest mb-2 px-1">Risultati</span>
        <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto font-mono text-sm min-h-[200px]">
          <div v-if="error" class="text-red-400">{{ error }}</div>
          <div v-else-if="matches.length === 0" class="text-white/30 italic">Nessuna corrispondenza trovata</div>
          <div v-else class="space-y-4">
            <div v-for="(match, index) in matches" :key="index" class="p-3 bg-white/5 rounded-xl border border-white/5">
              <div class="flex justify-between items-center mb-1">
                <span class="text-indigo-400 font-bold text-xs uppercase">Match {{ index + 1 }}</span>
                <span class="text-white/40 text-[10px]">Indice: {{ match.index }}</span>
              </div>
              <div class="text-white break-all">{{ match.value }}</div>
              <div v-if="match.groups && match.groups.length > 0" class="mt-2 pt-2 border-t border-white/5 space-y-1">
                <div v-for="(group, gIndex) in match.groups" :key="gIndex" class="flex gap-2 text-[11px]">
                  <span class="text-white/40">Gruppo {{ gIndex + 1 }}:</span>
                  <span class="text-green-400 break-all">{{ group || 'undefined' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="matches.length > 0" class="mt-2 text-right">
          <span class="text-xs font-medium text-indigo-400">{{ matches.length }} corrispondenze trovate</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hrInput from '../input/hr-input.vue';
import hrTextarea from '../input/hr-textarea.vue';

export default {
  name: 'regex-tester-ui',
  components: {
    hrInput,
    hrTextarea,
  },
  props: {
    tool: Object,
  },
  data() {
    return {
      pattern: '',
      flags: '',
      testText: '',
      matches: [],
      error: null,
    };
  },
  methods: {
    handleTest() {
      const result = this.tool.testRegex(this.pattern, this.flags, this.testText);
      this.matches = result.matches;
      this.error = result.error;
    },
  },
  mounted() {
    if (this.tool && this.tool.config) {
      this.pattern = this.tool.config.defaultRegex;
      this.flags = this.tool.config.defaultFlags;
      this.testText = this.tool.config.defaultText;
      this.handleTest();
    }
  },
};
</script>

<style scoped></style>
