'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ChevronRight,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Package,
  Calendar,
  DollarSign,
  Building,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function BuyerPurchasesPage() {
  const { orders } = useMarketplace();

  // Purchases for Highland Cattle Co. as buyer
  const purchases = orders.filter(
    (o) => o.buyerOrgName === 'Highland Cattle Co.' || o.buyerName === 'Highland Cattle Co.'
  );

  const totalSpent = purchases.reduce((acc, curr) => acc + curr.totalAmount, 0);

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
                <span className="text-emerald-800 font-semibold">Purchase History</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-emerald-800" />
                Commercial Purchase Ledger
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Historical record of acquired live breeding stock, cryo semen straws, and embryo lots with verified titles and invoices.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-mono">
              <div className="text-stone-700 uppercase">Total Capital Invested</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">${totalSpent.toLocaleString()} USD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {purchases.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No purchases recorded yet. Explore the marketplace to acquire verified genetics.
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-stone-100 text-stone-700 rounded-md">
                      {order.assetType}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md ${
                        order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-stone-700 font-mono">Order #{order.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900">{order.listingTitle}</h3>

                  <div className="text-xs text-stone-600 font-mono flex items-center gap-3">
                    <span>Seller: <strong>{order.sellerOrgName}</strong></span>
                    <span>•</span>
                    <span>Date: {order.createdAt.split('T')[0]}</span>
                    <span>•</span>
                    <span>Quantity: {order.quantity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-stone-700 uppercase">Paid Amount</div>
                    <div className="text-xl font-bold font-mono text-stone-900">
                      ${order.totalAmount.toLocaleString()} {order.currency}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Downloading Commercial Tax Invoice for Order #${order.id}`)}
                      className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </button>

                    <Link
                      href={`/bovine/marketplace/orders/${order.id}`}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      View Order <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
