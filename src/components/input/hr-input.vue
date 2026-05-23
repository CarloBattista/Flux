<template>
  <div class="hr-input-wrapper" :class="{ disabled, 'has-error': error }">
    <label v-if="label" :for="id" class="hr-input-label">{{ label }}</label>
    <div class="hr-input-container">
      <div v-if="leftIcon" class="hr-input-icon left">
        <component :is="leftIcon" size="18" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="hr-input"
        :class="{ 'has-left-icon': leftIcon, 'has-right-icon': rightIcon }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div v-if="rightIcon" class="hr-input-icon right">
        <component :is="rightIcon" size="18" />
      </div>
    </div>
    <div v-if="error" class="w-full px-2 flex gap-2 items-center">
      <p class="text-red-500 text-sm font-medium">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hr-input',
  props: {
    modelValue: [String, Number],
    id: {
      type: String,
      default: () => `hr-input-${Math.random().toString(36).substr(2, 9)}`,
    },
    type: {
      type: String,
      default: 'text',
    },
    leftIcon: [Object, Function, String],
    rightIcon: [Object, Function, String],
    label: String,
    placeholder: String,
    error: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.hr-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.hr-input-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
  padding-left: 4px;
}

.hr-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.hr-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 200ms ease-in-out;
  outline: none;
}

.hr-input:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.hr-input-wrapper.has-error .hr-input {
  background-color: rgba(255, 0, 0, 0.05);
  border-color: rgba(255, 0, 0, 0.5);
}

.hr-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #8e48ff;
  box-shadow: 0 0 0 4px rgba(142, 72, 255, 0.15);
}

.hr-input.has-left-icon {
  padding-left: 44px;
}

.hr-input.has-right-icon {
  padding-right: 44px;
}

.hr-input-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  width: 44px;
  height: 100%;
}

.hr-input-icon.left {
  left: 0;
}

.hr-input-icon.right {
  right: 0;
}

.hr-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hr-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}
</style>
