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
  TestTubes,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function ReproductiveProcessesDirectoryPage() {
  const { animals, reproductiveProcesses } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [procedureTypeFilter, setProcedureTypeFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  const filteredProcesses = reproductiveProcesses.filter((proc: any) => {
    const pType = proc.procedureType === 'AI' ? 'ARTIFICIAL_INSEMINATION' : (proc.procedureType === 'ET' ? 'EMBRYO_TRANSFER' : proc.procedureType);
    if (procedureTypeFilter !== 'ALL' && pType !== procedureTypeFilter && proc.procedureType !== procedureTypeFilter) return false;
    const stage = proc.currentStage || proc.status || 'IN_PROGRESS';
    if (stageFilter !== 'ALL' && stage !== stageFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const cow = animals.find((a) => a.id === (proc.cowAnimalId || proc.cowId));
      const donor = (proc.donorCowAnimalId || proc.donorCowId) ? animals.find((a) => a.id === (proc.donorCowAnimalId || proc.donorCowId)) : null;
      const matchesCow = cow?.name.toLowerCase().includes(q) || cow?.internalId.toLowerCase().includes(q) || cow?.primaryIdentifier?.toLowerCase().includes(q);
      const matchesDonor = donor?.name.toLowerCase().includes(q) || proc.donorCowPlaceholder?.toLowerCase().includes(q);
      const matchesBull = proc.bullPlaceholder?.toLowerCase().includes(q) || proc.bullName?.toLowerCase().includes(q);
      const matchesEmbryo = proc.embryoCode?.toLowerCase().includes(q);
      if (!matchesCow && !matchesDonor && !matchesBull && !matchesEmbryo) return false;
    }

    return true;
  });

  const totalActive = reproductiveProcesses.filter((p: any) => {
    const s = p.currentStage || p.status;
    return s !== 'CALVED' && s !== 'LOST' && s !== 'FAILED';
  }).length;
  const totalAI = reproductiveProcesses.filter((p: any) => p.procedureType === 'ARTIFICIAL_INSEMINATION' || p.procedureType === 'AI').length;
  const totalET = reproductiveProcesses.filter((p: any) => p.procedureType === 'EMBRYO_TRANSFER' || p.procedureType === 'ET').length;
  const confirmedPregnant = reproductiveProcesses.filter((p: any) => {
    const s = p.currentStage || p.status;
    return s === 'PREGNANT' || s === 'PREGNANT_CONFIRMED' || s === 'CHECK_60_CONFIRMED';
  }).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Reproductive Processes</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Heart className="w-3 h-3 text-emerald-700" />
              Reproduction Ops
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Legacy Process Preservation</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 tracking-tight">
            Reproductive Processes &amp; Cycles
          </h1>
          <p className="text-xs text-stone-600 max-w-2xl">
            Unified multi-step tracking for Artificial Insemination (AI) and Embryo Transfer (ET) procedures, from donor &amp; recipient preparation, synchronization, to multi-stage pregnancy checks and calving.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            id="btn-new-repro-process"
            href="/bovine/reproduction/processes/new"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reproductive Process</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Active Procedures</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalActive}</div>
          <span className="text-[10px] text-emerald-700">In progress pipeline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Artificial Insemination</span>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalAI}</div>
          <span className="text-[10px] text-stone-500">AI cycles logged</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Embryo Transfer</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{totalET}</div>
          <span className="text-[10px] text-stone-500">Donor/Recipient cycles</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Confirmed Pregnant</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">{confirmedPregnant}</div>
          <span className="text-[10px] text-emerald-700">Verified by ultrasound</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search Cow, Donor, Bull, Embryo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={procedureTypeFilter}
            onChange={(e) => setProcedureTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="ALL">All Types (AI &amp; ET)</option>
            <option value="ARTIFICIAL_INSEMINATION">Artificial Insemination</option>
            <option value="EMBRYO_TRANSFER">Embryo Transfer</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="SYNC">Synchronization</option>
            <option value="INSEMINATED">Inseminated / Transferred</option>
            <option value="CHECK_30_PENDING">Day 30 Check Pending</option>
            <option value="PREGNANT_CONFIRMED">Pregnant Confirmed</option>
            <option value="CHECK_60_CONFIRMED">Day 60 Confirmed</option>
            <option value="CALVED">Calved</option>
            <option value="OPEN">Open (Not Pregnant)</option>
          </select>
        </div>
      </div>

      {/* Processes Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Cow / Recipient</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Procedure Date</th>
                <th className="py-3 px-4">Service Details (Bull / Donor / Embryo)</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Pregnancy Checks</th>
                <th className="py-3 px-4">Expected Calving</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    No reproductive processes match current filters.
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((proc) => {
                  const cow = animals.find((a) => a.id === proc.cowAnimalId);
                  const donor = proc.donorCowAnimalId ? animals.find((a) => a.id === proc.donorCowAnimalId) : null;
                  const bull = proc.bullAnimalId ? animals.find((a) => a.id === proc.bullAnimalId) : null;

                  return (
                    <tr key={proc.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/bovine/reproduction/processes/${proc.id}`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {cow ? cow.name : 'Unknown Cow'}
                        </Link>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {cow?.primaryIdentifier || cow?.internalId || 'Tag #—'}
                          {proc.recipientDgr && ` • DGR: ${proc.recipientDgr}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            proc.procedureType === 'EMBRYO_TRANSFER'
                              ? 'bg-amber-50 text-amber-900 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {proc.procedureType === 'EMBRYO_TRANSFER' ? 'Embryo Transfer' : 'AI Insemination'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                        {proc.procedureDate}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-stone-900">
                          Sire: {bull ? bull.name : proc.bullPlaceholder || 'Designated Bull'}
                        </div>
                        {proc.procedureType === 'EMBRYO_TRANSFER' && (
                          <div className="text-[11px] text-stone-500">
                            Donor: {donor ? donor.name : proc.donorCowPlaceholder || 'Donor Dam'}
                            {proc.embryoCode && ` • Code: ${proc.embryoCode}`}
                          </div>
                        )}
                        {proc.semenBatch && (
                          <div className="text-[10px] text-stone-400 font-mono">Batch: {proc.semenBatch}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold text-[11px]">
                          {(proc.currentStage || proc.status || 'IN_PROGRESS').replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {(proc.checks || proc.pregnancyChecks || []).map((chk: any, idx: number) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                chk.result === 'PREGNANT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : chk.result === 'OPEN'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                              title={`${chk.checkType || chk.stageLabel || 'Check'}: ${chk.result} on ${chk.date || chk.checkDate || ''}`}
                            >
                              {chk.checkType ? chk.checkType.replace('CHECK_', 'D-') : (chk.stageLabel || chk.result || 'CHK')}
                            </span>
                          ))}
                          {(!proc.checks && !proc.pregnancyChecks?.length) && (
                            <span className="text-stone-400 text-[11px]">No checks yet</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-stone-800">
                        {proc.expectedCalvingDate || 'TBD'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/bovine/reproduction/processes/${proc.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1"
                        >
                          <span>Manage</span>
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
