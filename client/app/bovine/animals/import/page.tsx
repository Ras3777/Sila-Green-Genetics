'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ImportRow {
  name: string;
  primaryIdentifier: string;
  sex: 'FEMALE' | 'MALE';
  birthDate: string;
  useStatus: string;
  breed: string;
  farmCode: string;
  herdName: string;
  status: 'CLEAN' | 'WARNING' | 'BLOCKING';
  validationMessage?: string;
}

export default function BovineImportAnimalsPage() {
  const { animals, farms, herds, addAnimal } = useBovine();

  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importCount, setImportCount] = useState(0);

  // Load sample dataset
  const handleLoadSample = () => {
    setFileName('bovine_herd_onboarding_batch_40.csv');
    const sampleRows: ImportRow[] = [
      {
        name: 'Oakhaven S-S-I Mogul 481',
        primaryIdentifier: 'US-84902194',
        sex: 'FEMALE',
        birthDate: '2024-02-14',
        useStatus: 'DONOR',
        breed: 'Holstein',
        farmCode: 'F-001',
        herdName: 'Elite Donors Pen A',
        status: 'CLEAN',
      },
      {
        name: 'Meadow-Brook Bandares Rose',
        primaryIdentifier: 'US-84902195',
        sex: 'FEMALE',
        birthDate: '2024-03-01',
        useStatus: 'RECIPIENT',
        breed: 'Holstein',
        farmCode: 'F-001',
        herdName: 'Recipient Group 1',
        status: 'CLEAN',
      },
      {
        name: 'Triple-Crown Renegade Duke',
        primaryIdentifier: 'US-9941203', // Deliberate duplicate to demonstrate validation
        sex: 'MALE',
        birthDate: '2023-11-20',
        useStatus: 'AI_SIRE',
        breed: 'Holstein',
        farmCode: 'F-002',
        herdName: 'Sire Testing Pen',
        status: 'BLOCKING',
        validationMessage: 'Duplicate identifier: Tag US-9941203 already assigned to Altair Supernova ET',
      },
      {
        name: 'Hilltop Rubicon Daisy',
        primaryIdentifier: 'US-84902197',
        sex: 'FEMALE',
        birthDate: '2025-06-10',
        useStatus: 'BREEDING_STOCK',
        breed: 'Jersey',
        farmCode: 'F-003',
        herdName: 'Milking String A',
        status: 'WARNING',
        validationMessage: 'Heifer under 15 months marked as general breeding stock',
      },
    ];
    setRows(sampleRows);
    setStep('preview');
  };

  const cleanCount = rows.filter((r) => r.status === 'CLEAN').length;
  const warningCount = rows.filter((r) => r.status === 'WARNING').length;
  const blockingCount = rows.filter((r) => r.status === 'BLOCKING').length;

  const handleExecuteImport = () => {
    const validRows = rows.filter((r) => r.status !== 'BLOCKING');
    validRows.forEach((r, idx) => {
      const targetFarm = farms.find((f) => f.code === r.farmCode) || farms[0];
      const targetHerd = herds.find((h) => h.farmId === targetFarm.id) || herds[0];

      addAnimal({
        animal: {
          internalId: `BOV-IMP-${Date.now().toString().slice(-4)}-${idx}`,
          name: r.name,
          sex: r.sex,
          birthDate: r.birthDate,
          birthWeightKg: 42,
          birthType: 'SINGLE',
          lifeStatus: 'ALIVE',
          useStatus: r.useStatus as any,
          primaryIdentifier: r.primaryIdentifier,
          coatColor: 'Black & White',
          registrationStatus: 'APPROVED',
          hornStatus: 'POLLED',
          photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800',
          latestConditionScore: 4,
          ownerOrgId: 'org-apex',
          farmId: targetFarm.id,
          herdId: targetHerd.id,
          requiresReview: false,
          operationalStatus: 'NORMAL',
        },
        identifiers: [
          {
            type: 'NATIONAL_ID',
            value: r.primaryIdentifier,
            issuer: 'USDA / NLIS',
            country: 'USA',
            issueDate: r.birthDate,
            location: 'EAR_RIGHT',
            status: 'ACTIVE',
            assignedDate: r.birthDate,
            isPrimary: true,
          },
        ],
        breedComposition: [
          {
            breedId: 'breed-holstein',
            breedCode: 'HOL',
            breedName: 'Holstein',
            percentage: 100,
            source: 'REGISTRY',
            confidence: 'HIGH',
            recordedDate: r.birthDate,
          },
        ],
      });
    });

    setImportCount(validRows.length);
    setStep('complete');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Mass Ingestion Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Livestock Import & Migration Wizard
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Batch ingest animals from spreadsheet, herd management software exports, or association files
          </p>
        </div>

        <Link
          href="/bovine/animals"
          className="text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          Return to Registry
        </Link>
      </div>

      {/* Step 1: Upload & Templates */}
      {step === 'upload' && (
        <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
          <div className="border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-3xl p-8 text-center transition-colors">
            <Upload className="w-10 h-10 text-emerald-800 mx-auto mb-3" />
            <h2 className="text-base font-bold text-stone-900">Upload Livestock Data Spreadsheet</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              Drag & drop your CSV or Excel file here, or browse files from your computer. Validates tags, dates, and farm assignments.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Load Ready Sample Dataset (4 Cattle)
              </button>
              <button
                onClick={() => alert('Template downloaded: bovine_import_template_v1.csv')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Validation Preview */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Validation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Clean Rows</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">{cleanCount}</div>
              <div className="text-[11px] text-stone-500">Ready for instant import</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Warnings</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">{warningCount}</div>
              <div className="text-[11px] text-stone-500">Permitted, flagged for review</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Blocking Errors</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">{blockingCount}</div>
              <div className="text-[11px] text-stone-500">Will be skipped during ingestion</div>
            </div>
          </div>

          {/* Staged Rows Table */}
          <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="text-xs font-bold text-stone-900">
                Staged Rows Preview ({fileName})
              </div>
              <button
                onClick={() => setStep('upload')}
                className="text-xs text-stone-500 hover:underline"
              >
                Change File
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 pl-5">Validation</th>
                    <th className="p-3">Animal Name</th>
                    <th className="p-3">Primary ID</th>
                    <th className="p-3">Sex & DOB</th>
                    <th className="p-3">Use & Breed</th>
                    <th className="p-3 pr-5">Farm / Herd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50/80">
                      <td className="p-3 pl-5">
                        {row.status === 'CLEAN' && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            CLEAN
                          </span>
                        )}
                        {row.status === 'WARNING' && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]" title={row.validationMessage}>
                            WARNING
                          </span>
                        )}
                        {row.status === 'BLOCKING' && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold text-[10px]" title={row.validationMessage}>
                            BLOCKING
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-stone-900">{row.name}</td>
                      <td className="p-3 font-mono text-emerald-800">{row.primaryIdentifier}</td>
                      <td className="p-3">{row.sex} • {row.birthDate}</td>
                      <td className="p-3">{row.useStatus} ({row.breed})</td>
                      <td className="p-3 pr-5">{row.farmCode} • {row.herdName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Non-blocking rows will be enrolled into the active database immediately.
              </div>
              <button
                id="btn-execute-import"
                onClick={handleExecuteImport}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Import {cleanCount + warningCount} Livestock Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Complete Report */}
      {step === 'complete' && (
        <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Ingestion Execution Succeeded</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Successfully imported <strong>{importCount} livestock records</strong> into the organization database. Identifiers, breeds, and placement logs have been populated.
          </p>
          <div className="pt-2">
            <Link
              href="/bovine/animals"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              <span>View Livestock Registry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
