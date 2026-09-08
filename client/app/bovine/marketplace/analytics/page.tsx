'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ChevronRight,
  Sparkles,
  Award,
  BarChart3,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function MarketplaceAnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30D' | '90D' | '1Y'>('90D');

  const breedBenchmarks = [
    { breed: 'Angus (Registered)', avgBullPrice: 5200, avgStrawPrice: 42, avgEmbryoPrice: 650, indexChange: '+4.2%' },
    { breed: 'Hereford (Polled)', avgBullPrice: 4400, avgStrawPrice: 38, avgEmbryoPrice: 580, indexChange: '+2.8%' },
    { breed: 'Simmental (Purebred)', avgBullPrice: 4800, avgStrawPrice: 40, avgEmbryoPrice: 620, indexChange: '+3.5%' },
    { breed: 'Holstein (Dairy Elite)', avgBullPrice: 6500, avgStrawPrice: 55, avgEmbryoPrice: 780, indexChange: '+5.1%' },
    { breed: 'Brahman (Tropical)', avgBullPrice: 4900, avgStrawPrice: 45, avgEmbryoPrice: 690, indexChange: '+1.9%' },
  ];

  const traitDemandRankings = [
    { rank: 1, trait: 'Calving Ease Direct (CED ≥ +12)', premiumPct: '+24%', demand: 'Very High' },
    { rank: 2, trait: 'High Marbling (MARB ≥ +1.10)', premiumPct: '+31%', demand: 'Extremely High' },
    { rank: 3, trait: 'Economic Selection Index ($B ≥ +170)', premiumPct: '+38%', demand: 'Extremely High' },
    { rank: 4, trait: 'Docility (DOC Top 10%)', premiumPct: '+14%', demand: 'Moderate' },
    { rank: 5, trait: 'Negative Birth Wt (BW ≤ -1.5)', premiumPct: '+19%', demand: 'High' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Genetics Analytics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-800" />
                Commercial Genetics Pricing & Market Analytics
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Realtime market benchmarks, breed valuation curves, genomic trait price premiums, and volume liquidity.
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold">
              {(['30D', '90D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Avg Bull Sale Price</div>
            <div className="text-2xl font-bold text-stone-900">$4,980 USD</div>
            <div className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +6.4% YoY
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Avg Straw Rate</div>
            <div className="text-2xl font-bold text-stone-900">$44.50 USD</div>
            <div className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3.8% YoY
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">IVF Embryo Lot Avg</div>
            <div className="text-2xl font-bold text-stone-900">$2,480 USD</div>
            <div className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +11.2% YoY
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Carrier-Free Value Premium</div>
            <div className="text-2xl font-bold text-emerald-800">+18.5%</div>
            <div className="text-stone-600 text-[11px]">Clean defect premium</div>
          </div>
        </div>

        {/* Breed Pricing Benchmarks Table */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Commercial Breed Pricing Benchmarks</h3>
            <p className="text-xs text-stone-600">Cross-breed comparison of average commercial transaction valuations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-mono text-stone-700 uppercase">
                  <th className="p-4 sm:px-6">Breed Classification</th>
                  <th className="p-4">Avg Bull Price</th>
                  <th className="p-4">Avg Straw Price</th>
                  <th className="p-4">Avg Embryo Price</th>
                  <th className="p-4 sm:px-6 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-xs">
                {breedBenchmarks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 sm:px-6 font-bold text-stone-900 font-sans text-sm">{b.breed}</td>
                    <td className="p-4 font-bold text-stone-900">${b.avgBullPrice.toLocaleString()}</td>
                    <td className="p-4 text-stone-700">${b.avgStrawPrice} / straw</td>
                    <td className="p-4 text-stone-700">${b.avgEmbryoPrice} / embryo</td>
                    <td className="p-4 sm:px-6 text-right font-bold text-emerald-800">{b.indexChange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Demanded Genetic Traits & Price Premiums */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-800" /> Top Value-Driver Genetic Traits
            </h3>
            <p className="text-xs text-stone-600">Estimated commercial price premium associated with specific EPD thresholds.</p>
          </div>

          <div className="space-y-3">
            {traitDemandRankings.map((t) => (
              <div
                key={t.rank}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-mono font-bold text-xs text-stone-900">
                    #{t.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{t.trait}</h4>
                    <span className="text-xs text-stone-600 font-mono">Market Demand: {t.demand}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-lg">
                    {t.premiumPct} Premium
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
