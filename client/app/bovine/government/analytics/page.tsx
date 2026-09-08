'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function InstitutionalAnalyticsPage() {
  const { jurisdictions, openMetricDefinitionDrawer } = useGovernment();

  const comparisonData = [
    {
      region: 'Oromia Regional State',
      inventory: 68400,
      genotyping50k: 44.2,
      conceptionRate: 69.2,
      inbreedingF: 3.8,
      auditPassRate: 91.4,
      dataCompleteness: 97.2,
      rank: 1,
    },
    {
      region: 'Sidama Regional State',
      inventory: 24200,
      genotyping50k: 41.8,
      conceptionRate: 71.5,
      inbreedingF: 4.1,
      auditPassRate: 94.0,
      dataCompleteness: 98.4,
      rank: 2,
    },
    {
      region: 'Amhara Regional State',
      inventory: 38200,
      genotyping50k: 32.5,
      conceptionRate: 65.4,
      inbreedingF: 4.4,
      auditPassRate: 86.8,
      dataCompleteness: 94.1,
      rank: 3,
    },
    {
      region: 'Somali Regional State',
      inventory: 11460,
      genotyping50k: 18.2,
      conceptionRate: 58.6,
      inbreedingF: 4.6,
      auditPassRate: 78.2,
      dataCompleteness: 88.6,
      rank: 4,
    },
  ];

  const columns = [
    {
      key: 'rank',
      header: 'Composite Rank',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span className="w-6 h-6 rounded-full bg-stone-900 text-white font-bold text-xs inline-flex items-center justify-center font-mono">
            #{row.rank}
          </span>
        </div>
      ),
    },
    {
      key: 'region',
      header: 'Regional Jurisdiction',
      sortable: true,
      render: (row: any) => (
        <div className="font-bold text-stone-900 text-xs">{row.region}</div>
      ),
    },
    {
      key: 'inventory',
      header: 'Cattle Inventory',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.inventory.toLocaleString()} head
        </span>
      ),
    },
    {
      key: 'genotyping50k',
      header: '50K Genotyping',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.genotyping50k}%
        </span>
      ),
    },
    {
      key: 'conceptionRate',
      header: 'Conception Rate',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-emerald-800 text-xs">
          {row.conceptionRate}%
        </span>
      ),
    },
    {
      key: 'inbreedingF',
      header: 'Mean Inbreeding (F)',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-800 text-xs">
          {row.inbreedingF}%
        </span>
      ),
    },
    {
      key: 'auditPassRate',
      header: 'Compliance Pass',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-emerald-800 text-xs">
          {row.auditPassRate}%
        </span>
      ),
    },
    {
      key: 'dataCompleteness',
      header: 'Data Quality',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <span className="font-mono font-bold text-stone-900 text-xs">
          {row.dataCompleteness}%
        </span>
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
              TERRITORIAL BENCHMARKING
            </span>
            <span className="text-xs text-stone-600">Cross-Jurisdiction Analytics</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Institutional Analytics & Regional Performance Benchmarking
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Comparative performance matrix evaluating regional livestock authorities across genetics, health, and compliance.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Matrix</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="ANL-LEADER"
          label="Top Performing Region"
          value="Oromia"
          subtext="Composite Score: 94.2/100"
          domain="RANKINGS"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANL-AI-LEADER"
          label="Highest AI Conception Rate"
          value="71.5%"
          subtext="Sidama Regional State"
          domain="REPRODUCTION"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANL-COMP-LEADER"
          label="Highest Audit Compliance"
          value="94.0%"
          subtext="Sidama Regional State"
          domain="COMPLIANCE"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANL-CENSUS-LEADER"
          label="Largest Seedstock Population"
          value="68,400"
          unit="head"
          subtext="Oromia Regional State"
          domain="CENSUS"
          status="NORMAL"
        />
      </div>

      {/* Cross-Regional Performance Table */}
      <div>
        <GovernmentDataTable
          title="Comparative Territorial Performance Matrix"
          subtitle="Multi-metric evaluation across all 4 major regional livestock authorities."
          columns={columns}
          data={comparisonData}
          searchPlaceholder="Filter regions..."
          searchFields={['region']}
        />
      </div>
    </div>
  );
}
