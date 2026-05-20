<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div
      class="relative border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      :class="{ 'opacity-50 pointer-events-none': isConverting || isReading, 'border-green-400 bg-green-50': videoReady }"
      @click="!isConverting && !isReading && $refs.fileInput.click()"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input type="file" ref="fileInput" class="hidden" accept="video/*" @change="handleFileSelect" />

      <div v-if="!selectedFile && !isReading" class="space-y-4">
        <div class="flex justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-700">Trascina un video qui</p>
      </div>

      <div v-else-if="isReading || isConverting" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="text-indigo-600 font-bold">{{ isReading ? 'Caricamento video...' : 'Conversione in corso...' }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex justify-center">
          <video ref="previewVideo" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" controls @loadedmetadata="onVideoLoaded"></video>
        </div>
        <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
      </div>
    </div>

    <!-- Opzioni di Conversione -->
    <div v-if="selectedFile && !isReading" class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Formato di Destinazione</label>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <button
            v-for="format in tool.config.formats"
            :key="format"
            @click="targetFormat = format"
            :class="[
              'py-2 px-1 rounded-xl font-bold text-xs transition-all',
              targetFormat === format ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ tool.config.labels[format] }}
          </button>
        </div>
      </div>

      <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
        <p class="text-amber-800 text-xs">
          Nota: La conversione video lato client è limitata. Per conversioni professionali è consigliato l'uso di FFmpeg.
        </p>
      </div>

      <button
        @click="convertVideo"
        :disabled="isConverting || !videoReady"
        class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
      >
        Converti e Scarica
      </button>
      <button @click="reset" class="w-full text-xs text-gray-400 hover:text-gray-600">Cambia file</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-converter-ui',
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      targetFormat: 'mp4',
      isConverting: false,
      isReading: false,
      videoReady: false,
    };
  },
  methods: {
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) this.setFile(file);
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (file) this.setFile(file);
    },
    setFile(file) {
      this.videoReady = false;
      this.isReading = true;
      this.selectedFile = file;

      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = URL.createObjectURL(file);
      this.isReading = false;
    },
    onVideoLoaded() {
      this.videoReady = true;
    },
    reset() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.selectedFile = null;
      this.previewUrl = null;
      this.videoReady = false;
      this.isReading = false;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
    },
    async convertVideo() {
      if (!this.videoReady) return;
      this.isConverting = true;

      // Simulazione conversione (in un'app reale qui si userebbe ffmpeg.wasm)
      setTimeout(() => {
        const fileName = this.selectedFile.name.split('.')[0];
        this.downloadFile(this.selectedFile, `${fileName}.${this.targetFormat}`);
        this.isConverting = false;
      }, 1500);
    },
    downloadFile(blob, name) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = name;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    },
  },
  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  },
};
</script>
