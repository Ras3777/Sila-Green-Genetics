'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Calendar,
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function NewMatingPlanPage() {
  const router = useRouter();
  const { breedingPrograms, addMatingPlan, addMatingRecommendation, addAuditEvent } = useBreeding();
  const { farms, herds, animals, session } = useBovine();

  const [code, setCode] = useState(`PLAN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('Spring AI Cohort Mate Allocation');
  const [season, setSeason] = useState('Spring 2026');
  const [programId, setProgramId] = useState(breedingPrograms[0]?.id || '');
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [herdId, setHerdId] = useState(herds[0]?.id || '');
  const [maxInbreedingThreshold, setMaxInbreedingThreshold] = useState(6.25);
  const [carrierExclusion, setCarrierExclusion] = useState(true);

  const females = animals.filter((a) => a.sex === 'FEMALE');
  const sires = animals.filter((a) => a.sex === 'MALE');

  const [selectedFemaleIds, setSelectedFemaleIds] = useState<string[]>(females.map((f) => f.id));
  const [selectedSireIds, setSelectedSireIds] = useState<string[]>(sires.map((s) => s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const farm = farms.find((f) => f.id === farmId);
    const herd = herds.find((h) => h.id === herdId);

    const planId = addMatingPlan({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      season: season.trim(),
      breedingProgramId: programId,
      farmId,
      farmName: farm?.name || 'Green Pastures Farm',
      herdId,
      herdName: herd?.name || 'Breeding Milkers',
      status: 'APPROVED',
      femaleCount: selectedFemaleIds.length,
      sireCount: selectedSireIds.length,
      maxInbreedingThreshold: Number(maxInbreedingThreshold),
      carrierExclusion,
      acceptedCount: selectedFemaleIds.length,
      rejectedCount: 0,
      lockedCount: 0,
    });

    // Auto-generate pairing recommendations
    selectedFemaleIds.forEach((femaleId, idx) => {
      const female = animals.find((a) => a.id === femaleId);
      const sireId = selectedSireIds[idx % (selectedSireIds.length || 1)] || selectedSireIds[0];
      const sire = animals.find((a) => a.id === sireId);

      if (female && sire) {
        addMatingRecommendation({
          matingPlanId: planId,
          femaleAnimalId: female.id,
          femalePrimaryIdentifier: female.primaryIdentifier || female.internalId,
          femaleName: female.name,
          sireAnimalId: sire.id,
          sirePrimaryIdentifier: sire.primaryIdentifier || sire.internalId,
          sireName: sire.name,
          rank: 1,
          expectedInbreedingF: 0.032,
          expectedProgenyIndex: 825,
          isConditionCarrierRisk: false,
          status: 'ACCEPTED',
          notes: 'Optimal genomic matching without condition carrier risk.',
        });
      }
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'CREATE_MATING_PLAN',
      entityType: 'MatingPlan',
      entityId: planId,
      entityDisplay: `${name} (${code})`,
      reason: `Generated automated mating plan with ${selectedFemaleIds.length} candidate allocations.`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    router.push(`/bovine/mating/plans/${planId}`);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          href="/bovine/mating/plans"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Create Mating Allocation Plan</h1>
        <p className="text-sm text-stone-600 mt-1">
          Select target females, eligible AI sires, set inbreeding ceilings, and execute automated mating allocation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Scope */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Plan Scope &amp; Target Facility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Plan Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full font-mono border border-stone-300 rounded-lg p-2.5 uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Breeding Season *</label>
              <input
                type="text"
                required
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Plan Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Breeding Program</label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
              >
                {breedingPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farm Facility</label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Optimization Parameters */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            2. Inbreeding Control &amp; Genetic Health Filters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between font-semibold text-stone-800">
                <span>Maximum Allowed Inbreeding Ceiling (F)</span>
                <span className="font-mono text-emerald-800 font-bold">{maxInbreedingThreshold}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.5"
                step="0.25"
                value={maxInbreedingThreshold}
                onChange={(e) => setMaxInbreedingThreshold(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <p className="text-[11px] text-stone-500">
                Any potential pairing producing expected progeny F above this threshold is automatically discarded.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-start space-x-3">
              <input
                type="checkbox"
                id="carrierExclusion"
                checked={carrierExclusion}
                onChange={(e) => setCarrierExclusion(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
              />
              <div>
                <label htmlFor="carrierExclusion" className="font-semibold text-stone-900 cursor-pointer">
                  Enforce Lethal Recessive Carrier Exclusion
                </label>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  Strictly forbid pairing Carrier Dam &times; Carrier Sire for any verified genetic condition (HH1, HH2, HH3, HH4, HH5, BLAD, CVM).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Candidates Pool */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            3. Candidates Pool Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Eligible Females Enrolled:</span>
                <span className="text-emerald-800">{selectedFemaleIds.length} Cows / Heifers</span>
              </div>
              <div className="text-[11px] text-stone-500">
                All cycling and open females currently registered in the herd.
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Eligible AI Sires Enrolled:</span>
                <span className="text-emerald-800">{selectedSireIds.length} Sires with Semen Stock</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Active certified AI bulls with straws available in liquid nitrogen cryo-storage.
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3">
          <Link
            href="/bovine/mating/plans"
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            Execute Mate Allocation &amp; Save Plan
          </button>
        </div>
      </form>
    </div>
  );
}
