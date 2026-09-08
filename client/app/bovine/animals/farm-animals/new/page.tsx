'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Tag,
  Dna,
  HeartPulse,
  Scale,
  Camera,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { Sex, HornStatus, UseStatus, IdentifierType } from '@/lib/bovine-types';

export default function RegisterFarmAnimalPage() {
  const router = useRouter();
  const { farms, herds, groups, animals, addAnimal } = useBovine();

  // Section A: Basic Identification
  const [name, setName] = useState('');
  const [internalId, setInternalId] = useState(`GN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [earTag, setEarTag] = useState('');
  const [rfid, setRfid] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [sex, setSex] = useState<Sex>('FEMALE');
  const [useStatus, setUseStatus] = useState<UseStatus>('GENERAL');
  const [cattleClass, setCattleClass] = useState('Commercial Dairy Heifer');

  // Section B: Farm Assignment
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [herdId, setHerdId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Barn 2 - Pen A');
  const [owner, setOwner] = useState('North Valley Pastoral Cooperative');
  const [supervisor, setSupervisor] = useState('Dr. John Miller');

  // Section C: Physical Information
  const [currentWeightKg, setCurrentWeightKg] = useState('45.0');
  const [birthWeightKg, setBirthWeightKg] = useState('40.0');
  const [coatColor, setCoatColor] = useState('Black and White');
  const [frameSize, setFrameSize] = useState('Medium');
  const [birthCondition, setBirthCondition] = useState('Healthy / Vigorous');
  const [hornStatus, setHornStatus] = useState<HornStatus>('POLLED');

  // Section D: Breed Information
  const [primaryBreed, setPrimaryBreed] = useState('Holstein Friesian');
  const [breedPercentage, setBreedPercentage] = useState('100');
  const [breedingType, setBreedingType] = useState('PUREBRED');

  // Section E: Parents
  const [sireId, setSireId] = useState('');
  const [externalSireName, setExternalSireName] = useState('');
  const [damId, setDamId] = useState('');
  const [externalDamName, setExternalDamName] = useState('');
  const [parentageNotes, setParentageNotes] = useState('');

  // Section F: Health / Preventive State
  const [initialVaccinations, setInitialVaccinations] = useState('Bovi-Shield Gold FP5 L5 (At intake)');
  const [healthNotes, setHealthNotes] = useState('');

  // Section G: Media
  const [photoUrl, setPhotoUrl] = useState('');

  // Sires and Dams lists
  const potentialSires = animals.filter((a) => a.sex === 'MALE');
  const potentialDams = animals.filter((a) => a.sex === 'FEMALE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSire = animals.find((a) => a.id === sireId);
    const selectedDam = animals.find((a) => a.id === damId);

    const chosenEarTag = earTag.trim() || `TAG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAnimalId = addAnimal({
      animal: {
        internalId: internalId || `GN-${Date.now()}`,
        name: name || `Calf ${chosenEarTag}`,
        sex,
        birthDate,
        birthWeightKg: parseFloat(birthWeightKg) || undefined,
        currentWeightKg: parseFloat(currentWeightKg) || undefined,
        lifeStatus: 'ALIVE',
        useStatus,
        classification: 'FARM_ANIMAL',
        isBreedingStock: false,
        coatColor,
        hornStatus,
        ownerOrgId: 'org-apex',
        farmId: farmId || farms[0]?.id,
        herdId: herdId || herds.find((h) => h.farmId === farmId)?.id || herds[0]?.id,
        managementGroupId: groupId || undefined,
        registrationStatus: 'PENDING',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
        requiresReview: false,
        latestConditionScore: 4.0,
        breed: primaryBreed,
        primaryIdentifier: chosenEarTag,
        primaryIdentifierType: 'EAR_TAG',
        sireId: sireId || undefined,
        sireName: selectedSire?.name || (externalSireName ? externalSireName : undefined),
        damId: damId || undefined,
        damName: selectedDam?.name || (externalDamName ? externalDamName : undefined),
      },
      identifiers: [
        {
          type: 'EAR_TAG',
          value: chosenEarTag,
          issuer: 'Farm Management Office',
          country: 'USA',
          isPrimary: true,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        ...(rfid.trim()
          ? [
              {
                type: 'RFID_EID' as IdentifierType,
                value: rfid.trim(),
                issuer: 'National Livestock Identification',
                country: 'USA',
                isPrimary: false,
                issueDate: birthDate,
                status: 'ACTIVE' as const,
              },
            ]
          : []),
      ],
      breedComposition: [
        {
          breedId: 'breed-1',
          breedName: primaryBreed,
          percentage: parseFloat(breedPercentage) || 100,
          source: 'OWNER_REPORTED',
          confidence: 'HIGH',
          recordedDate: birthDate,
        },
      ],
      parentage: {
        sireId: sireId || undefined,
        sireName: selectedSire?.name || externalSireName || undefined,
        sireStatus: sireId ? 'RECORDED' : 'PROPOSED',
        damId: damId || undefined,
        damName: selectedDam?.name || externalDamName || undefined,
        damStatus: damId ? 'RECORDED' : 'PROPOSED',
        source: 'INTAKE_REGISTRATION',
        confidence: 'HIGH',
        notes: parentageNotes || undefined,
      },
      initialPhoto: photoUrl,
    });

    router.push(`/bovine/animals/farm-animals/${newAnimalId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
        <Link
          href="/bovine/animals/farm-animals"
          className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Farm Livestock Registration Form</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Register Farm / Herd Animal</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A: Basic Identification */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <Tag className="w-4 h-4 text-emerald-700" />
            <span>Section A — Basic Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Animal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maple Blossom 104"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                GN / Internal ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={internalId}
                onChange={(e) => setInternalId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ear Tag Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={earTag}
                onChange={(e) => setEarTag(e.target.value)}
                placeholder="e.g. TAG-4821"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">RFID / EID (15-digit)</label>
              <input
                type="text"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                placeholder="982 000 123 456 789"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Sex)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="FEMALE">Female (Heifer / Cow)</option>
                <option value="MALE">Male (Bull / Steer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Livestock Use Status</label>
              <select
                value={useStatus}
                onChange={(e) => setUseStatus(e.target.value as UseStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="GENERAL">General Herd</option>
                <option value="RECIPIENT">ET Recipient Candidate</option>
                <option value="DONOR">Donor Candidate</option>
                <option value="BREEDING_STOCK">Breeding Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Cattle Class</label>
              <input
                type="text"
                value={cattleClass}
                onChange={(e) => setCattleClass(e.target.value)}
                placeholder="Commercial Dairy Heifer"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section B: Farm Assignment */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Section B — Farm Assignment &amp; Custody</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Farm</label>
              <select
                value={farmId}
                onChange={(e) => {
                  setFarmId(e.target.value);
                  setHerdId('');
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Herd Directory</label>
              <select
                value={herdId}
                onChange={(e) => setHerdId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">Default Farm Herd</option>
                {herds
                  .filter((h) => !farmId || h.farmId === farmId)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.purpose})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Management Pen / Group</label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">Unassigned Group</option>
                {groups
                  .filter((g) => !farmId || g.farmId === farmId)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Pen / Pasture Location</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Barn 2 - Pen A"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Owner / Syndicate</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Supervisor</label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section C: Physical Information */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Section C — Physical Conformation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Current Scale Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">Coat Color &amp; Pattern</label>
              <input
                type="text"
                value={coatColor}
                onChange={(e) => setCoatColor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Frame / Size</label>
              <select
                value={frameSize}
                onChange={(e) => setFrameSize(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="Small">Small Frame</option>
                <option value="Medium">Medium Frame</option>
                <option value="Large">Large Frame</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Condition</label>
              <input
                type="text"
                value={birthCondition}
                onChange={(e) => setBirthCondition(e.target.value)}
                placeholder="Healthy / Vigorous"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Horn Status</label>
              <select
                value={hornStatus}
                onChange={(e) => setHornStatus(e.target.value as HornStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="POLLED">Polled (Naturally Hornless)</option>
                <option value="HORNED">Horned</option>
                <option value="DEHORNED">Dehorned</option>
                <option value="SCURRED">Scurred</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section D: Breed Information */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <Dna className="w-4 h-4 text-emerald-700" />
            <span>Section D — Breed &amp; Genetics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Breed</label>
              <select
                value={primaryBreed}
                onChange={(e) => setPrimaryBreed(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
              >
                <option value="Holstein Friesian">Holstein Friesian</option>
                <option value="Aberdeen Angus">Aberdeen Angus</option>
                <option value="Red Angus">Red Angus</option>
                <option value="Jersey">Jersey</option>
                <option value="Gyr">Gyr</option>
                <option value="Simmental">Simmental</option>
                <option value="Nelore">Nelore</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Breed Percentage (%)</label>
              <input
                type="number"
                value={breedPercentage}
                onChange={(e) => setBreedPercentage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Breeding Type</label>
              <select
                value={breedingType}
                onChange={(e) => setBreedingType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="PUREBRED">Purebred</option>
                <option value="CROSSBRED">Crossbred</option>
                <option value="COMPOSITE">Synthetic Composite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section E: Parents */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Section E — Pedigree &amp; Parent Selection</span>
          </div>
          <p className="text-xs text-stone-500">
            Select existing registered animals to automatically build parent, grandparent, and great-grandparent lineage from verified records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-800">Sire (Father)</label>
              <select
                value={sireId}
                onChange={(e) => {
                  setSireId(e.target.value);
                  if (e.target.value) setExternalSireName('');
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">-- Choose Registered Sire --</option>
                {potentialSires.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.primaryIdentifier || s.internalId})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-stone-500 font-medium">Or enter external sire reference:</div>
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
              <label className="block text-xs font-bold text-stone-800">Dam (Mother)</label>
              <select
                value={damId}
                onChange={(e) => {
                  setDamId(e.target.value);
                  if (e.target.value) setExternalDamName('');
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">-- Choose Registered Dam --</option>
                {potentialDams.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.primaryIdentifier || d.internalId})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-stone-500 font-medium">Or enter external dam reference:</div>
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

        {/* Section F: Health & Media */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            <span>Section F &amp; G — Health, Preventive State &amp; Photo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Vaccines Administered</label>
              <input
                type="text"
                value={initialVaccinations}
                onChange={(e) => setInitialVaccinations(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Animal Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical / Health Notes</label>
              <textarea
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                rows={2}
                placeholder="Initial pen check observations, feeding vigor, and physical soundness remarks..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href="/bovine/animals/farm-animals"
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Confirm &amp; Register Farm Animal
          </button>
        </div>
      </form>
    </div>
  );
}
