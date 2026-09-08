'use client';

import React, { useState } from 'react';
import {
  Users2,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  PieChart,
  Filter,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { PopulationGrowthWaterfall } from '@/components/bovine/government/charts/PopulationGrowthWaterfall';
import { PopulationPyramidChart } from '@/components/bovine/government/charts/PopulationPyramidChart';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function PopulationAccountingPage() {
  const { selectedJurisdiction, selectedPeriod } = useGovernment();
  const { herds, farms } = useBovine();

  const [selectedBreedFilter, setSelectedBreedFilter] = useState<string>('ALL');

  const breeds = [
    { name: 'Boran (Indigenous)', count: 54800, pct: 38.5, status: 'PROTECTED_CORE', color: 'bg-amber-600' },
    { name: 'Holstein-Friesian (Dairy Cross)', count: 42100, pct: 29.6, status: 'HIGH_PRODUCTION', color: 'bg-indigo-600' },
    { name: 'Fogera (Indigenous Threatened)', count: 18400, pct: 12.9, status: 'SPECIAL_CONSERVATION', color: 'bg-rose-600' },
    { name: 'Jersey (High Solids Dairy)', count: 14200, pct: 10.0, status: 'STABLE', color: 'bg-emerald-600' },
    { name: 'Arsi (Zebu Indigenous)', count: 8600, pct: 6.0, status: 'CONSERVED', color: 'bg-stone-600' },
    { name: 'Composite / Crossbred Genotypes', count: 4160, pct: 2.9, status: 'EVALUATING', color: 'bg-blue-600' },
  ];

  const herdColumns = [
    {
      key: 'name',
      header: 'Herd Unit',
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="font-bold text-stone-900">{row.name}</div>
          <div className="text-[11px] text-stone-600 font-mono">Code: {row.code || row.id}</div>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Farm Facility',
      sortable: true,
      render: (row: any) => {
        const farm = farms.find((f) => f.id === row.farmId);
        return (
          <div>
            <div className="font-medium text-stone-800">{farm?.name || 'Nucleus Farm'}</div>
            <div className="text-[10px] text-stone-600">{farm?.region || 'National'}</div>
          </div>
        );
      },
    },
    {
      key: 'purpose',
      header: 'Production Purpose',
      sortable: true,
      render: (row: any) => (
        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-[10px] font-semibold">
          {row.purpose || 'DAIRY_NUCLEUS'}
        </span>
      ),
    },
    {
      key: 'targetCount',
      header: 'Herd Inventory',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <span className="font-mono font-bold text-stone-900 text-xs">
            {row.targetCount || 120} head
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Surveillance Status',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            ACTIVE REGISTRY
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
              POPULATION ACCOUNTING
            </span>
            <span className="text-xs text-stone-600">Scope: {selectedJurisdiction?.name}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Livestock Population Accounting & Demographics
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Statutory population balance reconciliation, age-sex pyramid, and genetic breed composition.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Census</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="POP-REG-TOTAL"
          label="Total Registered Cattle"
          value="142,260"
          unit="head"
          trend="UP"
          delta="+5,460 net"
          domain="DEMOGRAPHICS"
          target="150,000"
          coveragePct={98.2}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="POP-TURNOVER"
          label="Annual Herd Turnover"
          value="7.3%"
          trend="STABLE"
          delta="Normal equilibrium"
          domain="ACCOUNTING"
          target="< 10%"
          coveragePct={95.0}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="POP-FEMALE-RATIO"
          label="Breeding Female Proportion"
          value="71.2%"
          trend="UP"
          delta="+1.1%"
          domain="STRUCTURE"
          target="> 70%"
          coveragePct={98.0}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="POP-MORTALITY-RATE"
          label="Crude Annual Mortality"
          value="3.2%"
          trend="DOWN"
          delta="-0.4%"
          domain="SURVEILLANCE"
          target="< 4.0%"
          coveragePct={96.4}
          status="NORMAL"
        />
      </div>

      {/* Population Growth Waterfall Balance Sheet */}
      <div>
        <PopulationGrowthWaterfall />
      </div>

      {/* Age-Sex Demographic Pyramid */}
      <div>
        <PopulationPyramidChart />
      </div>

      {/* Breed Composition & Indigenous Conservation */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              National Breed Representation & Indigenous Conservation Status
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Breakdown of registered germplasm across indigenous and high-output dairy genetics.
            </p>
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Indigenous Share: 57.4%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {breeds.map((breed) => (
            <div
              key={breed.name}
              className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-emerald-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${breed.color}`} />
                  <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    {breed.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-stone-900 mt-2">
                  {breed.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/70 flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-stone-900 tabular-nums">
                  {breed.count.toLocaleString()} head
                </span>
                <span className="text-xs font-bold text-emerald-800 font-mono">
                  {breed.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Herd Directory Table */}
      <div>
        <GovernmentDataTable
          title="Registered Herds Directory"
          subtitle="Official monitoring of functional production and genetic evaluation herds across participating operations."
          columns={herdColumns}
          data={herds}
          searchPlaceholder="Filter herds by name, purpose, code..."
          searchFields={['name', 'purpose', 'code', 'id']}
        />
      </div>
    </div>
  );
}
