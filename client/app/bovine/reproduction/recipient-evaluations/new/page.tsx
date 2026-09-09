'use client';

import React from 'react';
import { useNewRecipientEvaluation } from './_hooks/useNewRecipientEvaluation';
import {
  RecipientEvaluationBreadcrumb,
  RecipientEvaluationHeader,
  SectionRecipientIdentity,
  SectionSyncEstrus,
  SectionOvarianEvaluation,
  SectionCalfOutcome,
  SectionHealthStructure,
  SectionAuditorSignOff,
  RecipientEvaluationActions,
} from './_components';

export default function NewRecipientEvaluationPage() {
  const {
    femaleAnimals,
    farms,
    cowAnimalId,
    earTag,
    setEarTag,
    farmId,
    setFarmId,
    breed,
    setBreed,
    syncProtocol,
    setSyncProtocol,
    estrusScore,
    setEstrusScore,
    cervicalMucus,
    setCervicalMucus,
    uterineTone,
    setUterineTone,
    clQuality,
    setClQuality,
    clSide,
    setClSide,
    clDiameterMm,
    setClDiameterMm,
    gestationStatus,
    setGestationStatus,
    calfOutcome,
    setCalfOutcome,
    bcs,
    setBcs,
    tickCount,
    setTickCount,
    headEyes,
    setHeadEyes,
    bodyStructure,
    setBodyStructure,
    umbilicalCondition,
    setUmbilicalCondition,
    generalConformationScore,
    setGeneralConformationScore,
    earTagVerified,
    setEarTagVerified,
    evaluator,
    setEvaluator,
    evaluationDate,
    setEvaluationDate,
    overallStatus,
    setOverallStatus,
    notes,
    setNotes,
    handleCowChange,
    handleSubmit,
  } = useNewRecipientEvaluation();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <RecipientEvaluationBreadcrumb />

      <RecipientEvaluationHeader
        overallStatus={overallStatus}
        onOverallStatusChange={setOverallStatus}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionRecipientIdentity
          femaleAnimals={femaleAnimals}
          cowAnimalId={cowAnimalId}
          onCowChange={handleCowChange}
          earTag={earTag}
          onEarTagChange={setEarTag}
          farms={farms}
          farmId={farmId}
          onFarmChange={setFarmId}
          breed={breed}
          onBreedChange={setBreed}
        />

        <SectionSyncEstrus
          syncProtocol={syncProtocol}
          onSyncProtocolChange={setSyncProtocol}
          estrusScore={estrusScore}
          onEstrusScoreChange={setEstrusScore}
          cervicalMucus={cervicalMucus}
          onCervicalMucusChange={setCervicalMucus}
          uterineTone={uterineTone}
          onUterineToneChange={setUterineTone}
        />

        <SectionOvarianEvaluation
          clQuality={clQuality}
          onClQualityChange={setClQuality}
          clSide={clSide}
          onClSideChange={setClSide}
          clDiameterMm={clDiameterMm}
          onClDiameterMmChange={setClDiameterMm}
          gestationStatus={gestationStatus}
          onGestationStatusChange={setGestationStatus}
        />

        <SectionCalfOutcome
          calfOutcome={calfOutcome}
          onCalfOutcomeChange={setCalfOutcome}
        />

        <SectionHealthStructure
          bcs={bcs}
          onBcsChange={setBcs}
          tickCount={tickCount}
          onTickCountChange={setTickCount}
          headEyes={headEyes}
          onHeadEyesChange={setHeadEyes}
          bodyStructure={bodyStructure}
          onBodyStructureChange={setBodyStructure}
          umbilicalCondition={umbilicalCondition}
          onUmbilicalConditionChange={setUmbilicalCondition}
          generalConformationScore={generalConformationScore}
          onGeneralConformationScoreChange={setGeneralConformationScore}
          earTagVerified={earTagVerified}
          onEarTagVerifiedChange={setEarTagVerified}
        />

        <SectionAuditorSignOff
          evaluator={evaluator}
          onEvaluatorChange={setEvaluator}
          evaluationDate={evaluationDate}
          onEvaluationDateChange={setEvaluationDate}
          overallStatus={overallStatus}
          onOverallStatusChange={setOverallStatus}
          notes={notes}
          onNotesChange={setNotes}
        />

        <RecipientEvaluationActions />
      </form>
    </div>
  );
}
