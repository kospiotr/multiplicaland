export type ImproveMode = 'basic' | 'advanced' | 'proficient';

export interface ImproveModeInfo {
    key: ImproveMode;
    title: string;
    emoji: string;
    description: string;
    timer: number;
    // which variables can be the unknown
    multiplicandVariable: boolean;
    multiplierVariable: boolean;
    productVariable: boolean;
}

export const IMPROVE_MODES: ImproveModeInfo[] = [
    {
        key: 'basic',
        title: 'Basic',
        emoji: '🟢',
        description: 'Find X',
        timer: 0,
        multiplicandVariable: true,
        multiplierVariable: false,
        productVariable: false,
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

// Each targeted result must be answered correctly this many times to finish.
export const IMPROVE_TARGET = 5;

// How many of the worst results to practice.
export const IMPROVE_COUNT = 10;
