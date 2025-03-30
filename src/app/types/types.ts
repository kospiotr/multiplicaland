import { Question } from './game';

export interface QuestionLog {
  id: string;
  sessionId: string;
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  timestamp: string;
  timeToAnswer: number; // in seconds
  ignored?: boolean;
  metadata?: Record<string, string | number | boolean>;
}