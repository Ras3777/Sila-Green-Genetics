'use client';

import React from 'react';
import { usePhenotypesPage } from './_hooks/usePhenotypesPage';
import {
  PhenotypeTabsHeader,
  PhenotypeObservationsTable,
  TraitDefinitionsCatalog,
  MeasurementMethodsCatalog,
  RecordPhenotypeModal,
  NewTraitDefinitionModal,
  NewMeasurementMethodModal,
  BulkRejectReasonModal,
} from './_components';

export default function PhenotypesPage() {
  const state = usePhenotypesPage();

  return (
    <div className="space-y-6">
      {/* Sub-Tabs: Observations vs Traits vs Methods */}
      <PhenotypeTabsHeader
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        observationsCount={state.phenotypeObservations.length}
        traitsCount={state.traitDefinitions.length}
        methodsCount={state.measurementMethods.length}
        onOpenRecordModal={() => state.setRecordModalOpen(true)}
        onOpenTraitModal={() => state.setTraitModalOpen(true)}
        onOpenMethodModal={() => state.setMethodModalOpen(true)}
      />

      {/* VIEW 1: OBSERVATIONS TABLE */}
      {state.activeTab === 'OBSERVATIONS' && (
        <PhenotypeObservationsTable
          searchQuery={state.searchQuery}
          setSearchQuery={state.setSearchQuery}
          traitFilter={state.traitFilter}
          setTraitFilter={state.setTraitFilter}
          statusFilter={state.statusFilter}
          setStatusFilter={state.setStatusFilter}
          cgFilter={state.cgFilter}
          setCgFilter={state.setCgFilter}
          traitDefinitions={state.traitDefinitions}
          contemporaryGroups={state.contemporaryGroups}
          filteredObservations={state.filteredObservations}
          selectedIds={state.selectedIds}
          setSelectedIds={state.setSelectedIds}
          handleSelectAll={state.handleSelectAll}
          handleToggleSelect={state.handleToggleSelect}
          bulkValidatePhenotypes={state.bulkValidatePhenotypes}
          onOpenRejectModal={() => state.setRejectReasonModalOpen(true)}
          setPhenotypeQualityStatus={state.setPhenotypeQualityStatus}
        />
      )}

      {/* VIEW 2: TRAIT DEFINITIONS CATALOG */}
      {state.activeTab === 'TRAITS' && (
        <TraitDefinitionsCatalog traitDefinitions={state.traitDefinitions} />
      )}

      {/* VIEW 3: MEASUREMENT METHODS S.O.P. */}
      {state.activeTab === 'METHODS' && (
        <MeasurementMethodsCatalog measurementMethods={state.measurementMethods} />
      )}

      {/* MODAL 1: RECORD PHENOTYPE */}
      <RecordPhenotypeModal
        isOpen={state.recordModalOpen}
        onClose={() => state.setRecordModalOpen(false)}
        onSubmit={state.handleSubmitPhenotype}
        animals={state.animals}
        traitDefinitions={state.traitDefinitions}
        measurementMethods={state.measurementMethods}
        contemporaryGroups={state.contemporaryGroups}
        selectedTraitForObs={state.selectedTraitForObs}
        obsAnimalId={state.obsAnimalId}
        setObsAnimalId={state.setObsAnimalId}
        obsTraitId={state.obsTraitId}
        setObsTraitId={state.setObsTraitId}
        obsRawValue={state.obsRawValue}
        setObsRawValue={state.setObsRawValue}
        obsAdjustedValue={state.obsAdjustedValue}
        setObsAdjustedValue={state.setObsAdjustedValue}
        obsAdjustmentReason={state.obsAdjustmentReason}
        setObsAdjustmentReason={state.setObsAdjustmentReason}
        obsMethodId={state.obsMethodId}
        setObsMethodId={state.setObsMethodId}
        obsCgId={state.obsCgId}
        setObsCgId={state.setObsCgId}
        obsNotes={state.obsNotes}
        setObsNotes={state.setObsNotes}
      />

      {/* MODAL 2: CREATE TRAIT DEFINITION */}
      <NewTraitDefinitionModal
        isOpen={state.traitModalOpen}
        onClose={() => state.setTraitModalOpen(false)}
        onSubmit={state.handleSubmitTrait}
        newTraitCode={state.newTraitCode}
        setNewTraitCode={state.setNewTraitCode}
        newTraitCategory={state.newTraitCategory}
        setNewTraitCategory={state.setNewTraitCategory}
        newTraitName={state.newTraitName}
        setNewTraitName={state.setNewTraitName}
        newTraitUnit={state.newTraitUnit}
        setNewTraitUnit={state.setNewTraitUnit}
        newTraitHeritability={state.newTraitHeritability}
        setNewTraitHeritability={state.setNewTraitHeritability}
        newTraitDirection={state.newTraitDirection}
        setNewTraitDirection={state.setNewTraitDirection}
        newTraitMin={state.newTraitMin}
        setNewTraitMin={state.setNewTraitMin}
        newTraitMax={state.newTraitMax}
        setNewTraitMax={state.setNewTraitMax}
        newTraitDesc={state.newTraitDesc}
        setNewTraitDesc={state.setNewTraitDesc}
      />

      {/* MODAL 3: CREATE METHOD S.O.P. */}
      <NewMeasurementMethodModal
        isOpen={state.methodModalOpen}
        onClose={() => state.setMethodModalOpen(false)}
        onSubmit={state.handleSubmitMethod}
        newMethodCode={state.newMethodCode}
        setNewMethodCode={state.setNewMethodCode}
        newMethodVersion={state.newMethodVersion}
        setNewMethodVersion={state.setNewMethodVersion}
        newMethodName={state.newMethodName}
        setNewMethodName={state.setNewMethodName}
        newMethodEquipment={state.newMethodEquipment}
        setNewMethodEquipment={state.setNewMethodEquipment}
        newMethodSop={state.newMethodSop}
        setNewMethodSop={state.setNewMethodSop}
      />

      {/* MODAL 4: BULK REJECT REASON */}
      <BulkRejectReasonModal
        isOpen={state.rejectReasonModalOpen}
        onClose={() => state.setRejectReasonModalOpen(false)}
        onConfirm={state.handleBulkRejectConfirm}
        selectedCount={state.selectedIds.length}
        rejectReason={state.rejectReason}
        setRejectReason={state.setRejectReason}
      />
    </div>
  );
}
