export type LearningMode = 'basic' | 'advanced' | 'proficient';

export interface LearningModeInfo {
    key: LearningMode;
    title: string;
    emoji: string;
    description: string;
    timer: number;
    // which variables can be the unknown
    multiplicandVariable: boolean;
    multiplierVariable: boolean;
    productVariable: boolean;
}

export const LEARNING_MODES: LearningModeInfo[] = [
    {
        key: 'basic',
        title: 'Basic',
        emoji: '🟢',
        description: 'Find the result (Z)',
        timer: 0,
        multiplicandVariable: false,
        multiplierVariable: false,
        productVariable: true,
    },
    {
        key: 'advanced',
        title: 'Advanced',
        emoji: '🟡',
        description: 'Find any value (X, Y, Z)',
        timer: 0,
        multiplicandVariable: true,
        multiplierVariable: true,
        productVariable: true,
    },
    {
        key: 'proficient',
        title: 'Proficient',
        emoji: '🔴',
        description: 'Any value, 5s per question',
        timer: 5,
        multiplicandVariable: true,
        multiplierVariable: true,
        productVariable: true,
    },
];

export function getLearningMode(key: LearningMode): LearningModeInfo {
    return LEARNING_MODES.find(m => m.key === key) ?? LEARNING_MODES[0];
}

// Each entry is a [min, max] product range — every range is its own game.
export const LEARNING_RANGES: [number, number][] = [
    [0, 12],
    [0, 20],
    [7, 28],
    [15, 36],
    [18, 45],
    [24, 54],
    [30, 60],
    [36, 64],
    [41, 72],
    [45, 100],
    [1, 36],
    [24, 64],
    [36, 100],
    [1, 50],
    [50, 100],
    [1, 100],
];

// Each unique result must be answered correctly this many times to be mastered.
export const LEARNING_TARGET = 5;
