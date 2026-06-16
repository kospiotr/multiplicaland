<script setup lang="ts">
import {onMounted, computed} from 'vue'
import type {Answer} from "~/types";
import {answerStats} from "~/types";
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useAdventureStore} from "~/store/adventureStore";
import {ADVENTURE_LEVELS, getAdventureLevel, starsForPercentage} from "~/store/adventureLevels";

const props = defineProps<{ answers: Answer[]; level: number }>()

const router = useRouter()
const currentGameStore = useCurrentGameStore()
const adventureStore = useAdventureStore()

const percentage = computed(() => answerStats(props.answers).percentage)
const stars = computed(() => starsForPercentage(percentage.value))
const levelInfo = computed(() => getAdventureLevel(props.level))
const nextLevel = computed(() => getAdventureLevel(props.level + 1))
const isLastLevel = computed(() => props.level >= ADVENTURE_LEVELS.length)
const passed = computed(() => stars.value >= 1)

onMounted(() => {
  adventureStore.completeLevel(props.level, percentage.value)
})

function playLevel(level: number) {
  const cfg = getAdventureLevel(level)
  if (!cfg) return
  currentGameStore.createNewGame(cfg.settings, 'adventure', level)
}

function replay() {
  playLevel(props.level)
}

function goNext() {
  if (nextLevel.value) playLevel(nextLevel.value.level)
}

function backToMap() {
  currentGameStore.reset()
  router.push('/adventure')
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
          icon="i-lucide-map"
          class="rounded-full px-6 font-bold"
          @click="backToMap"
      >
        Map
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
        You won the adventure!
      </UButton>
    </div>

    <div class="text-center">
      <div class="text-6xl animate-pop-in">{{ passed ? '🎉' : '💪' }}</div>
      <h1 class="mt-1 font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">
        Level {{ level }}<span v-if="levelInfo">: {{ levelInfo.title }}</span>
      </h1>
      <p class="text-slate-500 dark:text-slate-300">{{ passed ? 'Level complete!' : 'So close — try again!' }}</p>
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

    <div class="font-display text-xl font-bold text-slate-700 dark:text-slate-200">Score: {{ percentage }}%</div>

    <AnswersSummary :answers="answers"/>
  </div>
</template>
