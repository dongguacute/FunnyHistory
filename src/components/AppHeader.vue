<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

type Theme = 'light' | 'dark' | 'system'

const router = useRouter()
const currentTheme = ref<Theme>('system')
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const coursePillRef = ref<HTMLElement | null>(null)
const courseTextRef = ref<HTMLElement | null>(null)
const themeSwitchRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
]

// Icons
const SunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`
const MoonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`
const SystemIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>`

const getIcon = (theme: Theme) => {
  switch (theme) {
    case 'light': return SunIcon
    case 'dark': return MoonIcon
    case 'system': return SystemIcon
  }
}

const applyTheme = (theme: Theme) => {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme)
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) {
    currentTheme.value = savedTheme
  } else {
    currentTheme.value = 'system'
  }
  applyTheme(currentTheme.value)

  // Listen for system changes if in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  })

  // Close dropdown when clicking outside
  document.addEventListener('click', handleClickOutside)

  // GSAP Animation
  const tl = gsap.timeline({ paused: true })

  if (titleRef.value && coursePillRef.value && themeSwitchRef.value && courseTextRef.value) {
    // Initial setup for GSAP to handle transforms consistently
    gsap.set(coursePillRef.value, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0
    })

    // 1. Fade out the original center text
    tl.to(courseTextRef.value, {
      opacity: 0,
      duration: 0.2,
      display: 'none'
    })

    // 2. Expand the pill width and move it down
    tl.to(coursePillRef.value, {
      width: '420px',
      y: 20, // This adds to the yPercent
      duration: 0.6,
      ease: 'power3.inOut'
    }, "<")

    // 3. Fade out external elements
    tl.to([titleRef.value, themeSwitchRef.value], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      pointerEvents: 'none'
    }, "<")

    // 4. Fade in internal elements (Title & Switch inside pill)
    // We select them by class since they are inside the pill
    const internalTitle = coursePillRef.value.querySelector('.internal-title')
    const internalSwitch = coursePillRef.value.querySelector('.internal-switch')

    if (internalTitle && internalSwitch) {
      tl.to([internalTitle, internalSwitch], {
        opacity: 1,
        display: 'flex',
        duration: 0.5,
        delay: 0.15
      }, "<")
    }
  }

  // Scroll Listener
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    isScrolled.value = scrollY > 50
    if (scrollY > 50) {
      tl.play()
    } else {
      tl.reverse()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Clean up scroll listener (simplification for this turn)
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const selectTheme = (theme: Theme) => {
  currentTheme.value = theme
  isOpen.value = false
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-50 transition-colors duration-300"
  >
    <!-- Left: Title -->
    <div
      ref="titleRef"
      @click="goHome"
      class="text-2xl font-bold text-gray-900 dark:text-white relative z-20 cursor-pointer select-none"
    >
      FunnyHistory
    </div>

    <!-- Center: Course Oval (Background for merged state) -->
    <div
      ref="coursePillRef"
      class="absolute left-1/2 top-1/2 h-12 flex items-center justify-between px-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-sm z-10 transition-colors duration-300"
      style="width: 100px;"
    >
      <!-- Internal Title (Initially hidden) -->
      <div
        @click="goHome"
        class="internal-title text-base font-bold text-gray-900 dark:text-white opacity-0 hidden pl-4 whitespace-nowrap flex-1 justify-start items-center cursor-pointer select-none"
      >
        FunnyHistory
      </div>

      <!-- Original Text -->
      <span 
        ref="courseTextRef" 
        @click="router.push('/courses')"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 font-medium whitespace-nowrap text-lg cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        课程
      </span>

      <!-- Internal Switch (Initially hidden) -->
      <div class="internal-switch opacity-0 hidden pr-2 flex-1 justify-end items-center relative">
        <button
          @click.stop="isOpen = !isOpen"
          class="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center"
        >
           <span v-html="getIcon(currentTheme)" class="w-5 h-5"></span>
        </button>

        <!-- Center Dropdown -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100 scale-100"
            leave-to-class="translate-y-1 opacity-0 scale-95"
        >
            <div
                v-if="isOpen && isScrolled"
                class="absolute top-full right-0 mt-4 w-36 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-1 overflow-hidden z-50 ring-1 ring-black/5"
            >
                <button
                    v-for="theme in themes"
                    :key="theme.value"
                    @click.stop="selectTheme(theme.value)"
                    class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
                    :class="{
                        'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20': currentTheme === theme.value,
                        'text-gray-700 dark:text-gray-300': currentTheme !== theme.value
                    }"
                >
                    <span v-html="getIcon(theme.value)" class="w-4 h-4 opacity-80"></span>
                    {{ theme.label }}
                </button>
            </div>
        </Transition>
      </div>
    </div>

    <!-- Right: Theme Switcher -->
    <div class="relative z-20" ref="dropdownRef">
      <div ref="themeSwitchRef">
        <button
          @click="isOpen = !isOpen"
          class="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          <span v-html="getIcon(currentTheme)"></span>
        </button>
      </div>

      <!-- Dropdown -->
      <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0 scale-95"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100 scale-100"
          leave-to-class="translate-y-1 opacity-0 scale-95"
      >
        <div
          v-if="isOpen && !isScrolled"
          class="absolute right-0 mt-2 w-36 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-1 overflow-hidden z-50 ring-1 ring-black/5"
        >
          <button
            v-for="theme in themes"
            :key="theme.value"
            @click="selectTheme(theme.value)"
            class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
            :class="{
              'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20': currentTheme === theme.value,
              'text-gray-700 dark:text-gray-300': currentTheme !== theme.value
            }"
          >
            <span v-html="getIcon(theme.value)" class="w-4 h-4 opacity-80"></span>
            {{ theme.label }}
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
/* No extra styles needed */
</style>
