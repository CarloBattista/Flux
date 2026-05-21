<template>
  <div class="hr-slider-container w-full py-4">
    <div ref="track" class="relative h-2 w-full bg-white/10 rounded-full cursor-pointer touch-none" @mousedown="startDrag" @touchstart="startDrag">
      <div class="absolute h-full bg-[#8e48ff] rounded-full" :style="{ width: percentage + '%' }"></div>
      <div
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
        :style="{ left: percentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hr-slider',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isDragging: false,
    };
  },
  computed: {
    percentage() {
      const val = Math.max(this.min, Math.min(this.max, this.modelValue));
      return ((val - this.min) / (this.max - this.min)) * 100;
    },
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      this.updateValue(event);
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('touchmove', this.onDrag, { passive: false });
      window.addEventListener('touchend', this.stopDrag);
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      this.updateValue(event);
    },
    stopDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('touchmove', this.onDrag);
      window.removeEventListener('touchend', this.stopDrag);
    },
    updateValue(event) {
      const track = this.$refs.track;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = offsetX / rect.width;

      let newValue = this.min + percentage * (this.max - this.min);

      // Applica lo step
      if (this.step > 0) {
        newValue = Math.round(newValue / this.step) * this.step;
      }

      // Vincola ai limiti
      newValue = Math.max(this.min, Math.min(this.max, newValue));

      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style scoped>
.hr-slider-container {
  user-select: none;
}
</style>
