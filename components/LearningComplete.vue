<script setup lang="ts">
import {onMounted, computed} from 'vue'
import type {Answer} from "~/types";
import {answerStats} from "~/types";
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useLearningStore} from "~/store/learningStore";
import {getLearningMode} from "~/store/learningConfig";

const props = defineProps<{ answers: Answer[] }>()

const router = useRouter()
const currentGameStore = useCurrentGameStore()
const learningStore = useLearningStore()

const percentage = computed(() => answerStats(props.answers).percentage)
const range = computed(() => currentGameStore.learningRange)
const modeInfo = computed(() => getLearningMode(currentGameStore.learningModeKey))

onMounted(() => {
  learningStore.completeLearning(currentGameStore.learningModeKey, currentGameStore.learningRangeIndex, percentage.value)
})

function replay() {
  currentGameStore.createLearningGame(range.value, currentGameStore.learningModeKey, currentGameStore.learningRangeIndex)
}

function backToLearning() {
  currentGameStore.reset()
  router.push('/learning')
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-6">
    <!-- Actions -->
    <div class="mb-4 flex w-full flex-wrap items-center justify-center gap-3 border-b border-white/40 pb-6 dark:border-white/10">
      <UButton
          color="neutral"
          variant="soft"
          size="xl"
          icon="i-lucide-graduation-cap"
          class="rounded-full px-6 font-bold"
          @click="backToLearning"
      >
        Learning
      </UButton>
      <UButton
          color="primary"
          size="xl"
          icon="i-lucide-rotate-ccw"
          class="rounded-full px-6 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          @click="replay"
      >
        Replay
      </UButton>
    </div>

    <div class="text-center">
      <div class="text-6xl animate-pop-in">🎓</div>
      <h1 class="mt-1 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        Mastered!
      </h1>
      <p class="text-slate-500 dark:text-slate-300">
        {{ modeInfo.emoji }} {{ modeInfo.title }} • results {{ range[0] }}–{{ range[1] }}
      </p>
    </div>

    <!-- Completed badge -->
    <div class="flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-display text-xl font-extrabold text-emerald-600 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-300">
      <span class="text-2xl">✅</span> Completed
    </div>

    <div class="font-display text-xl font-bold text-slate-700 dark:text-slate-200">Score: {{ percentage }}%</div>

    <AnswersSummary :answers="answers"/>
  </div>
</template>
