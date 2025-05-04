import {defineStore} from 'pinia'
import {useGameSessionCreator} from '~/composables/useGameSessionCreator'
import type {Answer, GameSettingsSchema, GameStats, MultiplicationBasicQuestion} from '~/types'
import {answerStats, correctAnswerProvider, placeholderQuestionTextProvider} from "~/types";
import {useGameProgressStore} from "~/store/progressStore";



export const useCurrentGameStore = defineStore('current-game', () => {
    const settings = ref<GameSettingsSchema>()
    const questions = ref<MultiplicationBasicQuestion[]>([])
    const currentQuestionIndex = ref(0)
    const answers = ref<Answer[]>([])


    function createNewGame(setting: GameSettingsSchema) {
        const sessionCreator = useGameSessionCreator()
        settings.value = setting;
        questions.value = sessionCreator.newQuickGame(setting)
        currentQuestionIndex.value = 0;
        answers.value = [];
        console.log('created game', questions.value);
    }
    function isStarted() {
        return questions.value.length > 0;
    }

    function isCompleted() {
        return answers.value.length >= questions.value.length;
    }

    function submitAnswer(value: number, startedTs: number, finishedTs: number) {
        const question = currentQuestion();
        if (question === undefined) {
            throw "Can't find current question"
        }
        const status: 'correct' | 'incorrect' = value === correctAnswer() ? 'correct' : 'incorrect';
        let out = {
            question,
            value,
            status,
            startedTs,
            finishedTs
        };
        answers.value.push(out)
        useGameProgressStore().submitAnswer(out)
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
        return placeholderQuestionTextProvider(currentQuestion())
    }

    function correctAnswer() {
        return correctAnswerProvider(currentQuestion())
    }

    function stats(): GameStats {
        const total = questions.value.length
        const stats = answerStats(answers.value);
        return Object.assign({total: total}, stats)
    }


    return {
        createNewGame,
        submitAnswer,
        currentQuestion,
        questions,
        answers,
        stats,
        settings,
        currentQuestionText,
        correctAnswer,
        nextQuestion,
        isCompleted,
        isStarted
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})