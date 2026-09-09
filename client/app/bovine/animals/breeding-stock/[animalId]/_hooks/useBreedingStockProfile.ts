import { useState } from 'react';
import { useBovine } from '@/lib/bovine-store';

export type BreedingStockTab =
  | 'overview'
  | 'identity'
  | 'pedigree'
  | 'breed'
  | 'performance'
  | 'phenotypes'
  | 'genetics'
  | 'evaluations'
  | 'reproduction'
  | 'progeny'
  | 'health'
  | 'media'
  | 'audit';

export function useBreedingStockProfile(animalId: string) {
  const {
    animals,
    identifiers,
    parentages,
    maternalRecords,
    weaningRecords,
    yearlingRecords,
    reproductiveProcesses,
    healthEvents,
    farms,
    herds,
  } = useBovine();

  const [activeTab, setActiveTab] = useState<BreedingStockTab>('overview');

  const animal = animals.find((a) => a.id === animalId);

  const farm = animal ? farms.find((f) => f.id === animal.farmId) : null;
  const herd = animal ? herds.find((h) => h.id === animal.herdId) : null;
  const animalIds = animal ? identifiers.filter((i) => i.animalId === animal.id) : [];
  const parentRel = animal ? parentages?.[animal.id] : null;
  const sire = parentRel?.sireId ? animals.find((a) => a.id === parentRel.sireId) : null;
  const dam = parentRel?.damId ? animals.find((a) => a.id === parentRel.damId) : null;

  const maternalList = animal ? maternalRecords.filter((r) => r.animalId === animal.id) : [];
  const weaningList = animal ? weaningRecords.filter((r) => r.animalId === animal.id) : [];
  const yearlingList = animal ? yearlingRecords.filter((r) => r.animalId === animal.id) : [];
  const reproList = animal
    ? reproductiveProcesses.filter(
        (p) => p.cowAnimalId === animal.id || p.donorCowAnimalId === animal.id || p.bullAnimalId === animal.id
      )
    : [];
  const healthList = animal ? healthEvents.filter((h) => h.animalId === animal.id) : [];
  const progenyList = animal
    ? animals.filter((a) => {
        const p = parentages?.[a.id];
        return p?.sireId === animal.id || p?.damId === animal.id;
      })
    : [];

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'identity' as const, label: 'Identity & IDs', badge: animalIds.length.toString() },
    { key: 'pedigree' as const, label: 'Pedigree & Lineage' },
    { key: 'breed' as const, label: 'Breed Composition' },
    { key: 'performance' as const, label: 'Phases I-III Performance' },
    { key: 'phenotypes' as const, label: 'Phenotypes & Ultrasound' },
    { key: 'genetics' as const, label: 'EPDs / EBVs & DECA' },
    { key: 'evaluations' as const, label: 'Genetic Evaluations' },
    { key: 'reproduction' as const, label: 'Reproduction & ET', badge: reproList.length.toString() },
    { key: 'progeny' as const, label: 'Progeny', badge: progenyList.length.toString() },
    { key: 'health' as const, label: 'Health & Biosecurity' },
    { key: 'media' as const, label: 'Media & Docs' },
    { key: 'audit' as const, label: 'Audit Trail' },
  ];

  return {
    animal,
    farm,
    herd,
    animalIds,
    parentRel,
    sire,
    dam,
    maternalList,
    weaningList,
    yearlingList,
    reproList,
    healthList,
    progenyList,
    activeTab,
    setActiveTab,
    tabs,
  };
}
