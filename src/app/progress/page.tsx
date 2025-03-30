'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuestionLog } from '../types/types';

interface HeatmapCell {
  total: number;
  correct: number;
  percentage: number;
}

export default function Progress() {
  const [logs, setLogs] = useState<QuestionLog[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[][]>([]);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    averageTime: 0,
  });

  useEffect(() => {
    const savedLogs = localStorage.getItem('questionLogs');
    const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
    setLogs(parsedLogs);

    // Calculate stats
    const total = parsedLogs.length;
    const correct = parsedLogs.filter((log: QuestionLog) => log.isCorrect).length;
    const averageTime = parsedLogs.reduce((acc: number, log: QuestionLog) => acc + log.timeToAnswer, 0) / total || 0;

    // Calculate heatmap data
    const heatmap: HeatmapCell[][] = Array(10).fill(null).map(() => 
      Array(10).fill(null).map(() => ({ total: 0, correct: 0, percentage: 0 }))
    );

    parsedLogs.forEach((log: QuestionLog) => {
      const i = log.question.a - 1;
      const j = log.question.b - 1;
      heatmap[i][j].total++;
      if (log.isCorrect) {
        heatmap[i][j].correct++;
      }
      heatmap[i][j].percentage = (heatmap[i][j].correct / heatmap[i][j].total) * 100;
    });

    setHeatmapData(heatmap);
    setStats({
      total,
      correct,
      averageTime,
    });
  }, []);

  const getHeatmapColor = (percentage: number, total: number) => {
    if (total === 0) return 'bg-gray-50';
    if (percentage === 100) return 'bg-green-500 text-white';
    if (percentage >= 80) return 'bg-green-400 text-white';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-yellow-300';
    if (percentage >= 20) return 'bg-red-300';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Questions</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-medium">Correct Answers</h3>
            <p className="text-3xl font-bold text-green-600">
              {((stats.correct / stats.total) * 100 || 0).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-medium">Average Time</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.averageTime.toFixed(1)}s</p>
          </div>
        </div>

        {/* Multiplication Table Heatmap */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Performance Heatmap
          </h2>
          <div className="p-6">
            <div className="grid grid-cols-11 gap-1">
              {/* Header row */}
              <div className="h-10 flex items-center justify-center font-bold">×</div>
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-10 flex items-center justify-center font-bold">{i + 1}</div>
              ))}
              
              {/* Table body */}
              {[...Array(10)].map((_, i) => (
                <>
                  <div key={`row-${i}`} className="h-10 flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  {[...Array(10)].map((_, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className={`h-10 flex items-center justify-center text-sm transition-colors ${
                        getHeatmapColor(heatmapData[i]?.[j]?.percentage || 0, heatmapData[i]?.[j]?.total || 0)
                      }`}
                      title={`${i + 1} × ${j + 1} = ${(i + 1) * (j + 1)}
Attempts: ${heatmapData[i]?.[j]?.total || 0}
Correct: ${heatmapData[i]?.[j]?.correct || 0}
Success Rate: ${(heatmapData[i]?.[j]?.percentage || 0).toFixed(1)}%`}
                    >
                      {heatmapData[i]?.[j]?.total ? `${heatmapData[i]?.[j]?.percentage.toFixed(0)}%` : '-'}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Question History */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Question History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Answer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.slice().reverse().map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.question.a} × {log.question.b} = {log.question.answer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.userAnswer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.isCorrect 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.timeToAnswer.toFixed(1)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 