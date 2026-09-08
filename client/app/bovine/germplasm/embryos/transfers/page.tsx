'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Package,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Calendar,
  Activity,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { CLGrade, ETMethod, ETPregnancyOutcome } from '@/lib/bovine-types';

export default function EmbryoTransfersPage() {
  const { embryoTransfers, embryos, addEmbryoTransfer, updateEmbryoTransfer, addAuditEvent } = useBreeding();
  const { animals, session } = useBovine();

  const recipients = animals.filter((a) => a.sex === 'FEMALE');
  const availableEmbryos = embryos.filter((e) => e.status === 'AVAILABLE' || e.state === 'FROZEN' || e.state === 'FRESH');

  const [modalOpen, setModalOpen] = useState(false);
  const [embryoId, setEmbryoId] = useState(availableEmbryos[0]?.id || embryos[0]?.id || '');
  const [recipientAnimalId, setRecipientAnimalId] = useState(recipients[0]?.id || '');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().slice(0, 10));
  const [synchronizationProtocol, setSynchronizationProtocol] = useState('7-day CIDR + PGF2a Synch');
  const [clGrade, setClGrade] = useState<CLGrade>('GRADE_1_GOOD');
  const [uterineHorn, setUterineHorn] = useState<'IPSILATERAL_RIGHT' | 'IPSILATERAL_LEFT'>('IPSILATERAL_RIGHT');

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const emb = embryos.find((e) => e.id === embryoId);
    const rec = animals.find((a) => a.id === recipientAnimalId);
    if (!emb || !rec) return;

    const transferId = addEmbryoTransfer({
      embryoId: emb.id,
      embryoCode: emb.code,
      recipientAnimalId: rec.id,
      recipientPrimaryIdentifier: rec.primaryIdentifier || rec.internalId,
      recipientName: rec.name,
      transferDate,
      method: 'NON_SURGICAL_CERVICAL',
      clGrade,
      synchronizationProtocol,
      uterineHorn,
      technicianId: session.userId,
      technicianName: session.name,
      pregnancyOutcome: 'PENDING',
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'PERFORM_EMBRYO_TRANSFER',
      entityType: 'EmbryoTransfer',
      entityId: transferId,
      entityDisplay: `${emb.code} -> ${rec.name}`,
      reason: `Performed non-surgical ET transfer into recipient ${rec.primaryIdentifier}.`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    setModalOpen(false);
  };

  const handleUpdateOutcome = (transferId: string, outcome: ETPregnancyOutcome) => {
    updateEmbryoTransfer(transferId, {
      pregnancyOutcome: outcome,
      pregnancyCheckDate: new Date().toISOString().slice(0, 10),
    });
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
            <Link href="/bovine/germplasm/embryos" className="hover:text-stone-800">
              Embryos
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Transfers</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Embryo Transfer Procedures</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Record recipient synchronization, Corpus Luteum (CL) palpation scores, uterine horn placement, and pregnancy confirmation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Transfer Event</span>
        </button>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Transfer Date</th>
              <th className="p-3.5">Embryo</th>
              <th className="p-3.5">Recipient Dam</th>
              <th className="p-3.5">Synch Protocol</th>
              <th className="p-3.5">CL Quality</th>
              <th className="p-3.5">Horn Placement</th>
              <th className="p-3.5">Pregnancy Outcome</th>
              <th className="p-3.5 text-right">Technician</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {embryoTransfers.map((et) => (
              <tr key={et.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-medium text-stone-900">{et.transferDate}</td>
                <td className="p-3.5 font-mono font-bold text-emerald-950">{et.embryoCode}</td>

                <td className="p-3.5">
                  <div className="font-bold text-stone-900">{et.recipientName}</div>
                  <div className="text-[11px] font-mono text-stone-500">{et.recipientPrimaryIdentifier}</div>
                </td>

                <td className="p-3.5 text-stone-700 font-medium">{et.synchronizationProtocol}</td>

                <td className="p-3.5">
                  <span className="font-semibold text-stone-800">
                    {et.clGrade ? et.clGrade.replace(/_/g, ' ') : 'Grade 1 Good'}
                  </span>
                </td>

                <td className="p-3.5 text-stone-600 font-mono">
                  {et.uterineHorn ? et.uterineHorn.replace(/_/g, ' ') : 'IPSILATERAL RIGHT'}
                </td>

                <td className="p-3.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        et.pregnancyOutcome === 'CONFIRMED_PREGNANT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : et.pregnancyOutcome === 'OPEN'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {(et.pregnancyOutcome || et.outcomeStatus || 'PENDING').replace(/_/g, ' ')}
                    </span>

                    {et.pregnancyOutcome === 'PENDING' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleUpdateOutcome(et.id, 'CONFIRMED_PREGNANT')}
                          title="Confirm Pregnant"
                          className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 rounded border border-emerald-300 font-bold hover:bg-emerald-100"
                        >
                          + Preg
                        </button>
                        <button
                          onClick={() => handleUpdateOutcome(et.id, 'OPEN')}
                          title="Mark Open"
                          className="px-1.5 py-0.5 text-[10px] bg-stone-100 text-stone-700 rounded border border-stone-300 font-bold hover:bg-stone-200"
                        >
                          Open
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-3.5 text-right font-medium text-stone-500">
                  {et.technicianName}
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
            <h3 className="text-base font-bold text-stone-900">Record Embryo Transfer Procedure</h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Donor Embryo *</label>
                <select
                  value={embryoId}
                  onChange={(e) => setEmbryoId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white font-mono"
                >
                  {embryos.map((emb) => (
                    <option key={emb.id} value={emb.id}>
                      {emb.code} &bull; {emb.donorDamName} &times; {emb.sireName} ({emb.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Recipient Female *</label>
                <select
                  value={recipientAnimalId}
                  onChange={(e) => setRecipientAnimalId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  {recipients.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.primaryIdentifier || r.internalId}) - {r.breed}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Transfer Date</label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Corpus Luteum (CL)</label>
                  <select
                    value={clGrade}
                    onChange={(e) => setClGrade(e.target.value as CLGrade)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="GRADE_1_GOOD">Grade 1: Good (&gt; 20mm, Cavitary/Firm)</option>
                    <option value="GRADE_2_MODERATE">Grade 2: Moderate (15-20mm)</option>
                    <option value="GRADE_3_POOR">Grade 3: Poor (&lt; 15mm)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Synchronization</label>
                  <input
                    type="text"
                    value={synchronizationProtocol}
                    onChange={(e) => setSynchronizationProtocol(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Horn Placement</label>
                  <select
                    value={uterineHorn}
                    onChange={(e) => setUterineHorn(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="IPSILATERAL_RIGHT">Ipsilateral Right Horn</option>
                    <option value="IPSILATERAL_LEFT">Ipsilateral Left Horn</option>
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
                  Confirm Transfer Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
