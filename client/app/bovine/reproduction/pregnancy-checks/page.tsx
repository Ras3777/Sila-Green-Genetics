'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  CheckCircle2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  X,
  Calendar,
  AlertTriangle,
  Clock,
  Heart,
  Baby,
} from 'lucide-react';
import { PregnancyResult } from '@/lib/bovine-types';

export default function BovinePregnancyChecksPage() {
  const {
    session,
    farms,
    animals,
    pregnancyChecks,
    breedingEvents,
    addPregnancyCheck,
    confirmPregnancy,
  } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formAnimalId, setFormAnimalId] = useState('');
  const [formCheckDate, setFormCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMethod, setFormMethod] = useState<'ULTRASOUND' | 'PALPATION' | 'BLOOD_PAG'>('ULTRASOUND');
  const [formResult, setFormResult] = useState<PregnancyResult>('CONFIRMED_PREGNANT');
  const [formDaysGestation, setFormDaysGestation] = useState(35);
  const [formFetalSex, setFormFetalSex] = useState<'UNKNOWN' | 'MALE' | 'FEMALE'>('UNKNOWN');
  const [formIsTwins, setFormIsTwins] = useState(false);
  const [formNotes, setFormNotes] = useState('');

  const filteredChecks = pregnancyChecks.filter((c) => {
    const anim = animals.find((a) => a.id === c.animalId);
    if (session.activeFarmId !== 'ALL' && anim?.farmId !== session.activeFarmId) return false;
    if (resultFilter !== 'ALL' && c.result !== resultFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAnim = anim?.name.toLowerCase().includes(q) || anim?.primaryIdentifier?.toLowerCase().includes(q);
      const matchVet = c.veterinarianName?.toLowerCase().includes(q);
      return matchAnim || matchVet;
    }
    return true;
  });

  const handleCreateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnimalId) return;

    addPregnancyCheck({
      animalId: formAnimalId,
      checkDate: formCheckDate,
      method: formMethod,
      result: formResult,
      veterinarianName: session.name,
      estimatedDaysGestation: formResult === 'CONFIRMED_PREGNANT' ? Number(formDaysGestation) : undefined,
      fetalSex: formFetalSex,
      isTwins: formIsTwins,
      notes: formNotes,
    });

    // If confirmed pregnant, auto-create active Pregnancy record in store
    if (formResult === 'CONFIRMED_PREGNANT') {
      const checkDateObj = new Date(formCheckDate);
      const conceptionDateObj = new Date(checkDateObj.getTime() - Number(formDaysGestation) * 86400000);
      const expCalvingDateObj = new Date(conceptionDateObj.getTime() + 283 * 86400000);

      confirmPregnancy(
        formAnimalId,
        conceptionDateObj.toISOString().split('T')[0],
        expCalvingDateObj.toISOString().split('T')[0]
      );
    }

    setIsModalOpen(false);
    setFormAnimalId('');
    setFormNotes('');
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
            <span className="font-semibold text-stone-900">Pregnancy Checks</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Pregnancy Diagnosis Worklist</h1>
          <p className="text-xs text-stone-500 mt-1">
            Ultrasound imaging, transrectal palpation, and PAG blood pregnancy test records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Pregnancy Check
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dam or veterinarian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>

        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800 w-full md:w-auto"
        >
          <option value="ALL">All Diagnoses</option>
          <option value="CONFIRMED_PREGNANT">Confirmed Pregnant</option>
          <option value="OPEN">Open (Negative)</option>
          <option value="RECHECK">Recheck Required</option>
          <option value="QUESTIONABLE">Questionable</option>
        </select>
      </div>

      {/* Checks Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Dam / Animal</th>
                <th className="py-3.5 px-4">Diagnosis Result</th>
                <th className="py-3.5 px-4">Diagnostic Method</th>
                <th className="py-3.5 px-4">Estimated Gestation</th>
                <th className="py-3.5 px-4">Fetal Sex & Details</th>
                <th className="py-3.5 px-4">Check Date</th>
                <th className="py-3.5 px-4">Examiner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredChecks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No pregnancy diagnosis records found.
                  </td>
                </tr>
              ) : (
                filteredChecks.map((c) => {
                  const anim = animals.find((a) => a.id === c.animalId);
                  const isPregnant = c.result === 'CONFIRMED_PREGNANT';

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {anim ? (
                          <Link
                            href={`/bovine/animals/${anim.id}/reproduction`}
                            className="font-bold text-stone-900 hover:text-emerald-800"
                          >
                            {anim.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-stone-900">Unknown</span>
                        )}
                        <div className="font-mono text-[11px] text-stone-400">
                          {anim?.primaryIdentifier || anim?.internalId}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isPregnant
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.result === 'OPEN'
                              ? 'bg-stone-100 text-stone-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPregnant ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Pregnant
                            </>
                          ) : (
                            c.result.replace(/_/g, ' ')
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-stone-700">
                        {c.method.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-800">
                        {c.estimatedDaysGestation ? `${c.estimatedDaysGestation} days` : '—'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {c.isTwins && (
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">
                              TWINS
                            </span>
                          )}
                          {c.fetalSex && c.fetalSex !== 'UNKNOWN' && (
                            <span className="text-[11px] text-stone-600 font-medium">
                              {c.fetalSex}
                            </span>
                          )}
                          {!c.isTwins && (!c.fetalSex || c.fetalSex === 'UNKNOWN') && (
                            <span className="text-stone-400">—</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {c.checkDate}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {c.veterinarianName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Pregnancy Check */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-stone-900">Record Pregnancy Check</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCheck} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Dam *</label>
                <select
                  required
                  value={formAnimalId}
                  onChange={(e) => setFormAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="">Select dam...</option>
                  {animals
                    .filter((a) => a.sex === 'FEMALE')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.primaryIdentifier || a.internalId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={formCheckDate}
                    onChange={(e) => setFormCheckDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diagnostic Modality</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="ULTRASOUND">Ultrasound Scan</option>
                    <option value="PALPATION">Rectal Palpation</option>
                    <option value="BLOOD_PAG">Blood PAG ELISA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Finding / Outcome</label>
                <select
                  value={formResult}
                  onChange={(e) => setFormResult(e.target.value as PregnancyResult)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="CONFIRMED_PREGNANT">Confirmed Pregnant</option>
                  <option value="OPEN">Open (Non-Pregnant)</option>
                  <option value="RECHECK">Recheck in 14 Days</option>
                  <option value="QUESTIONABLE">Questionable Fluid</option>
                </select>
              </div>

              {formResult === 'CONFIRMED_PREGNANT' && (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Gestation (Days)
                      </label>
                      <input
                        type="number"
                        value={formDaysGestation}
                        onChange={(e) => setFormDaysGestation(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Fetal Sex (If Visible)
                      </label>
                      <select
                        value={formFetalSex}
                        onChange={(e) => setFormFetalSex(e.target.value as any)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                      >
                        <option value="UNKNOWN">Unknown</option>
                        <option value="FEMALE">Female (Heifer)</option>
                        <option value="MALE">Male (Bull)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTwins"
                      checked={formIsTwins}
                      onChange={(e) => setFormIsTwins(e.target.checked)}
                      className="rounded text-emerald-800 focus:ring-emerald-800"
                    />
                    <label htmlFor="isTwins" className="text-xs font-semibold text-stone-800">
                      Twin Vesicles / Fetuses Detected
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Veterinary Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Heartbeat detected, vesicle size consistent with 35d, corpus luteum on right ovary..."
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
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
