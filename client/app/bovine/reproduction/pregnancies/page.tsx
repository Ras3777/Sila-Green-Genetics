'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Baby,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { PregnancyStatus } from '@/lib/bovine-types';

export default function BovinePregnanciesPage() {
  const {
    session,
    farms,
    animals,
    pregnancies,
    breedingEvents,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('CONFIRMED');

  const filteredPregnancies = pregnancies
    .filter((p) => {
      const dam = animals.find((a) => a.id === p.damId);
      if (session.activeFarmId !== 'ALL' && dam?.farmId !== session.activeFarmId) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDam = dam?.name.toLowerCase().includes(q) || dam?.primaryIdentifier?.toLowerCase().includes(q);
        return matchDam;
      }
      return true;
    })
    .map((p) => {
      const dam = animals.find((a) => a.id === p.damId);
      const breeding = breedingEvents.find((b) => b.id === p.breedingEventId);

      const concDate = new Date(p.conceptionDate || '2026-01-01');
      const expDate = new Date(p.expectedCalvingDate || '2026-10-01');
      const now = new Date('2026-09-04');

      const elapsedMs = now.getTime() - concDate.getTime();
      const elapsedDays = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
      const daysToCalving = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const progressPct = Math.min(100, Math.round((elapsedDays / 283) * 100));

      const isDryOffDue = elapsedDays >= 220;
      const isImminent = daysToCalving >= 0 && daysToCalving <= 14;

      return {
        ...p,
        dam,
        breeding,
        elapsedDays,
        daysToCalving,
        progressPct,
        isDryOffDue,
        isImminent,
      };
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/reproduction" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Reproduction Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Active Gestations</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Pregnancies & Gestation Roster</h1>
          <p className="text-xs text-stone-500 mt-1">
            Active maternal gestations, expected calving countdowns, and dry-off management alerts.
          </p>
        </div>

        <Link
          href="/bovine/reproduction/calvings"
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Baby className="w-4 h-4 mr-1.5" />
          Record Calving Delivery
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dam by name or identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Pregnancies</option>
          <option value="CONFIRMED">Confirmed Active</option>
          <option value="CALVED">Calved (Delivered)</option>
          <option value="TERMINATED">Terminated / Aborted</option>
        </select>
      </div>

      {/* Gestations Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Dam / Cow</th>
                <th className="py-3.5 px-4">Gestation Progress</th>
                <th className="py-3.5 px-4">Conception Date</th>
                <th className="py-3.5 px-4">Expected Calving</th>
                <th className="py-3.5 px-4">Countdown</th>
                <th className="py-3.5 px-4">Operational Flags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredPregnancies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No pregnancy records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPregnancies.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {p.dam ? (
                        <Link
                          href={`/bovine/animals/${p.dam.id}/reproduction`}
                          className="font-bold text-stone-900 hover:text-emerald-800"
                        >
                          {p.dam.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-stone-900">Unknown Dam</span>
                      )}
                      <div className="font-mono text-[11px] text-stone-400">
                        {p.dam?.primaryIdentifier || p.dam?.internalId}
                      </div>
                    </td>

                    <td className="py-3 px-4 min-w-44">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-semibold text-stone-800">
                          {p.elapsedDays} / 283d
                        </span>
                        <span className="text-stone-400">{p.progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            p.isImminent
                              ? 'bg-blue-600'
                              : p.isDryOffDue
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${p.progressPct}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-500">
                      {p.conceptionDate}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">
                      {p.expectedCalvingDate}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {p.status === 'CALVED' || p.status === 'ENDED_CALVED' ? (
                        <span className="text-stone-400 font-medium">Delivered</span>
                      ) : p.daysToCalving >= 0 ? (
                        <span
                          className={`font-bold ${
                            p.daysToCalving <= 14 ? 'text-blue-700' : 'text-stone-700'
                          }`}
                        >
                          {p.daysToCalving} days left
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold">
                          {Math.abs(p.daysToCalving)}d overdue
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isImminent && p.status === 'CONFIRMED' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                            Imminent Calving
                          </span>
                        )}
                        {p.isDryOffDue && p.status === 'CONFIRMED' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                            Dry-Off Due
                          </span>
                        )}
                        {!p.isImminent && !p.isDryOffDue && p.status === 'CONFIRMED' && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                            Mid-Gestation
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {p.status === 'CONFIRMED' && (
                        <Link
                          href={`/bovine/reproduction/calvings?damId=${p.damId}&pregId=${p.id}`}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors inline-block"
                        >
                          Calve
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
