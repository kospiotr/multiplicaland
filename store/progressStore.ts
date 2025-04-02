import {defineStore} from 'pinia'
import type {Answer} from "~/types";


export const useGameProgressStore = defineStore('gameProgress', () => {
    const answers = ref<Answer[]>([])

    function submitAnswer(answer: Answer) {
        answers.value.push(answer)
    }

    return {answers, submitAnswer}
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})