'use client';

import React from 'react';
import { IntegritySignal } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface IntegrityReviewQueueProps {
  signals: IntegritySignal[];
  onOpenCase?: (caseId: string) => void;
}

export function IntegrityReviewQueue({ signals, onOpenCase }: IntegrityReviewQueueProps) {
  const { openInvestigationFromSignal } = useBovineTrust();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="font-bold text-stone-900 text-sm flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Integrity Review &amp; Anomaly Queue</span>
          </h3>
          <p className="text-xs text-stone-500">
            Automated signals for hash discrepancies, unlisted document attempts, and scanned revoked credentials.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-mono font-bold text-xs">
          {signals.filter((s) => s.status !== 'RESOLVED').length} Active Alerts
        </span>
      </div>

      <div className="space-y-3">
        {signals.map((sig) => {
          const handleInvestigate = () => {
            const caseId = openInvestigationFromSignal(sig.id);
            if (onOpenCase) onOpenCase(caseId);
          };

          return (
            <div
              key={sig.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                sig.severity === 'CRITICAL'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : sig.severity === 'WARNING'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      sig.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : sig.severity === 'WARNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-600 text-white'
                    }`}
                  >
                    {sig.severity}
                  </span>
                  <span className="font-bold text-xs">{sig.title}</span>
                  {sig.certificateId && (
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-stone-200">
                      {sig.certificateId}
                    </span>
                  )}
                </div>

                <p className="text-xs opacity-90">{sig.description}</p>
                <div className="text-[10px] font-mono opacity-70">
                  Detected: {new Date(sig.occurredAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {sig.status === 'INVESTIGATING' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs">
                    Docket: {sig.investigationCaseId || 'OPEN'}
                  </span>
                ) : sig.status === 'RESOLVED' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-bold text-xs flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolved</span>
                  </span>
                ) : (
                  <button
                    onClick={handleInvestigate}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Open Case Docket</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
