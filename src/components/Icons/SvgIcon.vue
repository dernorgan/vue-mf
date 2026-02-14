<template>
  <Suspense>
    <template #default>
      <component :is="AsyncIcon" v-if="AsyncIcon" v-bind="$attrs" />
      <div v-else>Icon "{{ name }}" not found</div>
    </template>
    <template #fallback>
      <div>Loading icon...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

// Збираємо всі .vue-файли з поточної папки
const icons = import.meta.glob('./*.vue');

// Створюємо реактивний async-компонент
const AsyncIcon = computed(() => {
  // без змін реєструємо ім’я файлу в тому ж форматі, що й файл
  const loader = icons[`./${props.name}.vue`];
  return loader ? defineAsyncComponent(loader) : null;
});
</script>
