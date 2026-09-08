'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';

export interface InstitutionalStatCardProps {
  id?: string;
  metricCode?: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  delta?: string;
  deltaPeriod?: string;
  target?: string | number;
  coveragePct?: number;
  status?: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  domain?: string;
  freshness?: string;
  href?: string;
  subtext?: string;
}

export function InstitutionalStatCard({
  metricCode,
  label,
  value,
  unit,
  trend,
  delta,
  deltaPeriod = 'vs prior period',
  target,
  coveragePct,
  status = 'NORMAL',
  domain,
  freshness = '< 15m lag',
  href,
  subtext,
}: InstitutionalStatCardProps) {
  const { openMetricDefinitionDrawer } = useGovernment();

  const statusConfig = {
    NORMAL: {
      border: 'border-stone-200/90 hover:border-emerald-700/50',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      pillText: 'COMPLIANT',
    },
    WATCH: {
      border: 'border-blue-200/90 hover:border-blue-500',
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      pillText: 'WATCH',
    },
    WARNING: {
      border: 'border-amber-300 hover:border-amber-500',
      badge: 'bg-amber-50 text-amber-900 border-amber-300',
      pillText: 'AT RISK',
    },
    CRITICAL: {
      border: 'border-rose-300 hover:border-rose-600',
      badge: 'bg-rose-50 text-rose-900 border-rose-300',
      pillText: 'CRITICAL',
    },
  }[status];

  return (
    <div
      className={`relative bg-white rounded-2xl border p-4.5 shadow-xs transition-all flex flex-col justify-between ${statusConfig.border}`}
    >
      {/* Top row: Domain, Status, and Info Trigger */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {domain && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 truncate">
              {domain}
            </span>
          )}
          {metricCode && (
            <span className="text-[9px] font-mono font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
              {metricCode}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <span
            className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded-md border ${statusConfig.badge}`}
          >
            {statusConfig.pillText}
          </span>
          {metricCode && (
            <button
              onClick={() => openMetricDefinitionDrawer(metricCode)}
              className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Inspect statutory formula & lineage"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Value */}
      <div className="my-1">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-stone-600">
              {unit}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-stone-700 mt-1 leading-snug">
          {label}
        </p>
      </div>

      {/* Delta, Target, Coverage */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-stone-600">
          {delta ? (
            <div className="flex items-center space-x-1">
              {trend === 'UP' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : trend === 'DOWN' ? (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              ) : null}
              <span
                className={`font-semibold tabular-nums ${
                  trend === 'UP'
                    ? 'text-emerald-800'
                    : trend === 'DOWN'
                    ? 'text-rose-800'
                    : 'text-stone-700'
                }`}
              >
                {delta}
              </span>
              <span className="text-stone-600 text-[10px]">{deltaPeriod}</span>
            </div>
          ) : (
            <span className="text-stone-600 text-[10px]">{subtext || 'Verified statutory metric'}</span>
          )}

          {target !== undefined && (
            <span className="text-[10px] text-stone-600">
              Target: <strong className="text-stone-800 font-semibold">{target}</strong>
            </span>
          )}
        </div>

        {coveragePct !== undefined && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] text-stone-600">
              <span>Coverage:</span>
              <span className="font-bold text-stone-800">{coveragePct}%</span>
            </div>
            <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  coveragePct >= 80 ? 'bg-emerald-600' : coveragePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(coveragePct, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Drilldown Link */}
        {href && (
          <div className="pt-1 flex justify-end">
            <Link
              href={href}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
            >
              <span>Explore Domain</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
