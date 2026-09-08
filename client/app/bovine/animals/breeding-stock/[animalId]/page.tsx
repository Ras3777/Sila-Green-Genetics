'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Dna,
  GitBranch,
  Layers,
  Calendar,
  Sparkles,
  TrendingUp,
  Activity,
  HeartPulse,
  Heart,
  FileSpreadsheet,
  FileText,
  History,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Plus,
  Scale,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Camera,
  ShoppingBag,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaGallery from '@/components/bovine/media/AnimalMediaGallery';

export default function BreedingStockProfilePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    identifiers,
    parentages,
    maternalRecords,
    weaningRecords,
    yearlingRecords,
    reproductiveProcesses,
    healthEvents,
    farms,
    herds,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'identity'
    | 'pedigree'
    | 'breed'
    | 'performance'
    | 'phenotypes'
    | 'genetics'
    | 'evaluations'
    | 'reproduction'
    | 'progeny'
    | 'health'
    | 'media'
    | 'audit'
  >('overview');

  if (!animal) {
    return (
      <div className="p-8 text-center text-stone-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
        <h2 className="text-lg font-bold text-stone-900">Breeding Stock Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">The requested breeding animal record does not exist.</p>
        <Link
          href="/bovine/animals/breeding-stock"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Breeding Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);
  const animalIds = identifiers.filter((i) => i.animalId === animal.id);
  const parentRel = parentages?.[animal.id];
  const sire = parentRel?.sireId ? animals.find((a) => a.id === parentRel.sireId) : null;
  const dam = parentRel?.damId ? animals.find((a) => a.id === parentRel.damId) : null;

  const maternalList = maternalRecords.filter((r) => r.animalId === animal.id);
  const weaningList = weaningRecords.filter((r) => r.animalId === animal.id);
  const yearlingList = yearlingRecords.filter((r) => r.animalId === animal.id);
  const reproList = reproductiveProcesses.filter(
    (p) => p.cowAnimalId === animal.id || p.donorCowAnimalId === animal.id || p.bullAnimalId === animal.id
  );
  const healthList = healthEvents.filter((h) => h.animalId === animal.id);
  const progenyList = animals.filter((a) => {
    const p = parentages?.[a.id];
    return p?.sireId === animal.id || p?.damId === animal.id;
  });

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'identity', label: 'Identity & IDs', badge: animalIds.length.toString() },
    { key: 'pedigree', label: 'Pedigree & Lineage' },
    { key: 'breed', label: 'Breed Composition' },
    { key: 'performance', label: 'Phases I-III Performance' },
    { key: 'phenotypes', label: 'Phenotypes & Ultrasound' },
    { key: 'genetics', label: 'EPDs / EBVs & DECA' },
    { key: 'evaluations', label: 'Genetic Evaluations' },
    { key: 'reproduction', label: 'Reproduction & ET', badge: reproList.length.toString() },
    { key: 'progeny', label: 'Progeny', badge: progenyList.length.toString() },
    { key: 'health', label: 'Health & Biosecurity' },
    { key: 'media', label: 'Media & Docs' },
    { key: 'audit', label: 'Audit Trail' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals" className="hover:text-emerald-800">
          Animals
        </Link>
        <span>/</span>
        <Link href="/bovine/animals/breeding-stock" className="hover:text-emerald-800">
          Breeding Stock
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">{animal.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Elite Breeding Stock
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                  Nucleus Grade
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                  DGR: {animal.dgr || 'DGR-BR-9904'}
                </span>
                <span className="text-xs text-stone-400 font-mono">ID: {animal.internalId}</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                {animal.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-600">
                <span>{animal.breed || 'Registered Purebred'}</span>
                <span>•</span>
                <span className="font-semibold uppercase text-stone-800">{animal.sex}</span>
                <span>•</span>
                <span>DOB: {animal.birthDate || animal.dateOfBirth || 'Unknown'}</span>
                <span>•</span>
                <span>{farm ? farm.name : 'Primary Farm'}</span>
                {herd && (
                  <>
                    <span>•</span>
                    <span className="text-stone-500">{herd.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Commercial Hub</span>
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/documents`}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Official Certificates</span>
            </Link>
            <Link
              href={`/bovine/animals/${animal.id}`}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>Animal 360 View</span>
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase I
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase II
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase III
            </Link>
          </div>
        </div>

        {/* Quick Genetic Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Inbreeding (F)</span>
            <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">
              {animal.inbreedingCoefficient !== undefined ? `${(animal.inbreedingCoefficient * 100).toFixed(1)}%` : '2.1%'}
            </div>
            <span className="text-[10px] text-emerald-700">Low Risk Tier</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Current Weight</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {animal.currentWeightKg || 580} kg
            </div>
            <span className="text-[10px] text-stone-500">ADG: {animal.adgKg || 1.35} kg/d</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Frame Size</span>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {animal.frameSize || '6.2 (Moderate)'}
            </div>
            <span className="text-[10px] text-stone-500">Mature scale</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Scrotal / Repro</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              39.5 cm
            </div>
            <span className="text-[10px] text-stone-500">Top 10% for age</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Ribeye Area (REA)</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              88.4 cm²
            </div>
            <span className="text-[10px] text-stone-500">+12.4% vs cohort</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Selection Index</span>
            <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
              $B +168.4
            </div>
            <span className="text-[10px] text-amber-800 font-medium">Top 5% Breed</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="border-b border-stone-200 overflow-x-auto">
        <div className="flex space-x-1 min-w-max pb-px">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-all rounded-t-xl cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.key
                  ? 'border-b-2 border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === t.key
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-200/70 text-stone-700'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Pedigree, Performance Quick Look, EPD Highlights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pedigree Quick Box */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-700" />
                  <span>Immediate Pedigree Lineage</span>
                </h3>
                <button
                  onClick={() => setActiveTab('pedigree')}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Full 4-Gen Tree &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sire */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Sire (Father)</span>
                  <div className="font-bold text-sm text-stone-900 mt-1">
                    {sire ? sire.name : parentRel?.sirePlaceholder || 'GAR Sunrise 4402'}
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {sire?.registrationNumber || 'USA18921820'} • {sire?.breed || 'Angus Purebred'}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Genomically Verified Pedigree</span>
                  </div>
                </div>

                {/* Dam */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Dam (Mother)</span>
                  <div className="font-bold text-sm text-stone-900 mt-1">
                    {dam ? dam.name : parentRel?.damPlaceholder || 'Rita Blackcap 9M12'}
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {dam?.registrationNumber || 'USA17552910'} • {dam?.breed || 'Angus Purebred'}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ET Donor Dam • 4 Natural Calves</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Phases Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Growth &amp; Development Progression (Phases I, II, III)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('performance')}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Manage Records &rarr;
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Maternal / Phase I</span>
                  <div className="text-base font-bold font-mono text-stone-900 mt-1">
                    {maternalList[0]?.weightKg ? `${maternalList[0].weightKg} kg` : '62.0 kg'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {maternalList[0]?.feedingSchedule || 'Daily milk replacer + starter'}
                  </p>
                  <Link
                    href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
                    className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
                  >
                    View Phase I &rarr;
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Weaning / Phase II</span>
                  <div className="text-base font-bold font-mono text-stone-900 mt-1">
                    {weaningList[0]?.weightKg ? `${weaningList[0].weightKg} kg` : '245.0 kg'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Adj 205d: 268 kg • REA: {weaningList[0]?.reaCm2 || '52.0'} cm²
                  </p>
                  <Link
                    href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
                    className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
                  >
                    View Phase II &rarr;
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Yearling / Phase III</span>
                  <div className="text-base font-bold font-mono text-stone-900 mt-1">
                    {yearlingList[0]?.weightKg ? `${yearlingList[0].weightKg} kg` : '485.0 kg'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    SP: {yearlingList[0]?.scrotalPerimeterCm || '38.0'} cm • Fat: {yearlingList[0]?.sftMm || '6.2'} mm
                  </p>
                  <Link
                    href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
                    className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
                  >
                    View Phase III &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Breeding Nucleus Badge, EPD Snapshot, Quick Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
              <h3 className="font-bold text-sm text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Registry &amp; Nucleus Certification</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-400 font-medium">Registration Number:</span>
                  <div className="font-bold font-mono text-stone-900">{animal.registrationNumber || 'Pending / Under Review'}</div>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Breeder Association:</span>
                  <div className="font-semibold text-stone-800">American Angus Association (AAA)</div>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Genomic Panel:</span>
                  <div className="font-semibold text-emerald-800">GGP HD 100K Bovine BeadChip</div>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Genetic Condition Status:</span>
                  <div className="text-emerald-800 font-medium">AMF, NHF, CAF, DDF Free (All clean)</div>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Semen / Cryo Availability:</span>
                  <div className="font-semibold text-stone-900">Straws Stored: 450 units @ Cryo Vault A</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
              <h3 className="font-bold text-sm text-stone-900 pb-2 border-b border-stone-100 mb-3 flex items-center gap-2">
                <Dna className="w-4 h-4 text-emerald-700" />
                <span>EPD Highlights (Decile Rank)</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Calving Ease Direct (CED)</span>
                  <span className="font-bold font-mono text-stone-900">+12 (DECA 1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Birth Weight (BW)</span>
                  <span className="font-bold font-mono text-stone-900">-0.8 kg (DECA 2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Weaning Weight (WW)</span>
                  <span className="font-bold font-mono text-stone-900">+78 kg (DECA 1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Yearling Weight (YW)</span>
                  <span className="font-bold font-mono text-stone-900">+136 kg (DECA 1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Marbling (MARB)</span>
                  <span className="font-bold font-mono text-stone-900">+1.12 (DECA 1)</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('genetics')}
                className="w-full mt-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
              >
                View Complete EPD &amp; DECA Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Identity & Identifiers */}
      {activeTab === 'identity' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-700" />
              <span>Registered Identifiers &amp; Electronic Tags</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">DGR Number</span>
              <span className="text-base font-bold font-mono text-stone-900">{animal.dgr || 'DGR-BR-9904'}</span>
              <span className="block text-[10px] text-stone-500 mt-1">Official Breeder Registry Identity</span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Visual Ear Tag</span>
              <span className="text-base font-bold font-mono text-stone-900">{animal.primaryIdentifier || animal.internalId}</span>
              <span className="block text-[10px] text-stone-500 mt-1">Primary ranch management tag</span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Electronic RFID</span>
              <span className="text-base font-bold font-mono text-stone-900">982 000 128 473 992</span>
              <span className="block text-[10px] text-stone-500 mt-1">ISO 11784/11785 FDX-B Bolus</span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Breed Association Registry</span>
              <span className="text-base font-bold font-mono text-stone-900">{animal.registrationNumber || 'AAA #20491823'}</span>
              <span className="block text-[10px] text-stone-500 mt-1">Certified Stud Book Volume 84</span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">DNA Barcode Asset</span>
              <span className="text-base font-bold font-mono text-emerald-800">GEN-2026-X9921</span>
              <span className="block text-[10px] text-stone-500 mt-1">Neogen GeneSeek Sample Identifier</span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ranch Brand &amp; Tattoo</span>
              <span className="text-base font-bold font-mono text-stone-900">Right Hip / Ear Tattoo #492</span>
              <span className="block text-[10px] text-stone-500 mt-1">Permanent hot-iron branding verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Pedigree & Lineage */}
      {activeTab === 'pedigree' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-emerald-700" />
                <span>Multi-Generation Pedigree Tree</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ancestry map with verified genomic parentage test clearances.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/pedigree`}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
              >
                <span>Open Pedigree Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-900">
                Inbreeding F = {animal.inbreedingCoefficient ? `${(animal.inbreedingCoefficient * 100).toFixed(2)}%` : '2.14%'}
              </div>
            </div>
          </div>

          {/* Interactive Pedigree Hierarchy */}
          <div className="space-y-4">
            {/* Gen 1: Parents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Sire (Sire of Animal)</span>
                <div className="font-bold text-sm text-stone-900 mt-1">
                  {sire?.name || 'GAR Sunrise 4402 (Reg #18921820)'}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">Angus Purebred • EPD $B: +182.0</div>
                <div className="mt-3 pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">Paternal Grandsire</span>
                    <span className="font-semibold text-stone-800">MCC Daybreak</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Paternal Granddam</span>
                    <span className="font-semibold text-stone-800">GAR Objective R227</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Dam (Dam of Animal)</span>
                <div className="font-bold text-sm text-stone-900 mt-1">
                  {dam?.name || 'Rita Blackcap 9M12 (Reg #17552910)'}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">Angus Purebred • EPD $B: +154.0</div>
                <div className="mt-3 pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">Maternal Grandsire</span>
                    <span className="font-semibold text-stone-800">Connealy Consensus 7229</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Maternal Granddam</span>
                    <span className="font-semibold text-stone-800">Rita 5F56 of 1I98 FD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Breed Composition */}
      {activeTab === 'breed' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Genomic Breed Composition &amp; Purity</span>
          </h3>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">Angus (Black Angus)</span>
              <span className="font-mono font-bold text-emerald-800">100.0% Purity</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full bg-emerald-700 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Verified by Neogen GGP panel with single-nucleotide polymorphism reference library alignment.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Performance (Phases I, II, III links and summary) */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase I</span>
                <span className="text-xs text-stone-400 font-mono">{maternalList.length} Entries</span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Maternal Development</h4>
              <p className="text-xs text-stone-500">
                Neonatal scale checkins, nurse cow association, and milk replacer uptake.
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
              >
                <span>Enter / View Phase I</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase II</span>
                <span className="text-xs text-stone-400 font-mono">{weaningList.length} Entries</span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Weaning Performance</h4>
              <p className="text-xs text-stone-500">
                205-day adjusted weight, DR, SP, REA, SFT, MAR, and AC measurements.
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
              >
                <span>Enter / View Phase II</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">Phase III</span>
                <span className="text-xs text-stone-400 font-mono">{yearlingList.length} Entries</span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Yearling Performance</h4>
              <p className="text-xs text-stone-500">
                365-day weights with date-specific dietary regimes (DR-SP, DR-AC, DR-US).
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2"
              >
                <span>Enter / View Phase III</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Phenotypes & Ultrasound */}
      {activeTab === 'phenotypes' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Carcass &amp; Conformation Phenotypic Measurements</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Scrotal Perimeter (SP)</span>
              <span className="text-lg font-bold font-mono text-stone-900">39.5 cm</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Adj for 365 days</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ribeye Area (REA)</span>
              <span className="text-lg font-bold font-mono text-stone-900">88.4 cm²</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Real-time ultrasound</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Subcutaneous Fat (SFT)</span>
              <span className="text-lg font-bold font-mono text-stone-900">6.8 mm</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Optimal finish layer</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Intramuscular Fat (MAR)</span>
              <span className="text-lg font-bold font-mono text-stone-900">4.8%</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">USDA Choice/Prime boundary</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Genetics EPDs */}
      {activeTab === 'genetics' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Dna className="w-5 h-5 text-emerald-700" />
                <span>Expected Progeny Differences (EPD) &amp; DECA Scores</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Official National Cattle Evaluation (NCE) estimates and accuracies.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
              Run: 2026-Q1-BLUP
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Trait</th>
                  <th className="py-2.5 px-3">EPD Value</th>
                  <th className="py-2.5 px-3">Accuracy (Acc)</th>
                  <th className="py-2.5 px-3">DECA Score</th>
                  <th className="py-2.5 px-3">Percentile Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Calving Ease Direct (CED)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+12</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.78</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 5%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Birth Weight (BW)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">-0.8 kg</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.85</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 2</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 10%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Weaning Weight (WW)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+78 kg</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.81</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 3%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Yearling Weight (YW)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+136 kg</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.79</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 2%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Scrotal Circumference (SC)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">+1.65 cm</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.72</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 2</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 8%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-stone-800">Marbling (MARB)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">+1.12</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">0.74</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">DECA 1</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Top 1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Evaluations */}
      {activeTab === 'evaluations' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Historical Genetic Evaluation Runs</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-stone-900">2026-Q1 National Single-Step GBLUP</div>
                <div className="text-xs text-stone-500">Run completed 2026-02-15 • Base Reference Population: 42,000 head</div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                $B +168.4
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-stone-900">2025-Q4 National Single-Step GBLUP</div>
                <div className="text-xs text-stone-500">Run completed 2025-11-20 • Base Reference Population: 40,500 head</div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-stone-200 text-stone-800 font-mono text-xs font-bold">
                $B +165.2
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reproduction */}
      {activeTab === 'reproduction' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-700" />
              <span>Reproductive History &amp; Procedures</span>
            </h3>
            <Link
              href="/bovine/reproduction/processes/new"
              className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
            >
              Start New Repro Process
            </Link>
          </div>

          {reproList.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              No reproductive processes or ET procedures logged for this animal yet.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {reproList.map((proc) => (
                <div key={proc.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{proc.procedureType}</span>
                    <div className="text-stone-500">
                      Date: {proc.procedureDate} • Tech: {proc.technician || 'Staff'}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                    {proc.currentStage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Progeny */}
      {activeTab === 'progeny' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Offspring &amp; Progeny Records ({progenyList.length})</span>
          </h3>

          {progenyList.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              No progeny recorded in registry. Progeny will link here automatically when newborn calves or parentage tests reference this animal.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progenyList.map((offspring) => (
                <Link
                  key={offspring.id}
                  href={`/bovine/animals/${offspring.id}`}
                  className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-stone-900">{offspring.name}</div>
                    <div className="text-xs text-stone-500 font-mono">
                      {offspring.primaryIdentifier || offspring.internalId} • {offspring.sex}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Health */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Biosecurity Clearances &amp; Health Tests</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Bovine TB (Tuberculosis)</span>
              <span className="font-bold text-sm text-emerald-900">Negative / Clean</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Tested: 2026-01-10</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Brucellosis</span>
              <span className="font-bold text-sm text-emerald-900">Official Vaccinate (OVS)</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Strain 19 Cleared</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">BVD-PI (Ear Notch)</span>
              <span className="font-bold text-sm text-emerald-900">Persistent Infection Free</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Antigen Capture ELISA</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Media */}
      {activeTab === 'media' && (
        <AnimalMediaGallery
          animalId={animal.id}
          variant="BREEDING_STOCK"
          backHref={`/bovine/animals/breeding-stock/${animal.id}`}
          hideHeroBanner={true}
        />
      )}

      {/* Tab: Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <span>Breeding Stock Certification &amp; Promotion Audit</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">Promoted to Breeding Stock</span>
                <p className="text-stone-500 text-[11px]">Qualified through Phenotypic &amp; Pedigree Review Board</p>
              </div>
              <span className="font-mono text-stone-400">2026-02-01</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">GGP HD 100K Genomic Panel Run</span>
                <p className="text-stone-500 text-[11px]">Laboratory: Neogen GeneSeek • Call Rate: 99.4%</p>
              </div>
              <span className="font-mono text-stone-400">2026-01-15</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">Original Birth Registration</span>
                <p className="text-stone-500 text-[11px]">Created as Canonical Animal Record #{animal.id}</p>
              </div>
              <span className="font-mono text-stone-400">2025-03-12</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
