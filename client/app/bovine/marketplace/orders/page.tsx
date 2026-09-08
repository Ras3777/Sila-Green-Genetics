'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
  FileCheck,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { OrderStatus } from '@/lib/bovine-marketplace-types';

export default function OrdersDirectoryPage() {
  const { orders } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchTitle = order.listingTitle.toLowerCase().includes(q);
      const matchBuyer = order.buyerOrgName.toLowerCase().includes(q);
      const matchSeller = order.sellerOrgName.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchBuyer && !matchSeller) return false;
    }
    return true;
  });

  const stepNames: Record<number, string> = {
    1: 'Offer Accepted',
    2: 'Reservation & Deposit',
    3: 'Pre-Purchase Inspection',
    4: 'Commercial Documents',
    5: 'Payment Settlement',
    6: 'Ownership Transfer',
    7: 'Movement & Dispatch',
    8: 'Completed',
  };

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
                <span className="text-emerald-800 font-semibold">Orders</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-800" />
                Commercial Orders & Escrow Tracker
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Lifecycle management through inspection, escrow payment, official registry ownership transfer, and dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, asset, buyer, or seller..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-stone-700 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
            >
              <option value="ALL">All Stages</option>
              <option value="OFFER_ACCEPTED">Offer Accepted</option>
              <option value="RESERVED">Reserved</option>
              <option value="INSPECTION">Inspection Pending</option>
              <option value="DOCUMENTS">Documents & Bill of Sale</option>
              <option value="PAYMENT">Escrow Payment</option>
              <option value="TRANSFER">Ownership Transfer</option>
              <option value="MOVEMENT">Movement & Dispatch</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-mono text-stone-700 uppercase">
                <th className="p-4 sm:px-6">Order ID & Asset</th>
                <th className="p-4">Buyer & Seller</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Lifecycle Step (1-8)</th>
                <th className="p-4">Status</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-600">
                    No commercial orders matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="font-bold font-mono text-stone-900">{order.id}</div>
                      <div className="text-xs text-stone-600 line-clamp-1">{order.listingTitle}</div>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 text-stone-700 rounded">
                        {order.assetType}
                      </span>
                    </td>

                    <td className="p-4 text-xs font-mono">
                      <div>Buyer: <strong className="text-stone-900">{order.buyerOrgName}</strong></div>
                      <div className="text-stone-700">Seller: {order.sellerOrgName}</div>
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-900">
                      ${order.totalAmount.toLocaleString()} {order.currency}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-xs font-bold">
                          {order.currentStep}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {stepNames[order.currentStep] || 'Processing'}
                          </div>
                          <div className="text-[10px] text-stone-700 font-mono">Stage {order.currentStep} of 8</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 sm:px-6 text-right">
                      <Link
                        href={`/bovine/marketplace/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                      >
                        Open Stepper <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
