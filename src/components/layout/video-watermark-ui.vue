<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      ref="dropzone"
      accept="video/*"
      :success="videoReady"
      :has-file="!!selectedFile"
      :loading="isReading || isProcessing"
      :disabled="isProcessing || isReading"
      @file-selected="setFile"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="relative flex justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
            <div v-if="isProcessing" class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-bold text-white">{{ Math.round(progress * 100) }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-white font-bold text-lg">{{ isReading ? 'Caricamento video...' : 'Applicazione watermark...' }}</p>
          </div>
        </div>
      </template>
      <template #preview>
        <div class="space-y-4">
          <div class="flex justify-center">
            <div class="relative inline-block overflow-hidden rounded-lg shadow-md group" ref="previewContainer" :style="containerStyle">
              <video
                ref="previewVideo"
                :src="previewUrl"
                class="w-full h-full block"
                controls
                controlsList="nofullscreen"
                @loadedmetadata="onVideoLoaded"
              ></video>
              <!-- Real-time Watermark Preview -->
              <img v-if="watermarkPreview" :src="watermarkPreview" :style="watermarkStyle" class="transition-all duration-200 pointer-events-none" />
              <!-- Custom Fullscreen Button -->
              <button
                @click="toggleFullscreen"
                class="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-50"
                title="Anteprima Fullscreen"
              >
                <Maximize size="20" />
              </button>
            </div>
          </div>
          <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
        </div>
      </template>
    </hrDropzone>

    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-white/10 space-y-6 flex flex-col bg-white/5">
      <!-- Watermark Upload -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Immagine Watermark</label>
        <div
          @click="$refs.watermarkInput.click()"
          class="flex items-center gap-4 p-4 rounded-xl border border-dashed border-white/20 hover:border-[#8e48ff] cursor-pointer transition-colors"
        >
          <div v-if="watermarkPreview" class="h-12 w-12 rounded bg-white/10 flex items-center justify-center overflow-hidden">
            <img :src="watermarkPreview" class="max-h-full max-w-full object-contain" />
          </div>
          <div v-else class="h-12 w-12 rounded bg-white/10 flex items-center justify-center text-gray-500">
            <ImageIcon size="20" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-white font-medium">{{ watermarkFile ? watermarkFile.name : 'Seleziona un logo/immagine' }}</p>
            <p class="text-xs text-gray-500">PNG o JPG raccomandati</p>
          </div>
          <input ref="watermarkInput" type="file" accept="image/*" class="hidden" @change="setWatermark" />
        </div>
      </div>

      <!-- Position Selector -->
      <div v-if="watermarkFile" class="space-y-3">
        <hrSelect v-model="selectedPosition" label="Posizione" :options="tool.config.positions" />
      </div>

      <!-- Opacity Selector -->
      <div v-if="watermarkFile" class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Opacità</label>
        <div class="grid grid-cols-4 gap-2">
          <hrButton
            v-for="level in tool.config.opacityLevels"
            :key="level.value"
            @click="selectedOpacity = level.value"
            :variant="selectedOpacity === level.value ? 'core-primary' : 'primary'"
            :label="level.label"
            class="w-full text-xs"
          />
        </div>
      </div>

      <!-- Size Selector -->
      <div v-if="watermarkFile" class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Dimensione</label>
          <span class="text-xs text-[#8e48ff] font-bold">{{ Math.round(selectedSize * 100) }}%</span>
        </div>
        <hrSlider v-model="selectedSize" :min="0.05" :max="0.5" :step="0.01" />
      </div>

      <!-- Margin Selector -->
      <div v-if="watermarkFile" class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Margine</label>
          <span class="text-xs text-[#8e48ff] font-bold">{{ selectedMargin }}px</span>
        </div>
        <hrSlider v-model="selectedMargin" :min="0" :max="100" :step="1" />
      </div>

      <div class="w-full mt-auto flex flex-col gap-2">
        <hrButton
          @click="applyWatermark"
          size="large"
          variant="core-primary"
          label="Applica e Scarica"
          :disabled="isProcessing || !videoReady || !watermarkFile"
          class="w-full"
        />
        <hrButton @click="reset" size="large" variant="primary" label="Cambia video" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { markRaw } from 'vue';

