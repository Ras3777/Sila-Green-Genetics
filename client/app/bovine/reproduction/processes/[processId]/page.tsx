'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Calendar,
  Sparkles,
  ChevronRight,
  TestTubes,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ArrowRight,
  Plus,
  Scale,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { ReproductiveProcessCheck, ReproductiveProcessStage } from '@/lib/bovine-types';

export default function ReproductiveProcessDetailPage({
  params,
}: {
  params: Promise<{ processId: string }>;
}) {
  const resolvedParams = use(params);
  const processId = resolvedParams.processId;

  const { animals, reproductiveProcesses, updateReproductiveProcess } = useBovine();
  const process = reproductiveProcesses.find((p) => p.id === processId);

  // Quick Check Modal State
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [checkType, setCheckType] = useState<ReproductiveProcessCheck['checkType']>('CHECK_30');
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkResult, setCheckResult] = useState<ReproductiveProcessCheck['result']>('PREGNANT');
  const [checkNotes, setCheckNotes] = useState('');
  const [checkTech, setCheckTech] = useState('Dr. Helena Rocha');

  if (!process) {
    return (
      <div className="p-8 text-center text-stone-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
        <h2 className="text-lg font-bold text-stone-900">Process Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">The requested reproductive process does not exist.</p>
        <Link
          href="/bovine/reproduction/processes"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Processes Directory
        </Link>
      </div>
    );
  }

  const cow = animals.find((a) => a.id === (process.cowAnimalId || process.cowId));
  const donor = (process.donorCowAnimalId || process.donorCowId) ? animals.find((a) => a.id === (process.donorCowAnimalId || process.donorCowId)) : null;
  const bull = (process.bullAnimalId || process.bullId) ? animals.find((a) => a.id === (process.bullAnimalId || process.bullId)) : null;

  const handleAddCheck = (e: React.FormEvent) => {
    e.preventDefault();

    const newCheck: any = {
      id: `chk-${Date.now()}`,
      checkType,
      stageLabel: checkType === 'CHECK_30' ? 'Day 30 Ultrasound' : 'Day 60 Recheck',
      date: checkDate,
      checkDate,
      result: checkResult,
      notes: checkNotes || undefined,
      technician: checkTech || undefined,
    };

    let nextStage: any = process.currentStage || process.status || 'INSEMINATED';
    if (checkResult === 'PREGNANT') {
      if (checkType === 'CHECK_30') nextStage = 'PREGNANT_CONFIRMED';
      if (checkType === 'CHECK_60') nextStage = 'CHECK_60_CONFIRMED';
    } else if (checkResult === 'OPEN') {
      nextStage = 'OPEN';
    }

    updateReproductiveProcess(process.id, {
      currentStage: nextStage,
      status: nextStage,
      checks: [...(process.checks || process.pregnancyChecks || []), newCheck],
      pregnancyChecks: [...(process.pregnancyChecks || process.checks || []), newCheck],
    });

    setIsCheckModalOpen(false);
    setCheckNotes('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <Link href="/bovine/reproduction/processes" className="hover:text-emerald-800">
          Processes
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">
          {cow ? cow.name : 'Unknown Cow'} ({process.procedureType})
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  process.procedureType === 'EMBRYO_TRANSFER'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}
              >
                {process.procedureType === 'EMBRYO_TRANSFER' ? 'Embryo Transfer (ET)' : 'Artificial Insemination (AI)'}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-mono text-stone-500">Service: {process.procedureDate}</span>
            </div>

            <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-700" />
              <span>{cow ? cow.name : 'Cow'}</span>
              <span className="text-sm font-mono text-stone-400 font-normal">
                ({cow?.primaryIdentifier || cow?.internalId})
              </span>
            </h1>

            <p className="text-xs text-stone-600">
              Inseminator / Embryologist: <span className="font-semibold text-stone-800">{process.technician || 'Staff'}</span>
              {process.recipientDgr && ` • Recipient DGR: ${process.recipientDgr}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCheckModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Pregnancy Check</span>
            </button>

            <Link
              href={`/bovine/reproduction/calvings/new?cowId=${process.cowAnimalId}&sireId=${process.bullAnimalId || ''}`}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Register Calving</span>
            </Link>
          </div>
        </div>

        {/* Milestone Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Current Stage</span>
            <div className="text-sm font-bold text-emerald-900 mt-0.5">
              {(process.currentStage || process.status || 'IN_PROGRESS').replace(/_/g, ' ')}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Expected Calving</span>
            <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
              {process.expectedCalvingDate || 'TBD'}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Synchronization</span>
            <div className="text-sm font-bold text-stone-800 truncate mt-0.5">
              {process.syncProtocol || 'Completed'}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Audit Checks</span>
            <div className="text-sm font-bold text-stone-800 mt-0.5">
              {(process.checks?.length ?? process.pregnancyChecks?.length ?? 0)} checks logged
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checks History & Genetics details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pregnancy Checks Ledger */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Ultrasound Pregnancy Audit History ({(process.checks?.length ?? process.pregnancyChecks?.length ?? 0)})</span>
              </h3>
              <button
                onClick={() => setIsCheckModalOpen(true)}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                + Add Check
              </button>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {(!process.checks?.length && !process.pregnancyChecks?.length) ? (
                <div className="p-6 text-center text-stone-500">
                  No pregnancy checks recorded yet. Click &ldquo;Log Pregnancy Check&rdquo; to record a 30-day ultrasound scan.
                </div>
              ) : (
                (process.checks || process.pregnancyChecks || []).map((chk: any, i: number) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">
                          {chk.checkType ? chk.checkType.replace('_', ' ') : (chk.stageLabel || 'Ultrasound Check')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            chk.result === 'PREGNANT'
                              ? 'bg-emerald-100 text-emerald-900'
                              : chk.result === 'OPEN'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {chk.result}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Scanned on {chk.date || chk.checkDate || 'Recent'} {chk.technician && `by ${chk.technician}`}
                      </div>
                      {chk.notes && <div className="text-stone-700 italic">&ldquo;{chk.notes}&rdquo;</div>}
                    </div>

                    <div className="text-right font-mono text-stone-400 text-[11px]">
                      Verified Audit
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Genetic Lineage & Donor/Sire Details */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <TestTubes className="w-4 h-4 text-emerald-700" />
              <span>Service Genetics Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Sire */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Sire / Semen Straw</span>
                <div className="font-bold text-sm text-stone-900 mt-1">
                  {bull ? bull.name : process.bullPlaceholder || 'Designated Sire'}
                </div>
                <div className="text-stone-500 font-mono mt-0.5">
                  DGR: {process.bullDgr || 'DGR-—'} • Batch: {process.semenBatch || 'Standard Straw'}
                </div>
              </div>

              {/* Donor (if ET) */}
              {process.procedureType === 'EMBRYO_TRANSFER' ? (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block tracking-wider">Donor Dam &amp; Embryo</span>
                  <div className="font-bold text-sm text-stone-900 mt-1">
                    {donor ? donor.name : process.donorCowPlaceholder || 'Donor Dam'}
                  </div>
                  <div className="text-stone-500 font-mono mt-0.5">
                    Embryo: {process.embryoCode || 'EMB-—'}
                  </div>
                  {process.embryoStageGrade && (
                    <div className="text-[11px] text-amber-900 mt-1 font-medium">
                      {process.embryoStageGrade}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Service Type</span>
                  <div className="font-bold text-sm text-stone-900 mt-1">Direct Artificial Insemination</div>
                  <div className="text-stone-500 mt-0.5">Trans-cervical uterine body deposition</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Recipient Profile Card & Synchronization Protocol */}
        <div className="space-y-6 text-xs">
          {/* Recipient Quick Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-700" />
              <span>Recipient Cow Profile</span>
            </h3>

            {cow ? (
              <div className="space-y-2">
                <div>
                  <span className="text-stone-400 block">Name &amp; Tag:</span>
                  <span className="font-bold text-stone-900">{cow.name}</span>
                  <span className="text-stone-500 font-mono ml-2">({cow.primaryIdentifier || cow.internalId})</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Breed &amp; Sex:</span>
                  <span className="font-semibold text-stone-800">{cow.breed || 'Angus Purebred'} • Female</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Current Status:</span>
                  <span className="font-semibold text-emerald-800">{cow.useStatus.replace(/_/g, ' ')}</span>
                </div>
                <Link
                  href={`/bovine/animals/${cow.id}`}
                  className="inline-flex items-center gap-1 text-emerald-800 font-semibold hover:underline pt-1"
                >
                  <span>Open Full Animal 360</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <p className="text-stone-500">Recipient animal data unavailable.</p>
            )}
          </div>

          {/* Synchronization Protocol */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Synchronization Protocol</span>
            </h3>

            <div className="space-y-2">
              <div>
                <span className="text-stone-400 block">Protocol:</span>
                <span className="font-semibold text-stone-900">{process.syncProtocol || 'Co-Synch + CIDR'}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Start Date:</span>
                <span className="font-mono text-stone-800">{process.syncStartDate || '—'}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Device Removal:</span>
                <span className="font-mono text-stone-800">{process.syncDeviceRemovalDate || '—'}</span>
              </div>
              {process.syncTreatments && (
                <div>
                  <span className="text-stone-400 block">Hormone Regimen:</span>
                  <span className="text-stone-700">{process.syncTreatments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Pregnancy Check Modal */}
      {isCheckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleAddCheck}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Log Pregnancy Ultrasound Check</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCheckModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Check Milestone</label>
              <select
                value={checkType}
                onChange={(e) => setCheckType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="CHECK_30">Day 30 Ultrasound (Early Gestation)</option>
                <option value="CHECK_60">Day 60 Ultrasound (Fetal Sexing / Confirmation)</option>
                <option value="CHECK_FINAL">Final Pre-Calving Check (90+ Days)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Scan Date</label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Diagnosis Result</label>
                <select
                  value={checkResult}
                  onChange={(e) => setCheckResult(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
                >
                  <option value="PREGNANT">Pregnant (Confirmed)</option>
                  <option value="OPEN">Open (Not Pregnant)</option>
                  <option value="SUSPECT">Suspect / Re-check in 7d</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Veterinarian / Sonographer</label>
              <input
                type="text"
                value={checkTech}
                onChange={(e) => setCheckTech(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Ultrasound Findings &amp; Notes</label>
              <textarea
                value={checkNotes}
                onChange={(e) => setCheckNotes(e.target.value)}
                rows={2}
                placeholder="Fetal heartbeat detected, crown-rump length, CL side..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Save Diagnosis
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
