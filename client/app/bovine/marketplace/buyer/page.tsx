'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ChevronRight,
  Package,
  DollarSign,
  Award,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building,
  Layers,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function BuyerDashboardPage() {
  const { herds } = useBovine();
  const {
    orders,
    offers,
    reservations,
    savedListingIds,
    listings,
    inquiries,
  } = useMarketplace();

  // Filter buyer-relevant records
  const myOrders = orders.filter(
    (o) => o.buyerOrgName === 'Highland Cattle Co.' || o.buyerName === 'Highland Cattle Co.'
  );
  const myPendingOffers = offers.filter(
    (o) => (o.buyerOrgName === 'Highland Cattle Co.' || o.buyerName === 'Highland Cattle Co.') && o.status === 'PENDING'
  );
  const myReservations = reservations.filter(
    (r) => r.buyerName === 'Highland Cattle Co.' && r.status === 'CONFIRMED'
  );
  const mySavedListings = listings.filter((l) => savedListingIds.includes(l.id));

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
                <span className="text-emerald-800 font-semibold">Buyer Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-emerald-800" />
                Buyer Command Center
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Monitor open acquisitions, pending offers, veterinary inspections, active reservations, and saved genetics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bovine/marketplace"
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs font-mono">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Active Orders in Flight</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">{myOrders.length}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Pending Bids / Offers</div>
              <div className="text-xl font-bold text-amber-700 mt-0.5">{myPendingOffers.length}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Active Holds</div>
              <div className="text-xl font-bold text-emerald-800 mt-0.5">{myReservations.length}</div>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-[10px] text-stone-700 uppercase">Saved on Watchlist</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">{mySavedListings.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: Active Orders & Pending Bids */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders in Flight */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-800" /> Commercial Orders in Progress
                  </h3>
                  <p className="text-xs text-stone-600">Track 8-step lifecycle status from inspection to movement.</p>
                </div>
                <Link href="/bovine/marketplace/orders" className="text-xs font-semibold text-emerald-800 hover:underline">
                  View All ({myOrders.length})
                </Link>
              </div>

              {myOrders.length === 0 ? (
                <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
                  No active commercial orders in flight.
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-800 text-white rounded-md">
                            Step {order.currentStep} of 8
                          </span>
                          <span className="text-xs font-bold text-stone-900">{order.listingTitle}</span>
                        </div>
                        <div className="text-xs text-stone-600 font-mono">
                          Seller: {order.sellerOrgName} • Amount: ${order.totalAmount.toLocaleString()} {order.currency}
                        </div>
                      </div>

                      <Link
                        href={`/bovine/marketplace/orders/${order.id}`}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1"
                      >
                        Order Stepper <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Bids & Offers */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-800" /> Pending Purchase Bids
                  </h3>
                  <p className="text-xs text-stone-600">Active formal proposals awaiting seller response.</p>
                </div>
                <Link href="/bovine/marketplace/offers" className="text-xs font-semibold text-emerald-800 hover:underline">
                  Offers Hub
                </Link>
              </div>

              {myPendingOffers.length === 0 ? (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
                  No pending bids awaiting seller decisions.
                </div>
              ) : (
                <div className="space-y-3">
                  {myPendingOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-stone-900">{offer.listingTitle}</div>
                        <div className="text-xs text-stone-600 font-mono mt-0.5">
                          Offered: <strong>${offer.amount.toLocaleString()} {offer.currency}</strong> to {offer.sellerName}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-mono bg-amber-100 text-amber-800 font-bold rounded-lg">
                        PENDING SELLER REVIEW
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Active Holds & Saved Genetics */}
          <div className="space-y-6">
            {/* Active Holds */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-mono uppercase">
                  <Award className="w-4 h-4 text-emerald-800" /> Exclusive Holds ({myReservations.length})
                </h3>
                <Link href="/bovine/marketplace/reservations" className="text-xs text-stone-600 hover:underline">
                  All
                </Link>
              </div>

              {myReservations.length === 0 ? (
                <div className="text-xs text-stone-600 py-3 text-center">No active holds.</div>
              ) : (
                <div className="space-y-2.5">
                  {myReservations.map((res) => (
                    <div key={res.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-bold text-stone-900 line-clamp-1">{res.listingTitle}</div>
                      <div className="text-[11px] text-stone-700 font-mono mt-0.5">
                        Expires: {res.expiresAt.split('T')[0]} • Deposit: ${res.depositAmount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Watchlist */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-mono uppercase">
                  <Heart className="w-4 h-4 text-red-500 fill-current" /> Watchlist ({mySavedListings.length})
                </h3>
                <Link href="/bovine/marketplace/saved" className="text-xs text-stone-600 hover:underline">
                  View Saved
                </Link>
              </div>

              {mySavedListings.length === 0 ? (
                <div className="text-xs text-stone-600 py-3 text-center">No saved genetics.</div>
              ) : (
                <div className="space-y-2.5">
                  {mySavedListings.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/bovine/marketplace/listings/${item.id}`}
                      className="block p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-xs transition-colors"
                    >
                      <div className="font-bold text-stone-900 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-stone-700 font-mono mt-0.5">
                        ${item.askingPrice.toLocaleString()} {item.currency} • {item.sellerOrgName}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
