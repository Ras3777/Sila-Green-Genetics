'use client';

import React from 'react';
import { useRegisterFarmAnimal } from './_hooks/useRegisterFarmAnimal';
import {
  FarmAnimalHeader,
  SectionBasicIdentification,
  SectionFarmAssignment,
  SectionPhysicalInfo,
  SectionBreedGenetics,
  SectionParentSelection,
  SectionHealthMedia,
  FarmAnimalFormActions,
} from './_components';

export default function RegisterFarmAnimalPage() {
  const {
    farms,
    herds,
    groups,
    name,
    setName,
    internalId,
    setInternalId,
    earTag,
    setEarTag,
    rfid,
    setRfid,
    birthDate,
    setBirthDate,
    sex,
    setSex,
    useStatus,
    setUseStatus,
    cattleClass,
    setCattleClass,
    farmId,
    setFarmId,
    herdId,
    setHerdId,
    groupId,
    setGroupId,
    currentLocation,
    setCurrentLocation,
    owner,
    setOwner,
    supervisor,
    setSupervisor,
    currentWeightKg,
    setCurrentWeightKg,
    birthWeightKg,
    setBirthWeightKg,
    coatColor,
    setCoatColor,
    frameSize,
    setFrameSize,
    birthCondition,
    setBirthCondition,
    hornStatus,
    setHornStatus,
    primaryBreed,
    setPrimaryBreed,
    breedPercentage,
    setBreedPercentage,
    breedingType,
    setBreedingType,
    sireId,
    setSireId,
    externalSireName,
    setExternalSireName,
    damId,
    setDamId,
    externalDamName,
    setExternalDamName,
    parentageNotes,
    setParentageNotes,
    initialVaccinations,
    setInitialVaccinations,
    healthNotes,
    setHealthNotes,
    photoUrl,
    setPhotoUrl,
    potentialSires,
    potentialDams,
    handleSubmit,
  } = useRegisterFarmAnimal();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <FarmAnimalHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionBasicIdentification
          name={name}
          setName={setName}
          internalId={internalId}
          setInternalId={setInternalId}
          earTag={earTag}
          setEarTag={setEarTag}
          rfid={rfid}
          setRfid={setRfid}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          sex={sex}
          setSex={setSex}
          useStatus={useStatus}
          setUseStatus={setUseStatus}
          cattleClass={cattleClass}
          setCattleClass={setCattleClass}
        />

        <SectionFarmAssignment
          farms={farms}
          herds={herds}
          groups={groups}
          farmId={farmId}
          setFarmId={setFarmId}
          herdId={herdId}
          setHerdId={setHerdId}
          groupId={groupId}
          setGroupId={setGroupId}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          owner={owner}
          setOwner={setOwner}
          supervisor={supervisor}
          setSupervisor={setSupervisor}
        />

        <SectionPhysicalInfo
          currentWeightKg={currentWeightKg}
          setCurrentWeightKg={setCurrentWeightKg}
          birthWeightKg={birthWeightKg}
          setBirthWeightKg={setBirthWeightKg}
          coatColor={coatColor}
          setCoatColor={setCoatColor}
          frameSize={frameSize}
          setFrameSize={setFrameSize}
          birthCondition={birthCondition}
          setBirthCondition={setBirthCondition}
          hornStatus={hornStatus}
          setHornStatus={setHornStatus}
        />

        <SectionBreedGenetics
          primaryBreed={primaryBreed}
          setPrimaryBreed={setPrimaryBreed}
          breedPercentage={breedPercentage}
          setBreedPercentage={setBreedPercentage}
          breedingType={breedingType}
          setBreedingType={setBreedingType}
        />

        <SectionParentSelection
          potentialSires={potentialSires}
          potentialDams={potentialDams}
          sireId={sireId}
          setSireId={setSireId}
          externalSireName={externalSireName}
          setExternalSireName={setExternalSireName}
          damId={damId}
          setDamId={setDamId}
          externalDamName={externalDamName}
          setExternalDamName={setExternalDamName}
          parentageNotes={parentageNotes}
          setParentageNotes={setParentageNotes}
        />

        <SectionHealthMedia
          initialVaccinations={initialVaccinations}
          setInitialVaccinations={setInitialVaccinations}
          photoUrl={photoUrl}
          setPhotoUrl={setPhotoUrl}
          healthNotes={healthNotes}
          setHealthNotes={setHealthNotes}
        />

        <FarmAnimalFormActions />
      </form>
    </div>
  );
}
