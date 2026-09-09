'use client';

import React from 'react';
import { Animal, DailyLog } from '@/lib/bovine-types';
import { DailyOperationsAnimalRow } from './DailyOperationsAnimalRow';

interface DailyOperationsWorklistProps {
  animals: Animal[];
  todaysLogs: DailyLog[];
  getRowState: (animalId: string) => Partial<DailyLog>;
  expandedAnimalId: string | null;
  onToggleExpand: (id: string) => void;
  onRowChange: (animalId: string, field: string, value: any) => void;
  onQuickNormal: (animal: Animal) => void;
  onSaveRow: (animal: Animal) => void;
}

export function DailyOperationsWorklist({
  animals,
  todaysLogs,
  getRowState,
  expandedAnimalId,
  onToggleExpand,
  onRowChange,
  onQuickNormal,
  onSaveRow,
}: DailyOperationsWorklistProps) {
  if (animals.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-500">
        No animals found in the selected farm station / herd scope.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {animals.map((animal) => {
        const existingLog = todaysLogs.find((l) => l.animalId === animal.id);
        const rowState = getRowState(animal.id);
        const isExpanded = expandedAnimalId === animal.id;

        return (
          <DailyOperationsAnimalRow
            key={animal.id}
            animal={animal}
            existingLog={existingLog}
            rowState={rowState}
            isExpanded={isExpanded}
            onToggleExpand={() => onToggleExpand(animal.id)}
            onRowChange={(field, value) => onRowChange(animal.id, field, value)}
            onQuickNormal={() => onQuickNormal(animal)}
            onSaveRow={() => onSaveRow(animal)}
          />
        );
      })}
    </div>
  );
}
