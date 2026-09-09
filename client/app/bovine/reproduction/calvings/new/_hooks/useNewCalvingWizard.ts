'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import { CalvingEase, BirthOutcome, Sex } from '@/lib/bovine-types';

export interface OffspringEntry {
  name: string;
  tagNumber: string;
  sex: Sex;
  birthOutcome: BirthOutcome;
  birthWeightKg: number;
  coatColor: string;
  calfType: string;
  neonatalNotes: string;
}

export function useNewCalvingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cowIdParam = searchParams.get('cowId');
  const sireIdParam = searchParams.get('sireId');

  const { animals, farms, herds, pregnancies, addCalvingEvent } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');
  const maleAnimals = animals.filter((a) => a.sex === 'MALE');

  // Selected dam and linked pregnancy
  const [damId, setDamId] = useState(cowIdParam || femaleAnimals[0]?.id || '');
  const activePregnancy = pregnancies.find((p) => p.damId === damId && p.status === 'CONFIRMED');

  const selectedDam = animals.find((a) => a.id === damId);

  // Calving event state
  const [calvingDate, setCalvingDate] = useState(new Date().toISOString().split('T')[0]);
  const [calvingTime, setCalvingTime] = useState('06:30');
  const [farmId, setFarmId] = useState(selectedDam?.farmId || farms[0]?.id || '');
  const [difficulty, setDifficulty] = useState<CalvingEase>('NORMAL');
  const [assistanceDetails, setAssistanceDetails] = useState('');
  const [deliveryType, setDeliveryType] = useState('Vaginal Spontaneous');
  const [maternalBehaviorScore, setMaternalBehaviorScore] = useState(5);
  const [colostrumQuality, setColostrumQuality] = useState('EXCELLENT');
  const [recordedByName, setRecordedByName] = useState('Senior Herdsman');
  const [notes, setNotes] = useState('');

  // Sire info
  const [sireId, setSireId] = useState(sireIdParam || '');
  const [sirePlaceholder, setSirePlaceholder] = useState('SAV Raindance 6848');

  // Offspring state (can support multiple calves e.g. twins)
  const [offspring, setOffspring] = useState<OffspringEntry[]>([
    {
      name: `Calf of ${selectedDam?.name || 'Dam'}`,
      tagNumber: `CALF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sex: 'BULL',
      birthOutcome: 'LIVE',
      birthWeightKg: 38.5,
      coatColor: selectedDam?.coatColor || 'Solid Black',
      calfType: 'Commercial Farm Stock',
      neonatalNotes: 'Vigorous suckling reflex observed within 45 mins. 3.5L maternal colostrum consumed.',
    },
  ]);

  const handleDamChange = (newDamId: string) => {
    setDamId(newDamId);
    const d = animals.find((a) => a.id === newDamId);
    if (d) {
      setFarmId(d.farmId);
      setOffspring((prev) =>
        prev.map((o) => ({
          ...o,
          name: `Calf of ${d.name}`,
          coatColor: d.coatColor || 'Solid Black',
        }))
      );
    }
  };

  const addTwinCalf = () => {
    setOffspring([
      ...offspring,
      {
        name: `Twin 2 of ${selectedDam?.name || 'Dam'}`,
        tagNumber: `CALF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        sex: 'HEIFER',
        birthOutcome: 'LIVE',
        birthWeightKg: 35.0,
        coatColor: selectedDam?.coatColor || 'Solid Black',
        calfType: 'Commercial Farm Stock',
        neonatalNotes: 'Twin birth - vigorous and nursing promptly.',
      },
    ]);
  };

  const removeOffspring = (idx: number) => {
    if (offspring.length > 1) {
      setOffspring(offspring.filter((_, i) => i !== idx));
    }
  };

  const updateCalf = (idx: number, updates: Partial<OffspringEntry>) => {
    const updated = [...offspring];
    updated[idx] = { ...updated[idx], ...updates };
    setOffspring(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCalvingEvent({
      event: {
        damId,
        pregnancyId: activePregnancy?.id,
        farmId,
        calvingDate,
        calvingTime,
        difficulty,
        assistanceDetails: assistanceDetails || undefined,
        deliveryType,
        totalBorn: offspring.length,
        bornAlive: offspring.filter((o) => o.birthOutcome === 'LIVE').length,
        bornDead: offspring.filter((o) => o.birthOutcome !== 'LIVE').length,
        maternalBehaviorScore,
        colostrumQuality: colostrumQuality as any,
        colostrumDeliveredHours: 1.5,
        recordedByName,
        notes: notes || undefined,
      },
      offspring: offspring.map((o, idx) => ({
        birthOrder: idx + 1,
        birthOutcome: o.birthOutcome,
        birthWeightKg: o.birthWeightKg,
        sex: o.sex,
        name: o.name,
        tagNumber: o.tagNumber,
        coatColor: o.coatColor,
        neonatalNotes: o.neonatalNotes,
      })),
    });

    router.push('/bovine/reproduction/calvings');
  };

  return {
    farms,
    femaleAnimals,
    maleAnimals,
    damId,
    activePregnancy,
    selectedDam,
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
    recordedByName,
    setRecordedByName,
    notes,
    setNotes,
    sireId,
    setSireId,
    sirePlaceholder,
    setSirePlaceholder,
    offspring,
    handleDamChange,
    addTwinCalf,
    removeOffspring,
    updateCalf,
    handleSubmit,
  };
}
