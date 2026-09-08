'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  Dna,
  Scale,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { Animal } from '@/lib/bovine-types';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';

export default function NationalAnimalRegistryPage() {
  const { openMetricDefinitionDrawer } = useGovernment();
  const { animals, farms, identifiers } = useBovine();

  const [integrityFilter, setIntegrityFilter] = useState<string>('ALL');
  const [sexFilter, setSexFilter] = useState<string>('ALL');

  // Augment animals with national registry metrics and anomaly flags
  const augmentedAnimals = animals.map((a: Animal) => {
    const farm = farms.find((f) => f.id === a.farmId);
    const rfidId = identifiers.find((i) => i.animalId === a.id && i.type === 'RFID');

    const breedName = a.breed || 'Boran Indigenous';
    const hasParentageConflict = a.internalId === 'ANIM-003';
    const isDuplicateRfid = a.internalId === 'ANIM-005';
    const isGenotyped = a.classification === 'BREEDING_STOCK' || breedName.includes('Boran');

    const integrityStatus = hasParentageConflict
      ? 'PARENTAGE_CONFLICT'
      : isDuplicateRfid
      ? 'DUPLICATE_RFID'
      : 'VERIFIED';

    const weight = a.currentWeightKg || 420;
    const adg = a.adgKg || (breedName.includes('Boran') ? 1.15 : 0.95);
    const indexEfficiency = breedName.includes('Boran') ? 108.4 : 96.2;

    return {
      ...a,
      breed: breedName,
      farmName: farm?.name || 'Nucleus Farm',
      farmCode: farm?.code || 'FARM-ET-001',
      region: farm?.region || 'Oromia',
      rfid: rfidId?.value || `982-0000-${a.internalId.replace('ANIM-', '')}`,
      integrityStatus,
      isGenotyped,
      weight,
      adg,
      indexEfficiency,
    };
  });

  const filtered = augmentedAnimals.filter((a) => {
    if (integrityFilter !== 'ALL' && a.integrityStatus !== integrityFilter) return false;
    if (sexFilter !== 'ALL' && a.sex !== sexFilter) return false;
    return true;
  });

  const conflictCount = augmentedAnimals.filter((a) => a.integrityStatus !== 'VERIFIED').length;
  const genotypedCount = augmentedAnimals.filter((a) => a.isGenotyped).length;

  const columns = [
    {
      key: 'name',
      header: 'Animal & Registration #',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-stone-900 flex items-center space-x-1.5">
            <span>{row.name}</span>
            {row.integrityStatus !== 'VERIFIED' && (
              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold border border-rose-200">
                EXCEPTION
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-600 font-mono">
            Reg: {row.registrationNumber || row.internalId} • DGR: {row.internalId}
          </div>
        </div>
      ),
    },
    {
      key: 'rfid',
      header: 'National RFID Tag',
      sortable: true,
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-stone-800">
          {row.rfid}
        </span>
      ),
    },
    {
      key: 'breed',
      header: 'Breed & Sex',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-medium text-stone-900 text-xs">{row.breed}</div>
          <div className="text-[10px] text-stone-600 font-mono font-bold uppercase">{row.sex}</div>
        </div>
      ),
    },
    {
      key: 'weight',
      header: 'Weight / ADG',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <div className="font-mono font-bold text-stone-900 text-xs">{row.weight} kg</div>
          <div className="text-[10px] text-stone-600 font-mono">{row.adg.toFixed(2)} kg/d ADG</div>
        </div>
      ),
    },
    {
      key: 'indexEfficiency',
      header: 'Efficiency Index',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <span className="font-mono font-bold text-emerald-800 text-xs">
            {row.indexEfficiency.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Facility & Region',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="text-xs font-medium text-stone-900">{row.farmName}</div>
          <div className="text-[10px] text-stone-600">{row.region}</div>
        </div>
      ),
    },
    {
      key: 'integrityStatus',
      header: 'Integrity Status',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.integrityStatus === 'PARENTAGE_CONFLICT'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : row.integrityStatus === 'DUPLICATE_RFID'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {row.integrityStatus}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: any) => (
        <Link
          href={`/bovine/government/animals/${row.id}`}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors"
        >
          <span>Statutory File</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              NATIONAL LIVESTOCK MASTER REGISTER
            </span>
            <span className="text-xs text-stone-600">Total Cattle: {animals.length}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Bovine Identification & Pedigree Integrity Registry
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Official repository of national RFID tags, DGR numbers, weight logs, ADG benchmarks, and identity verification.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Integrity Filter */}
          <select
            value={integrityFilter}
            onChange={(e) => setIntegrityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Identity States</option>
            <option value="VERIFIED">Verified Clean</option>
            <option value="PARENTAGE_CONFLICT">Parentage Conflict</option>
            <option value="DUPLICATE_RFID">Duplicate RFID</option>
          </select>

          {/* Sex Filter */}
          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Sexes</option>
            <option value="FEMALE">Females (Cows/Heifers)</option>
            <option value="MALE">Males (Sires/Bulls)</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="ANIM-REG-TOTAL"
          label="Registered Seedstock & Commercial"
          value={animals.length}
          unit="head"
          trend="UP"
          delta="+18 registered"
          domain="REGISTRY"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANIM-50K-GENOTYPED"
          label="Genotyped Seedstock"
          value={genotypedCount}
          unit="head"
          trend="UP"
          delta="+5 genotyped"
          domain="GENOMICS"
          coveragePct={Math.round((genotypedCount / animals.length) * 100)}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANIM-INTEGRITY-FLAG"
          label="Identity / Parentage Exceptions"
          value={conflictCount}
          unit="animals"
          trend={conflictCount > 0 ? 'UP' : 'STABLE'}
          delta={conflictCount > 0 ? 'Review pending' : 'Zero'}
          domain="INTEGRITY"
          status={conflictCount > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="ANIM-AVG-ADG"
          label="National Herd Mean ADG"
          value="1.08 kg/d"
          trend="UP"
          delta="+0.04 kg/d"
          domain="GROWTH"
          status="NORMAL"
        />
      </div>

      {/* Main Animal Registry Table */}
      <div>
        <GovernmentDataTable
          title="National Livestock Registry"
          subtitle="Complete census of cattle with DGR, RFID, ADG, weight, efficiency index, and parentage integrity."
          columns={columns}
          data={filtered}
          searchPlaceholder="Search by name, RFID tag, DGR, breed, farm..."
          searchFields={['name', 'rfid', 'internalId', 'registrationNumber', 'breed', 'farmName']}
        />
      </div>
    </div>
  );
}
