import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Timer, BarChart3, ClipboardCheck, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const Sidebar: React.FC = () => {
  const { currentUser: user } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Task Manager', path: '/tasks', icon: <CheckSquare size={18} /> },
    { name: 'Pomodoro', path: '/pomodoro', icon: <Timer size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Habit Evaluation', path: '/evaluation', icon: <ClipboardCheck size={18} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
          Habit Tracker Pro
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {(user?.user_metadata?.full_name || user?.user_metadata?.name)?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
