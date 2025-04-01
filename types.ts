export interface GameSettingsSchema {
    multiplicandRange: number[];
    multiplierRange: number[];
    productRange: number[];
    multiplicandVariable: boolean;
    multiplierVariable: boolean;
    productVariable: boolean;
    questionsCount: number;
    timer: number;
    fosterFailed: number;
    fosterUnanswered: number;
}


export interface MultiplicationEquation {
    multiplicand: number
    multiplier: number
    product: number
}


export interface MultiplicationBasicQuestion extends MultiplicationEquation{
    variable: 'multiplicand' | 'multiplier' | 'product'
}
export interface Answer {
    question: MultiplicationBasicQuestion
    value: number
    status: 'correct' | 'incorrect'
    duration: number
}