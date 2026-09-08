'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  Info,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function FarmAnimalWeaningPhasePage({
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
  const [weightKg, setWeightKg] = useState('210.0');
  const [cbc, setCbc] = useState('Normal (PCV 35%, Platelets 420k)');
  const [dr, setDr] = useState('DR-A (Post-Weaning TMR)');
  const [sp, setSp] = useState(animal?.sex === 'MALE' ? '24.0' : '');
  const [drSp, setDrSp] = useState('DR-A');
  const [ac, setAc] = useState('Grade 1 (Superior Frame & Muscling)');
  const [drAc, setDrAc] = useState('DR-A');
  const [drUs, setDrUs] = useState('DR-A');
  const [rea, setRea] = useState('54.0');
  const [sft, setSft] = useState('3.5');
  const [mar, setMar] = useState('3.4');
  const [waterIntake, setWaterIntake] = useState('High (35 L/day)');
  const [feedingSchedule, setFeedingSchedule] = useState('Twice daily TMR feeding with dry grass hay buffer');
  const [foodPreference, setFoodPreference] = useState('TMR, alfalfa haylage, rolled corn');
  const [dietType, setDietType] = useState('Grower TMR (16% CP, 0.95 Mcal/kg NEg)');
  const [technician, setTechnician] = useState('Lead Ultrasound Tech');
  const [notes, setNotes] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Animal record not found.</div>;
  }

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addWeaningRecord({
      animalId: animal.id,
      date,
      weightKg: parseFloat(weightKg) || 0,
      cbc: cbc || undefined,
      dr,
      sp: sp ? parseFloat(sp) : undefined,
      drSp: drSp || undefined,
      drAc: drAc || undefined,
      drUs: drUs || undefined,
      ac: ac || undefined,
      rea: rea ? parseFloat(rea) : undefined,
      sft: sft ? parseFloat(sft) : undefined,
      mar: mar ? parseFloat(mar) : undefined,
      waterIntake,
      feedingSchedule,
      foodPreference,
      dietType,
      technician,
      qualityStatus: 'VERIFIED',
      notes: notes || undefined,
    });

    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals/farm-animals" className="hover:text-emerald-800">
          Farm Animals
        </Link>
        <span>/</span>
        <Link href={`/bovine/animals/farm-animals/${animal.id}`} className="hover:text-emerald-800 font-semibold">
          {animal.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Weaning / Phase II</span>
      </div>

      {/* Header & Modal Trigger */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Weaning Transition Stage
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Phase II Protocol</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            Weaning / Phase II Performance Ledger
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            205-day standardized weaning weight, dietary regime (DR), scrotal perimeter (SP), abattoir conformation (AC), and real-time carcass ultrasound scan (REA, SFT, MAR).
          </p>
        </div>

        <button
          id="btn-add-weaning-obs"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Weaning Evaluation</span>
        </button>
      </div>

      {/* Metric Terminology Glossary Helper */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
        <div>
          <span className="font-bold text-stone-900">SP:</span>{' '}
          <span className="text-stone-600">Scrotal Perimeter (cm)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900">REA:</span>{' '}
          <span className="text-stone-600">Ribeye Area (cm²)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900">SFT:</span>{' '}
          <span className="text-stone-600">Subcutaneous Fat (mm)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900">MAR:</span>{' '}
          <span className="text-stone-600">Marbling Score (1-5)</span>
        </div>
        <div>
          <span className="font-bold text-stone-900">DR:</span>{' '}
          <span className="text-stone-600">Dietary Regime</span>
        </div>
        <div>
          <span className="font-bold text-stone-900">AC:</span>{' '}
          <span className="text-stone-600">Abattoir Conformation</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <span>Phase II Observations ({records.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Weaning Weight</th>
                <th className="py-3 px-4">DR (Diet Regime)</th>
                <th className="py-3 px-4">SP (Scrotal)</th>
                <th className="py-3 px-4">Ultrasound (REA / SFT / MAR)</th>
                <th className="py-3 px-4">Abattoir Conf.</th>
                <th className="py-3 px-4">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No weaning stage measurements recorded for {animal.name}.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                      {rec.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold font-mono text-emerald-800 text-sm">{rec.weightKg} kg</div>
                      {rec.cbc && <div className="text-[10px] text-stone-500">{rec.cbc}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-xs">
                      <div className="font-semibold text-stone-900">{rec.dr}</div>
                      <div className="text-[10px] text-stone-500">Diet: {rec.dietType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.sp ? (
                        <div className="font-mono font-bold text-stone-900">{rec.sp} cm</div>
                      ) : (
                        <span className="text-stone-400">N/A (Female)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-stone-800">
                        {rec.rea ? `${rec.rea} cm²` : '-'} | {rec.sft ? `${rec.sft} mm` : '-'} | Marb: {rec.mar || '-'}
                      </div>
                      <div className="text-[10px] text-stone-500">Ultrasound Regime: {rec.drUs || rec.dr}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-xs">{rec.ac || 'Standard'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rec.qualityStatus}
                      </span>
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
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>Log Weaning / Phase II Evaluation</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Weaning Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Scale Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">CBC / Lab Parameter</label>
                <input
                  type="text"
                  value={cbc}
                  onChange={(e) => setCbc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dietary Regime (DR)</label>
                <input
                  type="text"
                  value={dr}
                  onChange={(e) => setDr(e.target.value)}
                  placeholder="e.g. DR-A (Grower TMR)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Scrotal Perimeter (SP cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sp}
                  onChange={(e) => setSp(e.target.value)}
                  placeholder={animal.sex === 'MALE' ? 'e.g. 24.5' : 'N/A (Female)'}
                  disabled={animal.sex === 'FEMALE'}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Ultrasound REA (cm²)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rea}
                  onChange={(e) => setRea(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Fat Thickness SFT (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sft}
                  onChange={(e) => setSft(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Marbling Score (MAR)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mar}
                  onChange={(e) => setMar(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Abattoir Conformation (AC)</label>
                <input
                  type="text"
                  value={ac}
                  onChange={(e) => setAc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ultrasound Technician</label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Field Observations / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Weaning ease, fence-line behavior, musculoskeletal balance remarks..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Save Weaning Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weaning Phase II Visual Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        stageFilter="WEANING"
        title="Weaning Phase II Visual Evidence"
        description="205-day weaning weight verification, lateral conformation profile, and transition condition."
        galleryPath={`/bovine/animals/farm-animals/${animal.id}/media`}
      />
    </div>
  );
}
