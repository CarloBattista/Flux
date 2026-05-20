<template>
  <div class="hr-select-wrapper" :class="{ disabled }">
    <label v-if="label" :for="id" class="hr-select-label">{{ label }}</label>
    <div class="hr-select-container">
      <div v-if="leftIcon" class="hr-select-icon left">
        <component :is="leftIcon" size="18" />
      </div>

      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        class="hr-select"
        :class="{ 'has-left-icon': leftIcon, placeholder: !modelValue }"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="typeof option === 'object' ? option.value : option"
          :value="typeof option === 'object' ? option.value : option"
          :disabled="typeof option === 'object' ? option.disabled : false"
        >
          {{ typeof option === 'object' ? option.label : option }}
        </option>
      </select>

      <div class="hr-select-icon right">
        <ChevronDown size="18" />
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronDown } from '@lucide/vue';

export default {
  name: 'hr-select',
  components: {
    ChevronDown,
  },
  props: {
    modelValue: [String, Number],
    label: String,
    options: {
      type: Array,
      default: () => [],
      // Options can be ['a', 'b'] or [{ label: 'A', value: 'a' }]
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    leftIcon: [Object, Function, String],
    id: {
      type: String,
      default: () => `hr-select-${Math.random().toString(36).substr(2, 9)}`,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.hr-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.hr-select-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
  padding-left: 4px;
}

.hr-select-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.hr-select {
  width: 100%;
  height: 48px;
  padding: 0 44px 0 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 200ms ease-in-out;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.hr-select:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.hr-select:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #8e48ff;
  box-shadow: 0 0 0 4px rgba(142, 72, 255, 0.15);
}

.hr-select.has-left-icon {
  padding-left: 44px;
}

.hr-select-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  width: 44px;
  height: 100%;
}

.hr-select-icon.left {
  left: 0;
}

.hr-select-icon.right {
  right: 0;
}

.hr-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hr-select.placeholder {
  color: rgba(255, 255, 255, 0.25);
}

/* Style for options */
select option {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
