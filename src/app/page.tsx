'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { QuestionLog } from './types/types';
import { GameSettings, QuestionPosition } from './types/game';
import Notification from './components/Notification';

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
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
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

  const generateQuestion = useCallback((position: QuestionPosition = 'C') => {
    const generateInRange = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate A and B first
    const a = generateInRange(settings.ranges.A.min, settings.ranges.A.max);
    const b = generateInRange(settings.ranges.B.min, settings.ranges.B.max);
    const product = a * b;

    // If the product is outside C's range, regenerate
    if (product < settings.ranges.C.min || product > settings.ranges.C.max) {
      return generateQuestion(position); // Try again
    }

    return { 
      a, 
      b, 
      answer: product,
      position
    };
  }, [settings.ranges]);

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
    const newQuestion = generateQuestion(settings.selectedPositions[Math.floor(Math.random() * settings.selectedPositions.length)]);
    setCurrentQuestion(newQuestion);
    setQuestionStartTime(new Date());
    setTimeLeft(settings.timerEnabled ? settings.timerDuration : null);
    setNotification(null);
    
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
  }, [settings.timerEnabled, settings.timerDuration, settings.selectedPositions, generateQuestion]);

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
      question: currentQuestion,
      userAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      timeToAnswer
    };

    setLogs(prevLogs => [...prevLogs, newLog]);

    if (isCorrect) {
      setNotification({
        type: 'success',
        message: 'Correct! Well done! 🎉'
      });
    } else {
      setNotification({
        type: 'error',
        message: `Incorrect. The correct answer is ${correctAnswer}`
      });
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

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center relative">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="relative">
              <motion.h2 
                key={`${currentQuestion.a}-${currentQuestion.b}-${currentQuestion.position}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-bold text-gray-800"
              >
                {formatQuestion(currentQuestion)}
              </motion.h2>
              {timeLeft !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg font-bold ${
                    timeLeft <= 2 ? 'text-red-500' : 'text-blue-500'
                  }`}
                >
                  {timeLeft}s
                </motion.div>
              )}
            </div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="text-center text-3xl w-32 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="?"
              autoFocus
            />
          </div>
          <button 
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Home;

