'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Plus,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Activity,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function RecipientEvaluationsDirectoryPage() {
  const { animals, recipientEvaluations, farms } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verifiedFilter, setVerifiedFilter] = useState('ALL');

  const filteredEvaluations = recipientEvaluations.filter((ev) => {
    if (statusFilter !== 'ALL' && ev.overallStatus !== statusFilter) return false;
    if (verifiedFilter === 'VERIFIED' && !ev.verified) return false;
    if (verifiedFilter === 'UNVERIFIED' && ev.verified) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const cow = animals.find((a) => a.id === ev.cowAnimalId);
      const matchesCow =
        cow?.name.toLowerCase().includes(q) ||
        cow?.internalId.toLowerCase().includes(q) ||
        cow?.primaryIdentifier?.toLowerCase().includes(q) ||
        ev.earTag?.toLowerCase().includes(q);
      const matchesEvaluator = ev.evaluator?.toLowerCase().includes(q);
      if (!matchesCow && !matchesEvaluator) return false;
    }

    return true;
  });

  const totalEvaluations = recipientEvaluations.length;
  const approvedCount = recipientEvaluations.filter((e) => e.overallStatus === 'APPROVED').length;
  const conditionalCount = recipientEvaluations.filter((e) => e.overallStatus === 'CONDITIONAL').length;
  const verifiedCount = recipientEvaluations.filter((e) => e.verified).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Recipient Evaluations</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Recipient Screening
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Embryo Transfer Readiness</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 tracking-tight">
            Recipient Cow Evaluations &amp; Scoring
          </h1>
          <p className="text-xs text-stone-600 max-w-2xl">
            Multi-system suitability scoring for surrogate recipient cows: estrus synchronization, uterine tone &amp; CL quality, structural conformation, body condition, and calf outcome history.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            id="btn-new-recipient-eval"
            href="/bovine/reproduction/recipient-evaluations/new"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Recipient Evaluation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Total Evaluated</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalEvaluations}</div>
          <span className="text-[10px] text-stone-500">Recipient records</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">ET Approved</span>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">{approvedCount}</div>
          <span className="text-[10px] text-emerald-700">Prime recipients</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Conditional</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{conditionalCount}</div>
          <span className="text-[10px] text-amber-800">Requires monitoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Audit Verified</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">{verifiedCount}</div>
          <span className="text-[10px] text-emerald-700">Official vet signed</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search Cow, Ear Tag, Evaluator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="ALL">All Qualification Statuses</option>
            <option value="APPROVED">Approved for Transfer</option>
            <option value="CONDITIONAL">Conditional / Re-check</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="ALL">All Audit Statuses</option>
            <option value="VERIFIED">Verified Audits Only</option>
            <option value="UNVERIFIED">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Cow / Ear Tag</th>
                <th className="py-3 px-4">Farm &amp; Breed</th>
                <th className="py-3 px-4">BCS (1-9)</th>
                <th className="py-3 px-4">Estrus &amp; CL</th>
                <th className="py-3 px-4">Pregnancy</th>
                <th className="py-3 px-4">Calf Outcome</th>
                <th className="py-3 px-4">Audit Verified</th>
                <th className="py-3 px-4">Evaluator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-stone-500">
                    No recipient evaluations found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((ev) => {
                  const cow = animals.find((a) => a.id === ev.cowAnimalId);
                  const farm = farms.find((f) => f.id === ev.farmId);

                  return (
                    <tr key={ev.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/bovine/reproduction/recipient-evaluations/${ev.id}`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {cow ? cow.name : 'Unknown Cow'}
                        </Link>
                        <div className="text-[11px] text-stone-500 font-mono">Tag: {ev.earTag}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{farm ? farm.name : 'Main Ranch'}</div>
                        <div className="text-[11px] text-stone-500">{ev.breed}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-stone-900">{ev.bcs}</span>
                        <span className="text-[10px] text-stone-400 ml-1">/ 9</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">Score: {ev.estrusScore}/5</div>
                        <div className="text-[10px] text-stone-500">CL: {ev.clQuality}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ev.gestationStatus === 'CONFIRMED_PREGNANT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.gestationStatus === 'OPEN'
                              ? 'bg-stone-100 text-stone-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ev.gestationStatus?.replace(/_/g, ' ') || 'OPEN'}
                        </span>
                        {ev.lastPregnancyCheckDate && (
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            {ev.lastPregnancyCheckDate}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[11px] text-stone-700 truncate" title={ev.calfOutcome}>
                          {ev.calfOutcome}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {ev.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">Pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {ev.evaluator}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ev.overallStatus === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : ev.overallStatus === 'CONDITIONAL'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {ev.overallStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/bovine/reproduction/recipient-evaluations/${ev.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
