'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpDown, Eye, Layers } from 'lucide-react';
import { Animal, Farm, Herd, AnimalBreedComposition } from '@/lib/bovine-types';

interface AnimalsTableProps {
  filteredAnimals: Animal[];
  farms: Farm[];
  herds: Herd[];
  breedCompositions: AnimalBreedComposition[];
  selectedAnimalIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  sortField: 'name' | 'birthDate' | 'internalId';
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: 'name' | 'birthDate' | 'internalId') => void;
}

export function AnimalsTable({
  filteredAnimals,
  farms,
  herds,
  breedCompositions,
  selectedAnimalIds,
  onToggleSelectAll,
  onToggleSelectOne,
  sortField,
  sortOrder,
  onSortChange,
}: AnimalsTableProps) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-5 w-8">
                <input
                  type="checkbox"
                  checked={selectedAnimalIds.length === filteredAnimals.length && filteredAnimals.length > 0}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                />
              </th>
              <th
                className="p-3.5 cursor-pointer hover:text-stone-900"
                onClick={() => onSortChange('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Animal Name / Primary ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Sex &amp; DOB</th>
              <th className="p-3.5">Breed</th>
              <th className="p-3.5">Current Placement</th>
              <th className="p-3.5">Role / Use</th>
              <th className="p-3.5">Status &amp; Alert</th>
              <th className="p-3.5 pr-6 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {filteredAnimals.map((animal) => {
              const farm = farms.find((f) => f.id === animal.farmId);
              const herd = herds.find((h) => h.id === animal.herdId);
              const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
              const isSelected = selectedAnimalIds.includes(animal.id);

              return (
                <tr
                  key={animal.id}
                  className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                >
                  <td className="p-3.5 pl-5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(animal.id)}
                      className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                    />
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900 flex items-center space-x-2">
                      <Link href={`/bovine/animals/${animal.id}`} className="hover:text-emerald-800 hover:underline">
                        {animal.name}
                      </Link>
                      {animal.primaryIdentifier && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {animal.primaryIdentifier}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      ID: {animal.internalId}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-stone-900">{animal.sex}</div>
                    <div className="text-[11px] text-stone-500">{animal.birthDate}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-stone-800">
                      {bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ') || 'Unspecified'}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-stone-900">{farm?.name || 'Farm'}</div>
                    <div className="text-[11px] text-stone-500">{herd?.name || 'Unassigned Herd'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                      {animal.useStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${animal.lifeStatus === 'ALIVE' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      <span className="text-stone-700 font-medium">{animal.lifeStatus}</span>
                    </div>
                    {animal.requiresReview && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Review Required
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <Link
                      href={`/bovine/animals/${animal.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-700 font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>360</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAnimals.length === 0 && (
        <div className="p-12 text-center text-stone-500 text-xs">
          <Layers className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          No livestock found matching your current filter criteria.
        </div>
      )}
    </div>
  );
}
