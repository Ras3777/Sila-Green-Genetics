'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  History,
  Activity,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function BreedingStockWeaningPerformancePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, weaningRecords, addWeaningRecord } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const records = weaningRecords.filter((r) => r.animalId === animalId);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState('255.0');
  const [cbc, setCbc] = useState('3.8');
  const [dr, setDr] = useState('R1 - Pasture + Mineral Supplement');
  const [scrotalPerimeterCm, setScrotalPerimeterCm] = useState('28.5');
  const [reaCm2, setReaCm2] = useState('58.2');
  const [sftMm, setSftMm] = useState('4.2');
  const [marPercent, setMarPercent] = useState('3.6');
  const [acScore, setAcScore] = useState('U+ (Superior Conformation)');
  const [notes, setNotes] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Breeding stock record not found.</div>;
  }

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addWeaningRecord({
      animalId: animal.id,
      date,
      weightKg: parseFloat(weightKg) || 0,
      cbc: cbc || undefined,
      dr: dr || undefined,
      scrotalPerimeterCm: scrotalPerimeterCm ? parseFloat(scrotalPerimeterCm) : undefined,
      reaCm2: reaCm2 ? parseFloat(reaCm2) : undefined,
      sftMm: sftMm ? parseFloat(sftMm) : undefined,
      marPercent: marPercent ? parseFloat(marPercent) : undefined,
      acScore: acScore || undefined,
      notes: notes || undefined,
      technician: 'Ultrasound Specialist & Herdsman',
    });

    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals/breeding-stock" className="hover:text-emerald-800">
          Breeding Stock
        </Link>
        <span>/</span>
        <Link
          href={`/bovine/animals/breeding-stock/${animal.id}`}
          className="hover:text-emerald-800 font-semibold"
        >
          {animal.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Weaning / Phase II</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" />
              Breeding Performance Index
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Phase II Protocol</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600" />
            Weaning / Phase II Performance Ledger
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            205-day standard adjustment metrics including live scale weight, complete blood count (CBC), dietary regime (DR), scrotal perimeter (SP), ultrasound carcass traits (REA, SFT, MAR), and abattoir conformation (AC).
          </p>
        </div>

        <button
          id="btn-add-weaning-rec"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Weaning Measurement</span>
        </button>
      </div>

      {/* Metric Terminology Quick Reference */}
      <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
        <div>
          <span className="font-bold text-stone-900 block">Weight</span>
          <span className="text-[10px] text-stone-500">Live scale (kg)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">CBC</span>
          <span className="text-[10px] text-stone-500">Blood count</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">DR</span>
          <span className="text-[10px] text-stone-500">Dietary Regime</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">SP</span>
          <span className="text-[10px] text-stone-500">Scrotal Perim (cm)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">REA</span>
          <span className="text-[10px] text-stone-500">Ribeye Area (cm²)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">SFT</span>
          <span className="text-[10px] text-stone-500">Subcut Fat (mm)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">MAR</span>
          <span className="text-[10px] text-stone-500">Marbling (%)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900 block">AC</span>
          <span className="text-[10px] text-stone-500">Abattoir Conf.</span>
        </div>
      </div>

      {/* Observations Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <span>Recorded Weaning Observations ({records.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Weight</th>
                <th className="py-3 px-3">CBC</th>
                <th className="py-3 px-3">DR (Diet)</th>
                <th className="py-3 px-3">SP (cm)</th>
                <th className="py-3 px-3">REA (cm²)</th>
                <th className="py-3 px-3">SFT (mm)</th>
                <th className="py-3 px-3">MAR (%)</th>
                <th className="py-3 px-3">AC Conformation</th>
                <th className="py-3 px-3">Notes &amp; Tech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-stone-500">
                    No weaning phase measurements recorded for {animal.name}.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-stone-800 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-900">
                      {rec.weightKg} kg
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">{rec.cbc || '—'}</td>
                    <td className="py-3 px-3 text-stone-700 max-w-[140px] truncate" title={rec.dr}>
                      {rec.dr || '—'}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-900">{rec.scrotalPerimeterCm ? `${rec.scrotalPerimeterCm} cm` : '—'}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-stone-900">{rec.reaCm2 ? `${rec.reaCm2} cm²` : '—'}</td>
                    <td className="py-3 px-3 font-mono text-stone-700">{rec.sftMm ? `${rec.sftMm} mm` : '—'}</td>
                    <td className="py-3 px-3 font-mono text-stone-700">{rec.marPercent ? `${rec.marPercent}%` : '—'}</td>
                    <td className="py-3 px-3 text-stone-800 font-medium">{rec.acScore || '—'}</td>
                    <td className="py-3 px-3 text-stone-600 text-[11px]">
                      {rec.notes && <div className="italic">&ldquo;{rec.notes}&rdquo;</div>}
                      {rec.technician && <div className="text-stone-400">By {rec.technician}</div>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Observation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleAddMeasurement}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>Log Phase II Weaning Performance</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Live Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">CBC Score / Vitals</label>
                <input
                  type="text"
                  value={cbc}
                  onChange={(e) => setCbc(e.target.value)}
                  placeholder="e.g. 3.8 / Clear"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">DR (Dietary Regime)</label>
                <input
                  type="text"
                  value={dr}
                  onChange={(e) => setDr(e.target.value)}
                  placeholder="e.g. R1 - Pasture + Mineral"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">SP Scrotal (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={scrotalPerimeterCm}
                  onChange={(e) => setScrotalPerimeterCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">REA Ribeye (cm²)</label>
                <input
                  type="number"
                  step="0.1"
                  value={reaCm2}
                  onChange={(e) => setReaCm2(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">SFT Fat (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sftMm}
                  onChange={(e) => setSftMm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">MAR Marbling (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={marPercent}
                  onChange={(e) => setMarPercent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">AC (Abattoir Conformation)</label>
              <input
                type="text"
                value={acScore}
                onChange={(e) => setAcScore(e.target.value)}
                placeholder="e.g. U+ / High Muscle Rounding"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Observations on contemporary group condition..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 cursor-pointer"
              >
                Save Measurement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weaning Phase II Visual Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        stageFilter="WEANING"
        title="Weaning Phase II Visual Evidence & Conformation"
        description="205-day weaning weight verification, lateral conformation profile, and transition condition."
        galleryPath={`/bovine/animals/breeding-stock/${animal.id}/media`}
      />
    </div>
  );
}
