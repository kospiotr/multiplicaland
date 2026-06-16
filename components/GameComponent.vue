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
  <div class="flex w-full flex-col items-center gap-5">
    <!-- Stats pills -->
    <div class="flex w-full flex-wrap items-center justify-center gap-2">
      <!-- Time left -->
      <div
          v-if="timerValue > 0"
          class="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur dark:bg-slate-800/70"
      >
        <UIcon name="i-lucide-timer" class="h-4 w-4" :class="{
          'text-green-500': timeLeft > timerValue * 0.7,
          'text-amber-500': timeLeft > timerValue * 0.3 && timeLeft <= timerValue * 0.7,
          'text-red-500': timeLeft <= timerValue * 0.3
        }"/>
        <span class="text-sm font-bold tabular-nums" :class="{
          'text-green-500': timeLeft > timerValue * 0.7,
          'text-amber-500': timeLeft > timerValue * 0.3 && timeLeft <= timerValue * 0.7,
          'text-red-500': timeLeft <= timerValue * 0.3
        }">{{ timeLeft }}s</span>
      </div>

      <!-- Progress -->
      <div class="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur dark:bg-slate-800/70">
        <div class="h-2 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
              class="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
              :style="{ width: `${(stats.answeredCount / stats.total) * 100}%` }"
          />
        </div>
        <span class="text-sm font-bold tabular-nums text-slate-600 dark:text-slate-300">{{ stats.answeredCount }}/{{ stats.total }}</span>
      </div>

      <!-- Correct -->
      <div class="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 shadow-sm dark:bg-green-500/15">
        <UIcon name="i-lucide-check-circle-2" class="h-4 w-4 text-green-500"/>
        <span class="text-sm font-bold text-green-600 dark:text-green-400">{{ stats.correct }}</span>
      </div>

      <!-- Incorrect -->
      <div class="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 shadow-sm dark:bg-red-500/15">
        <UIcon name="i-lucide-x-circle" class="h-4 w-4 text-red-500"/>
        <span class="text-sm font-bold text-red-600 dark:text-red-400">{{ stats.incorrect }}</span>
      </div>

      <!-- Success rate -->
      <div class="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur dark:bg-slate-800/70">
        <UIcon name="i-lucide-star" class="h-4 w-4" :class="{
          'text-green-500': stats.percentage >= 80,
          'text-amber-500': stats.percentage >= 50 && stats.percentage < 80,
          'text-red-500': stats.percentage < 50
        }"/>
        <span class="text-sm font-bold tabular-nums" :class="{
          'text-green-500': stats.percentage >= 80,
          'text-amber-500': stats.percentage >= 50 && stats.percentage < 80,
          'text-red-500': stats.percentage < 50
        }">{{ stats.percentage }}%</span>
      </div>
    </div>

    <!-- Question card -->
    <div
        class="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all dark:border-white/10 dark:bg-slate-800/80 sm:p-8"
        :class="{
          'border-green-300 dark:border-green-500/40': isCorrect === true,
          'border-red-300 dark:border-red-500/40 animate-shake': isCorrect === false
        }"
    >
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-300/40 blur-2xl"/>
      <div class="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-pink-300/40 blur-2xl"/>

      <p class="relative mb-2 text-center text-sm font-semibold uppercase tracking-wide text-violet-400 dark:text-violet-300">
        What's the answer?
      </p>
      <div class="relative mb-6 text-center font-display text-5xl font-extrabold text-slate-800 dark:text-white sm:text-6xl">
        {{ question }}
      </div>

      <div class="relative flex flex-col gap-3 sm:flex-row">
        <UInput
            ref="inputRef"
            v-model="answer"
            type="number"
            placeholder="?"
            size="xl"
            :ui="{ base: 'text-center text-2xl font-bold rounded-2xl py-3' }"
            class="flex-1"
            @keyup.enter="checkAnswer"
            :disabled="isCorrect !== null"
        />
        <UButton
            :disabled="isCorrect !== null"
            color="primary"
            size="xl"
            icon="i-lucide-check"
            class="justify-center rounded-2xl px-6 font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            @click="checkAnswer"
        >
          Check
        </UButton>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="isCorrect !== null" class="flex flex-col items-center gap-3 text-center">
      <div v-if="isCorrect" class="animate-pop-in">
        <div class="mb-1 text-6xl">🎉</div>
        <div class="font-display text-3xl font-extrabold text-green-500">Awesome!</div>
        <div class="text-base font-medium text-slate-500 dark:text-slate-300">Great job, keep it up!</div>
      </div>
      <div v-else class="animate-pop-in">
        <div class="mb-1 text-6xl">💪</div>
        <div class="font-display text-3xl font-extrabold text-red-500">Almost!</div>
        <div class="text-base font-medium text-slate-500 dark:text-slate-300">
          The answer is <span class="font-bold text-slate-700 dark:text-white">{{ correctAnswer }}</span>
        </div>
      </div>

      <UButton
          color="primary"
          size="xl"
          :icon="paused ? 'i-lucide-play' : 'i-lucide-pause'"
          class="rounded-full px-8 font-bold shadow-lg transition-transform hover:scale-110 active:scale-95"
          @click="pauseResume"
      >
        {{ paused ? 'Resume' : 'Pause' }}
      </UButton>
    </div>
  </div>
</template>
