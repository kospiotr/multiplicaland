'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameSettings, QuestionPosition, NumberRange, RewardType } from '../types/game';
import { EventLog } from '../types/types';
import Toolbar from '../components/Toolbar';

const REWARD_OPTIONS: { value: RewardType; label: string; icon: string }[] = [
  { value: 'none', label: 'No Reward', icon: 'M6 18L18 6M6 6l12 12' },
  { value: 'fireworks', label: 'Fireworks', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'funny_picture', label: 'Funny Picture', icon: 'M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' },
  { value: 'adorable_kitty', label: 'Adorable Kitty', icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z' }
];

const DEFAULT_SETTINGS: GameSettings = {
  ranges: {
    A: { min: 1, max: 10 },
    B: { min: 1, max: 10 },
    C: { min: 1, max: 100 }
  },
  timerEnabled: false,
  timerDuration: 0,
  selectedPositions: ['C'],
  reward: {
    type: 'none' as const,
    correctAnswersThreshold: 5
  }
};

export default function Settings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('gameSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        return {
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
          reward: {
            ...DEFAULT_SETTINGS.reward,
            ...(parsedSettings.reward || {})
          }
        };
      }
      return DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
  };

  const handleLogChange = (log: EventLog) => {
    // Handle settings change logs if needed
    console.log('Settings change logged:', log);
  };

  const updateReward = (type: RewardType) => {
    handleSettingsChange({
      ...settings,
      reward: {
        ...settings.reward,
        type
      }
    });
  };

  const updateThreshold = (value: string) => {
    const numValue = parseInt(value) || 1;
    handleSettingsChange({
      ...settings,
      reward: {
        ...settings.reward,
        correctAnswersThreshold: Math.max(1, numValue)
      }
    });
  };
console.log('settings', settings)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <Toolbar
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onLogChange={handleLogChange}
            />

            {/* Reward Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Rewards</span>
                <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
                  {REWARD_OPTIONS.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => updateReward(value)}
                      className={`p-2 rounded-lg transition-all ${
                        settings.reward.type === value
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-white text-gray-600'
                      } hover:bg-blue-50 font-medium text-sm min-w-[32px]`}
                      title={label}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </button>
                  ))}
                </div>
                {settings.reward.type !== 'none' && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show reward after</span>
                    <input
                      type="number"
                      min="1"
                      value={settings.reward.correctAnswersThreshold}
                      onChange={(e) => updateThreshold(e.target.value)}
                      className="w-16 h-8 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">correct answers</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 