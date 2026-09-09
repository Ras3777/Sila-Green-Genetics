'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { Farm, Herd, ManagementGroup } from '@/lib/bovine-types';

interface SectionFarmAssignmentProps {
  farms: Farm[];
  herds: Herd[];
  groups: ManagementGroup[];
  farmId: string;
  setFarmId: (v: string) => void;
  herdId: string;
  setHerdId: (v: string) => void;
  groupId: string;
  setGroupId: (v: string) => void;
  currentLocation: string;
  setCurrentLocation: (v: string) => void;
  owner: string;
  setOwner: (v: string) => void;
  supervisor: string;
  setSupervisor: (v: string) => void;
}

export function SectionFarmAssignment({
  farms,
  herds,
  groups,
  farmId,
  setFarmId,
  herdId,
  setHerdId,
  groupId,
  setGroupId,
  currentLocation,
  setCurrentLocation,
  owner,
  setOwner,
  supervisor,
  setSupervisor,
}: SectionFarmAssignmentProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Building2 className="w-4 h-4 text-emerald-700" />
        <span>Section B — Farm Assignment &amp; Custody</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Farm</label>
          <select
            value={farmId}
            onChange={(e) => {
              setFarmId(e.target.value);
              setHerdId('');
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

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Herd Directory</label>
          <select
            value={herdId}
            onChange={(e) => setHerdId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">Default Farm Herd</option>
            {herds
              .filter((h) => !farmId || h.farmId === farmId)
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.purpose})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Management Pen / Group</label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="">Unassigned Group</option>
            {groups
              .filter((g) => !farmId || g.farmId === farmId)
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Pen / Pasture Location</label>
          <input
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            placeholder="Barn 2 - Pen A"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Owner / Syndicate</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Supervisor</label>
          <input
            type="text"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
