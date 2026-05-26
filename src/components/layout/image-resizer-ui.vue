<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      accept="image/*"
      :success="imageReady"
      :has-file="!!selectedFile"
      :loading="isReading || isResizing"
      :disabled="isResizing || isReading || !access"
      @file-selected="setFile"
      ref="dropzone"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
          <p class="text-white font-bold">{{ isReading ? 'Lettura immagine...' : 'Elaborazione in corso...' }}</p>
        </div>
      </template>

      <template #preview>
        <div class="space-y-4 w-full flex flex-col items-center">
          <!-- Area di Ritaglio Interattiva -->
          <div
            ref="cropContainer"
            class="relative overflow-hidden rounded-lg shadow-2xl bg-black/40 border border-white/10 select-none cursor-move group"
            :style="{ width: '100%', maxWidth: '400px' }"
            @mousedown.stop="startDrag"
            @touchstart.stop.prevent="startDrag"
            @click.stop
          >
            <!-- Immagine Base -->
            <img ref="previewImg" :src="previewUrl" class="w-full h-auto pointer-events-none opacity-50" @load="onImageLoaded" />

            <!-- Crop Box (Luce) -->
            <div class="absolute border-2 border-[#8e48ff] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-10 pointer-events-none" :style="cropBoxStyle">
              <!-- Indicatori angoli -->
              <div class="absolute -top-1 -left-1 w-2 h-2 bg-[#8e48ff]"></div>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-[#8e48ff]"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-[#8e48ff]"></div>
              <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-[#8e48ff]"></div>
            </div>

            <!-- Tooltip Istruzioni -->
            <div
              class="absolute top-2 left-1/2 -translate-x-1/2 bg-[#8e48ff] text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
            >
              Trascina per scegliere l'area
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

      <!-- Custom Dimensions -->
      <div class="space-y-4">
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <hr-input v-model.number="targetWidth" type="number" label="Larghezza Output (px)" @input="onWidthChange" />
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
            <hr-input v-model.number="targetHeight" type="number" label="Altezza Output (px)" @input="onHeightChange" />
          </div>
        </div>
      </div>

      <div class="w-full mt-auto flex flex-col gap-2">
        <hrButton
          @click="resizeImage"
          size="large"
          variant="core-primary"
          label="Ritaglia e Scarica"
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
  props: { tool: Object, access: Boolean },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      isResizing: false,
      isReading: false,
      imageReady: false,
      originalWidth: 0,
      originalHeight: 0,
      targetWidth: 1080,
      targetHeight: 1080,
      aspectRatio: 1,
      maintainAspectRatio: true,
      selectedPresetLabel: 'Custom',

      // Crop State (values from 0 to 1)
      cropX: 0.5, // Percentuale centro X
      cropY: 0.5, // Percentuale centro Y
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
    };
  },
  computed: {
    cropBoxStyle() {
      if (!this.imageReady) return {};

      const targetRatio = this.targetWidth / this.targetHeight;
      const imgRatio = this.originalWidth / this.originalHeight;

      let width, height;
      if (imgRatio > targetRatio) {
        height = 100;
        width = (targetRatio / imgRatio) * 100;
      } else {
        width = 100;
        height = (imgRatio / targetRatio) * 100;
      }

      // Clamp X and Y center to keep box inside
      const halfW = width / 2;
      const halfH = height / 2;
      const centerX = Math.max(halfW, Math.min(100 - halfW, this.cropX * 100));
      const centerY = Math.max(halfH, Math.min(100 - halfH, this.cropY * 100));

      return {
        width: `${width}%`,
        height: `${height}%`,
        left: `${centerX - halfW}%`,
        top: `${centerY - halfH}%`,
      };
    },
    cropImgStyle() {
      // Per far coincidere l'immagine nitida nel crop box con l'immagine di sfondo
      const style = this.cropBoxStyle;
      if (!style.left) return {};

      return {
        width: `${(100 / parseFloat(style.width)) * 100}%`,
        left: `-${(parseFloat(style.left) / parseFloat(style.width)) * 100}%`,
        top: `-${(parseFloat(style.top) / parseFloat(style.height)) * 100}%`,
      };
    },
  },
  methods: {
    async setFile(file) {
      if (!this.access) {
        this.$router.push({ name: 'pricing' });
        return;
      }

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
      // Initialize crop coordinates only if they are not already set (e.g., first load)
      if (this.cropX === undefined || this.cropX === 0.5) this.cropX = 0.5;
      if (this.cropY === undefined || this.cropY === 0.5) this.cropY = 0.5;
    },
    applyPreset(preset) {
      this.selectedPresetLabel = preset.label;
      if (preset.width && preset.height) {
        this.targetWidth = preset.width;
        this.targetHeight = preset.height;
        this.maintainAspectRatio = false;
      } else {
        this.targetWidth = this.originalWidth;
        this.targetHeight = this.originalHeight;
        this.maintainAspectRatio = true;
      }
    },
    toggleAspectRatio() {
      this.maintainAspectRatio = !this.maintainAspectRatio;
      if (this.maintainAspectRatio) this.onWidthChange();
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
    startDrag(e) {
      this.isDragging = true;
      const event = e.touches ? e.touches[0] : e;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      window.addEventListener('mousemove', this.handleDrag);
      window.addEventListener('touchmove', this.handleDrag, { passive: false });
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('touchend', this.stopDrag);
    },
    handleDrag(e) {
      if (!this.isDragging) return;
      if (e.type === 'touchmove') e.preventDefault();

      const event = e.touches ? e.touches[0] : e;
      const rect = this.$refs.cropContainer.getBoundingClientRect();

      const deltaX = (event.clientX - this.lastMouseX) / rect.width;
      const deltaY = (event.clientY - this.lastMouseY) / rect.height;

      this.cropX = Math.max(0, Math.min(1, this.cropX + deltaX));
      this.cropY = Math.max(0, Math.min(1, this.cropY + deltaY));

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    },
    stopDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.handleDrag);
      window.removeEventListener('touchmove', this.handleDrag);
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('touchend', this.stopDrag);
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

        // Calcolo coordinate reali sull'immagine originale basate sul box di crop
        const targetRatio = this.targetWidth / this.targetHeight;
        const imgRatio = this.originalWidth / this.originalHeight;

        let cropWidth, cropHeight;
        if (imgRatio > targetRatio) {
          cropHeight = this.originalHeight;
          cropWidth = this.originalHeight * targetRatio;
        } else {
          cropWidth = this.originalWidth;
          cropHeight = this.originalWidth / targetRatio;
        }

        const x = this.cropX * this.originalWidth - cropWidth / 2;
        const y = this.cropY * this.originalHeight - cropHeight / 2;

        // Clamping per sicurezza
        const safeX = Math.max(0, Math.min(this.originalWidth - cropWidth, x));
        const safeY = Math.max(0, Math.min(this.originalHeight - cropHeight, y));

        ctx.drawImage(img, safeX, safeY, cropWidth, cropHeight, 0, 0, this.targetWidth, this.targetHeight);

        const fileName = this.selectedFile.name.split('.')[0];
        const extension = this.selectedFile.name.split('.').pop();
        canvas.toBlob(
          (blob) => {
            this.downloadFile(blob, `${fileName}_${this.targetWidth}x${this.targetHeight}.${extension}`);
            this.isResizing = false;
          },
          this.selectedFile.type || 'image/png',
          0.95
        );
      } catch (error) {
        console.error('Errore:', error);
        this.isResizing = false;
      }
    },
    reset() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageReady = false;
      this.selectedPresetLabel = 'Custom';
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
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
