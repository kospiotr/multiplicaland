export type QuestionPosition = 'A' | 'B' | 'C';

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
}

export interface ToolbarProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
} 