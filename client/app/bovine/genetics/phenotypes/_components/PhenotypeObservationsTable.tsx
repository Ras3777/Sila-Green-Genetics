'use client';

import React from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { TraitDefinition, ContemporaryGroup, PhenotypeObservation } from '@/lib/bovine-types';

interface PhenotypeObservationsTableProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  traitFilter: string;
  setTraitFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  cgFilter: string;
  setCgFilter: (val: string) => void;
  traitDefinitions: TraitDefinition[];
  contemporaryGroups: ContemporaryGroup[];
  filteredObservations: PhenotypeObservation[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleSelect: (id: string) => void;
  bulkValidatePhenotypes: (ids: string[]) => void;
  onOpenRejectModal: () => void;
  setPhenotypeQualityStatus: (id: string, status: PhenotypeObservation['qualityStatus'], reason?: string) => void;
}

export function PhenotypeObservationsTable({
  searchQuery,
  setSearchQuery,
  traitFilter,
  setTraitFilter,
  statusFilter,
  setStatusFilter,
  cgFilter,
  setCgFilter,
  traitDefinitions,
  contemporaryGroups,
  filteredObservations,
  selectedIds,
  setSelectedIds,
  handleSelectAll,
  handleToggleSelect,
  bulkValidatePhenotypes,
  onOpenRejectModal,
  setPhenotypeQualityStatus,
}: PhenotypeObservationsTableProps) {
  return (
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
                onClick={onOpenRejectModal}
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
                <th className="py-3 px-4">Status &amp; Flags</th>
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
  );
}
