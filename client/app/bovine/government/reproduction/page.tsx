'use client';

import React from 'react';
import {
  Heart,
  Activity,
  Sparkles,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { ReproductiveFunnelChart } from '@/components/bovine/government/charts/ReproductiveFunnelChart';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function ReproductiveSurveillancePage() {
  const { openMetricDefinitionDrawer } = useGovernment();

  const regionalReproData = [
    { region: 'Oromia (Dairy Belt & Boran Zone)', eligibleFemales: 42000, aiSubmissionPct: 82.4, conceptionPct: 69.2, dystociaPct: 2.1, calfSurvivalPct: 95.8, status: 'EXCELLENT' },
    { region: 'Amhara (South Gondar / Fogera)', eligibleFemales: 28500, aiSubmissionPct: 74.8, conceptionPct: 65.4, dystociaPct: 3.2, calfSurvivalPct: 93.4, status: 'NORMAL' },
    { region: 'Sidama (Highland Dairy)', eligibleFemales: 14200, aiSubmissionPct: 88.0, conceptionPct: 71.5, dystociaPct: 1.8, calfSurvivalPct: 96.2, status: 'EXCELLENT' },
    { region: 'Somali (Pastoral Agro-Ecology)', eligibleFemales: 18900, aiSubmissionPct: 42.0, conceptionPct: 58.6, dystociaPct: 4.1, calfSurvivalPct: 89.2, status: 'SPECIAL_ASSISTANCE' },
  ];

  const columns = [
    {
      key: 'region',
      header: 'Territorial Breeding Region',
      sortable: true,
      render: (row: any) => (
        <div className="font-bold text-stone-900 text-xs">{row.region}</div>
      ),
    },
    {
      key: 'eligibleFemales',
      header: 'Eligible Breeding Cows',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.eligibleFemales.toLocaleString()} head
        </span>
      ),
    },
    {
      key: 'aiSubmissionPct',
      header: 'AI Service Rate',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.aiSubmissionPct}%
        </span>
      ),
    },
    {
      key: 'conceptionPct',
      header: 'Conception Rate',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-emerald-800 text-xs">
          {row.conceptionPct}%
        </span>
      ),
    },
    {
      key: 'dystociaPct',
      header: 'Dystocia Rate',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className={`font-mono font-bold text-xs ${row.dystociaPct > 3.0 ? 'text-rose-700' : 'text-stone-700'}`}>
          {row.dystociaPct}%
        </span>
      ),
    },
    {
      key: 'calfSurvivalPct',
      header: '90d Calf Survival',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-emerald-800 text-xs">
          {row.calfSurvivalPct}%
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Repro Tier',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'EXCELLENT'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : row.status === 'SPECIAL_ASSISTANCE'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-stone-100 text-stone-800 border-stone-200'
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
              REPRODUCTIVE EFFICIENCY
            </span>
            <span className="text-xs text-stone-600">Standard: National AI & Breeding Guidelines</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Reproductive Surveillance & Calving Oversight
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Surveillance of artificial insemination conversion funnels, conception rates, dystocia incidence, and calf survival.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Repro Audit</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="REP-CONCEPTION-RATE"
          label="First-Service Conception Rate"
          value="68.0%"
          trend="UP"
          delta="+2.4% annual"
          domain="REPRODUCTION"
          target="70.0%"
          coveragePct={86.4}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-AI-ADOPTION"
          label="National AI Submission Rate"
          value="80.0%"
          trend="UP"
          delta="+5.8%"
          domain="TECH_ADOPTION"
          target="85.0%"
          coveragePct={80.0}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-DYSTOCIA-RATE"
          label="National Dystocia Incidence"
          value="2.4%"
          trend="DOWN"
          delta="-0.6% reduction"
          domain="CALVING"
          target="< 3.0%"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="REP-CALF-SURVIVAL"
          label="90-Day Calf Survival Rate"
          value="95.0%"
          trend="UP"
          delta="+1.2%"
          domain="SURVIVAL"
          target="> 95%"
          coveragePct={95.0}
          status="NORMAL"
        />
      </div>

      {/* Reproductive Funnel Chart */}
      <div>
        <ReproductiveFunnelChart />
      </div>

      {/* Regional Reproductive Breakdown Table */}
      <div>
        <GovernmentDataTable
          title="Regional Reproductive Performance Matrix"
          subtitle="Territorial breakdown of cow eligibility, artificial insemination submission rates, and calving outcomes."
          columns={columns}
          data={regionalReproData}
          searchPlaceholder="Filter by region..."
          searchFields={['region', 'status']}
        />
      </div>
    </div>
  );
}
