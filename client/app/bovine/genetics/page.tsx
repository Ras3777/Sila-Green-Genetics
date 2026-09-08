'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dna,
  GitBranch,
  Activity,
  Users,
  Trophy,
  TestTube2,
  Building,
  Microscope,
  Binary,
  Calculator,
  Flame,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText,
  HelpCircle,
  X,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function GeneticsDashboardPage() {
  const { animals, farms } = useBovine();
  const {
    breeds,
    traitDefinitions,
    contemporaryGroups,
    phenotypeObservations,
    performanceTests,
    laboratories,
    geneticSamples,
    genotypingAssays,
    geneticConditions,
    animalGeneticConditionResults,
    geneticEvaluationRuns,
    geneticTraitEstimates,
    animalGeneticMetrics,
    addGeneticSample,
    addPhenotypeObservation,
  } = useGenetics();

  // Modal states
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [phenotypeModalOpen, setPhenotypeModalOpen] = useState(false);

  // Quick form states
  const [newSampleAnimalId, setNewSampleAnimalId] = useState(animals[0]?.id || '');
  const [newSampleType, setNewSampleType] = useState<'TISSUE_TSU' | 'BLOOD_EDTA' | 'SEMEN' | 'HAIR_FOLLICLE'>('TISSUE_TSU');
  const [newSampleLabId, setNewSampleLabId] = useState(laboratories[0]?.id || '');
  const [newSampleBarcode, setNewSampleBarcode] = useState('');

  const [newPhenoAnimalId, setNewPhenoAnimalId] = useState(animals[0]?.id || '');
  const [newPhenoTraitId, setNewPhenoTraitId] = useState(traitDefinitions[0]?.id || '');
  const [newPhenoValue, setNewPhenoValue] = useState('');
  const [newPhenoCgId, setNewPhenoCgId] = useState(contemporaryGroups[0]?.id || '');

  // Computed metrics
  const totalPhenotypes = phenotypeObservations.length;
  const validatedPhenotypes = phenotypeObservations.filter((p) => p.qualityStatus === 'VALIDATED').length;
  const suspectPhenotypes = phenotypeObservations.filter(
    (p) => p.qualityStatus === 'SUSPECT' || p.qualityStatus === 'REJECTED'
  );

  const activeSamples = geneticSamples.filter(
    (s) => s.status !== 'COMPLETED' && s.status !== 'REJECTED'
  );
  const highQcAssays = genotypingAssays.filter((a) => a.qcStatus === 'PASSED').length;
  const activeRuns = geneticEvaluationRuns.filter((r) => r.status === 'PUBLISHED');
  const latestRun = activeRuns[0] || geneticEvaluationRuns[0];

  // Recessive condition carriers
  const carrierResults = animalGeneticConditionResults.filter(
    (r) => r.status === 'CARRIER' || r.status === 'AFFECTED'
  );
  const homozygousPolled = animalGeneticConditionResults.filter(
    (r) => r.conditionCode === 'POLLED_TRAIT' && r.notes?.includes('Homozygous')
  );

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newSampleAnimalId);
    const lab = laboratories.find((l) => l.id === newSampleLabId);
    if (!animal) return;

    addGeneticSample({
      sampleCode: `SMP-${Date.now().toString().slice(-6)}`,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      sampleType: newSampleType,
      collectedDate: new Date().toISOString().split('T')[0],
      collectedBy: 'Dr. John Miller',
      destinationLabId: newSampleLabId,
      destinationLabName: lab?.name,
      status: 'COLLECTED',
      barcode: newSampleBarcode || `TSU-${Date.now().toString().slice(-8)}`,
      chainOfCustody: [
        {
          timestamp: new Date().toLocaleString(),
          location: 'Farm Maternity Collection Pen',
          handledBy: 'Dr. John Miller',
          action: 'Biological sample collected and scanned into system',
        },
      ],
    });

    setSampleModalOpen(false);
    setNewSampleBarcode('');
  };

  const handleCreatePhenotype = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newPhenoAnimalId);
    const trait = traitDefinitions.find((t) => t.id === newPhenoTraitId);
    const cg = contemporaryGroups.find((c) => c.id === newPhenoCgId);
    if (!animal || !trait || !newPhenoValue) return;

    const val = parseFloat(newPhenoValue);
    const isOutlier =
      (trait.minValidValue !== undefined && val < trait.minValidValue) ||
      (trait.maxValidValue !== undefined && val > trait.maxValidValue);

    addPhenotypeObservation({
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      traitId: trait.id,
      traitCode: trait.code,
      traitName: trait.name,
      unit: trait.unit,
      observationDate: new Date().toISOString().split('T')[0],
      stage: trait.stages[0] || 'YEARLING',
      rawValue: val,
      adjustedValue: val,
      animalAgeDays: 200,
      contemporaryGroupId: cg?.id,
      contemporaryGroupCode: cg?.code,
      farmId: animal.farmId,
      recordedBy: 'Field Assessor',
      qualityStatus: isOutlier ? 'SUSPECT' : 'VALIDATED',
      qualityFlags: isOutlier
        ? ['VALUE_OUTSIDE_SOP_BOUNDS', 'PENDING_SUPERVISOR_AUDIT']
        : ['STANDARD_SOP_RECORDED'],
      notes: isOutlier ? `Recorded value ${val} ${trait.unit} triggers outlier inspection.` : undefined,
    });

    setPhenotypeModalOpen(false);
    setNewPhenoValue('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Provenance First Directive */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 rounded-2xl p-6 text-white border border-emerald-900/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Bovine Information Architecture Standard</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Genomic Architecture: Provenance Before Interpretation
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              In bovine breeding science, estimates (GEBV/EPD) are only valid within their specific evaluation base, methodology, and contemporary cohort. All observations and genetic conditions differentiate laboratory-certified results from pedigree inference.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-quick-sample"
              onClick={() => setSampleModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <TestTube2 className="w-4 h-4" />
              <span>Register Sample</span>
            </button>
            <button
              id="btn-quick-phenotype"
              onClick={() => setPhenotypeModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Log Phenotype</span>
            </button>
            <Link
              href="/bovine/genetics/pedigree"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Pedigree Explorer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Samples in Pipe</span>
            <TestTube2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{activeSamples.length}</div>
          <div className="text-[11px] text-stone-500">
            {geneticSamples.length} total collected across {laboratories.length} labs
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Genotyped Assays</span>
            <Microscope className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{genotypingAssays.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{highQcAssays} Passed Gold QC (98.5%+)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Phenotypes</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{totalPhenotypes}</div>
          <div className="text-[11px] text-stone-500">
            {validatedPhenotypes} validated • {suspectPhenotypes.length} flagged
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Contemporary Groups</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{contemporaryGroups.length}</div>
          <div className="text-[11px] text-stone-500">
            {contemporaryGroups.filter((c) => c.status === 'ACTIVE').length} active management cohorts
          </div>
        </div>

        <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Evaluation</span>
            <Calculator className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-stone-900 truncate">
            {latestRun.runCode}
          </div>
          <div className="text-[11px] text-stone-500">
            Base: {latestRun.geneticBase}
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Active Genomic Pipeline & Genetic Conditions/Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Biological Sample & Genotyping Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Tracker Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <TestTube2 className="w-4 h-4 text-emerald-700" />
                  Biological Samples & Genotyping Pipeline
                </h3>
                <p className="text-xs text-stone-500">
                  Tracking samples through tissue collection, courier logistics, DNA extraction, and BeadChip array analysis.
                </p>
              </div>
              <Link
                href="/bovine/genetics/samples"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
              >
                <span>View Repository</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Pipeline Stage Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center py-2">
              {[
                { label: 'Collected', count: geneticSamples.filter((s) => s.status === 'COLLECTED').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'In Transit', count: geneticSamples.filter((s) => s.status === 'SHIPPED').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'At Laboratory', count: geneticSamples.filter((s) => s.status === 'RECEIVED' || s.status === 'PROCESSING').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'Assay Complete', count: geneticSamples.filter((s) => s.status === 'COMPLETED').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { label: 'Rejected / Redo', count: geneticSamples.filter((s) => s.status === 'REJECTED').length, color: 'bg-rose-50 text-rose-700 border-rose-200' },
              ].map((stage, i) => (
                <div key={i} className={`p-3 rounded-xl border ${stage.color} space-y-1`}>
                  <div className="text-[11px] font-semibold">{stage.label}</div>
                  <div className="text-lg font-bold">{stage.count}</div>
                </div>
              ))}
            </div>

            {/* Samples List Preview */}
            <div className="divide-y divide-stone-100">
              {geneticSamples.slice(0, 4).map((sample) => {
                const lab = laboratories.find((l) => l.id === sample.destinationLabId);
                return (
                  <div key={sample.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-mono text-[11px] text-stone-700 shrink-0">
                        {sample.sampleType === 'TISSUE_TSU' && 'TSU'}
                        {sample.sampleType === 'SEMEN' && 'SMN'}
                        {sample.sampleType === 'BLOOD_EDTA' && 'BLD'}
                        {sample.sampleType === 'HAIR_FOLLICLE' && 'HAR'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-900 truncate flex items-center gap-1.5">
                          <span>{sample.animalName}</span>
                          <span className="font-mono text-stone-500 text-[11px]">({sample.animalIdentifier})</span>
                        </div>
                        <div className="text-stone-500 text-[11px] truncate flex items-center gap-2">
                          <span className="font-mono">{sample.sampleCode}</span>
                          <span>•</span>
                          <span>{sample.destinationLabName || lab?.name}</span>
                          <span>•</span>
                          <span>Collected {sample.collectedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          sample.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sample.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : sample.status === 'PROCESSING'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sample.status}
                      </span>
                      <Link
                        href={`/bovine/genetics/samples?highlight=${sample.id}`}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                        title="View Chain of Custody"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Tests & Contemporary Groups Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Performance Tests */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-stone-900">Performance Tests</h4>
                </div>
                <Link
                  href="/bovine/genetics/performance-tests"
                  className="text-[11px] font-semibold text-emerald-800 hover:underline"
                >
                  Explore All
                </Link>
              </div>

              <div className="space-y-2.5 text-xs">
                {performanceTests.map((pt) => (
                  <div key={pt.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{pt.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          pt.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {pt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>{pt.testStation}</span>
                      <span>{pt.enrolledCount} enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contemporary Groups */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-stone-900">Contemporary Groups</h4>
                </div>
                <Link
                  href="/bovine/genetics/contemporary-groups"
                  className="text-[11px] font-semibold text-emerald-800 hover:underline"
                >
                  Manage Groups
                </Link>
              </div>

              <div className="space-y-2.5 text-xs">
                {contemporaryGroups.map((cg) => (
                  <div key={cg.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 truncate max-w-[200px]">{cg.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          cg.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {cg.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>{cg.birthSeason}</span>
                      <span>{cg.animalCount} head • {cg.phenotypeCount} phenos</span>
                    </div>
                    {cg.warnings && cg.warnings.length > 0 && (
                      <div className="text-[10px] text-amber-700 flex items-center gap-1 font-medium pt-0.5">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span className="truncate">{cg.warnings[0]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Genetic Conditions, Recessive Carriers & Outlier Audits */}
        <div className="space-y-6">
          {/* Genetic Conditions & Recessive Carrier Alerts */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-emerald-700" />
                  Genetic Conditions & Carriers
                </h3>
                <p className="text-xs text-stone-500">
                  Critical recessive defect surveillance (BLAD, CVM, HCD, Curly Calf AM).
                </p>
              </div>
              <Link
                href="/bovine/genetics/markers-conditions"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
              >
                All
              </Link>
            </div>

            {/* Carrier List */}
            <div className="space-y-3">
              {carrierResults.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      {res.conditionName} ({res.conditionCode})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                      {res.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-700 text-[11px]">
                    <span className="font-semibold">{res.animalName}</span>
                    <span className="font-mono text-stone-500">{res.animalIdentifier}</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Source: <span className="font-medium text-stone-800">{res.source}</span> • Tested {res.testedDate}
                  </div>
                  {res.notes && (
                    <div className="text-[10px] text-amber-800 italic bg-white/70 p-1.5 rounded-md border border-amber-200/60">
                      {res.notes}
                    </div>
                  )}
                </div>
              ))}

              {/* Polled Bulls Highlight */}
              {homozygousPolled.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Homozygous Polled (P/P)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                      PP Foundation
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-700">
                    <span className="font-semibold">{res.animalName}</span> ({res.animalIdentifier})
                  </div>
                  <div className="text-[10px] text-emerald-800">
                    100% hornless progeny guarantee. Dehorning surgery eliminated.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phenotype Quality & Outlier Flag Audits */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Quality Audits & Suspect Phenotypes
                </h3>
                <p className="text-xs text-stone-500">
                  Observations requiring validation or technician review.
                </p>
              </div>
              <Link
                href="/bovine/genetics/phenotypes"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
              >
                Inspect
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {suspectPhenotypes.length === 0 ? (
                <div className="p-4 text-center text-stone-500 text-xs bg-stone-50 rounded-xl">
                  No suspect observations in current queue.
                </div>
              ) : (
                suspectPhenotypes.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">
                        {obs.traitName} ({obs.traitCode})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900">
                        {obs.qualityStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-800 text-[11px]">
                      <span>{obs.animalName}</span>
                      <span className="font-bold font-mono">
                        {obs.rawValue} {obs.unit}
                      </span>
                    </div>
                    {obs.qualityFlags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {obs.qualityFlags.map((f, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-rose-100 text-rose-800 font-mono px-1.5 py-0.5 rounded"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                    {obs.notes && (
                      <p className="text-[10px] text-stone-600 italic">{obs.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modal: Register Sample */}
      {sampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <TestTube2 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Register Biological Sample</h3>
              </div>
              <button
                onClick={() => setSampleModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Select Animal</label>
                <select
                  value={newSampleAnimalId}
                  onChange={(e) => setNewSampleAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Sample Type</label>
                  <select
                    value={newSampleType}
                    onChange={(e) => setNewSampleType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="TISSUE_TSU">Tissue TSU (Allflex Ear Notch)</option>
                    <option value="BLOOD_EDTA">Blood EDTA (Purple Top)</option>
                    <option value="SEMEN">Semen Straw (0.5 mL Liquid N2)</option>
                    <option value="HAIR_FOLLICLE">Hair Follicles (Tail Switch)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Destination Laboratory</label>
                  <select
                    value={newSampleLabId}
                    onChange={(e) => setNewSampleLabId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {laboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name} ({lab.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Vial 2D Barcode / RFID Tag</label>
                <input
                  type="text"
                  placeholder="e.g. TSU-9941029482 or leave empty for auto-generated"
                  value={newSampleBarcode}
                  onChange={(e) => setNewSampleBarcode(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSampleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm cursor-pointer"
                >
                  Enroll Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Modal: Log Phenotype */}
      {phenotypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Record Phenotype Observation</h3>
              </div>
              <button
                onClick={() => setPhenotypeModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePhenotype} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Animal</label>
                <select
                  value={newPhenoAnimalId}
                  onChange={(e) => setNewPhenoAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Trait Definition</label>
                  <select
                    value={newPhenoTraitId}
                    onChange={(e) => setNewPhenoTraitId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {traitDefinitions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code} - {t.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Raw Value</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 42.5"
                    value={newPhenoValue}
                    onChange={(e) => setNewPhenoValue(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Contemporary Group</label>
                <select
                  value={newPhenoCgId}
                  onChange={(e) => setNewPhenoCgId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {contemporaryGroups.map((cg) => (
                    <option key={cg.id} value={cg.id}>
                      {cg.name} ({cg.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPhenotypeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm cursor-pointer"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
