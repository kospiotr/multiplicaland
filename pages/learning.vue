<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-6 sm:py-8">
    <div class="flex items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        <span>🎓</span> Learning
      </h1>
      <div class="flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-1.5 font-bold text-emerald-600 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-300">
        <span class="text-xl">✅</span> {{ learningStore.completedCount }}/{{ learningStore.totalGames }}
      </div>
    </div>

    <p class="text-slate-500 dark:text-slate-300">
      Each result must be answered correctly {{ LEARNING_TARGET }} times to be mastered — the game ends when you've mastered them all. Pick any range in any mode.
    </p>

    <!-- One section per mode -->
    <section v-for="mode in LEARNING_MODES" :key="mode.key" class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ mode.emoji }}</span>
        <div class="min-w-0">
          <h2 class="font-display text-2xl font-extrabold text-slate-800 dark:text-white">{{ mode.title }}</h2>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-300">{{ mode.description }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <button
            v-for="(range, i) in LEARNING_RANGES"
            :key="i"
            class="relative flex flex-col items-center gap-1 rounded-3xl border-2 p-4 text-center shadow-md backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
            :class="learningStore.isCompleted(mode.key, i)
              ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
              : 'border-white/60 bg-white/85 dark:border-white/10 dark:bg-slate-800/85'"
            @click="play(range, mode.key, i)"
        >
          <span
              v-if="learningStore.isCompleted(mode.key, i)"
              class="absolute right-2 top-2 text-lg"
          >✅</span>
          <span class="text-2xl">🎯</span>
          <span class="font-display text-lg font-extrabold text-slate-800 dark:text-white">{{ range[0] }}–{{ range[1] }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useLearningStore} from "~/store/learningStore";
import {LEARNING_MODES, LEARNING_RANGES, LEARNING_TARGET, type LearningMode} from "~/store/learningConfig";

const router = useRouter()
const currentGameStore = useCurrentGameStore()
const learningStore = useLearningStore()

function play(range: [number, number], mode: LearningMode, index: number) {
  currentGameStore.createLearningGame(range, mode, index)
  router.push('/')
}
</script>
