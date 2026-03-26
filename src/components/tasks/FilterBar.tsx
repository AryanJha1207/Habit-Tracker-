import React, { useState } from 'react';
import { Task, Category, Priority, StatusFilter } from '../../types';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  categoryFilter: Category | 'All';
  setCategoryFilter: (filter: Category | 'All') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 shrink-0">
          <Filter size={13} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="text-sm font-medium text-gray-300 focus:outline-none bg-transparent"
          >
            <option className="bg-[#0b0f17]" value="All">All Status</option>
            <option className="bg-[#0b0f17]" value="Pending">Pending</option>
            <option className="bg-[#0b0f17]" value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 shrink-0">
          <Filter size={13} className="text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
            className="text-sm font-medium text-gray-300 focus:outline-none bg-transparent"
          >
            <option className="bg-[#0b0f17]" value="All">All Categories</option>
            <option className="bg-[#0b0f17]" value="Work">Work</option>
            <option className="bg-[#0b0f17]" value="Personal">Personal</option>
            <option className="bg-[#0b0f17]" value="Health">Health</option>
            <option className="bg-[#0b0f17]" value="Learning">Learning</option>
            <option className="bg-[#0b0f17]" value="Custom">Custom</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
