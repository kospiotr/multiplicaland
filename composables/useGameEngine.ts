import { ref, onMounted, onUnmounted } from 'vue'
import { useGameSettingsStore } from '~/store/gameSettingsStore'
import {useCurrentGameStore} from "~/store/currentGameStore";

export function useGameEngine() {
  const store = useGameSettingsStore()
  const currentGameStore = useCurrentGameStore()

  const settings = store.data

  const stats = computed(() => currentGameStore.stats())
  const answer = ref('')
  const isCorrect = ref<boolean | null>(null)
  const correctAnswer = computed(() => currentGameStore.correctAnswer())
  const timeLeft = ref(settings.timer)
  const timerInterval = ref<number | null>(null)
  const question = computed(() => currentGameStore.currentQuestionText())
  const timerValue = ref(settings.timer)


  function checkAnswer() {
    if (answer.value === undefined || answer.value === '') return
    currentGameStore.submitAnswer(Number(answer.value))
    isCorrect.value = Number(answer.value) === correctAnswer.value
    if (timerValue.value > 0) {
      clearInterval(timerInterval.value!)
    }
  }

  function nextQuestion() {
    answer.value = ''
    isCorrect.value = null

    // Reset timer with animation
    if (timerValue.value > 0) {
      timeLeft.value = 0
      setTimeout(() => {
        timeLeft.value = timerValue.value
        startTimer()
      }, 100)
    }

    currentGameStore.nextQuestion();
  }

  function startTimer() {
    if (timerValue.value > 0) {
      // Clear any existing timer
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
      
      // Start new timer
      timerInterval.value = window.setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--
        } else {
          clearInterval(timerInterval.value!)
          isCorrect.value = false
          currentGameStore.submitAnswer(-1)
        }
      }, 1000)
    }
  }

  onMounted(() => {
    currentGameStore.initializeGame(settings, 'quick')
    if (timerValue.value > 0) {
      timeLeft.value = timerValue.value
      startTimer()
    }
  })

  onUnmounted(() => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  })

  return {
    stats,
    answer,
    isCorrect,
    correctAnswer,
    timeLeft,
    timerValue,
    question,
    checkAnswer,
    nextQuestion
  }
} 