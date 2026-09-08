'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Globe,
  Tag,
  Search,
  X,
} from 'lucide-react';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { BreedDefinition } from '@/lib/bovine-types';

export default function BreedsCatalogPage() {
  const { breeds, addBreed } = useGenetics();

  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newPurpose, setNewPurpose] = useState<BreedDefinition['purpose']>('DAIRY');
  const [newStandards, setNewStandards] = useState('');

  const filteredBreeds = breeds.filter((b) => {
    const purpose = b.purpose || (b.isDairy ? 'DAIRY' : b.isBeef ? 'BEEF' : 'DUAL_PURPOSE');
    if (purposeFilter !== 'ALL' && purpose !== purposeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const origin = (b.originCountry || b.origin || '').toLowerCase();
      return b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || origin.includes(q);
    }
    return true;
  });

  const handleCreateBreed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    addBreed({
      code: newCode.toUpperCase(),
      name: newName,
      originCountry: newOrigin || 'Global',
      purpose: newPurpose,
      active: true,
      registryStandards: newStandards || undefined,
    });

    setModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewOrigin('');
    setNewStandards('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Dynamic Breed Registry
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Backend Loaded Standards</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            Bovine Breeds Catalog
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Breeds are maintained dynamically as entity definitions rather than hardcoded client enums.
            Defines official international breed codes, origins, and registration body criteria.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Breed Definition</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap gap-2 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search breeds or origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <select
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium cursor-pointer"
        >
          <option value="ALL">All Purposes</option>
          <option value="DAIRY">Dairy</option>
          <option value="BEEF">Beef</option>
          <option value="DUAL_PURPOSE">Dual Purpose</option>
        </select>
      </div>

      {/* Breeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBreeds.map((breed) => (
          <div
            key={breed.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
          >
            {(() => {
              const purpose = breed.purpose || (breed.isDairy ? 'DAIRY' : breed.isBeef ? 'BEEF' : 'DUAL_PURPOSE');
              const origin = breed.originCountry || breed.origin || 'International';
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                      {breed.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        purpose === 'DAIRY'
                          ? 'bg-blue-100 text-blue-900'
                          : purpose === 'BEEF'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {purpose}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900">{breed.name}</h3>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-stone-400" />
                      <span>Origin: {origin}</span>
                    </div>
                  </div>
                </>
              );
            })()}

            {breed.registryStandards && (
              <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 leading-relaxed">
                {breed.registryStandards}
              </p>
            )}

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active in System
              </span>
              <span className="font-mono">{breed.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BREED MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Add Breed Definition</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBreed} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Breed Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GEL"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Purpose</label>
                  <select
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="DAIRY">Dairy</option>
                    <option value="BEEF">Beef</option>
                    <option value="DUAL_PURPOSE">Dual Purpose</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Breed Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gelbvieh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Germany"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Registry Standards & Criteria</label>
                <textarea
                  rows={2}
                  placeholder="Official herd book registration criteria..."
                  value={newStandards}
                  onChange={(e) => setNewStandards(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Create Breed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
