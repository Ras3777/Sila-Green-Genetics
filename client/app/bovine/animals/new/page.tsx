'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Dna,
  Building2,
  Users,
  Image as ImageIcon,
  Save,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  AnimalSex,
  LifeStatus,
  LivestockUseStatus,
  BirthType,
  HornStatus,
  IdentifierType,
} from '@/lib/bovine-types';

export default function BovineNewAnimalWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledId = searchParams.get('identifier') || '';

  const { animals, farms, herds, organizations, addAnimal } = useBovine();

  // Wizard Steps 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Identity
  const [name, setName] = useState('');
  const [sex, setSex] = useState<AnimalSex>('FEMALE');
  const [birthDate, setBirthDate] = useState('2026-03-15');
  const [birthWeightKg, setBirthWeightKg] = useState<number>(40);
  const [birthType, setBirthType] = useState<BirthType>('SINGLE');
  const [lifeStatus, setLifeStatus] = useState<LifeStatus>('ALIVE');
  const [useStatus, setUseStatus] = useState<LivestockUseStatus>('BREEDING_STOCK');
  const [coatColor, setCoatColor] = useState('Black & White');
  const [hornStatus, setHornStatus] = useState<HornStatus>('POLLED');

  // Step 2: Identifiers
  const [identifierList, setIdentifierList] = useState<
    Array<{ type: IdentifierType; value: string; isPrimary: boolean }>
  >([
    {
      type: 'EAR_TAG',
      value: prefilledId || 'US-8492041',
      isPrimary: true,
    },
    {
      type: 'RFID',
      value: '982000847291038',
      isPrimary: false,
    },
  ]);

  // Step 3: Placement & Ownership
  const [ownerOrgId, setOwnerOrgId] = useState(organizations[0]?.id || 'org-1');
  const [farmId, setFarmId] = useState(farms[0]?.id || 'farm-1');
  const [herdId, setHerdId] = useState(herds[0]?.id || 'herd-1');

  // Step 4: Breed Composition
  const [breedList, setBreedList] = useState<
    Array<{ breedName: string; percentage: number; source: any }>
  >([{ breedName: 'Holstein', percentage: 100, source: 'REGISTERED' }]);

  // Step 5: Parentage
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');

  // Step 6: Media
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
  );
  const [registrationDocName, setRegistrationDocName] = useState('Holstein_Association_Certificate.pdf');

  // Breed Percentage Sum validation
  const totalBreedPercentage = breedList.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
  const isBreedValid = totalBreedPercentage === 100;

  // Potential Sires & Dams for dropdowns
  const candidateSires = animals.filter((a) => a.sex === 'MALE');
  const candidateDams = animals.filter((a) => a.sex === 'FEMALE');

  // Add identifier row
  const addIdentifierRow = () => {
    setIdentifierList((prev) => [
      ...prev,
      { type: 'DGR', value: '', isPrimary: false },
    ]);
  };

  const removeIdentifierRow = (index: number) => {
    if (identifierList.length > 1) {
      setIdentifierList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const setPrimaryIdentifier = (index: number) => {
    setIdentifierList((prev) =>
      prev.map((item, i) => ({
        ...item,
        isPrimary: i === index,
      }))
    );
  };

  // Add breed row
  const addBreedRow = () => {
    setBreedList((prev) => [
      ...prev,
      { breedName: 'Angus', percentage: 0, source: 'GENOMIC' },
    ]);
  };

  const removeBreedRow = (index: number) => {
    if (breedList.length > 1) {
      setBreedList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Final Submit
  const handleFinalSubmit = () => {
    const primaryIdObj = identifierList.find((i) => i.isPrimary) || identifierList[0];
    const internalId = `BOV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const sire = animals.find((a) => a.id === sireId);
    const dam = animals.find((a) => a.id === damId);

    const animalId = addAnimal({
      animal: {
        internalId,
        name: name.trim() || `Heifer ${primaryIdObj.value}`,
        sex,
        birthDate,
        birthWeightKg: Number(birthWeightKg),
        birthType,
        lifeStatus,
        useStatus,
        coatColor,
        hornStatus,
        primaryIdentifier: primaryIdObj.value,
        primaryIdentifierType: primaryIdObj.type,
        registrationStatus: 'APPROVED',
        ownerOrgId,
        farmId,
        herdId,
        sireId: sire ? sire.id : undefined,
        sireName: sire ? sire.name : undefined,
        damId: dam ? dam.id : undefined,
        damName: dam ? dam.name : undefined,
        photoUrl,
        requiresReview: false,
        latestConditionScore: 4,
        operationalStatus: 'NORMAL',
      },
      identifiers: identifierList.map((i) => ({
        type: i.type,
        value: i.value,
        issuer: 'USDA / NLIS',
        country: 'USA',
        issueDate: birthDate,
        status: 'ACTIVE',
        isPrimary: i.isPrimary,
      })),
      breedComposition: breedList.map((b) => ({
        breedId: `breed-${b.breedName.toLowerCase().replace(/\s+/g, '-')}`,
        breedName: b.breedName,
        percentage: Number(b.percentage),
        source: 'REGISTRY',
        confidence: 'HIGH',
        recordedDate: birthDate,
      })),
      parentage: {
        sireId: sire?.id,
        sireName: sire?.name,
        damId: dam?.id,
        damName: dam?.name,
        damStatus: 'RECORDED',
        sireStatus: 'RECORDED',
        source: 'REGISTRY',
        confidence: 'HIGH',
      },
      ownership: {
        ownerName: 'Apex Genetics Bovine Operations',
        ownerOrgId,
        ownershipType: 'SOLE',
        sharePercentage: 100,
        startDate: birthDate,
        isCurrent: true,
        transferNotes: 'Enrolled via protocol wizard',
      },
      initialPhoto: photoUrl,
    });

    router.push(`/bovine/animals/${animalId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Livestock Enrollment Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Register New Livestock Record
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Step {currentStep} of 7 • Standardized identity, biosecurity pedigree & lineage mapping
          </p>
        </div>

        <Link
          href="/bovine/animals"
          className="text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          Cancel Enrollment
        </Link>
      </div>

      {/* 7-Step Horizontal Stepper */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {[
          { step: 1, label: 'Identity' },
          { step: 2, label: 'Identifiers' },
          { step: 3, label: 'Placement' },
          { step: 4, label: 'Breeds' },
          { step: 5, label: 'Pedigree' },
          { step: 6, label: 'Media' },
          { step: 7, label: 'Review' },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
              currentStep === s.step
                ? 'bg-emerald-800 text-white shadow-xs'
                : currentStep > s.step
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
            }`}
          >
            <div className="hidden sm:block text-[10px] uppercase tracking-wider opacity-80">Step {s.step}</div>
            <div className="truncate">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Step Form Containers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
        {/* STEP 1: IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              1. Basic Identity & Physical Traits
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Animal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pine-Tree 9882 Hero 721-ET"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Biological Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as AnimalSex)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="FEMALE">Female (Heifer / Cow)</option>
                  <option value="MALE">Male (Bull)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Weight (kg)</label>
                <input
                  type="number"
                  value={birthWeightKg}
                  onChange={(e) => setBirthWeightKg(parseFloat(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Type</label>
                <select
                  value={birthType}
                  onChange={(e) => setBirthType(e.target.value as BirthType)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="SINGLE">Single Calf</option>
                  <option value="TWIN">Twin</option>
                  <option value="TRIPLET">Triplet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Livestock Use Status</label>
                <select
                  value={useStatus}
                  onChange={(e) => setUseStatus(e.target.value as LivestockUseStatus)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="BREEDING_STOCK">Breeding Stock</option>
                  <option value="DONOR">Embryo / OPU Donor</option>
                  <option value="RECIPIENT">Recipient Dam</option>
                  <option value="AI_SIRE">AI Sire</option>
                  <option value="NATURAL_SERVICE_SIRE">Natural Service Bull</option>
                  <option value="TEST_ANIMAL">Test Animal</option>
                  <option value="CULL_CANDIDATE">Cull Candidate</option>
                  <option value="GENERAL">General Livestock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Horn Status</label>
                <select
                  value={hornStatus}
                  onChange={(e) => setHornStatus(e.target.value as HornStatus)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="POLLED">Polled (Naturally hornless)</option>
                  <option value="HORNED">Horned</option>
                  <option value="DEHORNED">Dehorned / Disbudded</option>
                  <option value="SCURRED">Scurred</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Coat Color & Pattern</label>
                <input
                  type="text"
                  value={coatColor}
                  onChange={(e) => setCoatColor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTIFIERS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">2. Physical & Electronic Identifiers</h2>
              <button
                type="button"
                onClick={addIdentifierRow}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Identifier
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Attach primary visual ear tags, 15-digit ISO RFID chips, herd tattoos, or official national registry codes.
            </p>

            <div className="space-y-3">
              {identifierList.map((idItem, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="w-36">
                    <select
                      value={idItem.type}
                      onChange={(e) => {
                        const newType = e.target.value as IdentifierType;
                        setIdentifierList((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, type: newType } : item))
                        );
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
                    >
                      <option value="EAR_TAG">Ear Tag</option>
                      <option value="RFID">RFID / EID</option>
                      <option value="DGR">DGR Number</option>
                      <option value="TATTOO">Tattoo</option>
                      <option value="BRAND">Brand</option>
                      <option value="NATIONAL_ID">National ID</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tag / Transponder Value..."
                      value={idItem.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIdentifierList((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, value: val } : item))
                        );
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrimaryIdentifier(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      idItem.isPrimary
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {idItem.isPrimary ? 'Primary' : 'Make Primary'}
                  </button>

                  {identifierList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIdentifierRow(idx)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PLACEMENT & OWNERSHIP */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              3. Current Physical Placement & Organization
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Owner Organization</label>
                <select
                  value={ownerOrgId}
                  onChange={(e) => setOwnerOrgId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Enrolled Farm Station</label>
                <select
                  value={farmId}
                  onChange={(e) => {
                    setFarmId(e.target.value);
                    const matchingHerds = herds.filter((h) => h.farmId === e.target.value);
                    if (matchingHerds.length > 0) setHerdId(matchingHerds[0].id);
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Herd Assignment</label>
                <select
                  value={herdId}
                  onChange={(e) => setHerdId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  {herds
                    .filter((h) => h.farmId === farmId)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} • {h.purpose}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BREED COMPOSITION */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">4. Genetic Breed Composition</h2>
              <button
                type="button"
                onClick={addBreedRow}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Secondary Breed
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Total percentage across all listed breeds must mathematically equal 100%.
            </p>

            <div className="space-y-3">
              {breedList.map((breed, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Breed Name (e.g. Holstein, Angus, Jersey)..."
                      value={breed.breedName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBreedList((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, breedName: val } : item))
                        );
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                    />
                  </div>

                  <div className="w-24">
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={breed.percentage}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBreedList((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, percentage: val } : item))
                          );
                        }}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 pr-6"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-stone-400 font-bold">%</span>
                    </div>
                  </div>

                  <div className="w-36">
                    <select
                      value={breed.source}
                      onChange={(e) => {
                        const src = e.target.value;
                        setBreedList((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, source: src } : item))
                        );
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-stone-900"
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="GENOMIC">Genomic Assayed</option>
                      <option value="PEDIGREE">Pedigree Estimate</option>
                      <option value="PHENOTYPIC">Phenotypic</option>
                    </select>
                  </div>

                  {breedList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBreedRow(idx)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sum validation display */}
            <div
              className={`p-3 rounded-2xl flex items-center justify-between text-xs font-semibold ${
                isBreedValid ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              <span>Total Genetic Composition: {totalBreedPercentage}%</span>
              <span>{isBreedValid ? 'Valid (100%)' : 'Must equal exactly 100%'}</span>
            </div>
          </div>
        )}

        {/* STEP 5: PARENTAGE */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              5. Genealogical Lineage & Parentage
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Sire (Male Parent)</label>
                <select
                  value={sireId}
                  onChange={(e) => setSireId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="">No Sire Registered / Unknown</option>
                  {candidateSires.map((bull) => (
                    <option key={bull.id} value={bull.id}>
                      {bull.name} ({bull.primaryIdentifier || bull.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dam (Female Parent)</label>
                <select
                  value={damId}
                  onChange={(e) => setDamId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="">No Dam Registered / Unknown</option>
                  {candidateDams.map((cow) => (
                    <option key={cow.id} value={cow.id}>
                      {cow.name} ({cow.primaryIdentifier || cow.internalId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: MEDIA */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              6. Photos, DNA Cards & Documents
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Identification Photo URL</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Breed Association Certificate File</label>
              <input
                type="text"
                value={registrationDocName}
                onChange={(e) => setRegistrationDocName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & SUBMIT */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              7. Validation & Final Confirmation
            </h2>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Animal Name:</span>
                <span className="font-bold text-stone-900">{name || 'Unnamed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Biological Sex:</span>
                <span className="font-bold text-stone-900">{sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Primary Identifier:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {identifierList.find((i) => i.isPrimary)?.value || identifierList[0]?.value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Placement:</span>
                <span className="font-bold text-stone-900">
                  {farms.find((f) => f.id === farmId)?.name} • {herds.find((h) => h.id === herdId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Breed Composition:</span>
                <span className="font-bold text-stone-900">
                  {breedList.map((b) => `${b.percentage}% ${b.breedName}`).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Parentage:</span>
                <span className="font-bold text-stone-900">
                  Sire: {animals.find((a) => a.id === sireId)?.name || 'None'} • Dam: {animals.find((a) => a.id === damId)?.name || 'None'}
                </span>
              </div>
            </div>

            {!isBreedValid && (
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-semibold">
                Warning: Breed composition must total exactly 100% before registration can proceed.
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="inline-flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-submit-new-animal"
              type="button"
              disabled={!isBreedValid}
              onClick={handleFinalSubmit}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Complete & Enroll Animal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
