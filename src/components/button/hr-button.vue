<template>
  <button :type="type" :disabled="disabled" class="hr-button" :class="['size-' + size, 'variant-' + variant]">
    <div v-if="!loading && leftIcon" class="hr-button-icon left">
      <component :is="leftIcon" />
    </div>
    <span v-if="!loading && label" class="hr-button-label whitespace-nowrap">{{ label }}</span>
    <div v-if="!loading && rightIcon" class="hr-button-icon right">
      <component :is="rightIcon" />
    </div>
  </button>
</template>

<script>
export default {
  name: 'hr-button',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    size: {
      type: String,
      default: 'default',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    leftIcon: String,
    label: String,
    rightIcon: String,
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.hr-button {
  position: relative;
  gap: 8px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition-property: background-color, color, opacity, transform, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.hr-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hr-button:not(:disabled):active {
  transform: scale(0.95);
}

.hr-button:not(:disabled):focus::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 12px;
  outline-width: 2px;
  outline-offset: 2px;
  outline-style: solid;
  outline-color: white;
}

/* SIZE */
.hr-button.size-default {
  padding: 8px 16px;
  height: 40px;
  border-radius: 12px;
}

.hr-button.size-large {
  padding: 12px 24px;
  height: 50px;
  border-radius: 12px;
}

/* VARIANT */
.hr-button.variant-core-primary {
  background-color: rgba(142, 72, 255, 1);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
  color: #fff;
}

.hr-button.variant-core-primary:not(:disabled):hover {
  background-color: rgba(142, 72, 255, 0.75);
}

.hr-button.variant-primary {
  background-color: #000;
  color: #fff;
}

.hr-button.variant-primary:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.75);
}

.hr-button.variant-secondary {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.4);
  color: #000;
}

.hr-button.variant-secondary:not(:disabled):hover {
  background-color: rgba(255, 255, 255, 0.75);
}
</style>