import hrButton from '../button/hr-button.vue';
import hrDropzone from '../input/hr-dropzone.vue';
import hrSelect from '../input/hr-select.vue';
import hrSlider from '../input/hr-slider.vue';

// ICONS
import { Image as ImageIcon, Maximize } from '@lucide/vue';

export default {
  name: 'video-watermark-ui',
  components: {
    hrButton,
    hrDropzone,
    hrSelect,
    hrSlider,

    // ICONS
    ImageIcon,
    Maximize,
  },
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      watermarkFile: null,
      watermarkPreview: null,
      selectedPosition: this.tool.config.defaultPosition,
      selectedOpacity: this.tool.config.defaultOpacity,
      selectedSize: this.tool.config.defaultSize,
      selectedMargin: this.tool.config.defaultMargin,
      isProcessing: false,
      isReading: false,
      videoReady: false,
      progress: 0,
      videoDimensions: { width: 0, height: 0 },
    };
  },
  computed: {
    containerStyle() {
      if (!this.videoDimensions.width) return { maxHeight: '12rem' };
      return {
        aspectRatio: `${this.videoDimensions.width} / ${this.videoDimensions.height}`,
        maxHeight: '70vh',
        width: 'auto',
      };
    },
    watermarkStyle() {
      if (!this.selectedPosition || !this.videoDimensions.width) return {};

      const styles = {
        opacity: this.selectedOpacity,
        position: 'absolute',
        pointerEvents: 'none',
        // Percentage width relative to container width
        width: `${this.selectedSize * 100}%`,
        objectFit: 'contain',
      };

      // Calculate percentage margins relative to video dimensions
      const marginX = (this.selectedMargin / this.videoDimensions.width) * 100;
      const marginY = (this.selectedMargin / this.videoDimensions.height) * 100;

      if (this.selectedPosition === '10:10') {
        styles.top = `${marginY}%`;
        styles.left = `${marginX}%`;
      } else if (this.selectedPosition === 'main_w-overlay_w-10:10') {
        styles.top = `${marginY}%`;
        styles.right = `${marginX}%`;
      } else if (this.selectedPosition === '10:main_h-overlay_h-10') {
        styles.bottom = `${marginY}%`;
        styles.left = `${marginX}%`;
      } else if (this.selectedPosition === 'main_w-overlay_w-10:main_h-overlay_h-10') {
        styles.bottom = `${marginY}%`;
        styles.right = `${marginX}%`;
      } else if (this.selectedPosition === '(main_w-overlay_w)/2:(main_h-overlay_h)/2') {
        styles.top = '50%';
        styles.left = '50%';
        styles.transform = 'translate(-50%, -50%)';
      }

      return styles;
    },
  },
  methods: {
    setFile(file) {
      this.videoReady = false;
      this.isReading = true;
      this.selectedFile = file;
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = URL.createObjectURL(file);
      this.isReading = false;
    },
    setWatermark(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.watermarkFile = file;
      if (this.watermarkPreview) URL.revokeObjectURL(this.watermarkPreview);
      this.watermarkPreview = URL.createObjectURL(file);
    },
    onVideoLoaded() {
      this.videoReady = true;
      const video = this.$refs.previewVideo;
      const container = this.$refs.previewContainer;

      // Store real dimensions
      this.videoDimensions = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      // Monitor fullscreen changes on the container
      const handleFullscreenChange = () => {
        if (document.fullscreenElement === container) {
          container.classList.add('is-fullscreen');
        } else {
          container.classList.remove('is-fullscreen');
        }
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);

      // If the video itself tries to go fullscreen (e.g. via double click or other means)
      video.addEventListener('webkitbeginfullscreen', (e) => {
        e.preventDefault();
        this.toggleFullscreen();
      });
    },
    toggleFullscreen() {
      const container = this.$refs.previewContainer;
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    },
    reset() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      if (this.watermarkPreview) URL.revokeObjectURL(this.watermarkPreview);
      this.selectedFile = null;
      this.previewUrl = null;
      this.watermarkFile = null;
      this.watermarkPreview = null;
      this.videoReady = false;
      this.isReading = false;
    },
    async loadFFmpeg() {
      if (this.ffmpeg && this.ffmpeg.loaded) return;
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      const ffmpeg = new FFmpeg();
      this.ffmpeg = markRaw(ffmpeg);
      this.ffmpeg.on('progress', ({ progress }) => {
        this.progress = progress;
      });
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    },
    async applyWatermark() {
      if (!this.videoReady || !this.watermarkFile) return;
      this.isProcessing = true;
      this.progress = 0;

      try {
        await this.loadFFmpeg();

        const videoExt = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf('.'));
        const videoName = `input_video${videoExt}`;
        const watermarkExt = this.watermarkFile.name.substring(this.watermarkFile.name.lastIndexOf('.'));
        const watermarkName = `watermark${watermarkExt}`;
        const outputName = 'output_watermarked.mp4';

        const videoData = await this.selectedFile.arrayBuffer();
        const watermarkData = await this.watermarkFile.arrayBuffer();

        await this.ffmpeg.writeFile(videoName, new Uint8Array(videoData));
        await this.ffmpeg.writeFile(watermarkName, new Uint8Array(watermarkData));

        // Dimensioni reali del video caricate
        const vW = this.videoDimensions.width;
        const vH = this.videoDimensions.height;
        const margin = this.selectedMargin;

        // Costruiamo le coordinate per l'overlay basandoci sulle stesse formule dell'anteprima
        let x = '0',
          y = '0';

        if (this.selectedPosition === '10:10') {
          x = `${margin}`;
          y = `${margin}`;
        } else if (this.selectedPosition === 'main_w-overlay_w-10:10') {
          x = `main_w-overlay_w-${margin}`;
          y = `${margin}`;
        } else if (this.selectedPosition === '10:main_h-overlay_h-10') {
          x = `${margin}`;
          y = `main_h-overlay_h-${margin}`;
        } else if (this.selectedPosition === 'main_w-overlay_w-10:main_h-overlay_h-10') {
          x = `main_w-overlay_w-${margin}`;
          y = `main_h-overlay_h-${margin}`;
        } else if (this.selectedPosition === '(main_w-overlay_w)/2:(main_h-overlay_h)/2') {
          x = '(main_w-overlay_w)/2';
          y = '(main_h-overlay_h)/2';
        }

        // Calcolo dimensione: ridimensioniamo il watermark in base alla percentuale della larghezza del video
        // [1:v]scale=vW*percentuale:-1[wm_scaled]; [wm_scaled]format=rgba,colorchannelmixer=aa=opacità[wm]; [0:v][wm]overlay=x:y
        const filter = `[1:v]scale=${vW * this.selectedSize}:-1[wm_scaled];[wm_scaled]format=rgba,colorchannelmixer=aa=${this.selectedOpacity}[wm];[0:v][wm]overlay=${x}:${y}`;

        await this.ffmpeg.exec(['-i', videoName, '-i', watermarkName, '-filter_complex', filter, '-preset', 'ultrafast', outputName]);

        const data = await this.ffmpeg.readFile(outputName);
        const blob = new Blob([data.buffer], { type: 'video/mp4' });

        const fileName = this.selectedFile.name.split('.')[0];
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}_watermark.mp4`;
        link.click();

        await this.ffmpeg.deleteFile(videoName);
        await this.ffmpeg.deleteFile(watermarkName);
        await this.ffmpeg.deleteFile(outputName);
      } catch (error) {
        console.error('Errore durante applicazione del watermark:', error);
        alert('Si è verificato un errore durante elaborazione del video.');
      } finally {
        this.isProcessing = false;
        this.progress = 0;
      }
    },
  },
  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    if (this.watermarkPreview) URL.revokeObjectURL(this.watermarkPreview);
  },
};
</script>

<style scoped>
/* Specific fix for the preview container when it goes fullscreen */
:deep(.is-fullscreen) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: black !important;
  width: 100vw !important;
  height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 2147483647 !important;
}

:deep(.is-fullscreen video) {
  max-height: 100vh !important;
  max-width: 100vw !important;
  width: auto !important;
  height: auto !important;
}

:deep(.is-fullscreen img) {
  z-index: 2147483647 !important;
  position: absolute !important;
}

/* Hide native fullscreen button in some browsers */
video::-webkit-media-controls-fullscreen-button {
  display: none !important;
}
</style>
