<script setup lang="ts">
import { useCurrentGameStore } from '~/store/currentGameStore'
import {correctAnswerProvider, placeholderQuestionTextProvider} from "../types";

const currentGameStore = useCurrentGameStore()
const stats = computed(() => currentGameStore.stats())
const answers = computed(() => currentGameStore.answers)

function formatTimestamp(date: number) {
  //formatTimestamp in the format: yyyyMM-dd hh:mm:ss
  return new Date(date).toLocaleString();
}

function calculateDuration(startTs: number, finishTs: number) {
  if(!startTs || !finishTs){
    return '-';
  }
  console.log(startTs, finishTs)
  return Math.round(((finishTs - startTs)) / 1000)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 gap-8">
    <!-- Stats Summary -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Game Summary</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <!-- Total Questions -->
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <div class="text-sm text-gray-600 mb-1">Total Questions</div>
          <div class="text-2xl font-bold text-primary-600">{{ stats.total }}</div>
        </div>

        <!-- Correct Answers -->
        <div class="bg-green-50 rounded-xl p-4 text-center">
          <div class="text-sm text-green-600 mb-1">Correct</div>
          <div class="text-2xl font-bold text-green-600">{{ stats.correct }}</div>
        </div>

        <!-- Incorrect Answers -->
        <div class="bg-red-50 rounded-xl p-4 text-center">
          <div class="text-sm text-red-600 mb-1">Incorrect</div>
          <div class="text-2xl font-bold text-red-600">{{ stats.incorrect }}</div>
        </div>

        <!-- Success Rate -->
        <div class="bg-blue-50 rounded-xl p-4 text-center">
          <div class="text-sm text-blue-600 mb-1">Success Rate</div>
          <div class="text-2xl font-bold" :class="{
            'text-green-600': stats.percentage >= 80,
            'text-yellow-600': stats.percentage >= 50 && stats.percentage < 80,
            'text-red-600': stats.percentage < 50
          }">{{ stats.percentage }}%</div>
        </div>
      </div>
    </div>

    <!-- Answer History -->
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Answer History</h2>
      
      <div class="overflow-x-auto">
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
              }">{{ answer.value }}</td>
              <td class="py-3 px-4 text-sm text-green-600">{{ correctAnswerProvider(answer.question) }}</td>
              <td class="py-3 px-4 text-sm text-gray-500 text-right">{{ calculateDuration(answer.startedTs, answer.finishedTs) }}s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 