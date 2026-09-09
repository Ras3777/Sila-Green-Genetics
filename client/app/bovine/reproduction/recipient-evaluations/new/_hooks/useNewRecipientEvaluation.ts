'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';

export function useNewRecipientEvaluation() {
  const router = useRouter();
  const { animals, farms, addRecipientEvaluation } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');

  // Form State
  // Section A: Recipient Identity
  const [cowAnimalId, setCowAnimalId] = useState(femaleAnimals[0]?.id || '');
  const [earTag, setEarTag] = useState(femaleAnimals[0]?.primaryIdentifier || 'REC-104');
  const [farmId, setFarmId] = useState(femaleAnimals[0]?.farmId || farms[0]?.id || '');
  const [breed, setBreed] = useState(femaleAnimals[0]?.breed || 'Nelore x Angus F1');

  // Section B: Synchronization & Estrus
  const [syncProtocol, setSyncProtocol] = useState('7-Day CIDR + PGF2a');
  const [estrusScore, setEstrusScore] = useState(4);
  const [standingHeat, setStandingHeat] = useState(true);
  const [cervicalMucus, setCervicalMucus] = useState('Clear, viscous, abundant');
  const [uterineTone, setUterineTone] = useState('Good / Turgid');

  // Section C: Pregnancy Evaluation
  const [clQuality, setClQuality] = useState('Grade 1 (Excellent / >20mm)');
  const [clSide, setClSide] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [clDiameterMm, setClDiameterMm] = useState('22.5');
  const [uterineFluid, setUterineFluid] = useState('None (Clean)');
  const [gestationStatus, setGestationStatus] = useState<'OPEN' | 'CONFIRMED_PREGNANT' | 'SUSPECT'>('OPEN');
  const [lastCheckDate, setLastCheckDate] = useState(new Date().toISOString().split('T')[0]);

  // Section D: Calf Outcome
  const [calfOutcome, setCalfOutcome] = useState('Strong maternal instinct, calved unassisted previously, high milk yield.');

  // Section E: Health & Structural Evaluation
  const [bcs, setBcs] = useState(6.0);
  const [tickCount, setTickCount] = useState('Low / Parasite-Free');
  const [headEyes, setHeadEyes] = useState('Alert, clear eyes, feminine head');
  const [coatColor, setCoatColor] = useState('Smooth coat, clean dermis');
  const [muscleDevelopment, setMuscleDevelopment] = useState('Moderate, ideal for maternal surrogate');
  const [umbilicalCondition, setUmbilicalCondition] = useState('Normal, healthy navel');
  const [bodyStructure, setBodyStructure] = useState('Deep rib, wide pelvic canal, sound hooves');
  const [generalConformationScore, setGeneralConformationScore] = useState(4);
  const [earTagVerified, setEarTagVerified] = useState(true);

  // Evaluator & Status
  const [evaluator, setEvaluator] = useState('Dr. Helena Rocha (DVM / Theriogenologist)');
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split('T')[0]);
  const [overallStatus, setOverallStatus] = useState<'APPROVED' | 'CONDITIONAL' | 'REJECTED'>('APPROVED');
  const [verified, setVerified] = useState(true);
  const [notes, setNotes] = useState('Excellent recipient candidate with robust functional corpus luteum.');

  const handleCowChange = (id: string) => {
    setCowAnimalId(id);
    const selected = animals.find((a) => a.id === id);
    if (selected) {
      setEarTag(selected.primaryIdentifier || selected.internalId);
      setFarmId(selected.farmId);
      if (selected.breed) setBreed(selected.breed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addRecipientEvaluation({
      cowAnimalId,
      earTag,
      farmId,
      breed,
      bcs,
      estrusScore,
      clQuality: `${clQuality} (${clSide} ovary, ${clDiameterMm}mm)`,
      gestationStatus,
      lastPregnancyCheckDate: lastCheckDate,
      calfOutcome,
      healthAndStructure: {
        tickCount,
        headEyes,
        bodyTypeBcs: bcs,
        coatColor,
        muscleDevelopment,
        umbilicalCondition,
        bodyStructure,
        generalConformationScore,
        earTagVerified,
      },
      verified,
      evaluator,
      evaluationDate,
      overallStatus,
      notes: notes || undefined,
    });

    router.push('/bovine/reproduction/recipient-evaluations');
  };

  return {
    animals,
    farms,
    femaleAnimals,
    cowAnimalId,
    setCowAnimalId,
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
    standingHeat,
    setStandingHeat,
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
    uterineFluid,
    setUterineFluid,
    gestationStatus,
    setGestationStatus,
    lastCheckDate,
    setLastCheckDate,
    calfOutcome,
    setCalfOutcome,
    bcs,
    setBcs,
    tickCount,
    setTickCount,
    headEyes,
    setHeadEyes,
    coatColor,
    setCoatColor,
    muscleDevelopment,
    setMuscleDevelopment,
    umbilicalCondition,
    setUmbilicalCondition,
    bodyStructure,
    setBodyStructure,
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
    verified,
    setVerified,
    notes,
    setNotes,
    handleCowChange,
    handleSubmit,
  };
}
