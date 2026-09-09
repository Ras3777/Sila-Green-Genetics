'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SampleListFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  typeFilter: string;
  onTypeFilterChange: (t: string) => void;
}

export function SampleListFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: SampleListFilterBarProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap gap-2 text-xs">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search barcode or animal..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium"
      >
        <option value="ALL">All Statuses</option>
        <option value="COLLECTED">Collected</option>
        <option value="SHIPPED">Shipped</option>
        <option value="RECEIVED">Received</option>
        <option value="PROCESSING">Processing</option>
        <option value="COMPLETED">Completed</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium"
      >
        <option value="ALL">All Types</option>
        <option value="TISSUE_TSU">Tissue TSU</option>
        <option value="BLOOD_EDTA">Blood EDTA</option>
        <option value="SEMEN">Semen Straw</option>
        <option value="HAIR_FOLLICLE">Hair Follicles</option>
      </select>
    </div>
  );
}
