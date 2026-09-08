'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Sparkles,
  Building2,
  Plus,
  Trash2,
} from 'lucide-react';
import { BreedingObjectiveType, BreedingProgramStatus, BreedProgramRole } from '@/lib/bovine-types';

export default function NewBreedingProgramPage() {
  const router = useRouter();
  const { addBreedingProgram, addBreedingProgramBreed, selectionIndexes, organizations, addAuditEvent } =
    useBreeding();
  const { breeds } = useGenetics();
  const { session } = useBovine();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || 'org-1');
  const [objectiveType, setObjectiveType] = useState<BreedingObjectiveType>('ECONOMIC');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [selectionIndexId, setSelectionIndexId] = useState(selectionIndexes[0]?.id || '');
  const [status, setStatus] = useState<BreedingProgramStatus>('ACTIVE');

  // Selected breeds list
  const [selectedBreeds, setSelectedBreeds] = useState<
    { breedId: string; breedCode: string; breedName: string; role: BreedProgramRole; targetPercentage: number }[]
  >([
    {
      breedId: breeds[0]?.id || 'breed-1',
      breedCode: breeds[0]?.code || 'HO',
      breedName: breeds[0]?.name || 'Holstein Friesian',
      role: 'PRIMARY',
      targetPercentage: 100,
    },
  ]);

  const handleAddBreedRow = () => {
    const nextBreed = breeds.find((b) => !selectedBreeds.some((sb) => sb.breedId === b.id)) || breeds[0];
    if (nextBreed) {
      setSelectedBreeds([
        ...selectedBreeds,
        {
          breedId: nextBreed.id,
          breedCode: nextBreed.code,
          breedName: nextBreed.name,
          role: 'CROSS_SIRE',
          targetPercentage: 20,
        },
      ]);
    }
  };

  const handleRemoveBreedRow = (idx: number) => {
    if (selectedBreeds.length > 1) {
      setSelectedBreeds(selectedBreeds.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const org = organizations.find((o) => o.id === organizationId);
    const chosenIndex = selectionIndexes.find((idx) => idx.id === selectionIndexId);

    const programId = addBreedingProgram({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      organizationId,
      organizationName: org?.name || 'National Association',
      status,
      objectiveType,
      objectiveDescription: objectiveDescription.trim(),
      breedScope: selectedBreeds.map((sb) => sb.breedName),
      candidateCount: 0,
      evaluatedCount: 0,
      genomicCount: 0,
      parentageVerifiedCount: 0,
      activePlansCount: 0,
      selectionIndexId,
      selectionIndexCode: chosenIndex?.code || 'CUSTOM',
      phenotypeCompletenessPct: 100,
    });

    // Add breed associations
    selectedBreeds.forEach((sb, index) => {
      addBreedingProgramBreed({
        breedingProgramId: programId,
        breedId: sb.breedId,
        breedCode: sb.breedCode,
        breedName: sb.breedName,
        role: sb.role,
        priority: index + 1,
        targetPercentage: sb.targetPercentage,
      });
    });

    // Add audit event
    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      organizationId,
      organizationName: org?.name,
      action: 'CREATE_BREEDING_PROGRAM',
      entityType: 'BreedingProgram',
      entityId: programId,
      entityDisplay: `${name} (${code})`,
      reason: 'Initialized new population selection objective program.',
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    router.push(`/bovine/breeding-programs/${programId}`);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          href="/bovine/breeding-programs"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Define New Breeding Program</h1>
        <p className="text-sm text-stone-600 mt-1">
          Establish operational scope, selection objective parameters, target breeds, and associated selection index.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Program Identity &amp; Organization
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Program Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. HOL-DAIRY-ADV"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs font-mono border border-stone-300 rounded-lg p-2.5 uppercase focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hosting Organization *
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Program Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. National High-Solids Dairy Selection Program"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Operational Description &amp; Background
              </label>
              <textarea
                rows={3}
                placeholder="Describe the population context, target market, and selection criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Objective & Index Selection */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            2. Selection Objective &amp; Economic Model
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Objective Archetype
              </label>
              <select
                value={objectiveType}
                onChange={(e) => setObjectiveType(e.target.value as any)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="ECONOMIC">Economic Net Merit (Lifetime Profitability)</option>
                <option value="TERMINAL">Terminal Line (Carcass &amp; Gain Efficiency)</option>
                <option value="MATERNAL">Maternal Line (Stayability &amp; Daughter Fertility)</option>
                <option value="BALANCED">Balanced Multi-Trait (Production &amp; Conformation)</option>
                <option value="HEALTH_EFFICIENCY">Health &amp; Feed Resource Efficiency</option>
                <option value="SPECIALTY">Specialty Pedigree &amp; Exhibition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Linked Selection Index *
              </label>
              <select
                value={selectionIndexId}
                onChange={(e) => setSelectionIndexId(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {selectionIndexes.map((idx) => (
                  <option key={idx.id} value={idx.id}>
                    {idx.name} ({idx.code} - {idx.activeVersion})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Objective Specification &amp; Penalty Constraints
              </label>
              <textarea
                rows={2}
                placeholder="Specify penalty weights on inbreeding, birth weight ceilings, or calving difficulty caps..."
                value={objectiveDescription}
                onChange={(e) => setObjectiveDescription(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Breed Composition Scope */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              3. Breed Composition &amp; Line Roles
            </h2>
            <button
              type="button"
              onClick={handleAddBreedRow}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Breed Line</span>
            </button>
          </div>

          <div className="space-y-3">
            {selectedBreeds.map((row, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs"
              >
                <div className="flex-1 w-full">
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                    Breed
                  </label>
                  <select
                    value={row.breedId}
                    onChange={(e) => {
                      const found = breeds.find((b) => b.id === e.target.value);
                      if (found) {
                        const updated = [...selectedBreeds];
                        updated[index] = {
                          ...updated[index],
                          breedId: found.id,
                          breedCode: found.code,
                          breedName: found.name,
                        };
                        setSelectedBreeds(updated);
                      }
                    }}
                    className="w-full p-2 bg-white border border-stone-300 rounded-md"
                  >
                    {breeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-44">
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                    Role in Program
                  </label>
                  <select
                    value={row.role}
                    onChange={(e) => {
                      const updated = [...selectedBreeds];
                      updated[index].role = e.target.value as BreedProgramRole;
                      setSelectedBreeds(updated);
                    }}
                    className="w-full p-2 bg-white border border-stone-300 rounded-md"
                  >
                    <option value="PRIMARY">PRIMARY (Main Line)</option>
                    <option value="SECONDARY">SECONDARY</option>
                    <option value="CROSS_SIRE">CROSS_SIRE (Infusion)</option>
                    <option value="COMPOSITE_BASE">COMPOSITE_BASE</option>
                  </select>
                </div>

                <div className="w-full sm:w-28">
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                    Target %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={row.targetPercentage}
                    onChange={(e) => {
                      const updated = [...selectedBreeds];
                      updated[index].targetPercentage = Number(e.target.value);
                      setSelectedBreeds(updated);
                    }}
                    className="w-full p-2 bg-white border border-stone-300 rounded-md"
                  />
                </div>

                <button
                  type="button"
                  disabled={selectedBreeds.length <= 1}
                  onClick={() => handleRemoveBreedRow(index)}
                  className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href="/bovine/breeding-programs"
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            Create Breeding Program
          </button>
        </div>
      </form>
    </div>
  );
}
