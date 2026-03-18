import React from 'react';
import { useGamification } from '../hooks/useGamification';
import { Trophy, Flame, Target, Star, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { gamificationData, getLevelProgress } = useGamification();
  const progress = getLevelProgress();

  const stats = [
    {
      label: 'Total Points',
      value: gamificationData.totalPoints,
      icon: <Star className="text-amber-500" size={24} />,
      color: 'bg-amber-50',
    },
    {
      label: 'Current Level',
      value: `Level ${gamificationData.level}`,
      icon: <Trophy className="text-indigo-500" size={24} />,
      color: 'bg-indigo-50',
    },
    {
      label: 'Current Streak',
      value: `${gamificationData.currentStreak} Days`,
      icon: <Flame className="text-orange-500" size={24} />,
      color: 'bg-orange-50',
    },
    {
      label: 'Longest Streak',
      value: `${gamificationData.longestStreak} Days`,
      icon: <TrendingUp className="text-emerald-500" size={24} />,
      color: 'bg-emerald-50',
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 mt-1">Here's how you're doing on your journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Level Progress</h2>
            <p className="text-sm text-gray-500 mt-1">Keep completing tasks to reach Level {gamificationData.level + 1}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{progress}%</span>
          </div>
        </div>
        
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-indigo-600 rounded-full shadow-sm shadow-indigo-200"
          />
        </div>
        
        <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Level {gamificationData.level}</span>
          <span>Level {gamificationData.level + 1}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <h3 className="text-lg font-medium opacity-80">Daily Insight</h3>
            <p className="text-2xl font-bold mt-4 leading-relaxed">
              "Consistency is the key to success. Your {gamificationData.currentStreak}-day streak is proof of your dedication!"
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Target size={200} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Tip</h3>
          <p className="text-gray-500">
            High priority tasks give you 30 points! Complete them before their due date for an extra 10 point bonus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
