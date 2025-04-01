import type {GameSettingsSchema, MultiplicationEquation} from "~/types";


export const X_MIN = 1;
export const X_MAX = 10;
export const Y_MIN = 1;
export const Y_MAX = 10;
export const Z_MIN = 1;
export const Z_MAX = 100;
export const PERCENTAGE_MIN = 0;
export const PERCENTAGE_MAX = 100;

export const TIMER = [0, 5, 10, 15, 20, 30, 45, 60]

export const inRangeOfInclusive = (val: number, min: number, max: number) => {
    return val >= min && val <= max;
}



export function findAvailableQuestions(settings: GameSettingsSchema): MultiplicationEquation[] {
    const out = [];
    for (let multiplicand = X_MIN; multiplicand <= X_MAX; multiplicand++) {
        for (let multiplier = Y_MIN; multiplier <= Y_MAX; multiplier++) {
            let product = multiplicand * multiplier;
            if (
                inRangeOfInclusive(multiplicand, settings.multiplicandRange[0], settings.multiplicandRange[1]) &&
                inRangeOfInclusive(multiplier, settings.multiplierRange[0], settings.multiplierRange[1]) &&
                inRangeOfInclusive(product, settings.productRange[0], settings.productRange[1])
            ) {
                out.push({multiplicand, multiplier, product})
            }
        }
    }
    return out;
}


export const useGameSettingsStore = defineStore('gameSettings', () => {

    const data = ref<GameSettingsSchema>({
        multiplicandRange: [X_MIN, X_MAX],
        multiplierRange: [Y_MIN, Y_MAX],
        productRange: [Z_MIN, Z_MAX],
        multiplicandVariable: false,
        multiplierVariable: false,
        productVariable: true,
        questionsCount: 10,
        timer: 0,
        fosterFailed: 25,
        fosterUnanswered: 25
    });


    function store(newData: GameSettingsSchema) {
        data.value = newData;
    }

    function availableQuestions (): MultiplicationEquation[] {
        return findAvailableQuestions(data.value);
    }

    return {data, store, availableQuestions}
}, {
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})