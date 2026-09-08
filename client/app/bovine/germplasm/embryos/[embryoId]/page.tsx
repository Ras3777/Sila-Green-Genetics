'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Package,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Dna,
  Heart,
  Layers,
  Award,
} from 'lucide-react';

export default function EmbryoDetailPage({
  params,
}: {
  params: Promise<{ embryoId: string }>;
}) {
  const resolvedParams = use(params);
  const { embryoId } = resolvedParams;

  const { embryos, embryoTransfers } = useBreeding();
  const embryo = embryos.find((e) => e.id === embryoId);

  if (!embryo) {
    return (
      <div className="p-8 text-center text-stone-500">
        <h2 className="text-lg font-bold text-stone-900">Embryo Not Found</h2>
        <Link href="/bovine/germplasm/embryos" className="text-emerald-800 text-xs font-semibold mt-2 inline-block">
          Return to Repository
        </Link>
      </div>
    );
  }

  const transfer = embryoTransfers.find((t) => t.embryoId === embryo.id);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/bovine/germplasm/embryos"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Embryo Repository</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {embryo.code}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  embryo.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {embryo.status}
              </span>
              <span className="text-xs text-stone-500">• Type: <strong>{embryo.productionType}</strong></span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">
              {embryo.donorDamName} &times; {embryo.sireName}
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Produced: {embryo.productionDate || embryo.collectionDate || '—'} &bull; Stage: {embryo.stage?.replace(/_/g, ' ') || 'N/A'} &bull; Grade: {embryo.grade?.replace(/_/g, ' ') || 'N/A'}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                embryo.predictedSex === 'FEMALE'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              Predicted Sex: {embryo.predictedSex || 'UNSEXED'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">IETS Stage</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {embryo.stage?.replace(/STAGE_\d+_/, '') || 'N/A'}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Morphology Grade</div>
            <div className="text-base font-bold text-emerald-800 mt-0.5">
              {embryo.grade?.replace(/GRADE_\d+_/, '') || 'N/A'}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Preservation</div>
            <div className="text-base font-bold text-stone-900 mt-0.5 font-mono">
              {embryo.preservationMethod}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Genomic Biopsy</div>
            <div className="text-base font-bold text-emerald-800 mt-0.5">
              {embryo.isGenotyped ? 'Verified Clear' : 'No Biopsy'}
            </div>
          </div>
        </div>
      </div>

      {/* Pedigree & Cryo Storage Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Pedigree Origins
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Donor Dam (Mother)</span>
              <div className="font-bold text-stone-900 mt-0.5">{embryo.donorDamName}</div>
              <div className="text-stone-500 font-mono text-[11px]">{embryo.donorDamPrimaryIdentifier}</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Donor Sire (Father)</span>
              <div className="font-bold text-stone-900 mt-0.5">{embryo.sireName}</div>
              <div className="text-stone-500 font-mono text-[11px]">{embryo.sirePrimaryIdentifier}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Cryo Storage Coordinates
          </h2>
          {embryo.storageLocation ? (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Liquid Nitrogen Tank:</span>
                <strong className="text-stone-900 font-mono">{embryo.storageLocation.tank}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Canister:</span>
                <strong className="text-stone-900 font-mono">Canister #{embryo.storageLocation.canister}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cane:</span>
                <strong className="text-stone-900 font-mono">Cane #{embryo.storageLocation.cane}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Goblet Color:</span>
                <strong className="text-stone-900 font-mono">{embryo.storageLocation.goblet}</strong>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-lg text-xs text-stone-500">
              Fresh transfer protocol (not cryopreserved).
            </div>
          )}
        </div>
      </div>

      {/* Transfer status if logged */}
      {transfer && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-700" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Embryo Transfer Procedure History
            </h2>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Transfer Date:</span>
              <span className="font-semibold text-stone-900">{transfer.transferDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Recipient Female:</span>
              <span className="font-semibold text-stone-900">
                {transfer.recipientName} ({transfer.recipientPrimaryIdentifier})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Pregnancy Outcome:</span>
              <span className="font-bold text-emerald-800 uppercase">{transfer.pregnancyOutcome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Technician:</span>
              <span className="text-stone-700">{transfer.technicianName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
