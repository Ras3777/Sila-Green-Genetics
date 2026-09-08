'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { useBovine } from '@/lib/bovine-store';
import { Sliders, ArrowLeft, Plus, Trash2, CheckCircle2, DollarSign } from 'lucide-react';
import { SelectionIndexComponent, TraitCategory } from '@/lib/bovine-types';

export default function NewSelectionIndexPage() {
  const router = useRouter();
  const { addSelectionIndex, addAuditEvent, organizations } = useBreeding();
  const { traitDefinitions } = useGenetics();
  const { session } = useBovine();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [baseYear, setBaseYear] = useState(2025);
  const [notes, setNotes] = useState('');

  const [components, setComponents] = useState<
    Omit<SelectionIndexComponent, 'id'>[]
  >([
    {
      traitDefinitionId: traitDefinitions[0]?.id || 't1',
      traitCode: traitDefinitions[0]?.code || 'MILK_YIELD',
      traitName: traitDefinitions[0]?.name || 'Milk Yield (305d)',
      category: 'PRODUCTION',
      weight: 0.35,
      standardizedWeight: 0.35,
      economicValue: 0.28,
      direction: 'INCREASE',
      isOptional: false,
    },
    {
      traitDefinitionId: traitDefinitions[1]?.id || 't2',
      traitCode: traitDefinitions[1]?.code || 'PROTEIN_YIELD',
      traitName: traitDefinitions[1]?.name || 'Protein Yield',
      category: 'PRODUCTION',
      weight: 0.4,
      standardizedWeight: 0.4,
      economicValue: 3.2,
      direction: 'INCREASE',
      isOptional: false,
    },
  ]);

  const handleAddComponent = () => {
    const nextTrait =
      traitDefinitions.find((t) => !components.some((c) => c.traitCode === t.code)) ||
      traitDefinitions[0];
    if (nextTrait) {
      setComponents([
        ...components,
        {
          traitDefinitionId: nextTrait.id,
          traitCode: nextTrait.code,
          traitName: nextTrait.name,
          category: (nextTrait.category as TraitCategory) || 'PRODUCTION',
          weight: 0.2,
          standardizedWeight: 0.2,
          economicValue: 1.5,
          direction: 'INCREASE',
          isOptional: false,
        },
      ]);
    }
  };

  const handleRemoveComponent = (idx: number) => {
    if (components.length > 1) {
      setComponents(components.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const componentsWithIds: SelectionIndexComponent[] = components.map((c, i) => ({
      ...c,
      id: `comp-${Date.now()}-${i}`,
    }));

    const indexId = addSelectionIndex({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      purpose: purpose.trim(),
      activeVersion: version.trim(),
      status: 'ACTIVE',
      organizationId: organizations[0]?.id || 'org-1',
      versions: [
        {
          id: `ver-${Date.now()}`,
          version: version.trim(),
          status: 'PUBLISHED',
          effectiveDate: new Date().toISOString().slice(0, 10),
          baseYear: Number(baseYear),
          notes: notes.trim(),
          components: componentsWithIds,
        },
      ],
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'CREATE_SELECTION_INDEX',
      entityType: 'SelectionIndex',
      entityId: indexId,
      entityDisplay: `${name} (${code})`,
      reason: `Built selection index formula with ${components.length} weighted trait components.`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    router.push(`/bovine/selection-indexes/${indexId}`);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          href="/bovine/selection-indexes"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Index Catalog</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Define New Selection Index</h1>
        <p className="text-sm text-stone-600 mt-1">
          Combine multiple EBVs/EPDs into a single aggregate economic score to rank breeding animals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core details */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Index Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Index Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. NET-MERIT-2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs font-mono border border-stone-300 rounded-lg p-2.5 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Version</label>
              <input
                type="text"
                required
                placeholder="e.g. v1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full text-xs font-mono border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Index Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Commercial Dairy Lifetime Profitability Index"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Breeding Purpose &amp; Market Context
              </label>
              <textarea
                rows={2}
                placeholder="Describe which production system (e.g. pasture, confined TMR, crossbred beef) this index targets..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Base Year</label>
              <input
                type="number"
                value={baseYear}
                onChange={(e) => setBaseYear(Number(e.target.value))}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Version Notes</label>
              <input
                type="text"
                placeholder="Initial release weights..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Trait Components Builder */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              2. Weighted Trait Components ({components.length})
            </h2>
            <button
              type="button"
              onClick={handleAddComponent}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trait</span>
            </button>
          </div>

          <div className="space-y-3">
            {components.map((comp, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Trait Definition
                    </label>
                    <select
                      value={comp.traitCode}
                      onChange={(e) => {
                        const found = traitDefinitions.find((t) => t.code === e.target.value);
                        if (found) {
                          const updated = [...components];
                          updated[idx] = {
                            ...updated[idx],
                            traitDefinitionId: found.id,
                            traitCode: found.code,
                            traitName: found.name,
                            category: (found.category as TraitCategory) || 'PRODUCTION',
                          };
                          setComponents(updated);
                        }
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                    >
                      {traitDefinitions.map((t) => (
                        <option key={t.id} value={t.code}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Category
                    </label>
                    <select
                      value={comp.category}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].category = e.target.value as TraitCategory;
                        setComponents(updated);
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                    >
                      <option value="PRODUCTION">PRODUCTION</option>
                      <option value="FERTILITY">FERTILITY</option>
                      <option value="HEALTH">HEALTH</option>
                      <option value="CONFORMATION">CONFORMATION</option>
                      <option value="CARCASS">CARCASS</option>
                      <option value="EFFICIENCY">EFFICIENCY</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Selection Direction
                    </label>
                    <select
                      value={comp.direction}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].direction = e.target.value as any;
                        setComponents(updated);
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                    >
                      <option value="INCREASE">Increase (+)</option>
                      <option value="DECREASE">Decrease (-)</option>
                      <option value="INTERMEDIATE_OPTIMUM">Intermediate Optimum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Raw Mathematical Weight
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={comp.weight}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].weight = Number(e.target.value);
                        setComponents(updated);
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Economic Value ($/unit)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={comp.economicValue}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].economicValue = Number(e.target.value);
                        setComponents(updated);
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Standardized Emphasis (0–1)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={comp.standardizedWeight}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].standardizedWeight = Number(e.target.value);
                        setComponents(updated);
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>

                  <div className="flex justify-end self-end pt-4 sm:pt-0">
                    <button
                      type="button"
                      disabled={components.length <= 1}
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3">
          <Link
            href="/bovine/selection-indexes"
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            Save &amp; Publish Index
          </button>
        </div>
      </form>
    </div>
  );
}
