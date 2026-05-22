<template>
  <button :type="type" :disabled="disabled" class="hr-button" :class="['size-' + size, 'variant-' + variant]">
    <span v-if="loading" class="loader"></span>
    <div v-if="!loading && leftIcon" class="hr-button-icon left">
      <component :is="leftIcon" />
    </div>
    <span v-if="!loading && label" class="hr-button-label font-medium whitespace-nowrap">{{ label }}</span>
    <div v-if="!loading && rightIcon" class="hr-button-icon right">
      <component :is="rightIcon" />
    </div>
  </button>
</template>

<script>
// ICONS
import { Check, Copy, Star } from '@lucide/vue';

export default {
  name: 'hr-button',
  components: {
    // ICONS
    Check,
    Copy,
    Star,
  },
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
  border-radius: 12px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition-property: background, background-color, color, opacity, transform, border-color;
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
.hr-button.size-small {
  padding: 8px 14px;
  height: 36px;
  min-width: 36px;
}

.hr-button.size-default {
  padding: 8px 16px;
  height: 40px;
  min-width: 40px;
}

.hr-button.size-large {
  padding: 8px 18px;
  height: 48px;
  min-width: 48px;
}

/* VARIANT */
.hr-button.variant-core-primary {
  background-color: rgba(142, 72, 255, 1);
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.25);
  color: #fff;
}

.hr-button.variant-core-primary:not(:disabled):hover {
  background-color: rgba(111, 61, 190, 1);
}

.hr-button.variant-primary {
  background: #121212;
  background: linear-gradient(900deg, rgba(18, 18, 18, 1) 0%, rgba(0, 0, 0, 1) 100%);
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.25);
  color: #fff;
}

.hr-button.variant-primary:not(:disabled):hover {
  background: #121212;
  background: linear-gradient(900deg, rgba(18, 18, 18, 1) 0%, rgba(25, 25, 25, 1) 100%);
}

.hr-button.variant-secondary {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 1);
  color: #fff;
}

.hr-button.variant-secondary:not(:disabled):hover {
  background-color: rgba(164, 164, 164, 0.45);
}

.hr-button.variant-tertiary {
  background: #4c4c4c;
  background: linear-gradient(900deg, rgba(76, 76, 76, 1) 0%, rgba(35, 35, 35, 1) 100%);
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.21);
  color: #fff;
}

.hr-button.variant-tertiary:not(:disabled):hover {
  background: #121212;
  background: linear-gradient(900deg, rgba(18, 18, 18, 1) 0%, rgba(25, 25, 25, 1) 100%);
}

/* LOADER */
.loader {
  height: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #fff;
  box-shadow:
    16px 0 #fff,
    -16px 0 #fff;
  position: relative;
  animation: flash 0.5s ease-out infinite alternate;
}

@keyframes flash {
  0% {
    background-color: #fff2;
    box-shadow:
      16px 0 #fff2,
      -16px 0 #fff;
  }
  50% {
    background-color: #fff;
    box-shadow:
      16px 0 #fff2,
      -16px 0 #fff2;
  }
  100% {
    background-color: #fff2;
    box-shadow:
      16px 0 #fff,
      -16px 0 #fff2;
  }
}
</style>
