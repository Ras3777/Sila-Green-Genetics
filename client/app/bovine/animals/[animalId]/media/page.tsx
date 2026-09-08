'use client';

import React, { use } from 'react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaGallery from '@/components/bovine/media/AnimalMediaGallery';
import { AlertCircle } from 'lucide-react';

export default function CanonicalAnimalMediaPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;
  const { animals } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  if (!animal) {
    return (
      <div className="p-8 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
        <h2 className="text-lg font-bold text-stone-900">Livestock Record Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">No active animal matches ID &ldquo;{animalId}&rdquo;.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimalMediaGallery
        animalId={animalId}
        variant="CANONICAL"
        backHref={`/bovine/animals/${animalId}`}
        hideHeroBanner={true}
      />
    </div>
  );
}
