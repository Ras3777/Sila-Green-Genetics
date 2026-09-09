'use client';

import React, { Suspense } from 'react';
import { useNewCalvingWizard } from './_hooks/useNewCalvingWizard';
import {
  CalvingBreadcrumb,
  CalvingWizardHeader,
  SectionDamGestation,
  SectionDeliveryDynamics,
  SectionNewbornOffspring,
  CalvingFormActions,
} from './_components';

function CalvingNewForm() {
  const {
    farms,
    femaleAnimals,
    damId,
    activePregnancy,
    calvingDate,
    setCalvingDate,
    calvingTime,
    setCalvingTime,
    farmId,
    setFarmId,
    difficulty,
    setDifficulty,
    assistanceDetails,
    setAssistanceDetails,
    deliveryType,
    setDeliveryType,
    maternalBehaviorScore,
    setMaternalBehaviorScore,
    colostrumQuality,
    setColostrumQuality,
    sirePlaceholder,
    setSirePlaceholder,
    offspring,
    handleDamChange,
    addTwinCalf,
    removeOffspring,
    updateCalf,
    handleSubmit,
  } = useNewCalvingWizard();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <CalvingBreadcrumb />

      <CalvingWizardHeader onAddTwinCalf={addTwinCalf} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionDamGestation
          femaleAnimals={femaleAnimals}
          damId={damId}
          onDamChange={handleDamChange}
          calvingDate={calvingDate}
          onCalvingDateChange={setCalvingDate}
          calvingTime={calvingTime}
          onCalvingTimeChange={setCalvingTime}
          farms={farms}
          farmId={farmId}
          onFarmChange={setFarmId}
          sirePlaceholder={sirePlaceholder}
          onSirePlaceholderChange={setSirePlaceholder}
          activePregnancy={activePregnancy}
        />

        <SectionDeliveryDynamics
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          deliveryType={deliveryType}
          onDeliveryTypeChange={setDeliveryType}
          maternalBehaviorScore={maternalBehaviorScore}
          onMaternalBehaviorScoreChange={setMaternalBehaviorScore}
          colostrumQuality={colostrumQuality}
          onColostrumQualityChange={setColostrumQuality}
          assistanceDetails={assistanceDetails}
          onAssistanceDetailsChange={setAssistanceDetails}
        />

        <SectionNewbornOffspring
          offspring={offspring}
          onUpdateCalf={updateCalf}
          onRemoveOffspring={removeOffspring}
        />

        <CalvingFormActions />
      </form>
    </div>
  );
}

export default function NewCalvingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading calving wizard...</div>}>
      <CalvingNewForm />
    </Suspense>
  );
}
