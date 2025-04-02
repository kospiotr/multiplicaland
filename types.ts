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


export interface MultiplicationBasicQuestion extends MultiplicationEquation {
    variable: 'multiplicand' | 'multiplier' | 'product'
}

export const placeholderQuestionTextProvider = (question: MultiplicationBasicQuestion) => {
    if (question.variable === 'multiplicand') {
        return `? × ${question?.multiplier} = ${question?.product}`
    } else if (question.variable === 'multiplier') {
        return `${question?.multiplicand} × ? = ${question?.product}`
    } else {
        return `${question?.multiplicand} × ${question?.multiplier} = ?`
    }

}

export const correctAnswerProvider = (question: MultiplicationBasicQuestion) => {
    if (question.variable === 'multiplicand') {
        return question.multiplicand;
    } else if (question.variable === 'multiplier') {
        return question.multiplier;
    } else {
        return question.product;
    }
}

export interface Answer {
    question: MultiplicationBasicQuestion
    value: number
    status: 'correct' | 'incorrect'
    startedTs: number
    finishedTs: number
}