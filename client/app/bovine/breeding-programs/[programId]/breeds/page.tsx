'use client';

import React, { useState, use } from 'react';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { ProgramHeaderNav } from '../program-nav';
import { GitBranch, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BreedProgramRole } from '@/lib/bovine-types';

export default function ProgramBreedsPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const { programId } = resolvedParams;

  const { breedingPrograms, breedingProgramBreeds, addBreedingProgramBreed, removeBreedingProgramBreed } =
    useBreeding();
  const { breeds } = useGenetics();

  const program = breedingPrograms.find((p) => p.id === programId);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBreedId, setSelectedBreedId] = useState(breeds[0]?.id || '');
  const [role, setRole] = useState<BreedProgramRole>('PRIMARY');
  const [targetPercentage, setTargetPercentage] = useState(100);
  const [notes, setNotes] = useState('');

  if (!program) return <div className="p-8 text-center text-stone-500">Program Not Found</div>;

  const programBreeds = breedingProgramBreeds.filter((b) => b.breedingProgramId === program.id);

  const handleAddBreed = (e: React.FormEvent) => {
    e.preventDefault();
    const found = breeds.find((b) => b.id === selectedBreedId);
    if (!found) return;

    addBreedingProgramBreed({
      breedingProgramId: program.id,
      breedId: found.id,
      breedCode: found.code,
      breedName: found.name,
      role,
      priority: programBreeds.length + 1,
      targetPercentage: Number(targetPercentage) || 0,
      notes,
    });

    setModalOpen(false);
    setNotes('');
  };

  const totalTargetPct = programBreeds.reduce((acc, b) => acc + (b.targetPercentage || 0), 0);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <ProgramHeaderNav program={program} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Breed Scope &amp; Genetic Roles</h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Configure which cattle breeds contribute to this program, their crossing roles, priorities, and target genetic composition percentages.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Breed Contribution</span>
        </button>
      </div>

      {/* Target Composition Status Card */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <GitBranch className="w-5 h-5 text-emerald-800" />
          <div>
            <div className="font-semibold text-stone-900">Aggregate Target Composition Target: {totalTargetPct}%</div>
            <div className="text-[11px] text-stone-500">
              {totalTargetPct === 100
                ? 'Target percentages equal exactly 100% of composite pedigree genome.'
                : 'Warning: Total target percentages do not equal 100%.'}
            </div>
          </div>
        </div>
        <div>
          {totalTargetPct === 100 ? (
            <span className="flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Balanced</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-700 font-semibold bg-amber-100 px-2.5 py-1 rounded-md">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Check Weights</span>
            </span>
          )}
        </div>
      </div>

      {/* Breeds Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Breed Code</th>
              <th className="p-3.5">Breed Name</th>
              <th className="p-3.5">Program Role</th>
              <th className="p-3.5">Target Percentage</th>
              <th className="p-3.5">Operational Notes</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {programBreeds.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50/70">
                <td className="p-3.5 font-bold text-stone-900">#{b.priority}</td>
                <td className="p-3.5 font-mono font-bold text-emerald-900">{b.breedCode}</td>
                <td className="p-3.5 font-semibold text-stone-900">{b.breedName}</td>
                <td className="p-3.5">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      b.role === 'PRIMARY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.role === 'CROSS_SIRE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {b.role}
                  </span>
                </td>
                <td className="p-3.5 font-mono font-bold text-stone-900">{b.targetPercentage || 100}%</td>
                <td className="p-3.5 text-stone-500 text-[11px] max-w-xs truncate">{b.notes || '—'}</td>
                <td className="p-3.5 text-right">
                  <button
                    disabled={programBreeds.length <= 1}
                    onClick={() => removeBreedingProgramBreed(b.id)}
                    className="text-stone-400 hover:text-red-600 disabled:opacity-30 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Add Breed to Program</h3>
            <form onSubmit={handleAddBreed} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Breed *</label>
                <select
                  value={selectedBreedId}
                  onChange={(e) => setSelectedBreedId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  {breeds.map((br) => (
                    <option key={br.id} value={br.id}>
                      {br.name} ({br.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role in Program</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as BreedProgramRole)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="PRIMARY">PRIMARY (Nucleus / Main Line)</option>
                  <option value="SECONDARY">SECONDARY (Support Line)</option>
                  <option value="CROSS_SIRE">CROSS_SIRE (Crossbreeding Infusion)</option>
                  <option value="COMPOSITE_BASE">COMPOSITE_BASE (Base maternal)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Purpose of infusion or composite target..."
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
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
                  Save Breed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
