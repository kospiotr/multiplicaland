import type {GameSettingsSchema} from "~/types";

export interface AdventureLevel {
    level: number;
    title: string;
    emoji: string;
    settings: GameSettingsSchema;
}

type Vars = ('x' | 'y' | 'z')[];

function makeLevel(
    level: number,
    title: string,
    emoji: string,
    opts: { factor: number; vars?: Vars; count?: number; timer?: number }
): AdventureLevel {
    const vars = opts.vars ?? ['z'];
    return {
        level,
        title,
        emoji,
        settings: {
            multiplicandRange: [1, opts.factor],
            multiplierRange: [1, opts.factor],
            productRange: [1, 100],
            multiplicandVariable: vars.includes('x'),
            multiplierVariable: vars.includes('y'),
            productVariable: vars.includes('z'),
            questionsCount: opts.count ?? 8,
            timer: opts.timer ?? 0,
            fosterFailed: 25,
            fosterUnanswered: 25,
        },
    };
}

// 20 levels with a gentle, increasing difficulty curve.
export const ADVENTURE_LEVELS: AdventureLevel[] = [
    // Stage 1 — learning small tables (find the product)
    makeLevel(1, 'First Steps', '🐣', {factor: 2, count: 5}),
    makeLevel(2, 'Tiny Tables', '🌱', {factor: 3, count: 5}),
    makeLevel(3, 'Warming Up', '☀️', {factor: 4, count: 6}),
    makeLevel(4, 'Getting It', '🧩', {factor: 5, count: 6}),
    makeLevel(5, 'Halfway Hill', '⛰️', {factor: 6, count: 8}),
    // Stage 2 — bigger tables
    makeLevel(6, 'Lucky Seven', '🍀', {factor: 7, count: 8}),
    makeLevel(7, 'Eight Power', '🎱', {factor: 8, count: 8}),
    makeLevel(8, 'Nine Climb', '🪁', {factor: 9, count: 8}),
    makeLevel(9, 'Perfect Ten', '🔟', {factor: 10, count: 8}),
    makeLevel(10, 'Table Master', '🏆', {factor: 10, count: 10}),
    // Stage 3 — find the missing factor
    makeLevel(11, 'Mystery Factor', '🔍', {factor: 5, vars: ['z', 'y'], count: 8}),
    makeLevel(12, 'Detective Math', '🕵️', {factor: 6, vars: ['z', 'y'], count: 8}),
    makeLevel(13, 'Both Ways', '↔️', {factor: 8, vars: ['z', 'x', 'y'], count: 8}),
    makeLevel(14, 'Puzzle Pro', '🧠', {factor: 10, vars: ['z', 'x', 'y'], count: 10}),
    makeLevel(15, 'Brain Boss', '🤖', {factor: 10, vars: ['x', 'y', 'z'], count: 10}),
    // Stage 4 — beat the clock
    makeLevel(16, 'Beat the Clock', '⏰', {factor: 10, vars: ['z'], count: 10, timer: 20}),
    makeLevel(17, 'Quick Thinker', '⚡', {factor: 10, vars: ['z', 'y'], count: 10, timer: 15}),
    makeLevel(18, 'Speed Runner', '🏃', {factor: 10, vars: ['x', 'y', 'z'], count: 10, timer: 15}),
    makeLevel(19, 'Lightning Mind', '🌩️', {factor: 10, vars: ['x', 'y', 'z'], count: 10, timer: 10}),
    makeLevel(20, 'Grand Champion', '👑', {factor: 10, vars: ['x', 'y', 'z'], count: 12, timer: 8}),
];

export function starsForPercentage(percentage: number): number {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
}

export function getAdventureLevel(level: number): AdventureLevel | undefined {
    return ADVENTURE_LEVELS.find(l => l.level === level);
}
