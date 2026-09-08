'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  ArrowLeft,
  Calendar,
  History,
  Activity,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function BreedingStockYearlingPerformancePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, yearlingRecords, addYearlingRecord } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const records = yearlingRecords.filter((r) => r.animalId === animalId);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState('515.0');
  const [cbc, setCbc] = useState('4.2');
  const [dr, setDr] = useState('Y-R2 High Energy TMR');

  // Date-specific dietary regimes and metrics
  const [scrotalPerimeterCm, setScrotalPerimeterCm] = useState('39.5');
  const [dateSp, setDateSp] = useState(new Date().toISOString().split('T')[0]);
  const [drSp, setDrSp] = useState('TMR + Bull Mineral Mix');

  const [acScore, setAcScore] = useState('E (Excellent Conformation)');
  const [dateAc, setDateAc] = useState(new Date().toISOString().split('T')[0]);
  const [drAc, setDrAc] = useState('TMR + High Roughage Finishing');

  const [reaCm2, setReaCm2] = useState('88.4');
  const [sftMm, setSftMm] = useState('6.8');
  const [marPercent, setMarPercent] = useState('4.8');
  const [dateUs, setDateUs] = useState(new Date().toISOString().split('T')[0]);
  const [drUs, setDrUs] = useState('Standard Ultrasound Prep Diet');

  const [notes, setNotes] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Breeding stock record not found.</div>;
  }

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addYearlingRecord({
      animalId: animal.id,
      date,
      weightKg: parseFloat(weightKg) || 0,
      cbc: cbc || undefined,
      dr: dr || undefined,
      scrotalPerimeterCm: scrotalPerimeterCm ? parseFloat(scrotalPerimeterCm) : undefined,
      dateSp: dateSp || undefined,
      drSp: drSp || undefined,
      acScore: acScore || undefined,
      dateAc: dateAc || undefined,
      drAc: drAc || undefined,
      reaCm2: reaCm2 ? parseFloat(reaCm2) : undefined,
      sftMm: sftMm ? parseFloat(sftMm) : undefined,
      marPercent: marPercent ? parseFloat(marPercent) : undefined,
      dateUs: dateUs || undefined,
      drUs: drUs || undefined,
      notes: notes || undefined,
      technician: 'Senior Genetics Evaluator',
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
        <span className="font-semibold text-stone-900">Yearling / Phase III</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" />
              Breeding Mature Index
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Phase III Protocol</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Yearling / Phase III Performance Ledger
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            365-day mature growth evaluations with date-specific dietary regimes for Scrotal Perimeter (DR-SP), Abattoir Conformation (DR-AC), and Ultrasound carcass imaging (DR-US).
          </p>
        </div>

        <button
          id="btn-add-yearling-rec"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Yearling Measurement</span>
        </button>
      </div>

      {/* Observations Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <span>Recorded Phase III Observations ({records.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Weight (365d)</th>
                <th className="py-3 px-3">Scrotal (SP) &amp; DR-SP</th>
                <th className="py-3 px-3">Conformation (AC) &amp; DR-AC</th>
                <th className="py-3 px-3">Ultrasound (REA/SFT/MAR) &amp; DR-US</th>
                <th className="py-3 px-3">Technician / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No yearling phase measurements recorded for {animal.name}.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-stone-800 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-amber-900 text-sm">{rec.weightKg} kg</div>
                      {rec.dr && <div className="text-[10px] text-stone-400">Diet: {rec.dr}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-stone-900">
                        {rec.scrotalPerimeterCm ? `${rec.scrotalPerimeterCm} cm` : '—'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {rec.dateSp && <span>Date: {rec.dateSp} • </span>}
                        {rec.drSp || 'Standard DR'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-900">{rec.acScore || '—'}</div>
                      <div className="text-[10px] text-stone-500">
                        {rec.dateAc && <span>Date: {rec.dateAc} • </span>}
                        {rec.drAc || 'Standard DR'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-stone-900">
                        REA: {rec.reaCm2 ? `${rec.reaCm2} cm²` : '—'} | SFT: {rec.sftMm ? `${rec.sftMm} mm` : '—'} | MAR: {rec.marPercent ? `${rec.marPercent}%` : '—'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {rec.dateUs && <span>Date: {rec.dateUs} • </span>}
                        {rec.drUs || 'US Protocol'}
                      </div>
                    </td>
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
            className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Log Phase III Yearling Performance</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* General Yearling Weight */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Primary Yearling Weigh-In (365d)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Weigh Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
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
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">General DR (Diet)</label>
                  <input
                    type="text"
                    value={dr}
                    onChange={(e) => setDr(e.target.value)}
                    placeholder="e.g. Y-R2 TMR"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Scrotal Perimeter (SP) + Specific DR */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Scrotal Circumference (SP) &amp; DR-SP
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">SP Date</label>
                  <input
                    type="date"
                    value={dateSp}
                    onChange={(e) => setDateSp(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">SP Circumference (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scrotalPerimeterCm}
                    onChange={(e) => setScrotalPerimeterCm(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">DR-SP (Dietary Regime)</label>
                  <input
                    type="text"
                    value={drSp}
                    onChange={(e) => setDrSp(e.target.value)}
                    placeholder="Specific feeding regime"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Abattoir Conformation (AC) + Specific DR */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Abattoir Conformation (AC) &amp; DR-AC
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">AC Date</label>
                  <input
                    type="date"
                    value={dateAc}
                    onChange={(e) => setDateAc(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">AC Conformation Score</label>
                  <input
                    type="text"
                    value={acScore}
                    onChange={(e) => setAcScore(e.target.value)}
                    placeholder="e.g. E / U+ / Muscle score"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">DR-AC (Dietary Regime)</label>
                  <input
                    type="text"
                    value={drAc}
                    onChange={(e) => setDrAc(e.target.value)}
                    placeholder="Specific feeding regime"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Carcass Ultrasound (REA, SFT, MAR) + Specific DR */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Ultrasound Carcass Metrics &amp; DR-US
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Scan Date</label>
                  <input
                    type="date"
                    value={dateUs}
                    onChange={(e) => setDateUs(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">REA (cm²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={reaCm2}
                    onChange={(e) => setReaCm2(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">SFT (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sftMm}
                    onChange={(e) => setSftMm(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">MAR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={marPercent}
                    onChange={(e) => setMarPercent(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">DR-US (Diet)</label>
                  <input
                    type="text"
                    value={drUs}
                    onChange={(e) => setDrUs(e.target.value)}
                    placeholder="Dietary regime"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Observations &amp; Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Genetics test correlation, mature score notes..."
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

      {/* Yearling Phase III Visual Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        stageFilter="YEARLING"
        title="Yearling Phase III Visual Evidence & Conformation"
        description="365-day yearling weight verification, scrotal measurement scan, pelvic conformation, and frame development."
        galleryPath={`/bovine/animals/breeding-stock/${animal.id}/media`}
      />
    </div>
  );
}
