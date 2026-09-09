'use client';

import React from 'react';
import { useBreedingStockWizard } from './_hooks/useBreedingStockWizard';
import {
  WizardHeader,
  WizardStepIndicator,
  StepIdentity,
  StepBasicPerformance,
  StepPhysicalMeasurements,
  StepBreedNucleus,
  StepPedigree,
  StepGeneticsEpds,
  StepReviewSubmit,
  WizardControls,
} from './_components';

const STEPS = [
  { num: 1, label: 'Identity' },
  { num: 2, label: 'Basic Performance' },
  { num: 3, label: 'Measurements' },
  { num: 4, label: 'Breed & Nucleus' },
  { num: 5, label: 'Pedigree' },
  { num: 6, label: 'Genetics & EPDs' },
  { num: 7, label: 'Review & Submit' },
];

export default function RegisterBreedingStockWizardPage() {
  const wizard = useBreedingStockWizard();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <WizardHeader />

      {/* Step Indicator Bar */}
      <WizardStepIndicator
        steps={STEPS}
        currentStep={wizard.currentStep}
        setCurrentStep={wizard.setCurrentStep}
      />

      <form onSubmit={wizard.handleCompleteRegistration} className="space-y-6">
        {/* STEP 1: IDENTITY */}
        {wizard.currentStep === 1 && (
          <StepIdentity
            dgr={wizard.dgr}
            setDgr={wizard.setDgr}
            name={wizard.name}
            setName={wizard.setName}
            earTag={wizard.earTag}
            setEarTag={wizard.setEarTag}
            birthDate={wizard.birthDate}
            setBirthDate={wizard.setBirthDate}
            calculateAge={wizard.calculateAge}
            sex={wizard.sex}
            setSex={wizard.setSex}
            bullType={wizard.bullType}
            setBullType={wizard.setBullType}
            farmId={wizard.farmId}
            setFarmId={wizard.setFarmId}
            farms={wizard.farms}
            supervisor={wizard.supervisor}
            setSupervisor={wizard.setSupervisor}
          />
        )}

        {/* STEP 2: BASIC PERFORMANCE */}
        {wizard.currentStep === 2 && (
          <StepBasicPerformance
            currentWeightKg={wizard.currentWeightKg}
            setCurrentWeightKg={wizard.setCurrentWeightKg}
            birthWeightKg={wizard.birthWeightKg}
            setBirthWeightKg={wizard.setBirthWeightKg}
            adgKg={wizard.adgKg}
            setAdgKg={wizard.setAdgKg}
            weaningWeightKg={wizard.weaningWeightKg}
            setWeaningWeightKg={wizard.setWeaningWeightKg}
            yearlingWeightKg={wizard.yearlingWeightKg}
            setYearlingWeightKg={wizard.setYearlingWeightKg}
            pmwgKg={wizard.pmwgKg}
            setPmwgKg={wizard.setPmwgKg}
          />
        )}

        {/* STEP 3: PHYSICAL MEASUREMENTS */}
        {wizard.currentStep === 3 && (
          <StepPhysicalMeasurements
            rumpLengthCm={wizard.rumpLengthCm}
            setRumpLengthCm={wizard.setRumpLengthCm}
            rumpHeightCm={wizard.rumpHeightCm}
            setRumpHeightCm={wizard.setRumpHeightCm}
            lowerHeightCm={wizard.lowerHeightCm}
            setLowerHeightCm={wizard.setLowerHeightCm}
            backHeightCm={wizard.backHeightCm}
            setBackHeightCm={wizard.setBackHeightCm}
            bodyLengthCm={wizard.bodyLengthCm}
            setBodyLengthCm={wizard.setBodyLengthCm}
            ribDepthCm={wizard.ribDepthCm}
            setRibDepthCm={wizard.setRibDepthCm}
            chestPerimeterCm={wizard.chestPerimeterCm}
            setChestPerimeterCm={wizard.setChestPerimeterCm}
            bodyWidthCm={wizard.bodyWidthCm}
            setBodyWidthCm={wizard.setBodyWidthCm}
            scrotalCircumferenceCm={wizard.scrotalCircumferenceCm}
            setScrotalCircumferenceCm={wizard.setScrotalCircumferenceCm}
            sex={wizard.sex}
          />
        )}

        {/* STEP 4: BREED & BREEDING INFO */}
        {wizard.currentStep === 4 && (
          <StepBreedNucleus
            breedRows={wizard.breedRows}
            setBreedRows={wizard.setBreedRows}
            paternalNucleus={wizard.paternalNucleus}
            setPaternalNucleus={wizard.setPaternalNucleus}
            paternalType={wizard.paternalType}
            setPaternalType={wizard.setPaternalType}
          />
        )}

        {/* STEP 5: PEDIGREE */}
        {wizard.currentStep === 5 && (
          <StepPedigree
            sireId={wizard.sireId}
            setSireId={wizard.setSireId}
            externalSireName={wizard.externalSireName}
            setExternalSireName={wizard.setExternalSireName}
            damId={wizard.damId}
            setDamId={wizard.setDamId}
            externalDamName={wizard.externalDamName}
            setExternalDamName={wizard.setExternalDamName}
            potentialSires={wizard.potentialSires}
            potentialDams={wizard.potentialDams}
            selectedSire={wizard.selectedSire}
            selectedDam={wizard.selectedDam}
          />
        )}

        {/* STEP 6: GENETICS & EPDS */}
        {wizard.currentStep === 6 && (
          <StepGeneticsEpds
            betaCasein={wizard.betaCasein}
            setBetaCasein={wizard.setBetaCasein}
            kappaCasein={wizard.kappaCasein}
            setKappaCasein={wizard.setKappaCasein}
            betaLactoglobulin={wizard.betaLactoglobulin}
            setBetaLactoglobulin={wizard.setBetaLactoglobulin}
            bwEpd={wizard.bwEpd}
            setBwEpd={wizard.setBwEpd}
            bwAcc={wizard.bwAcc}
            setBwAcc={wizard.setBwAcc}
            bwDeca={wizard.bwDeca}
            wwEpd={wizard.wwEpd}
            setWwEpd={wizard.setWwEpd}
            wwAcc={wizard.wwAcc}
            setWwAcc={wizard.setWwAcc}
            wwDeca={wizard.wwDeca}
            ywEpd={wizard.ywEpd}
            setYwEpd={wizard.setYwEpd}
            ywAcc={wizard.ywAcc}
            setYwAcc={wizard.setYwAcc}
            ywDeca={wizard.ywDeca}
            reaEpd={wizard.reaEpd}
            setReaEpd={wizard.setReaEpd}
            reaAcc={wizard.reaAcc}
            setReaAcc={wizard.setReaAcc}
          />
        )}

        {/* STEP 7: REVIEW & SUBMIT */}
        {wizard.currentStep === 7 && (
          <StepReviewSubmit
            name={wizard.name}
            dgr={wizard.dgr}
            earTag={wizard.earTag}
            primaryBreed={wizard.primaryBreed}
            sex={wizard.sex}
            birthDate={wizard.birthDate}
            calculateAge={wizard.calculateAge}
            selectedSire={wizard.selectedSire}
            externalSireName={wizard.externalSireName}
            selectedDam={wizard.selectedDam}
            externalDamName={wizard.externalDamName}
            betaCasein={wizard.betaCasein}
            currentWeightKg={wizard.currentWeightKg}
            photoUrl={wizard.photoUrl}
            setPhotoUrl={wizard.setPhotoUrl}
            registrationNotes={wizard.registrationNotes}
            setRegistrationNotes={wizard.setRegistrationNotes}
          />
        )}

        {/* Wizard Controls */}
        <WizardControls
          currentStep={wizard.currentStep}
          totalSteps={STEPS.length}
          onPrev={() => wizard.setCurrentStep(wizard.currentStep - 1)}
          onNext={() => wizard.setCurrentStep(wizard.currentStep + 1)}
        />
      </form>
    </div>
  );
}
