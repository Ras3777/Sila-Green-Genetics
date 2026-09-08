'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  CalendarCheck2,
} from 'lucide-react';

export default function BovineFarmHerdsPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { herds, animals, farms, addHerd } = useBovine();
  const farm = farms.find((f) => f.id === farmId);
  const farmHerds = herds.filter((h) => h.farmId === farmId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [herdName, setHerdName] = useState('');
  const [purpose, setPurpose] = useState('In-vitro fertilization, superovulation, and embryo production');

  if (!farm) return null;

  const handleCreateHerd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!herdName.trim()) return;

    addHerd({
      farmId: farm.id,
      code: `HRD-${(herds.length + 1).toString().padStart(3, '0')}`,
      name: herdName.trim(),
      purpose: purpose.trim(),
      active: true,
    });

    setHerdName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Configured Herds &amp; Management Lots</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational herd partitions, biosecurity groups, and functional breeding lots at {farm.name}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Herd</span>
        </button>
      </div>

      {/* Herds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmHerds.map((herd) => {
          const herdAnimals = animals.filter((a) => a.herdId === herd.id);
          const reviewCount = herdAnimals.filter((a) => a.requiresReview).length;

          return (
            <div
              key={herd.id}
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-emerald-700/50 hover:shadow-md transition-all text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-emerald-800 font-bold text-xs">{herd.code}</span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">{herd.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200">
                    {herdAnimals.length} Head
                  </span>
                </div>

                <p className="text-stone-600 leading-relaxed font-medium">{herd.purpose}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase">Daily Log Progress</span>
                    <span className="font-bold text-stone-900">{herd.dailyLogCompletionPct}% Completed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase">Review Alerts</span>
                    <span className={`font-bold ${reviewCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {reviewCount} Flagged
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={`/bovine/herds/${herd.id}`}
                  className="text-emerald-800 font-bold hover:underline flex items-center"
                >
                  <span>Herd Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  href={`/bovine/farms/${farm.id}/animals?herd=${herd.id}`}
                  className="text-stone-500 font-medium hover:text-stone-900"
                >
                  View Animals &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Herd Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleCreateHerd}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Create New Herd / Lot Group</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Herd Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Heifer Development Barn 3"
                value={herdName}
                onChange={(e) => setHerdName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Operational Purpose *</label>
              <textarea
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                Create Herd
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
