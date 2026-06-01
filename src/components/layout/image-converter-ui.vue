<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      accept="image/*,.heic,.heif,.avif,.tiff,.cr3,.arw,.nef,.raw"
      :success="imageReady"
      :has-file="selectedFiles.length > 0"
      :loading="isReading || isConverting"
      :disabled="isConverting || isReading"
      multiple
      @file-selected="setFiles"
      ref="dropzone"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
          <p class="text-white font-bold">
            {{ isReading ? 'Lettura e decodifica...' : `Conversione in corso (${convertedCount}/${selectedFiles.length})...` }}
          </p>
        </div>
      </template>

      <template #preview>
        <div class="space-y-4">
          <div v-if="previewUrl" class="flex justify-center">
            <img ref="previewImg" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" @load="onImageLoaded" />
          </div>
          <div class="text-left space-y-2 max-h-40 overflow-y-auto p-2">
            <p v-for="file in selectedFiles" :key="file.name" class="text-xs font-bold text-green-600 flex items-center gap-2">
              <span class="truncate">{{ file.name }}</span>
              <span class="shrink-0 text-[10px] opacity-70">pronto</span>
            </p>
          </div>
          <p class="text-sm font-bold text-white bg-[#8e48ff] px-4 py-2 rounded-full inline-block">{{ selectedFiles.length }} file selezionati</p>
        </div>
      </template>
    </hrDropzone>
    <div v-if="selectedFiles.length > 0 && !isReading" class="w-full p-8 rounded-3xl flex flex-col shadow-sm border border-gray-100 space-y-6">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Formato Reale di Destinazione</label>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <hrButton
            v-for="format in tool.formats"
            :key="format"
            @click="targetFormat = format"
            :variant="targetFormat === format ? 'core-primary' : 'primary'"
            :label="tool.labels[format]"
          />
        </div>
      </div>

      <div class="w-full mt-auto flex flex-col gap-2">
        <hrButton
          @click="convertImage"
          size="large"
          variant="core-primary"
          label="Converti e Scarica"
          :disabled="isConverting || !imageReady"
          class="w-full"
        />
        <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import heic2any from 'heic2any';
import UTIF from 'utif';
import JSZip from 'jszip';

import hrDropzone from '../input/hr-dropzone.vue';
import hrButton from '../button/hr-button.vue';

export default {
  name: 'image-converter-ui',
  components: {
    hrDropzone,
    hrButton,
  },
  props: { tool: Object, access: Boolean },
  data() {
    return {
      selectedFiles: [],
      previewUrl: null,
      targetFormat: 'png',
      isConverting: false,
      isReading: false,
      imageReady: false,
      convertedCount: 0,
    };
  },
  methods: {
    async setFiles(files) {
      this.imageReady = false;
      this.isReading = true;
      this.selectedFiles = Array.isArray(files) ? files : [files];

      try {
        const firstFile = this.selectedFiles[0];
        const ext = firstFile.name.toLowerCase();
        let displayBlob = firstFile;

        // Decodifica reale per l'anteprima (solo per il primo file)
        if (ext.endsWith('.heic') || ext.endsWith('.heif')) {
          const result = await heic2any({ blob: firstFile, toType: 'image/jpeg' });
          displayBlob = Array.isArray(result) ? result[0] : result;
        } else if (ext.endsWith('.tiff') || ext.endsWith('.tif') || ['.cr3', '.arw', '.nef', '.raw'].some((r) => ext.endsWith(r))) {
          const buffer = await firstFile.arrayBuffer();
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
        // Se fallisce l'anteprima procediamo comunque, ma senza previewUrl
        this.previewUrl = null;
        this.imageReady = true; // Permettiamo comunque la conversione se i file sono stati selezionati
      }
    },
    onImageLoaded() {
      this.imageReady = true;
    },
    reset() {
      this.selectedFiles = [];
      this.previewUrl = null;
      this.imageReady = false;
      this.isReading = false;
      this.convertedCount = 0;
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
      }
    },
    async convertImage() {
      if (!this.imageReady || this.selectedFiles.length === 0) return;
      this.isConverting = true;
      this.convertedCount = 0;

      try {
        if (this.selectedFiles.length > 1) {
          const zip = new JSZip();
          for (const file of this.selectedFiles) {
            const { blob, name } = await this.processFile(file, true);
            zip.file(name, blob);
            this.convertedCount++;
          }
          const content = await zip.generateAsync({ type: 'blob' });
          this.downloadFile(content, 'flux_converted_images.zip');
        } else {
          const file = this.selectedFiles[0];
          const { blob, name } = await this.processFile(file, true);
          this.downloadFile(blob, name);
          this.convertedCount++;
        }
      } catch (error) {
        console.error('Errore conversione:', error);
      } finally {
        this.isConverting = false;
      }
    },
    async processFile(file, returnBlob = false) {
      const ext = file.name.toLowerCase();
      const fileName = file.name.split('.')[0];
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let tempUrl = null;

      if (ext.endsWith('.heic') || ext.endsWith('.heif')) {
        const result = await heic2any({ blob: file, toType: 'image/jpeg' });
        const blob = Array.isArray(result) ? result[0] : result;
        tempUrl = URL.createObjectURL(blob);
        const img = await this.loadImage(tempUrl);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      } else if (ext.endsWith('.tiff') || ext.endsWith('.tif') || ['.cr3', '.arw', '.nef', '.raw'].some((r) => ext.endsWith(r))) {
        const buffer = await file.arrayBuffer();
        const ifds = UTIF.decode(buffer);
        UTIF.decodeImage(buffer, ifds[0]);
        const rgba = UTIF.toRGBA8(ifds[0]);
        canvas.width = ifds[0].width;
        canvas.height = ifds[0].height;
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        imgData.data.set(rgba);
        ctx.putImageData(imgData, 0, 0);
      } else {
        tempUrl = URL.createObjectURL(file);
        const img = await this.loadImage(tempUrl);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      }

      if (tempUrl) URL.revokeObjectURL(tempUrl);

      let resultBlob = null;
      let finalName = '';

      if (this.targetFormat === 'tiff' || ['cr3', 'arw', 'nef', 'raw'].includes(this.targetFormat)) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const finalData = UTIF.encodeImage(imgData.data, canvas.width, canvas.height);
        resultBlob = new Blob([finalData], { type: 'image/tiff' });
        finalName = `${fileName}.${this.targetFormat}`;
      } else if (this.targetFormat === 'svg') {
        const dataUrl = canvas.toDataURL('image/png');
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="100%" height="100%"/></svg>`;
        resultBlob = new Blob([svgString], { type: 'image/svg+xml' });
        finalName = `${fileName}.svg`;
      } else {
        const mime = this.targetFormat === 'jfif' ? 'image/jpeg' : `image/${this.targetFormat}`;
        resultBlob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.95));
        finalName = `${fileName}.${this.targetFormat}`;
      }

      if (returnBlob) {
        return { blob: resultBlob, name: finalName };
      } else {
        this.downloadFile(resultBlob, finalName);
      }
    },
    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
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
