import {defineStore} from 'pinia'
import {useGameSessionCreator} from '~/composables/useGameSessionCreator'
import type {Answer, GameSettingsSchema, GameStats, MultiplicationBasicQuestion, MultiplicationEquation} from '~/types'
import {answerStats, correctAnswerProvider, placeholderQuestionTextProvider} from "~/types";
import {useGameProgressStore} from "~/store/progressStore";
import {findAvailableQuestions} from "~/store/gameSettingsStore";
import {getLearningMode, LEARNING_TARGET, type LearningMode} from "~/store/learningConfig";



export type GameMode = 'quick' | 'custom' | 'adventure' | 'learning'

export const useCurrentGameStore = defineStore('current-game', () => {
    const settings = ref<GameSettingsSchema>()
    const questions = ref<MultiplicationBasicQuestion[]>([])
    const currentQuestionIndex = ref(0)
    const answers = ref<Answer[]>([])
    const mode = ref<GameMode>('quick')
    const adventureLevel = ref(0)

    // Learning mode (mastery based): every result must be answered correctly N times.
    const isLearning = ref(false)
    const learningTarget = ref(LEARNING_TARGET)
    const learningRange = ref<[number, number]>([1, 100])
    const learningRangeIndex = ref(0)
    const learningModeKey = ref<LearningMode>('basic')
    const availableProducts = ref<number[]>([])
    const learningEquations = ref<MultiplicationEquation[]>([])


    function createNewGame(setting: GameSettingsSchema, gameMode: GameMode = 'quick', level = 0) {
        const sessionCreator = useGameSessionCreator()
        settings.value = setting;
        mode.value = gameMode;
        adventureLevel.value = level;
        isLearning.value = false;
        questions.value = sessionCreator.newQuickGame(setting)
        currentQuestionIndex.value = 0;
        answers.value = [];
        console.log('created game', questions.value);
    }

    function createLearningGame(range: [number, number], learnMode: LearningMode, rangeIndex = 0) {
        const info = getLearningMode(learnMode)
        const setting: GameSettingsSchema = {
            multiplicandRange: [1, 10],
            multiplierRange: [1, 10],
            productRange: [range[0], range[1]],
            multiplicandVariable: info.multiplicandVariable,
            multiplierVariable: info.multiplierVariable,
            productVariable: info.productVariable,
            questionsCount: 0,
            timer: info.timer,
            fosterFailed: 0,
            fosterUnanswered: 0,
        }
        settings.value = setting;
        mode.value = 'learning';
        adventureLevel.value = 0;
        isLearning.value = true;
        learningTarget.value = LEARNING_TARGET;
        learningRange.value = [range[0], range[1]];
        learningRangeIndex.value = rangeIndex;
        learningModeKey.value = learnMode;
        learningEquations.value = findAvailableQuestions(setting);
        availableProducts.value = [...new Set(learningEquations.value.map(e => e.product))].sort((a, b) => a - b);
        answers.value = [];
        currentQuestionIndex.value = 0;
        const first = generateLearningQuestion();
        questions.value = first ? [first] : [];
    }

    function productCorrectCounts(): Record<number, number> {
        const counts: Record<number, number> = {}
        for (const a of answers.value) {
            if (a.status === 'correct') {
                counts[a.question.product] = (counts[a.question.product] ?? 0) + 1
            }
        }
        return counts
    }

    function pickVariable(setting: GameSettingsSchema): 'multiplicand' | 'multiplier' | 'product' {
        const vars = (['multiplicand', 'multiplier', 'product'] as const).filter(v =>
            (v === 'multiplicand' && setting.multiplicandVariable) ||
            (v === 'multiplier' && setting.multiplierVariable) ||
            (v === 'product' && setting.productVariable)
        )
        return vars[Math.floor(Math.random() * vars.length)] ?? 'product'
    }

    function generateLearningQuestion(): MultiplicationBasicQuestion | undefined {
        const counts = productCorrectCounts()
        const remaining = availableProducts.value.filter(p => (counts[p] ?? 0) < learningTarget.value)
        const pool = remaining.length ? remaining : availableProducts.value
        if (pool.length === 0 || !settings.value) return undefined
        const product = pool[Math.floor(Math.random() * pool.length)]
        const eqs = learningEquations.value.filter(e => e.product === product)
        const eq = eqs[Math.floor(Math.random() * eqs.length)]
        return {
            multiplicand: eq.multiplicand,
            multiplier: eq.multiplier,
            product: eq.product,
            variable: pickVariable(settings.value),
        }
    }

    function isLearningComplete() {
        if (availableProducts.value.length === 0) return false
        const counts = productCorrectCounts()
        return availableProducts.value.every(p => (counts[p] ?? 0) >= learningTarget.value)
    }

    function reset() {
        questions.value = [];
        answers.value = [];
        currentQuestionIndex.value = 0;
        isLearning.value = false;
    }

    function isStarted() {
        return questions.value.length > 0;
    }

    function isCompleted() {
        if (isLearning.value) {
            return isLearningComplete();
        }
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
        if (isLearning.value) {
            if (isLearningComplete()) return;
            const q = generateLearningQuestion();
            if (!q) return;
            questions.value.push(q);
            currentQuestionIndex.value++;
            return;
        }
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
        const base = answerStats(answers.value);
        if (isLearning.value) {
            const counts = productCorrectCounts();
            const repsTotal = availableProducts.value.length * learningTarget.value;
            const repsDone = availableProducts.value.reduce((acc, p) => acc + Math.min(counts[p] ?? 0, learningTarget.value), 0);
            return {total: repsTotal, answeredCount: repsDone, correct: base.correct, incorrect: base.incorrect, percentage: base.percentage};
        }
        const total = questions.value.length
        return Object.assign({total: total}, base)
    }


    return {
        createNewGame,
        reset,
        submitAnswer,
        currentQuestion,
        questions,
        answers,
        stats,
        settings,
        mode,
        adventureLevel,
        currentQuestionText,
        correctAnswer,
        nextQuestion,
        isCompleted,
        isStarted,
        createLearningGame,
        isLearning,
        learningRange,
        learningRangeIndex,
        learningModeKey,
        availableProducts,
        productCorrectCounts,
        learningTarget
    }
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})