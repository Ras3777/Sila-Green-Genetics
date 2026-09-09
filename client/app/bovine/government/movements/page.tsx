'use client';

import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Filter,
  Check,
  Building2,
  MapPin,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';
import { GovernmentNetworkWorkspace } from '@/components/bovine/government/networks/GovernmentNetworkWorkspace';
import { GovernmentDataTable } from '@/components/bovine/government/tables/GovernmentDataTable';
import { MovementException } from '@/lib/bovine-government-types';
import { ContextualBovineMap } from '@/components/bovine/map/ContextualBovineMap';

export default function MovementTraceabilityPage() {
  const { movementExceptions, resolveMovementException } = useGovernment();

  const [exceptionFilter, setExceptionFilter] = useState<string>('ALL');
  const [workspaceView, setWorkspaceView] = useState<'NETWORK' | 'MAP'>('NETWORK');

  const filteredExceptions = movementExceptions.filter((m: MovementException) => {
    if (exceptionFilter === 'OPEN' && m.resolved) return false;
    if (exceptionFilter === 'RESOLVED' && !m.resolved) return false;
    return true;
  });

  const columns = [
    {
      key: 'id',
      header: 'Incident Code',
      sortable: true,
      render: (row: MovementException) => (
        <div>
          <span className="font-mono font-bold text-stone-900 text-xs">{row.id}</span>
          <div className="text-[10px] text-stone-500 font-mono">Date: {row.occurredAt}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (row: MovementException) => (
        <span
          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            row.severity === 'CRITICAL'
              ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
              : row.severity === 'WARNING'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-stone-100 text-stone-800'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: 'farmOriginName',
      header: 'Route (Origin → Destination)',
      sortable: true,
      render: (row: MovementException) => (
        <div>
          <div className="text-xs font-semibold text-stone-900">
            {row.farmOriginName} → {row.farmDestName || 'Destination Unregistered'}
          </div>
          <div className="text-[10px] text-stone-500">
            Animal: <strong className="font-mono text-stone-700">{row.animalName} ({row.animalIdentifier})</strong>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Regulatory Violation Reason',
      sortable: true,
      render: (row: MovementException) => (
        <div>
          <span className="text-xs font-bold text-rose-900">{row.type.replace(/_/g, ' ')}</span>
          <p className="text-[11px] text-stone-600 mt-0.5">{row.details}</p>
        </div>
      ),
    },
    {
      key: 'resolved',
      header: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (row: MovementException) => (
        <div className="text-center">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              !row.resolved
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {row.resolved ? 'RESOLVED' : 'OPEN'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Intervention',
      align: 'right' as const,
      render: (row: MovementException) => (
        <div className="flex items-center justify-end">
          {!row.resolved ? (
            <button
              onClick={() => resolveMovementException(row.id, 'Dr. Birhanu Kebede (CVO)')}
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Resolve &amp; Clear</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 font-mono">Resolved</span>
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
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              TRACEABILITY COMMAND
            </span>
            <span className="text-xs text-stone-600">Standard: Animal Movement & Traceability Directive</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            Livestock Movement & Transit Traceability Oversight
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Inter-farm shipment permits, transit manifests, unauthorized movement alerts, and biosecurity cordon tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={exceptionFilter}
            onChange={(e) => setExceptionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Exception Statuses</option>
            <option value="OPEN">Unresolved Violations</option>
            <option value="RESOLVED">Cleared / Permitted</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="MOV-TRACE-PASS"
          label="Pre-Movement Permit Compliance"
          value="94.2%"
          trend="UP"
          delta="+1.8%"
          domain="PERMITS"
          target="98.0%"
          coveragePct={94.2}
          status="WATCH"
        />

        <InstitutionalStatCard
          metricCode="MOV-EXCEPTIONS"
          label="Active Transit Exceptions"
          value={movementExceptions.filter((m: MovementException) => !m.resolved).length}
          unit="breaches"
          trend="DOWN"
          delta="-2 resolved"
          domain="ENFORCEMENT"
          status={movementExceptions.filter((m: MovementException) => !m.resolved).length > 0 ? 'WARNING' : 'NORMAL'}
        />

        <InstitutionalStatCard
          metricCode="MOV-TOTAL-SHIPMENTS"
          label="Monthly Livestock Shipments"
          value="142"
          unit="trucks"
          trend="UP"
          delta="+24 transit logs"
          domain="VOLUME"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="MOV-CORDON-BREACH"
          label="Quarantine Cordon Breaches"
          value="0"
          trend="STABLE"
          delta="Zero violations"
          domain="BIOSECURITY"
          target="0"
          status="NORMAL"
        />
      </div>

      {/* Flagship Topological React Flow Movement Network / Geographic GIS Workspace */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Inter-Farm Livestock Traceability & Transit Routing
            </h2>
            <p className="text-[11px] text-stone-500">
              {workspaceView === 'NETWORK'
                ? 'Topological directed acyclic graph • Red edge denotes transit passing quarantined zone'
                : 'Geographic GIS coordinates, origin-destination vector corridors, and surveillance buffers'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setWorkspaceView('NETWORK')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                workspaceView === 'NETWORK'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Topological Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceView('MAP')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                workspaceView === 'MAP'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geographic GIS Map</span>
            </button>
          </div>
        </div>

        {workspaceView === 'NETWORK' ? (
          <GovernmentNetworkWorkspace initialMode="MOVEMENT" height="480px" />
        ) : (
          <ContextualBovineMap
            title="Live Geospatial Livestock Transit Corridors"
            description="Origin-to-destination flow vectors, hauler truck waypoints, and active surveillance buffers"
            presetLayers={{ movements: true, surveillanceBuffers: true, diseaseEvents: true }}
            heightClassName="h-[480px]"
          />
        )}
      </div>

      {/* Movement Exceptions Queue */}
      <div>
        <GovernmentDataTable
          title="Statutory Movement Exceptions & Transit Breaches Queue"
          subtitle="Real-time alerts for unpermitted movements, night departures, and quarantine violations."
          columns={columns}
          data={filteredExceptions}
          searchPlaceholder="Filter exceptions by ID, farm origin, animal, details..."
          searchFields={['id', 'farmOriginName', 'farmDestName', 'animalName', 'animalIdentifier', 'details']}
        />
      </div>
    </div>
  );
}
