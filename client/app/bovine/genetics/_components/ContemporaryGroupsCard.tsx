'use client';

import React from 'react';
import Link from 'next/link';
import { Users, AlertTriangle } from 'lucide-react';
import { ContemporaryGroup } from '@/lib/bovine-types';

interface ContemporaryGroupsCardProps {
  contemporaryGroups: ContemporaryGroup[];
}

export function ContemporaryGroupsCard({ contemporaryGroups }: ContemporaryGroupsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-stone-900">Contemporary Groups</h4>
        </div>
        <Link
          href="/bovine/genetics/contemporary-groups"
          className="text-[11px] font-semibold text-emerald-800 hover:underline"
        >
          Manage Groups
        </Link>
      </div>

      <div className="space-y-2.5 text-xs">
        {contemporaryGroups.map((cg) => (
          <div key={cg.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900 truncate max-w-[200px]">{cg.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  cg.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {cg.status}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between">
              <span>{cg.birthSeason}</span>
              <span>{cg.animalCount} head • {cg.phenotypeCount} phenos</span>
            </div>
            {cg.warnings && cg.warnings.length > 0 && (
              <div className="text-[10px] text-amber-700 flex items-center gap-1 font-medium pt-0.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span className="truncate">{cg.warnings[0]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
