<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:py-8">
    <div class="flex items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        <span>🎓</span> Learning
      </h1>
    </div>

    <p class="text-slate-500 dark:text-slate-300">
      Pick a mode and a range. Each result must be answered correctly {{ LEARNING_TARGET }} times to be mastered — the game ends when you've mastered them all.
    </p>

    <!-- Mode toggle -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <button
          v-for="m in LEARNING_MODES"
          :key="m.key"
          class="flex items-center gap-3 rounded-3xl border-2 p-4 text-left shadow-md transition-transform hover:scale-[1.03] active:scale-95"
          :class="selectedMode === m.key
            ? 'border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-500/15'
            : 'border-white/60 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-800/80'"
          @click="selectedMode = m.key"
      >
        <span class="text-3xl">{{ m.emoji }}</span>
        <span class="min-w-0">
          <span class="block font-display text-lg font-extrabold text-slate-800 dark:text-white">{{ m.title }}</span>
          <span class="block text-sm font-medium text-slate-500 dark:text-slate-300">{{ m.description }}</span>
        </span>
      </button>
    </div>

    <!-- Range grid -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <button
          v-for="(range, i) in LEARNING_RANGES"
          :key="i"
          class="flex flex-col items-center gap-1 rounded-3xl border-2 border-white/60 bg-white/85 p-5 text-center shadow-md backdrop-blur-md transition-transform hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-slate-800/85"
          @click="play(range)"
      >
        <span class="text-3xl">🎯</span>
        <span class="font-display text-lg font-extrabold text-slate-800 dark:text-white">{{ range[0] }}–{{ range[1] }}</span>
        <span class="text-xs font-medium text-slate-500 dark:text-slate-300">results</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {LEARNING_MODES, LEARNING_RANGES, LEARNING_TARGET, type LearningMode} from "~/store/learningConfig";

const router = useRouter()
const currentGameStore = useCurrentGameStore()

const selectedMode = ref<LearningMode>('basic')

function play(range: [number, number]) {
  currentGameStore.createLearningGame(range, selectedMode.value)
  router.push('/')
}
</script>
