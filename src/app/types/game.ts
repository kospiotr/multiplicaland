export type QuestionPosition = 'A' | 'B' | 'C';

export type RewardType = 'none' | 'fireworks' | 'funny_picture' | 'adorable_kitty';

export type SessionStatsDisplay = 'none' | 'on_answer' | 'permanent';

export interface NumberRange {
  min: number;
  max: number;
}

export interface GameSettings {
  ranges: {
    A: NumberRange;
    B: NumberRange;
    C: NumberRange;
  };
  timerEnabled: boolean;
  timerDuration: number; // in seconds
  selectedPositions: QuestionPosition[];
  reward: {
    type: RewardType;
    correctAnswersThreshold: number;
  };
  sessionStatsDisplay: SessionStatsDisplay;
}

export interface ToolbarProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onLogChange?: (log: EventLog) => void;
} 