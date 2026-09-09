'use client';

import React from 'react';
import { Farm, Herd, Organization } from '@/lib/bovine-types';

interface StepPlacementProps {
  ownerOrgId: string;
  setOwnerOrgId: (id: string) => void;
  farmId: string;
  setFarmId: (id: string) => void;
  herdId: string;
  setHerdId: (id: string) => void;
  organizations: Organization[];
  farms: Farm[];
  herds: Herd[];
}

export function StepPlacement({
  ownerOrgId,
  setOwnerOrgId,
  farmId,
  setFarmId,
  herdId,
  setHerdId,
  organizations,
  farms,
  herds,
}: StepPlacementProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
        3. Current Physical Placement & Organization
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Owner Organization</label>
          <select
            value={ownerOrgId}
            onChange={(e) => setOwnerOrgId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Enrolled Farm Station</label>
          <select
            value={farmId}
            onChange={(e) => {
              setFarmId(e.target.value);
              const matchingHerds = herds.filter((h) => h.farmId === e.target.value);
              if (matchingHerds.length > 0) setHerdId(matchingHerds[0].id);
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Herd Assignment</label>
          <select
            value={herdId}
            onChange={(e) => setHerdId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            {herds
              .filter((h) => h.farmId === farmId)
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} • {h.purpose}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
