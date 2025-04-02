import {ref, onMounted, onUnmounted, watch} from 'vue'
import {useGameSettingsStore} from '~/store/gameSettingsStore'
import {useCurrentGameStore} from "~/store/currentGameStore";

export function useGameEngine() {
    const store = useGameSettingsStore()
    const currentGameStore = useCurrentGameStore()

    const settings = store.data

    const stats = computed(() => currentGameStore.stats())
    const answer = ref('')
    const isCorrect = ref<boolean | null>(null)
    const correctAnswer = computed(() => currentGameStore.correctAnswer())
    const isCompleted = computed(() => currentGameStore.isCompleted())
    const timeLeft = ref(settings.timer)
    const timerInterval = ref<number | null>(null)
    const question = computed(() => currentGameStore.currentQuestionText())
    const timerValue = ref(settings.timer)
    const focusInput = ref<(() => void) | null>(null)
    const paused = ref(false)
    const questionStartTime = ref<number>(Date.now())

    // Watch for changes in isCorrect and automatically proceed to next question after 2 seconds
    watch(isCorrect, (newValue: boolean | null) => {
        if (newValue !== null) {
            setTimeout(() => {
                if (!paused.value) {
                    nextQuestion()
                }
            }, 2000)
        }
    })
    // Watch for changes in isCorrect and automatically proceed to next question after 2 seconds
    watch(paused, (newValue: boolean | null) => {
        if(!paused.value){
            nextQuestion()
        }
    })

    function checkAnswer() {
        if (answer.value === undefined || answer.value === '') return
        const result = currentGameStore.submitAnswer(Number(answer.value), questionStartTime.value, Date.now())
        isCorrect.value = result.status === 'correct'
        
        if (timerValue.value > 0) {
            clearInterval(timerInterval.value!)
        }
    }

    function nextQuestion() {
        currentGameStore.nextQuestion();
        answer.value = ''
        isCorrect.value = null
        questionStartTime.value = Date.now();

        // Reset timer with animation
        if (timerValue.value > 0) {
            timeLeft.value = 0
            setTimeout(() => {
                timeLeft.value = timerValue.value
                startTimer()
            }, 100)
        }

        // Focus the input after a short delay to ensure the DOM has updated
        setTimeout(() => {
            focusInput.value?.()
        }, 100)
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
                    currentGameStore.submitAnswer(-1, questionStartTime.value, Date.now())
                }
            }, 1000)
        }
    }

    function pauseResume() {
        paused.value = !paused.value;
    }

    onMounted(() => {
        if (!currentGameStore.isCompleted()) {
            startTimer()
        }
        questionStartTime.value = Date.now();
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
        nextQuestion,
        focusInput,
        isCompleted,
        pauseResume,
        paused
    }
} 