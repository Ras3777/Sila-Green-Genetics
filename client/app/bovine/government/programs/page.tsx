'use client';

import React from 'react';
import {
  Flag,
  Sparkles,
  Award,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { GovernmentProgram } from '@/lib/bovine-government-types';

export default function NationalProgramsPage() {
  const { programs } = useGovernment();

  const columns = [
    {
      key: 'name',
      header: 'Strategic National Initiative',
      sortable: true,
      render: (row: GovernmentProgram) => (
        <div>
          <div className="font-bold text-stone-900 text-xs">{row.name}</div>
          <div className="text-[10px] text-stone-500 font-mono">
            {row.code} • Lead: {row.leadAgency}
          </div>
        </div>
      ),
    },
    {
      key: 'progressPct',
      header: 'National Progress',
      sortable: true,
      render: (row: GovernmentProgram) => (
        <div className="space-y-1 w-44">
          <div className="flex justify-between text-[11px]">
            <span className="font-bold text-stone-900">{row.progressPct}%</span>
            <span className="text-stone-500 font-mono">{row.completedCount?.toLocaleString()} / {row.totalEligible?.toLocaleString()}</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.progressPct >= 60 ? 'bg-emerald-600' : row.progressPct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(row.progressPct, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'regionsCovered',
      header: 'Target Regions',
      render: (row: GovernmentProgram) => (
        <div className="text-xs text-stone-700">
          {row.regionsCovered?.join(', ')}
        </div>
      ),
    },
    {
      key: 'targetCompletionDate',
      header: 'Target Deadline',
      sortable: true,
      render: (row: GovernmentProgram) => (
        <span className="font-mono text-xs font-semibold text-stone-800">
          {row.targetCompletionDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Milestone Status',
      sortable: true,
      align: 'center' as const,
      render: (row: GovernmentProgram) => (
        <div className="text-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'ON_TRACK'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : row.status === 'AT_RISK'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
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
              PUBLIC CAMPAIGNS
            </span>
            <span className="text-xs text-stone-600">Ministry of Agriculture Initiatives</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Public Programs & National Livestock Campaigns
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Oversight of federal strategic interventions including national AI expansion, 50K genotyping, and breed conservation.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Program Scorecard</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="PROG-COUNT"
          label="Active National Campaigns"
          value={programs.length}
          unit="initiatives"
          trend="STABLE"
          delta="3 federal, 1 regional"
          domain="PROGRAMS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="PROG-AI-COVERAGE"
          label="National AI Expansion Target"
          value="52.8%"
          trend="UP"
          delta="+18.8% vs baseline"
          domain="CAMPAIGNS"
          target="65.0%"
          coveragePct={81.2}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="PROG-50K-CAMPAIGN"
          label="Seedstock Genotyping Target"
          value="38.6%"
          trend="UP"
          delta="+20.6% vs baseline"
          domain="GENOMICS"
          target="50.0%"
          coveragePct={77.2}
          status="WATCH"
        />

        <InstitutionalStatCard
          metricCode="PROG-INDIG-CONSERVE"
          label="Boran Conservation Target"
          value="54.0%"
          trend="STABLE"
          delta="Special focus zone"
          domain="CONSERVATION"
          target="75.0%"
          coveragePct={72.0}
          status="WATCH"
        />
      </div>

      {/* Programs Table */}
      <div>
        <GovernmentDataTable
          title="National Strategic Livestock Programs Directory"
          subtitle="Progress milestones, participating cooperatives, and execution deadlines."
          columns={columns}
          data={programs}
          searchPlaceholder="Filter programs by name, code, agency..."
          searchFields={['name', 'code', 'leadAgency', 'category']}
        />
      </div>
    </div>
  );
}
