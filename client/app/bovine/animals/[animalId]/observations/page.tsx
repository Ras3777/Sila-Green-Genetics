'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  Sparkles,
  Plus,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ObservationCategory, ObservationSeverity } from '@/lib/bovine-types';

export default function AnimalObservationsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, observations, addObservation } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const animalObs = observations.filter((o) => o.animalId === animalId);

  // Form states
  const [category, setCategory] = useState<ObservationCategory>('HEALTH');
  const [severity, setSeverity] = useState<ObservationSeverity>('WARNING');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);

  if (!animal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    addObservation({
      animalId: animal.id,
      date: '2026-09-04',
      time: '14:30',
      category,
      severity,
      summary: summary.trim(),
      details: details.trim() || undefined,
      observedBy: 'Dr. Sarah Lin (DVM)',
      status: 'OPEN',
    });

    setSuccess(true);
    setSummary('');
    setDetails('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Observation Feed */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <span>Clinical & Behavioral Observations</span>
        </h2>

        <div className="space-y-3">
          {animalObs.map((obs) => (
            <div
              key={obs.id}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                obs.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : obs.severity === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/80 border border-stone-200">
                    {obs.category}
                  </span>
                  <span className="text-sm">{obs.summary}</span>
                </div>
                <span className="text-[10px] font-mono text-stone-500">
                  {obs.date} {obs.time}
                </span>
              </div>

              {obs.details && (
                <p className="text-stone-700 leading-relaxed font-medium">
                  {obs.details}
                </p>
              )}

              <div className="text-[10px] text-stone-500 pt-1">
                Observed by: {obs.observedBy} • Status: {obs.status}
              </div>
            </div>
          ))}

          {animalObs.length === 0 && (
            <div className="p-6 text-center text-stone-400 text-xs">
              No clinical or behavioral notes filed for this animal.
            </div>
          )}
        </div>
      </div>

      {/* New Observation Form */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
          File Field Observation
        </h2>

        {success && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Observation logged and synced to technician inbox.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ObservationCategory)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="HEALTH">Health / Clinical</option>
                <option value="BREEDING">Breeding / Estrus Behavior</option>
                <option value="BEHAVIOR">Temperament / Appetite</option>
                <option value="INJURY">Injury / Foot Health</option>
                <option value="CALVING">Calving & Post-Partum</option>
                <option value="GENERAL">General Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Severity / Urgency</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as ObservationSeverity)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="INFO">Informational Only</option>
                <option value="WARNING">Warning (Requires Inspection)</option>
                <option value="CRITICAL">Critical (Immediate Vet Action)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Observation Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. Mild swelling right hock, slight reluctance to bear weight"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Findings & Field Treatment</label>
            <textarea
              rows={3}
              placeholder="Provide context, medication applied, or recommended follow-up..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="btn-submit-observation"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Record Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
