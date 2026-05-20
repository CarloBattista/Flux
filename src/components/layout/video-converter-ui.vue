<template>
  <div class="max-w-[1024px] mx-auto space-y-8 flex gap-4 md:flex-row flex-col">
    <hrDropzone
      ref="dropzone"
      accept="video/*,.mp4,.avi,.mov,.wmv"
      :success="videoReady"
      :has-file="!!selectedFile"
      :loading="isReading || isConverting"
      :disabled="isConverting || isReading"
      @file-selected="setFile"
    >
      <template #loading>
        <div class="w-full h-full space-y-4 flex flex-col items-center justify-center">
          <div class="relative flex justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
            <div v-if="isConverting" class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-bold text-white">{{ Math.round(progress * 100) }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-white font-bold text-lg">{{ isReading ? 'Caricamento video...' : 'Conversione in corso...' }}</p>
            <p v-if="isConverting" class="text-gray-300 text-xs font-medium">L'operazione avviene interamente nel tuo browser</p>
          </div>
        </div>
      </template>
      <template #preview>
        <div class="space-y-4">
          <div class="flex justify-center">
            <video ref="previewVideo" :src="previewUrl" class="max-h-48 rounded-lg shadow-md" controls @loadedmetadata="onVideoLoaded"></video>
          </div>
          <p class="text-sm font-bold text-green-600">{{ selectedFile.name }} pronto</p>
        </div>
      </template>
    </hrDropzone>
    <div v-if="selectedFile && !isReading" class="w-full p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 flex flex-col">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Formato di Destinazione</label>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
        @click="convertVideo"
        size="large"
        variant="core-primary"
        label="Converti e Scarica"
        :disabled="isConverting || !videoReady"
        class="w-full mt-auto"
      />
      <hrButton @click="reset" size="large" variant="primary" label="Cambia file" class="w-full" />
    </div>
  </div>
</template>

<script>
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { markRaw } from 'vue';

import hrButton from '../button/hr-button.vue';
import hrDropzone from '../input/hr-dropzone.vue';

export default {
  name: 'video-converter-ui',
  components: {
    hrButton,
    hrDropzone,
  },
  props: { tool: Object },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      targetFormat: 'mp4',
      isConverting: false,
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

      // Usa markRaw per evitare che Vue crei un Proxy sull'istanza di FFmpeg
      const ffmpeg = new FFmpeg();
      this.ffmpeg = markRaw(ffmpeg);

      // Ora on() funzionerà correttamente
      this.ffmpeg.on('progress', ({ progress }) => {
        this.progress = progress;
      });

      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    },
    async convertVideo() {
      if (!this.videoReady) return;
      this.isConverting = true;
      this.progress = 0;

      try {
        await this.loadFFmpeg();

        const inputExt = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf('.'));
        const inputName = `input${inputExt}`;
        const outputName = `output.${this.targetFormat}`;

        // Convertiamo esplicitamente in Uint8Array per stabilità WASM
        const arrayBuffer = await this.selectedFile.arrayBuffer();
        await this.ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

        // Esecuzione del comando di conversione con parametri specifici per formato
        const ffmpegArgs = ['-i', inputName];

        if (this.targetFormat === 'webm') {
          // Parametri ottimizzati per WebM (VP8 + Vorbis)
          // Nota: libvpx è più lento, usiamo parametri di velocità se possibile
          ffmpegArgs.push('-c:v', 'libvpx', '-crf', '30', '-b:v', '1M', '-c:a', 'libvorbis', outputName);
        } else {
          // Default per MP4 e altri formati basati su x264
          ffmpegArgs.push('-preset', 'ultrafast', outputName);
        }

        await this.ffmpeg.exec(ffmpegArgs);

        // Lettura del file convertito
        const data = await this.ffmpeg.readFile(outputName);
        const blob = new Blob([data.buffer], { type: `video/${this.targetFormat}` });

        const fileName = this.selectedFile.name.split('.')[0];
        this.downloadFile(blob, `${fileName}.${this.targetFormat}`);

        // Pulizia file system virtuale
        await this.ffmpeg.deleteFile(inputName);
        await this.ffmpeg.deleteFile(outputName);
      } catch (error) {
        console.error('Errore durante la conversione con FFmpeg:', error);
        this.ffmpeg = null; // Resetta l'istanza in caso di crash
        alert('Errore di memoria o formato non supportato. Prova con un file più piccolo o ricarica la pagina.');
      } finally {
        this.isConverting = false;
        this.progress = 0;
      }
    },
  },
  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  },
};
</script>
