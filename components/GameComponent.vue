<script setup lang="ts">
import {useGameEngine} from '~/composables/useGameEngine'
import {onMounted} from 'vue'

const {
  stats,
  answer,
  isCorrect,
  correctAnswer,
  timeLeft,
  timerValue,
  question,
  checkAnswer,
  pauseResume,
  focusInput,
  isCompleted,
  paused
} = useGameEngine()

const input = useTemplateRef('inputRef')

onMounted(() => {
  focusInput.value = () => input.value?.inputRef?.focus()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 gap-8">
    <!-- Stats Panel -->
    <div class="">
      <div class="flex items-center gap-6">


        <!-- Progress -->
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="h-5 w-5 text-primary-500"/>
          <div class="text-sm font-medium" :class="{
            'text-green-500': timeLeft > timerValue * 0.7,
            'text-yellow-500': timeLeft > timerValue * 0.3 && timeLeft <= timerValue * 0.7,
            'text-red-500': timeLeft <= timerValue * 0.3
          }">
            {{ timeLeft }}s
          </div>
        </div>


        <!-- Timer -->
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" class="h-5 w-5 text-primary-500"/>
          <div class="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                class="h-full bg-primary-500 transition-all duration-300"
                :style="{ width: `${(stats.answeredCount / stats.total) * 100}%` }"
            />
          </div>
          <span class="text-sm font-medium">{{ stats.answeredCount }}/{{ stats.total }}</span>
        </div>

        <!-- Correct -->
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500"/>
          <span class="text-sm font-medium text-green-500">{{ stats.correct }}</span>
        </div>

        <!-- Incorrect -->
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-x-circle" class="h-5 w-5 text-red-500"/>
          <span class="text-sm font-medium text-red-500">{{ stats.incorrect }}</span>
        </div>

        <!-- Success Rate -->
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-trophy" class="h-5 w-5" :class="{
                'text-green-500': stats.percentage >= 80,
                'text-yellow-500': stats.percentage >= 50 && stats.percentage < 80,
                'text-red-500': stats.percentage < 50
              }"/>
          <span class="text-sm font-medium" :class="{
                'text-green-500': stats.percentage >= 80,
                'text-yellow-500': stats.percentage >= 50 && stats.percentage < 80,
                'text-red-500': stats.percentage < 50
              }">{{ stats.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Question Display -->
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:scale-105">
      <div class="text-center">
        <div class="text-6xl font-bold text-gray-800 mb-6">
          {{ question }}
        </div>
        <div class="flex justify-center items-center gap-4">
          <UInput
              ref="inputRef"
              v-model="answer"
              type="number"
              class="w-32 text-center text-3xl font-bold text-primary-600"
              placeholder="?"
              @keyup.enter="checkAnswer"
              :disabled="isCorrect !== null"
          />
          <UButton
              color="primary"
              size="xl"
              :disabled="isCorrect !== null"
              class="transition-transform hover:scale-110"
              @click="checkAnswer"
          >
            <UIcon name="i-heroicons-check" class="h-6 w-6 mr-2"/>
            Check
          </UButton>
        </div>
      </div>
    </div>

    <!-- Feedback Display -->
    <div v-if="isCorrect !== null" class="text-center mb-8">
      <div v-if="isCorrect" class="text-4xl font-bold text-green-500 mb-4 animate-bounce">
        <UIcon name="i-heroicons-check-circle" class="h-12 w-12 mx-auto mb-2"/>
        Correct!
      </div>
      <div v-else class="text-4xl font-bold text-red-500 mb-4 animate-shake">
        <UIcon name="i-heroicons-x-circle" class="h-12 w-12 mx-auto mb-2"/>
        Try Again!
      </div>
      <div class="text-xl text-gray-600 mb-4">
        {{ isCorrect ? 'Great job!' : `The correct answer is ${correctAnswer}` }}
      </div>
      <UButton
          color="primary"
          size="xl"
          class="transition-transform hover:scale-110"
          @click="pauseResume"
      >
        <template v-if="paused">
          Resume
        </template>
        <template v-else>
          Pause
        </template>
      </UButton>
    </div>

  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
