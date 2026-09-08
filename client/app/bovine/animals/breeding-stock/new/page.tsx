'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Tag,
  Dna,
  Scale,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Activity,
  Ruler,
  FileSpreadsheet,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { Sex, HornStatus, UseStatus, IdentifierType } from '@/lib/bovine-types';

export default function RegisterBreedingStockWizardPage() {
  const router = useRouter();
  const { farms, herds, animals, addAnimal } = useBovine();
  const { addGeneticTraitEstimate } = useGenetics();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Identity
  const [dgr, setDgr] = useState(`DGR-${Math.floor(10000 + Math.random() * 90000)}`);
  const [name, setName] = useState('');
  const [earTag, setEarTag] = useState('');
  const [rfid, setRfid] = useState('');
  const [birthDate, setBirthDate] = useState('2024-02-15');
  const [sex, setSex] = useState<Sex>('FEMALE');
  const [primaryBreed, setPrimaryBreed] = useState('Holstein Friesian');
  const [bullType, setBullType] = useState('GENOMIC_CANDIDATE');
  const [useStatus, setUseStatus] = useState<UseStatus>('BREEDING_STOCK');
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [herdId, setHerdId] = useState('');
  const [owner, setOwner] = useState('Apex Bovine Genetics Consortium');
  const [supervisor, setSupervisor] = useState('Dr. Evelyn Sterling');

  // Step 2: Basic Performance
  const [birthWeightKg, setBirthWeightKg] = useState('42.0');
  const [currentWeightKg, setCurrentWeightKg] = useState('540.0');
  const [weaningWeightKg, setWeaningWeightKg] = useState('235.0');
  const [yearlingWeightKg, setYearlingWeightKg] = useState('455.0');
  const [adgKg, setAdgKg] = useState('1.18');
  const [pmwgKg, setPmwgKg] = useState('1.25');

  // Step 3: Physical Measurements
  const [rumpLengthCm, setRumpLengthCm] = useState('54.0');
  const [rumpHeightCm, setRumpHeightCm] = useState('142.0');
  const [lowerHeightCm, setLowerHeightCm] = useState('136.0');
  const [backHeightCm, setBackHeightCm] = useState('138.0');
  const [bodyLengthCm, setBodyLengthCm] = useState('168.0');
  const [ribDepthCm, setRibDepthCm] = useState('82.0');
  const [chestPerimeterCm, setChestPerimeterCm] = useState('198.0');
  const [bodyWidthCm, setBodyWidthCm] = useState('58.0');
  const [scrotalCircumferenceCm, setScrotalCircumferenceCm] = useState('36.0');

  // Step 4: Breed & Breeding Info
  const [breedRows, setBreedRows] = useState([
    { breedName: 'Holstein Friesian', percentage: 100 },
  ]);
  const [paternalNucleus, setPaternalNucleus] = useState('Elite Sires Nucleus A');
  const [paternalType, setPaternalType] = useState('GENOMIC_PROVEN');
  const [breedingType, setBreedingType] = useState('PUREBRED');
  const [birthCondition, setBirthCondition] = useState('Vigorous / Unassisted');

  // Step 5: Pedigree
  const [sireId, setSireId] = useState('');
  const [externalSireName, setExternalSireName] = useState('');
  const [damId, setDamId] = useState('');
  const [externalDamName, setExternalDamName] = useState('');
  const [pedigreeNotes, setPedigreeNotes] = useState('');

  // Step 6: Dairy & Genetic Traits
  const [milkEstimate, setMilkEstimate] = useState('+680');
  const [milkAccuracy, setMilkAccuracy] = useState('0.85');
  const [age1PEstimate, setAge1PEstimate] = useState('-12'); // Days
  const [age1PAccuracy, setAge1PAccuracy] = useState('0.72');
  const [ebiEstimate, setEbiEstimate] = useState('245');
  const [ebiAccuracy, setEbiAccuracy] = useState('0.80');
  const [betaLactoglobulin, setBetaLactoglobulin] = useState('AB');
  const [kappaCasein, setKappaCasein] = useState('BB');
  const [betaCasein, setBetaCasein] = useState('A2A2');

  // EPDs
  const [bwEpd, setBwEpd] = useState('+1.2');
  const [bwAcc, setBwAcc] = useState('0.78');
  const [bwDeca, setBwDeca] = useState('Top 15%');
  const [wwEpd, setWwEpd] = useState('+28.4');
  const [wwAcc, setWwAcc] = useState('0.82');
  const [wwDeca, setWwDeca] = useState('Top 5%');
  const [ywEpd, setYwEpd] = useState('+52.0');
  const [ywAcc, setYwAcc] = useState('0.84');
  const [ywDeca, setYwDeca] = useState('Top 5%');
  const [reaEpd, setReaEpd] = useState('+0.68');
  const [reaAcc, setReaAcc] = useState('0.74');
  const [marEpd, setMarEpd] = useState('+0.45');
  const [marAcc, setMarAcc] = useState('0.79');

  // Step 7: Media & Notes
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80');
  const [registrationNotes, setRegistrationNotes] = useState('Full multi-trait genetic evaluation verified. Clean monogenic condition screen.');

  // Potential Sires and Dams
  const potentialSires = animals.filter((a) => a.sex === 'MALE');
  const potentialDams = animals.filter((a) => a.sex === 'FEMALE');

  const selectedSire = animals.find((a) => a.id === sireId);
  const selectedDam = animals.find((a) => a.id === damId);

  // Dynamic Age calculation
  const calculateAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remaining = diffMonths % 12;
    return remaining > 0 ? `${years}y ${remaining}m` : `${years} yrs`;
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenEarTag = earTag.trim() || `TAG-${Math.floor(2000 + Math.random() * 8000)}`;

    const newAnimalId = addAnimal({
      animal: {
        internalId: dgr,
        name: name || `Breeding Candidate ${dgr}`,
        sex,
        birthDate,
        birthWeightKg: parseFloat(birthWeightKg) || undefined,
        currentWeightKg: parseFloat(currentWeightKg) || undefined,
        adgKg: parseFloat(adgKg) || undefined,
        lifeStatus: 'ALIVE',
        useStatus,
        classification: 'BREEDING_STOCK',
        isBreedingStock: true,
        dgr,
        breed: primaryBreed,
        coatColor: 'Black & White',
        hornStatus: 'POLLED',
        ownerOrgId: 'org-apex',
        farmId: farmId || farms[0]?.id,
        herdId: herdId || herds.find((h) => h.farmId === farmId)?.id || herds[0]?.id,
        registrationStatus: 'APPROVED',
        registrationNumber: dgr,
        photoUrl,
        requiresReview: false,
        latestConditionScore: 4.2,
        primaryIdentifier: dgr,
        primaryIdentifierType: 'DGR',
        sireId: sireId || undefined,
        sireName: selectedSire?.name || (externalSireName || undefined),
        damId: damId || undefined,
        damName: selectedDam?.name || (externalDamName || undefined),
        inbreedingCoefficient: 0.032,
      },
      identifiers: [
        {
          type: 'DGR',
          value: dgr,
          issuer: 'National Herdbook Registry',
          country: 'USA',
          isPrimary: true,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        {
          type: 'EAR_TAG',
          value: chosenEarTag,
          issuer: 'Farm Office',
          country: 'USA',
          isPrimary: false,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        ...(rfid.trim()
          ? [
              {
                type: 'RFID_EID' as IdentifierType,
                value: rfid.trim(),
                issuer: 'National Livestock ID',
                country: 'USA',
                isPrimary: false,
                issueDate: birthDate,
                status: 'ACTIVE' as const,
              },
            ]
          : []),
      ],
      breedComposition: breedRows.map((b, idx) => ({
        breedId: `breed-${idx + 1}`,
        breedName: b.breedName,
        percentage: b.percentage,
        source: 'PEDIGREE_DERIVED',
        confidence: 'HIGH',
        recordedDate: birthDate,
      })),
      parentage: {
        sireId: sireId || undefined,
        sireName: selectedSire?.name || externalSireName || undefined,
        sireStatus: 'VERIFIED',
        damId: damId || undefined,
        damName: selectedDam?.name || externalDamName || undefined,
        damStatus: 'VERIFIED',
        source: 'GENOMIC_CONFIRMED',
        confidence: 'HIGH',
        verificationStatus: 'VERIFIED',
        inbreedingCoefficient: 0.032,
        notes: pedigreeNotes || undefined,
      },
      initialPhoto: photoUrl,
    });

    // Add Genetic Traits & EPDs
    addGeneticTraitEstimate({
      animalId: newAnimalId,
      traitCode: 'MILK_KG',
      traitName: 'Milk Yield',
      estimateType: 'GEBV',
      value: parseFloat(milkEstimate) || 680,
      unit: 'kg',
      accuracy: parseFloat(milkAccuracy) || 0.85,
      confidenceIntervalLower: 520,
      confidenceIntervalUpper: 840,
      percentile: 5,
    });

    addGeneticTraitEstimate({
      animalId: newAnimalId,
      traitCode: 'WW_KG',
      traitName: 'Weaning Weight EPD',
      estimateType: 'EPD',
      value: parseFloat(wwEpd) || 28.4,
      unit: 'kg',
      accuracy: parseFloat(wwAcc) || 0.82,
      confidenceIntervalLower: 24.0,
      confidenceIntervalUpper: 32.8,
      percentile: 5,
    });

    router.push(`/bovine/animals/breeding-stock/${newAnimalId}`);
  };

  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Basic Performance' },
    { num: 3, label: 'Measurements' },
    { num: 4, label: 'Breed & Nucleus' },
    { num: 5, label: 'Pedigree' },
    { num: 6, label: 'Genetics & EPDs' },
    { num: 7, label: 'Review & Submit' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
        <Link
          href="/bovine/animals/breeding-stock"
          className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>Breeding Stock Registry Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Register Breeding Stock Candidate</h1>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px] px-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <button
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className="flex items-center space-x-2 group text-left cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === step.num
                      ? 'bg-amber-600 text-white shadow-xs'
                      : currentStep > step.num
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    currentStep === step.num ? 'text-amber-900' : 'text-stone-500 group-hover:text-stone-800'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && <div className="w-6 h-0.5 bg-stone-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleCompleteRegistration} className="space-y-6">
        {/* STEP 1: IDENTITY */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Tag className="w-4 h-4 text-amber-700" />
              <span>Step 1 — Identity &amp; Registry Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  DGR Registration Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dgr}
                  onChange={(e) => setDgr(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Animal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Altair Benchmark ET"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ear Tag</label>
                <input
                  type="text"
                  value={earTag}
                  onChange={(e) => setEarTag(e.target.value)}
                  placeholder="e.g. US-9901421"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Calculated Age (Preview)</label>
                <div className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-semibold font-mono">
                  {calculateAge(birthDate)} (From Birth Date)
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sex)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="FEMALE">Female (Donor / Dam)</option>
                  <option value="MALE">Male (Sire / Bull)</option>
                </select>
              </div>

              {sex === 'MALE' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Bull Category</label>
                  <select
                    value={bullType}
                    onChange={(e) => setBullType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="AI_SIRE">Proven Artificial Insemination Sire</option>
                    <option value="GENOMIC_CANDIDATE">Young Genomic Candidate Bull</option>
                    <option value="NATURAL_SERVICE">Natural Service Herd Bull</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Facility / Farm</label>
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Registry Supervisor</label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC PERFORMANCE */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>Step 2 — Growth &amp; Gain Milestones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={birthWeightKg}
                  onChange={(e) => setBirthWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Average Daily Gain (ADG kg/d)</label>
                <input
                  type="number"
                  step="0.01"
                  value={adgKg}
                  onChange={(e) => setAdgKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Weaning Weight 205d (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weaningWeightKg}
                  onChange={(e) => setWeaningWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Yearling Weight 365d (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={yearlingWeightKg}
                  onChange={(e) => setYearlingWeightKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Post-Weaning Gain (PMWG kg/d)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pmwgKg}
                  onChange={(e) => setPmwgKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PHYSICAL MEASUREMENTS */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Ruler className="w-4 h-4 text-amber-700" />
              <span>Step 3 — Physical Morphometric Measurements (cm)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Length of Rump (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rumpLengthCm}
                  onChange={(e) => setRumpLengthCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Height of Rump (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rumpHeightCm}
                  onChange={(e) => setRumpHeightCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Lower Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={lowerHeightCm}
                  onChange={(e) => setLowerHeightCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Back Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={backHeightCm}
                  onChange={(e) => setBackHeightCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Body Length (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyLengthCm}
                  onChange={(e) => setBodyLengthCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rib Depth (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ribDepthCm}
                  onChange={(e) => setRibDepthCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Chest Perimeter (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chestPerimeterCm}
                  onChange={(e) => setChestPerimeterCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Body Width (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyWidthCm}
                  onChange={(e) => setBodyWidthCm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                />
              </div>

              {sex === 'MALE' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Scrotal Circumference (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={scrotalCircumferenceCm}
                    onChange={(e) => setScrotalCircumferenceCm(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: BREED & BREEDING INFO */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Dna className="w-4 h-4 text-amber-700" />
              <span>Step 4 — Breed Composition &amp; Paternal Line</span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-800">Breed Composition Breakout</div>
              {breedRows.map((row, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={row.breedName}
                    onChange={(e) => {
                      const next = [...breedRows];
                      next[idx].breedName = e.target.value;
                      setBreedRows(next);
                    }}
                    placeholder="Breed Name"
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
                  />
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={row.percentage}
                      onChange={(e) => {
                        const next = [...breedRows];
                        next[idx].percentage = parseFloat(e.target.value) || 0;
                        setBreedRows(next);
                      }}
                      className="w-20 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                    />
                    <span className="text-xs text-stone-500 font-bold">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Paternal Nucleus Cohort</label>
                <input
                  type="text"
                  value={paternalNucleus}
                  onChange={(e) => setPaternalNucleus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Paternal Lineage Type</label>
                <select
                  value={paternalType}
                  onChange={(e) => setPaternalType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="GENOMIC_PROVEN">Genomically Proven Top 1%</option>
                  <option value="PROGENY_TESTED">Progeny Tested &gt;80 Daughters</option>
                  <option value="FOUNDATION">Foundational Heritage Line</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PEDIGREE */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Step 5 — Verified Pedigree &amp; Ancestry Linking</span>
            </div>
            <p className="text-xs text-stone-600">
              Selecting registered parents automatically resolves 3-generation depth (Grandparents &amp; Great-grandparents) from the registry database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-900">Sire (Father)</label>
                <select
                  value={sireId}
                  onChange={(e) => {
                    setSireId(e.target.value);
                    if (e.target.value) setExternalSireName('');
                  }}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="">-- Select Registered Sire Bull --</option>
                  {potentialSires.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.primaryIdentifier || s.internalId})
                    </option>
                  ))}
                </select>
                {selectedSire && (
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
                    <div className="font-bold text-stone-900">{selectedSire.name}</div>
                    <div>Breed: {selectedSire.breed || 'Holstein'}</div>
                    <div className="font-mono text-stone-500">DGR: {selectedSire.dgr || selectedSire.internalId}</div>
                  </div>
                )}
                <div className="text-[11px] text-stone-500 font-medium">Or enter external sire code:</div>
                <input
                  type="text"
                  value={externalSireName}
                  onChange={(e) => {
                    setExternalSireName(e.target.value);
                    if (e.target.value) setSireId('');
                  }}
                  placeholder="External Sire Name / Registry Code"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-900">Dam (Mother)</label>
                <select
                  value={damId}
                  onChange={(e) => {
                    setDamId(e.target.value);
                    if (e.target.value) setExternalDamName('');
                  }}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="">-- Select Registered Dam --</option>
                  {potentialDams.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.primaryIdentifier || d.internalId})
                    </option>
                  ))}
                </select>
                {selectedDam && (
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
                    <div className="font-bold text-stone-900">{selectedDam.name}</div>
                    <div>Breed: {selectedDam.breed || 'Holstein'}</div>
                    <div className="font-mono text-stone-500">DGR: {selectedDam.dgr || selectedDam.internalId}</div>
                  </div>
                )}
                <div className="text-[11px] text-stone-500 font-medium">Or enter external dam code:</div>
                <input
                  type="text"
                  value={externalDamName}
                  onChange={(e) => {
                    setExternalDamName(e.target.value);
                    if (e.target.value) setDamId('');
                  }}
                  placeholder="External Dam Name / Registry Code"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: GENETICS & EPDS */}
        {currentStep === 6 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>Step 6 — Dairy Breeding Traits &amp; EPD / ACC / DECA Table</span>
            </div>

            {/* Protein & Milk Markers */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="font-bold text-xs text-stone-900">Protein Variants &amp; Milk Markers</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Beta-Casein</label>
                  <select
                    value={betaCasein}
                    onChange={(e) => setBetaCasein(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
                  >
                    <option value="A2A2">A2A2 (Homozygous Prime)</option>
                    <option value="A1A2">A1A2 (Heterozygous)</option>
                    <option value="A1A1">A1A1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Kappa-Casein</label>
                  <select
                    value={kappaCasein}
                    onChange={(e) => setKappaCasein(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
                  >
                    <option value="BB">BB (Superior Cheese Yield)</option>
                    <option value="AB">AB</option>
                    <option value="AA">AA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Beta-Lactoglobulin</label>
                  <select
                    value={betaLactoglobulin}
                    onChange={(e) => setBetaLactoglobulin(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-mono font-bold"
                  >
                    <option value="AB">AB</option>
                    <option value="AA">AA</option>
                    <option value="BB">BB</option>
                  </select>
                </div>
              </div>
            </div>

            {/* EPD / ACC / DECA Table */}
            <div className="space-y-2">
              <div className="font-bold text-xs text-stone-900">Estimated Progeny Differences (EPDs)</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-stone-200 rounded-xl">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase">
                      <th className="py-2.5 px-3">Trait</th>
                      <th className="py-2.5 px-3">EPD Value</th>
                      <th className="py-2.5 px-3">Accuracy (ACC)</th>
                      <th className="py-2.5 px-3">Percentile / DECA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold">BW (Birth Weight)</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={bwEpd}
                          onChange={(e) => setBwEpd(e.target.value)}
                          className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={bwAcc}
                          onChange={(e) => setBwAcc(e.target.value)}
                          className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-semibold text-emerald-800">{bwDeca}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">WW (Weaning Weight)</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={wwEpd}
                          onChange={(e) => setWwEpd(e.target.value)}
                          className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={wwAcc}
                          onChange={(e) => setWwAcc(e.target.value)}
                          className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-semibold text-emerald-800">{wwDeca}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">YW (Yearling Weight)</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={ywEpd}
                          onChange={(e) => setYwEpd(e.target.value)}
                          className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={ywAcc}
                          onChange={(e) => setYwAcc(e.target.value)}
                          className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-semibold text-emerald-800">{ywDeca}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">REA (Ribeye Area)</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={reaEpd}
                          onChange={(e) => setReaEpd(e.target.value)}
                          className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={reaAcc}
                          onChange={(e) => setReaAcc(e.target.value)}
                          className="w-20 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-semibold text-emerald-800">Top 10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & SUBMIT */}
        {currentStep === 7 && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Step 7 — Registration Audit &amp; Confirmation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm">{name || 'Unnamed Candidate'}</div>
                <div>
                  <span className="text-stone-500">DGR Registry ID:</span>{' '}
                  <span className="font-mono font-bold text-stone-900">{dgr}</span>
                </div>
                <div>
                  <span className="text-stone-500">Ear Tag:</span>{' '}
                  <span className="font-mono">{earTag || 'Auto-generated'}</span>
                </div>
                <div>
                  <span className="text-stone-500">Breed &amp; Sex:</span>{' '}
                  <span className="font-semibold">{primaryBreed} ({sex})</span>
                </div>
                <div>
                  <span className="text-stone-500">Birth Date:</span>{' '}
                  <span>{birthDate} (Age: {calculateAge(birthDate)})</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm">Pedigree &amp; Genetic Provenance</div>
                <div>
                  <span className="text-stone-500">Sire:</span>{' '}
                  <span className="font-semibold">{selectedSire?.name || externalSireName || 'Recorded'}</span>
                </div>
                <div>
                  <span className="text-stone-500">Dam:</span>{' '}
                  <span className="font-semibold">{selectedDam?.name || externalDamName || 'Recorded'}</span>
                </div>
                <div>
                  <span className="text-stone-500">Beta-Casein:</span>{' '}
                  <span className="font-mono font-bold text-emerald-800">{betaCasein}</span>
                </div>
                <div>
                  <span className="text-stone-500">Current Scale Weight:</span>{' '}
                  <span className="font-mono font-bold">{currentWeightKg} kg</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Registration Notes</label>
              <textarea
                value={registrationNotes}
                onChange={(e) => setRegistrationNotes(e.target.value)}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <Link
              href="/bovine/animals/breeding-stock"
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            >
              Cancel
            </Link>
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Confirm &amp; Register Breeding Stock
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
