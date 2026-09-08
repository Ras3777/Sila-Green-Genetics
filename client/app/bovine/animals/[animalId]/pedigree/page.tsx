'use client';

import React, { use } from 'react';
import PedigreeWorkspace from '@/components/bovine/pedigree/PedigreeWorkspace';

export default function AnimalPedigreePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PedigreeWorkspace initialAnimalId={animalId} />
    </div>
  );
}
