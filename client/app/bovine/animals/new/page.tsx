'use client';

import React from 'react';
import { useAnimalRegistrationWizard } from './_hooks/useAnimalRegistrationWizard';
import {
  WizardHeader,
  WizardStepIndicator,
  StepIdentity,
  StepIdentifiers,
  StepPlacement,
  StepBreedComposition,
  StepParentage,
  StepMedia,
  StepReview,
  WizardControls,
} from './_components';

export default function BovineNewAnimalWizardPage() {
  const {
    animals,
    farms,
    herds,
    organizations,
    currentStep,
    setCurrentStep,
    // Step 1
    name,
    setName,
    sex,
    setSex,
    birthDate,
    setBirthDate,
    birthWeightKg,
    setBirthWeightKg,
    birthType,
    setBirthType,
    useStatus,
    setUseStatus,
    coatColor,
    setCoatColor,
    hornStatus,
    setHornStatus,
    // Step 2
    identifierList,
    setIdentifierList,
    addIdentifierRow,
    removeIdentifierRow,
    setPrimaryIdentifier,
    // Step 3
    ownerOrgId,
    setOwnerOrgId,
    farmId,
    setFarmId,
    herdId,
    setHerdId,
    // Step 4
    breedList,
    setBreedList,
    addBreedRow,
    removeBreedRow,
    totalBreedPercentage,
    isBreedValid,
    // Step 5
    sireId,
    setSireId,
    damId,
    setDamId,
    candidateSires,
    candidateDams,
    // Step 6
    photoUrl,
    setPhotoUrl,
    registrationDocName,
    setRegistrationDocName,
    // Submit
    handleFinalSubmit,
  } = useAnimalRegistrationWizard();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <WizardHeader currentStep={currentStep} />

      {/* 7-Step Horizontal Stepper */}
      <WizardStepIndicator
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Step Form Containers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
        {currentStep === 1 && (
          <StepIdentity
            name={name}
            setName={setName}
            sex={sex}
            setSex={setSex}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            birthWeightKg={birthWeightKg}
            setBirthWeightKg={setBirthWeightKg}
            birthType={birthType}
            setBirthType={setBirthType}
            useStatus={useStatus}
            setUseStatus={setUseStatus}
            hornStatus={hornStatus}
            setHornStatus={setHornStatus}
            coatColor={coatColor}
            setCoatColor={setCoatColor}
          />
        )}

        {currentStep === 2 && (
          <StepIdentifiers
            identifierList={identifierList}
            setIdentifierList={setIdentifierList}
            addIdentifierRow={addIdentifierRow}
            removeIdentifierRow={removeIdentifierRow}
            setPrimaryIdentifier={setPrimaryIdentifier}
          />
        )}

        {currentStep === 3 && (
          <StepPlacement
            ownerOrgId={ownerOrgId}
            setOwnerOrgId={setOwnerOrgId}
            farmId={farmId}
            setFarmId={setFarmId}
            herdId={herdId}
            setHerdId={setHerdId}
            organizations={organizations}
            farms={farms}
            herds={herds}
          />
        )}

        {currentStep === 4 && (
          <StepBreedComposition
            breedList={breedList}
            setBreedList={setBreedList}
            addBreedRow={addBreedRow}
            removeBreedRow={removeBreedRow}
            totalBreedPercentage={totalBreedPercentage}
            isBreedValid={isBreedValid}
          />
        )}

        {currentStep === 5 && (
          <StepParentage
            sireId={sireId}
            setSireId={setSireId}
            damId={damId}
            setDamId={setDamId}
            candidateSires={candidateSires}
            candidateDams={candidateDams}
          />
        )}

        {currentStep === 6 && (
          <StepMedia
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            registrationDocName={registrationDocName}
            setRegistrationDocName={setRegistrationDocName}
          />
        )}

        {currentStep === 7 && (
          <StepReview
            name={name}
            sex={sex}
            identifierList={identifierList}
            farmId={farmId}
            herdId={herdId}
            farms={farms}
            herds={herds}
            breedList={breedList}
            sireId={sireId}
            damId={damId}
            animals={animals}
            isBreedValid={isBreedValid}
          />
        )}

        {/* Wizard Controls */}
        <WizardControls
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isBreedValid={isBreedValid}
          onFinalSubmit={handleFinalSubmit}
        />
      </div>
    </div>
  );
}
