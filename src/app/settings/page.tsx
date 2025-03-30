"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FosterChallengingPercentage,
  FosterGapsPercentage,
  GameSettings,
  NumberRange,
  QuestionPosition,
  RewardType,
} from "../types/game";

const TIMER_OPTIONS = [
  { value: 0, label: "Off" },
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 15, label: "15s" },
  { value: 20, label: "20s" },
  { value: 25, label: "25s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
] as const;

const REWARD_OPTIONS: { value: RewardType; label: string; icon: string }[] = [
  { value: "none", label: "No Reward", icon: "M6 18L18 6M6 6l12 12" },
  {
    value: "fireworks",
    label: "Fireworks",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    value: "funny_picture",
    label: "Funny Picture",
    icon: "M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
  },
  {
    value: "adorable_kitty",
    label: "Adorable Kitty",
    icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  },
];

const DEFAULT_SETTINGS: GameSettings = {
  ranges: {
    A: { min: 1, max: 10 },
    B: { min: 1, max: 10 },
    C: { min: 1, max: 100 },
  },
  timerEnabled: false,
  timerDuration: 0,
  selectedPositions: ["C"],
  reward: {
    type: "none" as const,
    correctAnswersThreshold: 5,
  },
  sessionStatsDisplay: "none",
  fosterChallengingPercentage: 25,
  fosterGapsPercentage: 25,
};

