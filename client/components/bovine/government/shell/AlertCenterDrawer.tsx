'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Check,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalAlert } from '@/lib/bovine-government-types';

export function AlertCenterDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { alerts, acknowledgeAlert } = useGovernment();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'WATCH' | 'INFO'>('ALL');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a: InstitutionalAlert) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const unacknowledgedCount = alerts.filter((a: InstitutionalAlert) => a.status === 'ACTIVE').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-stone-50/80 flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Biosurveillance & Regulatory Alerts
                </h3>
                <p className="text-xs text-stone-600">
                  {unacknowledgedCount} unacknowledged active signals
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Severity Filter Tabs */}
          <div className="px-5 py-2.5 border-b border-stone-100 bg-white flex items-center space-x-2 text-xs overflow-x-auto">
            <span className="text-stone-600 font-medium text-[11px] mr-1">Severity:</span>
            {(['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer shrink-0 ${
                  filterSeverity === sev
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-stone-600">
                <CheckCheck className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-80" />
                <p className="font-semibold text-stone-800">No active alerts matching filter</p>
                <p className="text-xs mt-1">All regulatory and biosurveillance signals are clear.</p>
              </div>
            ) : (
              filteredAlerts.map((alert: InstitutionalAlert) => {
                const isCrit = alert.severity === 'CRITICAL';
                const isWarn = alert.severity === 'WARNING';
                const isAck = alert.status === 'ACKNOWLEDGED' || alert.status === 'DISMISSED';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isAck
                        ? 'bg-stone-50/60 border-stone-200 opacity-70'
                        : isCrit
                        ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                        : isWarn
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                            isCrit
                              ? 'bg-rose-600 text-white'
                              : isWarn
                              ? 'bg-amber-500 text-white'
                              : 'bg-stone-600 text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-stone-600 font-mono">
                          {alert.detectedAt}
                        </span>
                      </div>
                      {!isAck ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer shadow-xs"
                          title="Acknowledge alert as logged"
                        >
                          <Check className="w-3 h-3" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-800 font-semibold flex items-center">
                          <Check className="w-3 h-3 mr-0.5" /> Acknowledged
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-stone-900 text-xs mt-2">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="mt-2 text-[10px] text-stone-600">
                      Scope: <strong className="text-stone-800">{alert.jurisdictionName}</strong> • Rule: {alert.triggerRule}
                    </div>

                    {alert.linkRoute && (
                      <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex justify-end">
                        <Link
                          href={alert.linkRoute}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
                        >
                          <span>Open Incident / Entity</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">
              National Biosurveillance Event Stream
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
