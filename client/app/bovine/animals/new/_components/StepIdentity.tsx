'use client';

import React from 'react';
import { AnimalSex, BirthType, HornStatus, LivestockUseStatus } from '@/lib/bovine-types';

interface StepIdentityProps {
  name: string;
  setName: (name: string) => void;
  sex: AnimalSex;
  setSex: (sex: AnimalSex) => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  birthWeightKg: number;
  setBirthWeightKg: (weight: number) => void;
  birthType: BirthType;
  setBirthType: (type: BirthType) => void;
  useStatus: LivestockUseStatus;
  setUseStatus: (status: LivestockUseStatus) => void;
  hornStatus: HornStatus;
  setHornStatus: (status: HornStatus) => void;
  coatColor: string;
  setCoatColor: (color: string) => void;
}

export function StepIdentity({
  name,
  setName,
  sex,
  setSex,
  birthDate,
  setBirthDate,
  birthWeightKg,
  setBirthWeightKg,
  birthType,
  setBirthType,
  useStatus,
  setUseStatus,
  hornStatus,
  setHornStatus,
  coatColor,
  setCoatColor,
}: StepIdentityProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
        1. Basic Identity & Physical Traits
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Registered Animal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Pine-Tree 9882 Hero 721-ET"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Biological Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as AnimalSex)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="FEMALE">Female (Heifer / Cow)</option>
            <option value="MALE">Male (Bull)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Weight (kg)</label>
          <input
            type="number"
            value={birthWeightKg}
            onChange={(e) => setBirthWeightKg(parseFloat(e.target.value))}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Type</label>
          <select
            value={birthType}
            onChange={(e) => setBirthType(e.target.value as BirthType)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="SINGLE">Single Calf</option>
            <option value="TWIN">Twin</option>
            <option value="TRIPLET">Triplet</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Livestock Use Status</label>
          <select
            value={useStatus}
            onChange={(e) => setUseStatus(e.target.value as LivestockUseStatus)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="BREEDING_STOCK">Breeding Stock</option>
            <option value="DONOR">Embryo / OPU Donor</option>
            <option value="RECIPIENT">Recipient Dam</option>
            <option value="AI_SIRE">AI Sire</option>
            <option value="NATURAL_SERVICE_SIRE">Natural Service Bull</option>
            <option value="TEST_ANIMAL">Test Animal</option>
            <option value="CULL_CANDIDATE">Cull Candidate</option>
            <option value="GENERAL">General Livestock</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Horn Status</label>
          <select
            value={hornStatus}
            onChange={(e) => setHornStatus(e.target.value as HornStatus)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          >
            <option value="POLLED">Polled (Naturally hornless)</option>
            <option value="HORNED">Horned</option>
            <option value="DEHORNED">Dehorned / Disbudded</option>
            <option value="SCURRED">Scurred</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Coat Color & Pattern</label>
          <input
            type="text"
            value={coatColor}
            onChange={(e) => setCoatColor(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}
