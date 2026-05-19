<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div
      class="relative border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      :class="{ 'opacity-50 pointer-events-none': isConverting, 'border-green-400 bg-green-50': imageReady }"
      @click="!isConverting && $refs.fileInput.click()"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />

      <div v-if="!selectedFile" class="space-y-4">
        <div class="flex justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-700">Trascina un'immagine qui</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex justify-center">
          <img ref="previewImg" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" @load="onImageLoaded" />
        </div>
        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
          File pronto per la conversione
        </div>
        <p class="text-sm text-gray-500">{{ selectedFile.name }}</p>
      </div>
    </div>

    <!-- Opzioni di Conversione -->
    <div v-if="selectedFile" class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Formato di destinazione</label>
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="format in tool.config.formats"
            :key="format"
            @click="targetFormat = format"
            :class="[
              'py-3 px-4 rounded-xl font-bold transition-all',
              targetFormat === format ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ tool.config.labels[format] }}
          </button>
        </div>
      </div>

      <button
        @click="convertImage"
        :disabled="isConverting || !imageReady"
        class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
      >
        {{ isConverting ? 'Conversione...' : 'Scarica Immagine' }}
      </button>

      <button @click="reset" class="w-full text-sm text-gray-400 hover:text-gray-600 font-medium">Annulla e scegli un altro file</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-converter-ui',
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      targetFormat: 'png',
      isConverting: false,
      imageReady: false,
    };
  },
  methods: {
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) this.setFile(file);
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) this.setFile(file);
    },
    setFile(file) {
      this.imageReady = false;
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    onImageLoaded() {
      this.imageReady = true;
    },
    reset() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageReady = false;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
    },
    async convertImage() {
      if (!this.imageReady) return;
      this.isConverting = true;
      try {
        const img = this.$refs.previewImg;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const link = document.createElement('a');
        link.download = `convertito.${this.targetFormat}`;
        link.href = canvas.toDataURL(`image/${this.targetFormat}`, 0.9);
        link.click();
      } finally {
        this.isConverting = false;
      }
    },
  },
};
</script>
