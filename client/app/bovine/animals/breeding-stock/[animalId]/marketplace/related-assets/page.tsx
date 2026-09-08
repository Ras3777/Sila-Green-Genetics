'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  TestTubes,
  ChevronRight,
  Sparkles,
  Plus,
  ArrowRight,
  Building,
  CheckCircle2,
  DollarSign,
  Package,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalRelatedLotsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);

  // Derivative offerings (semen or embryos) referencing this animal
  const semenListings = listings.filter((l) => l.assetType === 'SEMEN' && l.animalId === animalId);
  const embryoListings = listings.filter(
    (l) =>
      l.assetType === 'EMBRYO' &&
      (l.embryoDetails?.donorCowAnimalId === animalId || l.embryoDetails?.sireAnimalId === animalId)
  );

  if (!animal) return <div className="p-8 text-center text-stone-500">Animal not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`} className="hover:underline">
                  Commercial Hub
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Derivative Genetics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-emerald-800" />
                Derivative Semen & Embryo Offerings: {animal.name || animal.identifiers?.[0]?.value}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Active inventory and marketplace offerings derived from this animal's germplasm.
              </p>
            </div>

            <Link
              href="/bovine/marketplace/listings/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              List Derivative Lot
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Semen Straw Batches */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <TestTubes className="w-5 h-5 text-emerald-800" /> Cryogenic Semen Straw Lots ({semenListings.length})
            </h3>
          </div>

          {semenListings.length === 0 ? (
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
              No active semen straw offerings linked to this bull.
            </div>
          ) : (
            <div className="space-y-3">
              {semenListings.map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-100 text-blue-800 rounded">
                      {lot.semenDetails?.sexedType || 'Conventional'}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">{lot.title}</h4>
                    <div className="text-xs text-stone-600 font-mono mt-0.5">
                      Batch #{lot.semenDetails?.batchNumber} • Motility: {lot.semenDetails?.motilityPercent}% • {lot.semenDetails?.availableDoses} straws
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-stone-900">${lot.askingPrice} / straw</div>
                    </div>
                    <Link
                      href={`/bovine/marketplace/semen/${lot.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl"
                    >
                      View Lot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Embryo Packages */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-800" /> Stored IVF & In-Vivo Embryo Packages ({embryoListings.length})
            </h3>
          </div>

          {embryoListings.length === 0 ? (
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
              No active embryo lots linked to this animal.
            </div>
          ) : (
            <div className="space-y-3">
              {embryoListings.map((emb) => (
                <div
                  key={emb.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-purple-100 text-purple-800 rounded">
                      {emb.embryoDetails?.ivfOrInVivo || 'IVF'} Lot
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">{emb.title}</h4>
                    <div className="text-xs text-stone-600 font-mono mt-0.5">
                      Lot Code: {emb.embryoDetails?.embryoCode} • {emb.embryoDetails?.stage} {emb.embryoDetails?.grade} • {emb.embryoDetails?.quantity} embryos
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-stone-900">${emb.askingPrice.toLocaleString()} USD</div>
                    </div>
                    <Link
                      href={`/bovine/marketplace/embryos/${emb.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl"
                    >
                      View Lot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
