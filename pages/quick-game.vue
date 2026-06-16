<template>
  <div class="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-6 sm:py-10">
    <template v-if="currentGameStore.isStarted() && currentGameStore.mode === 'quick'">
      <GameComponent v-if="!currentGameStore.isCompleted()"/>
      <GameComplete v-else :answers="currentGameStore.answers" @replay="start" @home="goHome"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {X_MAX, X_MIN, Y_MAX, Y_MIN} from "~/store/gameSettingsStore";
import type {GameSettingsSchema} from "~/types";

const router = useRouter()
const currentGameStore = useCurrentGameStore()

const QUICK_GAME_SETTINGS: GameSettingsSchema = {
  multiplicandRange: [X_MIN, X_MAX],
  multiplierRange: [Y_MIN, Y_MAX],
  productRange: [1, 100],
  multiplicandVariable: false,
  multiplierVariable: false,
  productVariable: true,
  questionsCount: 20,
  timer: 0,
  fosterFailed: 0,
  fosterUnanswered: 0,
}

function start() {
  currentGameStore.createNewGame(QUICK_GAME_SETTINGS, 'quick')
}

function goHome() {
  currentGameStore.reset()
  router.push('/')
}

onMounted(() => {
  const inProgress = currentGameStore.isStarted()
      && currentGameStore.mode === 'quick'
      && !currentGameStore.isCompleted()
  if (!inProgress) start()
})
</script>