export default function Settings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("gameSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        return {
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
          reward: {
            ...DEFAULT_SETTINGS.reward,
            ...(parsedSettings.reward || {}),
          },
        };
      }
      return DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem("gameSettings", JSON.stringify(newSettings));
  };

  const toggleTimer = (duration: number) => {
    handleSettingsChange({
      ...settings,
      timerEnabled: duration > 0,
      timerDuration: duration,
    });
  };

  const togglePosition = (position: QuestionPosition) => {
    const newPositions = settings.selectedPositions.includes(position)
      ? settings.selectedPositions.filter((p) => p !== position)
      : [...settings.selectedPositions, position];

    if (newPositions.length === 0) return;

    handleSettingsChange({
      ...settings,
      selectedPositions: newPositions,
    });
  };

  const updateRange = (
    factor: "A" | "B" | "C",
    field: keyof NumberRange,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const currentRange = settings.ranges[factor];
    let newRange: NumberRange;

    if (field === "min") {
      newRange = {
        min: Math.min(numValue, currentRange.max),
        max: currentRange.max,
      };
    } else {
      newRange = {
        min: currentRange.min,
        max: Math.max(numValue, currentRange.min),
      };
    }

    handleSettingsChange({
      ...settings,
      ranges: {
        ...settings.ranges,
        [factor]: newRange,
      },
    });
  };

  const updateReward = (type: RewardType) => {
    handleSettingsChange({
      ...settings,
      reward: {
        ...settings.reward,
        type,
      },
    });
  };

  const updateThreshold = (value: string) => {
    const numValue = parseInt(value) || 1;
    handleSettingsChange({
      ...settings,
      reward: {
        ...settings.reward,
        correctAnswersThreshold: Math.max(1, numValue),
      },
    });
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
            {/* Number Ranges Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Number Ranges
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set the range for each factor
                </p>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  {(["A", "B", "C"] as const).map((factor) => (
                    <div
                      key={factor}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {factor}
                      </span>
                      <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-gray-500">Min</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={settings.ranges[factor].min}
                            onChange={(e) =>
                              updateRange(factor, "min", e.target.value)
                            }
                            className="w-16 h-9 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title={`Minimum value for ${factor}`}
                          />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-gray-500">Max</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={settings.ranges[factor].max}
                            onChange={(e) =>
                              updateRange(factor, "max", e.target.value)
                            }
                            className="w-16 h-9 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title={`Maximum value for ${factor}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">Timer</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set time limit for answers
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
                  {TIMER_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleTimer(value)}
                      className={`p-3 rounded-lg transition-all ${
                        (value === 0 && !settings.timerEnabled) ||
                        (settings.timerEnabled &&
                          settings.timerDuration === value)
                          ? "bg-blue-100 text-blue-600"
                          : "bg-white text-gray-600"
                      } hover:bg-blue-50 font-medium text-sm min-w-[40px]`}
                      title={`Set timer to ${label}`}
                    >
                      {value === 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
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
            </div>

            {/* Question Position Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Question Position
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select where the question mark appears
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
                  {(["A", "B", "C"] as const).map((position) => (
                    <button
                      key={position}
                      onClick={() => togglePosition(position)}
                      className={`p-3 rounded-lg transition-all ${
                        settings.selectedPositions.includes(position)
                          ? "bg-blue-100 text-blue-600"
                          : "bg-white text-gray-600"
                      } hover:bg-blue-50 font-medium text-sm min-w-[40px]`}
                      title={`${
                        settings.selectedPositions.includes(position)
                          ? "Remove"
                          : "Add"
                      } position ${position}`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reward Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">Rewards</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose your reward type
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
                  {REWARD_OPTIONS.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => updateReward(value)}
                      className={`p-3 rounded-lg transition-all ${
                        settings.reward.type === value
                          ? "bg-blue-100 text-blue-600"
                          : "bg-white text-gray-600"
                      } hover:bg-blue-50 font-medium text-sm min-w-[40px]`}
                      title={label}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={icon}
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {settings.reward.type !== "none" && (
                  <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Show reward after
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={settings.reward.correctAnswersThreshold}
                      onChange={(e) => updateThreshold(e.target.value)}
                      className="w-16 h-9 text-sm text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      correct answers
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Foster Challenging Questions Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Foster Challenging
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Control how often to show challenging questions
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  {[0, 25, 50, 75, 100].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() =>
                        handleSettingsChange({
                          ...settings,
                          fosterChallengingPercentage:
                            percentage as FosterChallengingPercentage,
                        })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.fosterChallengingPercentage === percentage
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {settings.fosterChallengingPercentage === 0 &&
                    "No challenging questions - all questions are random"}
                  {settings.fosterChallengingPercentage === 25 &&
                    "Low challenging - occasionally show difficult questions"}
                  {settings.fosterChallengingPercentage === 50 &&
                    "Medium challenging - balanced mix of easy and difficult questions"}
                  {settings.fosterChallengingPercentage === 75 &&
                    "High challenging - frequently show difficult questions"}
                  {settings.fosterChallengingPercentage === 100 &&
                    "Maximum challenging - focus on difficult questions"}
                </p>
              </div>
            </div>

            {/* Foster Question Gaps Section */}
            <div className="flex items-start gap-8 py-6 border-b border-gray-100">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Foster Gaps
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Control how often to show questions with gaps
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  {[0, 25, 50, 75, 100].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() =>
                        handleSettingsChange({
                          ...settings,
                          fosterGapsPercentage:
                            percentage as FosterGapsPercentage,
                        })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.fosterGapsPercentage === percentage
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {settings.fosterGapsPercentage === 0 &&
                    "No gaps - questions are complete"}
                  {settings.fosterGapsPercentage === 25 &&
                    "Low gaps - occasionally show questions with gaps"}
                  {settings.fosterGapsPercentage === 50 &&
                    "Medium gaps - balanced mix of complete and gapped questions"}
                  {settings.fosterGapsPercentage === 75 &&
                    "High gaps - frequently show questions with gaps"}
                  {settings.fosterGapsPercentage === 100 &&
                    "Maximum gaps - focus on questions with gaps"}
                </p>
              </div>
            </div>

            {/* Session Stats Display Section */}
            <div className="flex items-start gap-8 py-6">
              <div className="w-48 pt-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Session Stats
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose when to show statistics
                </p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
                  <button
                    onClick={() =>
                      handleSettingsChange({
                        ...settings,
                        sessionStatsDisplay: "none",
                      })
                    }
                    className={`p-3 rounded-lg transition-all ${
                      settings.sessionStatsDisplay === "none"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-white text-gray-600"
                    } hover:bg-blue-50 font-medium text-sm min-w-[120px]`}
                    title="Hide statistics"
                  >
                    None
                  </button>
                  <button
                    onClick={() =>
                      handleSettingsChange({
                        ...settings,
                        sessionStatsDisplay: "on_answer",
                      })
                    }
                    className={`p-3 rounded-lg transition-all ${
                      settings.sessionStatsDisplay === "on_answer"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-white text-gray-600"
                    } hover:bg-blue-50 font-medium text-sm min-w-[120px]`}
                    title="Show statistics after each answer"
                  >
                    On Answer
                  </button>
                  <button
                    onClick={() =>
                      handleSettingsChange({
                        ...settings,
                        sessionStatsDisplay: "permanent",
                      })
                    }
                    className={`p-3 rounded-lg transition-all ${
                      settings.sessionStatsDisplay === "permanent"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-white text-gray-600"
                    } hover:bg-blue-50 font-medium text-sm min-w-[120px]`}
                    title="Always show statistics"
                  >
                    Permanent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
