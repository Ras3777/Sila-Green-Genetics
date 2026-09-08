'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Activity,
  Layers,
} from 'lucide-react';

export default function AuditGovernancePage() {
  const { auditEvents } = useBreeding();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = auditEvents.filter((a) => {
    if (actionFilter !== 'ALL' && a.action !== actionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.action.toLowerCase().includes(q) ||
        a.actorName.toLowerCase().includes(q) ||
        a.entityType.toLowerCase().includes(q) ||
        (a.entityDisplay && a.entityDisplay.toLowerCase().includes(q)) ||
        (a.reason && a.reason.toLowerCase().includes(q)) ||
        (a.correlationId && a.correlationId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const actions = Array.from(new Set(auditEvents.map((a) => a.action)));

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Immutable Ledger &amp; Traceability • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Governance &amp; Audit Trail</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Cryptographically timestamped record of all program modifications, index updates, clinical overrides, and germplasm dispensations.
          </p>
        </div>

        <button
          onClick={() => {
            const headers = 'Timestamp,ActorID,ActorName,Action,EntityType,EntityID,EntityDisplay,Reason,CorrelationID\n';
            const rows = filtered
              .map(
                (a) =>
                  `"${a.occurredAt}","${a.actorId}","${a.actorName}","${a.action}","${a.entityType}","${a.entityId}","${(a.entityDisplay || '').replace(/"/g, '""')}","${(a.reason || '').replace(/"/g, '""')}","${a.correlationId || ''}"`
              )
              .join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-stone-500" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, reason, entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <span className="font-medium">Action Filter:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono text-[11px]"
          >
            <option value="ALL">All Actions ({auditEvents.length})</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Actor</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Target Entity</th>
              <th className="p-3.5">Operational Reason &amp; Clinical Diff</th>
              <th className="p-3.5 font-mono">Correlation ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-mono text-stone-500 whitespace-nowrap text-[11px]">
                  {new Date(item.occurredAt).toLocaleString()}
                </td>

                <td className="p-3.5">
                  <div className="font-bold text-stone-900">{item.actorName}</div>
                  <div className="text-[10px] text-stone-400 font-mono">{item.actorId}</div>
                </td>

                <td className="p-3.5">
                  <span
                    className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${
                      item.action.startsWith('CREATE')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.action.startsWith('UPDATE') || item.action.includes('OVERRIDE')
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {item.action}
                  </span>
                </td>

                <td className="p-3.5">
                  <div className="font-semibold text-stone-900">{item.entityDisplay}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {item.entityType} #{item.entityId}
                  </div>
                </td>

                <td className="p-3.5 text-stone-700 leading-relaxed max-w-md">
                  {item.reason}
                </td>

                <td className="p-3.5 font-mono text-[10px] text-stone-400 whitespace-nowrap">
                  {item.correlationId || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
