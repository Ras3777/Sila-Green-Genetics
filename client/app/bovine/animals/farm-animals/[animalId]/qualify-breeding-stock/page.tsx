'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Dna,
  HeartPulse,
  Scale,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function QualifyBreedingStockPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;
  const router = useRouter();

  const { animals, farms, herds, promoteToBreedingStock } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const [notes, setNotes] = useState('Meets high genetic index threshold, verified 3-generation pedigree, sound conformation.');
  const [confirmed, setConfirmed] = useState(false);

  if (!animal) {
    return <div className="p-8 text-stone-500">Livestock record not found.</div>;
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);

  const handleConfirmPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    promoteToBreedingStock(animal.id, notes);
    router.push(`/bovine/animals/breeding-stock/${animal.id}`);
  };

  const checklistItems = [
    { title: 'Identity & Traceability', desc: 'Primary ear tag, GN number, and active RFID verified in registry.', passed: !!animal.primaryIdentifier },
    { title: 'Parentage & Pedigree Depth', desc: 'Documented Sire and Dam links with registered maternal/paternal lineage.', passed: !!(animal.sireName && animal.damName) },
    { title: 'Breed Composition Purity', desc: `Documented breed composition (${animal.breed || 'Verified'}).`, passed: true },
    { title: 'Physical Soundness & Weight', desc: `Recorded weight (${animal.currentWeightKg || animal.birthWeightKg || 45} kg), BCS >= 3.0, no severe lameness.`, passed: true },
    { title: 'Clinical Health Clearance', desc: 'No open quarantine orders or unresolved clinical emergencies.', passed: animal.operationalStatus !== 'QUARANTINE' },
    { title: 'Program Selection Criteria', desc: 'Qualified for genetic evaluation runs, EBV/EPD predictions, and mate allocation.', passed: true },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
        <Link
          href={`/bovine/animals/farm-animals/${animal.id}`}
          className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>Governance &amp; Selection Layer</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Qualify Farm Animal for Breeding Stock</h1>
        </div>
      </div>

      {/* Animal Context Banner */}
      <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-stone-900">{animal.name}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-300">
                {animal.primaryIdentifier || animal.internalId}
              </span>
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              {animal.sex} • {animal.breed || 'Purebred'} • {farm?.name} ({herd?.name})
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="text-stone-500 font-medium">Target Classification:</div>
          <div className="font-bold text-amber-900 uppercase">BREEDING_STOCK</div>
        </div>
      </div>

      {/* Qualification Review Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Breeding Stock Qualification Audit</span>
        </div>

        <div className="divide-y divide-stone-100">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-stone-900 text-xs">{item.title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.passed
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {item.passed ? 'PASSED' : 'FLAGGED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Form */}
      <form onSubmit={handleConfirmPromotion} className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Auditor / Evaluator Qualification Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-700"
            required
          />
        </div>

        <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700"
          />
          <span className="font-medium">
            I certify this livestock meets pedigree, health, and morphological criteria to be promoted into the formal breeding stock portfolio without creating a duplicate record.
          </span>
        </label>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
          <Link
            href={`/bovine/animals/farm-animals/${animal.id}`}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!confirmed}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              confirmed
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Confirm Promotion to Breeding Stock
          </button>
        </div>
      </form>
    </div>
  );
}
