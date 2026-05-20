<template>
  <div
    class="relative w-full mb-0 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-[#8e48ff] transition-colors cursor-pointer"
    :class="{ 'pointer-events-none': disabled, 'border-green-400 hover:border-green-400 bg-black': success }"
    @click="!disabled && $refs.fileInput.click()"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <input type="file" ref="fileInput" class="hidden" :accept="accept" @change="handleFileSelect" />

    <slot v-if="!hasFile && !loading">
      <div class="space-y-2">
        <h2 class="text-base font-semibold text-white">Drop your files here</h2>
        <p class="text-sm font-normal text-gray-300">or click to select files</p>
      </div>
    </slot>

    <slot v-else-if="loading" name="loading">
      <div class="relative flex justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-b-[#8e48ff] mx-auto"></div>
        <div v-if="isConverting" class="absolute inset-0 flex items-center justify-center">
          <span class="text-[10px] font-bold text-[#8e48ff]">{{ Math.round(progress * 100) }}%</span>
        </div>
      </div>
      <div class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8e48ff] mx-auto"></div>
        <p class="text-[#8e48ff] font-bold">Processing...</p>
      </div>
    </slot>

    <slot v-else name="preview"></slot>
  </div>
</template>

<script>
export default {
  name: 'hr-dropzone',
  props: {
    accept: {
      type: String,
      default: '*',
    },
    success: {
      type: Boolean,
      default: false,
    },
    hasFile: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['file-selected'],
  methods: {
    isValidFile(file) {
      if (!this.accept || this.accept === '*') return true;
      const acceptedTypes = this.accept.split(',').map((t) => t.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      return acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        } else if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '');
          return fileType.startsWith(baseType);
        } else {
          return fileType === type;
        }
      });
    },
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        if (this.isValidFile(file)) {
          this.$emit('file-selected', file);
        } else {
          e.target.value = '';
        }
      }
    },
    handleDrop(e) {
      if (this.disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) {
        if (this.isValidFile(file)) {
          this.$emit('file-selected', file);
        }
      }
    },
    triggerClick() {
      this.$refs.fileInput.click();
    },
  },
};
</script>
