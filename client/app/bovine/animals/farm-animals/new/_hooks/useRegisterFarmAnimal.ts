'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import { Sex, HornStatus, UseStatus, IdentifierType } from '@/lib/bovine-types';

export function useRegisterFarmAnimal() {
  const router = useRouter();
  const { farms, herds, groups, animals, addAnimal } = useBovine();

  // Section A: Basic Identification
  const [name, setName] = useState('');
  const [internalId, setInternalId] = useState(`GN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [earTag, setEarTag] = useState('');
  const [rfid, setRfid] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [sex, setSex] = useState<Sex>('FEMALE');
  const [useStatus, setUseStatus] = useState<UseStatus>('GENERAL');
  const [cattleClass, setCattleClass] = useState('Commercial Dairy Heifer');

  // Section B: Farm Assignment
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [herdId, setHerdId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Barn 2 - Pen A');
  const [owner, setOwner] = useState('North Valley Pastoral Cooperative');
  const [supervisor, setSupervisor] = useState('Dr. John Miller');

  // Section C: Physical Information
  const [currentWeightKg, setCurrentWeightKg] = useState('45.0');
  const [birthWeightKg, setBirthWeightKg] = useState('40.0');
  const [coatColor, setCoatColor] = useState('Black and White');
  const [frameSize, setFrameSize] = useState('Medium');
  const [birthCondition, setBirthCondition] = useState('Healthy / Vigorous');
  const [hornStatus, setHornStatus] = useState<HornStatus>('POLLED');

  // Section D: Breed Information
  const [primaryBreed, setPrimaryBreed] = useState('Holstein Friesian');
  const [breedPercentage, setBreedPercentage] = useState('100');
  const [breedingType, setBreedingType] = useState('PUREBRED');

  // Section E: Parents
  const [sireId, setSireId] = useState('');
  const [externalSireName, setExternalSireName] = useState('');
  const [damId, setDamId] = useState('');
  const [externalDamName, setExternalDamName] = useState('');
  const [parentageNotes, setParentageNotes] = useState('');

  // Section F: Health / Preventive State
  const [initialVaccinations, setInitialVaccinations] = useState('Bovi-Shield Gold FP5 L5 (At intake)');
  const [healthNotes, setHealthNotes] = useState('');

  // Section G: Media
  const [photoUrl, setPhotoUrl] = useState('');

  // Sires and Dams lists
  const potentialSires = animals.filter((a) => a.sex === 'MALE');
  const potentialDams = animals.filter((a) => a.sex === 'FEMALE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSire = animals.find((a) => a.id === sireId);
    const selectedDam = animals.find((a) => a.id === damId);

    const chosenEarTag = earTag.trim() || `TAG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAnimalId = addAnimal({
      animal: {
        internalId: internalId || `GN-${Date.now()}`,
        name: name || `Calf ${chosenEarTag}`,
        sex,
        birthDate,
        birthWeightKg: parseFloat(birthWeightKg) || undefined,
        currentWeightKg: parseFloat(currentWeightKg) || undefined,
        lifeStatus: 'ALIVE',
        useStatus,
        classification: 'FARM_ANIMAL',
        isBreedingStock: false,
        coatColor,
        hornStatus,
        ownerOrgId: 'org-apex',
        farmId: farmId || farms[0]?.id,
        herdId: herdId || herds.find((h) => h.farmId === farmId)?.id || herds[0]?.id,
        managementGroupId: groupId || undefined,
        registrationStatus: 'PENDING',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
        requiresReview: false,
        latestConditionScore: 4.0,
        breed: primaryBreed,
        primaryIdentifier: chosenEarTag,
        primaryIdentifierType: 'EAR_TAG',
        sireId: sireId || undefined,
        sireName: selectedSire?.name || (externalSireName ? externalSireName : undefined),
        damId: damId || undefined,
        damName: selectedDam?.name || (externalDamName ? externalDamName : undefined),
      },
      identifiers: [
        {
          type: 'EAR_TAG',
          value: chosenEarTag,
          issuer: 'Farm Management Office',
          country: 'USA',
          isPrimary: true,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        ...(rfid.trim()
          ? [
              {
                type: 'RFID_EID' as IdentifierType,
                value: rfid.trim(),
                issuer: 'National Livestock Identification',
                country: 'USA',
                isPrimary: false,
                issueDate: birthDate,
                status: 'ACTIVE' as const,
              },
            ]
          : []),
      ],
      breedComposition: [
        {
          breedId: 'breed-1',
          breedName: primaryBreed,
          percentage: parseFloat(breedPercentage) || 100,
          source: 'OWNER_REPORTED',
          confidence: 'HIGH',
          recordedDate: birthDate,
        },
      ],
      parentage: {
        sireId: sireId || undefined,
        sireName: selectedSire?.name || externalSireName || undefined,
        sireStatus: sireId ? 'RECORDED' : 'PROPOSED',
        damId: damId || undefined,
        damName: selectedDam?.name || externalDamName || undefined,
        damStatus: damId ? 'RECORDED' : 'PROPOSED',
        source: 'INTAKE_REGISTRATION',
        confidence: 'HIGH',
        notes: parentageNotes || undefined,
      },
      initialPhoto: photoUrl,
    });

    router.push(`/bovine/animals/farm-animals/${newAnimalId}`);
  };

  return {
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
  };
}
