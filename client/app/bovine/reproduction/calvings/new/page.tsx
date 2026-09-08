'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Heart,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Check,
  Award,
  AlertCircle,
  ShieldCheck,
  Scale,
  Users,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { CalvingEase, BirthOutcome, Sex } from '@/lib/bovine-types';

function CalvingNewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cowIdParam = searchParams.get('cowId');
  const sireIdParam = searchParams.get('sireId');

  const { animals, farms, herds, pregnancies, addCalvingEvent } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');
  const maleAnimals = animals.filter((a) => a.sex === 'MALE');

  // Selected dam and linked pregnancy
  const [damId, setDamId] = useState(cowIdParam || femaleAnimals[0]?.id || '');
  const activePregnancy = pregnancies.find((p) => p.damId === damId && p.status === 'CONFIRMED');

  const selectedDam = animals.find((a) => a.id === damId);

  // Calving event state
  const [calvingDate, setCalvingDate] = useState(new Date().toISOString().split('T')[0]);
  const [calvingTime, setCalvingTime] = useState('06:30');
  const [farmId, setFarmId] = useState(selectedDam?.farmId || farms[0]?.id || '');
  const [difficulty, setDifficulty] = useState<CalvingEase>('NORMAL');
  const [assistanceDetails, setAssistanceDetails] = useState('');
  const [deliveryType, setDeliveryType] = useState('Vaginal Spontaneous');
  const [maternalBehaviorScore, setMaternalBehaviorScore] = useState(5);
  const [colostrumQuality, setColostrumQuality] = useState('EXCELLENT');
  const [recordedByName, setRecordedByName] = useState('Senior Herdsman');
  const [notes, setNotes] = useState('');

  // Sire info
  const [sireId, setSireId] = useState(sireIdParam || '');
  const [sirePlaceholder, setSirePlaceholder] = useState('SAV Raindance 6848');

  // Offspring state (can support multiple calves e.g. twins)
  const [offspring, setOffspring] = useState<
    Array<{
      name: string;
      tagNumber: string;
      sex: Sex;
      birthOutcome: BirthOutcome;
      birthWeightKg: number;
      coatColor: string;
      calfType: string;
      neonatalNotes: string;
    }>
  >([
    {
      name: `Calf of ${selectedDam?.name || 'Dam'}`,
      tagNumber: `CALF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sex: 'BULL',
      birthOutcome: 'LIVE',
      birthWeightKg: 38.5,
      coatColor: selectedDam?.coatColor || 'Solid Black',
      calfType: 'Commercial Farm Stock',
      neonatalNotes: 'Vigorous suckling reflex observed within 45 mins. 3.5L maternal colostrum consumed.',
    },
  ]);

  const handleDamChange = (newDamId: string) => {
    setDamId(newDamId);
    const d = animals.find((a) => a.id === newDamId);
    if (d) {
      setFarmId(d.farmId);
      setOffspring((prev) =>
        prev.map((o) => ({
          ...o,
          name: `Calf of ${d.name}`,
          coatColor: d.coatColor || 'Solid Black',
        }))
      );
    }
  };

  const addTwinCalf = () => {
    setOffspring([
      ...offspring,
      {
        name: `Twin 2 of ${selectedDam?.name || 'Dam'}`,
        tagNumber: `CALF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        sex: 'HEIFER',
        birthOutcome: 'LIVE',
        birthWeightKg: 35.0,
        coatColor: selectedDam?.coatColor || 'Solid Black',
        calfType: 'Commercial Farm Stock',
        neonatalNotes: 'Twin birth - vigorous and nursing promptly.',
      },
    ]);
  };

  const removeOffspring = (idx: number) => {
    if (offspring.length > 1) {
      setOffspring(offspring.filter((_, i) => i !== idx));
    }
  };

  const updateCalf = (idx: number, updates: Partial<(typeof offspring)[0]>) => {
    const updated = [...offspring];
    updated[idx] = { ...updated[idx], ...updates };
    setOffspring(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCalvingEvent({
      event: {
        damId,
        pregnancyId: activePregnancy?.id,
        farmId,
        calvingDate,
        calvingTime,
        difficulty,
        assistanceDetails: assistanceDetails || undefined,
        deliveryType,
        totalBorn: offspring.length,
        bornAlive: offspring.filter((o) => o.birthOutcome === 'LIVE').length,
        bornDead: offspring.filter((o) => o.birthOutcome !== 'LIVE').length,
        maternalBehaviorScore,
        colostrumQuality: colostrumQuality as any,
        colostrumDeliveredHours: 1.5,
        recordedByName,
        notes: notes || undefined,
      },
      offspring: offspring.map((o, idx) => ({
        birthOrder: idx + 1,
        birthOutcome: o.birthOutcome,
        birthWeightKg: o.birthWeightKg,
        sex: o.sex,
        name: o.name,
        tagNumber: o.tagNumber,
        coatColor: o.coatColor,
        neonatalNotes: o.neonatalNotes,
      })),
    });

    router.push('/bovine/reproduction/calvings');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <Link href="/bovine/reproduction/calvings" className="hover:text-emerald-800">
          Calvings
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">New Calving Registration</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Birth Event &amp; Newborn Registry
          </span>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Register Calving &amp; Newborn Offspring
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Recording birth immediately generates canonical animal records for offspring, links dam and sire parentage, and transitions maternity states.
          </p>
        </div>

        <button
          type="button"
          onClick={addTwinCalf}
          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Add Twin Calf</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Dam & Pregnancy Linking */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-700" />
            <span>1. Dam (Mother) &amp; Gestation Context</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Calving Dam (Cow) *
              </label>
              <select
                value={damId}
                onChange={(e) => handleDamChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              >
                {femaleAnimals.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.primaryIdentifier || f.internalId}) • {f.breed || 'Angus'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Calving Date *
              </label>
              <input
                type="date"
                value={calvingDate}
                onChange={(e) => setCalvingDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Calving Time
              </label>
              <input
                type="time"
                value={calvingTime}
                onChange={(e) => setCalvingTime(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Birth Facility / Farm
              </label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sire / Service Bull (Father)
              </label>
              <input
                type="text"
                value={sirePlaceholder}
                onChange={(e) => setSirePlaceholder(e.target.value)}
                placeholder="e.g. SAV Raindance 6848"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Linked Gestation / Pregnancy
              </label>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                {activePregnancy ? (
                  <span className="text-emerald-800 font-semibold">
                    Confirmed Active Pregnancy #{activePregnancy.id}
                  </span>
                ) : (
                  <span className="text-stone-400">Natural / Unlinked Service</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Calving Delivery Details */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>2. Delivery Dynamics &amp; Maternal Vigor</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Calving Ease / Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              >
                <option value="NORMAL">Score 1 - Normal / Unassisted</option>
                <option value="EASY">Score 2 - Easy (Hand assistance)</option>
                <option value="ASSISTED">Score 3 - Assisted (Mechanical pull)</option>
                <option value="DIFFICULT_VET">Score 4 - Difficult / Vet Required</option>
                <option value="SURGICAL_CAESAREAN">Score 5 - Surgical Caesarean Section</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Type
              </label>
              <input
                type="text"
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Maternal Behavior (1-5)
              </label>
              <select
                value={maternalBehaviorScore}
                onChange={(e) => setMaternalBehaviorScore(parseInt(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              >
                <option value={5}>5 - Attentive &amp; Protective</option>
                <option value={4}>4 - Normal Maternal Care</option>
                <option value={3}>3 - Passive</option>
                <option value={2}>2 - Disinterested</option>
                <option value={1}>1 - Aggressive to Calf</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Colostrum Quality (Brix)
              </label>
              <select
                value={colostrumQuality}
                onChange={(e) => setColostrumQuality(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="EXCELLENT">Excellent (&gt;22% Brix / &gt;50 g/L IgG)</option>
                <option value="GOOD">Good (18-22% Brix)</option>
                <option value="FAIR">Fair (15-18% Brix)</option>
                <option value="POOR">Poor (&lt;15% Brix - Replaced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Obstetrical Notes / Assistance Details
            </label>
            <input
              type="text"
              value={assistanceDetails}
              onChange={(e) => setAssistanceDetails(e.target.value)}
              placeholder="e.g. Anterior presentation, slight assistance given for front legs"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>
        </div>

        {/* Section 3: Newborn Offspring Entry (Multi-Calf Support) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>3. Newborn Calf Registry ({offspring.length} {offspring.length === 1 ? 'Calf' : 'Calves'})</span>
            </h2>
          </div>

          {offspring.map((calf, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm text-stone-900">
                    Offspring #{idx + 1} ({calf.sex})
                  </span>
                </div>

                {offspring.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOffspring(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Remove calf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calf Name / Registry Alias *
                  </label>
                  <input
                    type="text"
                    value={calf.name}
                    onChange={(e) => updateCalf(idx, { name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ear Tag / Animal ID *
                  </label>
                  <input
                    type="text"
                    value={calf.tagNumber}
                    onChange={(e) => updateCalf(idx, { tagNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sex *
                  </label>
                  <select
                    value={calf.sex}
                    onChange={(e) => updateCalf(idx, { sex: e.target.value as Sex })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  >
                    <option value="BULL">Bull (Male)</option>
                    <option value="HEIFER">Heifer (Female)</option>
                    <option value="STEER">Steer (Castrated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Birth Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={calf.birthWeightKg}
                    onChange={(e) => updateCalf(idx, { birthWeightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Coat Color
                  </label>
                  <input
                    type="text"
                    value={calf.coatColor}
                    onChange={(e) => updateCalf(idx, { coatColor: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Birth Outcome
                  </label>
                  <select
                    value={calf.birthOutcome}
                    onChange={(e) => updateCalf(idx, { birthOutcome: e.target.value as BirthOutcome })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  >
                    <option value="LIVE">Live Birth</option>
                    <option value="STILLBORN">Stillborn</option>
                    <option value="DIED_NEONATAL">Died Neonatal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Classification / Purpose
                  </label>
                  <select
                    value={calf.calfType}
                    onChange={(e) => updateCalf(idx, { calfType: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="Commercial Farm Stock">Commercial Farm Stock</option>
                    <option value="Purebred Breeding Candidate">Purebred Breeding Candidate</option>
                    <option value="Embryo Transfer Progeny">Embryo Transfer Progeny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Neonatal Observations
                  </label>
                  <input
                    type="text"
                    value={calf.neonatalNotes}
                    onChange={(e) => updateCalf(idx, { neonatalNotes: e.target.value })}
                    placeholder="Vigor, suckling response..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <Link
            href="/bovine/reproduction/calvings"
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Complete Calving &amp; Register Calf</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewCalvingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading calving wizard...</div>}>
      <CalvingNewForm />
    </Suspense>
  );
}
