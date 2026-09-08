'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { OwnershipType } from '@/lib/bovine-types';
import {
  Building2,
  Users,
  CheckCircle2,
  Save,
  Plus,
  Shield,
  Calendar,
  Percent,
  FileText,
  Clock,
  X,
  Layers,
} from 'lucide-react';

export default function AnimalOwnershipPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, farms, herds, organizations, ownerships, addOwnership, updateAnimal } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const [ownerOrgId, setOwnerOrgId] = useState(animal?.ownerOrgId || 'org-apex');
  const [farmId, setFarmId] = useState(animal?.farmId || 'farm-1');
  const [herdId, setHerdId] = useState(animal?.herdId || 'herd-1');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Transfer form state
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerOrgId, setNewOwnerOrgId] = useState(organizations[0]?.id || 'org-apex');
  const [newOwnershipType, setNewOwnershipType] = useState<OwnershipType>('SOLE');
  const [newSharePct, setNewSharePct] = useState<number>(100);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newNotes, setNewNotes] = useState('');

  if (!animal) return null;

  // Filter ownership records for this animal
  const animalOwnerships = ownerships.filter((o) => o.animalId === animal.id);

  // If no explicit records in store, synthesize current owner
  const currentOrg = organizations.find((o) => o.id === animal.ownerOrgId);
  const displayedOwnerships = animalOwnerships.length > 0
    ? animalOwnerships
    : [
        {
          id: 'own-initial',
          animalId: animal.id,
          ownerName: currentOrg ? currentOrg.name : 'Apex Bovine Genetics Consortium',
          ownerOrgId: animal.ownerOrgId,
          ownershipType: 'SOLE' as OwnershipType,
          sharePercentage: 100,
          startDate: animal.createdAt ? animal.createdAt.slice(0, 10) : '2025-01-01',
          isCurrent: true,
          transferNotes: 'Initial registry enrollment as sole proprietary asset.',
        },
      ];

  const handleSavePlacement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnimal(animal.id, {
      ownerOrgId,
      farmId,
      herdId,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    const org = organizations.find((o) => o.id === newOwnerOrgId);
    addOwnership({
      animalId: animal.id,
      ownerName: newOwnerName.trim() || (org ? org.name : 'Proprietary Syndicate'),
      ownerOrgId: newOwnerOrgId,
      ownershipType: newOwnershipType,
      sharePercentage: Number(newSharePct),
      startDate: newStartDate,
      isCurrent: true,
      transferNotes: newNotes.trim() || undefined,
    });

    setNewOwnerName('');
    setNewNotes('');
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Ownership Ledger & Shares */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">Legal Title & Ownership Shares</h2>
          </div>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transfer / Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedOwnerships.map((own) => (
            <div
              key={own.id}
              className={`p-4 rounded-2xl border transition-all ${
                own.isCurrent
                  ? 'bg-stone-50/70 border-emerald-800/30'
                  : 'bg-stone-50/40 border-stone-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        own.isCurrent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {own.isCurrent ? 'Current Legal Title' : 'Previous Holder'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                      {own.ownershipType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{own.ownerName}</h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-bold font-mono text-emerald-800">
                    {own.sharePercentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Equity Share</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>Effective from {new Date(own.startDate).toLocaleDateString()}</span>
                  {own.endDate && <span> to {new Date(own.endDate).toLocaleDateString()}</span>}
                </div>

                {own.transferNotes && (
                  <div className="w-full text-stone-600 italic text-[11px] mt-1">
                    &ldquo;{own.transferNotes}&rdquo;
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Placement & Facility Enrollment */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-800" />
          <span>Physical Facility & Herd Assignment</span>
        </h2>

        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Facility placement updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSavePlacement} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Owner Organization</label>
            <select
              value={ownerOrgId}
              onChange={(e) => setOwnerOrgId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Enrolled Agricultural Station</label>
            <select
              value={farmId}
              onChange={(e) => {
                setFarmId(e.target.value);
                const matchingHerds = herds.filter((h) => h.farmId === e.target.value);
                if (matchingHerds.length > 0) setHerdId(matchingHerds[0].id);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code}) - {f.type}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Production Herd</label>
            <select
              value={herdId}
              onChange={(e) => setHerdId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              {herds
                .filter((h) => h.farmId === farmId)
                .map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.code}) &bull; {h.purpose}
                  </option>
                ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Save Placement Changes
            </button>
          </div>
        </form>
      </div>

      {/* Record Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Record Ownership Share / Transfer</h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOwnership} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Owner Organization
                </label>
                <select
                  value={newOwnerOrgId}
                  onChange={(e) => setNewOwnerOrgId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Owner / Syndicate Entity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Sire Syndicate LLC"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Ownership Structure
                  </label>
                  <select
                    value={newOwnershipType}
                    onChange={(e) => setNewOwnershipType(e.target.value as OwnershipType)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    <option value="SOLE">Sole Proprietorship</option>
                    <option value="CO_OWNER">Co-Ownership</option>
                    <option value="SYNDICATE">Syndicate Share</option>
                    <option value="LEASED">Leased / Operational Rights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Equity Share (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newSharePct}
                    onChange={(e) => setNewSharePct(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Effective Start Date
                </label>
                <input
                  type="date"
                  required
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Transfer Contract & Legal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Contract reference number, bill of sale, breeding rights terms..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  Record Ownership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
