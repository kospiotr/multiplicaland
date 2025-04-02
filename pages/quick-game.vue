<template>
  <div class="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center p-4 gap-8">
<!--    <pre>{{currentGameStore.isCompleted()}}</pre>-->
    <UButton
        color="primary"
        size="xl"
        class="transition-transform hover:scale-110"
        @click="newGame"
    >
      New Game
    </UButton>
    <GameComponent v-if="!currentGameStore.isCompleted()"/>
    <AnswersSummary :answers="currentGameStore.answers" v-else />

  </div>
</template>

<style scoped>
</style>
<script setup lang="ts">

import {useCurrentGameStore} from "~/store/currentGameStore";
import {useGameSettingsStore} from "~/store/gameSettingsStore";

const settingsStore = useGameSettingsStore()
const currentGameStore = useCurrentGameStore()
const newGame = () => {
  currentGameStore.createNewGame(settingsStore.data, 'quick')
};
</script>
