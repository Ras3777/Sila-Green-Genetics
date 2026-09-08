'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  Unlock,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { DiseaseEvent, QuarantineRecord } from '@/lib/bovine-government-types';

export default function EpidemiologicalBiosurveillancePage() {
  const {
    diseaseEvents,
    quarantines,
    vaccinationRecords,
    liftQuarantine,
    openMetricDefinitionDrawer,
  } = useGovernment();

  const [diseaseFilter, setDiseaseFilter] = useState<string>('ALL');

  const filteredEvents = diseaseEvents.filter((d: DiseaseEvent) => {
    if (diseaseFilter !== 'ALL' && d.confirmedStatus !== diseaseFilter) return false;
    return true;
  });

  const activeQuarantines = quarantines.filter((q: QuarantineRecord) => q.status === 'ACTIVE');

  const eventColumns = [
    {
      key: 'code',
      header: 'Outbreak Event Code',
      sortable: true,
      render: (row: DiseaseEvent) => (
        <div>
          <div className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
            <span>{row.code}</span>
            {row.quarantineActive && (
              <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold uppercase animate-pulse">
                Q-ZONE
              </span>
            )}
          </div>
          <div className="text-[10px] text-stone-500 font-mono">
            WOAH Code: {row.diseaseCode}
          </div>
        </div>
      ),
    },
    {
      key: 'diseaseName',
      header: 'Pathogen / Disease',
      sortable: true,
      render: (row: DiseaseEvent) => (
        <div>
          <div className="font-bold text-rose-950 text-xs">{row.diseaseName}</div>
          <div className="text-[10px] text-stone-600">
            Confirmed: <strong className="font-mono text-stone-800">{row.confirmedStatus}</strong>
          </div>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Focal Farm & Location',
      sortable: true,
      render: (row: DiseaseEvent) => (
        <div>
          <div className="text-xs font-medium text-stone-900">{row.farmName}</div>
          <div className="text-[10px] text-stone-600">
            {row.districtName}, {row.regionName}
          </div>
        </div>
      ),
    },
    {
      key: 'animalsAffected',
      header: 'Infected / Susceptible',
      sortable: true,
      align: 'right' as const,
      render: (row: DiseaseEvent) => (
        <div className="text-right">
          <span className="font-mono font-bold text-rose-700 text-xs">
            {row.animalsAffected} head
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Statutory Actions',
      align: 'right' as const,
      render: (row: DiseaseEvent) => (
        <Link
          href="/bovine/government/movements"
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-semibold text-xs transition-colors"
        >
          <span>Trace Contacts</span>
        </Link>
      ),
    },
  ];

  const quarantineColumns = [
    {
      key: 'id',
      header: 'Quarantine Order #',
      sortable: true,
      render: (row: QuarantineRecord) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.id}</span>
          <div className="text-[10px] text-stone-500 font-mono">Reason: {row.reason}</div>
        </div>
      ),
    },
    {
      key: 'farmName',
      header: 'Cordon Sanitaire Location',
      sortable: true,
      render: (row: QuarantineRecord) => (
        <div>
          <div className="font-medium text-stone-900 text-xs">{row.farmName}</div>
          <div className="text-[10px] text-stone-600">Region: {row.regionName} • Blocked Movements: {row.movementsBlocked}</div>
        </div>
      ),
    },
    {
      key: 'startedAt',
      header: 'Effective Dates',
      sortable: true,
      render: (row: QuarantineRecord) => (
        <div className="text-xs text-stone-800">
          <div>From: <strong className="font-mono">{row.startedAt}</strong></div>
          <div className="text-[10px] text-stone-500 font-mono">Until: {row.expectedEndAt || 'Indefinite'}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Enforcement Status',
      sortable: true,
      align: 'center' as const,
      render: (row: QuarantineRecord) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.status === 'ACTIVE'
                ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                : 'bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Official Actions',
      align: 'right' as const,
      render: (row: QuarantineRecord) => (
        <div className="flex items-center justify-end">
          {row.status === 'ACTIVE' ? (
            <button
              onClick={() => liftQuarantine(row.id)}
              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Lift Cordon</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 italic">Discharged</span>
          )}
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
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-mono font-bold text-[10px]">
              EPIDEMIOLOGICAL SURVEILLANCE
            </span>
            <span className="text-xs text-stone-600">Standard: WOAH Terrestrial Animal Health Code</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            National Biosurveillance, Disease Events & Quarantine Orders
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Active disease outbreaks, cordon sanitaires, laboratory confirmations, and ring vaccination surveillance.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export WOAH Report</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="HEALTH-EVENTS"
          label="Active Disease Incidents"
          value={diseaseEvents.length}
          unit="outbreaks"
          trend={diseaseEvents.length > 0 ? 'UP' : 'STABLE'}
          delta="3 confirmed, 1 suspect"
          domain="EPIDEMIOLOGY"
          status={diseaseEvents.length > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="HEALTH-QZONES"
          label="Active Quarantine Cordons"
          value={activeQuarantines.length}
          unit="cordons"
          trend={activeQuarantines.length > 0 ? 'UP' : 'STABLE'}
          delta="10km zone enforced"
          domain="BIOSECURITY"
          status={activeQuarantines.length > 0 ? 'CRITICAL' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="HEALTH-RING-VAX"
          label="Ring Vaccination Coverage"
          value="94.2%"
          trend="UP"
          delta="+8.4% this week"
          domain="PREVENTION"
          target="> 90%"
          coveragePct={94.2}
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="HEALTH-LAB-CONFIRM"
          label="Median Lab Confirmation Time"
          value="18.4 hrs"
          trend="DOWN"
          delta="-4.2 hrs faster"
          domain="DIAGNOSTICS"
          target="< 24 hrs"
          status="NORMAL"
        />
      </div>

      {/* Active Disease Events Table */}
      <div>
        <GovernmentDataTable
          title="Notifiable Disease Outbreak Registry"
          subtitle="Real-time surveillance of reported Foot and Mouth Disease, CBPP, Lumpy Skin Disease, and Brucellosis events."
          columns={eventColumns}
          data={filteredEvents}
          searchPlaceholder="Search disease events by code, disease, farm, region..."
          searchFields={['code', 'diseaseName', 'farmName', 'regionName', 'districtName']}
        />
      </div>

      {/* Quarantine Bays & Cordons Table */}
      <div>
        <GovernmentDataTable
          title="Official Quarantine Orders & Movement Restrictions"
          subtitle="Legal restriction orders served under the Animal Disease Control Proclamation."
          columns={quarantineColumns}
          data={quarantines}
          searchPlaceholder="Search quarantine orders by code, farm..."
          searchFields={['code', 'farmName', 'quarantineType']}
        />
      </div>
    </div>
  );
}
