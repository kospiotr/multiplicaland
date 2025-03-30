'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameSettings, QuestionPosition, NumberRange } from '../types/game';
import { EventLog } from '../types/types';
import Toolbar from '../components/Toolbar';

export default function Settings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('gameSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        ranges: {
          A: { min: 1, max: 10 },
          B: { min: 1, max: 10 },
          C: { min: 1, max: 100 }
        },
        timerEnabled: false,
        timerDuration: 0,
        selectedPositions: ['C']
      };
    }
    return {
      ranges: {
        A: { min: 1, max: 10 },
        B: { min: 1, max: 10 },
        C: { min: 1, max: 100 }
      },
      timerEnabled: false,
      timerDuration: 0,
      selectedPositions: ['C']
    };
  });

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
  };

  const handleLogChange = (log: EventLog) => {
    // Handle settings change logs if needed
    console.log('Settings change logged:', log);
  };

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
          </div>
        </motion.div>
      </div>
    </div>
  );
} 