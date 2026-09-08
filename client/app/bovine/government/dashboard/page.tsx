'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  Users2,
  Dna,
  Heart,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentNetworkWorkspace } from '@/components/bovine/government/networks/GovernmentNetworkWorkspace';
import { CrossFarmComplianceMatrix } from '@/components/bovine/government/tables/CrossFarmComplianceMatrix';

export default function GovernmentDashboardPage() {
  const {
    selectedJurisdiction,
    selectedPeriod,
    alerts,
    diseaseEvents,
    movementExceptions,
    complianceFindings,
    kpis,
    openMetricDefinitionDrawer,
  } = useGovernment();

  const { farms, animals } = useBovine();

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE');
  const activeQuarantines = diseaseEvents.filter((d) => d.quarantineActive);

  return (
    <div className="space-y-6">
      {/* Top Banner: Official Mission & Active Scope */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-stone-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-700/80 text-emerald-100 font-mono font-bold text-[10px] tracking-wider uppercase">
                Institutional Regulatory Command
              </span>
              <span className="text-emerald-200 text-xs">
                Territory: {selectedJurisdiction?.name} ({selectedJurisdiction?.level})
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1.5">
              Livestock Intelligence & Statutory Oversight Center
            </h1>
            <p className="text-xs text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Official Ministry of Agriculture regulatory command monitoring national herd inventory, 50K genomic integrity, biosecurity cordons, and inter-farm movement traceability.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <Link
              href="/bovine/government/reports"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Statutory Reports</span>
            </Link>
            <Link
              href="/bovine/government/health"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Active Biosurveillance</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Outbreak / Biosurveillance Alert Banner if any */}
      {criticalAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-rose-600 text-white">
                  CRITICAL SURVEILLANCE DIRECTIVE
                </span>
                <span className="text-xs text-rose-800 font-semibold">
                  {criticalAlerts.length} Active High-Severity Incident(s)
                </span>
              </div>
              <h3 className="text-sm font-bold text-rose-950 mt-1">
                {criticalAlerts[0].title}
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                {criticalAlerts[0].description} • Jurisdiction: {criticalAlerts[0].jurisdictionName}
              </p>
            </div>
          </div>
          <Link
            href="/bovine/government/health"
            className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs flex items-center space-x-1"
          >
            <span>Quarantine Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 8 Flagship Institutional KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Statutory Key Performance Indicators ({selectedPeriod?.label || 'Active Period'})
          </h2>
          <span className="text-[11px] text-stone-600">
            Click (i) on any card for statutory formula, lineage & SLA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <InstitutionalStatCard
            metricCode="POP-REG-TOTAL"
            label="Total Registered Cattle"
            value={selectedJurisdiction?.registeredAnimals.toLocaleString() || '142,260'}
            unit="head"
            trend="UP"
            delta="+4.0%"
            domain="POPULATION"
            target="150,000"
            coveragePct={98.2}
            status="NORMAL"
            href="/bovine/government/population"
          />

          <InstitutionalStatCard
            metricCode="GEN-50K-RATE"
            label="50K Genotyping Coverage"
            value="38.6%"
            trend="UP"
            delta="+5.2%"
            domain="GENOMICS"
            target="50.0%"
            coveragePct={38.6}
            status="WATCH"
            href="/bovine/government/genetics"
          />

          <InstitutionalStatCard
            metricCode="GEN-INBREED-F"
            label="Mean Pedigree Inbreeding (F)"
            value="4.4%"
            trend="DOWN"
            delta="-0.2%"
            domain="GENETICS"
            target="< 5.0%"
            coveragePct={92.0}
            status="NORMAL"
            href="/bovine/government/genetics"
          />

          <InstitutionalStatCard
            metricCode="REP-PREG-RATE"
            label="National Conception Rate"
            value="68.0%"
            trend="UP"
            delta="+2.4%"
            domain="REPRODUCTION"
            target="70.0%"
            coveragePct={86.4}
            status="NORMAL"
            href="/bovine/government/reproduction"
          />

          <InstitutionalStatCard
            metricCode="HEALTH-QZONES"
            label="Active Quarantine Zones"
            value={activeQuarantines.length}
            unit="zones"
            trend={activeQuarantines.length > 0 ? 'UP' : 'STABLE'}
            delta={activeQuarantines.length > 0 ? '+1 active' : 'Zero'}
            domain="HEALTH"
            target="0"
            status={activeQuarantines.length > 0 ? 'CRITICAL' : 'NORMAL'}
            href="/bovine/government/health"
          />

          <InstitutionalStatCard
            metricCode="MOV-TRACE-PASS"
            label="Pre-Movement Permit Compliance"
            value="94.2%"
            trend="UP"
            delta="+1.8%"
            domain="TRACEABILITY"
            target="98.0%"
            coveragePct={94.2}
            status="WATCH"
            href="/bovine/government/movements"
          />

          <InstitutionalStatCard
            metricCode="COMPLIANCE_PASS_RATE"
            label="Cross-Farm Audit Pass Rate"
            value="89.1%"
            trend="UP"
            delta="+3.1%"
            domain="COMPLIANCE"
            target="90.0%"
            coveragePct={91.0}
            status="WATCH"
            href="/bovine/government/compliance"
          />

          <InstitutionalStatCard
            metricCode="FARMS-REPORTING"
            label="Participating Commercial Farms"
            value={selectedJurisdiction?.reportingFarms || farms.length}
            unit="farms"
            trend="UP"
            delta="+12 new"
            domain="OPERATIONS"
            target="60"
            coveragePct={96.0}
            status="NORMAL"
            href="/bovine/government/farms"
          />
        </div>
      </div>

      {/* Flagship Topological Network Workspace */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Interactive Institutional Network Topology
          </h2>
          <span className="text-[11px] text-stone-600">
            Select node for detail profile • Switch views between Movements, Contacts, and Evidence
          </span>
        </div>
        <GovernmentNetworkWorkspace initialMode="MOVEMENT" height="520px" />
      </div>

      {/* Cross-Farm 6-Pillar Compliance Audit Scorecard */}
      <div>
        <CrossFarmComplianceMatrix />
      </div>

      {/* Quick Access Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/bovine/government/animals"
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
              National Animal Registry
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Trace livestock by RFID, ear tags, breed pedigree, and identify parentage anomalies.
            </p>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-800 flex items-center space-x-1">
            <span>Explore Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/bovine/government/investigations"
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-indigo-600 shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-indigo-800 transition-colors">
              Regulatory Investigations
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Manage case dockets, evidence graphs, hearings, and sanctions for pedigree/permit fraud.
            </p>
          </div>
          <div className="mt-3 text-xs font-semibold text-indigo-800 flex items-center space-x-1">
            <span>Open Case Dockets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/bovine/government/programs"
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
              National Campaigns
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              National AI expansion, 50K genotyping initiative, and indigenous Boran conservation.
            </p>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-800 flex items-center space-x-1">
            <span>Review Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/bovine/government/reports"
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-900 shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold mb-2">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-stone-950 transition-colors">
              Statutory Reporting & Export
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Certified WOAH dossiers, census balance sheets, and custom Excel/CSV extracts.
            </p>
          </div>
          <div className="mt-3 text-xs font-semibold text-stone-800 flex items-center space-x-1">
            <span>Access Dossiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
