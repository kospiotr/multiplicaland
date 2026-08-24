import {LEARNING_MODES, LEARNING_RANGES, type LearningMode} from "~/store/learningConfig";

export interface TestLevel {
    index: number;
    range: [number, number];
    rangeIndex: number;
    mode: LearningMode;
}

// Same range x mode matrix as the Learning module, flattened into one
// sequential list (range outer, mode inner — matching the Learning grid).
export const TEST_LEVELS: TestLevel[] = LEARNING_RANGES.flatMap((range, rangeIndex) =>
    LEARNING_MODES.map(m => ({range, rangeIndex, mode: m.key}))
).map((lvl, index) => ({...lvl, index}));

export function getTestLevel(index: number): TestLevel | undefined {
    return TEST_LEVELS[index];
}

// Each unique result only needs to be answered correctly once to clear a Test level.
export const TEST_TARGET = 1;

// A level is passed with at most this many mistakes.
export const TEST_MAX_MISTAKES = 2;

export function starsForMistakes(mistakes: number): number {
    if (mistakes <= 0) return 3;
    if (mistakes === 1) return 2;
    if (mistakes === 2) return 1;
    return 0;
}
