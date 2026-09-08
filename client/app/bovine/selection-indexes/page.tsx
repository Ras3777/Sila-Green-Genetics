'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Sliders,
  Plus,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Layers,
  Calendar,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export default function SelectionIndexesCatalogPage() {
  const { selectionIndexes } = useBreeding();
  const [search, setSearch] = useState('');

  const filtered = selectionIndexes.filter((idx) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        idx.name.toLowerCase().includes(q) ||
        idx.code.toLowerCase().includes(q) ||
        idx.purpose.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Sliders className="w-4 h-4" />
            <span>Economic Models • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Selection Index Formulas &amp; Catalogs</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Configure multi-trait economic selection indexes, trait emphasis weights, versions, and economic multipliers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/selection-indexes/new"
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Index</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search index formulas, codes, purposes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Indexes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((idx) => {
          const currentVersion = idx.versions?.[0];
          const components = currentVersion?.components || [];

          return (
            <div
              key={idx.id}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs p-6 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {idx.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {idx.activeVersion}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">
                    Base Year: {currentVersion?.baseYear || 2020}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-stone-900">{idx.name}</h2>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">{idx.purpose}</p>
                </div>

                {/* Trait Components Summary Bar */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex justify-between">
                    <span>Key Trait Weights ({components.length} components)</span>
                    <span>Direction</span>
                  </div>

                  <div className="space-y-1.5">
                    {components.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-medium text-stone-800">{c.traitName}</span>
                          <span className="text-[10px] text-stone-400">({c.category})</span>
                        </div>
                        <div className="font-mono font-bold text-stone-900">
                          {c.direction === 'INCREASE' ? '+' : c.direction === 'DECREASE' ? '-' : 'opt'}
                          {c.weight}
                          <span className="text-stone-400 font-normal ml-1">
                            ({Math.round((c.standardizedWeight || 0.2) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  {idx.versions.length} Version{idx.versions.length > 1 ? 's' : ''} Published
                </span>
                <Link
                  href={`/bovine/selection-indexes/${idx.id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-700"
                >
                  <span>View Formula &amp; Weights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
