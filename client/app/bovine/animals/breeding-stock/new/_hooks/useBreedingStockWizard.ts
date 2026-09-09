import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { Sex, UseStatus, IdentifierType } from '@/lib/bovine-types';

export function useBreedingStockWizard() {
  const router = useRouter();
  const { farms, herds, animals, addAnimal } = useBovine();
  const { addGeneticTraitEstimate } = useGenetics();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Identity
  const [dgr, setDgr] = useState(`DGR-${Math.floor(10000 + Math.random() * 90000)}`);
  const [name, setName] = useState('');
  const [earTag, setEarTag] = useState('');
  const [rfid, setRfid] = useState('');
  const [birthDate, setBirthDate] = useState('2024-02-15');
  const [sex, setSex] = useState<Sex>('FEMALE');
  const [primaryBreed, setPrimaryBreed] = useState('Holstein Friesian');
  const [bullType, setBullType] = useState('GENOMIC_CANDIDATE');
  const [useStatus, setUseStatus] = useState<UseStatus>('BREEDING_STOCK');
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [herdId, setHerdId] = useState('');
  const [owner, setOwner] = useState('Apex Bovine Genetics Consortium');
  const [supervisor, setSupervisor] = useState('Dr. Evelyn Sterling');

  // Step 2: Basic Performance
  const [birthWeightKg, setBirthWeightKg] = useState('42.0');
  const [currentWeightKg, setCurrentWeightKg] = useState('540.0');
  const [weaningWeightKg, setWeaningWeightKg] = useState('235.0');
  const [yearlingWeightKg, setYearlingWeightKg] = useState('455.0');
  const [adgKg, setAdgKg] = useState('1.18');
  const [pmwgKg, setPmwgKg] = useState('1.25');

  // Step 3: Physical Measurements
  const [rumpLengthCm, setRumpLengthCm] = useState('54.0');
  const [rumpHeightCm, setRumpHeightCm] = useState('142.0');
  const [lowerHeightCm, setLowerHeightCm] = useState('136.0');
  const [backHeightCm, setBackHeightCm] = useState('138.0');
  const [bodyLengthCm, setBodyLengthCm] = useState('168.0');
  const [ribDepthCm, setRibDepthCm] = useState('82.0');
  const [chestPerimeterCm, setChestPerimeterCm] = useState('198.0');
  const [bodyWidthCm, setBodyWidthCm] = useState('58.0');
  const [scrotalCircumferenceCm, setScrotalCircumferenceCm] = useState('36.0');

  // Step 4: Breed & Breeding Info
  const [breedRows, setBreedRows] = useState([
    { breedName: 'Holstein Friesian', percentage: 100 },
  ]);
  const [paternalNucleus, setPaternalNucleus] = useState('Elite Sires Nucleus A');
  const [paternalType, setPaternalType] = useState('GENOMIC_PROVEN');
  const [breedingType, setBreedingType] = useState('PUREBRED');
  const [birthCondition, setBirthCondition] = useState('Vigorous / Unassisted');

  // Step 5: Pedigree
  const [sireId, setSireId] = useState('');
  const [externalSireName, setExternalSireName] = useState('');
  const [damId, setDamId] = useState('');
  const [externalDamName, setExternalDamName] = useState('');
  const [pedigreeNotes, setPedigreeNotes] = useState('');

  // Step 6: Dairy & Genetic Traits
  const [milkEstimate, setMilkEstimate] = useState('+680');
  const [milkAccuracy, setMilkAccuracy] = useState('0.85');
  const [age1PEstimate, setAge1PEstimate] = useState('-12'); // Days
  const [age1PAccuracy, setAge1PAccuracy] = useState('0.72');
  const [ebiEstimate, setEbiEstimate] = useState('245');
  const [ebiAccuracy, setEbiAccuracy] = useState('0.80');
  const [betaLactoglobulin, setBetaLactoglobulin] = useState('AB');
  const [kappaCasein, setKappaCasein] = useState('BB');
  const [betaCasein, setBetaCasein] = useState('A2A2');

  // EPDs
  const [bwEpd, setBwEpd] = useState('+1.2');
  const [bwAcc, setBwAcc] = useState('0.78');
  const [bwDeca, setBwDeca] = useState('Top 15%');
  const [wwEpd, setWwEpd] = useState('+28.4');
  const [wwAcc, setWwAcc] = useState('0.82');
  const [wwDeca, setWwDeca] = useState('Top 5%');
  const [ywEpd, setYwEpd] = useState('+52.0');
  const [ywAcc, setYwAcc] = useState('0.84');
  const [ywDeca, setYwDeca] = useState('Top 5%');
  const [reaEpd, setReaEpd] = useState('+0.68');
  const [reaAcc, setReaAcc] = useState('0.74');
  const [marEpd, setMarEpd] = useState('+0.45');
  const [marAcc, setMarAcc] = useState('0.79');

  // Step 7: Media & Notes
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80');
  const [registrationNotes, setRegistrationNotes] = useState('Full multi-trait genetic evaluation verified. Clean monogenic condition screen.');

  // Potential Sires and Dams
  const potentialSires = animals.filter((a) => a.sex === 'MALE');
  const potentialDams = animals.filter((a) => a.sex === 'FEMALE');

  const selectedSire = animals.find((a) => a.id === sireId);
  const selectedDam = animals.find((a) => a.id === damId);

  // Dynamic Age calculation
  const calculateAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remaining = diffMonths % 12;
    return remaining > 0 ? `${years}y ${remaining}m` : `${years} yrs`;
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenEarTag = earTag.trim() || `TAG-${Math.floor(2000 + Math.random() * 8000)}`;

    const newAnimalId = addAnimal({
      animal: {
        internalId: dgr,
        name: name || `Breeding Candidate ${dgr}`,
        sex,
        birthDate,
        birthWeightKg: parseFloat(birthWeightKg) || undefined,
        currentWeightKg: parseFloat(currentWeightKg) || undefined,
        adgKg: parseFloat(adgKg) || undefined,
        lifeStatus: 'ALIVE',
        useStatus,
        classification: 'BREEDING_STOCK',
        isBreedingStock: true,
        dgr,
        breed: primaryBreed,
        coatColor: 'Black & White',
        hornStatus: 'POLLED',
        ownerOrgId: 'org-apex',
        farmId: farmId || farms[0]?.id,
        herdId: herdId || herds.find((h) => h.farmId === farmId)?.id || herds[0]?.id,
        registrationStatus: 'APPROVED',
        registrationNumber: dgr,
        photoUrl,
        requiresReview: false,
        latestConditionScore: 4.2,
        primaryIdentifier: dgr,
        primaryIdentifierType: 'DGR',
        sireId: sireId || undefined,
        sireName: selectedSire?.name || (externalSireName || undefined),
        damId: damId || undefined,
        damName: selectedDam?.name || (externalDamName || undefined),
        inbreedingCoefficient: 0.032,
      },
      identifiers: [
        {
          type: 'DGR',
          value: dgr,
          issuer: 'National Herdbook Registry',
          country: 'USA',
          isPrimary: true,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        {
          type: 'EAR_TAG',
          value: chosenEarTag,
          issuer: 'Farm Office',
          country: 'USA',
          isPrimary: false,
          issueDate: birthDate,
          status: 'ACTIVE',
        },
        ...(rfid.trim()
          ? [
              {
                type: 'RFID_EID' as IdentifierType,
                value: rfid.trim(),
                issuer: 'National Livestock ID',
                country: 'USA',
                isPrimary: false,
                issueDate: birthDate,
                status: 'ACTIVE' as const,
              },
            ]
          : []),
      ],
      breedComposition: breedRows.map((b, idx) => ({
        breedId: `breed-${idx + 1}`,
        breedName: b.breedName,
        percentage: b.percentage,
        source: 'PEDIGREE_DERIVED',
        confidence: 'HIGH',
        recordedDate: birthDate,
      })),
      parentage: {
        sireId: sireId || undefined,
        sireName: selectedSire?.name || externalSireName || undefined,
        sireStatus: 'VERIFIED',
        damId: damId || undefined,
        damName: selectedDam?.name || externalDamName || undefined,
        damStatus: 'VERIFIED',
        source: 'GENOMIC_CONFIRMED',
        confidence: 'HIGH',
        verificationStatus: 'VERIFIED',
        inbreedingCoefficient: 0.032,
        notes: pedigreeNotes || undefined,
      },
      initialPhoto: photoUrl,
    });

    // Add Genetic Traits & EPDs
    addGeneticTraitEstimate({
      animalId: newAnimalId,
      traitCode: 'MILK_KG',
      traitName: 'Milk Yield',
      estimateType: 'GEBV',
      value: parseFloat(milkEstimate) || 680,
      unit: 'kg',
      accuracy: parseFloat(milkAccuracy) || 0.85,
      confidenceIntervalLower: 520,
      confidenceIntervalUpper: 840,
      percentile: 5,
    });

    addGeneticTraitEstimate({
      animalId: newAnimalId,
      traitCode: 'WW_KG',
      traitName: 'Weaning Weight EPD',
      estimateType: 'EPD',
      value: parseFloat(wwEpd) || 28.4,
      unit: 'kg',
      accuracy: parseFloat(wwAcc) || 0.82,
      confidenceIntervalLower: 24.0,
      confidenceIntervalUpper: 32.8,
      percentile: 5,
    });

    router.push(`/bovine/animals/breeding-stock/${newAnimalId}`);
  };

  return {
    farms,
    herds,
    animals,
    currentStep,
    setCurrentStep,
    // Step 1
    dgr,
    setDgr,
    name,
    setName,
    earTag,
    setEarTag,
    rfid,
    setRfid,
    birthDate,
    setBirthDate,
    sex,
    setSex,
    primaryBreed,
    setPrimaryBreed,
    bullType,
    setBullType,
    useStatus,
    setUseStatus,
    farmId,
    setFarmId,
    herdId,
    setHerdId,
    owner,
    setOwner,
    supervisor,
    setSupervisor,
    calculateAge,
    // Step 2
    birthWeightKg,
    setBirthWeightKg,
    currentWeightKg,
    setCurrentWeightKg,
    weaningWeightKg,
    setWeaningWeightKg,
    yearlingWeightKg,
    setYearlingWeightKg,
    adgKg,
    setAdgKg,
    pmwgKg,
    setPmwgKg,
    // Step 3
    rumpLengthCm,
    setRumpLengthCm,
    rumpHeightCm,
    setRumpHeightCm,
    lowerHeightCm,
    setLowerHeightCm,
    backHeightCm,
    setBackHeightCm,
    bodyLengthCm,
    setBodyLengthCm,
    ribDepthCm,
    setRibDepthCm,
    chestPerimeterCm,
    setChestPerimeterCm,
    bodyWidthCm,
    setBodyWidthCm,
    scrotalCircumferenceCm,
    setScrotalCircumferenceCm,
    // Step 4
    breedRows,
    setBreedRows,
    paternalNucleus,
    setPaternalNucleus,
    paternalType,
    setPaternalType,
    breedingType,
    setBreedingType,
    birthCondition,
    setBirthCondition,
    // Step 5
    sireId,
    setSireId,
    externalSireName,
    setExternalSireName,
    damId,
    setDamId,
    externalDamName,
    setExternalDamName,
    pedigreeNotes,
    setPedigreeNotes,
    potentialSires,
    potentialDams,
    selectedSire,
    selectedDam,
    // Step 6
    milkEstimate,
    setMilkEstimate,
    milkAccuracy,
    setMilkAccuracy,
    age1PEstimate,
    setAge1PEstimate,
    age1PAccuracy,
    setAge1PAccuracy,
    ebiEstimate,
    setEbiEstimate,
    ebiAccuracy,
    setEbiAccuracy,
    betaLactoglobulin,
    setBetaLactoglobulin,
    kappaCasein,
    setKappaCasein,
    betaCasein,
    setBetaCasein,
    bwEpd,
    setBwEpd,
    bwAcc,
    setBwAcc,
    bwDeca,
    setBwDeca,
    wwEpd,
    setWwEpd,
    wwAcc,
    setWwAcc,
    wwDeca,
    setWwDeca,
    ywEpd,
    setYwEpd,
    ywAcc,
    setYwAcc,
    ywDeca,
    setYwDeca,
    reaEpd,
    setReaEpd,
    reaAcc,
    setReaAcc,
    marEpd,
    setMarEpd,
    marAcc,
    setMarAcc,
    // Step 7
    photoUrl,
    setPhotoUrl,
    registrationNotes,
    setRegistrationNotes,
    handleCompleteRegistration,
  };
}
