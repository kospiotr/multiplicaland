<script setup lang="ts">

import {
  type Answer,
  calculateDuration,
  correctAnswerProvider,
  formatTimestamp,
  placeholderQuestionTextProvider
} from "~/types";

const {answers} = defineProps<{ answers: Answer[] }>()
</script>

<template>
  <UCard variant="subtle" class="rounded-3xl">
    <template #header>
      <div class="flex items-center gap-2 font-display text-lg font-bold">
        <span class="text-xl">📝</span> Answers
      </div>
    </template>
    <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
      <tr class="border-b border-slate-200 dark:border-slate-700">
        <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Time</th>
        <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
        <th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Your Answer</th>
        <th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Correct</th>
        <th class="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
      <tr v-for="(answer, index) in answers" :key="index"
          :class="{
                  'bg-green-50/60 dark:bg-green-500/10': answer.status === 'correct',
                  'bg-red-50/60 dark:bg-red-500/10': answer.status === 'incorrect'
                }">
        <td class="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">{{ formatTimestamp(answer.finishedTs) }}</td>
        <td class="py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
          {{ placeholderQuestionTextProvider(answer.question) }}
        </td>
        <td class="py-3 px-4 text-sm font-bold" :class="{
                'text-green-600 dark:text-green-400': answer.status === 'correct',
                'text-red-600 dark:text-red-400': answer.status === 'incorrect'
              }">{{ answer.value }}
        </td>
        <td class="py-3 px-4 text-center text-sm font-semibold text-green-600 dark:text-green-400">{{ correctAnswerProvider(answer.question) }}</td>
        <td class="py-3 px-4 text-sm text-slate-500 text-right whitespace-nowrap">{{
            calculateDuration(answer.startedTs, answer.finishedTs)
          }}s
        </td>
      </tr>
      </tbody>
    </table>
    </div>
  </UCard>

</template>
