import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useGamification } from '../hooks/useGamification';
import { Trophy, Flame, Target, Star, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { gamificationData } = useAppContext();
  const { getLevelProgress } = useGamification();
  const progress = getLevelProgress();

  const stats = [
    {
      label: 'Total Points',
      value: gamificationData.totalPoints,
      icon: <Star className="text-purple-500" size={22} />,
      accent: 'from-purple-500/20 to-purple-500/5',
      ring: 'ring-purple-500/20',
    },
    {
      label: 'Current Level',
      value: `Level ${gamificationData.level}`,
      icon: <Trophy className="text-blue-500" size={22} />,
      accent: 'from-blue-500/20 to-blue-500/5',
      ring: 'ring-blue-500/20',
    },
    {
      label: 'Current Streak',
      value: `${gamificationData.currentStreak} Days`,
      icon: <Flame className="text-cyan-400" size={22} />,
      accent: 'from-cyan-400/20 to-cyan-400/5',
      ring: 'ring-cyan-400/20',
    },
    {
      label: 'Longest Streak',
      value: `${gamificationData.longestStreak} Days`,
      icon: <TrendingUp className="text-purple-500" size={22} />,
      accent: 'from-purple-500/20 to-purple-500/5',
      ring: 'ring-purple-500/20',
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back!</h1>
          <p className="text-gray-400 mt-1">Here's how you're doing on your journey.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.accent} ring-1 ${stat.ring} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Level Progress Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Level Progress</h2>
              <p className="text-sm text-gray-400 mt-1">Keep completing tasks to reach Level {gamificationData.level + 1}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-purple-500">{progress}%</span>
            </div>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>

          <div className="flex justify-between mt-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <span>Level {gamificationData.level}</span>
            <span>Level {gamificationData.level + 1}</span>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Insight */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-xl border border-white/10 p-5 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Daily Insight</h3>
              <p className="text-lg font-semibold text-white mt-3 leading-relaxed">
                "Consistency is the key to success. Your {gamificationData.currentStreak}-day streak is proof of your dedication!"
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-5">
              <Target size={160} className="text-white" />
            </div>
          </div>

          {/* Quick Tip */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 flex flex-col justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Tip</h3>
            <p className="text-gray-400 leading-relaxed">
              High priority tasks give you <span className="text-white font-semibold">30 points</span>! Complete them before their due date for an extra <span className="text-white font-semibold">10 point</span> bonus.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
