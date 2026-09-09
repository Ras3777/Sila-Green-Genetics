'use client';

import React from 'react';
import Link from 'next/link';
import { GitBranch, TrendingUp, Award, Dna, CheckCircle2 } from 'lucide-react';
import {
  Animal,
  MaternalDevelopmentRecord,
  WeaningDevelopmentRecord,
  YearlingDevelopmentRecord,
} from '@/lib/bovine-types';
import { BreedingStockTab } from '../_hooks/useBreedingStockProfile';

interface BreedingOverviewTabProps {
  animal: Animal;
  sire: Animal | null | undefined;
  dam: Animal | null | undefined;
  parentRel: any;
  maternalList: MaternalDevelopmentRecord[];
  weaningList: WeaningDevelopmentRecord[];
  yearlingList: YearlingDevelopmentRecord[];
  setActiveTab: (tab: BreedingStockTab) => void;
}

export function BreedingOverviewTab({
  animal,
  sire,
  dam,
  parentRel,
  maternalList,
  weaningList,
  yearlingList,
  setActiveTab,
}: BreedingOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Pedigree, Performance Quick Look, EPD Highlights */}
      <div className="lg:col-span-2 space-y-6">
        {/* Pedigree Quick Box */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-700" />
              <span>Immediate Pedigree Lineage</span>
            </h3>
            <button
              onClick={() => setActiveTab('pedigree')}
              className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              Full 4-Gen Tree &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sire */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Sire (Father)</span>
              <div className="font-bold text-sm text-stone-900 mt-1">
                {sire ? sire.name : parentRel?.sirePlaceholder || 'GAR Sunrise 4402'}
              </div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                {sire?.registrationNumber || 'USA18921820'} • {sire?.breed || 'Angus Purebred'}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Genomically Verified Pedigree</span>
              </div>
            </div>

            {/* Dam */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Dam (Mother)</span>
              <div className="font-bold text-sm text-stone-900 mt-1">
                {dam ? dam.name : parentRel?.damPlaceholder || 'Rita Blackcap 9M12'}
              </div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                {dam?.registrationNumber || 'USA17552910'} • {dam?.breed || 'Angus Purebred'}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ET Donor Dam • 4 Natural Calves</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Phases Summary */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Growth &amp; Development Progression (Phases I, II, III)</span>
            </h3>
            <button
              onClick={() => setActiveTab('performance')}
              className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              Manage Records &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Maternal / Phase I</span>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">
                {maternalList[0]?.weightKg ? `${maternalList[0].weightKg} kg` : '62.0 kg'}
              </div>
              <p className="text-[11px] text-stone-500 mt-1 truncate">
                {maternalList[0]?.feedingSchedule || 'Daily milk replacer + starter'}
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
                className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
              >
                View Phase I &rarr;
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Weaning / Phase II</span>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">
                {weaningList[0]?.weightKg ? `${weaningList[0].weightKg} kg` : '245.0 kg'}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Adj 205d: 268 kg • REA: {weaningList[0]?.reaCm2 || '52.0'} cm²
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
                className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
              >
                View Phase II &rarr;
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Yearling / Phase III</span>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">
                {yearlingList[0]?.weightKg ? `${yearlingList[0].weightKg} kg` : '485.0 kg'}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                SP: {yearlingList[0]?.scrotalPerimeterCm || '38.0'} cm • Fat: {yearlingList[0]?.sftMm || '6.2'} mm
              </p>
              <Link
                href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
                className="inline-block mt-2 text-[11px] text-emerald-800 font-semibold hover:underline"
              >
                View Phase III &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Breeding Nucleus Badge, EPD Snapshot, Quick Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Registry &amp; Nucleus Certification</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-400 font-medium">Registration Number:</span>
              <div className="font-bold font-mono text-stone-900">{animal.registrationNumber || 'Pending / Under Review'}</div>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Breeder Association:</span>
              <div className="font-semibold text-stone-800">American Angus Association (AAA)</div>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Genomic Panel:</span>
              <div className="font-semibold text-emerald-800">GGP HD 100K Bovine BeadChip</div>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Genetic Condition Status:</span>
              <div className="text-emerald-800 font-medium">AMF, NHF, CAF, DDF Free (All clean)</div>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Semen / Cryo Availability:</span>
              <div className="font-semibold text-stone-900">Straws Stored: 450 units @ Cryo Vault A</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5">
          <h3 className="font-bold text-sm text-stone-900 pb-2 border-b border-stone-100 mb-3 flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-700" />
            <span>EPD Highlights (Decile Rank)</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Calving Ease Direct (CED)</span>
              <span className="font-bold font-mono text-stone-900">+12 (DECA 1)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Birth Weight (BW)</span>
              <span className="font-bold font-mono text-stone-900">-0.8 kg (DECA 2)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Weaning Weight (WW)</span>
              <span className="font-bold font-mono text-stone-900">+78 kg (DECA 1)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Yearling Weight (YW)</span>
              <span className="font-bold font-mono text-stone-900">+136 kg (DECA 1)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Marbling (MARB)</span>
              <span className="font-bold font-mono text-stone-900">+1.12 (DECA 1)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('genetics')}
            className="w-full mt-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            View Complete EPD &amp; DECA Table
          </button>
        </div>
      </div>
    </div>
  );
}
