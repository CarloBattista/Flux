<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      ref="dropzone"
      accept="video/*,.mp4,.avi,.mov,.wmv"
      :success="videoReady"
      :has-file="!!selectedFile"
      :loading="isReading || isCompressing"
      :disabled="isCompressing || isReading"
      @file-selected="setFile"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="relative flex justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
            <div v-if="isCompressing" class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-bold text-white">{{ Math.round(progress * 100) }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-white font-bold text-lg">{{ isReading ? 'Caricamento video...' : 'Compressione in corso...' }}</p>
            <p v-if="isCompressing" class="text-gray-300 text-xs font-medium">L'operazione avviene interamente nel tuo browser</p>
          </div>
        </div>
      </template>
      <template #preview>
        <div class="space-y-4">
          <div class="flex justify-center">
            <video ref="previewVideo" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" controls @loadedmetadata="onVideoLoaded"></video>
          </div>
          <div class="space-y-1 text-center">
            <p class="text-sm font-bold text-green-600">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-400">Dimensione originale: {{ formatSize(selectedFile.size) }}</p>
          </div>
        </div>
      </template>
    </hrDropzone>

    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-white/10 bg-white/5 space-y-6 flex flex-col">
      <div class="space-y-4">
        <h2 class="block text-sm font-semibold text-gray-300 tracking-wider">Qualità Compressione</h2>
        <hrSlider v-model="qualityIndex" :min="0" :max="tool.config.qualities.length - 1" :step="1" />
        <div class="flex justify-between text-xs font-medium text-gray-400 px-1">
          <span class="text-[#8e48ff] font-bold uppercase tracking-tight">{{ tool.config.qualities[qualityIndex].label }}</span>
          <span>CRF: {{ tool.config.qualities[qualityIndex].crf }}</span>
        </div>
      </div>

      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Formato di Destinazione</label>
        <div class="grid grid-cols-2 gap-3">
          <hrButton
            v-for="format in tool.config.formats"
            :key="format"
            @click="targetFormat = format"
            :variant="targetFormat === format ? 'core-primary' : 'primary'"
            :label="tool.config.labels[format]"
          />
        </div>
      </div>

      <div class="w-full mt-auto flex flex-col gap-2 pt-4">
        <hrButton
          @click="compressVideo"
          size="large"
          variant="core-primary"
          label="Comprimi e Scarica"
          :disabled="isCompressing || !videoReady"
          class="w-full"
        />
        <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
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
import hrSlider from '../input/hr-slider.vue';

export default {
  name: 'video-compressor-ui',
  components: {
    hrButton,
    hrDropzone,
    hrSlider,
  },
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      targetFormat: 'mp4',
      qualityIndex: 2, // Default: Media
      isCompressing: false,
      isReading: false,
      videoReady: false,
      progress: 0,
    };
  },
  created() {
    this.ffmpeg = null;
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
    onVideoLoaded() {
      this.videoReady = true;
    },
    reset() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.selectedFile = null;
      this.previewUrl = null;
      this.videoReady = false;
      this.isReading = false;
      if (this.$refs.dropzone && this.$refs.dropzone.$refs.fileInput) {
        this.$refs.dropzone.$refs.fileInput.value = '';
      }
    },
    formatSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    downloadFile(blob, name) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = name;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
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
    async compressVideo() {
      if (!this.videoReady) return;
      this.isCompressing = true;
      this.progress = 0;

      try {
        await this.loadFFmpeg();

        const inputExt = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf('.'));
        const inputName = `input${inputExt}`;
        const outputName = `output.${this.targetFormat}`;

        const arrayBuffer = await this.selectedFile.arrayBuffer();
        await this.ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

        const quality = this.tool.config.qualities[this.qualityIndex];

        const ffmpegArgs = ['-i', inputName];

        if (this.targetFormat === 'mp4') {
          ffmpegArgs.push('-c:v', 'libx264', '-crf', quality.crf.toString(), '-preset', 'ultrafast', '-c:a', 'aac', '-b:a', '128k', outputName);
        } else if (this.targetFormat === 'webm') {
          ffmpegArgs.push('-c:v', 'libvpx-vp9', '-crf', quality.crf.toString(), '-b:v', '0', '-c:a', 'libopus', outputName);
        }

        await this.ffmpeg.exec(ffmpegArgs);

        const data = await this.ffmpeg.readFile(outputName);
        const blob = new Blob([data.buffer], { type: `video/${this.targetFormat}` });

        const fileName = this.selectedFile.name.split('.')[0];
        this.downloadFile(blob, `${fileName}_compressed.${this.targetFormat}`);

        await this.ffmpeg.deleteFile(inputName);
        await this.ffmpeg.deleteFile(outputName);
      } catch (error) {
        console.error('Errore durante la compressione:', error);
        alert('Errore durante la compressione. Il file potrebbe essere troppo grande per il browser.');
      } finally {
        this.isCompressing = false;
        this.progress = 0;
      }
    },
  },
  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  },
};
</script>
