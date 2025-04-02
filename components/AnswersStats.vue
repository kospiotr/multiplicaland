<script setup lang="ts">

import {type Answer, answerStats, type GameStats} from '~/types'

const {answers} = defineProps<{ answers: Answer[] }>()

const stats = computed(() => {
  return answerStats(answers)
})

</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <!-- Total Questions -->
    <div class="bg-gray-50 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-600 mb-1">Total Answers</div>
      <div class="text-2xl font-bold text-primary-600">{{ stats.answeredCount }}</div>
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
          }">{{ stats.percentage }}%
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>