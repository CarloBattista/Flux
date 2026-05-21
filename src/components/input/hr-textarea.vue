<template>
  <div class="hr-textarea-wrapper" :class="{ disabled }">
    <label v-if="label" :for="id" class="hr-textarea-label">{{ label }}</label>
    <div class="hr-textarea-container">
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="hr-textarea"
        :class="{ 'is-readonly': readonly, 'resize-none': !resize }"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hr-textarea',
  props: {
    id: {
      type: String,
      default: () => `hr-textarea-${Math.random().toString(36).substr(2, 9)}`,
    },
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.hr-textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.hr-textarea-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
  padding-left: 4px;
}

.hr-textarea-container {
  position: relative;
  width: 100%;
}

.hr-textarea {
  width: 100%;
  min-height: 180px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}

.hr-textarea:hover:not(:disabled):not(.is-readonly) {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.hr-textarea:focus:not(.is-readonly) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #8e48ff;
  box-shadow: 0 0 0 4px rgba(142, 72, 255, 0.15);
}

.hr-textarea.is-readonly {
  cursor: default;
}

.hr-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar styling */
.hr-textarea::-webkit-scrollbar {
  width: 8px;
}
.hr-textarea::-webkit-scrollbar-track {
  background: transparent;
}
.hr-textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.hr-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
