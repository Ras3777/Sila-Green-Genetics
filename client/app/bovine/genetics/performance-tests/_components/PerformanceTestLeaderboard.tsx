'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { PerformanceTestEnrollment } from '@/lib/bovine-types';

interface PerformanceTestLeaderboardProps {
  testEnrollments: PerformanceTestEnrollment[];
}

export function PerformanceTestLeaderboard({
  testEnrollments,
}: PerformanceTestLeaderboardProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
        <Award className="w-4 h-4 text-emerald-700" />
        Cohort Performance Rankings &amp; Vitals
      </h4>

      <div className="overflow-x-auto border border-stone-200 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Animal</th>
              <th className="py-2.5 px-3">Entry Wt</th>
              <th className="py-2.5 px-3">Exit Wt</th>
              <th className="py-2.5 px-3">ADG (kg/d)</th>
              <th className="py-2.5 px-3">FCR</th>
              <th className="py-2.5 px-3">RFI (kg/d)</th>
              <th className="py-2.5 px-3">Ultrasound REA</th>
              <th className="py-2.5 px-3">IMF Marbling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {testEnrollments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-stone-500">
                  No animals currently enrolled in this test cohort.
                </td>
              </tr>
            ) : (
              testEnrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-3">
                    {enr.rank ? (
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          enr.rank === 1
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : enr.rank === 2
                            ? 'bg-stone-200 text-stone-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enr.rank}
                      </span>
                    ) : (
                      <span className="text-stone-400 font-mono">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{enr.animalName}</div>
                    <div className="font-mono text-[10px] text-stone-500">
                      {enr.animalIdentifier}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">{enr.entryWeight} kg</td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    {enr.exitWeight ? `${enr.exitWeight} kg` : 'In Progress'}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                    {enr.averageDailyGain ? `+${enr.averageDailyGain} kg` : '-'}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-800">
                    {enr.feedConversionRatio || '-'}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-900">
                    {enr.residualFeedIntake ? `${enr.residualFeedIntake > 0 ? '+' : ''}${enr.residualFeedIntake}` : '-'}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {enr.ultrasoundRibeyeArea ? `${enr.ultrasoundRibeyeArea} cm²` : '-'}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {enr.ultrasoundMarbling ? `${enr.ultrasoundMarbling}%` : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
