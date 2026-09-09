import { useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export function useGeneticsDashboard() {
  const { animals } = useBovine();
  const {
    laboratories,
    traitDefinitions,
    contemporaryGroups,
    phenotypeObservations,
    performanceTests,
    geneticSamples,
    genotypingAssays,
    animalGeneticConditionResults,
    geneticEvaluationRuns,
    addGeneticSample,
    addPhenotypeObservation,
  } = useGenetics();

  // Modal states
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [phenotypeModalOpen, setPhenotypeModalOpen] = useState(false);

  // Quick form states
  const [newSampleAnimalId, setNewSampleAnimalId] = useState(animals[0]?.id || '');
  const [newSampleType, setNewSampleType] = useState<'TISSUE_TSU' | 'BLOOD_EDTA' | 'SEMEN' | 'HAIR_FOLLICLE'>('TISSUE_TSU');
  const [newSampleLabId, setNewSampleLabId] = useState(laboratories[0]?.id || '');
  const [newSampleBarcode, setNewSampleBarcode] = useState('');

  const [newPhenoAnimalId, setNewPhenoAnimalId] = useState(animals[0]?.id || '');
  const [newPhenoTraitId, setNewPhenoTraitId] = useState(traitDefinitions[0]?.id || '');
  const [newPhenoValue, setNewPhenoValue] = useState('');
  const [newPhenoCgId, setNewPhenoCgId] = useState(contemporaryGroups[0]?.id || '');

  // Computed metrics
  const totalPhenotypes = phenotypeObservations.length;
  const validatedPhenotypes = phenotypeObservations.filter((p) => p.qualityStatus === 'VALIDATED').length;
  const suspectPhenotypes = phenotypeObservations.filter(
    (p) => p.qualityStatus === 'SUSPECT' || p.qualityStatus === 'REJECTED'
  );

  const activeSamples = geneticSamples.filter(
    (s) => s.status !== 'COMPLETED' && s.status !== 'REJECTED'
  );
  const highQcAssays = genotypingAssays.filter((a) => a.qcStatus === 'PASSED').length;
  const activeRuns = geneticEvaluationRuns.filter((r) => r.status === 'PUBLISHED');
  const latestRun = activeRuns[0] || geneticEvaluationRuns[0];

  // Recessive condition carriers
  const carrierResults = animalGeneticConditionResults.filter(
    (r) => r.status === 'CARRIER' || r.status === 'AFFECTED'
  );
  const homozygousPolled = animalGeneticConditionResults.filter(
    (r) => r.conditionCode === 'POLLED_TRAIT' && r.notes?.includes('Homozygous')
  );

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newSampleAnimalId);
    const lab = laboratories.find((l) => l.id === newSampleLabId);
    if (!animal) return;

    addGeneticSample({
      sampleCode: `SMP-${Date.now().toString().slice(-6)}`,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      sampleType: newSampleType,
      collectedDate: new Date().toISOString().split('T')[0],
      collectedBy: 'Dr. John Miller',
      destinationLabId: newSampleLabId,
      destinationLabName: lab?.name,
      status: 'COLLECTED',
      barcode: newSampleBarcode || `TSU-${Date.now().toString().slice(-8)}`,
      chainOfCustody: [
        {
          timestamp: new Date().toLocaleString(),
          location: 'Farm Maternity Collection Pen',
          handledBy: 'Dr. John Miller',
          action: 'Biological sample collected and scanned into system',
        },
      ],
    });

    setSampleModalOpen(false);
    setNewSampleBarcode('');
  };

  const handleCreatePhenotype = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newPhenoAnimalId);
    const trait = traitDefinitions.find((t) => t.id === newPhenoTraitId);
    const cg = contemporaryGroups.find((c) => c.id === newPhenoCgId);
    if (!animal || !trait || !newPhenoValue) return;

    const val = parseFloat(newPhenoValue);
    const isOutlier =
      (trait.minValidValue !== undefined && val < trait.minValidValue) ||
      (trait.maxValidValue !== undefined && val > trait.maxValidValue);

    addPhenotypeObservation({
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      traitId: trait.id,
      traitCode: trait.code,
      traitName: trait.name,
      unit: trait.unit,
      observationDate: new Date().toISOString().split('T')[0],
      stage: trait.stages[0] || 'YEARLING',
      rawValue: val,
      adjustedValue: val,
      animalAgeDays: 200,
      contemporaryGroupId: cg?.id,
      contemporaryGroupCode: cg?.code,
      farmId: animal.farmId,
      recordedBy: 'Field Assessor',
      qualityStatus: isOutlier ? 'SUSPECT' : 'VALIDATED',
      qualityFlags: isOutlier
        ? ['VALUE_OUTSIDE_SOP_BOUNDS', 'PENDING_SUPERVISOR_AUDIT']
        : ['STANDARD_SOP_RECORDED'],
      notes: isOutlier ? `Recorded value ${val} ${trait.unit} triggers outlier inspection.` : undefined,
    });

    setPhenotypeModalOpen(false);
    setNewPhenoValue('');
  };

  return {
    animals,
    laboratories,
    traitDefinitions,
    contemporaryGroups,
    performanceTests,
    geneticSamples,
    totalPhenotypes,
    validatedPhenotypes,
    suspectPhenotypes,
    activeSamples,
    highQcAssays,
    genotypingAssays,
    latestRun,
    carrierResults,
    homozygousPolled,
    // Modals
    sampleModalOpen,
    setSampleModalOpen,
    phenotypeModalOpen,
    setPhenotypeModalOpen,
    // Form state & handlers
    newSampleAnimalId,
    setNewSampleAnimalId,
    newSampleType,
    setNewSampleType,
    newSampleLabId,
    setNewSampleLabId,
    newSampleBarcode,
    setNewSampleBarcode,
    handleCreateSample,
    newPhenoAnimalId,
    setNewPhenoAnimalId,
    newPhenoTraitId,
    setNewPhenoTraitId,
    newPhenoValue,
    setNewPhenoValue,
    newPhenoCgId,
    setNewPhenoCgId,
    handleCreatePhenotype,
  };
}
