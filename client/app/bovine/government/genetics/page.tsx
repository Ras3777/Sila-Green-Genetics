'use client';

import React from 'react';
import {
  Dna,
  Award,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Download,
  Filter,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';

export default function GeneticsSurveillancePage() {
  const { openMetricDefinitionDrawer } = useGovernment();

  const genomicCohorts = [
    { breed: 'Boran Nucleus Seedstock', totalBulls: 240, genotypedCount: 228, meanInbreedingF: 3.8, mendelianCleanPct: 99.4, status: 'EXCELLENT' },
    { breed: 'Fogera Conservation Elite', totalBulls: 85, genotypedCount: 72, meanInbreedingF: 4.4, mendelianCleanPct: 98.8, status: 'CONTROLLED' },
    { breed: 'Holstein-Friesian AI Sires', totalBulls: 140, genotypedCount: 138, meanInbreedingF: 6.2, mendelianCleanPct: 99.8, status: 'ELEVATED_WATCH' },
    { breed: 'Jersey Nucleus Sires', totalBulls: 60, genotypedCount: 56, meanInbreedingF: 5.1, mendelianCleanPct: 99.1, status: 'ACCEPTABLE' },
    { breed: 'Commercial Seedstock Replacements', totalBulls: 850, genotypedCount: 312, meanInbreedingF: 4.1, mendelianCleanPct: 97.2, status: 'IN_PROGRESS' },
  ];

  const columns = [
    {
      key: 'breed',
      header: 'Genomic Sub-Population',
      sortable: true,
      render: (row: any) => (
        <div className="font-bold text-stone-900 text-xs">{row.breed}</div>
      ),
    },
    {
      key: 'genotypedCount',
      header: '50K SNP Genotyped',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <span className="font-mono font-bold text-stone-900 text-xs">
            {row.genotypedCount} / {row.totalBulls}
          </span>
          <span className="text-[10px] text-stone-500 block">
            ({Math.round((row.genotypedCount / row.totalBulls) * 100)}%)
          </span>
        </div>
      ),
    },
    {
      key: 'meanInbreedingF',
      header: 'Mean Inbreeding (F)',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right">
          <span
            className={`font-mono font-bold text-xs ${
              row.meanInbreedingF > 6.0 ? 'text-rose-700' : row.meanInbreedingF > 5.0 ? 'text-amber-700' : 'text-emerald-800'
            }`}
          >
            {row.meanInbreedingF}%
          </span>
        </div>
      ),
    },
    {
      key: 'mendelianCleanPct',
      header: 'Mendelian Lineage Match',
      sortable: true,
      align: 'right' as const,
      render: (row: any) => (
        <div className="text-right font-mono font-bold text-stone-900 text-xs">
          {row.mendelianCleanPct}%
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Diversity Tier',
      sortable: true,
      align: 'center' as const,
      render: (row: any) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'EXCELLENT'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : row.status === 'ELEVATED_WATCH'
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
              GENOMIC OVERSIGHT
            </span>
            <span className="text-xs text-stone-600">Standard: WOAH / FAO Animal Genetic Resources</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Genetics & Inbreeding Surveillance
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Surveillance of population inbreeding coefficients ($F$), effective population size ($N_e$), and 50K SNP genotyping campaign.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Genetic Audit</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="GEN-INBREED-F"
          label="National Mean Inbreeding (F)"
          value="4.4%"
          trend="DOWN"
          delta="-0.2% annual"
          domain="DIVERSITY"
          target="< 5.0%"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="GEN-50K-RATE"
          label="50K Genotyped Sires & Donors"
          value="38.6%"
          trend="UP"
          delta="+5.2%"
          domain="COVERAGE"
          target="50.0%"
          coveragePct={38.6}
          status="WATCH"
        />

        <InstitutionalStatCard
          metricCode="GEN-EFFECTIVE-POP"
          label="Effective Population Size (Ne)"
          value="184"
          unit="sires"
          trend="UP"
          delta="+12 Ne"
          domain="DIVERSITY"
          target="> 100"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="GEN-PURITY-INDEX"
          label="Indigenous Germplasm Integrity"
          value="98.2%"
          trend="STABLE"
          delta="Pure nucleus conserved"
          domain="CONSERVATION"
          target="> 95%"
          coveragePct={98.2}
          status="NORMAL"
        />
      </div>

      {/* Population Inbreeding Threshold Guidance */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-stone-900 text-sm flex items-center">
          <Dna className="w-4 h-4 mr-1.5 text-emerald-800" /> Statutory Inbreeding Tolerance Bands (FAO / EAAP Guideline)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900">Green Band (F &lt; 5.0%)</span>
            <p className="text-emerald-800 text-[11px] mt-1">Safe genetic diversity. Inbreeding depression negligible. Normal breeding permits issued.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-900">Amber Watch (5.0% &le; F &lt; 6.25%)</span>
            <p className="text-amber-800 text-[11px] mt-1">Elevated relatedness. Compulsory mating plan verification and sire rotation directive required.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-rose-900">Red Restriction (F &ge; 6.25%)</span>
            <p className="text-rose-800 text-[11px] mt-1">Inbreeding risk alert. Progeny registration blocked without genomic pedigree clearance.</p>
          </div>
        </div>
      </div>

      {/* Genomic Cohort Table */}
      <div>
        <GovernmentDataTable
          title="Genomic Evaluation Cohorts"
          subtitle="Audited breakdown of breeding bull sub-populations, call rates, and Mendelian pedigree integrity."
          columns={columns}
          data={genomicCohorts}
          searchPlaceholder="Filter cohorts by breed or status..."
          searchFields={['breed', 'status']}
        />
      </div>
    </div>
  );
}
