'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Animal, Farm, Herd } from '@/lib/bovine-types';

interface BreedingHeroHeaderProps {
  animal: Animal;
  farm: Farm | null | undefined;
  herd: Herd | null | undefined;
}

export function BreedingHeroHeader({ animal, farm, herd }: BreedingHeroHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals" className="hover:text-emerald-800">
          Animals
        </Link>
        <span>/</span>
        <Link href="/bovine/animals/breeding-stock" className="hover:text-emerald-800">
          Breeding Stock
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">{animal.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Elite Breeding Stock
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                  Nucleus Grade
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                  DGR: {animal.dgr || 'DGR-BR-9904'}
                </span>
                <span className="text-xs text-stone-400 font-mono">ID: {animal.internalId}</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                {animal.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-600">
                <span>{animal.breed || 'Registered Purebred'}</span>
                <span>•</span>
                <span className="font-semibold uppercase text-stone-800">{animal.sex}</span>
                <span>•</span>
                <span>DOB: {animal.birthDate || animal.dateOfBirth || 'Unknown'}</span>
                <span>•</span>
                <span>{farm ? farm.name : 'Primary Farm'}</span>
                {herd && (
                  <>
                    <span>•</span>
                    <span className="text-stone-500">{herd.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Commercial Hub</span>
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/documents`}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Official Certificates</span>
            </Link>
            <Link
              href={`/bovine/animals/${animal.id}`}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>Animal 360 View</span>
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/maternal`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase I
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/weaning`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase II
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/performance/yearling`}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              Phase III
            </Link>
          </div>
        </div>

        {/* Quick Genetic Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Inbreeding (F)</span>
            <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">
              {animal.inbreedingCoefficient !== undefined ? `${(animal.inbreedingCoefficient * 100).toFixed(1)}%` : '2.1%'}
            </div>
            <span className="text-[10px] text-emerald-700">Low Risk Tier</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Current Weight</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {animal.currentWeightKg || 580} kg
            </div>
            <span className="text-[10px] text-stone-500">ADG: {animal.adgKg || 1.35} kg/d</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Frame Size</span>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {animal.frameSize || '6.2 (Moderate)'}
            </div>
            <span className="text-[10px] text-stone-500">Mature scale</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Scrotal / Repro</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              39.5 cm
            </div>
            <span className="text-[10px] text-stone-500">Top 10% for age</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Ribeye Area (REA)</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              88.4 cm²
            </div>
            <span className="text-[10px] text-stone-500">+12.4% vs cohort</span>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Selection Index</span>
            <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
              $B +168.4
            </div>
            <span className="text-[10px] text-amber-800 font-medium">Top 5% Breed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
