'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Scale,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  Droplets,
  Clock,
  History,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function BreedingStockMaternalPerformancePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, maternalRecords, addMaternalRecord } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const records = maternalRecords.filter((r) => r.animalId === animalId);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState('65.0');
  const [waterIntake, setWaterIntake] = useState('NORMAL');
  const [waterIntakeLpd, setWaterIntakeLpd] = useState('16');
  const [feedingSchedule, setFeedingSchedule] = useState('3x daily dam nursing + fortified starter');
  const [foodPreference, setFoodPreference] = useState('Fresh dam milk, steamed rolled barley');
  const [dietType, setDietType] = useState('Colostrum & High-Protein Starter Pellets (22% CP)');
  const [notes, setNotes] = useState('');
  const [healthFollowUp, setHealthFollowUp] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Breeding stock record not found.</div>;
  }

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addMaternalRecord({
      animalId: animal.id,
      date,
      weightKg: parseFloat(weightKg) || 0,
      waterIntake,
      waterIntakeLpd: parseFloat(waterIntakeLpd) || undefined,
      feedingSchedule,
      foodPreference,
      dietType,
      notes: notes || undefined,
      healthFollowUp: healthFollowUp || undefined,
      technician: 'Senior Herdsman',
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
        <span className="font-semibold text-stone-900">Maternal / Phase I</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" />
              Breeding Candidate Evaluation
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">Phase I Protocol</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-amber-600" />
            Maternal / Phase I Growth &amp; Nursing Ledger
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Track neonatal calf growth trajectory, dam maternal nursing behavior, intake transition, and maternal weaning fitness.
          </p>
        </div>

        <button
          id="btn-add-maternal-rec"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Maternal Measurement</span>
        </button>
      </div>

      {/* Observations Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <span>Recorded Phase I Entries ({records.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Water Intake</th>
                <th className="py-3 px-4">Feeding Schedule</th>
                <th className="py-3 px-4">Diet Type &amp; Preference</th>
                <th className="py-3 px-4">Technician / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No Phase I maternal measurements recorded for {animal.name}.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                      {rec.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold font-mono text-amber-900 text-sm">{rec.weightKg} kg</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{rec.waterIntake}</div>
                      {rec.waterIntakeLpd && (
                        <div className="text-[10px] text-stone-500">{rec.waterIntakeLpd} L/day</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-xs">{rec.feedingSchedule}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{rec.dietType}</div>
                      <div className="text-[10px] text-stone-500">{rec.foodPreference}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-700 italic max-w-xs">&ldquo;{rec.notes || 'Routine check'}&rdquo;</div>
                      {rec.technician && (
                        <div className="text-[10px] text-stone-500 mt-0.5">By {rec.technician}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleAddMeasurement}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-amber-600" />
                <span>Log Phase I Maternal Observation</span>
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">Observation Date</label>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Water Intake Level</label>
                <select
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="NORMAL">Normal Hydration</option>
                  <option value="HIGH">High Intake</option>
                  <option value="LOW">Low / Depressed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Estimated Intake (L/day)</label>
                <input
                  type="number"
                  value={waterIntakeLpd}
                  onChange={(e) => setWaterIntakeLpd(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Feeding Schedule</label>
              <input
                type="text"
                value={feedingSchedule}
                onChange={(e) => setFeedingSchedule(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Diet Type</label>
                <input
                  type="text"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Food Preference</label>
                <input
                  type="text"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical Observations &amp; Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Alert behavior, vigor, suckling response..."
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

      {/* Maternal Phase I Visual Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        stageFilter="MATERNAL"
        title="Maternal Phase I Visual Evidence & Nursing Records"
        description="Nursing observations, calf vigor photos, creep feeding intake evidence, and growth tracking."
        galleryPath={`/bovine/animals/breeding-stock/${animal.id}/media`}
      />
    </div>
  );
}
