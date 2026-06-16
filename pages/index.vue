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

      <!-- Custom completion -->
      <GameComplete
          v-else
          :answers="currentGameStore.answers"
          @replay="playAgain"
          @home="backToModes"
      />
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
