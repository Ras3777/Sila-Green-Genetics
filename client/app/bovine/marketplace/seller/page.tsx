'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building,
  ChevronRight,
  Layers,
  DollarSign,
  Award,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Package,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function SellerDashboardPage() {
  const {
    listings,
    offers,
    inquiries,
    orders,
    respondToOffer,
  } = useMarketplace();

  // Seller perspective: Highland Cattle Co.
  const myListings = listings.filter((l) => l.sellerOrgName === 'Highland Cattle Co.' || l.sellerName === 'Highland Cattle Co.');
  const incomingOffers = offers.filter(
    (o) => (o.sellerOrgName === 'Highland Cattle Co.' || o.sellerName === 'Highland Cattle Co.') && o.status === 'PENDING'
  );
  const myInquiries = inquiries.filter((i) => i.sellerOrgName === 'Highland Cattle Co.');
  const mySales = orders.filter((o) => o.sellerOrgName === 'Highland Cattle Co.');

  const totalCatalogValue = myListings.reduce((acc, curr) => acc + curr.askingPrice, 0);
  const escrowHolding = mySales.filter((s) => s.status !== 'COMPLETED').reduce((acc, curr) => acc + curr.totalAmount, 0);

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
                <span className="text-emerald-800 font-semibold">Seller Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-emerald-800" />
                Breeder & Commercial Seller Hub
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Manage commercial cattle and cryo inventory, evaluate buyer proposals, and track escrow settlements.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bovine/marketplace/my-listings"
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Manage Inventory
              </Link>
              <Link
                href="/bovine/marketplace/listings/new"
                className="px-4 py-2 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                List Stock
              </Link>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs font-mono">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Active Catalog Value</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">${totalCatalogValue.toLocaleString()}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Pending Buyer Bids</div>
              <div className="text-xl font-bold text-amber-700 mt-0.5">{incomingOffers.length}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Buyer Messages</div>
              <div className="text-xl font-bold text-emerald-800 mt-0.5">{myInquiries.length}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Escrow in Transit</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">${escrowHolding.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: Incoming Bids & Active Listings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incoming Bids Requiring Response */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-800" /> Incoming Buyer Offers Requiring Action
                  </h3>
                  <p className="text-xs text-stone-600">Review, counter, or accept formal purchase proposals.</p>
                </div>
                <Link href="/bovine/marketplace/offers" className="text-xs font-semibold text-emerald-800 hover:underline">
                  All Offers ({incomingOffers.length})
                </Link>
              </div>

              {incomingOffers.length === 0 ? (
                <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
                  No pending incoming offers at this moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {incomingOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-sm text-stone-900">{offer.listingTitle}</div>
                        <div className="text-xs text-stone-600 font-mono mt-0.5">
                          Buyer: <strong>{offer.buyerOrgName}</strong> • Proposed: <strong className="text-stone-900">${offer.amount.toLocaleString()} {offer.currency}</strong>
                        </div>
                        {offer.message && <p className="text-xs text-stone-700 italic mt-1">"{offer.message}"</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            respondToOffer(offer.id, 'ACCEPTED');
                            alert('Offer accepted! Converting into commercial order.');
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                        >
                          Accept
                        </button>
                        <Link
                          href="/bovine/marketplace/offers"
                          className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors"
                        >
                          Counter
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Commercial Stock */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-800" /> Active Cattle & Cryo Offerings
                  </h3>
                  <p className="text-xs text-stone-600">Your published inventory currently live on the global marketplace.</p>
                </div>
                <Link href="/bovine/marketplace/my-listings" className="text-xs font-semibold text-emerald-800 hover:underline">
                  Manage All
                </Link>
              </div>

              <div className="space-y-3">
                {myListings.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-stone-700 rounded border border-stone-200">
                        {item.assetType}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 line-clamp-1 mt-1">{item.title}</h4>
                      <div className="text-xs text-stone-600 font-mono mt-0.5">
                        Views: {item.viewCount} • Inquiries: {item.inquiryCount} • Bids: {item.offerCount}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold font-mono text-sm text-stone-900">
                        ${item.askingPrice.toLocaleString()} {item.currency}
                      </div>
                      <Link
                        href={`/bovine/marketplace/listings/${item.id}`}
                        className="text-xs text-emerald-800 font-semibold hover:underline"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Shortcuts & Analytics */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase font-mono">Seller Analytics Shortcut</h3>
              <p className="text-xs text-stone-600">
                Review market benchmark pricing, index premiums, and regional demand distributions.
              </p>
              <Link
                href="/bovine/marketplace/analytics"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xs"
              >
                <TrendingUp className="w-4 h-4" /> Open Genetics Analytics
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase font-mono">Sales Ledger</h3>
              <p className="text-xs text-stone-600">
                Review cleared payouts and escrow transaction receipts for accounting audits.
              </p>
              <Link
                href="/bovine/marketplace/sales"
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                Open Sales Ledger ({mySales.length})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
