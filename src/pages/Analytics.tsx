import React from 'react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, ListTodo, Percent, History } from 'lucide-react';

const COLORS = {
  Work: '#4f46e5',
  Personal: '#10b981',
  Health: '#06b6d4',
  Learning: '#8b5cf6',
  Custom: '#64748b',
};

const Analytics: React.FC = () => {
  const {
    stats,
    categoryDistribution,
    categoryPerformance,
    completionTrend,
    recentActivity,
    hasData,
  } = useAnalyticsData();

  if (!hasData) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
          <ListTodo size={40} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">No Data to Analyze</h1>
        <p className="text-gray-400 mt-2 max-w-md">
          Start adding and completing tasks in the Task Manager to see your productivity insights here.
        </p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: <ListTodo size={20} />, accent: 'text-gray-300', glow: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={20} />, accent: 'text-cyan-400', glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, accent: 'text-purple-400', glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]' },
    { label: 'Completion Rate', value: `${stats.percentage}%`, icon: <Percent size={20} />, accent: 'text-blue-400', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
  ];

  const tooltipStyle = {
    backgroundColor: 'rgba(11,15,23,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e5e7eb',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Visualize your productivity and habit trends.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] ${stat.glow}`}
          >
            <div className={`mb-4 ${stat.accent}`}>{stat.icon}</div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.accent}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5"
        >
          <h2 className="text-base font-semibold text-white mb-6">Category Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5"
        >
          <h2 className="text-base font-semibold text-white mb-6">Category Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Trend + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5"
        >
          <h2 className="text-base font-semibold text-white mb-6">7-Day Completion Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#0b0f17' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5"
        >
          <div className="flex items-center gap-2 mb-6">
            <History size={18} className="text-gray-400" />
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="flex flex-col border-l-2 border-purple-500/30 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-200 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Completed {new Date(item.completedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No recent completions.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
