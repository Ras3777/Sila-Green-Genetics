'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  ArrowRightLeft,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';

export default function MatingRecommendationsPage() {
  const { matingRecommendations, updateMatingRecommendation, addAuditEvent } = useBreeding();
  const { session } = useBovine();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACCEPTED' | 'REJECTED' | 'LOCKED'>('ALL');
  const [carrierRiskOnly, setCarrierRiskOnly] = useState(false);

  // Override modal state
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetRecId, setTargetRecId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const filtered = matingRecommendations.filter((rec) => {
    if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;
    if (carrierRiskOnly && !rec.isConditionCarrierRisk) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        rec.femaleName.toLowerCase().includes(q) ||
        (rec.femalePrimaryIdentifier || rec.femaleIdentifier || '').toLowerCase().includes(q) ||
        rec.sireName.toLowerCase().includes(q) ||
        (rec.sirePrimaryIdentifier || rec.sireIdentifier || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenOverride = (recId: string) => {
    setTargetRecId(recId);
    setOverrideReason('');
    setOverrideModalOpen(true);
  };

  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRecId) return;

    const rec = matingRecommendations.find((r) => r.id === targetRecId);
    const nextStatus = rec?.status === 'ACCEPTED' ? 'REJECTED' : 'ACCEPTED';

    updateMatingRecommendation(targetRecId, {
      status: nextStatus as any,
      overrideReason: overrideReason.trim(),
      overrideByUserId: session.userId,
    });

    addAuditEvent({
      actorId: session.userId,
      actorName: session.name,
      action: 'UPDATE_MATING_RECOMMENDATION',
      entityType: 'MatingRecommendation',
      entityId: targetRecId,
      entityDisplay: `${rec?.femaleName} x ${rec?.sireName}`,
      reason: `Technician manual override: ${overrideReason}`,
      source: 'WEB_APPLICATION',
      correlationId: `corr-${Date.now()}`,
    });

    setOverrideModalOpen(false);
    setTargetRecId(null);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/bovine/mating" className="hover:text-stone-800">
              Mating Hub
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Recommendations</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Pairing Recommendations &amp; Risk Interceptions</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Audit individual mating recommendations, verify expected progeny outcomes, and log technician overrides.
          </p>
        </div>

        <button
          onClick={() => {
            const headers = 'FemaleID,FemaleName,SireID,SireName,ExpectedF,ProgenyIndex,CarrierRisk,Status\n';
            const rows = filtered
              .map(
                (r) =>
                  `${r.femalePrimaryIdentifier || r.femaleIdentifier},${r.femaleName},${r.sirePrimaryIdentifier || r.sireIdentifier},${r.sireName},${(((r.expectedInbreedingF ?? r.expectedInbreeding) || 0) * 100).toFixed(2)}%,${r.expectedProgenyIndex || 0},${r.isConditionCarrierRisk || false},${r.status}`
              )
              .join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mating_recommendations.csv';
            a.click();
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-stone-500" />
          <span>Export Filtered Recommendations</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search dam or sire tag/name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center space-x-1.5 text-stone-600">
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="LOCKED">Locked</option>
            </select>
          </div>

          <label className="flex items-center space-x-1.5 text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={carrierRiskOnly}
              onChange={(e) => setCarrierRiskOnly(e.target.checked)}
              className="rounded text-emerald-800"
            />
            <span className="font-semibold text-red-700">Carrier Risks Only</span>
          </label>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Female / Dam</th>
              <th className="p-3.5">Allocated AI Sire</th>
              <th className="p-3.5">Rank</th>
              <th className="p-3.5">Expected Inbreeding</th>
              <th className="p-3.5">Progeny Index</th>
              <th className="p-3.5">Genetic Health QC</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((rec) => {
              const isHighInbreeding = (rec.expectedInbreedingF || 0) > 0.0625;

              return (
                <tr key={rec.id} className="hover:bg-stone-50">
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{rec.femaleName}</div>
                    <div className="text-[11px] font-mono text-stone-500">
                      {rec.femalePrimaryIdentifier}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-emerald-950">{rec.sireName}</div>
                    <div className="text-[11px] font-mono text-stone-500">
                      {rec.sirePrimaryIdentifier}
                    </div>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-stone-700">
                    #{rec.rank}
                  </td>

                  <td className="p-3.5 font-mono font-bold">
                    <span
                      className={
                        isHighInbreeding ? 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded' : 'text-stone-900'
                      }
                    >
                      {((rec.expectedInbreedingF || 0) * 100).toFixed(2)}%
                    </span>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-stone-900">
                    +{rec.expectedProgenyIndex}
                  </td>

                  <td className="p-3.5">
                    {rec.isConditionCarrierRisk ? (
                      <span className="inline-flex items-center space-x-1 text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>CARRIER RISK</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>No Risk</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rec.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'LOCKED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {rec.status}
                    </span>
                    {rec.overrideReason && (
                      <div className="text-[10px] text-stone-400 mt-0.5 max-w-xs truncate" title={rec.overrideReason}>
                        Override: {rec.overrideReason}
                      </div>
                    )}
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenOverride(rec.id)}
                      className="text-emerald-800 hover:text-emerald-700 font-semibold text-xs"
                    >
                      {rec.status === 'ACCEPTED' ? 'Reject...' : 'Accept...'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Override Reason Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Technician Override Reason</h3>
            <p className="text-xs text-stone-600">
              Please enter an operational justification for modifying this mating recommendation. This change will be permanently logged in the audit ledger.
            </p>

            <form onSubmit={handleConfirmOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Justification / Clinical Rationale *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Sire semen unavailable in tank; substituting with alternative pedigree..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg"
                >
                  Confirm &amp; Log Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
