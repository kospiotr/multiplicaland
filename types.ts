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
export function formatTimestamp(date: number) {
    //formatTimestamp in the format: yyyyMM-dd hh:mm:ss
    return new Date(date).toLocaleString();
}

export function calculateDuration(startTs: number, finishTs: number) {
    if(!startTs || !finishTs){
        return '-';
    }
    return Math.round(((finishTs - startTs)) / 1000)
}

export function answerStats(answers: Answer[]): AnswerStats{
    const correct = answers.reduce((acc, value) => {
        if (value.status === 'correct') {
            acc++;
        }
        return acc
    }, 0);
    let incorrect = answers.reduce((acc, value) => {
        if (value.status === 'incorrect') {
            acc++;
        }
        return acc
    }, 0);
    const answeredCount = answers.length;
    const percentage = answeredCount > 0 ? (correct / answeredCount) * 100 : 100
    return {
        correct, incorrect, percentage: Math.round(percentage), answeredCount
    };
}
export interface Answer {
    question: MultiplicationBasicQuestion
    value: number
    status: 'correct' | 'incorrect'
    startedTs: number
    finishedTs: number
}

export interface GameStats {
    correct: number,
    incorrect: number,
    percentage: number,
    answeredCount: number,
    total: number
}

export interface AnswerStats {
    correct: number,
    incorrect: number,
    percentage: number,
    answeredCount: number
}