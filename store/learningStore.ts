import {defineStore} from 'pinia';
import {LEARNING_MODES, LEARNING_RANGES, type LearningMode} from "~/store/learningConfig";

export interface LearningResult {
    completed: boolean;
    bestPercentage: number;
}

function key(mode: LearningMode, index: number) {
    return `${mode}:${index}`;
}

export const useLearningStore = defineStore('learning', () => {
    const results = ref<Record<string, LearningResult>>({});

    function getResult(mode: LearningMode, index: number): LearningResult | undefined {
        return results.value[key(mode, index)];
    }

    function isCompleted(mode: LearningMode, index: number): boolean {
        return results.value[key(mode, index)]?.completed ?? false;
    }

    function completeLearning(mode: LearningMode, index: number, percentage: number) {
        const prev = results.value[key(mode, index)];
        results.value[key(mode, index)] = {
            completed: true,
            bestPercentage: Math.max(prev?.bestPercentage ?? 0, percentage),
        };
    }

    const completedCount = computed(() =>
        Object.values(results.value).filter(r => r.completed).length
    );

    const totalGames = computed(() => LEARNING_MODES.length * LEARNING_RANGES.length);

    function resetProgress() {
        results.value = {};
    }

    return {results, getResult, isCompleted, completeLearning, completedCount, totalGames, resetProgress};
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
});
