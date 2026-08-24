<script setup lang="ts">
import {onMounted, computed} from 'vue'
import type {Answer} from "~/types";
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useTestStore} from "~/store/testStore";
import {TEST_LEVELS, TEST_MAX_MISTAKES, getTestLevel, starsForMistakes} from "~/store/testLevels";
import {getLearningMode} from "~/store/learningConfig";

const props = defineProps<{ answers: Answer[]; levelIndex: number }>()

const router = useRouter()
const currentGameStore = useCurrentGameStore()
const testStore = useTestStore()

const mistakes = computed(() => props.answers.filter(a => a.status === 'incorrect').length)
const stars = computed(() => starsForMistakes(mistakes.value))
const levelInfo = computed(() => getTestLevel(props.levelIndex))
const modeInfo = computed(() => levelInfo.value ? getLearningMode(levelInfo.value.mode) : undefined)
const nextLevel = computed(() => getTestLevel(props.levelIndex + 1))
const isLastLevel = computed(() => props.levelIndex >= TEST_LEVELS.length - 1)
const passed = computed(() => mistakes.value <= TEST_MAX_MISTAKES)

onMounted(() => {
  testStore.completeLevel(props.levelIndex, mistakes.value)
})

function playLevel(index: number) {
  currentGameStore.createTestGame(index)
}

function replay() {
  playLevel(props.levelIndex)
}

function goNext() {
  if (nextLevel.value) playLevel(nextLevel.value.index)
}

function backToMap() {
  currentGameStore.reset()
  router.push('/test')
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
          icon="i-lucide-list-checks"
          class="rounded-full px-6 font-bold"
          @click="backToMap"
      >
        Levels
      </UButton>
      <UButton
          color="neutral"
          variant="soft"
          size="xl"
          icon="i-lucide-rotate-ccw"
          class="rounded-full px-6 font-bold"
          @click="replay"
      >
        Replay
      </UButton>
      <UButton
          v-if="passed && nextLevel"
          color="primary"
          size="xl"
          icon="i-lucide-arrow-right"
          trailing
          class="rounded-full px-6 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          @click="goNext"
      >
        Next level
      </UButton>
      <UButton
          v-else-if="passed && isLastLevel"
          color="primary"
          size="xl"
          icon="i-lucide-crown"
          class="rounded-full px-6 font-bold shadow-lg"
          @click="backToMap"
      >
        You passed every test!
      </UButton>
    </div>

    <div class="text-center">
      <div class="text-6xl animate-pop-in">{{ passed ? '🎉' : '💪' }}</div>
      <h1 class="mt-1 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        Level {{ levelIndex + 1 }}
      </h1>
      <p v-if="levelInfo && modeInfo" class="text-slate-500 dark:text-slate-300">
        {{ modeInfo.emoji }} {{ modeInfo.title }} • results {{ levelInfo.range[0] }}–{{ levelInfo.range[1] }}
      </p>
      <p class="text-slate-500 dark:text-slate-300">{{ passed ? 'Level complete!' : 'Too many mistakes — try again!' }}</p>
    </div>

    <!-- Stars -->
    <div class="flex items-center gap-2">
      <span
          v-for="n in 3"
          :key="n"
          class="text-5xl transition-transform"
          :class="n <= stars ? 'animate-pop-in' : 'opacity-30 grayscale'"
          :style="{ animationDelay: `${n * 120}ms` }"
      >⭐</span>
    </div>

    <div class="font-display text-xl font-bold text-slate-700 dark:text-slate-200">
      {{ mistakes }} mistake{{ mistakes === 1 ? '' : 's' }}
    </div>

    <AnswersSummary :answers="answers"/>
  </div>
</template>
