'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
} from 'lucide-react';

export default function BovineWithdrawalPage() {
  const {
    session,
    farms,
    animals,
    medicationAdministrations,
    treatments,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'CLEARED'>('ACTIVE');

  // Compute withdrawal status for all given medications
  const withdrawalItems = medicationAdministrations
    .filter((m) => m.status === 'GIVEN')
    .map((m) => {
      const anim = animals.find((a) => a.id === m.animalId);
      const treat = treatments.find((t) => t.id === m.treatmentId);
      const adminDate = new Date(m.administeredAt);

      const meatDays = treat?.meatWithdrawalDays || 0;
      const milkDays = treat?.milkWithdrawalDays || 0;

      const meatReleaseDate = new Date(adminDate.getTime() + meatDays * 86400000);
      const milkReleaseDate = new Date(adminDate.getTime() + milkDays * 86400000);

      const now = new Date();
      const isMeatLocked = meatDays > 0 && meatReleaseDate > now;
      const isMilkLocked = milkDays > 0 && milkReleaseDate > now;
      const isLocked = isMeatLocked || isMilkLocked;

      // Calculate days remaining
      const maxRelease = new Date(Math.max(meatReleaseDate.getTime(), milkReleaseDate.getTime()));
      const msRemaining = maxRelease.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

      return {
        id: m.id,
        animalId: m.animalId,
        animalName: anim?.name || 'Unknown',
        animalIdentifier: anim?.primaryIdentifier || anim?.internalId || 'ID',
        farmId: anim?.farmId,
        medication: m.medication,
        administeredAt: m.administeredAt,
        meatDays,
        milkDays,
        meatReleaseDate,
        milkReleaseDate,
        isMeatLocked,
        isMilkLocked,
        isLocked,
        daysRemaining,
      };
    })
    .filter((item) => {
      if (session.activeFarmId !== 'ALL' && item.farmId !== session.activeFarmId) return false;
      if (filterType === 'ACTIVE' && !item.isLocked) return false;
      if (filterType === 'CLEARED' && item.isLocked) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.animalName.toLowerCase().includes(q) ||
          item.animalIdentifier.toLowerCase().includes(q) ||
          item.medication.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const activeLocksCount = withdrawalItems.filter((w) => w.isLocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/health" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Health Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Food Safety & Withdrawal</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Withdrawal & Food Safety Clearance</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time compliance tracking for antibiotic and pharmaceutical milk and meat withholding periods.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            <span>{activeLocksCount} Animals Locked</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search animal or drug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <div className="flex items-center p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setFilterType('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ACTIVE'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Active Withholding
          </button>
          <button
            onClick={() => setFilterType('CLEARED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'CLEARED'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Cleared / Expired
          </button>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            All Logs
          </button>
        </div>
      </div>

      {/* Withdrawal Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Lock Status</th>
                <th className="py-3.5 px-4">Animal</th>
                <th className="py-3.5 px-4">Medication Given</th>
                <th className="py-3.5 px-4">Administered Date</th>
                <th className="py-3.5 px-4">Milk Withholding</th>
                <th className="py-3.5 px-4">Meat Withdrawal</th>
                <th className="py-3.5 px-4 text-right">Safe Clearance Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {withdrawalItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No animals under withdrawal restrictions match your filter.
                  </td>
                </tr>
              ) : (
                withdrawalItems.map((w) => (
                  <tr key={w.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {w.isLocked ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                          <Lock className="w-3 h-3 mr-1 text-rose-600" />
                          {w.daysRemaining}d Remaining
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Unlock className="w-3 h-3 mr-1 text-emerald-700" />
                          Cleared
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        href={`/bovine/animals/${w.animalId}/health`}
                        className="font-bold text-stone-900 hover:text-emerald-800"
                      >
                        {w.animalName}
                      </Link>
                      <div className="font-mono text-[11px] text-stone-400">{w.animalIdentifier}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-stone-900">
                      {w.medication}
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-500">
                      {w.administeredAt.split('T')[0]}
                    </td>

                    <td className="py-3 px-4">
                      {w.milkDays > 0 ? (
                        <span
                          className={`font-semibold ${
                            w.isMilkLocked ? 'text-rose-800' : 'text-stone-500'
                          }`}
                        >
                          {w.milkDays} days ({w.milkReleaseDate.toLocaleDateString()})
                        </span>
                      ) : (
                        <span className="text-stone-400">0 days</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {w.meatDays > 0 ? (
                        <span
                          className={`font-semibold ${
                            w.isMeatLocked ? 'text-amber-800' : 'text-stone-500'
                          }`}
                        >
                          {w.meatDays} days ({w.meatReleaseDate.toLocaleDateString()})
                        </span>
                      ) : (
                        <span className="text-stone-400">0 days</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                      {w.isLocked ? (
                        <span className="text-rose-800">
                          {Math.max(w.meatReleaseDate.getTime(), w.milkReleaseDate.getTime()) > 0
                            ? new Date(
                                Math.max(w.meatReleaseDate.getTime(), w.milkReleaseDate.getTime())
                              ).toLocaleDateString()
                            : '—'}
                        </span>
                      ) : (
                        <span className="text-emerald-800 flex items-center justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Safe
                        </span>
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
