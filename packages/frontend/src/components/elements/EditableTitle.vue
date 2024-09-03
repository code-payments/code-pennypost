<script setup lang="ts">
defineProps({
  modelValue: String,
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']);

function onInput(event: Event) {
  // Update the model value based on the input's current value
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="mt-5 mb-3 inline-block">
    <textarea type="text" rows="1"
      class="editable-title bg-transparent border-0 p-0 m-0 w-full text-4xl
      font-bold outline-none focus:outline-none focus:ring-0 table
      placeholder:text-[#bbb]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput" />
  </div>
</template>