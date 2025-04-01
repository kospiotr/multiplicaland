import type {GameSettingsSchema, MultiplicationBasicQuestion} from '~/types'
import {findAvailableQuestions} from "~/store/gameSettingsStore";


export function useGameSessionCreator() {
  function newQuickGame(settings: GameSettingsSchema): MultiplicationBasicQuestion[] {
    const availableQuestions = findAvailableQuestions(settings);
    const questions: MultiplicationBasicQuestion[] = []
    const numQuestions = Math.min(settings.questionsCount, availableQuestions.length)

    // Create a copy of available questions to avoid duplicates
    const remainingQuestions = [...availableQuestions]

    for (let i = 0; i < numQuestions; i++) {
      // Randomly select a question from remaining questions
      const questionIndex = Math.floor(Math.random() * remainingQuestions.length)
      const selectedQuestion = remainingQuestions[questionIndex]
      
      // Remove the selected question to avoid duplicates
      remainingQuestions.splice(questionIndex, 1)

      // Determine which variables can be used based on settings
      const availableVariables = ['multiplicand', 'multiplier', 'product'].filter(v => 
        (v === 'multiplicand' && settings.multiplicandVariable) ||
        (v === 'multiplier' && settings.multiplierVariable) ||
        (v === 'product' && settings.productVariable)
      ) as ('multiplicand' | 'multiplier' | 'product')[]

      if (availableVariables.length > 0) {
        // Randomly select a variable to make unknown
        const variable = availableVariables[Math.floor(Math.random() * availableVariables.length)]
        
        // Create the question with the selected variable
        questions.push({
          multiplicand: selectedQuestion.multiplicand,
          multiplier: selectedQuestion.multiplier,
          product: selectedQuestion.product,
          variable
        })
      }
    }

    return questions
  }

  return {
    newQuickGame
  }
} 