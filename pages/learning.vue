<template>
  <div v-if="currentGameStore.isStarted() && currentGameStore.isLearning"
       class="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-6 sm:py-10">
    <GameComponent v-if="!currentGameStore.isCompleted()"/>
    <GameComplete
        v-else-if="currentGameStore.mode === 'improve'"
        :answers="currentGameStore.answers"
        @replay="replayImprove"
        @home="exitImprove"
    />
    <LearningComplete v-else :answers="currentGameStore.answers"/>
  </div>

  <div v-else class="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-6 sm:py-8">
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
          <span class="text-xs font-medium text-slate-500 dark:text-slate-300">{{ rangeQuestionCounts[i] }} questions</span>
          <span
              v-if="learningStore.getResult(mode.key, i)"
              class="text-xs font-bold text-emerald-600 dark:text-emerald-300"
          >Best {{ learningStore.getResult(mode.key, i)?.bestPercentage }}%</span>
        </button>
      </div>
    </section>

    <!-- Practice the trickiest results -->
    <section v-if="worstProducts.length" class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <span class="text-3xl">💪</span>
        <div class="min-w-0">
          <h2 class="font-display text-2xl font-extrabold text-slate-800 dark:text-white">Practice your trickiest results</h2>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-300">
            The results you find hardest. Master each one {{ IMPROVE_TARGET }} times to finish a game.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
            v-for="p in worstProducts"
            :key="p.product"
            class="flex items-center gap-2 rounded-2xl border-2 border-white/60 bg-white/85 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-800/85"
        >
          <span class="font-display text-xl font-extrabold text-slate-800 dark:text-white">{{ p.product }}</span>
          <span class="flex flex-col leading-tight">
            <span
                class="text-xs font-bold"
                :class="p.accuracy >= 80 ? 'text-green-500' : p.accuracy >= 50 ? 'text-amber-500' : 'text-red-500'"
            >{{ p.accuracy }}%</span>
            <span class="text-xs font-medium text-slate-400">{{ p.avgSeconds }}s</span>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
            v-for="m in IMPROVE_MODES"
            :key="m.key"
            class="group flex items-center gap-3 rounded-3xl border-2 border-white/60 bg-white/85 p-4 text-left shadow-md backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-95 dark:border-white/10 dark:bg-slate-800/85"
            @click="startImprove(m)"
        >
          <span class="text-2xl">{{ m.emoji }}</span>
          <span class="min-w-0">
            <span class="block font-display text-lg font-extrabold text-slate-800 dark:text-white">{{ m.title }}</span>
            <span class="block text-xs font-medium text-slate-500 dark:text-slate-300">{{ m.description }}</span>
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useLearningStore} from "~/store/learningStore";
import {useGameProgressStore} from "~/store/progressStore";
import {LEARNING_MODES, LEARNING_RANGES, LEARNING_TARGET, type LearningMode} from "~/store/learningConfig";
import {IMPROVE_COUNT, IMPROVE_MODES, IMPROVE_TARGET, type ImproveModeInfo} from "~/store/improveConfig";
import {findAvailableQuestions} from "~/store/gameSettingsStore";

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
    }).map(e => e.product)).size * LEARNING_TARGET
);

const currentGameStore = useCurrentGameStore()
const learningStore = useLearningStore()
const progressStore = useGameProgressStore()

function play(range: [number, number], mode: LearningMode, index: number) {
  currentGameStore.createLearningGame(range, mode, index)
}

interface ProductScore {
  product: number;
  accuracy: number;
  avgSeconds: number;
}

const worstProducts = computed<ProductScore[]>(() => {
  const acc = new Map<number, { total: number; correct: number; totalMs: number }>();
  for (const a of progressStore.answers) {
    const z = a.question.product;
    const e = acc.get(z) ?? {total: 0, correct: 0, totalMs: 0};
    e.total++;
    if (a.status === 'correct') e.correct++;
    e.totalMs += Math.max(0, a.finishedTs - a.startedTs);
    acc.set(z, e);
  }
  return [...acc.entries()]
      .map(([product, e]) => ({
        product,
        accuracyRatio: e.correct / e.total,
        accuracy: Math.round((e.correct / e.total) * 100),
        avgMs: e.totalMs / e.total,
        avgSeconds: Math.round(e.totalMs / e.total / 1000),
      }))
      // least accurate first; ties (and fully-accurate ones) broken by slowest
      .sort((a, b) => a.accuracyRatio - b.accuracyRatio || b.avgMs - a.avgMs)
      .slice(0, IMPROVE_COUNT)
      .map(({product, accuracy, avgSeconds}) => ({product, accuracy, avgSeconds}));
});

function startImprove(mode: ImproveModeInfo) {
  currentGameStore.createImproveGame(worstProducts.value.map(p => p.product), mode);
}

function replayImprove() {
  const s = currentGameStore.settings;
  const mode = IMPROVE_MODES.find(m => m.timer === s?.timer
      && m.multiplicandVariable === s?.multiplicandVariable
      && m.multiplierVariable === s?.multiplierVariable
      && m.productVariable === s?.productVariable) ?? IMPROVE_MODES[0];
  currentGameStore.createImproveGame(currentGameStore.availableProducts, mode);
}

function exitImprove() {
  currentGameStore.reset();
}
</script>
