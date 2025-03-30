export interface QuestionLog {
  id: string;
  sessionId: string;
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

export interface EventLog {
  id: string;
  type: 'settings_change' | 'reward_earned';
  timestamp: string;
  details: Record<string, any>;
} 