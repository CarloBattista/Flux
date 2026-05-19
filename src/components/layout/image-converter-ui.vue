<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div
      class="relative border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      :class="{ 'opacity-50 pointer-events-none': isConverting || isReading, 'border-green-400 bg-green-50': imageReady }"
      @click="!isConverting && !isReading && $refs.fileInput.click()"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input type="file" ref="fileInput" class="hidden" accept="image/*,.heic,.heif,.avif,.tiff,.cr3,.arw,.nef,.raw" @change="handleFileSelect" />

      <div v-if="!selectedFile && !isReading" class="space-y-4">
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
        <p class="text-xl font-bold text-gray-700">Trascina un'immagine o un file RAW</p>
      </div>

      <div v-else-if="isReading || isConverting" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="text-indigo-600 font-bold">{{ isReading ? 'Lettura e decodifica...' : 'Conversione professionale in corso...' }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex justify-center">
          <img ref="previewImg" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" @load="onImageLoaded" />
        </div>
        <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
      </div>
    </div>

    <!-- Opzioni di Conversione -->
    <div v-if="selectedFile && !isReading" class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Formato Reale di Destinazione</label>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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

      <button
        @click="convertImage"
        :disabled="isConverting || !imageReady"
        class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
      >
        Scarica File Convertito
      </button>
      <button @click="reset" class="w-full text-xs text-gray-400 hover:text-gray-600">Cambia file</button>
    </div>
  </div>
</template>

<script>
import heic2any from 'heic2any';
import UTIF from 'utif';

export default {
  name: 'image-converter-ui',
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      targetFormat: 'png',
      isConverting: false,
      isReading: false,
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
      if (file) this.setFile(file);
    },
    async setFile(file) {
      this.imageReady = false;
      this.isReading = true;
      this.selectedFile = file;

      try {
        const ext = file.name.toLowerCase();
        let displayBlob = file;

        // Decodifica reale per l'anteprima
        if (ext.endsWith('.heic') || ext.endsWith('.heif')) {
          const result = await heic2any({ blob: file, toType: 'image/jpeg' });
          displayBlob = Array.isArray(result) ? result[0] : result;
        } else if (ext.endsWith('.tiff') || ext.endsWith('.tif') || ['.cr3', '.arw', '.nef', '.raw'].some((r) => ext.endsWith(r))) {
          const buffer = await file.arrayBuffer();
          const ifds = UTIF.decode(buffer);
          UTIF.decodeImage(buffer, ifds[0]);
          const rgba = UTIF.toRGBA8(ifds[0]);

          const canvas = document.createElement('canvas');
          canvas.width = ifds[0].width;
          canvas.height = ifds[0].height;
          const ctx = canvas.getContext('2d');
          const imgData = ctx.createImageData(canvas.width, canvas.height);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);

          this.previewUrl = canvas.toDataURL('image/jpeg');
          this.isReading = false;
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
          this.isReading = false;
        };
        reader.readAsDataURL(displayBlob);
      } catch (error) {
        console.error('Errore lettura:', error);
        this.isReading = false;
        alert('Errore nella decodifica del file. Prova un altro formato.');
      }
    },
    onImageLoaded() {
      this.imageReady = true;
    },
    reset() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageReady = false;
      this.isReading = false;
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

        const fileName = this.selectedFile.name.split('.')[0];
        let finalData = null;
        const mimeType = `image/${this.targetFormat}`;

        // --- CONVERSIONE REALE CON UTIF.JS ---
        if (this.targetFormat === 'tiff' || ['cr3', 'arw', 'nef', 'raw'].includes(this.targetFormat)) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // Encode reale in TIFF usando UTIF
          finalData = UTIF.encodeImage(imgData.data, canvas.width, canvas.height);
          this.downloadFile(new Blob([finalData], { type: 'image/tiff' }), `${fileName}.${this.targetFormat}`);
        } else if (this.targetFormat === 'svg') {
          const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${this.previewUrl}" width="100%" height="100%"/></svg>`;
          this.downloadFile(new Blob([svgString], { type: 'image/svg+xml' }), `${fileName}.svg`);
        } else {
          const mime = this.targetFormat === 'jfif' ? 'image/jpeg' : `image/${this.targetFormat}`;
          canvas.toBlob(
            (blob) => {
              this.downloadFile(blob, `${fileName}.${this.targetFormat}`);
            },
            mime,
            0.95
          );
        }
      } catch (error) {
        console.error('Errore conversione:', error);
      } finally {
        this.isConverting = false;
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
};
</script>
