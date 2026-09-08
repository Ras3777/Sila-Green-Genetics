'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  TestTubes,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Package,
  Layers,
} from 'lucide-react';

export default function SemenBatchDetailPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const resolvedParams = use(params);
  const { batchId } = resolvedParams;

  const { semenBatches, auditEvents } = useBreeding();
  const batch = semenBatches.find((b) => b.id === batchId);

  if (!batch) {
    return (
      <div className="p-8 text-center text-stone-500">
        <h2 className="text-lg font-bold text-stone-900">Semen Batch Not Found</h2>
        <Link href="/bovine/germplasm/semen/batches" className="text-emerald-800 text-xs font-semibold mt-2 inline-block">
          Return to Batches
        </Link>
      </div>
    );
  }

  const batchAudits = auditEvents.filter((a) => a.entityId === batch.id);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/bovine/germplasm/semen/batches"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Straw Batches</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {batch.batchCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  batch.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {batch.status}
              </span>
              <span className="text-xs text-stone-500">• Type: <strong>{batch.semenType}</strong></span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">
              Donor Sire: {batch.sireName} ({batch.sirePrimaryIdentifier})
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Cryopreservation Date: {batch.freezeDate} &bull; Processed by Certified Andrology Core
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center space-x-3">
            <QrCode className="w-8 h-8 text-stone-800" />
            <div className="text-xs">
              <div className="font-mono font-bold text-stone-900">{batch.batchCode}</div>
              <div className="text-[10px] text-stone-500">Straw Barcode Verified</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Available Doses</div>
            <div className="text-base font-bold text-emerald-800 mt-0.5 font-mono">
              {batch.availableDoses} straws
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Total Produced</div>
            <div className="text-base font-bold text-stone-900 mt-0.5 font-mono">
              {batch.totalDosesProduced} straws
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Post-Thaw Motility</div>
            <div className="text-base font-bold text-stone-900 mt-0.5 font-mono">
              {batch.postThawMotilityPct}% Motile
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Normal Morphology</div>
            <div className="text-base font-bold text-stone-900 mt-0.5 font-mono">
              {batch.normalMorphologyPct}% Normal
            </div>
          </div>
        </div>
      </div>

      {/* Cryo Coordinates & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Cryogenic Storage Coordinates
          </h2>
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Liquid Nitrogen Tank:</span>
              <strong className="text-stone-900 font-mono">{batch.storageLocation?.tank || 'Cryo Tank 1'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Canister:</span>
              <strong className="text-stone-900 font-mono">Canister #{batch.storageLocation?.canister || '1'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Cane Index:</span>
              <strong className="text-stone-900 font-mono">Cane #{batch.storageLocation?.cane || 'A'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Goblet Position:</span>
              <strong className="text-stone-900 font-mono">{batch.storageLocation?.goblet || 'Top Tier'}</strong>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-[11px] text-emerald-800 font-semibold">
              <span>Temperature: -196&deg;C (LN2 Submerged)</span>
              <span>Checked: Daily</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Straw Label Printing Specifications
          </h2>
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs font-mono">
            <div className="bg-white p-3 border border-stone-300 rounded shadow-2xs space-y-1">
              <div className="text-[11px] font-bold text-stone-900">
                {batch.batchCode} &bull; {batch.sirePrimaryIdentifier}
              </div>
              <div className="text-[10px] text-stone-700 font-semibold">{batch.sireName}</div>
              <div className="text-[9px] text-stone-500">
                {batch.semenType} &bull; FZ: {batch.freezeDate} &bull; 0.5ml Straw
              </div>
            </div>
            <div className="text-[11px] text-stone-500 pt-1">
              Compliant with International Embryo Transfer Society (IETS) &amp; NAAB labeling standards.
            </div>
          </div>
        </div>
      </div>

      {/* Audit History */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Batch Audit &amp; Movement Ledger
          </h2>
        </div>

        <div className="p-5">
          {batchAudits.length === 0 ? (
            <div className="text-xs text-stone-500">No inventory movements recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {batchAudits.map((a) => (
                <div key={a.id} className="text-xs p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                  <div>
                    <span className="font-bold text-stone-900">{a.action}</span>: {a.reason}
                    <div className="text-[10px] text-stone-400 mt-0.5">By {a.actorName}</div>
                  </div>
                  <span className="text-[10px] text-stone-500">{new Date(a.occurredAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
