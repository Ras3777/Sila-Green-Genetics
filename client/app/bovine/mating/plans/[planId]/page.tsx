'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Download,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function MatingPlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const resolvedParams = use(params);
  const { planId } = resolvedParams;

  const { matingPlans, matingRecommendations, updateMatingRecommendation, updateMatingPlan } = useBreeding();
  const plan = matingPlans.find((p) => p.id === planId);

  const [overrideModalRecId, setOverrideModalRecId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  if (!plan) {
    return (
      <div className="p-8 text-center text-stone-500">
        <h2 className="text-lg font-bold text-stone-900">Mating Plan Not Found</h2>
        <Link href="/bovine/mating/plans" className="text-emerald-800 text-xs font-semibold mt-2 inline-block">
          Return to Plans
        </Link>
      </div>
    );
  }

  const recommendations = matingRecommendations.filter((r) => r.matingPlanId === plan.id);

  const handleToggleAccept = (recId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACCEPTED' ? 'REJECTED' : 'ACCEPTED';
    updateMatingRecommendation(recId, { status: nextStatus as any });
  };

  const handleToggleLock = (recId: string, isLocked: boolean) => {
    updateMatingRecommendation(recId, { status: isLocked ? 'ACCEPTED' : 'LOCKED' });
  };

  const handleApprovePlan = () => {
    updateMatingPlan(plan.id, { status: 'APPROVED' });
  };

  const avgInbreeding = +(
    recommendations.reduce((acc, r) => acc + (r.expectedInbreedingF || 0), 0) /
    (recommendations.length || 1)
  ).toFixed(3);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/bovine/mating/plans"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Plans List</span>
        </Link>
      </div>

      {/* Plan Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {plan.code}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  plan.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {plan.status}
              </span>
              <span className="text-xs text-stone-500">• Season: {plan.season}</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">{plan.name}</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Facility: {plan.farmName} &bull; Herd: {plan.herdName} &bull; Max Inbreeding Ceiling: {plan.maxInbreedingThreshold}% F
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const headers = 'FemaleID,FemaleName,SireID,SireName,Rank,ExpectedF,ProgenyIndex,Status\n';
                const rows = recommendations
                  .map(
                    (r) =>
                      `${r.femalePrimaryIdentifier || r.femaleIdentifier},${r.femaleName},${r.sirePrimaryIdentifier || r.sireIdentifier},${r.sireName},${r.rank},${(((r.expectedInbreedingF ?? r.expectedInbreeding) || 0) * 100).toFixed(2)}%,${r.expectedProgenyIndex || 0},${r.status}`
                  )
                  .join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `mating_dispatch_${plan.code}.csv`;
                link.click();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export Dispatch Sheet</span>
            </button>

            {plan.status !== 'APPROVED' && (
              <button
                onClick={handleApprovePlan}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve &amp; Dispatch Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Allocations</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {plan.femaleCount} Females &times; {plan.sireCount} Sires
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Average Expected Inbreeding</div>
            <div className="text-base font-bold text-emerald-800 mt-0.5">
              {(Number(avgInbreeding) * 100).toFixed(2)}% F
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Carrier Exclusion</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {plan.carrierExclusion ? 'Active (Strict)' : 'Off'}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <div className="text-stone-500 text-[10px] uppercase font-semibold">Technician Accepted</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {recommendations.filter((r) => r.status === 'ACCEPTED').length} / {recommendations.length}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Pairing Allocation Recommendations ({recommendations.length})
          </h2>
          <span className="text-xs text-stone-500">Ranked by Progeny Index &amp; Genetic Safety</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3.5">Female / Dam</th>
                <th className="p-3.5">Recommended AI Sire</th>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Expected Inbreeding</th>
                <th className="p-3.5">Progeny Index</th>
                <th className="p-3.5">Condition Risk</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recommendations.map((rec) => {
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

                    <td className="p-3.5">
                      <span className="font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono">
                        #{rec.rank} Choice
                      </span>
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
                          <span>Clear</span>
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
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleAccept(rec.id, rec.status)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          rec.status === 'ACCEPTED'
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {rec.status === 'ACCEPTED' ? 'Reject' : 'Accept'}
                      </button>

                      <button
                        onClick={() => handleToggleLock(rec.id, rec.status === 'LOCKED')}
                        title={rec.status === 'LOCKED' ? 'Unlock recommendation' : 'Lock recommendation'}
                        className="p-1 text-stone-400 hover:text-stone-800"
                      >
                        {rec.status === 'LOCKED' ? (
                          <Lock className="w-3.5 h-3.5 text-blue-700" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
