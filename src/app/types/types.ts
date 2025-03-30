import { QuestionPosition } from './game';

export interface QuestionLog {
  id: string;
  sessionId: string;
  question: {
    a: number;
    b: number;
    answer: number;
    position: QuestionPosition;
  };
  userAnswer: number;
  isCorrect: boolean;
  timestamp: string;
  timeToAnswer: number; // in seconds
  ignored?: boolean;
}

export interface EventLog {
  id: string;
  type: 'settings_change' | 'reward_earned';
  timestamp: string;
  details: Record<string, any>;
} 