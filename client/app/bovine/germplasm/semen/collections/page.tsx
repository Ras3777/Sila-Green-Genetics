'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  TestTubes,
  ArrowLeft,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
} from 'lucide-react';
import { SemenCollectionMethod } from '@/lib/bovine-types';

export default function SemenCollectionsPage() {
  const { semenCollections, addSemenCollection, addAuditEvent } = useBreeding();
  const { animals, session } = useBovine();

  const sires = animals.filter((a) => a.sex === 'MALE');
  const [modalOpen, setModalOpen] = useState(false);

  const [sireId, setSireId] = useState(sires[0]?.id || '');
  const [method, setMethod] = useState<SemenCollectionMethod>('ARTIFICIAL_VAGINA');
  const [volumeMl, setVolumeMl] = useState(6.5);
  const [concentrationMillionPerMl, setConcentrationMillionPerMl] = useState(1200);
  const [progressiveMotilityPct, setProgressiveMotilityPct] = useState(80);
  const [normalMorphologyPct, setNormalMorphologyPct] = useState(85);
  const [dosesYielded, setDosesYielded] = useState(240);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const sire = animals.find((a) => a.id === sireId);
    if (!sire) return;

    const collectionId = addSemenCollection({
      sireAnimalId: sire.id,
      sirePrimaryIdentifier: sire.primaryIdentifier || sire.internalId,
      sireName: sire.name,
      collectionDate: new Date().toISOString().slice(0, 10),
      method,
      volumeMl: Number(volumeMl),
      concentrationMillionPerMl: Number(concentrationMillionPerMl),
      progressiveMotilityPct: Number(progressiveMotilityPct),
      normalMorphologyPct: Number(normalMorphologyPct),
      dosesYielded: Number(dosesYielded),
      technicianId: session.userId,
      technicianName: session.name,
      qcApproved: true,
      notes: 'Standard lab collection protocol verified.',
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'RECORD_SEMEN_COLLECTION',
      entityType: 'SemenCollection',
      entityId: collectionId,
      entityDisplay: `${sire.name} (${sire.primaryIdentifier})`,
      reason: `Collected ${dosesYielded} doses with ${progressiveMotilityPct}% motility.`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    setModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/germplasm" className="hover:text-stone-800">
              Germplasm
            </Link>
            <span>/</span>
            <Link href="/bovine/germplasm/semen" className="hover:text-stone-800">
              Semen
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Collections</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Sire Semen Collection Records</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Log artificial collection procedures, volume assays, progressive motility tests, and straw processing yields.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Collection Event</span>
        </button>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Sire</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Volume (ml)</th>
              <th className="p-3.5">Concentration</th>
              <th className="p-3.5">Prog. Motility</th>
              <th className="p-3.5">Morphology</th>
              <th className="p-3.5">Yield (Straws)</th>
              <th className="p-3.5">Lab QC</th>
              <th className="p-3.5 text-right">Technician</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {semenCollections.map((col) => (
              <tr key={col.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-medium text-stone-900">{col.collectionDate}</td>
                <td className="p-3.5">
                  <div className="font-bold text-emerald-950">{col.sireName}</div>
                  <div className="text-[11px] font-mono text-stone-500">{col.sirePrimaryIdentifier}</div>
                </td>
                <td className="p-3.5 font-semibold text-stone-800">{col.method}</td>
                <td className="p-3.5 font-mono">{col.volumeMl} ml</td>
                <td className="p-3.5 font-mono">{col.concentrationMillionPerMl} M/ml</td>
                <td className="p-3.5 font-mono font-bold text-stone-900">{col.progressiveMotilityPct}%</td>
                <td className="p-3.5 font-mono font-bold text-stone-900">{col.normalMorphologyPct}%</td>
                <td className="p-3.5 font-mono font-bold text-emerald-800 text-sm">
                  {col.dosesYielded}
                </td>
                <td className="p-3.5">
                  {col.qcApproved ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold text-[11px]">Pending Review</span>
                  )}
                </td>
                <td className="p-3.5 text-right text-stone-500 font-medium">
                  {col.technicianName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Record Semen Collection</h3>
            <form onSubmit={handleCreateCollection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Donor Sire *</label>
                <select
                  value={sireId}
                  onChange={(e) => setSireId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  {sires.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.primaryIdentifier || s.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Collection Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as SemenCollectionMethod)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="ARTIFICIAL_VAGINA">Artificial Vagina (AV)</option>
                    <option value="ELECTROEJACULATION">Electroejaculation (EE)</option>
                    <option value="MASSAGE">Transrectal Ampullary Massage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Volume (ml)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Concentration (M/ml)
                  </label>
                  <input
                    type="number"
                    value={concentrationMillionPerMl}
                    onChange={(e) => setConcentrationMillionPerMl(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prog. Motility (%)</label>
                  <input
                    type="number"
                    value={progressiveMotilityPct}
                    onChange={(e) => setProgressiveMotilityPct(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Normal Morphology (%)</label>
                  <input
                    type="number"
                    value={normalMorphologyPct}
                    onChange={(e) => setNormalMorphologyPct(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Straws Yielded</label>
                  <input
                    type="number"
                    value={dosesYielded}
                    onChange={(e) => setDosesYielded(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg"
                >
                  Save Collection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
