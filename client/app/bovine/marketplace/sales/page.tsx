'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ChevronRight,
  Download,
  DollarSign,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function SellerSalesLedgerPage() {
  const { orders } = useMarketplace();

  // Sales where Highland Cattle Co. is seller
  const sales = orders.filter(
    (o) => o.sellerOrgName === 'Highland Cattle Co.' || o.sellerName === 'Highland Cattle Co.'
  );

  const totalGross = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const completedSales = sales.filter((s) => s.status === 'COMPLETED');
  const totalSettled = completedSales.reduce((acc, curr) => acc + curr.totalAmount, 0);

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
                <span className="text-emerald-800 font-semibold">Sales Ledger</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-800" />
                Commercial Sales & Payout Ledger
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Track closed transactions, escrow disbursements, buyer receipts, and financial remittances.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-stone-700 uppercase">Gross Volume</div>
                <div className="text-lg font-bold text-stone-900">${totalGross.toLocaleString()} USD</div>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-emerald-800 uppercase font-bold">Cleared Payouts</div>
                <div className="text-lg font-bold text-emerald-900">${totalSettled.toLocaleString()} USD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {sales.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No sales transactions on record yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-mono text-stone-700 uppercase">
                  <th className="p-4 sm:px-6">Transaction / Order</th>
                  <th className="p-4">Buyer Organization</th>
                  <th className="p-4">Gross Revenue</th>
                  <th className="p-4">Escrow / Payout Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 sm:px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="font-bold text-stone-900">{sale.listingTitle}</div>
                      <div className="text-xs text-stone-700 font-mono">Order #{sale.id} • {sale.assetType}</div>
                    </td>

                    <td className="p-4 font-mono text-xs">
                      <div className="font-semibold text-stone-900">{sale.buyerOrgName}</div>
                      <div className="text-stone-700">{sale.buyerName}</div>
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-900">
                      ${sale.totalAmount.toLocaleString()} {sale.currency}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                          sale.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sale.status === 'COMPLETED' ? 'DISBURSED' : 'HELD IN ESCROW'}
                      </span>
                    </td>

                    <td className="p-4 text-xs font-mono text-stone-600">
                      {sale.createdAt.split('T')[0]}
                    </td>

                    <td className="p-4 sm:px-6 text-right">
                      <Link
                        href={`/bovine/marketplace/orders/${sale.id}`}
                        className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
