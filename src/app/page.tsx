'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { QuestionLog } from './types/types';
import { GameSettings, QuestionPosition } from './types/game';
import Notification from './components/Notification';
import Fireworks from './components/Fireworks';
import ImageReward from './components/ImageReward';

interface Question {
  a: number;
  b: number;
  answer: number;
  position: QuestionPosition;
}

const Home = () => {
  const [answer, setAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const rewardTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const statsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem('currentSessionId');
      if (savedSessionId) {
        return savedSessionId;
      }
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('currentSessionId', newSessionId);
      return newSessionId;
    }
    return crypto.randomUUID();
  });
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
        selectedPositions: ['C'],
        sessionStatsDisplay: 'none',
        reward: {
          type: 'none',
          correctAnswersThreshold: 5
        },
        fosterChallengingPercentage: 25,
        fosterGapsPercentage: 25
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
      selectedPositions: ['C'],
      sessionStatsDisplay: 'none',
      reward: {
        type: 'none',
        correctAnswersThreshold: 5
      },
      fosterChallengingPercentage: 25,
      fosterGapsPercentage: 25
    };
  });

  const generateRandom = useCallback((position: QuestionPosition = 'C') => {
    const generateInRange = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate A and B first
    const a = generateInRange(settings.ranges.A.min, settings.ranges.A.max);
    const b = generateInRange(settings.ranges.B.min, settings.ranges.B.max);
    const product = a * b;

    // If the product is outside C's range, regenerate
    if (product < settings.ranges.C.min || product > settings.ranges.C.max) {
      return generateRandom(position); // Try again
    }

    return { 
      a, 
      b, 
      answer: product,
      position
    };
  }, [settings.ranges]);

  const generateChallenging = useCallback((position: QuestionPosition = 'C') => {
    const generateInRange = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate larger numbers for more challenging questions
    const a = generateInRange(
      Math.max(settings.ranges.A.min, 5),
      settings.ranges.A.max
    );
    const b = generateInRange(
      Math.max(settings.ranges.B.min, 5),
      settings.ranges.B.max
    );
    const product = a * b;

    // If the product is outside C's range, regenerate
    if (product < settings.ranges.C.min || product > settings.ranges.C.max) {
      return generateChallenging(position); // Try again
    }

    return { 
      a, 
      b, 
      answer: product,
      position
    };
  }, [settings.ranges]);

  const generateGaps = useCallback((position: QuestionPosition = 'C') => {
    const generateInRange = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate numbers that create interesting gaps
    const a = generateInRange(settings.ranges.A.min, settings.ranges.A.max);
    const b = generateInRange(settings.ranges.B.min, settings.ranges.B.max);
    const product = a * b;

    // If the product is outside C's range, regenerate
    if (product < settings.ranges.C.min || product > settings.ranges.C.max) {
      return generateGaps(position); // Try again
    }

    // For gaps, we want to ensure the position is not 'C'
    // This ensures we're always showing a gap in the equation
    const finalPosition = position === 'C' ? 'A' : position;

    return { 
      a, 
      b, 
      answer: product,
      position: finalPosition
    };
  }, [settings.ranges]);

  const generateQuestion = useCallback((position: QuestionPosition = 'C') => {
    // Calculate probabilities based on settings
    const challengingProbability = settings.fosterChallengingPercentage / 100;
    const gapsProbability = settings.fosterGapsPercentage / 100;
    
    // Generate a random number between 0 and 1
    
    let out = undefined;
    // First try challenging questions based on probability
    if (Math.random() < challengingProbability) {
      out = generateChallenging(position);
    }
    if(out){
      return out;
    }
    
    // Then try gaps based on probability
    if (Math.random() < gapsProbability) {
      out = generateGaps(position);
    }
    if(out){
      return out;
    }
    
    // Fallback to random question
    return generateRandom(position);
  }, [settings.fosterChallengingPercentage, settings.fosterGapsPercentage, generateChallenging, generateGaps, generateRandom]);

  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => generateQuestion('C'));

  const [logs, setLogs] = useState<QuestionLog[]>(() => {
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem('questionLogs');
      return savedLogs ? JSON.parse(savedLogs) : [];
    }
    return [];
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('questionLogs', JSON.stringify(logs));
  }, [logs]);

  const startNewQuestion = useCallback(() => {
    const position = settings.selectedPositions[Math.floor(Math.random() * settings.selectedPositions.length)]
    const newQuestion = generateQuestion(position);
    setCurrentQuestion(newQuestion);
    setQuestionStartTime(new Date());
    setTimeLeft(settings.timerEnabled ? settings.timerDuration : null);
    setNotification(null);
    
    // Handle stats display based on settings
    if (settings.sessionStatsDisplay === 'permanent') {
      setShowStats(true);
    } else if (settings.sessionStatsDisplay === 'none') {
      setShowStats(false);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (settings.timerEnabled) {
      let time = settings.timerDuration;
      timerRef.current = setInterval(() => {
        time -= 1;
        setTimeLeft(time);
        
        if (time <= 0) {
          clearInterval(timerRef.current);
          handleTimeout();
        }
      }, 1000);
    }
  }, [settings.timerEnabled, settings.timerDuration, settings.selectedPositions, settings.sessionStatsDisplay, generateQuestion]);

  const formatQuestion = (question: Question) => {
    const parts = {
      A: question.position === 'A' ? '?' : question.a,
      B: question.position === 'B' ? '?' : question.b,
      C: question.position === 'C' ? '?' : question.answer
    };
    return `${parts.A} × ${parts.B} = ${parts.C}`;
  };

  const validateAnswer = (userAnswer: number, question: Question) => {
    switch (question.position) {
      case 'A':
        return userAnswer * question.b === question.answer;
      case 'B':
        return question.a * userAnswer === question.answer;
      case 'C':
        return question.a * question.b === userAnswer;
      default:
        return false;
    }
  };

  const getCorrectAnswer = (question: Question) => {
    switch (question.position) {
      case 'A':
        return question.a;
      case 'B':
        return question.b;
      case 'C':
        return question.answer;
      default:
        return question.answer;
    }
  };

  const handleTimeout = () => {
    const newLog: QuestionLog = {
      id: crypto.randomUUID(),
      sessionId,
      question: currentQuestion,
      userAnswer: -1,
      isCorrect: false,
      timestamp: new Date().toISOString(),
      timeToAnswer: settings.timerDuration
    };

    setLogs(prevLogs => [...prevLogs, newLog]);
    setNotification({
      type: 'error',
      message: `Time's up! The correct answer was ${getCorrectAnswer(currentQuestion)}`
    });
    setAnswer('');

    setTimeout(() => {
      startNewQuestion();
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const userAnswer = parseInt(answer);
    const endTime = new Date();
    const timeToAnswer = (endTime.getTime() - questionStartTime.getTime()) / 1000;

    const isCorrect = validateAnswer(userAnswer, currentQuestion);
    const correctAnswer = getCorrectAnswer(currentQuestion);

    const newLog: QuestionLog = {
      id: crypto.randomUUID(),
      sessionId,
      question: currentQuestion,
      userAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      timeToAnswer
    };

    setLogs(prevLogs => [...prevLogs, newLog]);

    // Handle stats display based on settings
    if (settings.sessionStatsDisplay === 'on_answer') {
      setShowStats(true);
      if (statsTimeoutRef.current) {
        clearTimeout(statsTimeoutRef.current);
      }
      statsTimeoutRef.current = setTimeout(() => {
        setShowStats(false);
      }, 2000);
    }

    if (isCorrect) {
      setNotification({
        type: 'success',
        message: 'Correct! Well done! 🎉'
      });
      
      // Handle consecutive correct answers and rewards
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      
      if (settings.reward.type !== 'none' && 
          newConsecutiveCorrect % settings.reward.correctAnswersThreshold === 0) {
        setShowReward(true);
        
        // Clear any existing reward timeout
        if (rewardTimeoutRef.current) {
          clearTimeout(rewardTimeoutRef.current);
        }
        
        // Hide reward after animation
        rewardTimeoutRef.current = setTimeout(() => {
          setShowReward(false);
        }, 3000);
      }
    } else {
      setNotification({
        type: 'error',
        message: `Incorrect. The correct answer is ${correctAnswer}`
      });
      setConsecutiveCorrect(0);
    }

    setAnswer('');
    
    setTimeout(() => {
      startNewQuestion();
    }, 2000);
  };

  // Initialize first question
  useEffect(() => {
    startNewQuestion();
  }, [startNewQuestion]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const createNewSession = () => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('currentSessionId', newSessionId);
    setConsecutiveCorrect(0);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center relative">
      <AnimatePresence>
        {showReward && settings.reward.type === 'fireworks' && <Fireworks />}
        {showReward && settings.reward.type === 'funny_picture' && <ImageReward show={showReward} />}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          {notification && (
            <div className={`px-6 py-3 rounded-xl shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {notification.message}
            </div>
          )}
          
          {/* Session Stats */}
          {showStats && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3">
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">Questions</div>
                  <div className="text-sm font-bold text-blue-700">{logs.filter(log => log.sessionId === sessionId).length}</div>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-xs text-green-600 font-medium">Accuracy</div>
                  <div className="text-sm font-bold text-green-700">
                    {(() => {
                      const sessionLogs = logs.filter(log => log.sessionId === sessionId);
                      const correct = sessionLogs.filter(log => log.isCorrect).length;
                      return sessionLogs.length > 0 
                        ? `${Math.round((correct / sessionLogs.length) * 100)}%`
                        : '0%';
                    })()}
                  </div>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <div className="text-xs text-orange-600 font-medium">Streak</div>
                  <div className="text-sm font-bold text-orange-700">{consecutiveCorrect}</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium">Avg Time</div>
                  <div className="text-sm font-bold text-purple-700">
                    {(() => {
                      const sessionLogs = logs.filter(log => log.sessionId === sessionId);
                      const avgTime = sessionLogs.reduce((acc, log) => acc + log.timeToAnswer, 0) / sessionLogs.length || 0;
                      return `${Math.round(avgTime)}s`;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Question Display */}
        <div className="text-4xl font-bold text-center mb-8">
          {formatQuestion(currentQuestion)}
        </div>

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-32 h-12 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="?"
            autoFocus
          />
          {timeLeft !== null && (
            <div className="text-lg font-medium text-gray-600">
              Time left: {timeLeft}s
            </div>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </motion.div>

      {/* Floating New Session Button */}
      <button
        onClick={createNewSession}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        title="Start a new session"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export default Home;

