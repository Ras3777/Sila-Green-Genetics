'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { Farm, Sex } from '@/lib/bovine-types';

interface StepIdentityProps {
  dgr: string;
  setDgr: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  earTag: string;
  setEarTag: (val: string) => void;
  birthDate: string;
  setBirthDate: (val: string) => void;
  calculateAge: (dateStr: string) => string;
  sex: Sex;
  setSex: (val: Sex) => void;
  bullType: string;
  setBullType: (val: string) => void;
  farmId: string;
  setFarmId: (val: string) => void;
  farms: Farm[];
  supervisor: string;
  setSupervisor: (val: string) => void;
}

export function StepIdentity({
  dgr,
  setDgr,
  name,
  setName,
  earTag,
  setEarTag,
  birthDate,
  setBirthDate,
  calculateAge,
  sex,
  setSex,
  bullType,
  setBullType,
  farmId,
  setFarmId,
  farms,
  supervisor,
  setSupervisor,
}: StepIdentityProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Tag className="w-4 h-4 text-amber-700" />
        <span>Step 1 — Identity &amp; Registry Metadata</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            DGR Registration Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={dgr}
            onChange={(e) => setDgr(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Animal Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Altair Benchmark ET"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Ear Tag</label>
          <input
            type="text"
            value={earTag}
            onChange={(e) => setEarTag(e.target.value)}
            placeholder="e.g. US-9901421"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Calculated Age (Preview)</label>
          <div className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-semibold font-mono">
            {calculateAge(birthDate)} (From Birth Date)
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
          >
            <option value="FEMALE">Female (Donor / Dam)</option>
            <option value="MALE">Male (Sire / Bull)</option>
          </select>
        </div>

        {sex === 'MALE' && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Bull Category</label>
            <select
              value={bullType}
              onChange={(e) => setBullType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="AI_SIRE">Proven Artificial Insemination Sire</option>
              <option value="GENOMIC_CANDIDATE">Young Genomic Candidate Bull</option>
              <option value="NATURAL_SERVICE">Natural Service Herd Bull</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Facility / Farm</label>
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
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
          <label className="block text-xs font-semibold text-stone-700 mb-1">Registry Supervisor</label>
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
