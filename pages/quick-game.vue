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
import {useGameSettingsStore} from "~/store/gameSettingsStore";

const router = useRouter()
const settingsStore = useGameSettingsStore()
const currentGameStore = useCurrentGameStore()

function start() {
  currentGameStore.createNewGame(settingsStore.data, 'quick')
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
