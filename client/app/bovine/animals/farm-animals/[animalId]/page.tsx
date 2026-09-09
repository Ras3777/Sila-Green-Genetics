'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  Layers,
  Award,
  CalendarCheck2,
  HeartPulse,
  Heart,
  TrendingUp,
  History,
  Tag,
  Scale,
  Building2,
  Users,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';
import { ContextualBovineMap } from '@/components/bovine/map/ContextualBovineMap';

export default function FarmAnimal360Page({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, farms, herds, maternalRecords, weaningRecords, yearlingRecords } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  if (!animal) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Farm Animal Not Found</h1>
        <p className="text-xs text-stone-500">No active animal matches ID &ldquo;{animalId}&rdquo;.</p>
        <Link
          href="/bovine/animals/farm-animals"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Farm Animals Directory
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);

  const myMaternal = maternalRecords.filter((m) => m.animalId === animal.id);
  const myWeaning = weaningRecords.filter((w) => w.animalId === animal.id);
  const myYearling = yearlingRecords.filter((y) => y.animalId === animal.id);

  const calculateAge = (birthDateStr: string) => {
    const birth = new Date(birthDateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remainingMo = diffMonths % 12;
    return remainingMo > 0 ? `${years}y ${remainingMo}m` : `${years} yrs`;
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/animals/farm-animals" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Farm Animals</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-stone-700">{animal.primaryIdentifier || animal.internalId}</span>
        <span>/</span>
        <span className="font-semibold text-stone-900">{animal.name}</span>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          {animal.photoUrl ? (
            <img
              src={animal.photoUrl}
              alt={animal.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold">
              <Layers className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{animal.name}</h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                {animal.primaryIdentifier || animal.internalId}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                {animal.useStatus.replace(/_/g, ' ')}
              </span>
              {animal.isBreedingStock || animal.classification === 'BREEDING_STOCK' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  <Award className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Qualified Breeding Stock
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                  Farm Livestock
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
              <span>{animal.sex}</span>
              <span>•</span>
              <span>Age: {calculateAge(animal.birthDate)}</span>
              <span>•</span>
              <span>DOB: {animal.birthDate}</span>
              <span>•</span>
              <span className="font-semibold text-stone-800">{animal.breed || 'Purebred'}</span>
              <span>•</span>
              <span>{farm?.name || 'Farm'} ({herd?.name || 'Herd'})</span>
            </div>
          </div>
        </div>

        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!animal.isBreedingStock && animal.classification !== 'BREEDING_STOCK' && (
            <Link
              id="btn-qualify-breeding-stock"
              href={`/bovine/animals/farm-animals/${animal.id}/qualify-breeding-stock`}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Qualify as Breeding Stock</span>
            </Link>
          )}

          <Link
            href={`/bovine/animals/${animal.id}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <span>Full Canonical 360 &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-semibold">
        <span className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white shadow-2xs">Overview</span>
        <Link
          href={`/bovine/animals/farm-animals/${animal.id}/development/maternal`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Maternal / Phase I
        </Link>
        <Link
          href={`/bovine/animals/farm-animals/${animal.id}/development/weaning`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Weaning / Phase II
        </Link>
        <Link
          href={`/bovine/animals/farm-animals/${animal.id}/development/yearling`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Yearling / Phase III
        </Link>
        <Link
          href={`/bovine/animals/${animal.id}/health`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Health &amp; Meds
        </Link>
        <Link
          href={`/bovine/animals/${animal.id}/reproduction`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Reproduction
        </Link>
        <Link
          href={`/bovine/animals/${animal.id}/daily-log`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          Daily Logs
        </Link>
        <Link
          href={`/bovine/animals/farm-animals/${animal.id}/media`}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-1"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-700" />
          <span>Media Evidence</span>
        </Link>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Current Weight</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {animal.currentWeightKg || animal.birthWeightKg || 45.0} kg
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Scale weighing certification</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Birth Weight</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800">
            {animal.birthWeightKg ? `${animal.birthWeightKg} kg` : 'N/A'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Intake record at delivery</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Maternal Stage Vigor</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {myMaternal.length > 0 ? `${myMaternal.length} Checks` : 'Initial'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Phase I observations logged</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Weaning / Yearling</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {myWeaning.length + myYearling.length > 0 ? `${myWeaning.length + myYearling.length} Logs` : 'Pending'}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Phase II &amp; III milestones</div>
        </div>
      </div>

      {/* Pedigree Context Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
        <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-700" />
          <span>Parentage &amp; Pedigree Provenance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">Sire (Father)</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{animal.sireName || 'Unregistered Sire'}</div>
              <div className="text-[11px] text-stone-500 font-mono">{animal.sireId || 'External Sire Reference'}</div>
            </div>
            {animal.sireId && (
              <Link
                href={`/bovine/animals/${animal.sireId}`}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                View Sire &rarr;
              </Link>
            )}
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">Dam (Mother)</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{animal.damName || 'Unregistered Dam'}</div>
              <div className="text-[11px] text-stone-500 font-mono">{animal.damId || 'External Dam Reference'}</div>
            </div>
            {animal.damId && (
              <Link
                href={`/bovine/animals/${animal.damId}`}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                View Dam &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Geospatial Telemetry & Paddock Location */}
      <ContextualBovineMap
        title={`${animal.name} (${animal.primaryIdentifier || animal.internalId || animal.id}) Geospatial Telemetry`}
        description={`Live GNSS fix, assigned paddock, and farm perimeter at ${farm?.name || 'Registered Facility'}`}
        focusAnimalId={animal.id}
        focusFarmId={animal.farmId}
        heightClassName="h-[340px]"
      />

      {/* Visual Evidence & Media Section */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        title="Visual Evidence & Diagnostic Media"
        description="Biometric identification, growth conformation, and veterinary photographic evidence."
        galleryPath={`/bovine/animals/farm-animals/${animal.id}/media`}
      />
    </div>
  );
}
