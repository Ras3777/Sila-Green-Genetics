'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
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
  Scale,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function FarmAnimalYearlingPhasePage({
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

  // Weight & Diet
  const [weightKg, setWeightKg] = useState('420.0');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightDietaryRegime, setWeightDietaryRegime] = useState('DR-1 (Finishing / Developer)');

  // Scrotal Perimeter & Diet
  const [sp, setSp] = useState(animal?.sex === 'MALE' ? '34.0' : '');
  const [spDate, setSpDate] = useState(new Date().toISOString().split('T')[0]);
  const [spDietaryRegime, setSpDietaryRegime] = useState('DR-1 (Finishing / Developer)');

  // Abattoir Conformation & Diet
  const [ac, setAc] = useState('Elite Yearling Conformation Score 8.5');
  const [acDate, setAcDate] = useState(new Date().toISOString().split('T')[0]);
  const [acDietaryRegime, setAcDietaryRegime] = useState('DR-1 (Finishing / Developer)');

  // Ultrasound & Diet
  const [ultrasoundDate, setUltrasoundDate] = useState(new Date().toISOString().split('T')[0]);
  const [ultrasoundDietaryRegime, setUltrasoundDietaryRegime] = useState('DR-1 (Finishing / Developer)');
  const [rea, setRea] = useState('78.5');
  const [sft, setSft] = useState('4.6');
  const [mar, setMar] = useState('3.8');

  // Feeding & Management
  const [waterIntake, setWaterIntake] = useState('High (52 L/day)');
  const [feedingSchedule, setFeedingSchedule] = useState('Ad libitum electronic bunk feeder with TMR');
  const [foodPreference, setFoodPreference] = useState('Corn silage, rolled barley, protein blend');
  const [dietType, setDietType] = useState('Yearling Bull & Heifer Developer (14% CP, 1.10 Mcal NEg)');
  const [technician, setTechnician] = useState('Certified Ultrasound Specialist');
  const [notes, setNotes] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Animal record not found.</div>;
  }

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addYearlingRecord({
      animalId: animal.id,
      date,
      weightKg: parseFloat(weightKg) || 0,
      weightDate,
      weightDietaryRegime,
      sp: sp ? parseFloat(sp) : undefined,
      spDate: animal.sex === 'MALE' ? spDate : undefined,
      spDietaryRegime: animal.sex === 'MALE' ? spDietaryRegime : undefined,
      ac,
      acDate,
      acDietaryRegime,
      ultrasoundDate,
      ultrasoundDietaryRegime,
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
        <span className="font-semibold text-stone-900">Yearling / Phase III</span>
      </div>

      {/* Header & Modal Trigger */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Yearling Maturity Evaluation
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Phase III Protocol</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            Yearling / Phase III Performance Ledger
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            365-day certified yearling weights, scrotal perimeter with date-specific dietary regimes, and carcass ultrasound marbling/ribeye scans.
          </p>
        </div>

        <button
          id="btn-add-yearling-obs"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Yearling Evaluation</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <span>Yearling Records ({records.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Evaluation Date</th>
                <th className="py-3 px-4">Yearling Weight &amp; DR</th>
                <th className="py-3 px-4">Scrotal SP &amp; DR</th>
                <th className="py-3 px-4">Abattoir AC &amp; DR</th>
                <th className="py-3 px-4">Ultrasound Scan (REA/SFT/MAR)</th>
                <th className="py-3 px-4">Technician / Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No yearling stage measurements recorded for {animal.name}.
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
                      <div className="text-[10px] text-stone-500 font-mono">
                        Date: {rec.weightDate || rec.date} • {rec.weightDietaryRegime || 'Standard DR'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {rec.sp ? (
                        <div>
                          <div className="font-mono font-bold text-stone-900">{rec.sp} cm</div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            Date: {rec.spDate || rec.date} • {rec.spDietaryRegime || 'Standard DR'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-400">N/A (Female)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">{rec.ac || 'Verified'}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Date: {rec.acDate || rec.date} • {rec.acDietaryRegime || 'Standard DR'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-stone-900">
                        {rec.rea ? `${rec.rea} cm²` : '-'} | {rec.sft ? `${rec.sft} mm` : '-'} | Marb: {rec.mar || '-'}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Date: {rec.ultrasoundDate || rec.date} • {rec.ultrasoundDietaryRegime || 'Standard DR'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rec.qualityStatus}
                      </span>
                      {rec.technician && <div className="text-[10px] text-stone-500 mt-0.5">{rec.technician}</div>}
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
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                <span>Log Yearling / Phase III Evaluation</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Weight Section with Date-Specific DR */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Yearling Weight Measurement</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Weight Date</label>
                  <input
                    type="date"
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Weight Diet Regime (DR)</label>
                  <input
                    type="text"
                    value={weightDietaryRegime}
                    onChange={(e) => setWeightDietaryRegime(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Scrotal Section with Date-Specific DR */}
            {animal.sex === 'MALE' && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-xs text-stone-900">Scrotal Perimeter (SP)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">SP (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sp}
                      onChange={(e) => setSp(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">SP Collection Date</label>
                    <input
                      type="date"
                      value={spDate}
                      onChange={(e) => setSpDate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">SP Dietary Regime</label>
                    <input
                      type="text"
                      value={spDietaryRegime}
                      onChange={(e) => setSpDietaryRegime(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ultrasound Scan with Date-Specific DR */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="font-bold text-xs text-stone-900">Real-Time Ultrasound Carcass Scan</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Scan Date</label>
                  <input
                    type="date"
                    value={ultrasoundDate}
                    onChange={(e) => setUltrasoundDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">US Diet Regime</label>
                  <input
                    type="text"
                    value={ultrasoundDietaryRegime}
                    onChange={(e) => setUltrasoundDietaryRegime(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">REA (cm²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rea}
                    onChange={(e) => setRea(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">SFT (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sft}
                    onChange={(e) => setSft(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-mono text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Marbling (MAR)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mar}
                    onChange={(e) => setMar(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-mono text-stone-900"
                  />
                </div>
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">Technician / Specialist</label>
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
                placeholder="Yearling growth trajectory, BCS, skeletal development notes..."
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
                Save Yearling Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Yearling Phase III Visual Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        stageFilter="YEARLING"
        title="Yearling Phase III Visual Evidence"
        description="365-day yearling weight verification, scrotal measurement scan, pelvic conformation, and frame development."
        galleryPath={`/bovine/animals/farm-animals/${animal.id}/media`}
      />
    </div>
  );
}
