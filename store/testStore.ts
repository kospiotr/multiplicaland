import {defineStore} from 'pinia';
import {TEST_LEVELS, TEST_MAX_MISTAKES, starsForMistakes} from "~/store/testLevels";
import {getActiveProfileId} from "~/store/profileStore";

export interface TestLevelResult {
    stars: number;
    completed: boolean;
    bestMistakes: number;
}

export const useTestStore = defineStore('test', () => {
    const results = ref<Record<number, TestLevelResult>>({});
    const unlockedLevel = ref(0);

    function isUnlocked(index: number) {
        return index <= unlockedLevel.value;
    }

    function getResult(index: number): TestLevelResult | undefined {
        return results.value[index];
    }

    function completeLevel(index: number, mistakes: number) {
        const stars = starsForMistakes(mistakes);
        const passed = mistakes <= TEST_MAX_MISTAKES;
        const prev = results.value[index];
        results.value[index] = {
            stars: Math.max(prev?.stars ?? 0, stars),
            completed: (prev?.completed ?? false) || passed,
            bestMistakes: prev?.bestMistakes !== undefined ? Math.min(prev.bestMistakes, mistakes) : mistakes,
        };
        if (passed && index === unlockedLevel.value && index < TEST_LEVELS.length - 1) {
            unlockedLevel.value = index + 1;
        }
    }

    const totalStars = computed(() =>
        Object.values(results.value).reduce((acc, r) => acc + r.stars, 0)
    );

    const maxStars = computed(() => TEST_LEVELS.length * 3);

    function resetProgress() {
        results.value = {};
        unlockedLevel.value = 0;
    }

    return {results, unlockedLevel, isUnlocked, getResult, completeLevel, totalStars, maxStars, resetProgress};
}, {
    persist: {
        key: `test:${getActiveProfileId()}`,
        storage: piniaPluginPersistedstate.localStorage(),
    },
});
