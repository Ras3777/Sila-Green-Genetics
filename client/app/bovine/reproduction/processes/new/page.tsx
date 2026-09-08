'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  TestTubes,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { ReproductiveProcessStage } from '@/lib/bovine-types';

export default function NewReproductiveProcessPage() {
  const router = useRouter();
  const { animals, addReproductiveProcess } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');
  const maleAnimals = animals.filter((a) => a.sex === 'MALE');

  const [step, setStep] = useState<number>(1);

  // Form State
  // Step 1: Cow / Recipient
  const [cowAnimalId, setCowAnimalId] = useState(femaleAnimals[0]?.id || '');
  const [recipientDgr, setRecipientDgr] = useState('DGR-REC-001');
  const [branding, setBranding] = useState('Right Hip #104');
  const [managementGroup, setManagementGroup] = useState('Recipient Herd Alpha');

  // Step 2: Donor (if ET)
  const [donorCowAnimalId, setDonorCowAnimalId] = useState('');
  const [donorCowPlaceholder, setDonorCowPlaceholder] = useState('');
  const [donorWeightKg, setDonorWeightKg] = useState('610');
  const [donorBcs, setDonorBcs] = useState('6.5');
  const [donorBreed, setDonorBreed] = useState('Angus Elite Purebred');

  // Step 3: Bull / Semen
  const [bullAnimalId, setBullAnimalId] = useState('');
  const [bullPlaceholder, setBullPlaceholder] = useState('SAV Raindance 6848');
  const [bullDgr, setBullDgr] = useState('DGR-BULL-998');
  const [bullBreed, setBullBreed] = useState('Angus');
  const [semenBatch, setSemenBatch] = useState('BATCH-2026-US-48');

  // Step 4: Embryo (if ET)
  const [embryoCode, setEmbryoCode] = useState('EMB-2026-081');
  const [embryoBreed, setEmbryoBreed] = useState('100% Angus');
  const [embryoStage, setEmbryoStage] = useState('Stage 4 - Morula / Stage 5 - Blastocyst');
  const [embryoGrade, setEmbryoGrade] = useState('Grade 1 (Excellent)');
  const [embryoPreservation, setEmbryoPreservation] = useState<'FRESH' | 'FROZEN'>('FROZEN');

  // Step 5: Synchronization
  const [syncProtocol, setSyncProtocol] = useState('7-Day Co-Synch + CIDR');
  const [syncStartDate, setSyncStartDate] = useState(
    new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0]
  );
  const [syncDeviceRemovalDate, setSyncDeviceRemovalDate] = useState(
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
  );
  const [syncTreatments, setSyncTreatments] = useState('GnRH (2ml) + PGF2a (5ml) at pull');

  // Step 6: Procedure Type & Date
  const [procedureType, setProcedureType] = useState<'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER'>('ARTIFICIAL_INSEMINATION');
  const [procedureDate, setProcedureDate] = useState(new Date().toISOString().split('T')[0]);
  const [technician, setTechnician] = useState('Dr. Helena Rocha (DVM / Embryologist)');

  // Step 7: Expected Pregnancy Checks & Calving
  const [expectedCalvingDate, setExpectedCalvingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 283); // 283 days gestation
    return d.toISOString().split('T')[0];
  });

  const steps = [
    { num: 1, label: 'Recipient Cow' },
    { num: 2, label: 'Donor Info' },
    { num: 3, label: 'Bull & Semen' },
    { num: 4, label: 'Embryo Info' },
    { num: 5, label: 'Synchronization' },
    { num: 6, label: 'AI / ET Service' },
    { num: 7, label: 'Review & Confirm' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addReproductiveProcess({
      cowAnimalId,
      recipientDgr: recipientDgr || undefined,
      donorCowAnimalId: donorCowAnimalId || undefined,
      donorCowPlaceholder: donorCowPlaceholder || undefined,
      donorWeightKg: parseFloat(donorWeightKg) || undefined,
      donorBcs: parseFloat(donorBcs) || undefined,
      bullAnimalId: bullAnimalId || undefined,
      bullPlaceholder: bullPlaceholder || undefined,
      bullDgr: bullDgr || undefined,
      semenBatch: semenBatch || undefined,
      embryoCode: procedureType === 'EMBRYO_TRANSFER' ? embryoCode : undefined,
      embryoStageGrade: procedureType === 'EMBRYO_TRANSFER' ? `${embryoStage} • ${embryoGrade} • ${embryoPreservation}` : undefined,
      syncProtocol,
      syncStartDate,
      syncDeviceRemovalDate,
      syncTreatments,
      procedureType,
      procedureDate,
      technician,
      currentStage: 'INSEMINATED',
      expectedCalvingDate,
      checks: [
        {
          checkType: 'CHECK_30',
          date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          result: 'PENDING',
          notes: 'Scheduled 30-day ultrasound pregnancy scan',
        },
      ],
      notes: `Procedure initiated on ${procedureDate}. Synchronization protocol: ${syncProtocol}.`,
    });

    router.push('/bovine/reproduction/processes');
  };

  const selectedCow = animals.find((a) => a.id === cowAnimalId);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
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
        <span className="font-semibold text-stone-900">New Process Wizard</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Lifecycle Wizard
          </span>
          <h1 className="text-xl font-bold text-stone-900 mt-1">
            Initiate Reproductive Procedure (AI / ET)
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Step-by-step workflow covering synchronization, donor &amp; sire genetics, service recording, and automated gestation schedules.
          </p>
        </div>

        {/* Procedure Selector Pill */}
        <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
          <button
            type="button"
            onClick={() => setProcedureType('ARTIFICIAL_INSEMINATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              procedureType === 'ARTIFICIAL_INSEMINATION'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Artificial Insemination (AI)
          </button>
          <button
            type="button"
            onClick={() => setProcedureType('EMBRYO_TRANSFER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              procedureType === 'EMBRYO_TRANSFER'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Embryo Transfer (ET)
          </button>
        </div>
      </div>

      {/* Wizard Step Progression Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] space-x-2">
          {steps.map((s, idx) => {
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            const isETOnly = (s.num === 2 || s.num === 4) && procedureType !== 'EMBRYO_TRANSFER';

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  disabled={isETOnly}
                  className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? 'text-emerald-900 bg-emerald-50 border border-emerald-300'
                      : isDone
                      ? 'text-stone-800'
                      : isETOnly
                      ? 'text-stone-300 line-through'
                      : 'text-stone-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-800 text-white'
                        : isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < steps.length - 1 && <div className="h-px w-6 bg-stone-200 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Containers */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Recipient / Cow Information */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-700" />
              <span>Step 1: Recipient / Inseminated Cow Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Recipient Cow *
                </label>
                <select
                  value={cowAnimalId}
                  onChange={(e) => setCowAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                >
                  {femaleAnimals.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.primaryIdentifier || f.internalId}) • {f.breed || 'Angus'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient DGR Identifier
                </label>
                <input
                  type="text"
                  value={recipientDgr}
                  onChange={(e) => setRecipientDgr(e.target.value)}
                  placeholder="Official Recipient DGR"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Branding &amp; Permanent Marks
                </label>
                <input
                  type="text"
                  value={branding}
                  onChange={(e) => setBranding(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Management Group
                </label>
                <input
                  type="text"
                  value={managementGroup}
                  onChange={(e) => setManagementGroup(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            {selectedCow && (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-950">Active Recipient Selected:</span>{' '}
                  <span className="text-emerald-900 font-medium">
                    {selectedCow.name} • Status: {selectedCow.useStatus} • Breed: {selectedCow.breed || 'Angus'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-emerald-800">
                  {selectedCow.primaryIdentifier}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Donor Information (ET only or skipped for AI) */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              <span>Step 2: Donor Cow Information (Embryo Source)</span>
            </h2>

            {procedureType === 'ARTIFICIAL_INSEMINATION' ? (
              <div className="p-6 text-center text-stone-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
                <p className="text-xs">
                  Donor information is not required for standard Artificial Insemination (AI).
                </p>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
                >
                  Proceed to Step 3: Bull &amp; Semen &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select In-Herd Donor Cow
                  </label>
                  <select
                    value={donorCowAnimalId}
                    onChange={(e) => {
                      setDonorCowAnimalId(e.target.value);
                      if (e.target.value) setDonorCowPlaceholder('');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="">-- Or enter external donor below --</option>
                    {femaleAnimals.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.primaryIdentifier || f.internalId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Or External Donor Cow Name / Reg #
                  </label>
                  <input
                    type="text"
                    value={donorCowPlaceholder}
                    onChange={(e) => {
                      setDonorCowPlaceholder(e.target.value);
                      if (e.target.value) setDonorCowAnimalId('');
                    }}
                    placeholder="e.g. GAR Early Bird 5092 (Reg #189218)"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Donor Weight at Day 0 (kg)
                  </label>
                  <input
                    type="number"
                    value={donorWeightKg}
                    onChange={(e) => setDonorWeightKg(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Donor Body Condition Score (BCS 1-9)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={donorBcs}
                    onChange={(e) => setDonorBcs(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Donor Breed Composition
                  </label>
                  <input
                    type="text"
                    value={donorBreed}
                    onChange={(e) => setDonorBreed(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Bull / Semen Information */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <TestTubes className="w-5 h-5 text-emerald-700" />
              <span>Step 3: Bull / Semen Service Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Herd Sire (if on-farm)
                </label>
                <select
                  value={bullAnimalId}
                  onChange={(e) => {
                    setBullAnimalId(e.target.value);
                    if (e.target.value) setBullPlaceholder('');
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="">-- Or enter semen straw / AI sire below --</option>
                  {maleAnimals.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.primaryIdentifier || m.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Or Sire Name / NAAB Code *
                </label>
                <input
                  type="text"
                  value={bullPlaceholder}
                  onChange={(e) => {
                    setBullPlaceholder(e.target.value);
                    if (e.target.value) setBullAnimalId('');
                  }}
                  placeholder="e.g. SAV Raindance 6848 (29AN1922)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required={!bullAnimalId}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bull DGR Identifier
                </label>
                <input
                  type="text"
                  value={bullDgr}
                  onChange={(e) => setBullDgr(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Semen Batch / Canister Straw ID
                </label>
                <input
                  type="text"
                  value={semenBatch}
                  onChange={(e) => setSemenBatch(e.target.value)}
                  placeholder="BATCH-2026-US-48"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Embryo Information (ET only or skipped for AI) */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>Step 4: Embryo Information (Cryo &amp; Morphological Quality)</span>
            </h2>

            {procedureType === 'ARTIFICIAL_INSEMINATION' ? (
              <div className="p-6 text-center text-stone-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
                <p className="text-xs">
                  Embryo data is only applicable for Embryo Transfer (ET) procedures.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
                >
                  Proceed to Step 5: Synchronization &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Embryo Barcode / Code *
                  </label>
                  <input
                    type="text"
                    value={embryoCode}
                    onChange={(e) => setEmbryoCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Embryo Breed Purity
                  </label>
                  <input
                    type="text"
                    value={embryoBreed}
                    onChange={(e) => setEmbryoBreed(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    IETS Stage (1-9)
                  </label>
                  <input
                    type="text"
                    value={embryoStage}
                    onChange={(e) => setEmbryoStage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    IETS Quality Grade (1-4)
                  </label>
                  <input
                    type="text"
                    value={embryoGrade}
                    onChange={(e) => setEmbryoGrade(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preservation Method
                  </label>
                  <select
                    value={embryoPreservation}
                    onChange={(e) => setEmbryoPreservation(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="FROZEN">Frozen / Vitrified (Liquid N2)</option>
                    <option value="FRESH">Fresh Transfer (Direct)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Synchronization Protocol */}
        {step === 5 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>Step 5: Estrus Synchronization Protocol</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Synchronization Protocol Name
                </label>
                <input
                  type="text"
                  value={syncProtocol}
                  onChange={(e) => setSyncProtocol(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Device Insertion / Start Date
                </label>
                <input
                  type="date"
                  value={syncStartDate}
                  onChange={(e) => setSyncStartDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  CIDR / Device Removal Date
                </label>
                <input
                  type="date"
                  value={syncDeviceRemovalDate}
                  onChange={(e) => setSyncDeviceRemovalDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Administered Treatments &amp; Hormone Injections
                </label>
                <input
                  type="text"
                  value={syncTreatments}
                  onChange={(e) => setSyncTreatments(e.target.value)}
                  placeholder="GnRH, PGF2a, Estradiol..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: AI / ET Service Action */}
        {step === 6 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Step 6: Insemination / Transfer Service Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Procedure Date *
                </label>
                <input
                  type="date"
                  value={procedureDate}
                  onChange={(e) => setProcedureDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Certified Inseminator / Embryologist *
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Confirm */}
        {step === 7 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-6">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-700" />
              <span>Step 7: Review &amp; Schedule Pregnancy Audits</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Recipient Cow</span>
                <div className="font-bold text-sm text-stone-900">{selectedCow?.name}</div>
                <div className="text-stone-500 font-mono">
                  Tag: {selectedCow?.primaryIdentifier || selectedCow?.internalId} • DGR: {recipientDgr}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Service Genetics</span>
                <div className="font-bold text-sm text-stone-900">
                  Sire: {bullPlaceholder || 'Selected Bull'}
                </div>
                {procedureType === 'EMBRYO_TRANSFER' && (
                  <div className="text-amber-800 font-medium">
                    Donor: {donorCowPlaceholder || 'Donor Dam'} • Embryo: {embryoCode}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Procedure &amp; Date</span>
                <div className="font-bold text-stone-900">{procedureType}</div>
                <div className="text-stone-500 font-mono">Date: {procedureDate} • Inseminator: {technician}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Expected Calving Date</span>
                <div className="font-bold font-mono text-base text-emerald-900">{expectedCalvingDate}</div>
                <div className="text-emerald-700 text-[11px]">Calculated 283-day gestation schedule</div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 3 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(1);
                else if (step === 5 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(3);
                else setStep(step - 1);
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(3);
                else if (step === 3 && procedureType === 'ARTIFICIAL_INSEMINATION') setStep(5);
                else setStep(step + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Register Process</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
