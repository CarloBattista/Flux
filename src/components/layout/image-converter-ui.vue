<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      accept="image/*,.heic,.heif,.avif,.tiff,.cr3,.arw,.nef,.raw"
      :success="imageReady"
      :has-file="!!selectedFile"
      :loading="isReading || isConverting"
      :disabled="isConverting || isReading"
      @file-selected="setFile"
      ref="dropzone"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
          <p class="text-white font-bold">{{ isReading ? 'Lettura e decodifica...' : 'Conversione in corso...' }}</p>
        </div>
      </template>

      <template #preview>
        <div class="space-y-4">
          <div class="flex justify-center">
            <img ref="previewImg" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" @load="onImageLoaded" />
          </div>
          <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
        </div>
      </template>
    </hrDropzone>
    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Formato Reale di Destinazione</label>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <hrButton
            v-for="format in tool.config.formats"
            :key="format"
            @click="targetFormat = format"
            :variant="targetFormat === format ? 'core-primary' : 'primary'"
            :label="tool.config.labels[format]"
          />
        </div>
      </div>

      <hrButton
        @click="convertImage"
        size="large"
        variant="core-primary"
        label="Converti e Scarica"
        :disabled="isConverting || !imageReady"
        class="w-full mt-auto"
      />
      <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
    </div>
  </div>
</template>

<script>
import heic2any from 'heic2any';
import UTIF from 'utif';

import hrDropzone from '../input/hr-dropzone.vue';
import hrButton from '../button/hr-button.vue';

export default {
  name: 'image-converter-ui',
  components: {
    hrDropzone,
    hrButton,
  },
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
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
      }
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
        // const mimeType = `image/${this.targetFormat}`;

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
