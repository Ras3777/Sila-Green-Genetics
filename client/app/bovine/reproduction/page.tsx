'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Heart,
  Calendar,
  Search,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Baby,
  Activity,
  GitBranch,
} from 'lucide-react';

export default function BovineReproductionDashboard() {
  const {
    session,
    farms,
    herds,
    animals,
    breedingCycles,
    breedingEvents,
    pregnancyChecks,
    pregnancies,
    calvingEvents,
  } = useBovine();

  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');

  const effectiveFarmId = session.activeFarmId !== 'ALL' ? session.activeFarmId : filterFarmId;
  const filteredAnimals = animals.filter(
    (a) => effectiveFarmId === 'ALL' || a.farmId === effectiveFarmId
  );
  const animalIds = new Set(filteredAnimals.map((a) => a.id));

  // Scoped Data
  const scopedPregnancies = pregnancies.filter((p) => animalIds.has(p.damId) && p.status === 'CONFIRMED');
  const scopedCycles = breedingCycles.filter((c) => animalIds.has(c.animalId || c.femaleAnimalId || '') && c.status !== 'CLOSED');
  const scopedBreedingEvents = breedingEvents.filter((b) => animalIds.has(b.animalId || b.femaleAnimalId || ''));
  const scopedCalvings = calvingEvents.filter((c) => animalIds.has(c.damId));

  // Animals in heat / Estrus queue
  const heatQueue = scopedCycles.filter((c) => c.status === 'ESTRUS' || c.status === 'SYNCHRONIZED');

  // Calvings expected in next 30 days
  const upcomingCalvings = scopedPregnancies.filter((p) => {
    if (!p.expectedCalvingDate) return false;
    const calvDate = new Date(p.expectedCalvingDate);
    const now = new Date('2026-09-04');
    const diffDays = Math.ceil((calvDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 text-emerald-700" />
            <span>Reproductive Lifecycle & AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Reproduction Command Center
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Heat detection surveillance, artificial insemination compliance, ultrasound pregnancy checks, and calving deliveries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session.activeFarmId === 'ALL' && (
            <select
              value={filterFarmId}
              onChange={(e) => setFilterFarmId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="ALL">All Facilities</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <Link
            href="/bovine/reproduction/calvings"
            className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Baby className="w-4 h-4 mr-1.5" />
            Calving Wizard
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Confirmed Pregnancies</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {scopedPregnancies.length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">gestating</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Ultrasound or palpation confirmed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Heats & Insemination Due</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {heatQueue.length}
            </span>
            <span className="text-xs text-amber-800 font-medium">active standing</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Standing heat or sync protocol peak</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Calvings (Next 30d)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {upcomingCalvings.length}
            </span>
            <span className="text-xs text-blue-700 font-medium">due close</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Maternity pen preparation queue</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Breedings Recorded</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {scopedBreedingEvents.length}
            </span>
            <span className="text-xs text-purple-700 font-medium">AI & ET</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Inseminations & embryo transfers</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <Link
          href="/bovine/reproduction/cycles"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Breeding Cycles</span>
          <span className="text-[10px] text-stone-400 mt-0.5">{scopedCycles.length} active</span>
        </Link>

        <Link
          href="/bovine/reproduction/processes"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <Heart className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Repro Processes</span>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5">AI &amp; ET Wizard</span>
        </Link>

        <Link
          href="/bovine/reproduction/recipient-evaluations"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Recipient Evals</span>
          <span className="text-[10px] text-amber-700 font-medium mt-0.5">Surrogate Audit</span>
        </Link>

        <Link
          href="/bovine/reproduction/breeding-events"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <GitBranch className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Inseminations</span>
          <span className="text-[10px] text-stone-400 mt-0.5">{scopedBreedingEvents.length} ledger</span>
        </Link>

        <Link
          href="/bovine/reproduction/pregnancy-checks"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Preg Checks</span>
          <span className="text-[10px] text-stone-400 mt-0.5">{pregnancyChecks.length} entries</span>
        </Link>

        <Link
          href="/bovine/reproduction/pregnancies"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Gestations</span>
          <span className="text-[10px] text-stone-400 mt-0.5">{scopedPregnancies.length} confirmed</span>
        </Link>

        <Link
          href="/bovine/reproduction/calvings"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <Baby className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Calvings</span>
          <span className="text-[10px] text-stone-400 mt-0.5">{scopedCalvings.length} births</span>
        </Link>

        <Link
          href="/bovine/reproduction/calendar"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-1.5">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-stone-800">Repro Timeline</span>
          <span className="text-[10px] text-stone-400 mt-0.5">Calendar view</span>
        </Link>
      </div>

      {/* Main Grid: Standing Heat Queue & Upcoming Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heat Queue */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-800" />
              <h2 className="text-base font-bold text-stone-900">Standing Heat Attention Queue</h2>
            </div>
            <Link
              href="/bovine/reproduction/cycles"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
            >
              <span>Manage Cycles</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          {heatQueue.length === 0 ? (
            <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
              <p className="text-xs font-semibold text-stone-800">No Females in Standing Heat</p>
              <p className="text-[11px] text-stone-400">All synchronization and natural heats currently bred or resting.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {heatQueue.map((c) => {
                const anim = animals.find((a) => a.id === (c.animalId || c.femaleAnimalId));
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/bovine/animals/${c.animalId || c.femaleAnimalId}/reproduction`}
                          className="font-bold text-stone-900 text-xs hover:text-emerald-800"
                        >
                          {anim?.name}
                        </Link>
                        <span className="font-mono text-[11px] text-stone-500">
                          {anim?.primaryIdentifier}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200 text-amber-900">
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        Cycle started: {c.startDate || c.cycleStart || '—'} • {c.notes || 'Activity spike detected'}
                      </div>
                    </div>

                    <Link
                      href="/bovine/reproduction/breeding-events"
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs shrink-0"
                    >
                      Record AI
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Calvings */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Baby className="w-5 h-5 text-blue-800" />
              <h2 className="text-base font-bold text-stone-900">Upcoming Calvings (Next 30 Days)</h2>
            </div>
            <Link
              href="/bovine/reproduction/pregnancies"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          {upcomingCalvings.length === 0 ? (
            <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-stone-800">No Imminent Deliveries</p>
              <p className="text-[11px] text-stone-400">Next scheduled calving falls outside the 30-day window.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingCalvings.map((p) => {
                const dam = animals.find((a) => a.id === p.damId);
                const calvDate = new Date(p.expectedCalvingDate || '');
                const now = new Date('2026-09-04');
                const diffDays = Math.ceil((calvDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/bovine/animals/${p.damId}/reproduction`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {dam?.name}
                        </Link>
                        <span className="font-mono text-stone-400 text-[11px]">
                          {dam?.primaryIdentifier}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Conception: {p.conceptionDate} • Expected: {p.expectedCalvingDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold text-[11px]">
                        In {diffDays} days
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
