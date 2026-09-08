'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';

export default function BovineFarmAnimalsPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { animals, herds, groups, farms } = useBovine();
  const farm = farms.find((f) => f.id === farmId);
  const farmAnimals = animals.filter((a) => a.farmId === farmId);
  const farmHerds = herds.filter((h) => h.farmId === farmId);

  const [search, setSearch] = useState('');
  const [selectedHerd, setSelectedHerd] = useState('ALL');

  if (!farm) return null;

  const filtered = farmAnimals.filter((animal) => {
    if (selectedHerd !== 'ALL' && animal.herdId !== selectedHerd) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = animal.name.toLowerCase().includes(q);
      const matchId = animal.internalId.toLowerCase().includes(q);
      const matchTag = animal.primaryIdentifier?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search livestock by name, tag, or internal ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-stone-400 font-semibold uppercase text-[10px] whitespace-nowrap">Herd Filter:</span>
          <select
            value={selectedHerd}
            onChange={(e) => setSelectedHerd(e.target.value)}
            className="w-full sm:w-auto bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
          >
            <option value="ALL">All Herds ({farmAnimals.length})</option>
            {farmHerds.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <Link
            href={`/bovine/animals/new?farmId=${farm.id}`}
            className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Cattle</span>
          </Link>
        </div>
      </div>

      {/* Livestock Table */}
      <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-6">Animal Name & ID</th>
                <th className="p-3.5">Sex & Age</th>
                <th className="p-3.5">Assigned Herd</th>
                <th className="p-3.5">Management Group</th>
                <th className="p-3.5">Role / Use</th>
                <th className="p-3.5">Status & Alerts</th>
                <th className="p-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filtered.map((animal) => {
                const h = herds.find((item) => item.id === animal.herdId);
                const g = groups.find((item) => item.id === animal.managementGroupId);

                return (
                  <tr key={animal.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 pl-6">
                      <Link href={`/bovine/animals/${animal.id}`} className="font-bold text-stone-900 hover:text-emerald-800 block">
                        {animal.name}
                      </Link>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {animal.primaryIdentifier || animal.internalId}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-stone-900">{animal.sex}</div>
                      <div className="text-[11px] text-stone-500">DOB: {animal.birthDate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-stone-800">{h?.name || 'Unassigned Herd'}</span>
                    </td>
                    <td className="p-3.5">
                      {g ? (
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-mono font-medium">
                          {g.code} ({g.name})
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">No Group</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium">
                        {animal.useStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${animal.lifeStatus === 'ALIVE' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        <span>{animal.lifeStatus}</span>
                      </div>
                      {animal.requiresReview && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Review Needed
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 pr-6 text-right">
                      <Link
                        href={`/bovine/animals/${animal.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-700 font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360 Profile</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-stone-400 text-xs">
            No livestock found matching your current filter.
          </div>
        )}
      </div>
    </div>
  );
}
