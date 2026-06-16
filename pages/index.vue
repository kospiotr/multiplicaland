<template>
  <div class="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-6 sm:py-10">
    <template v-if="currentGameStore.isStarted()">
      <GameComponent v-if="!currentGameStore.isCompleted()"/>

      <!-- Adventure completion -->
      <AdventureComplete
          v-else-if="currentGameStore.mode === 'adventure'"
          :answers="currentGameStore.answers"
          :level="currentGameStore.adventureLevel"
      />

      <!-- Learning completion -->
      <LearningComplete
          v-else-if="currentGameStore.isLearning"
          :answers="currentGameStore.answers"
      />

      <!-- Quick / Custom completion -->
      <div v-else class="w-full">
        <div class="mb-6 text-center">
          <div class="mb-2 text-6xl animate-float">🏆</div>
          <h1 class="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">Game over!</h1>
          <p class="text-slate-500 dark:text-slate-300">Here's how you did.</p>
        </div>
        <AnswersSummary :answers="currentGameStore.answers"/>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <UButton
              color="neutral"
              variant="soft"
              size="xl"
              icon="i-lucide-grid-2x2"
              class="rounded-full px-6 font-bold"
              @click="backToModes"
          >
            Game modes
          </UButton>
          <UButton
              color="primary"
              size="xl"
              icon="i-lucide-rotate-ccw"
              class="rounded-full px-8 font-bold shadow-lg transition-transform hover:scale-110 active:scale-95"
              @click="playAgain"
          >
            Play again
          </UButton>
        </div>
      </div>
    </template>

    <!-- No active game: mode picker -->
    <ModeSelect v-else/>
  </div>
</template>

<script setup lang="ts">
import {useCurrentGameStore} from "~/store/currentGameStore";
import {useGameSettingsStore} from "~/store/gameSettingsStore";

const settingsStore = useGameSettingsStore()
const currentGameStore = useCurrentGameStore()

function playAgain() {
  currentGameStore.createNewGame(settingsStore.data, currentGameStore.mode)
}

function backToModes() {
  currentGameStore.reset()
}
</script>
