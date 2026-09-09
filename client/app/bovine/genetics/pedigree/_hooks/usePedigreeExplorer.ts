'use client';

import { useState, useMemo } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { Parentage } from '@/lib/bovine-types';

export function usePedigreeExplorer() {
  const { animals, parentages, updateParentage } = useBovine();
  const {
    genotypingAssays,
    animalGeneticConditionResults,
    animalGeneticMetrics,
    geneticTraitEstimates,
  } = useGenetics();

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('anim-1');
  const [generationsDepth, setGenerationsDepth] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [matingSireId, setMatingSireId] = useState<string>('anim-2');
  const [matingDamId, setMatingDamId] = useState<string>('anim-1');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  // Filtered animal list for search
  const filteredAnimals = useMemo(() => {
    if (!searchQuery.trim()) return animals;
    const q = searchQuery.toLowerCase();
    return animals.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.internalId.toLowerCase().includes(q) ||
        a.primaryIdentifier?.toLowerCase().includes(q)
    );
  }, [animals, searchQuery]);

  // Current animal's parentage
  const parentage: Parentage | undefined = selectedAnimal ? parentages[selectedAnimal.id] : undefined;

  // Inbreeding metrics for selected animal
  const animalMetrics = animalGeneticMetrics.filter((m) => m.animalId === selectedAnimal?.id);
  const pedigreeF = animalMetrics.find((m) => m.metricType === 'PEDIGREE_INBREEDING_F');
  const genomicFroh = animalMetrics.find((m) => m.metricType === 'GENOMIC_INBREEDING_FROH');

  // Conditions for selected animal
  const conditionResults = animalGeneticConditionResults.filter(
    (r) => r.animalId === selectedAnimal?.id
  );

  // Helper to get an animal by ID or name
  const findAnimalByName = (name?: string) => {
    if (!name) return undefined;
    return animals.find((a) => a.name.toLowerCase() === name.toLowerCase());
  };

  const sireAnimal = parentage?.sireId ? animals.find((a) => a.id === parentage.sireId) : findAnimalByName(parentage?.sireName);
  const damAnimal = parentage?.damId ? animals.find((a) => a.id === parentage.damId) : findAnimalByName(parentage?.damName);

  const sireParentage = sireAnimal ? parentages[sireAnimal.id] : undefined;
  const damParentage = damAnimal ? parentages[damAnimal.id] : undefined;

  // Simulated mating inbreeding coefficient calculation
  const simulatedInbreeding = useMemo(() => {
    const sire = animals.find((a) => a.id === matingSireId);
    const dam = animals.find((a) => a.id === matingDamId);
    if (!sire || !dam) return { f: '0.0%', risk: 'LOW', reason: 'Unrelated foundational lines' };

    // Simple kinship heuristic based on pedigree overlap
    const sireP = parentages[sire.id];
    const damP = parentages[dam.id];
    let commonAncestors = 0;
    if (sireP && damP) {
      if (sireP.sireName && sireP.sireName === damP.sireName) commonAncestors += 2;
      if (sireP.damName && sireP.damName === damP.damName) commonAncestors += 2;
      if (sireP.sireName && sireP.sireName === damP.mgsName) commonAncestors += 1;
    }

    if (commonAncestors >= 2) {
      return {
        f: '6.25% - 12.5%',
        risk: 'HIGH',
        reason: 'Close consanguinity: shared common grand-parents detected in 3-generation window.',
      };
    } else if (commonAncestors === 1) {
      return {
        f: '3.12% - 4.5%',
        risk: 'MODERATE',
        reason: 'Moderate common linebreeding through maternal grandsire.',
      };
    } else {
      return {
        f: '< 2.5%',
        risk: 'OPTIMAL',
        reason: 'Clean outcross mating with negligible common ancestry.',
      };
    }
  }, [matingSireId, matingDamId, animals, parentages]);

  // Handle parentage verification update
  const handleVerifyParentage = (method: 'DNA_CONFIRMED' | 'GENOMIC_INFERRED' | 'RECORD_ONLY') => {
    if (!selectedAnimal || !parentage) return;
    const updated: Parentage = {
      ...parentage,
      verificationMethod: method,
      verificationStatus: method === 'DNA_CONFIRMED' ? 'VERIFIED' : 'PENDING_TEST',
      completenessScore: method === 'DNA_CONFIRMED' ? 100 : 85,
      genomicConsistency: method === 'DNA_CONFIRMED' ? 'CONSISTENT' : 'UNTESTED',
      lastUpdated: new Date().toISOString(),
    };
    updateParentage(selectedAnimal.id, updated);
    setVerifyModalOpen(false);
  };

  return {
    animals,
    selectedAnimal,
    selectedAnimalId,
    setSelectedAnimalId,
    generationsDepth,
    setGenerationsDepth,
    searchQuery,
    setSearchQuery,
    filteredAnimals,
    parentage,
    pedigreeF,
    genomicFroh,
    conditionResults,
    sireAnimal,
    damAnimal,
    sireParentage,
    damParentage,
    matingSireId,
    setMatingSireId,
    matingDamId,
    setMatingDamId,
    simulatedInbreeding,
    verifyModalOpen,
    setVerifyModalOpen,
    handleVerifyParentage,
  };
}
