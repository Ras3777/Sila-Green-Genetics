'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { Sex, UseStatus } from '@/lib/bovine-types';

interface SectionBasicIdentificationProps {
  name: string;
  setName: (v: string) => void;
  internalId: string;
  setInternalId: (v: string) => void;
  earTag: string;
  setEarTag: (v: string) => void;
  rfid: string;
  setRfid: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  sex: Sex;
  setSex: (v: Sex) => void;
  useStatus: UseStatus;
  setUseStatus: (v: UseStatus) => void;
  cattleClass: string;
  setCattleClass: (v: string) => void;
}

export function SectionBasicIdentification({
  name,
  setName,
  internalId,
  setInternalId,
  earTag,
  setEarTag,
  rfid,
  setRfid,
  birthDate,
  setBirthDate,
  sex,
  setSex,
  useStatus,
  setUseStatus,
  cattleClass,
  setCattleClass,
}: SectionBasicIdentificationProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
        <Tag className="w-4 h-4 text-emerald-700" />
        <span>Section A — Basic Identification</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Animal Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maple Blossom 104"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-700"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            GN / Internal ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={internalId}
            onChange={(e) => setInternalId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Ear Tag Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={earTag}
            onChange={(e) => setEarTag(e.target.value)}
            placeholder="e.g. TAG-4821"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">RFID / EID (15-digit)</label>
          <input
            type="text"
            value={rfid}
            onChange={(e) => setRfid(e.target.value)}
            placeholder="982 000 123 456 789"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-700"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="FEMALE">Female (Heifer / Cow)</option>
            <option value="MALE">Male (Bull / Steer)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Livestock Use Status</label>
          <select
            value={useStatus}
            onChange={(e) => setUseStatus(e.target.value as UseStatus)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="GENERAL">General Herd</option>
            <option value="RECIPIENT">ET Recipient Candidate</option>
            <option value="DONOR">Donor Candidate</option>
            <option value="BREEDING_STOCK">Breeding Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Cattle Class</label>
          <input
            type="text"
            value={cattleClass}
            onChange={(e) => setCattleClass(e.target.value)}
            placeholder="Commercial Dairy Heifer"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
