'use client';

import { motion } from 'framer-motion';
import { GameSettings, ToolbarProps, QuestionPosition, NumberRange } from '../types/game';

const TIMER_OPTIONS = [
  { value: 0, label: 'Off' },
  { value: 1, label: '1s' },
  { value: 2, label: '2s' },
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 8, label: '8s' },
  { value: 10, label: '10s' },
] as const;

export default function Toolbar({ settings, onSettingsChange }: ToolbarProps) {
  const toggleTimer = (duration: number) => {
    onSettingsChange({
      ...settings,
      timerEnabled: duration > 0,
      timerDuration: duration
    });
  };

  const togglePosition = (position: QuestionPosition) => {
    const newPositions = settings.selectedPositions.includes(position)
      ? settings.selectedPositions.filter(p => p !== position)
      : [...settings.selectedPositions, position];
    
    // Ensure at least one position is selected
    if (newPositions.length === 0) return;

    onSettingsChange({
      ...settings,
      selectedPositions: newPositions
    });
  };

  const updateRange = (factor: 'A' | 'B' | 'C', field: keyof NumberRange, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentRange = settings.ranges[factor];
    let newRange: NumberRange;

    if (field === 'min') {
      newRange = {
        min: Math.min(numValue, currentRange.max),
        max: currentRange.max
      };
    } else {
      newRange = {
        min: currentRange.min,
        max: Math.max(numValue, currentRange.min)
      };
    }

    onSettingsChange({
      ...settings,
      ranges: {
        ...settings.ranges,
        [factor]: newRange
      }
    });
  };

  return (
    <motion.div>
      {/* Ranges group */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Number Ranges</span>
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-lg">
          {(['A', 'B', 'C'] as const).map((factor) => (
            <div key={factor} className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">{factor}</span>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.ranges[factor].min}
                  onChange={(e) => updateRange(factor, 'min', e.target.value)}
                  className="w-14 h-8 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  title={`Minimum value for ${factor}`}
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.ranges[factor].max}
                  onChange={(e) => updateRange(factor, 'max', e.target.value)}
                  className="w-14 h-8 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  title={`Maximum value for ${factor}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timer group */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Timer</span>
        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
          {TIMER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleTimer(value)}
              className={`p-2 rounded-lg transition-all ${
                (value === 0 && !settings.timerEnabled) || (settings.timerEnabled && settings.timerDuration === value)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-600'
              } hover:bg-blue-50 font-medium text-sm min-w-[32px]`}
              title={`Set timer to ${label}`}
            >
              {value === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  {value}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>


      {/* Position buttons group */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Question place</span>
        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
          {(['A', 'B', 'C'] as const).map((position) => (
            <button
              key={position}
              onClick={() => togglePosition(position)}
              className={`p-2 rounded-lg transition-all ${
                settings.selectedPositions.includes(position)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-600'
              } hover:bg-blue-50 font-medium text-sm min-w-[32px]`}
              title={`${settings.selectedPositions.includes(position) ? 'Remove' : 'Add'} position ${position}`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 