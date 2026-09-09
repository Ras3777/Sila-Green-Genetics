'use client';

import React from 'react';
import { Search, Table as TableIcon, LayoutGrid, CheckSquare } from 'lucide-react';
import { Farm } from '@/lib/bovine-types';

interface AnimalsFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterFarm: string;
  setFilterFarm: (farm: string) => void;
  filterSex: string;
  setFilterSex: (sex: string) => void;
  farms: Farm[];
  displayMode: 'table' | 'cards';
  setDisplayMode: (mode: 'table' | 'cards') => void;
  selectedAnimalIds: string[];
  onOpenBulkMove: () => void;
  onCreateTasks: () => void;
  onDeselectAll: () => void;
}

export function AnimalsFilterToolbar({
  searchQuery,
  setSearchQuery,
  filterFarm,
  setFilterFarm,
  filterSex,
  setFilterSex,
  farms,
  displayMode,
  setDisplayMode,
  selectedAnimalIds,
  onOpenBulkMove,
  onCreateTasks,
  onDeselectAll,
}: AnimalsFilterToolbarProps) {
  return (
    <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, internal ID, ear tag, registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-2xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterFarm}
            onChange={(e) => setFilterFarm(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800"
          >
            <option value="ALL">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={filterSex}
            onChange={(e) => setFilterSex(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800"
          >
            <option value="ALL">All Sexes</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>

          {/* Density & Layout Toggle */}
          <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setDisplayMode('table')}
              className={`p-1.5 rounded-lg cursor-pointer ${displayMode === 'table' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500'}`}
              title="Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('cards')}
              className={`p-1.5 rounded-lg cursor-pointer ${displayMode === 'cards' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500'}`}
              title="Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar if items selected */}
      {selectedAnimalIds.length > 0 && (
        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 animate-fade-in">
          <div className="font-semibold flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-emerald-700" />
            <span>{selectedAnimalIds.length} Livestock Selected</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-bulk-move-modal"
              onClick={onOpenBulkMove}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
            >
              Transfer / Move Herds
            </button>

            <button
              onClick={onCreateTasks}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
            >
              Create Tasks
            </button>

            <button
              onClick={onDeselectAll}
              className="text-stone-500 hover:text-stone-800 text-xs px-2 cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
