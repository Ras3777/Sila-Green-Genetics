import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  AnimalSex,
  LifeStatus,
  LivestockUseStatus,
  BirthType,
  HornStatus,
  IdentifierType,
} from '@/lib/bovine-types';

export function useAnimalRegistrationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledId = searchParams.get('identifier') || '';

  const { animals, farms, herds, organizations, addAnimal } = useBovine();

  // Wizard Steps 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Identity
  const [name, setName] = useState('');
  const [sex, setSex] = useState<AnimalSex>('FEMALE');
  const [birthDate, setBirthDate] = useState('2026-03-15');
  const [birthWeightKg, setBirthWeightKg] = useState<number>(40);
  const [birthType, setBirthType] = useState<BirthType>('SINGLE');
  const [lifeStatus, setLifeStatus] = useState<LifeStatus>('ALIVE');
  const [useStatus, setUseStatus] = useState<LivestockUseStatus>('BREEDING_STOCK');
  const [coatColor, setCoatColor] = useState('Black & White');
  const [hornStatus, setHornStatus] = useState<HornStatus>('POLLED');

  // Step 2: Identifiers
  const [identifierList, setIdentifierList] = useState<
    Array<{ type: IdentifierType; value: string; isPrimary: boolean }>
  >([
    {
      type: 'EAR_TAG',
      value: prefilledId || 'US-8492041',
      isPrimary: true,
    },
    {
      type: 'RFID',
      value: '982000847291038',
      isPrimary: false,
    },
  ]);

  // Step 3: Placement & Ownership
  const [ownerOrgId, setOwnerOrgId] = useState(organizations[0]?.id || 'org-1');
  const [farmId, setFarmId] = useState(farms[0]?.id || 'farm-1');
  const [herdId, setHerdId] = useState(herds[0]?.id || 'herd-1');

  // Step 4: Breed Composition
  const [breedList, setBreedList] = useState<
    Array<{ breedName: string; percentage: number; source: any }>
  >([{ breedName: 'Holstein', percentage: 100, source: 'REGISTERED' }]);

  // Step 5: Parentage
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');

  // Step 6: Media
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
  );
  const [registrationDocName, setRegistrationDocName] = useState('Holstein_Association_Certificate.pdf');

  // Breed Percentage Sum validation
  const totalBreedPercentage = breedList.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
  const isBreedValid = totalBreedPercentage === 100;

  // Potential Sires & Dams for dropdowns
  const candidateSires = animals.filter((a) => a.sex === 'MALE');
  const candidateDams = animals.filter((a) => a.sex === 'FEMALE');

  // Add identifier row
  const addIdentifierRow = () => {
    setIdentifierList((prev) => [
      ...prev,
      { type: 'DGR', value: '', isPrimary: false },
    ]);
  };

  const removeIdentifierRow = (index: number) => {
    if (identifierList.length > 1) {
      setIdentifierList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const setPrimaryIdentifier = (index: number) => {
    setIdentifierList((prev) =>
      prev.map((item, i) => ({
        ...item,
        isPrimary: i === index,
      }))
    );
  };

  // Add breed row
  const addBreedRow = () => {
    setBreedList((prev) => [
      ...prev,
      { breedName: 'Angus', percentage: 0, source: 'GENOMIC' },
    ]);
  };

  const removeBreedRow = (index: number) => {
    if (breedList.length > 1) {
      setBreedList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Final Submit
  const handleFinalSubmit = () => {
    const primaryIdObj = identifierList.find((i) => i.isPrimary) || identifierList[0];
    const internalId = `BOV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const sire = animals.find((a) => a.id === sireId);
    const dam = animals.find((a) => a.id === damId);

    const animalId = addAnimal({
      animal: {
        internalId,
        name: name.trim() || `Heifer ${primaryIdObj.value}`,
        sex,
        birthDate,
        birthWeightKg: Number(birthWeightKg),
        birthType,
        lifeStatus,
        useStatus,
        coatColor,
        hornStatus,
        primaryIdentifier: primaryIdObj.value,
        primaryIdentifierType: primaryIdObj.type,
        registrationStatus: 'APPROVED',
        ownerOrgId,
        farmId,
        herdId,
        sireId: sire ? sire.id : undefined,
        sireName: sire ? sire.name : undefined,
        damId: dam ? dam.id : undefined,
        damName: dam ? dam.name : undefined,
        photoUrl,
        requiresReview: false,
        latestConditionScore: 4,
        operationalStatus: 'NORMAL',
      },
      identifiers: identifierList.map((i) => ({
        type: i.type,
        value: i.value,
        issuer: 'USDA / NLIS',
        country: 'USA',
        issueDate: birthDate,
        status: 'ACTIVE',
        isPrimary: i.isPrimary,
      })),
      breedComposition: breedList.map((b) => ({
        breedId: `breed-${b.breedName.toLowerCase().replace(/\s+/g, '-')}`,
        breedName: b.breedName,
        percentage: Number(b.percentage),
        source: 'REGISTRY',
        confidence: 'HIGH',
        recordedDate: birthDate,
      })),
      parentage: {
        sireId: sire?.id,
        sireName: sire?.name,
        damId: dam?.id,
        damName: dam?.name,
        damStatus: 'RECORDED',
        sireStatus: 'RECORDED',
        source: 'REGISTRY',
        confidence: 'HIGH',
      },
      ownership: {
        ownerName: 'Apex Genetics Bovine Operations',
        ownerOrgId,
        ownershipType: 'SOLE',
        sharePercentage: 100,
        startDate: birthDate,
        isCurrent: true,
        transferNotes: 'Enrolled via protocol wizard',
      },
      initialPhoto: photoUrl,
    });

    router.push(`/bovine/animals/${animalId}`);
  };

  return {
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
    lifeStatus,
    setLifeStatus,
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
  };
}
