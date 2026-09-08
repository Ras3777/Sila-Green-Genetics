'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  FileText,
  Settings,
  ChevronDown,
  X,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { TraitDefinition, MeasurementMethod, PhenotypeObservation } from '@/lib/bovine-types';

export default function PhenotypesPage() {
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
  const [activeTab, setActiveTab] = useState<'OBSERVATIONS' | 'TRAITS' | 'METHODS'>('OBSERVATIONS');

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

  return (
    <div className="space-y-6">
      {/* Sub-Tabs: Observations vs Traits vs Methods */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('OBSERVATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'OBSERVATIONS'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Phenotype Observations ({phenotypeObservations.length})
          </button>
          <button
            onClick={() => setActiveTab('TRAITS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'TRAITS'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Trait Definitions ({traitDefinitions.length})
          </button>
          <button
            onClick={() => setActiveTab('METHODS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'METHODS'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Measurement Methods ({measurementMethods.length})
          </button>
        </div>

        {/* Action button corresponding to active view */}
        <div>
          {activeTab === 'OBSERVATIONS' && (
            <button
              onClick={() => setRecordModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Phenotype</span>
            </button>
          )}
          {activeTab === 'TRAITS' && (
            <button
              onClick={() => setTraitModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Trait Definition</span>
            </button>
          )}
          {activeTab === 'METHODS' && (
            <button
              onClick={() => setMethodModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Measurement S.O.P.</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: OBSERVATIONS TABLE */}
      {activeTab === 'OBSERVATIONS' && (
        <div className="space-y-4">
          {/* Filters Bar & Bulk Actions */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                {/* Search */}
                <div className="relative min-w-[200px] flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by animal, identifier, or trait..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Trait Filter */}
                <select
                  value={traitFilter}
                  onChange={(e) => setTraitFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
                >
                  <option value="ALL">All Traits</option>
                  {traitDefinitions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>

                {/* Quality Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
                >
                  <option value="ALL">All Quality Statuses</option>
                  <option value="VALIDATED">Validated Only</option>
                  <option value="SUSPECT">Suspect Outliers</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="RAW_UNCHECKED">Raw Unchecked</option>
                </select>

                {/* Contemporary Group Filter */}
                <select
                  value={cgFilter}
                  onChange={(e) => setCgFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-stone-800 font-medium cursor-pointer"
                >
                  <option value="ALL">All Contemporary Groups</option>
                  {contemporaryGroups.map((cg) => (
                    <option key={cg.id} value={cg.id}>
                      {cg.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <span className="font-bold text-emerald-900">{selectedIds.length} selected:</span>
                  <button
                    onClick={() => {
                      bulkValidatePhenotypes(selectedIds);
                      setSelectedIds([]);
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    Validate All
                  </button>
                  <button
                    onClick={() => setRejectReasonModalOpen(true)}
                    className="px-2.5 py-1 rounded bg-rose-700 text-white font-semibold hover:bg-rose-800 cursor-pointer"
                  >
                    Reject All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Observations Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          filteredObservations.length > 0 &&
                          selectedIds.length === filteredObservations.length
                        }
                        className="rounded text-emerald-700 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Animal</th>
                    <th className="py-3 px-4">Trait</th>
                    <th className="py-3 px-4">Raw vs Adjusted</th>
                    <th className="py-3 px-4">Standardization / CG</th>
                    <th className="py-3 px-4">Measurement Method</th>
                    <th className="py-3 px-4">Status & Flags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredObservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-500">
                        No phenotype observations found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredObservations.map((obs) => {
                      const isSelected = selectedIds.includes(obs.id);
                      return (
                        <tr
                          key={obs.id}
                          className={`hover:bg-stone-50/70 transition-colors ${
                            isSelected ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(obs.id)}
                              className="rounded text-emerald-700 cursor-pointer"
                            />
                          </td>

                          {/* Animal */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{obs.animalName}</div>
                            <div className="text-[11px] font-mono text-stone-500">
                              {obs.animalIdentifier}
                            </div>
                          </td>

                          {/* Trait */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-900">{obs.traitName}</div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                              <span className="font-mono bg-stone-100 px-1.5 py-0.2 rounded">
                                {obs.traitCode}
                              </span>
                              <span>•</span>
                              <span>{obs.stage}</span>
                            </div>
                          </td>

                          {/* Raw vs Adjusted Values */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">
                              {obs.adjustedValue !== undefined ? obs.adjustedValue : obs.rawValue}{' '}
                              <span className="font-normal text-stone-500">{obs.unit}</span>
                            </div>
                            {obs.adjustedValue !== undefined && obs.adjustedValue !== obs.rawValue && (
                              <div className="text-[10px] text-stone-500">
                                Raw: {obs.rawValue} {obs.unit} (Adj: {obs.adjustmentReason})
                              </div>
                            )}
                          </td>

                          {/* Contemporary Group */}
                          <td className="py-3 px-4">
                            <div className="font-mono text-[11px] text-stone-800">
                              {obs.contemporaryGroupCode || 'Independent Cohort'}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Recorded {obs.observationDate}
                            </div>
                          </td>

                          {/* Method */}
                          <td className="py-3 px-4">
                            <div className="font-mono text-[11px] text-stone-800">
                              {obs.measurementMethodCode || 'Standard Electronic'}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              By {obs.recordedBy}
                            </div>
                          </td>

                          {/* Quality Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                obs.qualityStatus === 'VALIDATED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : obs.qualityStatus === 'SUSPECT'
                                  ? 'bg-rose-100 text-rose-800'
                                  : obs.qualityStatus === 'REJECTED'
                                  ? 'bg-stone-200 text-stone-700'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {obs.qualityStatus}
                            </span>
                            {obs.qualityFlags && obs.qualityFlags.length > 0 && (
                              <div className="text-[9px] text-stone-500 font-mono pt-1">
                                {obs.qualityFlags[0]}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {obs.qualityStatus !== 'VALIDATED' && (
                                <button
                                  onClick={() => setPhenotypeQualityStatus(obs.id, 'VALIDATED')}
                                  title="Approve & Validate Observation"
                                  className="p-1 rounded text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              {obs.qualityStatus !== 'REJECTED' && (
                                <button
                                  onClick={() => setPhenotypeQualityStatus(obs.id, 'REJECTED', 'SUPERVISOR_REJECTED')}
                                  title="Reject Outlier Observation"
                                  className="p-1 rounded text-rose-700 hover:bg-rose-100 cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TRAIT DEFINITIONS CATALOG */}
      {activeTab === 'TRAITS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traitDefinitions.map((trait) => (
            <div
              key={trait.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  {trait.code}
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  {trait.category}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm">{trait.name}</h4>
                <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                  {trait.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Heritability (h²):</span>
                  <span className="font-bold text-stone-900">{trait.heritability}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Unit:</span>
                  <span className="font-bold text-stone-900">{trait.unit}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Desirable Direction:</span>
                  <span
                    className={`font-semibold ${
                      trait.direction === 'INCREASE'
                        ? 'text-emerald-700'
                        : trait.direction === 'DECREASE'
                        ? 'text-blue-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {trait.direction}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Valid Bounds:</span>
                  <span className="font-mono text-stone-800">
                    {trait.minValidValue} - {trait.maxValidValue} {trait.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <span>{trait.phenotypeCount || 0} observations</span>
                <span>{trait.isSexLimited ? `Female Only` : 'Both Sexes'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: MEASUREMENT METHODS S.O.P. */}
      {activeTab === 'METHODS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {measurementMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  {method.code}
                </span>
                <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {method.protocolVersion}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm">{method.name}</h4>
                <p className="text-[11px] text-stone-600 mt-1">
                  {method.description}
                </p>
              </div>

              {method.equipment && (
                <div className="text-[11px] text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-200/80">
                  <span className="font-semibold">Equipment / Platform:</span> {method.equipment}
                </div>
              )}

              {method.standardOperatingProcedure && (
                <div className="text-[10px] text-stone-600 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50 italic">
                  {method.standardOperatingProcedure}
                </div>
              )}

              {method.metadataFields && (
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  {Object.entries(method.metadataFields).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-stone-500 block">{k}:</span>
                      <span className="font-semibold text-stone-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: RECORD PHENOTYPE */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Record Phenotypic Observation</h3>
              </div>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPhenotype} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Animal</label>
                <select
                  value={obsAnimalId}
                  onChange={(e) => setObsAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Trait</label>
                  <select
                    value={obsTraitId}
                    onChange={(e) => setObsTraitId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {traitDefinitions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code} - {t.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">
                    Raw Value ({selectedTraitForObs?.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder={`Expected: ${selectedTraitForObs?.minValidValue || ''} - ${selectedTraitForObs?.maxValidValue || ''}`}
                    value={obsRawValue}
                    onChange={(e) => setObsRawValue(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">
                    Adjusted Value (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 205-day or ME adjusted"
                    value={obsAdjustedValue}
                    onChange={(e) => setObsAdjustedValue(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Adjustment Formula/Reason</label>
                  <input
                    type="text"
                    placeholder="e.g. BIF 205-day Age of Dam +8.5kg"
                    value={obsAdjustmentReason}
                    onChange={(e) => setObsAdjustmentReason(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Measurement Method</label>
                  <select
                    value={obsMethodId}
                    onChange={(e) => setObsMethodId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {measurementMethods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Contemporary Group</label>
                  <select
                    value={obsCgId}
                    onChange={(e) => setObsCgId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {contemporaryGroups.map((cg) => (
                      <option key={cg.id} value={cg.id}>
                        {cg.code} - {cg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Assessor / Notes</label>
                <input
                  type="text"
                  placeholder="Technician initials and field conditions"
                  value={obsNotes}
                  onChange={(e) => setObsNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm cursor-pointer"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE TRAIT DEFINITION */}
      {traitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Add Trait Definition</h3>
              <button
                onClick={() => setTraitModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrait} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Trait Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMF"
                    value={newTraitCode}
                    onChange={(e) => setNewTraitCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={newTraitCategory}
                    onChange={(e) => setNewTraitCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="GROWTH">GROWTH</option>
                    <option value="EFFICIENCY">EFFICIENCY</option>
                    <option value="MILK">MILK</option>
                    <option value="CARCASS">CARCASS</option>
                    <option value="REPRODUCTION">REPRODUCTION</option>
                    <option value="HEALTH">HEALTH</option>
                    <option value="CONFORMATION">CONFORMATION</option>
                    <option value="TEMPERAMENT">TEMPERAMENT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Trait Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intramuscular Fat Percentage"
                  value={newTraitName}
                  onChange={(e) => setNewTraitName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. % or kg"
                    value={newTraitUnit}
                    onChange={(e) => setNewTraitUnit(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Heritability (h²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={newTraitHeritability}
                    onChange={(e) => setNewTraitHeritability(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Desirable Direction</label>
                  <select
                    value={newTraitDirection}
                    onChange={(e) => setNewTraitDirection(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="INCREASE">INCREASE</option>
                    <option value="DECREASE">DECREASE</option>
                    <option value="INTERMEDIATE_OPTIMUM">INTERMEDIATE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Min Valid Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Lower biological limit"
                    value={newTraitMin}
                    onChange={(e) => setNewTraitMin(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Max Valid Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Upper biological limit"
                    value={newTraitMax}
                    onChange={(e) => setNewTraitMax(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Biological definition and standardization guidelines"
                  value={newTraitDesc}
                  onChange={(e) => setNewTraitDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTraitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Create Trait
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE METHOD S.O.P. */}
      {methodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Add Measurement Method S.O.P.</h3>
              <button
                onClick={() => setMethodModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMethod} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Method Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ULTRA_CARCASS_V2"
                    value={newMethodCode}
                    onChange={(e) => setNewMethodCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Protocol Version</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v2.1 (ICAR Certified)"
                    value={newMethodVersion}
                    onChange={(e) => setNewMethodVersion(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Method Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calibrated Ultrasound Ribeye Cross-Section"
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Equipment / Platform</label>
                <input
                  type="text"
                  placeholder="e.g. Aloka 500V 3.5MHz Probe"
                  value={newMethodEquipment}
                  onChange={(e) => setNewMethodEquipment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Standard Operating Procedure</label>
                <textarea
                  rows={3}
                  placeholder="Step-by-step measurement instructions and calibration checks..."
                  value={newMethodSop}
                  onChange={(e) => setNewMethodSop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setMethodModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Register S.O.P.
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BULK REJECT REASON */}
      {rejectReasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Reject Selected Observations</h3>
            <p className="text-xs text-stone-600">
              Provide an audit reason for flagging and rejecting {selectedIds.length} observations:
            </p>
            <input
              type="text"
              placeholder="e.g. Scale tare failure or technician protocol deviation"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900"
            />
            <div className="flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setRejectReasonModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  bulkRejectPhenotypes(selectedIds, rejectReason || 'Operator Rejected');
                  setRejectReasonModalOpen(false);
                  setSelectedIds([]);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-lg bg-rose-700 text-white font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
