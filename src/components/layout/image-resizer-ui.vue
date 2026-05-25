<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      accept="image/*"
      :success="imageReady"
      :has-file="!!selectedFile"
      :loading="isReading || isResizing"
      :disabled="isResizing || isReading"
      @file-selected="setFile"
      ref="dropzone"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
          <p class="text-white font-bold">{{ isReading ? 'Lettura immagine...' : 'Ridimensionamento in corso...' }}</p>
        </div>
      </template>

      <template #preview>
        <div class="space-y-4 w-full flex flex-col items-center">
          <!-- Contenitore Preview con Aspect Ratio Reale -->
          <div
            class="relative overflow-hidden rounded-lg shadow-2xl bg-black/40 border border-white/10 transition-all duration-300"
            :style="{
              width: '100%',
              maxWidth: '320px',
              aspectRatio: `${targetWidth} / ${targetHeight}`,
            }"
          >
            <img
              ref="previewImg"
              :src="previewUrl"
              class="w-full h-full transition-all duration-300"
              :class="fitMode === 'cover' ? 'object-cover' : 'object-fill'"
              @load="onImageLoaded"
            />

            <!-- Overlay Info -->
            <div
              class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10"
            >
              {{ targetWidth }}x{{ targetHeight }}px
            </div>
          </div>

          <div class="text-center space-y-1">
            <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
            <p class="text-xs text-gray-400">Origine: {{ originalWidth }} x {{ originalHeight }}px</p>
          </div>
        </div>
      </template>
    </hrDropzone>

    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <!-- Preset Selection -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Preset Social</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <hrButton
            v-for="preset in tool.config.presets"
            :key="preset.label"
            @click="applyPreset(preset)"
            :variant="selectedPresetLabel === preset.label ? 'core-primary' : 'primary'"
            :label="preset.label"
            class="text-xs py-2"
          />
        </div>
      </div>

      <!-- Fit Mode Selection -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Modalità Adattamento</label>
        <div class="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            @click="fitMode = 'cover'"
            class="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
            :class="fitMode === 'cover' ? 'bg-[#8e48ff] text-white shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            Copri (Ritaglia)
          </button>
          <button
            @click="fitMode = 'fill'"
            class="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
            :class="fitMode === 'fill' ? 'bg-[#8e48ff] text-white shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            Distorci
          </button>
        </div>
      </div>

      <!-- Custom Dimensions -->
      <div class="space-y-4">
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <hr-input v-model.number="targetWidth" type="number" label="Larghezza (px)" @input="onWidthChange" />
          </div>
          <div class="flex items-center justify-center pb-3">
            <button
              @click="toggleAspectRatio"
              class="p-2 rounded-lg transition-colors"
              :class="maintainAspectRatio ? 'bg-[#8e48ff]/20 text-[#8e48ff]' : 'bg-white/5 text-gray-500'"
              title="Mantieni proporzioni"
            >
              <LinkIcon v-if="maintainAspectRatio" size="20" />
              <Unlink v-else size="20" />
            </button>
          </div>
          <div class="flex-1">
            <hr-input v-model.number="targetHeight" type="number" label="Altezza (px)" @input="onHeightChange" />
          </div>
        </div>
      </div>

      <div class="w-full mt-auto flex flex-col gap-2">
        <hrButton
          @click="resizeImage"
          size="large"
          variant="core-primary"
          label="Scarica Immagine"
          :disabled="isResizing || !imageReady || !targetWidth || !targetHeight"
          class="w-full"
        />
        <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import hrDropzone from '../input/hr-dropzone.vue';
import hrButton from '../button/hr-button.vue';
import hrInput from '../input/hr-input.vue';
import { Link as LinkIcon, Unlink } from '@lucide/vue';

export default {
  name: 'image-resizer-ui',
  components: {
    hrDropzone,
    hrButton,
    hrInput,
    LinkIcon,
    Unlink,
  },
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      isResizing: false,
      isReading: false,
      imageReady: false,
      originalWidth: 0,
      originalHeight: 0,
      targetWidth: 100, // Default non-zero for aspect ratio
      targetHeight: 100,
      aspectRatio: 1,
      maintainAspectRatio: true,
      selectedPresetLabel: 'Custom',
      fitMode: 'cover', // 'cover' (crop) or 'fill' (stretch)
    };
  },
  methods: {
    async setFile(file) {
      this.imageReady = false;
      this.isReading = true;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
        this.isReading = false;
      };
      reader.readAsDataURL(file);
    },
    onImageLoaded() {
      const img = this.$refs.previewImg;
      this.originalWidth = img.naturalWidth;
      this.originalHeight = img.naturalHeight;
      this.aspectRatio = this.originalWidth / this.originalHeight;

      if (this.selectedPresetLabel === 'Custom') {
        this.targetWidth = this.originalWidth;
        this.targetHeight = this.originalHeight;
      }
      this.imageReady = true;
    },
    applyPreset(preset) {
      this.selectedPresetLabel = preset.label;
      if (preset.width && preset.height) {
        this.targetWidth = preset.width;
        this.targetHeight = preset.height;
        this.maintainAspectRatio = false;
        this.fitMode = 'cover'; // Default to cover for social presets
      } else {
        this.targetWidth = this.originalWidth;
        this.targetHeight = this.originalHeight;
        this.maintainAspectRatio = true;
      }
    },
    toggleAspectRatio() {
      this.maintainAspectRatio = !this.maintainAspectRatio;
      if (this.maintainAspectRatio) {
        this.onWidthChange();
      }
    },
    onWidthChange() {
      this.selectedPresetLabel = 'Custom';
      if (this.maintainAspectRatio && this.targetWidth) {
        this.targetHeight = Math.round(this.targetWidth / this.aspectRatio);
      }
    },
    onHeightChange() {
      this.selectedPresetLabel = 'Custom';
      if (this.maintainAspectRatio && this.targetHeight) {
        this.targetWidth = Math.round(this.targetHeight * this.aspectRatio);
      }
    },
    reset() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageReady = false;
      this.isReading = false;
      this.selectedPresetLabel = 'Custom';
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
      }
    },
    async resizeImage() {
      if (!this.imageReady) return;
      this.isResizing = true;

      try {
        const img = new Image();
        img.src = this.previewUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = this.targetWidth;
        canvas.height = this.targetHeight;
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (this.fitMode === 'cover') {
          // Logic for center crop (object-cover)
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const targetRatio = this.targetWidth / this.targetHeight;
          let drawWidth, drawHeight, offsetX, offsetY;

          if (imgRatio > targetRatio) {
            drawHeight = img.naturalHeight;
            drawWidth = img.naturalHeight * targetRatio;
            offsetX = (img.naturalWidth - drawWidth) / 2;
            offsetY = 0;
          } else {
            drawWidth = img.naturalWidth;
            drawHeight = img.naturalWidth / targetRatio;
            offsetX = 0;
            offsetY = (img.naturalHeight - drawHeight) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, this.targetWidth, this.targetHeight);
        } else {
          // Logic for stretch (object-fill)
          ctx.drawImage(img, 0, 0, this.targetWidth, this.targetHeight);
        }

        const fileName = this.selectedFile.name.split('.')[0];
        const extension = this.selectedFile.name.split('.').pop();
        const mimeType = this.selectedFile.type || 'image/png';

        canvas.toBlob(
          (blob) => {
            this.downloadFile(blob, `${fileName}_${this.targetWidth}x${this.targetHeight}.${extension}`);
            this.isResizing = false;
          },
          mimeType,
          0.95
        );
      } catch (error) {
        console.error('Errore ridimensionamento:', error);
        this.isResizing = false;
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
