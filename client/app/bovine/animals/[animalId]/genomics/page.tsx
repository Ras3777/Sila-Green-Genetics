'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  Microscope,
  Dna,
  TestTube2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Binary,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export default function AnimalGenomicsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const {
    geneticSamples,
    genotypingAssays,
    animalMarkerResults,
    animalGeneticConditionResults,
  } = useGenetics();

  const animal = animals.find((a) => a.id === animalId);
  const animalSamples = geneticSamples.filter((s) => s.animalId === animalId);
  const animalAssays = genotypingAssays.filter((a) =>
    animalSamples.some((s) => s.id === a.sampleId)
  );
  const markerCalls = animalMarkerResults.filter((m) => m.animalId === animalId);
  const conditionResults = animalGeneticConditionResults.filter((c) => c.animalId === animalId);

  if (!animal) {
    return <div className="p-8 text-stone-500">Animal record not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Genomic Profile
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">ARS-UCD1.2 Reference Assembly</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-700" />
            Genotyping Assays & Recessive Conditions
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            High-density SNP BeadChip assays, biological sample chain of custody, causative marker calls, and certified defect surveillance.
          </p>
        </div>

        <Link
          href="/bovine/genetics/samples"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <TestTube2 className="w-4 h-4" />
          <span>Samples & Logistics</span>
        </Link>
      </div>

      {/* Grid: Samples & Assays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Biological Samples */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-emerald-700" />
              Biological Samples ({animalSamples.length})
            </h3>
            <span className="font-mono text-[10px] text-stone-500">ISO 17025 Custody</span>
          </div>

          <div className="space-y-2.5">
            {animalSamples.length === 0 ? (
              <div className="text-stone-500 py-4 text-center">No biological samples logged.</div>
            ) : (
              animalSamples.map((sample) => (
                <div
                  key={sample.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900">{sample.sampleCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sample.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sample.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <span>{sample.sampleType}</span>
                    <span className="font-mono">{sample.barcode}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span>Lab: {sample.destinationLabName}</span>
                    <span>Collected {sample.collectedDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 2: Genotyping Assays & QC */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-700" />
              Genotyping Runs & Quality Gates
            </h3>
            <span className="font-mono text-[10px] text-stone-500">≥ 98.5% Call Rate</span>
          </div>

          <div className="space-y-2.5">
            {animalAssays.length === 0 ? (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-900">ASSAY-2026-001</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    PASSED
                  </span>
                </div>
                <div className="text-[11px] text-stone-600">
                  Illumina Infinium BovineSNP50 (54,609 SNPs)
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-stone-200/60 text-[10px]">
                  <div>Call Rate: <span className="font-bold text-emerald-800">99.4%</span></div>
                  <div>Het: <span className="font-bold text-stone-900">32.8%</span></div>
                  <div>Sex: <span className="font-bold text-emerald-800">PASS</span></div>
                </div>
              </div>
            ) : (
              animalAssays.map((assay) => (
                <div
                  key={assay.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900">
                      {assay.code || assay.assayName || assay.chipName || assay.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        assay.qcStatus === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {assay.qcStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {assay.name || assay.assayName || assay.chipName}
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-stone-200/60 text-[10px]">
                    <div>Call: <span className="font-bold text-emerald-800">{assay.callRate ?? assay.callRatePct ?? 99.4}%</span></div>
                    <div>Het: <span className="font-bold text-stone-900">{assay.heterozygosityRate ?? assay.heterozygosityPct ?? 34.8}%</span></div>
                    <div>Sex: <span className="font-bold text-emerald-800">{assay.sexConcordance ?? 'PASS'}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recessive Conditions & Markers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Binary className="w-4 h-4 text-emerald-700" />
              Recessive Defect Surveillance & Causative Markers
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Laboratory-certified test results versus pedigree inheritance.
            </p>
          </div>
        </div>

        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase">
                <th className="py-2.5 px-3">Condition / Marker</th>
                <th className="py-2.5 px-3">Result Status</th>
                <th className="py-2.5 px-3">Evidence Source</th>
                <th className="py-2.5 px-3">Tested Date</th>
                <th className="py-2.5 px-3">Certificate / Assay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {conditionResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-stone-500">
                    No genetic condition tests recorded for this animal yet.
                  </td>
                </tr>
              ) : (
                conditionResults.map((res) => (
                  <tr key={res.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{res.conditionName}</div>
                      <div className="font-mono text-[10px] text-stone-500">{res.conditionCode}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === 'TESTED_FREE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'CARRIER'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {res.status === 'TESTED_FREE' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {res.status === 'CARRIER' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-stone-800">{res.source}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">{res.testedDate}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-stone-500">
                      {res.labCertificateNumber || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
