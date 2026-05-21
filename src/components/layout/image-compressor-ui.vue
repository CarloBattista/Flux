<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      accept="image/jpeg,image/png,image/webp"
      :success="imageReady"
      :has-file="!!selectedFile"
      :loading="isReading || isCompressing"
      :disabled="isCompressing || isReading"
      @file-selected="setFile"
      ref="dropzone"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
          <p class="text-white font-bold">{{ isReading ? 'Lettura immagine...' : 'Compressione in corso...' }}</p>
        </div>
      </template>

      <template #preview>
        <div class="space-y-4">
          <div class="flex justify-center">
            <img ref="previewImg" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" @load="onImageLoaded" />
          </div>
          <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} ({{ formatSize(selectedFile.size) }})</p>
        </div>
      </template>
    </hrDropzone>

    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div class="space-y-4">
        <h2 class="block text-sm font-semibold text-gray-300 tracking-wider">Qualità: {{ Math.round(quality * 100) }}%</h2>
        <hrSlider v-model="quality" :min="tool.config.minQuality" :max="tool.config.maxQuality" :step="tool.config.step" />
        <div class="flex justify-between text-xs font-medium text-gray-400 px-1">
          <span>Più piccolo</span>
          <span>Migliore qualità</span>
        </div>
      </div>

      <div v-if="compressedSize" class="p-4 bg-gray-50 rounded-xl space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Dimensione originale:</span>
          <span class="font-medium text-gray-700">{{ formatSize(selectedFile.size) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Dimensione stimata:</span>
          <span class="font-medium text-[#8e48ff]">{{ formatSize(compressedSize) }}</span>
        </div>
        <div class="flex justify-between text-sm font-bold">
          <span class="text-gray-500">Risparmio:</span>
          <span class="text-green-600">{{ reductionPercentage }}%</span>
        </div>
      </div>

      <div class="w-full mt-auto flex flex-col gap-2">
        <hrButton
          @click="compressAndDownload"
          size="large"
          variant="core-primary"
          label="Comprimi e Scarica"
          :disabled="isCompressing || !imageReady"
          class="w-full"
        />
        <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import hrDropzone from '../input/hr-dropzone.vue';
import hrSlider from '../input/hr-slider.vue';
import hrButton from '../button/hr-button.vue';

export default {
  name: 'image-compressor-ui',
  components: {
    hrDropzone,
    hrSlider,
    hrButton,
  },
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      quality: 0.8,
      isCompressing: false,
      isReading: false,
      imageReady: false,
      compressedSize: null,
    };
  },
  computed: {
    reductionPercentage() {
      if (!this.selectedFile || !this.compressedSize || this.compressedSize >= this.selectedFile.size) return 0;
      const reduction = ((this.selectedFile.size - this.compressedSize) / this.selectedFile.size) * 100;
      return Math.round(reduction);
    },
  },
  methods: {
    formatSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    async setFile(file) {
      this.imageReady = false;
      this.isReading = true;
      this.selectedFile = file;
      this.quality = this.tool.config.defaultQuality;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
        this.isReading = false;
      };
      reader.readAsDataURL(file);
    },
    onImageLoaded() {
      this.imageReady = true;
      this.estimateSize();
    },
    reset() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageReady = false;
      this.isReading = false;
      this.compressedSize = null;
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
      }
    },
    async estimateSize() {
      const img = this.$refs.previewImg;
      if (!img) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Se è un PNG, usiamo WebP o JPEG per la compressione reale,
      // altrimenti il browser ignora il parametro qualità per i PNG
      let mimeType = this.selectedFile.type;
      if (mimeType === 'image/png' && this.quality < 1) {
        mimeType = 'image/webp'; // WebP supporta la trasparenza ed è più efficiente
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Se la dimensione stimata è maggiore dell'originale, mostriamo l'originale
            this.compressedSize = blob.size > this.selectedFile.size ? this.selectedFile.size : blob.size;
          }
        },
        mimeType,
        this.quality
      );
    },
    async compressAndDownload() {
      if (!this.imageReady) return;
      this.isCompressing = true;

      try {
        const img = this.$refs.previewImg;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const fileNameParts = this.selectedFile.name.split('.');
        const originalExt = fileNameParts.pop();
        const baseName = fileNameParts.join('.');

        let mimeType = this.selectedFile.type;
        let finalExt = originalExt;

        // Gestione speciale PNG: se vogliamo comprimere, cambiamo formato o usiamo l'originale se più piccolo
        if (mimeType === 'image/png' && this.quality < 1) {
          mimeType = 'image/webp';
          finalExt = 'webp';
        }

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < this.selectedFile.size) {
              this.downloadFile(blob, `${baseName}_compressed.${finalExt}`);
            } else {
              // Se il "compresso" è più grande, scarichiamo l'originale
              this.downloadFile(this.selectedFile, this.selectedFile.name);
            }
            this.isCompressing = false;
          },
          mimeType,
          this.quality
        );
      } catch (error) {
        console.error('Errore compressione:', error);
        this.isCompressing = false;
      }
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
  watch: {
    quality: {
      handler() {
        if (this.imageReady) {
          this.estimateSize();
        }
      },
    },
  },
};
</script>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #8e48ff;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid white;
}

input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #8e48ff;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid white;
}
</style>
