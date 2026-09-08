'use client';

import React from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  ArrowRightLeft,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function MatingHubPage() {
  const { matingPlans, matingRecommendations } = useBreeding();

  const totalPlans = matingPlans.length;
  const approvedPlans = matingPlans.filter((p) => p.status === 'APPROVED').length;
  const totalRecs = matingRecommendations.length;
  const acceptedRecs = matingRecommendations.filter((r) => r.status === 'ACCEPTED').length;
  const flaggedRiskRecs = matingRecommendations.filter(
    (r) => r.isConditionCarrierRisk || (r.expectedInbreedingF || 0) > 0.0625
  ).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Mate Allocation &amp; Inbreeding Control • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Mating Allocation Hub</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Optimize sire-to-dam allocations, prevent lethal genetic condition pairings, and limit inbreeding accumulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/bovine/mating/comparison"
            className="inline-flex items-center space-x-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Sire Comparison Matrix</span>
          </Link>
          <Link
            href="/bovine/mating/plans/new"
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Mating Plan</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Active Plans</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalPlans}</div>
          <div className="text-[11px] text-stone-500 mt-1">{approvedPlans} Approved &amp; Dispatched</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Recommended Pairings</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalRecs}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {acceptedRecs} Accepted ({Math.round((acceptedRecs / (totalRecs || 1)) * 100)}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Condition Risk Intercepts</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{flaggedRiskRecs}</div>
          <div className="text-[11px] text-stone-500 mt-1">Blocked HH1/BLAD Carrier Pairings</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Mean Progeny Inbreeding</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">3.4%</div>
          <div className="text-[11px] text-stone-500 mt-1">Target Ceiling: &le; 6.25%</div>
        </div>
      </div>

      {/* Navigation Quick Links Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/bovine/mating/plans"
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 transition-colors" />
          </div>
          <h2 className="text-sm font-bold text-stone-900">Mating Allocation Plans</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Review seasonal batch allocation plans, technician assignments, and inbreeding constraints.
          </p>
        </Link>

        <Link
          href="/bovine/mating/recommendations"
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 transition-colors" />
          </div>
          <h2 className="text-sm font-bold text-stone-900">Pairing Recommendations Matrix</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Detailed Female &times; Sire pairings table with inbreeding checks, progeny index scores, and accept/reject actions.
          </p>
        </Link>

        <Link
          href="/bovine/mating/comparison"
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-emerald-700/50 shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 transition-colors" />
          </div>
          <h2 className="text-sm font-bold text-stone-900">Sire Comparison &amp; Progeny Simulator</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Compare prospective AI sires side-by-side and simulate predicted progeny genetic outcomes against any cow.
          </p>
        </Link>
      </div>

      {/* Recent Plans Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Active Mating Plans
          </h2>
          <Link
            href="/bovine/mating/plans"
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            View All ({matingPlans.length}) &rarr;
          </Link>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Plan Code &amp; Name</th>
              <th className="p-3.5">Farm / Herd</th>
              <th className="p-3.5">Season</th>
              <th className="p-3.5">Candidates</th>
              <th className="p-3.5">Inbreeding Ceiling</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {matingPlans.map((plan) => (
              <tr key={plan.id} className="hover:bg-stone-50">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-950">{plan.code}</div>
                  <div className="font-semibold text-stone-900">{plan.name}</div>
                </td>
                <td className="p-3.5">
                  <div className="text-stone-800 font-medium">{plan.farmName || 'All Registered'}</div>
                  <div className="text-[11px] text-stone-500">{plan.herdName || 'Main Breeding Cohort'}</div>
                </td>
                <td className="p-3.5 font-semibold text-stone-800">{plan.season}</td>
                <td className="p-3.5">
                  <span className="font-bold text-stone-900">{plan.femaleCount}</span> Females &times;{' '}
                  <span className="font-bold text-stone-900">{plan.sireCount}</span> Sires
                </td>
                <td className="p-3.5 font-mono text-stone-800">&le; {plan.maxInbreedingThreshold}% F</td>
                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      plan.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/bovine/mating/plans/${plan.id}`}
                    className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
