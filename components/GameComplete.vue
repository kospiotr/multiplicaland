<script setup lang="ts">
import type {Answer} from "~/types";

defineProps<{ answers: Answer[] }>()
const emit = defineEmits<{ replay: []; home: [] }>()
</script>

<template>
  <div class="w-full">
    <div class="mb-6 text-center">
      <div class="mb-2 text-6xl animate-float">🏆</div>
      <h1 class="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">Game over!</h1>
      <p class="text-slate-500 dark:text-slate-300">Here's how you did.</p>
    </div>
    <AnswersSummary :answers="answers"/>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <UButton
          color="neutral"
          variant="soft"
          size="xl"
          icon="i-lucide-grid-2x2"
          class="rounded-full px-6 font-bold"
          @click="emit('home')"
      >
        Game modes
      </UButton>
      <UButton
          color="primary"
          size="xl"
          icon="i-lucide-rotate-ccw"
          class="rounded-full px-8 font-bold shadow-lg transition-transform hover:scale-110 active:scale-95"
          @click="emit('replay')"
      >
        Play again
      </UButton>
    </div>
  </div>
</template>
