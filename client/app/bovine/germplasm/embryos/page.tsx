'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Package,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  Dna,
  Calendar,
} from 'lucide-react';
import { EmbryoStage, EmbryoGrade, EmbryoPreservationMethod } from '@/lib/bovine-types';

export default function EmbryosInventoryPage() {
  const { embryos, addEmbryo, addAuditEvent } = useBreeding();
  const { animals, session } = useBovine();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const females = animals.filter((a) => a.sex === 'FEMALE');
  const sires = animals.filter((a) => a.sex === 'MALE');

  // Form states
  const [donorDamId, setDonorDamId] = useState(females[0]?.id || '');
  const [sireId, setSireId] = useState(sires[0]?.id || '');
  const [stage, setStage] = useState<EmbryoStage>('STAGE_4_MORULA');
  const [grade, setGrade] = useState<EmbryoGrade>('GRADE_1_EXCELLENT');
  const [method, setMethod] = useState<EmbryoPreservationMethod>('FROZEN');
  const [predictedSex, setPredictedSex] = useState<'FEMALE' | 'MALE' | 'UNKNOWN'>('FEMALE');

  const filtered = embryos.filter((e) => {
    if (stageFilter !== 'ALL' && e.stage !== stageFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.code.toLowerCase().includes(q) ||
        (e.donorDamName?.toLowerCase().includes(q) ?? false) ||
        (e.sireName?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const handleCreateEmbryo = (e: React.FormEvent) => {
    e.preventDefault();
    const dam = animals.find((a) => a.id === donorDamId);
    const sire = animals.find((a) => a.id === sireId);
    if (!dam || !sire) return;

    const code = `EMB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const embryoId = addEmbryo({
      code,
      donorDamAnimalId: dam.id,
      donorDamPrimaryIdentifier: dam.primaryIdentifier || dam.internalId,
      donorDamName: dam.name,
      sireAnimalId: sire.id,
      sirePrimaryIdentifier: sire.primaryIdentifier || sire.internalId,
      sireName: sire.name,
      productionDate: new Date().toISOString().slice(0, 10),
      productionType: 'IN_VITRO_IVF',
      stage,
      grade,
      preservationMethod: method,
      predictedSex,
      storageLocation: {
        tank: 'LN2-EMB',
        canister: '2',
        cane: '4',
        goblet: 'Blue-Top',
      },
      status: 'AVAILABLE',
      isGenotyped: true,
      notes: 'Biopsy performed for genomic ranking & sexing.',
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'CREATE_EMBRYO',
      entityType: 'Embryo',
      entityId: embryoId,
      entityDisplay: `${code} (${dam.name} x ${sire.name})`,
      reason: `Registered ${stage} ${grade} embryo in LN2 cryo storage.`,
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
            <span className="text-stone-900 font-semibold">Embryos</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Embryo Cryo-Repository</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage IVF and in-vivo flush embryos, IETS morphology stages &amp; grades, genomic biopsies, and goblet locations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/germplasm/embryos/transfers"
            className="inline-flex items-center space-x-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Transfer Procedures &rarr;</span>
          </Link>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Embryo</span>
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search embryo code, dam, sire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <span className="font-medium">IETS Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5"
          >
            <option value="ALL">All Stages</option>
            <option value="STAGE_4_MORULA">Stage 4: Morula</option>
            <option value="STAGE_5_EARLY_BLASTOCYST">Stage 5: Early Blastocyst</option>
            <option value="STAGE_6_BLASTOCYST">Stage 6: Blastocyst</option>
            <option value="STAGE_7_EXPANDED_BLASTOCYST">Stage 7: Expanded Blastocyst</option>
          </select>
        </div>
      </div>

      {/* Embryos Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Embryo Code</th>
              <th className="p-3.5">Donor Dam &times; Sire</th>
              <th className="p-3.5">IETS Stage &amp; Grade</th>
              <th className="p-3.5">Sexing / Biopsy</th>
              <th className="p-3.5">Cryo Tank Location</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((emb) => (
              <tr key={emb.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-mono font-bold text-emerald-950">{emb.code}</td>

                <td className="p-3.5">
                  <div className="font-bold text-stone-900">
                    {emb.donorDamName}{' '}
                    <span className="font-normal text-stone-400">&times;</span> {emb.sireName}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500">
                    {emb.donorDamPrimaryIdentifier} &times; {emb.sirePrimaryIdentifier}
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="font-semibold text-stone-900">{emb.stage?.replace(/_/g, ' ') || 'N/A'}</div>
                  <div className="text-[11px] text-emerald-800 font-bold">
                    {emb.grade?.replace(/_/g, ' ') || 'N/A'}
                  </div>
                </td>

                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      emb.predictedSex === 'FEMALE'
                        ? 'bg-rose-100 text-rose-800'
                        : emb.predictedSex === 'MALE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {emb.predictedSex || 'UNSEXED'}
                  </span>
                  {emb.isGenotyped && (
                    <span className="ml-1.5 text-[10px] text-emerald-700 font-bold">Genotyped</span>
                  )}
                </td>

                <td className="p-3.5 font-mono text-stone-700">
                  {emb.storageLocation ? (
                    <span>
                      {emb.storageLocation.tank || emb.storageTank} / Can {emb.storageLocation.canister || emb.storageCanister} / Cane{' '}
                      {emb.storageLocation.cane || emb.storageCane}
                    </span>
                  ) : emb.storageTank ? (
                    <span>
                      {emb.storageTank} / Can {emb.storageCanister || '—'} / Cane {emb.storageCane || '—'}
                    </span>
                  ) : (
                    'Fresh'
                  )}
                </td>

                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded uppercase ${
                      (emb.status || emb.state) === 'AVAILABLE' || (emb.status || emb.state) === 'FROZEN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {emb.status || emb.state || 'AVAILABLE'}
                  </span>
                </td>

                <td className="p-3.5 text-right">
                  <Link
                    href={`/bovine/germplasm/embryos/${emb.id}`}
                    className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
            <h3 className="text-base font-bold text-stone-900">Register New Embryo</h3>
            <form onSubmit={handleCreateEmbryo} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Donor Dam *</label>
                  <select
                    value={donorDamId}
                    onChange={(e) => setDonorDamId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    {females.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.primaryIdentifier || f.internalId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sire *</label>
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

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">IETS Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as EmbryoStage)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="STAGE_4_MORULA">Stage 4: Morula</option>
                    <option value="STAGE_5_EARLY_BLASTOCYST">Stage 5: Early Blastocyst</option>
                    <option value="STAGE_6_BLASTOCYST">Stage 6: Blastocyst</option>
                    <option value="STAGE_7_EXPANDED_BLASTOCYST">Stage 7: Expanded Blastocyst</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">IETS Morph. Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as EmbryoGrade)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="GRADE_1_EXCELLENT">Grade 1: Excellent / Good</option>
                    <option value="GRADE_2_FAIR">Grade 2: Fair</option>
                    <option value="GRADE_3_POOR">Grade 3: Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preservation</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as EmbryoPreservationMethod)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="FROZEN">Frozen (LN2)</option>
                    <option value="FRESH">Fresh Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sex Biopsy</label>
                  <select
                    value={predictedSex}
                    onChange={(e) => setPredictedSex(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="FEMALE">Female (Verified)</option>
                    <option value="MALE">Male (Verified)</option>
                    <option value="UNKNOWN">Unsexed</option>
                  </select>
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
                  Save Embryo Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
