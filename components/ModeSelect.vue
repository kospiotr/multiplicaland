<script setup lang="ts">
import {useAdventureStore} from "~/store/adventureStore";
import {ADVENTURE_LEVELS} from "~/store/adventureLevels";

const router = useRouter();
const adventureStore = useAdventureStore();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <div class="flex w-full flex-col items-center gap-6">
    <div class="text-center">
      <div class="text-6xl animate-float sm:text-7xl">✖️</div>
      <h1 class="mt-2 font-display text-4xl font-extrabold text-violet-600 dark:text-violet-300 sm:text-5xl">
        Multiplica<span class="text-pink-500 dark:text-pink-400">Land</span>
      </h1>
      <p class="mt-1 text-lg font-medium text-slate-500 dark:text-slate-300">Pick a game and let's play!</p>
    </div>

    <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Learning -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/learning')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl shadow-md">🎓</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Learning</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Master each result by repetition.</span>
        </span>
      </button>

      <!-- Adventure -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/adventure')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-md">🗺️</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Adventure</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">
            {{ ADVENTURE_LEVELS.length }} levels • {{ adventureStore.totalStars }}/{{ adventureStore.maxStars }} ⭐
          </span>
        </span>
      </button>

      <!-- Quick game -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/quick-game')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-3xl shadow-md">⚡</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Quick Game</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Jump right in with your current settings.</span>
        </span>
      </button>

      <!-- Custom game -->
      <button
          class="group flex items-center gap-4 rounded-3xl border-2 border-white/60 bg-white/80 p-5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/80"
          @click="router.push('/custom-game')"
      >
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-3xl shadow-md">🎛️</span>
        <span class="min-w-0">
          <span class="block font-display text-xl font-extrabold text-slate-800 dark:text-white">Custom Game</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">Choose your own rules, then play.</span>
        </span>
      </button>

    </div>

    <!-- Secondary actions -->
    <div class="flex w-full items-center justify-center gap-3">
      <UButton
          color="neutral"
          variant="soft"
          size="lg"
          icon="i-lucide-bar-chart-3"
          class="rounded-full px-6 font-bold"
          @click="router.push('/statistics')"
      >
        Statistics
      </UButton>
      <UButton
          color="neutral"
          variant="soft"
          size="lg"
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          class="rounded-full transition-transform hover:scale-110 active:scale-95"
          :aria-label="isDark ? 'Light mode' : 'Dark mode'"
          @click="isDark = !isDark"
      />
    </div>
  </div>
</template>
