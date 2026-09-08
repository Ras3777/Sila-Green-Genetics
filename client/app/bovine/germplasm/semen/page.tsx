'use client';

import React from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  TestTubes,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function SemenOverviewPage() {
  const { semenBatches, semenCollections } = useBreeding();

  const totalDoses = semenBatches.reduce((acc, b) => acc + b.availableDoses, 0);
  const conventionalDoses = semenBatches
    .filter((b) => b.semenType === 'CONVENTIONAL')
    .reduce((acc, b) => acc + b.availableDoses, 0);
  const sexedDoses = semenBatches
    .filter((b) => b.semenType.startsWith('SEXED'))
    .reduce((acc, b) => acc + b.availableDoses, 0);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/germplasm" className="hover:text-stone-800">
              Germplasm Hub
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Semen Biorepository</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Semen Inventory &amp; Collections</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Straw batch tracking, liquid nitrogen canister locations, lab motility QC, and distribution logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/bovine/germplasm/semen/collections"
            className="inline-flex items-center space-x-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Collection Logs</span>
          </Link>
          <Link
            href="/bovine/germplasm/semen/batches"
            className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Straw Batches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Total Available Straws</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalDoses.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">Across {semenBatches.length} active batches</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Conventional Semen</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{conventionalDoses.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            {((conventionalDoses / (totalDoses || 1)) * 100).toFixed(0)}% of total stock
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Sexed Ultra Semen (Female)</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{sexedDoses.toLocaleString()}</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">90%+ Heifer Purity Guarantee</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Lab Assayed Collections</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{semenCollections.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">100% Quality Inspected</div>
        </div>
      </div>

      {/* Recent Batches List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Active Semen Batches
          </h2>
          <Link
            href="/bovine/germplasm/semen/batches"
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            View Full Inventory ({semenBatches.length}) &rarr;
          </Link>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Batch Code</th>
              <th className="p-3.5">Sire</th>
              <th className="p-3.5">Semen Type</th>
              <th className="p-3.5">Tank Coordinates</th>
              <th className="p-3.5">Available Doses</th>
              <th className="p-3.5">Quality / Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {semenBatches.map((batch) => (
              <tr key={batch.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-mono font-bold text-emerald-950">{batch.batchCode}</td>
                <td className="p-3.5">
                  <div className="font-bold text-stone-900">{batch.sireName}</div>
                  <div className="text-[11px] font-mono text-stone-500">{batch.sirePrimaryIdentifier}</div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      batch.semenType.startsWith('SEXED')
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {batch.semenType}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-stone-600">
                  {batch.storageLocation ? `${batch.storageLocation.tank} / Canister ${batch.storageLocation.canister} / Cane ${batch.storageLocation.cane}` : 'Cryo Tank 1 / Canister 1 / Cane A'}
                </td>
                <td className="p-3.5 font-mono font-bold text-stone-900">
                  {batch.availableDoses} <span className="text-[11px] font-normal text-stone-500">/ {batch.totalDosesProduced}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {batch.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/bovine/germplasm/semen/${batch.id}`}
                    className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-700 font-semibold"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
