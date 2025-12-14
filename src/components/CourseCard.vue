<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full cursor-pointer group">
    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ title }}</h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm leading-relaxed">{{ description }}</p>
    <div class="flex flex-wrap gap-2 mt-auto">
      <span 
        v-for="tag in tags" 
        :key="tag" 
        class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-md font-medium"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  tags: string[];
}

defineProps<Props>();
</script>
