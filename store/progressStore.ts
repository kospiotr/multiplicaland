import {defineStore} from 'pinia'
import type {Answer} from "~/types";
import {getActiveProfileId} from "~/store/profileStore";


export const useGameProgressStore = defineStore('progress', () => {
    const answers = ref<Answer[]>([])

    function submitAnswer(answer: Answer) {
        answers.value.push(answer)
    }

    function importAnswers(list: Answer[]) {
        answers.value = list
    }

    function reset() {
        answers.value = []
    }

    return {answers, submitAnswer, importAnswers, reset}
}, {
    persist: {
        key: `progress:${getActiveProfileId()}`,
        storage: piniaPluginPersistedstate.localStorage(),
    }
})