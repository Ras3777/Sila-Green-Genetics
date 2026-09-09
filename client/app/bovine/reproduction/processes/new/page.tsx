'use client';

import React from 'react';
import { useReproProcessWizard } from './_hooks/useReproProcessWizard';
import {
  ReproWizardHeader,
  ReproStepProgressBar,
  StepRecipientCow,
  StepDonorCow,
  StepBullSemen,
  StepEmbryoInfo,
  StepSyncProtocol,
  StepProcedureDetails,
  StepReproReview,
  ReproWizardControls,
} from './_components';

export default function NewReproductiveProcessPage() {
  const {
    femaleAnimals,
    maleAnimals,
    selectedCow,
    step,
    setStep,
    // Step 1
    cowAnimalId,
    setCowAnimalId,
    recipientDgr,
    setRecipientDgr,
    branding,
    setBranding,
    managementGroup,
    setManagementGroup,
    // Step 2
    donorCowAnimalId,
    setDonorCowAnimalId,
    donorCowPlaceholder,
    setDonorCowPlaceholder,
    donorWeightKg,
    setDonorWeightKg,
    donorBcs,
    setDonorBcs,
    donorBreed,
    setDonorBreed,
    // Step 3
    bullAnimalId,
    setBullAnimalId,
    bullPlaceholder,
    setBullPlaceholder,
    bullDgr,
    setBullDgr,
    semenBatch,
    setSemenBatch,
    // Step 4
    embryoCode,
    setEmbryoCode,
    embryoBreed,
    setEmbryoBreed,
    embryoStage,
    setEmbryoStage,
    embryoGrade,
    setEmbryoGrade,
    embryoPreservation,
    setEmbryoPreservation,
    // Step 5
    syncProtocol,
    setSyncProtocol,
    syncStartDate,
    setSyncStartDate,
    syncDeviceRemovalDate,
    setSyncDeviceRemovalDate,
    syncTreatments,
    setSyncTreatments,
    // Step 6
    procedureType,
    setProcedureType,
    procedureDate,
    setProcedureDate,
    technician,
    setTechnician,
    // Step 7
    expectedCalvingDate,
    // Actions
    handleSubmit,
    handlePrevStep,
    handleNextStep,
  } = useReproProcessWizard();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header with Breadcrumbs & Procedure Toggle */}
      <ReproWizardHeader
        procedureType={procedureType}
        setProcedureType={setProcedureType}
      />

      {/* Wizard Step Progression Bar */}
      <ReproStepProgressBar
        step={step}
        setStep={setStep}
        procedureType={procedureType}
      />

      {/* Step Content Containers */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <StepRecipientCow
            cowAnimalId={cowAnimalId}
            setCowAnimalId={setCowAnimalId}
            recipientDgr={recipientDgr}
            setRecipientDgr={setRecipientDgr}
            branding={branding}
            setBranding={setBranding}
            managementGroup={managementGroup}
            setManagementGroup={setManagementGroup}
            femaleAnimals={femaleAnimals}
            selectedCow={selectedCow}
          />
        )}

        {step === 2 && (
          <StepDonorCow
            procedureType={procedureType}
            donorCowAnimalId={donorCowAnimalId}
            setDonorCowAnimalId={setDonorCowAnimalId}
            donorCowPlaceholder={donorCowPlaceholder}
            setDonorCowPlaceholder={setDonorCowPlaceholder}
            donorWeightKg={donorWeightKg}
            setDonorWeightKg={setDonorWeightKg}
            donorBcs={donorBcs}
            setDonorBcs={setDonorBcs}
            donorBreed={donorBreed}
            setDonorBreed={setDonorBreed}
            femaleAnimals={femaleAnimals}
            onProceedToBull={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepBullSemen
            bullAnimalId={bullAnimalId}
            setBullAnimalId={setBullAnimalId}
            bullPlaceholder={bullPlaceholder}
            setBullPlaceholder={setBullPlaceholder}
            bullDgr={bullDgr}
            setBullDgr={setBullDgr}
            semenBatch={semenBatch}
            setSemenBatch={setSemenBatch}
            maleAnimals={maleAnimals}
          />
        )}

        {step === 4 && (
          <StepEmbryoInfo
            procedureType={procedureType}
            embryoCode={embryoCode}
            setEmbryoCode={setEmbryoCode}
            embryoBreed={embryoBreed}
            setEmbryoBreed={setEmbryoBreed}
            embryoStage={embryoStage}
            setEmbryoStage={setEmbryoStage}
            embryoGrade={embryoGrade}
            setEmbryoGrade={setEmbryoGrade}
            embryoPreservation={embryoPreservation}
            setEmbryoPreservation={setEmbryoPreservation}
            onProceedToSync={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <StepSyncProtocol
            syncProtocol={syncProtocol}
            setSyncProtocol={setSyncProtocol}
            syncStartDate={syncStartDate}
            setSyncStartDate={setSyncStartDate}
            syncDeviceRemovalDate={syncDeviceRemovalDate}
            setSyncDeviceRemovalDate={setSyncDeviceRemovalDate}
            syncTreatments={syncTreatments}
            setSyncTreatments={setSyncTreatments}
          />
        )}

        {step === 6 && (
          <StepProcedureDetails
            procedureDate={procedureDate}
            setProcedureDate={setProcedureDate}
            technician={technician}
            setTechnician={setTechnician}
          />
        )}

        {step === 7 && (
          <StepReproReview
            selectedCow={selectedCow}
            recipientDgr={recipientDgr}
            bullPlaceholder={bullPlaceholder}
            procedureType={procedureType}
            donorCowPlaceholder={donorCowPlaceholder}
            embryoCode={embryoCode}
            procedureDate={procedureDate}
            technician={technician}
            expectedCalvingDate={expectedCalvingDate}
          />
        )}

        {/* Wizard Footer Navigation Controls */}
        <ReproWizardControls
          step={step}
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
        />
      </form>
    </div>
  );
}
