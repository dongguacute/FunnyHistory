<template>
  <div class="min-h-screen flex flex-col items-center pt-[20vh] bg-white">
    <!-- 艺术字标题 -->
    <h1 ref="titleRef" class="course-title text-8xl mb-12 text-gray-800 opacity-0 transform translate-y-10 select-none">
      课程
    </h1>

    <!-- 搜索框容器 -->
    <div ref="containerRef" class="search-container w-full max-w-2xl px-4 opacity-0 transform translate-y-10">
      <div
        ref="searchBoxRef"
        class="search-box relative flex items-center w-full px-6 py-3 rounded-full border border-gray-200 hover:shadow-md transition-shadow duration-300 bg-white"
        :class="{ 'shadow-lg border-transparent': isFocused }"
      >
        <!-- 搜索图标 -->
        <span class="text-gray-400 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        <!-- 输入框 -->
        <input
          type="text"
          class="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400 bg-transparent"
          placeholder="搜索课程..."
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <!-- 麦克风图标 (装饰用) -->
        <span class="text-blue-500 ml-4 cursor-pointer hover:opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </span>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="w-full max-w-6xl px-4 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(course, index) in courses"
        :key="index"
        ref="cardsRef"
        class="opacity-0 transform translate-y-10"
      >
        <CourseCard
          :title="course.name"
          :description="course.description"
          :tags="course.tag"
        />
      </div>
    </div>

    <!-- 下方留白 -->
    <div class="flex-grow pb-20"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import CourseCard from '@/components/CourseCard.vue';

interface Course {
  name: string;
  description: string;
  tag: string[];
}

const isFocused = ref(false);
const titleRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const searchBoxRef = ref<HTMLElement | null>(null);
const cardsRef = ref<HTMLElement[]>([]);

// 自动读取 content 文件夹下的所有 json 文件
const courses = ref<Course[]>([]);
const modules = import.meta.glob('../content/*.json', { eager: true });

for (const path in modules) {
  const mod = modules[path] as { default: Course } | Course;
  // 处理默认导出或直接作为 JSON 对象
  const data = 'default' in mod ? mod.default : mod;
  if (data && data.name && data.description) {
    courses.value.push({
      name: data.name,
      description: data.description,
      tag: data.tag || []
    });
  }
}

const handleFocus = () => {
  isFocused.value = true;
  // 聚焦时的动画
  if (searchBoxRef.value) {
    gsap.to(searchBoxRef.value, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
};

const handleBlur = () => {
  isFocused.value = false;
  // 失焦时的动画
  if (searchBoxRef.value) {
    gsap.to(searchBoxRef.value, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
};

onMounted(() => {
  // 进场动画
  const tl = gsap.timeline();

  if (titleRef.value) {
    tl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }

  if (containerRef.value) {
    tl.to(containerRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6'); // 稍微重叠
  }

  if (cardsRef.value.length > 0) {
    tl.to(cardsRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.4');
  }
});
</script>

<style scoped>
@font-face {
  font-family: 'Ma Shan Zheng';
  src: url('@/assets/fonts/MaShanZheng-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.course-title {
  font-family: 'Ma Shan Zheng', cursive;
  font-weight: 400;
  color: #1f2937; /* text-gray-800 */
}
</style>
