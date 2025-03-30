export interface QuestionLog {
  id: string;
  question: {
    a: number;
    b: number;
    answer: number;
  };
  userAnswer: number;
  isCorrect: boolean;
  timestamp: string;
  timeToAnswer: number; // in seconds
} 