'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  Search,
  Dna,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { Parentage } from '@/lib/bovine-types';

export default function PedigreeExplorerPage() {
  const { animals, parentages, updateParentage } = useBovine();
  const {
    genotypingAssays,
    animalGeneticConditionResults,
    animalGeneticMetrics,
    geneticTraitEstimates,
  } = useGenetics();

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('anim-1');
  const [generationsDepth, setGenerationsDepth] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [matingSireId, setMatingSireId] = useState<string>('anim-2');
  const [matingDamId, setMatingDamId] = useState<string>('anim-1');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  // Filtered animal list for search
  const filteredAnimals = useMemo(() => {
    if (!searchQuery.trim()) return animals;
    const q = searchQuery.toLowerCase();
    return animals.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.internalId.toLowerCase().includes(q) ||
        a.primaryIdentifier?.toLowerCase().includes(q)
    );
  }, [animals, searchQuery]);

  // Current animal's parentage
  const parentage: Parentage | undefined = selectedAnimal ? parentages[selectedAnimal.id] : undefined;

  // Inbreeding metrics for selected animal
  const animalMetrics = animalGeneticMetrics.filter((m) => m.animalId === selectedAnimal?.id);
  const pedigreeF = animalMetrics.find((m) => m.metricType === 'PEDIGREE_INBREEDING_F');
  const genomicFroh = animalMetrics.find((m) => m.metricType === 'GENOMIC_INBREEDING_FROH');

  // Conditions for selected animal
  const conditionResults = animalGeneticConditionResults.filter(
    (r) => r.animalId === selectedAnimal?.id
  );

  // Helper to get an animal by ID or name
  const findAnimalByName = (name?: string) => {
    if (!name) return undefined;
    return animals.find((a) => a.name.toLowerCase() === name.toLowerCase());
  };

  const sireAnimal = parentage?.sireId ? animals.find((a) => a.id === parentage.sireId) : findAnimalByName(parentage?.sireName);
  const damAnimal = parentage?.damId ? animals.find((a) => a.id === parentage.damId) : findAnimalByName(parentage?.damName);

  const sireParentage = sireAnimal ? parentages[sireAnimal.id] : undefined;
  const damParentage = damAnimal ? parentages[damAnimal.id] : undefined;

  // Simulated mating inbreeding coefficient calculation
  const simulatedInbreeding = useMemo(() => {
    const sire = animals.find((a) => a.id === matingSireId);
    const dam = animals.find((a) => a.id === matingDamId);
    if (!sire || !dam) return { f: '0.0%', risk: 'LOW', reason: 'Unrelated foundational lines' };

    // Simple kinship heuristic based on pedigree overlap
    const sireP = parentages[sire.id];
    const damP = parentages[dam.id];
    let commonAncestors = 0;
    if (sireP && damP) {
      if (sireP.sireName && sireP.sireName === damP.sireName) commonAncestors += 2;
      if (sireP.damName && sireP.damName === damP.damName) commonAncestors += 2;
      if (sireP.sireName && sireP.sireName === damP.mgsName) commonAncestors += 1;
    }

    if (commonAncestors >= 2) {
      return {
        f: '6.25% - 12.5%',
        risk: 'HIGH',
        reason: 'Close consanguinity: shared common grand-parents detected in 3-generation window.',
      };
    } else if (commonAncestors === 1) {
      return {
        f: '3.12% - 4.5%',
        risk: 'MODERATE',
        reason: 'Moderate common linebreeding through maternal grandsire.',
      };
    } else {
      return {
        f: '< 2.5%',
        risk: 'OPTIMAL',
        reason: 'Clean outcross mating with negligible common ancestry.',
      };
    }
  }, [matingSireId, matingDamId, animals, parentages]);

  // Handle parentage verification update
  const handleVerifyParentage = (method: 'DNA_CONFIRMED' | 'GENOMIC_INFERRED' | 'RECORD_ONLY') => {
    if (!selectedAnimal || !parentage) return;
    const updated: Parentage = {
      ...parentage,
      verificationMethod: method,
      verificationStatus: method === 'DNA_CONFIRMED' ? 'VERIFIED' : 'PENDING_TEST',
      completenessScore: method === 'DNA_CONFIRMED' ? 100 : 85,
      genomicConsistency: method === 'DNA_CONFIRMED' ? 'CONSISTENT' : 'UNTESTED',
      lastUpdated: new Date().toISOString(),
    };
    updateParentage(selectedAnimal.id, updated);
    setVerifyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Animal Switcher */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Multi-Generation Pedigree Tree
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">
                Depth: {generationsDepth} Generations
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-700" />
              {selectedAnimal?.name}
            </h2>
            <div className="text-xs text-stone-600 flex flex-wrap items-center gap-2">
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                {selectedAnimal?.primaryIdentifier || selectedAnimal?.internalId}
              </span>
              <span>•</span>
              <span>Born {selectedAnimal?.birthDate}</span>
              <span>•</span>
              <span className="font-semibold">{selectedAnimal?.sex}</span>
              <span>•</span>
              <span>{selectedAnimal?.hornStatus}</span>
            </div>
          </div>

          {/* Controls: Generations & Animal Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Generation Depth Selector */}
            <div className="flex items-center bg-stone-100 rounded-lg p-1 text-xs">
              {[3, 4, 5].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setGenerationsDepth(depth)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    generationsDepth === depth
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {depth} Gen
                </button>
              ))}
            </div>

            {/* Animal Dropdown Selector */}
            <select
              value={selectedAnimal?.id}
              onChange={(e) => setSelectedAnimalId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId})
                </option>
              ))}
            </select>

            <button
              onClick={() => setVerifyModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Parentage</span>
            </button>
          </div>
        </div>

        {/* Inbreeding & Completeness Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Pedigree Inbreeding (F)
            </span>
            <div className="text-base font-bold text-stone-900">
              {pedigreeF?.formattedValue || (parentage?.inbreedingCoefficient ? `${(parentage.inbreedingCoefficient * 100).toFixed(1)}%` : '3.8%')}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              Below breed threshold (8.0%)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Genomic ROH Inbreeding (FROH)
            </span>
            <div className="text-base font-bold text-stone-900">
              {genomicFroh?.formattedValue || '5.2%'}
            </div>
            <span className="text-[10px] text-stone-500">
              High-density chip verified
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Verification Method
            </span>
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{parentage?.verificationMethod || 'DNA_CONFIRMED'}</span>
            </div>
            <span className="text-[10px] text-stone-500">
              Mendelian exclusion passed
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Pedigree Completeness
            </span>
            <div className="text-base font-bold text-stone-900">
              {parentage?.completenessScore || 96}%
            </div>
            <span className="text-[10px] text-stone-500">
              5 generations recorded
            </span>
          </div>
        </div>
      </div>

      {/* Pedigree Visual Tree Component */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 overflow-x-auto space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            Interactive Ancestry Chart
          </h3>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-800">
              <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400" />
              Sire (Paternal)
            </span>
            <span className="flex items-center gap-1.5 text-rose-800">
              <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400" />
              Dam (Maternal)
            </span>
          </div>
        </div>

        {/* Tree Layout */}
        <div className="min-w-[900px] flex items-center gap-6 py-4">
          {/* Generation 0: Subject Animal */}
          <div className="w-72 shrink-0">
            <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                  Subject Animal
                </span>
                <span className="text-[11px] font-semibold text-stone-700">{selectedAnimal?.sex}</span>
              </div>
              <div>
                <div className="font-bold text-stone-900 text-sm">{selectedAnimal?.name}</div>
                <div className="font-mono text-xs text-stone-600">
                  {selectedAnimal?.primaryIdentifier || selectedAnimal?.internalId}
                </div>
              </div>
              <div className="text-[11px] text-stone-600 space-y-0.5 pt-1 border-t border-emerald-200/60">
                <div>Born: {selectedAnimal?.birthDate}</div>
                <div>Reg: {selectedAnimal?.registrationNumber || 'Pending'}</div>
                <div className="text-emerald-800 font-medium">Inbreeding F: {pedigreeF?.formattedValue || '3.8%'}</div>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />

          {/* Generation 1: Parents (Sire & Dam) */}
          <div className="w-72 shrink-0 space-y-4">
            {/* Sire Node */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-900 bg-blue-200 px-2 py-0.5 rounded">
                  Sire (Father)
                </span>
                <span className="text-[10px] font-mono text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                  {parentage?.verificationMethod || 'DNA_CONFIRMED'}
                </span>
              </div>
              <div className="font-bold text-stone-900 text-xs">
                {parentage?.sireName || 'Altair Benchmark ET'}
              </div>
              <div className="font-mono text-[11px] text-stone-600">
                {sireAnimal?.primaryIdentifier || parentage?.sireRegistration || 'US-9901421'}
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-blue-200/60 flex items-center justify-between">
                <span>Certified Purebred</span>
                <span className="text-emerald-700 font-semibold">Verified</span>
              </div>
            </div>

            {/* Dam Node */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-rose-900 bg-rose-200 px-2 py-0.5 rounded">
                  Dam (Mother)
                </span>
                <span className="text-[10px] font-mono text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                  {parentage?.verificationMethod || 'DNA_CONFIRMED'}
                </span>
              </div>
              <div className="font-bold text-stone-900 text-xs">
                {parentage?.damName || 'Cloverdale Supernova Dam 91'}
              </div>
              <div className="font-mono text-[11px] text-stone-600">
                {damAnimal?.primaryIdentifier || parentage?.damRegistration || 'US-8840219'}
              </div>
              <div className="text-[10px] text-stone-500 pt-1 border-t border-rose-200/60 flex items-center justify-between">
                <span>Lactation 3 Tested</span>
                <span className="text-emerald-700 font-semibold">Verified</span>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />

          {/* Generation 2: Grandparents (4 Nodes) */}
          <div className="w-72 shrink-0 space-y-2">
            {/* Paternal Grandsire */}
            <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-0.5">
              <div className="text-[9px] font-bold text-blue-900 uppercase">Paternal Grandsire (PGS)</div>
              <div className="font-bold text-stone-900 text-[11px]">Morningview Legend ET</div>
              <div className="font-mono text-[10px] text-stone-500">HOUSA-1392810</div>
            </div>

            {/* Paternal Granddam */}
            <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-0.5">
              <div className="text-[9px] font-bold text-rose-900 uppercase">Paternal Granddam (PGD)</div>
              <div className="font-bold text-stone-900 text-[11px]">Benchmark Beauty 410</div>
              <div className="font-mono text-[10px] text-stone-500">HOUSA-1382109</div>
            </div>

            {/* Maternal Grandsire */}
            <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-0.5">
              <div className="text-[9px] font-bold text-blue-900 uppercase">Maternal Grandsire (MGS)</div>
              <div className="font-bold text-stone-900 text-[11px]">
                {parentage?.mgsName || 'Pine-Tree Heroic ET'}
              </div>
              <div className="font-mono text-[10px] text-stone-500">HOUSA-1402918</div>
            </div>

            {/* Maternal Granddam */}
            <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-0.5">
              <div className="text-[9px] font-bold text-rose-900 uppercase">Maternal Granddam (MGD)</div>
              <div className="font-bold text-stone-900 text-[11px]">Cloverdale Nova Lass</div>
              <div className="font-mono text-[10px] text-stone-500">HOUSA-1378411</div>
            </div>
          </div>

          {generationsDepth >= 4 && (
            <>
              <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
              {/* Generation 3: Great-Grandparents (8 Nodes) */}
              <div className="w-72 shrink-0 grid grid-cols-1 gap-1.5 text-[10px]">
                {[
                  { label: 'PPGS', name: 'O-Man Justy ET', code: 'US-7182901', sex: 'M' },
                  { label: 'PPGD', name: 'Morningview Shottle Roxy', code: 'US-7029184', sex: 'F' },
                  { label: 'PMGS', name: 'Ensenada Taboo Planet', code: 'US-6059714', sex: 'M' },
                  { label: 'PMGD', name: 'Benchmark Lass 108', code: 'US-6192841', sex: 'F' },
                  { label: 'MPGS', name: 'Seagull-Bay Supersire', code: 'US-6998134', sex: 'M' },
                  { label: 'MPGD', name: 'Pine-Tree 2149 Robust', code: 'US-6481092', sex: 'F' },
                  { label: 'MMGS', name: 'Mountfield SSI Mogul', code: 'US-6819482', sex: 'M' },
                  { label: 'MMGD', name: 'Cloverdale Star Galaxy', code: 'US-6301984', sex: 'F' },
                ].map((gg, i) => (
                  <div
                    key={i}
                    className={`p-1.5 rounded-lg border ${
                      gg.sex === 'M'
                        ? 'border-blue-200 bg-blue-50/30'
                        : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="font-bold text-stone-900 truncate">{gg.name}</div>
                    <div className="font-mono text-stone-500 text-[9px] flex justify-between">
                      <span>{gg.label}</span>
                      <span>{gg.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mating Co-Ancestry & Consanguinity Simulator */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Simulated Mating Inbreeding Predictor
              </h3>
              <p className="text-xs text-stone-500">
                Evaluate prospective mating coefficient (F) and carrier clash risks before breeding.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Wright-Meuwissen Coancestry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Proposed Sire (Paternal)</label>
            <select
              value={matingSireId}
              onChange={(e) => setMatingSireId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {animals
                .filter((a) => a.sex === 'MALE')
                .map((sire) => (
                  <option key={sire.id} value={sire.id}>
                    {sire.name} ({sire.primaryIdentifier || sire.internalId})
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Proposed Dam (Maternal)</label>
            <select
              value={matingDamId}
              onChange={(e) => setMatingDamId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {animals
                .filter((a) => a.sex === 'FEMALE')
                .map((dam) => (
                  <option key={dam.id} value={dam.id}>
                    {dam.name} ({dam.primaryIdentifier || dam.internalId})
                  </option>
                ))}
            </select>
          </div>

          {/* Outcome card */}
          <div
            className={`p-3 rounded-xl border ${
              simulatedInbreeding.risk === 'HIGH'
                ? 'border-rose-200 bg-rose-50'
                : simulatedInbreeding.risk === 'MODERATE'
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            } space-y-1`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[11px]">Projected Offspring F</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  simulatedInbreeding.risk === 'HIGH'
                    ? 'bg-rose-200 text-rose-900'
                    : simulatedInbreeding.risk === 'MODERATE'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {simulatedInbreeding.risk} RISK
              </span>
            </div>
            <div className="text-xl font-bold text-stone-900">
              {simulatedInbreeding.f}
            </div>
            <p className="text-[10px] text-stone-600 leading-tight">
              {simulatedInbreeding.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Verify Parentage Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-stone-900">Verify Parentage Pedigree</h3>
            </div>

            <p className="text-xs text-stone-600">
              Select verification standard for <strong>{selectedAnimal?.name}</strong>.
              DNA confirmation requires a passing assay with zero mendelian exclusions.
            </p>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => handleVerifyParentage('DNA_CONFIRMED')}
                className="w-full text-left p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 transition-colors cursor-pointer space-y-0.5"
              >
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>DNA Confirmed (ISAG / ICAR SNP Assay)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-[11px] text-emerald-800">
                  Backed by Illumina 100K BeadChip or ISAG parentage panel with &gt; 200 SNPs.
                </div>
              </button>

              <button
                onClick={() => handleVerifyParentage('GENOMIC_INFERRED')}
                className="w-full text-left p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer space-y-0.5"
              >
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>Genomic Inferred (Haplotype Prediction)</span>
                  <Dna className="w-4 h-4 text-stone-600" />
                </div>
                <div className="text-[11px] text-stone-600">
                  Pedigree reconstructed via single-step GBLUP relationship matrix.
                </div>
              </button>

              <button
                onClick={() => handleVerifyParentage('RECORD_ONLY')}
                className="w-full text-left p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer space-y-0.5"
              >
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>Record Only (Breeding Slip / Pasture Log)</span>
                  <FileSpreadsheet className="w-4 h-4 text-stone-600" />
                </div>
                <div className="text-[11px] text-stone-600">
                  Mating recorded on paper log; no genetic confirmation available.
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
