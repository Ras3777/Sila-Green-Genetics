'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Layers, Award } from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaGallery from '@/components/bovine/media/AnimalMediaGallery';

export default function FarmAnimalMediaPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;
  const { animals, farms, herds } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  if (!animal) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Farm Animal Not Found</h1>
        <p className="text-xs text-stone-500">No active animal matches ID &ldquo;{animalId}&rdquo;.</p>
        <Link
          href="/bovine/animals/farm-animals"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Farm Animals Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals/farm-animals" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Farm Animals</span>
        </Link>
        <span>/</span>
        <Link
          href={`/bovine/animals/farm-animals/${animalId}`}
          className="font-mono hover:text-emerald-800 text-stone-700"
        >
          {animal.primaryIdentifier || animal.internalId}
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-emerald-800" />
          Media &amp; Photographic Evidence
        </span>
      </div>

      {/* Animal Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          {animal.photoUrl ? (
            <img
              src={animal.photoUrl}
              alt={animal.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold">
              <Layers className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">{animal.name}</h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                {animal.primaryIdentifier || animal.internalId}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                {animal.useStatus.replace(/_/g, ' ')}
              </span>
              {animal.isBreedingStock && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  <Award className="w-3 h-3 mr-1 text-amber-700" />
                  Breeding Stock
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
              <span>{animal.sex}</span>
              <span>•</span>
              <span className="font-semibold text-stone-800">{animal.breed || 'Purebred'}</span>
              <span>•</span>
              <span>{farm?.name || 'Farm'} ({herd?.name || 'Herd'})</span>
            </div>
          </div>
        </div>

        <div>
          <Link
            href={`/bovine/animals/farm-animals/${animalId}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to 360° Farm Profile</span>
          </Link>
        </div>
      </div>

      {/* Master Media Gallery */}
      <AnimalMediaGallery
        animalId={animalId}
        variant="FARM_ANIMAL"
        backHref={`/bovine/animals/farm-animals/${animalId}`}
        hideHeroBanner={true}
      />
    </div>
  );
}
