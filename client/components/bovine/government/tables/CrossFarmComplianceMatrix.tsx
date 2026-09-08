'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { Farm } from '@/lib/bovine-types';
import { ComplianceFinding, ComplianceAudit } from '@/lib/bovine-government-types';

interface FarmPillarData {
  farm: Farm;
  riskScore: number;
  riskTier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  critFindings: number;
  majorFindings: number;
  pillars: {
    identification: number;
    health: number;
    movement: number;
    genetics: number;
    biosecurity: number;
    reporting: number;
  };
}

export function CrossFarmComplianceMatrix() {
  const { complianceAudits, complianceFindings, openMetricDefinitionDrawer } = useGovernment();
  const { farms } = useBovine();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  // Compute 6 pillars per farm
  const farmPillars: FarmPillarData[] = farms.map((farm: Farm) => {
    const farmFindings = complianceFindings.filter((f: ComplianceFinding) => f.farmId === farm.id && f.status === 'OPEN');
    const critFindings = farmFindings.filter((f: ComplianceFinding) => f.severity === 'CRITICAL').length;
    const majorFindings = farmFindings.filter((f: ComplianceFinding) => f.severity === 'MAJOR').length;

    // Explainable risk score calculation
    const baseScore = Math.max(0, Math.min(100, 100 - (critFindings * 25 + majorFindings * 10)));
    const riskScore = 100 - baseScore;

    const riskTier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' =
      riskScore >= 40 ? 'HIGH_RISK' : riskScore >= 20 ? 'MEDIUM_RISK' : 'LOW_RISK';

    // 6 pillar compliance scores %
    const p1Identification = Math.min(100, Math.max(60, 98 - critFindings * 15));
    const p2Health = farm.code === 'FARM-ET-003' ? 55 : 92;
    const p3Movement = farm.code === 'FARM-ET-003' ? 62 : 95;
    const p4Genetics = farm.type === 'COMMERCIAL' ? 78 : 96;
    const p5Biosecurity = farm.code === 'FARM-ET-003' ? 52 : 94;
    const p6Reporting = 91;

    return {
      farm,
      riskScore,
      riskTier,
      critFindings,
      majorFindings,
      pillars: {
        identification: p1Identification,
        health: p2Health,
        movement: p3Movement,
        genetics: p4Genetics,
        biosecurity: p5Biosecurity,
        reporting: p6Reporting,
      },
    };
  });

  const filtered = farmPillars.filter((item: FarmPillarData) => {
    if (filterTier !== 'ALL' && item.riskTier !== filterTier) return false;
    const q = searchQuery.toLowerCase();
    return (
      item.farm.name.toLowerCase().includes(q) ||
      item.farm.code.toLowerCase().includes(q) ||
      item.farm.region.toLowerCase().includes(q)
    );
  });

  const getPillarBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (score >= 75) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (score >= 60) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header controls */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-stone-900 text-sm">
              Cross-Farm Regulatory Compliance Matrix (6 Statutory Pillars)
            </h3>
            <button
              onClick={() => openMetricDefinitionDrawer('COMPLIANCE_PASS_RATE')}
              className="p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
              title="Inspect Compliance Metric Definition"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            Audit scorecards evaluated across National Identification, Biosurveillance, Movement, and Biosecurity standards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-600" />
            <input
              type="text"
              placeholder="Search farm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 placeholder:text-stone-600 outline-none w-44"
            />
          </div>

          {/* Tier filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-800 outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW_RISK">Low Risk</option>
            <option value="MEDIUM_RISK">Medium Risk</option>
            <option value="HIGH_RISK">High Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100/80 text-[10px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
            <tr>
              <th className="py-3 px-4">Farm Entity</th>
              <th className="py-3 px-3">Risk Tier & Score</th>
              <th className="py-3 px-3 text-center">P1: Identification</th>
              <th className="py-3 px-3 text-center">P2: Health & Vax</th>
              <th className="py-3 px-3 text-center">P3: Traceability</th>
              <th className="py-3 px-3 text-center">P4: Genetics</th>
              <th className="py-3 px-3 text-center">P5: Biosecurity</th>
              <th className="py-3 px-3 text-center">P6: Reporting</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(({ farm, riskScore, riskTier, critFindings, pillars }: FarmPillarData) => {
              return (
                <tr key={farm.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{farm.name}</div>
                    <div className="text-[11px] text-stone-600 font-mono">
                      {farm.code} • {farm.region}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          riskTier === 'HIGH_RISK'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : riskTier === 'MEDIUM_RISK'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {riskTier === 'HIGH_RISK' ? 'HIGH RISK' : riskTier === 'MEDIUM_RISK' ? 'MED RISK' : 'LOW RISK'}
                      </span>
                      <span className="font-mono text-stone-700 font-semibold text-xs">
                        {riskScore}
                      </span>
                    </div>
                    {critFindings > 0 && (
                      <span className="text-[10px] text-rose-700 font-semibold block mt-0.5">
                        +{critFindings * 25} (Critical Audit Finding)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.identification)}`}>
                      {pillars.identification}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.health)}`}>
                      {pillars.health}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.movement)}`}>
                      {pillars.movement}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.genetics)}`}>
                      {pillars.genetics}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.biosecurity)}`}>
                      {pillars.biosecurity}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getPillarBadge(pillars.reporting)}`}>
                      {pillars.reporting}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/bovine/government/farms/${farm.id}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                    >
                      <span>Oversight Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/50 flex items-center justify-between text-[11px] text-stone-600">
        <span>Displaying {filtered.length} registered farm operations</span>
        <span>Green &ge;90% | Blue 75-89% | Amber 60-74% | Rose &lt;60%</span>
      </div>
    </div>
  );
}
