<template>
  <div v-if="currentGameStore.isStarted() && currentGameStore.mode === 'test'"
       class="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-6 sm:py-10">
    <GameComponent v-if="!currentGameStore.isCompleted()"/>
    <TestComplete
        v-else
        :answers="currentGameStore.answers"
        :level-index="currentGameStore.testLevelIndex"
    />
  </div>

  <div v-else class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:py-8">
    <div class="flex items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        <span>📝</span> Test
      </h1>
      <div class="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-1.5 font-bold text-amber-600 shadow-sm dark:bg-amber-500/15 dark:text-amber-300">
        <span class="text-xl">⭐</span> {{ testStore.totalStars }}/{{ testStore.maxStars }}
      </div>
    </div>

    <p class="text-slate-500 dark:text-slate-300">
      Clear a level with at most {{ TEST_MAX_MISTAKES }} mistakes to earn stars and unlock the next one.
    </p>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <component
          :is="testStore.isUnlocked(lvl.index) ? 'button' : 'div'"
          v-for="lvl in TEST_LEVELS"
          :key="lvl.index"
          :disabled="!testStore.isUnlocked(lvl.index)"
          class="relative flex flex-col items-center gap-1 rounded-3xl border-2 p-4 text-center shadow-md transition-transform"
          :class="testStore.isUnlocked(lvl.index)
            ? 'border-white/60 bg-white/85 backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer dark:border-white/10 dark:bg-slate-800/85'
            : 'border-dashed border-slate-300 bg-white/40 opacity-70 cursor-not-allowed dark:border-slate-600 dark:bg-slate-800/40'"
          @click="testStore.isUnlocked(lvl.index) && play(lvl.index)"
      >
        <span class="absolute left-2 top-2 text-xs font-bold text-slate-400">{{ lvl.index + 1 }}</span>

        <template v-if="testStore.isUnlocked(lvl.index)">
          <span class="font-display text-sm font-extrabold text-slate-800 dark:text-white">{{ lvl.range[0] }}–{{ lvl.range[1] }}</span>
          <span class="text-[10px] font-medium text-slate-400">{{ rangeQuestionCounts[lvl.rangeIndex] }} questions</span>
          <span class="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{{ getLearningMode(lvl.mode).emoji }}</span> {{ getLearningMode(lvl.mode).title }}
          </span>
        </template>
        <span v-else class="text-3xl">🔒</span>

        <span class="flex items-center gap-0.5">
          <span
              v-for="n in 3"
              :key="n"
              class="text-base"
              :class="n <= (testStore.getResult(lvl.index)?.stars ?? 0) ? '' : 'opacity-25 grayscale'"
          >⭐</span>
        </span>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useTestStore} from "~/store/testStore";
import {TEST_LEVELS, TEST_MAX_MISTAKES} from "~/store/testLevels";
import {LEARNING_RANGES, getLearningMode} from "~/store/learningConfig";
import {findAvailableQuestions} from "~/store/gameSettingsStore";

const currentGameStore = useCurrentGameStore()
const testStore = useTestStore()

const rangeQuestionCounts = LEARNING_RANGES.map(range =>
    new Set(findAvailableQuestions({
      multiplicandRange: [1, 10],
      multiplierRange: [1, 10],
      productRange: [range[0], range[1]],
      multiplicandVariable: false,
      multiplierVariable: false,
      productVariable: true,
      questionsCount: 0,
      timer: 0,
      fosterFailed: 0,
      fosterUnanswered: 0,
    }).map(e => e.product)).size
);

function play(index: number) {
  currentGameStore.createTestGame(index)
}
</script>
