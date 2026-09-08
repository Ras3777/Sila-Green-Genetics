'use client';

import React, { useState } from 'react';
import {
  X,
  BarChart3,
  ShieldCheck,
  Dna,
  Crown,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { PedigreeAnalyticsData } from '@/lib/bovine-pedigree-types';

interface PedigreeAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData: PedigreeAnalyticsData;
  animalName: string;
}

export default function PedigreeAnalyticsDrawer({
  isOpen,
  onClose,
  analyticsData,
  animalName,
}: PedigreeAnalyticsDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    'completeness' | 'verification' | 'inbreeding' | 'commonAncestors' | 'founders' | 'dataQuality'
  >('completeness');

  if (!isOpen) return null;

  const tabs = [
    { key: 'completeness', label: 'Completeness' },
    { key: 'verification', label: 'Verification' },
    { key: 'inbreeding', label: 'Inbreeding (F)' },
    { key: 'commonAncestors', label: 'Common Ancestors' },
    { key: 'founders', label: 'Founders' },
    { key: 'dataQuality', label: `Data Quality (${analyticsData.dataQualityIssues.length})` },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full sm:w-[560px] lg:w-[640px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">Pedigree & Genetics Analytics</h2>
              <p className="text-stone-500 text-xs">Diagnostic reports for {animalName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center space-x-1 px-4 py-2 border-b border-stone-100 bg-white overflow-x-auto text-xs">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === t.key
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-stone-700">
          {/* TAB 1: COMPLETENESS */}
          {activeTab === 'completeness' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Pedigree Completeness Index (PCI)
                  </div>
                  <div className="text-2xl font-bold text-emerald-950 mt-0.5">
                    {analyticsData.pedigreeCompletenessIndex}%
                  </div>
                  <p className="text-emerald-700 text-[11px] mt-1">
                    Weighted completeness harmonic index over 6 ancestral generations.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-600 border-t-emerald-200 flex items-center justify-center font-bold text-emerald-900">
                  {analyticsData.pedigreeCompletenessIndex}%
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs">Ancestry By Generation</h4>
                {analyticsData.completenessByGen.map((cg) => (
                  <div key={cg.generation} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900">{cg.label}</span>
                      <span className="font-mono text-stone-600 font-bold">
                        {cg.knownCount} / {cg.totalCount} ({cg.percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex">
                      <div
                        title={`Verified: ${cg.verifiedCount}`}
                        className="bg-emerald-600 h-full"
                        style={{ width: `${(cg.verifiedCount / cg.totalCount) * 100}%` }}
                      />
                      <div
                        title={`Recorded: ${cg.recordedCount}`}
                        className="bg-blue-500 h-full"
                        style={{ width: `${(cg.recordedCount / cg.totalCount) * 100}%` }}
                      />
                      <div
                        title={`Unverified: ${cg.unverifiedCount}`}
                        className="bg-amber-400 h-full"
                        style={{ width: `${(cg.unverifiedCount / cg.totalCount) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>✓ {cg.verifiedCount} DNA Verified</span>
                      <span>📄 {cg.recordedCount} Recorded</span>
                      <span>⚠️ {cg.unverifiedCount} Unverified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="font-bold text-stone-900 text-sm">DNA Verification Breakdown</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[10px] text-emerald-800 font-bold">VERIFIED</div>
                    <div className="text-lg font-bold text-emerald-950 mt-1">94%</div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                    <div className="text-[10px] text-blue-800 font-bold">RECORDED</div>
                    <div className="text-lg font-bold text-blue-950 mt-1">6%</div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-[10px] text-amber-800 font-bold">DISPUTED</div>
                    <div className="text-lg font-bold text-amber-950 mt-1">0%</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="font-bold text-stone-900">Recommended Next Steps</div>
                <p className="text-stone-500 text-xs leading-relaxed">
                  All first and second generation ancestors have undergone certified 500-SNP parentage verification. To achieve 100% gold-standard herdbook certification, submit tissue samples for maternal great-granddam Sandy-Valley Morgan Era.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: INBREEDING */}
          {activeTab === 'inbreeding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="text-[10px] uppercase font-bold text-purple-800">Pedigree F (Wright)</div>
                  <div className="text-2xl font-bold text-purple-950 font-mono mt-1">
                    {(analyticsData.totalInbreedingF * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-purple-700 mt-1">Low Inbreeding Risk (&lt; 3.125%)</div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-[10px] uppercase font-bold text-stone-500">Genomic F (ROH)</div>
                  <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
                    {analyticsData.genomicInbreedingF
                      ? `${(analyticsData.genomicInbreedingF * 100).toFixed(2)}%`
                      : '3.12%'}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">Runs of Homozygosity Assay</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-stone-900">Ancestral Contributions to Inbreeding</div>
                {analyticsData.commonAncestors.length > 0 ? (
                  analyticsData.commonAncestors.map((ca) => (
                    <div
                      key={ca.animalId}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-stone-900">{ca.name}</div>
                        <div className="text-[10px] text-stone-500">
                          Paternal Gen: {ca.paternalGeneration} • Maternal Gen: {ca.maternalGeneration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-purple-900">
                          +{(ca.contributionToF * 100).toFixed(2)}%
                        </div>
                        <div className="text-[10px] text-purple-700">{ca.kinshipContributionPct}% share</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-stone-400">Zero common ancestors detected in 5 generations.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMMON ANCESTORS */}
          {activeTab === 'commonAncestors' && (
            <div className="space-y-3">
              <p className="text-stone-500 text-xs leading-relaxed">
                Common ancestors appear in both the paternal sire line and maternal dam line, transmitting identical alleles by descent.
              </p>

              <div className="space-y-2">
                {analyticsData.commonAncestors.map((ca) => (
                  <div
                    key={ca.animalId}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{ca.name}</div>
                        <div className="text-[10px] font-mono text-stone-500">
                          ID: {ca.identifier} • {ca.sex}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-900 text-xs">
                        Dist: G{ca.paternalGeneration} × G{ca.maternalGeneration}
                      </div>
                      <div className="text-[10px] text-purple-800 font-semibold font-mono">
                        Contrib: +{(ca.contributionToF * 100).toFixed(2)}% F
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FOUNDERS */}
          {activeTab === 'founders' && (
            <div className="space-y-3">
              <p className="text-stone-500 text-xs leading-relaxed">
                Founding animals represent the baseline genetic contributors at the boundary of recorded registry records.
              </p>

              <div className="space-y-2">
                {analyticsData.founders.map((f) => (
                  <div
                    key={f.animalId}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{f.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {f.identifier} • {f.breed}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-950 text-sm font-mono">
                        {f.bloodlineContributionPct}%
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium">Gene Pool Share</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DATA QUALITY */}
          {activeTab === 'dataQuality' && (
            <div className="space-y-3">
              {analyticsData.dataQualityIssues.length > 0 ? (
                analyticsData.dataQualityIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${
                      issue.flag.severity === 'CRITICAL'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{issue.flag.title}</span>
                    </div>
                    <div className="text-[11px] leading-relaxed">{issue.flag.description}</div>
                    <div className="mt-2 text-[10px] font-semibold text-stone-600">
                      Subject: {issue.animalName}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                  <div className="font-bold text-emerald-950 text-sm">Perfect Data Integrity</div>
                  <p className="text-emerald-700 text-xs mt-1">
                    No chronological anomalies, missing parentage dates, or circular loops detected in this lineage.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
