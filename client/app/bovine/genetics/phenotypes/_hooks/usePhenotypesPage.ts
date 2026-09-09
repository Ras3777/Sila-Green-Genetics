import { useState, useMemo } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { TraitDefinition, MeasurementMethod, PhenotypeObservation } from '@/lib/bovine-types';

export type PhenotypeTab = 'OBSERVATIONS' | 'TRAITS' | 'METHODS';

export function usePhenotypesPage() {
  const { animals } = useBovine();
  const {
    traitDefinitions,
    measurementMethods,
    contemporaryGroups,
    phenotypeObservations,
    addPhenotypeObservation,
    addTraitDefinition,
    addMeasurementMethod,
    setPhenotypeQualityStatus,
    bulkValidatePhenotypes,
    bulkRejectPhenotypes,
  } = useGenetics();

  // Active view tab: Observations, Trait Definitions, or Measurement Methods
  const [activeTab, setActiveTab] = useState<PhenotypeTab>('OBSERVATIONS');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [traitFilter, setTraitFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cgFilter, setCgFilter] = useState('ALL');

  // Selected observations for bulk action
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [traitModalOpen, setTraitModalOpen] = useState(false);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Record phenotype form state
  const [obsAnimalId, setObsAnimalId] = useState(animals[0]?.id || '');
  const [obsTraitId, setObsTraitId] = useState(traitDefinitions[0]?.id || '');
  const [obsRawValue, setObsRawValue] = useState('');
  const [obsAdjustedValue, setObsAdjustedValue] = useState('');
  const [obsAdjustmentReason, setObsAdjustmentReason] = useState('');
  const [obsMethodId, setObsMethodId] = useState(measurementMethods[0]?.id || '');
  const [obsCgId, setObsCgId] = useState(contemporaryGroups[0]?.id || '');
  const [obsRecordedBy, setObsRecordedBy] = useState('Dr. John Miller');
  const [obsNotes, setObsNotes] = useState('');

  // Trait form state
  const [newTraitCode, setNewTraitCode] = useState('');
  const [newTraitName, setNewTraitName] = useState('');
  const [newTraitCategory, setNewTraitCategory] = useState<TraitDefinition['category']>('GROWTH');
  const [newTraitUnit, setNewTraitUnit] = useState('kg');
  const [newTraitDirection, setNewTraitDirection] = useState<TraitDefinition['direction']>('INCREASE');
  const [newTraitHeritability, setNewTraitHeritability] = useState('0.35');
  const [newTraitMin, setNewTraitMin] = useState('');
  const [newTraitMax, setNewTraitMax] = useState('');
  const [newTraitDesc, setNewTraitDesc] = useState('');

  // Method form state
  const [newMethodCode, setNewMethodCode] = useState('');
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodVersion, setNewMethodVersion] = useState('v1.0 (ICAR)');
  const [newMethodEquipment, setNewMethodEquipment] = useState('');
  const [newMethodSop, setNewMethodSop] = useState('');

  // Selected trait for preview in modal
  const selectedTraitForObs = traitDefinitions.find((t) => t.id === obsTraitId);

  // Filtered observations
  const filteredObservations = useMemo(() => {
    return phenotypeObservations.filter((obs) => {
      if (traitFilter !== 'ALL' && obs.traitId !== traitFilter) return false;
      if (statusFilter !== 'ALL' && obs.qualityStatus !== statusFilter) return false;
      if (cgFilter !== 'ALL' && obs.contemporaryGroupId !== cgFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAnimal = obs.animalName.toLowerCase().includes(q) || obs.animalIdentifier?.toLowerCase().includes(q);
        const matchesTrait = obs.traitName.toLowerCase().includes(q) || obs.traitCode.toLowerCase().includes(q);
        const matchesMethod = obs.measurementMethodCode?.toLowerCase().includes(q);
        return matchesAnimal || matchesTrait || matchesMethod;
      }
      return true;
    });
  }, [phenotypeObservations, traitFilter, statusFilter, cgFilter, searchQuery]);

  // Bulk selection toggles
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredObservations.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Submit new phenotype
  const handleSubmitPhenotype = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === obsAnimalId);
    const trait = traitDefinitions.find((t) => t.id === obsTraitId);
    const method = measurementMethods.find((m) => m.id === obsMethodId);
    const cg = contemporaryGroups.find((c) => c.id === obsCgId);
    if (!animal || !trait || !obsRawValue) return;

    const raw = parseFloat(obsRawValue);
    const adj = obsAdjustedValue ? parseFloat(obsAdjustedValue) : raw;

    const isOutOfRange =
      (trait.minValidValue !== undefined && raw < trait.minValidValue) ||
      (trait.maxValidValue !== undefined && raw > trait.maxValidValue);

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
      rawValue: raw,
      adjustedValue: adj,
      adjustmentReason: obsAdjustmentReason || undefined,
      animalAgeDays: 205,
      measurementMethodId: method?.id,
      measurementMethodCode: method?.code,
      contemporaryGroupId: cg?.id,
      contemporaryGroupCode: cg?.code,
      farmId: animal.farmId,
      recordedBy: obsRecordedBy,
      qualityStatus: isOutOfRange ? 'SUSPECT' : 'VALIDATED',
      qualityFlags: isOutOfRange
        ? ['VALUE_OUTSIDE_BIOLOGICAL_LIMITS', 'REQUIRES_FIELD_AUDIT']
        : ['SOP_CONFORMANT'],
      notes: obsNotes || undefined,
    });

    setRecordModalOpen(false);
    setObsRawValue('');
    setObsAdjustedValue('');
    setObsAdjustmentReason('');
    setObsNotes('');
  };

  // Submit new trait
  const handleSubmitTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraitCode || !newTraitName) return;

    addTraitDefinition({
      code: newTraitCode.toUpperCase(),
      name: newTraitName,
      category: newTraitCategory,
      unit: newTraitUnit,
      direction: newTraitDirection,
      isSexLimited: newTraitCategory === 'MILK',
      eligibleSex: newTraitCategory === 'MILK' ? 'FEMALE' : undefined,
      active: true,
      description: newTraitDesc,
      stages: ['YEARLING'],
      heritability: parseFloat(newTraitHeritability) || 0.35,
      minValidValue: newTraitMin ? parseFloat(newTraitMin) : undefined,
      maxValidValue: newTraitMax ? parseFloat(newTraitMax) : undefined,
    });

    setTraitModalOpen(false);
    setNewTraitCode('');
    setNewTraitName('');
    setNewTraitDesc('');
  };

  // Submit new method
  const handleSubmitMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodCode || !newMethodName) return;

    addMeasurementMethod({
      code: newMethodCode.toUpperCase(),
      name: newMethodName,
      protocolVersion: newMethodVersion,
      description: newMethodSop,
      active: true,
      equipment: newMethodEquipment,
      unit: 'standard',
    });

    setMethodModalOpen(false);
    setNewMethodCode('');
    setNewMethodName('');
    setNewMethodEquipment('');
    setNewMethodSop('');
  };

  const handleBulkRejectConfirm = () => {
    bulkRejectPhenotypes(selectedIds, rejectReason || 'Operator Rejected');
    setRejectReasonModalOpen(false);
    setSelectedIds([]);
    setRejectReason('');
  };

  return {
    // Data
    animals,
    traitDefinitions,
    measurementMethods,
    contemporaryGroups,
    phenotypeObservations,
    filteredObservations,
    selectedTraitForObs,
    // Tabs & Filters
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    traitFilter,
    setTraitFilter,
    statusFilter,
    setStatusFilter,
    cgFilter,
    setCgFilter,
    // Selection
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleToggleSelect,
    // Modals
    recordModalOpen,
    setRecordModalOpen,
    traitModalOpen,
    setTraitModalOpen,
    methodModalOpen,
    setMethodModalOpen,
    rejectReasonModalOpen,
    setRejectReasonModalOpen,
    rejectReason,
    setRejectReason,
    // Record Form
    obsAnimalId,
    setObsAnimalId,
    obsTraitId,
    setObsTraitId,
    obsRawValue,
    setObsRawValue,
    obsAdjustedValue,
    setObsAdjustedValue,
    obsAdjustmentReason,
    setObsAdjustmentReason,
    obsMethodId,
    setObsMethodId,
    obsCgId,
    setObsCgId,
    obsRecordedBy,
    setObsRecordedBy,
    obsNotes,
    setObsNotes,
    handleSubmitPhenotype,
    // Trait Form
    newTraitCode,
    setNewTraitCode,
    newTraitName,
    setNewTraitName,
    newTraitCategory,
    setNewTraitCategory,
    newTraitUnit,
    setNewTraitUnit,
    newTraitDirection,
    setNewTraitDirection,
    newTraitHeritability,
    setNewTraitHeritability,
    newTraitMin,
    setNewTraitMin,
    newTraitMax,
    setNewTraitMax,
    newTraitDesc,
    setNewTraitDesc,
    handleSubmitTrait,
    // Method Form
    newMethodCode,
    setNewMethodCode,
    newMethodName,
    setNewMethodName,
    newMethodVersion,
    setNewMethodVersion,
    newMethodEquipment,
    setNewMethodEquipment,
    newMethodSop,
    setNewMethodSop,
    handleSubmitMethod,
    // Actions
    setPhenotypeQualityStatus,
    bulkValidatePhenotypes,
    handleBulkRejectConfirm,
  };
}
