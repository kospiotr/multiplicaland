"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { QuestionLog } from "../types/types";

type TimePeriod = "session" | "overall" | "today" | "week" | "month";

interface HeatmapCell {
  total: number;
  correct: number;
  percentage: number;
}

interface TimingHeatmapCell {
  times: number[];
  averageTime: number;
}

export default function Progress() {
  const [logs, setLogs] = useState<QuestionLog[]>(() => {
    if (typeof window !== "undefined") {
      const savedLogs = localStorage.getItem("questionLogs");
      return savedLogs ? JSON.parse(savedLogs) : [];
    }
    return [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[][]>([]);
  const [timingHeatmapData, setTimingHeatmapData] = useState<
    TimingHeatmapCell[][]
  >([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("session");

  useEffect(() => {
    const savedLogs = localStorage.getItem("questionLogs");
    const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
    setLogs(parsedLogs);

    const savedSessionId = localStorage.getItem("currentSessionId");
    setCurrentSessionId(savedSessionId);
  }, []);

  const filterLogsByPeriod = useCallback((logs: QuestionLog[], period: TimePeriod) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return logs.filter((log) => {
      if (log.ignored) return false;
      const logDate = new Date(log.timestamp);
      switch (period) {
        case "session":
          return currentSessionId ? log.sessionId === currentSessionId : false;
        case "today":
          return logDate >= today;
        case "week":
          return logDate >= weekStart;
        case "month":
          return logDate >= monthStart;
        default:
          return true;
      }
    });
  }, [currentSessionId]);

  const toggleIgnoreLog = (logId: string) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, ignored: !log.ignored } : log
      )
    );
  };

  const calculateStats = (filteredLogs: QuestionLog[]) => {
    // Calculate accuracy heatmap data
    const heatmap: HeatmapCell[][] = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ total: 0, correct: 0, percentage: 0 }))
      );

    // Calculate timing heatmap data
    const timingHeatmap: TimingHeatmapCell[][] = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ times: [], averageTime: 0 }))
      );

    // Group logs by question for timing calculation
    const questionLogs = new Map<string, QuestionLog[]>();
    filteredLogs.forEach((log) => {
      const key = `${log.question.a}-${log.question.b}`;
      if (!questionLogs.has(key)) {
        questionLogs.set(key, []);
      }
      questionLogs.get(key)?.push(log);
    });

    // Calculate timing data for each question
    questionLogs.forEach((logs, key) => {
      const [a, b] = key.split("-").map(Number);
      const i = a - 1;
      const j = b - 1;

      // Sort by timestamp and take last 3 submissions
      const recentLogs = logs
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 3);

      timingHeatmap[i][j].times = recentLogs.map((log) => log.timeToAnswer);
      timingHeatmap[i][j].averageTime =
        recentLogs.reduce((acc, log) => acc + log.timeToAnswer, 0) /
        recentLogs.length;
    });

    // Calculate accuracy data
    filteredLogs.forEach((log) => {
      const i = log.question.a - 1;
      const j = log.question.b - 1;
      heatmap[i][j].total++;
      if (log.isCorrect) {
        heatmap[i][j].correct++;
      }
      heatmap[i][j].percentage =
        (heatmap[i][j].correct / heatmap[i][j].total) * 100;
    });

    setHeatmapData(heatmap);
    setTimingHeatmapData(timingHeatmap);
  };

  useEffect(() => {
    const filteredLogs = filterLogsByPeriod(logs, selectedPeriod);
    calculateStats(filteredLogs);
  }, [logs, selectedPeriod, filterLogsByPeriod]);

  const getHeatmapColor = (percentage: number, total: number) => {
    if (total === 0) return "bg-gray-50";
    if (percentage === 100) return "bg-green-500 text-white";
    if (percentage >= 80) return "bg-green-400 text-white";
    if (percentage >= 60) return "bg-yellow-400";
    if (percentage >= 40) return "bg-yellow-300";
    if (percentage >= 20) return "bg-red-300";
    return "bg-red-500 text-white";
  };

  const getTimingHeatmapColor = (averageTime: number, times: number[]) => {
    if (times.length === 0) return "bg-gray-50";

    // Find min and max times across all cells
    const allTimes = timingHeatmapData.flat().flatMap((cell) => cell.times);
    const minTime = Math.min(...allTimes);
    const maxTime = Math.max(...allTimes);

    if (minTime === maxTime) return "bg-gray-50";

    // Calculate percentage between min and max
    const percentage = ((averageTime - minTime) / (maxTime - minTime)) * 100;

    if (percentage <= 20) return "bg-green-500 text-white";
    if (percentage <= 40) return "bg-green-400 text-white";
    if (percentage <= 60) return "bg-yellow-400";
    if (percentage <= 80) return "bg-yellow-300";
    if (percentage <= 90) return "bg-red-300";
    return "bg-red-500 text-white";
  };

  const tabs: { id: TimePeriod; label: string }[] = [
    { id: "session", label: "Current Session" },
    { id: "overall", label: "Overall" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPeriod(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === tab.id
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {filterLogsByPeriod(logs, selectedPeriod).length}
            </div>
            <div className="text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {
                filterLogsByPeriod(logs, selectedPeriod).filter(
                  (log) => log.isCorrect
                ).length
              }
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {
                filterLogsByPeriod(logs, selectedPeriod).filter(
                  (log) => !log.isCorrect
                ).length
              }
            </div>
            <div className="text-gray-600">Incorrect Answers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {(() => {
                const filteredLogs = filterLogsByPeriod(logs, selectedPeriod);
                const correct = filteredLogs.filter(
                  (log) => log.isCorrect
                ).length;
                return filteredLogs.length > 0
                  ? Math.round((correct / filteredLogs.length) * 100)
                  : 0;
              })()}
              %
            </div>
            <div className="text-gray-600">Accuracy</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Accuracy Heatmap */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Accuracy Heatmap
            </h2>
            <div className="p-6">
              <div className="grid grid-cols-11 gap-1">
                {/* Header row */}
                <div className="h-10 flex items-center justify-center font-bold">
                  ×
                </div>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 flex items-center justify-center font-bold"
                  >
                    {i + 1}
                  </div>
                ))}

                {/* Table body */}
                {[...Array(10)].map((_, i) => (
                  <>
                    <div
                      key={`row-${i}`}
                      className="h-10 flex items-center justify-center font-bold"
                    >
                      {i + 1}
                    </div>
                    {[...Array(10)].map((_, j) => (
                      <div
                        key={`cell-${i}-${j}`}
                        className={`h-10 flex flex-col items-center justify-center text-sm transition-colors ${getHeatmapColor(
                          heatmapData[i]?.[j]?.percentage || 0,
                          heatmapData[i]?.[j]?.total || 0
                        )}`}
                        title={`${i + 1} × ${j + 1} = ${(i + 1) * (j + 1)}
Attempts: ${heatmapData[i]?.[j]?.total || 0}
Correct: ${heatmapData[i]?.[j]?.correct || 0}
Success Rate: ${(heatmapData[i]?.[j]?.percentage || 0).toFixed(1)}%`}
                      >
                        {heatmapData[i]?.[j]?.total ? (
                          <>
                            <span>
                              {heatmapData[i]?.[j]?.percentage.toFixed(0)}%
                            </span>
                            <span className="text-xs opacity-75">
                              ({heatmapData[i]?.[j]?.correct || 0}/
                              {heatmapData[i]?.[j]?.total -
                                (heatmapData[i]?.[j]?.correct || 0)}
                              /{heatmapData[i]?.[j]?.total || 0})
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* Timing Heatmap */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Timing Heatmap
            </h2>
            <div className="p-6">
              <div className="grid grid-cols-11 gap-1">
                {/* Header row */}
                <div className="h-10 flex items-center justify-center font-bold">
                  ×
                </div>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 flex items-center justify-center font-bold"
                  >
                    {i + 1}
                  </div>
                ))}

                {/* Table body */}
                {[...Array(10)].map((_, i) => (
                  <>
                    <div
                      key={`row-${i}`}
                      className="h-10 flex items-center justify-center font-bold"
                    >
                      {i + 1}
                    </div>
                    {[...Array(10)].map((_, j) => (
                      <div
                        key={`cell-${i}-${j}`}
                        className={`h-10 flex flex-col items-center justify-center text-sm transition-colors ${getTimingHeatmapColor(
                          timingHeatmapData[i]?.[j]?.averageTime || 0,
                          timingHeatmapData[i]?.[j]?.times || []
                        )}`}
                        title={`${i + 1} × ${j + 1} = ${(i + 1) * (j + 1)}
Last 3 attempts: ${
                          timingHeatmapData[i]?.[j]?.times
                            .map((t) => t.toFixed(1))
                            .join(", ") || "No attempts"
                        }
Average time: ${(timingHeatmapData[i]?.[j]?.averageTime || 0).toFixed(1)}s`}
                      >
                        {timingHeatmapData[i]?.[j]?.times.length ? (
                          <>
                            <span>
                              {(
                                timingHeatmapData[i]?.[j]?.averageTime || 0
                              ).toFixed(1)}
                              s
                            </span>
                            <span className="text-xs opacity-75">
                              ({timingHeatmapData[i]?.[j]?.times.length}/3)
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Question History */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Question History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filterLogsByPeriod(logs, selectedPeriod)
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr
                      key={log.id}
                      className={log.ignored ? "bg-gray-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.question.a} × {log.question.b} ={" "}
                        {log.question.answer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.userAnswer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.isCorrect
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.timeToAnswer.toFixed(1)}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (log.sessionId) {
                              setCurrentSessionId(log.sessionId);
                              localStorage.setItem(
                                "currentSessionId",
                                log.sessionId
                              );
                              setSelectedPeriod("session"); // Switch to session view
                            }
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            log.sessionId &&
                            currentSessionId &&
                            log.sessionId === currentSessionId
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title={`Full Session ID: ${
                            log.sessionId || "No session ID"
                          }\nClick to switch to this session`}
                        >
                          {log.sessionId
                            ? `${log.sessionId.slice(0, 10)}...`
                            : "No ID"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleIgnoreLog(log.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            log.ignored
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title={
                            log.ignored
                              ? "Include in statistics"
                              : "Exclude from statistics"
                          }
                        >
                          {log.ignored ? "Ignored" : "Ignore"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Data Management
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const logsData = JSON.stringify(logs, null, 2);
                const blob = new Blob([logsData], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `question-logs-${
                  new Date().toISOString().split("T")[0]
                }.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export Question Logs
            </button>
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedLogs = JSON.parse(
                          event.target?.result as string
                        );
                        if (Array.isArray(importedLogs)) {
                          setLogs(importedLogs);
                          localStorage.setItem(
                            "questionLogs",
                            JSON.stringify(importedLogs)
                          );
                          alert("Question logs imported successfully!");
                        } else {
                          throw new Error("Invalid log format");
                        }
                      } catch (error) {
                        alert(
                          "Error importing logs. Please make sure the file is in the correct format. " + error
                        );
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Import Question Logs
              </div>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
