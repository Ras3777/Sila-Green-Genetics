'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Baby,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Heart,
  Tag,
} from 'lucide-react';
import { BirthOutcome, BirthType, CalvingEase, FetalPresentation, Sex } from '@/lib/bovine-types';

export default function BovineCalvingsPage() {
  const searchParams = useSearchParams();
  const initialDamId = searchParams.get('damId') || '';
  const initialPregId = searchParams.get('pregId') || '';

  const {
    session,
    farms,
    animals,
    calvingEvents,
    calvingOffspring,
    pregnancies,
    addCalvingEvent,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(!!initialDamId);

  // Calving Wizard Form State
  const [formDamId, setFormDamId] = useState(initialDamId);
  const [formPregnancyId, setFormPregnancyId] = useState(initialPregId);
  const [formCalvingDate, setFormCalvingDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCalvingEase, setFormCalvingEase] = useState<CalvingEase>('UNASSISTED');
  const [formPresentation, setFormPresentation] = useState<FetalPresentation>('ANTERIOR');
  const [formBirthType, setFormBirthType] = useState<BirthType>('SINGLE');
  const [formNotes, setFormNotes] = useState('');

  // Offspring List
  const [offspringCount, setOffspringCount] = useState(1);
  const [calf1Name, setCalf1Name] = useState('');
  const [calf1Tag, setCalf1Tag] = useState('');
  const [calf1Sex, setCalf1Sex] = useState<Sex>('FEMALE');
  const [calf1Weight, setCalf1Weight] = useState(38);
  const [calf1Outcome, setCalf1Outcome] = useState<BirthOutcome>('LIVE');
  const [calf1Color, setCalf1Color] = useState('');

  // Update dam if param changes
  useEffect(() => {
    if (initialDamId) {
      setFormDamId(initialDamId);
      setFormPregnancyId(initialPregId);
      setIsModalOpen(true);
    }
  }, [initialDamId, initialPregId]);

  const filteredCalvings = calvingEvents.filter((c) => {
    const dam = animals.find((a) => a.id === c.damId);
    if (session.activeFarmId !== 'ALL' && c.farmId !== session.activeFarmId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDam = dam?.name.toLowerCase().includes(q) || dam?.primaryIdentifier?.toLowerCase().includes(q);
      const matchNotes = c.notes?.toLowerCase().includes(q);
      return matchDam || matchNotes;
    }
    return true;
  });

  const handleCreateCalving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDamId) return;

    const dam = animals.find((a) => a.id === formDamId);
    const farmId = dam?.farmId || 'farm-1';

    const offspringEntries = [
      {
        birthOrder: 1,
        birthOutcome: calf1Outcome,
        birthWeightKg: Number(calf1Weight),
        sex: calf1Sex,
        name: calf1Name || `Calf of ${dam?.name || 'Dam'}`,
        tagNumber: calf1Tag,
        coatColor: calf1Color || dam?.coatColor,
        neonatalNotes: 'Vigorous sucking reflex, navel dipped in 7% iodine.',
      },
    ];

    addCalvingEvent({
      event: {
        damId: formDamId,
        pregnancyId: formPregnancyId || undefined,
        farmId,
        calvingDate: formCalvingDate,
        calvingEase: formCalvingEase,
        presentation: formPresentation,
        birthType: formBirthType,
        calfCount: offspringEntries.length,
        notes: formNotes,
      },
      offspring: offspringEntries,
    });

    setIsModalOpen(false);
    setFormDamId('');
    setFormPregnancyId('');
    setCalf1Name('');
    setCalf1Tag('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/reproduction" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Reproduction Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Calvings & Delivery</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Calving Events & Neonatal Register</h1>
          <p className="text-xs text-stone-500 mt-1">
            Delivery outcomes, calving ease scores, and automatic calf registry enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Baby className="w-4 h-4 mr-1.5" />
            Quick Calving Log
          </button>
          <Link
            id="btn-full-newborn-wizard"
            href="/bovine/reproduction/calvings/new"
            className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Full Newborn Wizard
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dam by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Calvings Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Dam / Cow</th>
                <th className="py-3.5 px-4">Calving Date</th>
                <th className="py-3.5 px-4">Ease Score</th>
                <th className="py-3.5 px-4">Presentation</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Offspring Enrolled</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCalvings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No calving delivery records found.
                  </td>
                </tr>
              ) : (
                filteredCalvings.map((c) => {
                  const dam = animals.find((a) => a.id === c.damId);
                  const offspring = calvingOffspring.filter((o) => o.calvingEventId === c.id);

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {dam ? (
                          <Link
                            href={`/bovine/animals/${dam.id}/reproduction`}
                            className="font-bold text-stone-900 hover:text-emerald-800"
                          >
                            {dam.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-stone-900">Unknown</span>
                        )}
                        <div className="font-mono text-[11px] text-stone-400">
                          {dam?.primaryIdentifier || dam?.internalId}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {c.calvingDate}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.calvingEase === 'UNASSISTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.calvingEase === 'EASY_PULL'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {(c.calvingEase || c.ease || 'NORMAL').replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {c.presentation}
                      </td>

                      <td className="py-3 px-4 text-stone-700">
                        {c.birthType}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {offspring.map((off) => {
                            const calfAnim = off.calfAnimalId ? animals.find((a) => a.id === off.calfAnimalId) : null;
                            return (
                              <div key={off.id} className="flex items-center space-x-1.5 text-[11px]">
                                <span
                                  className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                                    off.birthOutcome === 'LIVE'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-stone-100 text-stone-600'
                                  }`}
                                >
                                  {off.birthOutcome}
                                </span>
                                {calfAnim ? (
                                  <Link
                                    href={`/bovine/animals/${calfAnim.id}`}
                                    className="font-semibold text-stone-900 hover:text-emerald-800"
                                  >
                                    {calfAnim.name} ({calfAnim.primaryIdentifier})
                                  </Link>
                                ) : (
                                  <span className="text-stone-500">Calf #{off.birthOrder}</span>
                                )}
                                {off.birthWeightKg && (
                                  <span className="text-stone-400 font-mono">
                                    • {off.birthWeightKg}kg
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {c.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calving Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Baby className="w-5 h-5" />
                <h2 className="text-lg font-bold text-stone-900">Calving Wizard & Calf Registry</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Record maternal labor details and simultaneously generate canonical calf records into the herd registry with full maternal pedigree linkage.
            </p>

            <form onSubmit={handleCreateCalving} className="space-y-4 text-xs">
              {/* Dam Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dam / Mother *</label>
                  <select
                    required
                    value={formDamId}
                    onChange={(e) => {
                      setFormDamId(e.target.value);
                      const matchingPreg = pregnancies.find(
                        (p) => p.damId === e.target.value && p.status === 'CONFIRMED'
                      );
                      if (matchingPreg) {
                        setFormPregnancyId(matchingPreg.id);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="">Select maternal dam...</option>
                    {animals
                      .filter((a) => a.sex === 'FEMALE')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.primaryIdentifier || a.internalId})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Calving Date</label>
                  <input
                    type="date"
                    required
                    value={formCalvingDate}
                    onChange={(e) => setFormCalvingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Delivery Mechanics */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Calving Ease</label>
                  <select
                    value={formCalvingEase}
                    onChange={(e) => setFormCalvingEase(e.target.value as CalvingEase)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="UNASSISTED">1 - Unassisted</option>
                    <option value="EASY_PULL">2 - Easy Pull</option>
                    <option value="HARD_PULL">3 - Hard Mechanical Pull</option>
                    <option value="CESAREAN">4 - Cesarean Section</option>
                    <option value="ABNORMAL_PRESENTATION">5 - Malpresentation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fetal Presentation</label>
                  <select
                    value={formPresentation}
                    onChange={(e) => setFormPresentation(e.target.value as FetalPresentation)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="ANTERIOR">Anterior (Normal)</option>
                    <option value="POSTERIOR">Posterior (Backward)</option>
                    <option value="BREECH">Breech</option>
                    <option value="TRANSVERSE">Transverse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Birth Type</label>
                  <select
                    value={formBirthType}
                    onChange={(e) => setFormBirthType(e.target.value as BirthType)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="SINGLE">Single Calf</option>
                    <option value="TWIN">Twins</option>
                    <option value="TRIPLET">Triplets</option>
                  </select>
                </div>
              </div>

              {/* Offspring Details Box */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-xs flex items-center">
                    <Baby className="w-4 h-4 mr-1 text-emerald-800" />
                    New Calf #1 Registration Data
                  </span>
                  <span className="text-[11px] text-emerald-800 font-medium">Will enroll into registry</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Calf Name / Alias
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Altair Comet ET"
                      value={calf1Name}
                      onChange={(e) => setCalf1Name(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Assigned Ear Tag *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. US-9941300"
                      value={calf1Tag}
                      onChange={(e) => setCalf1Tag(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Sex</label>
                    <select
                      value={calf1Sex}
                      onChange={(e) => setCalf1Sex(e.target.value as Sex)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                    >
                      <option value="FEMALE">Female (Heifer)</option>
                      <option value="MALE">Male (Bull)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={calf1Weight}
                      onChange={(e) => setCalf1Weight(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Outcome</label>
                    <select
                      value={calf1Outcome}
                      onChange={(e) => setCalf1Outcome(e.target.value as BirthOutcome)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                    >
                      <option value="LIVE">Live Calf</option>
                      <option value="STILLBORN">Stillborn</option>
                      <option value="DIED_NEONATAL">Died Neonatal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Labor & Delivery Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dam expelled placenta within 2 hours, colostrum 4L administered via bottle..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-xs"
                >
                  Enroll Calving & Calf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
