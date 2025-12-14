<script setup lang="ts">
</script>

<template>
  <main class="pt-20 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 dark:text-white">欢迎来到 FunnyHistory</h1>
      <p class="text-gray-600 dark:text-gray-300">
        这是用于验证顶部栏实现的演示内容。
        尝试滚动或切换主题。
      </p>
      <div class="mt-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  </main>
</template>
