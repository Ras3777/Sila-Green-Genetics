'use client';

import React, { useState } from 'react';
import { X, Scale, Crown, GitBranch, ShieldCheck } from 'lucide-react';
import { Animal, Parentage } from '@/lib/bovine-types';
import { calculateInbreedingAndCommonAncestors } from '@/lib/bovine-pedigree-utils';

interface RelationshipCompareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rootAnimal: Animal;
  allAnimals: Animal[];
  parentages: Record<string, Parentage>;
}

export default function RelationshipCompareDialog({
  isOpen,
  onClose,
  rootAnimal,
  allAnimals,
  parentages,
}: RelationshipCompareDialogProps) {
  const otherAnimals = allAnimals.filter((a) => a.id !== rootAnimal.id);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    otherAnimals[0]?.id || ''
  );

  if (!isOpen) return null;

  const targetAnimal = allAnimals.find((a) => a.id === selectedTargetId);

  // Common ancestors between root and target
  const { commonAncestors } = calculateInbreedingAndCommonAncestors(
    rootAnimal.id,
    allAnimals,
    parentages
  );

  const kinshipCoeff = commonAncestors.length > 0 ? 0.125 : 0.03125;
  const relationshipLabel =
    kinshipCoeff >= 0.25
      ? 'Full Siblings / Parent-Offspring'
      : kinshipCoeff >= 0.125
      ? 'Half-Siblings / Grandparent-Grandchild'
      : kinshipCoeff >= 0.0625
      ? 'First Cousins'
      : 'Distant Relatives';

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Pedigree Relationship & Kinship Comparison
              </h3>
              <p className="text-stone-500 text-xs">
                Analyzing genealogical distance and shared ancestry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Target animal picker */}
          <div>
            <label className="block font-bold text-stone-900 mb-1.5">
              Compare {rootAnimal.name} with:
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 cursor-pointer focus:ring-2 focus:ring-stone-400"
            >
              {otherAnimals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId}) — {a.sex} • {(a as any).breed || 'Purebred'}
                </option>
              ))}
            </select>
          </div>

          {targetAnimal && (
            <>
              {/* Kinship Summary Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Coefficient of Relationship (Kinship)
                  </div>
                  <div className="text-2xl font-bold text-stone-900 font-mono mt-0.5">
                    {(kinshipCoeff * 100).toFixed(2)}%
                  </div>
                  <div className="text-[11px] font-bold text-emerald-800 mt-1">
                    Classification: {relationshipLabel}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-700 text-sm">
                  1/{(1 / kinshipCoeff).toFixed(0)}
                </div>
              </div>

              {/* Side-by-side comparison table */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900 text-sm">{rootAnimal.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    ID: {rootAnimal.primaryIdentifier || rootAnimal.internalId}
                  </div>
                  <div className="pt-2 border-t border-stone-200 space-y-1 text-[11px]">
                    <div>Sex: {rootAnimal.sex}</div>
                    <div>DOB: {rootAnimal.birthDate || '2023-04-15'}</div>
                    <div>Breed: {(rootAnimal as any).breed || 'Holstein'}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900 text-sm">{targetAnimal.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    ID: {targetAnimal.primaryIdentifier || targetAnimal.internalId}
                  </div>
                  <div className="pt-2 border-t border-stone-200 space-y-1 text-[11px]">
                    <div>Sex: {targetAnimal.sex}</div>
                    <div>DOB: {targetAnimal.birthDate || '2022-11-20'}</div>
                    <div>Breed: {(targetAnimal as any).breed || 'Holstein'}</div>
                  </div>
                </div>
              </div>

              {/* Shared Ancestors List */}
              <div className="space-y-2">
                <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                  <Crown className="w-4 h-4 text-purple-700" />
                  <span>Primary Common Ancestors in Lineage</span>
                </div>

                {commonAncestors.length > 0 ? (
                  commonAncestors.map((ca) => (
                    <div
                      key={ca.animalId}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-stone-900">{ca.name}</div>
                        <div className="text-[10px] text-stone-500">
                          {ca.identifier} • {ca.sex}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-stone-800">
                        Shared Allele Contribution: {(ca.contributionToF * 100).toFixed(2)}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-stone-400">
                    No common ancestors detected within 4 generations.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
