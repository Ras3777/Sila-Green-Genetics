'use client';

import React from 'react';
import { useGeneticsDashboard } from './_hooks/useGeneticsDashboard';
import {
  GeneticsProvenanceBanner,
  GeneticsStatsGrid,
  BiologicalSamplePipelineCard,
  PerformanceTestsCard,
  ContemporaryGroupsCard,
  GeneticConditionsCard,
  SuspectPhenotypesCard,
  RegisterSampleModal,
  LogPhenotypeModal,
} from './_components';

export default function GeneticsDashboardPage() {
  const {
    animals,
    laboratories,
    traitDefinitions,
    contemporaryGroups,
    performanceTests,
    geneticSamples,
    totalPhenotypes,
    validatedPhenotypes,
    suspectPhenotypes,
    activeSamples,
    highQcAssays,
    genotypingAssays,
    latestRun,
    carrierResults,
    homozygousPolled,
    // Modals
    sampleModalOpen,
    setSampleModalOpen,
    phenotypeModalOpen,
    setPhenotypeModalOpen,
    // Form state & handlers
    newSampleAnimalId,
    setNewSampleAnimalId,
    newSampleType,
    setNewSampleType,
    newSampleLabId,
    setNewSampleLabId,
    newSampleBarcode,
    setNewSampleBarcode,
    handleCreateSample,
    newPhenoAnimalId,
    setNewPhenoAnimalId,
    newPhenoTraitId,
    setNewPhenoTraitId,
    newPhenoValue,
    setNewPhenoValue,
    newPhenoCgId,
    setNewPhenoCgId,
    handleCreatePhenotype,
  } = useGeneticsDashboard();

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Provenance First Directive */}
      <GeneticsProvenanceBanner
        onOpenSampleModal={() => setSampleModalOpen(true)}
        onOpenPhenotypeModal={() => setPhenotypeModalOpen(true)}
      />

      {/* KPI Stats Grid */}
      <GeneticsStatsGrid
        activeSamplesCount={activeSamples.length}
        totalSamplesCount={geneticSamples.length}
        laboratoriesCount={laboratories.length}
        genotypingAssaysCount={genotypingAssays.length}
        highQcAssaysCount={highQcAssays}
        totalPhenotypes={totalPhenotypes}
        validatedPhenotypes={validatedPhenotypes}
        suspectPhenotypesCount={suspectPhenotypes.length}
        contemporaryGroupsCount={contemporaryGroups.length}
        activeContemporaryGroupsCount={contemporaryGroups.filter((c) => c.status === 'ACTIVE').length}
        latestRun={latestRun}
      />

      {/* Main Dual Grid: Active Genomic Pipeline & Genetic Conditions/Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Biological Sample & Genotyping Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <BiologicalSamplePipelineCard
            geneticSamples={geneticSamples}
            laboratories={laboratories}
          />

          {/* Performance Tests & Contemporary Groups Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PerformanceTestsCard performanceTests={performanceTests} />
            <ContemporaryGroupsCard contemporaryGroups={contemporaryGroups} />
          </div>
        </div>

        {/* Right 1 Col: Genetic Conditions, Recessive Carriers & Outlier Audits */}
        <div className="space-y-6">
          <GeneticConditionsCard
            carrierResults={carrierResults}
            homozygousPolled={homozygousPolled}
          />

          <SuspectPhenotypesCard suspectPhenotypes={suspectPhenotypes} />
        </div>
      </div>

      {/* Quick Action Modals */}
      <RegisterSampleModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        animals={animals}
        laboratories={laboratories}
        newSampleAnimalId={newSampleAnimalId}
        setNewSampleAnimalId={setNewSampleAnimalId}
        newSampleType={newSampleType}
        setNewSampleType={setNewSampleType}
        newSampleLabId={newSampleLabId}
        setNewSampleLabId={setNewSampleLabId}
        newSampleBarcode={newSampleBarcode}
        setNewSampleBarcode={setNewSampleBarcode}
        onSubmit={handleCreateSample}
      />

      <LogPhenotypeModal
        isOpen={phenotypeModalOpen}
        onClose={() => setPhenotypeModalOpen(false)}
        animals={animals}
        traitDefinitions={traitDefinitions}
        contemporaryGroups={contemporaryGroups}
        newPhenoAnimalId={newPhenoAnimalId}
        setNewPhenoAnimalId={setNewPhenoAnimalId}
        newPhenoTraitId={newPhenoTraitId}
        setNewPhenoTraitId={setNewPhenoTraitId}
        newPhenoValue={newPhenoValue}
        setNewPhenoValue={setNewPhenoValue}
        newPhenoCgId={newPhenoCgId}
        setNewPhenoCgId={setNewPhenoCgId}
        onSubmit={handleCreatePhenotype}
      />
    </div>
  );
}
