'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Upload, GitCompare, Download, BarChart3, Plus } from 'lucide-react';

interface AnimalsDirectoryHeaderProps {
  selectedAnimalIds: string[];
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  onExportCSV: () => void;
}

export function AnimalsDirectoryHeader({
  selectedAnimalIds,
  isAnalyticsOpen,
  setIsAnalyticsOpen,
  onExportCSV,
}: AnimalsDirectoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Livestock Master Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Animals &amp; Breeding Stock
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Individual animal identities, genealogical lineages, reproductive uses, and physical placements
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          id="btn-nav-import-animals"
          href="/bovine/animals/import"
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-stone-500" />
          <span>Import</span>
        </Link>

        <Link
          id="btn-nav-compare-animals"
          href={
            selectedAnimalIds.length >= 2
              ? `/bovine/animals/compare?ids=${selectedAnimalIds.slice(0, 4).join(',')}`
              : '/bovine/animals/compare'
          }
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <GitCompare className="w-3.5 h-3.5 text-stone-500" />
          <span>Compare {selectedAnimalIds.length > 0 && `(${selectedAnimalIds.length})`}</span>
        </Link>

        <button
          id="btn-export-animals-csv"
          onClick={onExportCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-800" />
          <span>Analytics</span>
        </button>

        <Link
          id="btn-enroll-new-animal"
          href="/bovine/animals/new"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register Animal</span>
        </Link>
      </div>
    </div>
  );
}
