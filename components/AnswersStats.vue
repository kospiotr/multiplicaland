<script setup lang="ts">

import {type Answer, answerStats, type GameStats} from '~/types'

const {answers} = defineProps<{ answers: Answer[] }>()

const stats = computed(() => {
  return answerStats(answers)
})

</script>

<template>
  <UCard variant="subtle" class="rounded-3xl">
    <template #header>
      <div class="flex items-center gap-2 font-display text-lg font-bold">
        <span class="text-xl">📊</span> Summary
      </div>
    </template>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <!-- Total -->
      <div class="rounded-2xl bg-violet-50 p-4 text-center dark:bg-violet-500/10">
        <div class="text-3xl">🧮</div>
        <div class="mt-1 text-xs font-semibold text-violet-500 dark:text-violet-300">Total</div>
        <div class="font-display text-2xl font-extrabold text-violet-600 dark:text-violet-300">{{ stats.answeredCount }}</div>
      </div>

      <!-- Correct -->
      <div class="rounded-2xl bg-green-50 p-4 text-center dark:bg-green-500/10">
        <div class="text-3xl">✅</div>
        <div class="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">Correct</div>
        <div class="font-display text-2xl font-extrabold text-green-600 dark:text-green-400">{{ stats.correct }}</div>
      </div>

      <!-- Incorrect -->
      <div class="rounded-2xl bg-red-50 p-4 text-center dark:bg-red-500/10">
        <div class="text-3xl">❌</div>
        <div class="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">Incorrect</div>
        <div class="font-display text-2xl font-extrabold text-red-600 dark:text-red-400">{{ stats.incorrect }}</div>
      </div>

      <!-- Success rate -->
      <div class="rounded-2xl p-4 text-center" :class="{
        'bg-green-50 dark:bg-green-500/10': stats.percentage >= 80,
        'bg-amber-50 dark:bg-amber-500/10': stats.percentage >= 50 && stats.percentage < 80,
        'bg-red-50 dark:bg-red-500/10': stats.percentage < 50
      }">
        <div class="text-3xl">⭐</div>
        <div class="mt-1 text-xs font-semibold" :class="{
          'text-green-600 dark:text-green-400': stats.percentage >= 80,
          'text-amber-600 dark:text-amber-400': stats.percentage >= 50 && stats.percentage < 80,
          'text-red-600 dark:text-red-400': stats.percentage < 50
        }">Score</div>
        <div class="font-display text-2xl font-extrabold" :class="{
          'text-green-600 dark:text-green-400': stats.percentage >= 80,
          'text-amber-600 dark:text-amber-400': stats.percentage >= 50 && stats.percentage < 80,
          'text-red-600 dark:text-red-400': stats.percentage < 50
        }">{{ stats.percentage }}%
        </div>
      </div>
    </div>
  </UCard>
</template>
