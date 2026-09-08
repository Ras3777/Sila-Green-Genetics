'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  Calendar,
  Download,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function BreedingProgramsOversightPage() {
  const { programs } = useGovernment();

  const breedingPrograms = [
    {
      code: 'BP-BORAN-NUC',
      name: 'National Boran Elite Seedstock Improvement Scheme',
      agency: 'Ministry of Agriculture & Apex Cooperative Consortium',
      targetGain: '+180g ADG / Generation',
      achievedGain: '+142g ADG',
      activeSires: 84,
      cryoDoses: 38000,
      participatingFarms: 14,
      status: 'ON_TRACK',
    },
    {
      code: 'BP-DAIRY-ADV',
      name: 'National Dairy Genetic Advancement Program (Holstein x Boran)',
      agency: 'National Artificial Insemination Center (NAIC)',
      targetGain: '+450kg Milk / Lactation',
      achievedGain: '+380kg Milk',
      activeSires: 110,
      cryoDoses: 95000,
      participatingFarms: 28,
      status: 'ON_TRACK',
    },
    {
      code: 'BP-FOGERA-CONSERV',
      name: 'Fogera Indigenous Germplasm In Situ Conservation Framework',
      agency: 'Institute of Biodiversity Conservation (IBC)',
      targetGain: 'Maintain Inbreeding F < 4.5%',
      achievedGain: 'F = 4.4%',
      activeSires: 24,
      cryoDoses: 12500,
      participatingFarms: 6,
      status: 'SPECIAL_MONITORING',
    },
    {
      code: 'BP-ARSI-PASTORAL',
      name: 'Arsi Zebu Heat & Tsetse Tolerance Resilience Program',
      agency: 'Regional Agriculture Bureau & Oromia Livestock Agency',
      targetGain: 'Tick Resistance Index > 115',
      achievedGain: 'Index = 112',
      activeSires: 32,
      cryoDoses: 8000,
      participatingFarms: 8,
      status: 'ON_TRACK',
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Statutory Breeding Program',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">{row.name}</div>
          <div className="text-[10px] text-stone-600 font-mono">
            {row.code} • Lead: {row.agency}
          </div>
        </div>
      ),
    },
    {
      key: 'targetGain',
      header: 'Genetic Gain Objective',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-semibold text-stone-800 text-xs">{row.targetGain}</div>
          <div className="text-[10px] text-emerald-800 font-bold">Achieved: {row.achievedGain}</div>
        </div>
      ),
    },
    {
      key: 'activeSires',
      header: 'Proven Sires Distributed',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <span className="font-mono font-bold text-stone-900 text-xs">{row.activeSires} bulls</span>
          <span className="text-[10px] text-stone-500 block">{row.cryoDoses.toLocaleString()} semen doses</span>
        </div>
      ),
    },
    {
      key: 'participatingFarms',
      header: 'Nucleus Farms',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.participatingFarms} facilities
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Oversight Status',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'ON_TRACK'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {row.status}
          </span>
        </div>
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
              BREEDING SCHEMES
            </span>
            <span className="text-xs text-stone-600">Accredited Schemes: {breedingPrograms.length}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Breeding Programs & Germplasm Oversight
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Institutional monitoring of national sire distribution, cryogenic germplasm reserves, and genetic gain targets.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Breeding Dossier</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="BP-ACTIVE-PROGRAMS"
          label="Statutory Breeding Schemes"
          value={breedingPrograms.length}
          unit="schemes"
          trend="STABLE"
          delta="100% compliant"
          domain="PROGRAMS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="BP-TOTAL-SIRES"
          label="Certified AI & Nucleus Sires"
          value="250"
          unit="bulls"
          trend="UP"
          delta="+18 certified"
          domain="GENETICS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="BP-CRYO-RESERVES"
          label="National Cryo-Bank Reserves"
          value="153,500"
          unit="doses"
          trend="UP"
          delta="+22,000 doses"
          domain="CRYOPRESERVATION"
          target="200,000"
          coveragePct={76.8}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="BP-GENETIC-GAIN"
          label="National Genetic Trend Index"
          value="+1.8%"
          trend="UP"
          delta="Annual progress"
          domain="EVALUATION"
          status="NORMAL"
        />
      </div>

      {/* Programs Table */}
      <div>
        <GovernmentDataTable
          title="Accredited National Breeding Schemes"
          subtitle="Official regulatory registry of state and cooperative bovine genetic improvement programs."
          columns={columns}
          data={breedingPrograms}
          searchPlaceholder="Filter programs by name, code, agency..."
          searchFields={['name', 'code', 'agency']}
        />
      </div>
    </div>
  );
}
