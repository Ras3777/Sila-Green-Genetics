'use client';

import React from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import {
  TestTubes,
  Package,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function GermplasmHubPage() {
  const { semenBatches, semenCollections, embryos, embryoTransfers } = useBreeding();

  const totalSemenDoses = semenBatches.reduce((acc, b) => acc + b.availableDoses, 0);
  const totalEmbryos = embryos.length;
  const frozenEmbryos = embryos.filter((e) => e.preservationMethod === 'FROZEN').length;
  const recentTransfers = embryoTransfers.length;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <TestTubes className="w-4 h-4" />
            <span>Cryo Preservation &amp; Biorepository • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Germplasm &amp; Cryo Management</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Liquid nitrogen inventory, sire semen straw batches, collections QC, and embryo transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/bovine/germplasm/semen/batches"
            className="inline-flex items-center space-x-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Semen Inventory</span>
          </Link>
          <Link
            href="/bovine/germplasm/embryos"
            className="inline-flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Embryo Repository</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Available Semen Doses</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalSemenDoses.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">{semenBatches.length} Certified Batches</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Viable Embryos in Cryo</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{frozenEmbryos}</div>
          <div className="text-[11px] text-stone-500 mt-1">{totalEmbryos} Total Enrolled</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Recent Collections</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{semenCollections.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Avg 78% Progressive Motility</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">ET Transfers Logged</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{recentTransfers}</div>
          <div className="text-[11px] text-stone-500 mt-1">68% Confirmed Conception Rate</div>
        </div>
      </div>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Semen Card */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <TestTubes className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Semen Inventory &amp; Collections</h2>
                <p className="text-xs text-stone-500">Liquid nitrogen tank storage, straws, and motility assays</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <Link
              href="/bovine/germplasm/semen/batches"
              className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-700 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-stone-900">Straw Batches</div>
                <div className="text-[11px] text-stone-500">Tank &amp; Canister coordinates</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            <Link
              href="/bovine/germplasm/semen/collections"
              className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-700 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-stone-900">Collection Logs</div>
                <div className="text-[11px] text-stone-500">Lab quality certifications</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>

        {/* Embryo Card */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Embryos &amp; In-Vitro Fertilization</h2>
                <p className="text-xs text-stone-500">IETS stage &amp; grade inventory, biopsies, and transfer events</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <Link
              href="/bovine/germplasm/embryos"
              className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-700 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-stone-900">Embryo Inventory</div>
                <div className="text-[11px] text-stone-500">Stage, grade, sex &amp; cryo tanks</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            <Link
              href="/bovine/germplasm/embryos/transfers"
              className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-700 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-stone-900">Embryo Transfers</div>
                <div className="text-[11px] text-stone-500">Recipient sync &amp; pregnancies</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Cryo-Storage Tank Coordinates Status */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Cryo-Tank Inventory Summary
          </h2>
          <span className="text-xs text-stone-500">Liquid N2 (-196&deg;C) Level Monitored</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900 text-sm">Tank LN2-01 (Dairy Sires)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="text-xs text-stone-600">
              Doses: <strong className="text-stone-900">1,240 straws</strong> &bull; Level: 98%
            </div>
            <div className="text-[11px] text-stone-400">Canisters 1-6 Active • Last Inspected: Today</div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900 text-sm">Tank LN2-02 (Beef Sires)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="text-xs text-stone-600">
              Doses: <strong className="text-stone-900">890 straws</strong> &bull; Level: 94%
            </div>
            <div className="text-[11px] text-stone-400">Canisters 1-4 Active • Last Inspected: Yesterday</div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900 text-sm">Tank LN2-EMB (Embryos)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="text-xs text-stone-600">
              Embryos: <strong className="text-stone-900">{frozenEmbryos} units</strong> &bull; Level: 99%
            </div>
            <div className="text-[11px] text-stone-400">Goblet tracking certified • Biopsy tagged</div>
          </div>
        </div>
      </div>
    </div>
  );
}
