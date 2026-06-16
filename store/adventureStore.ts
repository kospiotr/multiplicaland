import {defineStore} from 'pinia';
import {ADVENTURE_LEVELS, starsForPercentage} from "~/store/adventureLevels";

export interface LevelResult {
    stars: number;
    completed: boolean;
    bestPercentage: number;
}

export const useAdventureStore = defineStore('adventure', () => {
    const results = ref<Record<number, LevelResult>>({});
    const unlockedLevel = ref(1);

    function isUnlocked(level: number) {
        return level <= unlockedLevel.value;
    }

    function getResult(level: number): LevelResult | undefined {
        return results.value[level];
    }

    function completeLevel(level: number, percentage: number) {
        const stars = starsForPercentage(percentage);
        const prev = results.value[level];
        results.value[level] = {
            stars: Math.max(prev?.stars ?? 0, stars),
            completed: (prev?.completed ?? false) || stars >= 1,
            bestPercentage: Math.max(prev?.bestPercentage ?? 0, percentage),
        };
        if (stars >= 1 && level === unlockedLevel.value && level < ADVENTURE_LEVELS.length) {
            unlockedLevel.value = level + 1;
        }
    }

    const totalStars = computed(() =>
        Object.values(results.value).reduce((acc, r) => acc + r.stars, 0)
    );

    const maxStars = computed(() => ADVENTURE_LEVELS.length * 3);

    function resetProgress() {
        results.value = {};
        unlockedLevel.value = 1;
    }

    return {results, unlockedLevel, isUnlocked, getResult, completeLevel, totalStars, maxStars, resetProgress};
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
});
