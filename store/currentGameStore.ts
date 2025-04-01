import {defineStore} from 'pinia'
import {useGameSessionCreator} from '~/composables/useGameSessionCreator'
import type {Answer, GameSettingsSchema, MultiplicationBasicQuestion} from '~/types'


export const useCurrentGameStore = defineStore('currentGame', () => {
    const settings = ref<GameSettingsSchema>()
    const questions = ref<MultiplicationBasicQuestion[]>([])
    const currentQuestionIndex = ref(0)
    const answers = ref<Answer[]>([])

    function createOrResumeGame(setting: GameSettingsSchema, type: string) {
        const sessionCreator = useGameSessionCreator()
        settings.value = setting;
        questions.value = sessionCreator.newQuickGame(setting)
    }

    function submitAnswer(answer: number) {
        const question = currentQuestion();
        if (question === undefined) {
            throw "Can't find current question"
        }
        const status: 'correct' | 'incorrect' = answer === question.product ? 'correct' : 'incorrect';
        let out = {question, value: answer, status, duration: 0};
        answers.value.push(out)
        console.log('answers', answers)
        return out;
    }

    function currentQuestion() {
        return questions.value[currentQuestionIndex.value]
    }

    function nextQuestion() {
        if (currentQuestionIndex.value < questions.value.length - 1) {
            return currentQuestionIndex.value = currentQuestionIndex.value + 1;
        }
        throw 'No more questions'
    }

    function currentQuestionText() {
        const question = currentQuestion()
        if (settings.value?.multiplicandVariable) {
            return `? × ${question?.multiplier} = ${question?.product}`
        } else if (settings.value?.multiplierVariable) {
            return `${question?.multiplicand} × ? = ${question?.product}`
        } else {
            return `${question?.multiplicand} × ${question?.multiplier} = ?`
        }

    }

    function correctAnswer() {
        const question = currentQuestion()
        if (settings.value?.multiplicandVariable) {
            return question?.multiplicand;
        } else if (settings.value?.multiplierVariable) {
            return question?.multiplier;
        } else {
            return question?.product;
        }

    }

    function stats() {
        const total = questions.value.length

        const correct = answers.value.reduce((acc, value) => {
            if (value.status === 'correct') {
                acc++;
            }
            return acc
        }, 0);
        let incorrect = answers.value.reduce((acc, value) => {
            if (value.status === 'incorrect') {
                acc++;
            }
            return acc
        }, 0);
        const answeredCount = answers.value.length;
        const percentage = total > 0 ? (correct / answeredCount) * 100 : 0
        let out = {
            correct, incorrect, percentage: Math.round(percentage), answeredCount, total
        };
        console.log('stats', stats)
        return out
    }


    return {
        initializeGame: createOrResumeGame,
        submitAnswer,
        currentQuestion,
        answers,
        stats,
        settings,
        currentQuestionText,
        correctAnswer,
        nextQuestion
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})