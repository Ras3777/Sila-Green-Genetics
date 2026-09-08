'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  QrCode,
  Edit,
  Save,
  Check,
} from 'lucide-react';
import { IdentifierType } from '@/lib/bovine-types';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

export default function AnimalIdentityPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, identifiers, addIdentifier, removeIdentifier, setPrimaryIdentifier } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const animalIdentifiers = identifiers.filter((i) => i.animalId === animalId);

  // New identifier form
  const [newType, setNewType] = useState<IdentifierType>('RFID_EID');
  const [newValue, setNewValue] = useState('');
  const [newIssuer, setNewIssuer] = useState('National Livestock Registry');

  if (!animal) return null;

  const handleAddId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    addIdentifier({
      animalId: animal.id,
      type: newType,
      value: newValue.trim(),
      issuer: newIssuer.trim(),
      country: 'United States',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      isPrimary: animalIdentifiers.length === 0,
    });

    setNewValue('');
  };

  return (
    <div className="space-y-6">
      {/* Identity Profile Specs */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <Tag className="w-4 h-4 text-emerald-800" />
          <span>Biological & Physical Identity Record</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Internal ID</span>
            <div className="font-mono font-bold text-stone-900 mt-0.5">{animal.internalId}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Registration No</span>
            <div className="font-mono font-bold text-stone-900 mt-0.5">{animal.registrationNumber || 'Pending'}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Biological Sex</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.sex}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Date of Birth</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.birthDate}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Birth Weight</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.birthWeightKg || 42} kg</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Birth Type</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.birthType}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Horn Status</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.hornStatus}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold text-[10px]">Coat Color</span>
            <div className="font-bold text-stone-900 mt-0.5">{animal.coatColor || 'Standard'}</div>
          </div>
        </div>
      </div>

      {/* Identifiers (Ear tags, RFID, Tattoos) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Physical & Electronic Identifiers</h2>
            <p className="text-xs text-stone-500">Ear tags, ISO 11784/11785 RFID transponders, DGR and official herd tattoos</p>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {animalIdentifiers.map((idObj) => (
            <div key={idObj.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded-lg bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  {idObj.type.replace(/_/g, ' ')}
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm">{idObj.value}</span>
                {idObj.isPrimary && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                    Primary Identifier
                  </span>
                )}
                <span className="text-stone-400 hidden sm:inline">• Issuer: {idObj.issuer || 'Standard'}</span>
              </div>

              <div className="flex items-center space-x-2">
                {!idObj.isPrimary && (
                  <button
                    onClick={() => setPrimaryIdentifier(idObj.id)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
                  >
                    Make Primary
                  </button>
                )}
                <button
                  onClick={() => removeIdentifier(idObj.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                  title="Delete identifier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Identifier Form */}
        <form onSubmit={handleAddId} className="pt-4 border-t border-stone-100 flex flex-wrap gap-2 text-xs">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as IdentifierType)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-stone-800"
          >
            <option value="EAR_TAG">Ear Tag</option>
            <option value="RFID_EID">RFID / EID</option>
            <option value="DGR">DGR Number</option>
            <option value="TATTOO">Tattoo</option>
            <option value="BRAND">Brand</option>
            <option value="NATIONAL_LIVESTOCK_ID">National ID</option>
            <option value="REGISTRY_NUMBER">Registry Number</option>
            <option value="INTERNAL_ID">Internal ID</option>
          </select>

          <input
            type="text"
            required
            placeholder="Tag / Electronic value..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 min-w-[200px] bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
          />

          <input
            type="text"
            placeholder="Issuing authority / registrar..."
            value={newIssuer}
            onChange={(e) => setNewIssuer(e.target.value)}
            className="w-48 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Attach ID
          </button>
        </form>
      </div>

      {/* Biometric & Ear Tag Photographic Evidence */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        categoryFilter={['IDENTIFICATION', 'CONFORMATION']}
        title="Biometric Identification & Tag Photographic Evidence"
        description="Official ear tag close-ups, RFID placement, muzzle biometric scans, and brand marks."
        galleryPath={`/bovine/animals/${animal.id}/media`}
      />
    </div>
  );
}
