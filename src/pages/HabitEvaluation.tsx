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
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
          <TrendingUp size={40} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">No Evaluation Ready</h1>
        <p className="text-gray-400 mt-2 max-w-md">
          Start adding and completing tasks in the Task Manager to generate your habit evaluation.
        </p>
      </div>
    );
  }

  const getScoreGlassColor = (score: number) => {
    if (score <= 40) return 'from-red-500/10 to-red-500/5 border-red-500/20';
    if (score <= 70) return 'from-amber-500/10 to-amber-500/5 border-amber-500/20';
    return 'from-cyan-400/10 to-emerald-500/5 border-cyan-400/20';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Habit Evaluation</h1>
        <p className="text-gray-400 mt-1">Smart insights and scoring to help you improve your daily routine.</p>
      </header>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl bg-gradient-to-br ${getScoreGlassColor(evaluation.score)} backdrop-blur-xl border p-10 text-center`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Trophy className={evaluation.color} size={36} />
          </div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Overall Habit Score</h2>
          <div className="flex items-baseline gap-2">
            <span className={`text-8xl font-black tracking-tighter ${evaluation.color}`}>
              {evaluation.score}
            </span>
            <span className="text-2xl font-bold text-gray-500">/100</span>
          </div>
          <div className={`mt-4 px-6 py-2 rounded-full font-semibold text-lg ${evaluation.color} bg-white/5 border border-white/10`}>
            {evaluation.label}
          </div>
        </div>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(251,146,60,0.1)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame size={18} />
            </div>
            <h3 className="font-semibold text-white">Consistency</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Current Streak</span>
              <span className="text-lg font-bold text-white">{evaluation.consistency.currentStreak} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Longest Streak</span>
              <span className="text-lg font-bold text-white">{evaluation.consistency.longestStreak} Days</span>
            </div>
            <p className="text-sm text-gray-500 italic mt-3 border-t border-white/5 pt-3">
              {evaluation.consistency.message}
            </p>
          </div>
        </motion.div>

        {/* Behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <h3 className="font-semibold text-white">Behavior</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">On-Time Rate</span>
              <span className="text-lg font-bold text-cyan-400">{evaluation.behavior.onTimeRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Late Rate</span>
              <span className="text-lg font-bold text-red-400">{evaluation.behavior.lateRate}%</span>
            </div>
            <p className="text-sm text-gray-500 italic mt-3 border-t border-white/5 pt-3">
              {evaluation.behavior.insight}
            </p>
          </div>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center">
              <LayoutGrid size={18} />
            </div>
            <h3 className="font-semibold text-white">Balance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(evaluation.balance.distribution).map(([cat, count]) => (
                (count as number) > 0 && (
                  <span key={cat} className="px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-full text-xs font-semibold">
                    {cat}: {count as number}
                  </span>
                )
              ))}
            </div>
            <p className="text-sm text-gray-500 italic mt-3 border-t border-white/5 pt-3">
              {evaluation.balance.suggestion}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Suggestions + Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 rounded-3xl bg-gradient-to-br from-purple-500/15 to-blue-500/10 backdrop-blur-xl border border-white/10 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb size={22} className="text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Smart Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evaluation.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex gap-3">
                <div className="w-7 h-7 bg-purple-500/20 border border-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold text-purple-300 text-sm">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-gray-300 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
            <Calendar size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">This Week</h3>
          <div className="text-5xl font-black text-white mb-2">
            {evaluation.weeklySummary.completedThisWeek}
          </div>
          <p className="text-sm text-gray-400">Tasks Completed</p>
          <div className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <TrendingUp size={16} />
            <span>Keep it up!</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitEvaluation;
