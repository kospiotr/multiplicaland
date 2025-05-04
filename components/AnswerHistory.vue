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
  <UCard variant="subtle">
    <template #header>Answers</template>
    <table class="w-full">
      <thead>
      <tr class="border-b border-gray-200">
        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600">Question</th>
        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600">Your Answer</th>
        <th class="text-center py-3 px-4 text-sm font-medium text-gray-600">Correct Answer</th>
        <th class="text-right py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
      <tr v-for="(answer, index) in answers" :key="index"
          class="hover:bg-gray-50"
          :class="{
                  'bg-green-50/50': answer.status === 'correct',
                  'bg-red-50/50': answer.status === 'incorrect'
                }">
        <td class="py-3 px-4 text-sm text-gray-500">{{ formatTimestamp(answer.finishedTs) }}</td>
        <td class="py-3 px-4 text-sm font-medium text-gray-800">
          {{ placeholderQuestionTextProvider(answer.question) }}
        </td>
        <td class="py-3 px-4 text-sm" :class="{
                'text-green-600': answer.status === 'correct',
                'text-red-600': answer.status === 'incorrect'
              }">{{ answer.value }}
        </td>
        <td class="py-3 px-4 text-sm text-green-600">{{ correctAnswerProvider(answer.question) }}</td>
        <td class="py-3 px-4 text-sm text-gray-500 text-right">{{
            calculateDuration(answer.startedTs, answer.finishedTs)
          }}s
        </td>
      </tr>
      </tbody>
    </table>
  </UCard>

</template>
