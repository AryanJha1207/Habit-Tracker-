import React from 'react';
import { useHabitEvaluation } from '../hooks/useHabitEvaluation';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  LayoutGrid, 
  Lightbulb, 
  TrendingUp, 
  Calendar
} from 'lucide-react';

const HabitEvaluation: React.FC = () => {
  const { evaluation, hasData } = useHabitEvaluation();

  if (!hasData || !evaluation) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <TrendingUp size={40} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">No Evaluation Ready</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          Start adding and completing tasks in the Task Manager to generate your habit evaluation.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score <= 40) return 'text-red-500 bg-red-50 border-red-100';
    if (score <= 70) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-emerald-500 bg-emerald-50 border-emerald-100';
  };

  const scoreColorClasses = getScoreColor(evaluation.score);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Habit Evaluation</h1>
        <p className="text-gray-500 mt-1">Smart insights and scoring to help you improve your daily routine.</p>
      </header>

      {/* Top Section: Habit Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-10 rounded-[3rem] border-2 shadow-sm text-center ${scoreColorClasses.split(' ').slice(1).join(' ')}`}
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
            <Trophy className={evaluation.color} size={40} />
          </div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Overall Habit Score</h2>
          <div className="flex items-baseline gap-2">
            <span className={`text-8xl font-black tracking-tighter ${evaluation.color}`}>
              {evaluation.score}
            </span>
            <span className="text-2xl font-bold text-gray-400">/100</span>
          </div>
          <div className={`mt-4 px-6 py-2 rounded-full font-bold text-lg ${evaluation.color} bg-white shadow-sm`}>
            {evaluation.label}
          </div>
        </div>
      </motion.div>

      {/* Middle Section: Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consistency Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <Flame size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Consistency</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Current Streak</span>
              <span className="text-xl font-bold text-gray-900">{evaluation.consistency.currentStreak} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Longest Streak</span>
              <span className="text-xl font-bold text-gray-900">{evaluation.consistency.longestStreak} Days</span>
            </div>
            <p className="text-sm text-gray-600 italic mt-4 border-t border-gray-50 pt-4">
              {evaluation.consistency.message}
            </p>
          </div>
        </motion.div>

        {/* Completion Behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Behavior</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">On-Time Rate</span>
              <span className="text-xl font-bold text-emerald-600">{evaluation.behavior.onTimeRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Late Rate</span>
              <span className="text-xl font-bold text-rose-500">{evaluation.behavior.lateRate}%</span>
            </div>
            <p className="text-sm text-gray-600 italic mt-4 border-t border-gray-50 pt-4">
              {evaluation.behavior.insight}
            </p>
          </div>
        </motion.div>

        {/* Category Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <LayoutGrid size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Balance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(evaluation.balance.distribution).map(([cat, count]) => (
                (count as number) > 0 && (
                  <span key={cat} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold">
                    {cat}: {count as number}
                  </span>
                )
              ))}
            </div>
            <p className="text-sm text-gray-600 italic mt-4 border-t border-gray-50 pt-4">
              {evaluation.balance.suggestion}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Suggestions & Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb size={24} className="text-indigo-200" />
            <h2 className="text-2xl font-bold">Smart Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evaluation.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-6">
            <Calendar size={32} />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">This Week</h3>
          <div className="text-5xl font-black text-gray-900 mb-2">
            {evaluation.weeklySummary.completedThisWeek}
          </div>
          <p className="text-sm text-gray-500">Tasks Completed</p>
          <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <TrendingUp size={16} />
            <span>Keep it up!</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitEvaluation;
