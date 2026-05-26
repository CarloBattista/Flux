<template>
  <span class="hr-badge w-fit h-fit text-xs font-semibold" :class="['size-' + size, 'variant-' + variant]">{{ label }}</span>
</template>

<script>
export default {
  name: 'hr-badge',
  props: {
    size: {
      type: String,
      default: 'sm',
      validator: (val) => ['sm', 'md'].includes(val),
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'success', 'danger', 'warning', 'plus', 'beta'].includes(val),
    },
    label: String,
  },
};
</script>

<style scoped>
/* SIZES */
.hr-badge.size-sm {
  padding: 2px 4px;
  border-radius: 6px;
}

.hr-badge.size-md {
  padding: 4px 10px;
  border-radius: 10px;
}

/* VARIANTS */
.hr-badge.variant-success {
  background-color: rgba(0, 166, 62, 0.2);
  border: 1px solid rgb(5, 223, 114, 0.5);
  color: rgb(5, 223, 114);
}

.hr-badge.variant-warning {
  background-color: rgba(166, 133, 0, 0.2);
  border: 1px solid rgba(255, 210, 31, 0.5);
  color: rgb(255, 210, 31);
}

.hr-badge.variant-danger {
  background-color: rgba(166, 0, 0, 0.2);
  border: 1px solid rgba(255, 31, 31, 0.5);
  color: rgb(255, 31, 31);
}

.hr-badge.variant-plus {
  background: linear-gradient(135deg, rgba(255, 138, 0, 1) 0%, rgba(229, 46, 113, 1) 50%, rgba(142, 72, 255, 1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  box-shadow: 0 0 15px rgba(255, 138, 0, 0.3);
  filter: hue-rotate(235deg);
}

.hr-badge.variant-beta {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 50%, #8e48ff 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
  filter: hue-rotate(150deg);
}
</style>
