'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export default function MatingPlansListPage() {
  const { matingPlans } = useBreeding();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filtered = matingPlans.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.season.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/mating" className="hover:text-stone-800">
              Mating Hub
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Plans</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Mating Allocation Plans</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage seasonal breeding allocation batches, candidate selections, and technician work orders.
          </p>
        </div>

        <Link
          href="/bovine/mating/plans/new"
          className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Mating Plan</span>
        </Link>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search plans by code, season, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <span className="font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="space-y-3">
        {filtered.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-5 rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {plan.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    plan.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {plan.status}
                </span>
                <span className="text-xs text-stone-500">• Season: <strong>{plan.season}</strong></span>
              </div>
              <h2 className="text-base font-bold text-stone-900">{plan.name}</h2>
              <div className="text-xs text-stone-500">
                Target Farm: <strong className="text-stone-700">{plan.farmName || 'All Farms'}</strong> • Herd:{' '}
                <strong className="text-stone-700">{plan.herdName || 'Main Cohort'}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-stone-600">
              <div className="text-right">
                <div className="font-bold text-stone-900 text-sm">
                  {plan.femaleCount} Females &times; {plan.sireCount} Sires
                </div>
                <div className="text-[11px] text-stone-500">
                  Ceiling: &le; {plan.maxInbreedingThreshold}% F • Carrier Exclusion:{' '}
                  {plan.carrierExclusion ? 'On' : 'Off'}
                </div>
              </div>

              <Link
                href={`/bovine/mating/plans/${plan.id}`}
                className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <span>View Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
