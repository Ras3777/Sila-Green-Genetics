'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ChevronRight,
  DollarSign,
  Award,
  Layers,
  Sparkles,
  TestTubes,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  FileText,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalMarketplaceCommercialWorkspacePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, offers, inquiries, reservations, orders } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);

  // Listings associated with this animal
  const activeListings = listings.filter((l) => l.animalId === animalId);
  const primaryListing = activeListings[0];

  // Related offers, inquiries, reservations
  const animalListingIds = activeListings.map((l) => l.id);
  const relatedOffers = offers.filter((o) => animalListingIds.includes(o.listingId));
  const relatedInquiries = inquiries.filter((i) => animalListingIds.includes(i.listingId));
  const relatedReservations = reservations.filter((r) => animalListingIds.includes(r.listingId));
  const relatedOrders = orders.filter((o) => o.animalId === animalId || animalListingIds.includes(o.listingId));

  const totalCommercialRevenue = relatedOrders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  if (!animal) {
    return (
      <div className="p-8 text-center text-stone-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
        <h2 className="text-lg font-bold text-stone-900">Animal Record Not Found</h2>
        <Link
          href="/bovine/animals/breeding-stock"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Breeding Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/bovine/animals/breeding-stock/${animal.id}`} className="hover:underline">
                  {animal.name || animal.identifiers?.[0]?.value}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Commercial Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-emerald-800" />
                Commercial Genetics Hub: {animal.name || animal.identifiers?.[0]?.value}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Breeding stock monetization, semen cryo-lots, embryo flush packages, and marketplace engagement.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {primaryListing ? (
                <Link
                  href={`/bovine/marketplace/listings/${primaryListing.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Public Listing
                </Link>
              ) : (
                <Link
                  href={`/bovine/marketplace/listings/new`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  List on Marketplace
                </Link>
              )}
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-xs font-semibold">
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white shadow-2xs whitespace-nowrap"
            >
              Overview & Valuation
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/listing`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Listing Config
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/offers`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Offers ({relatedOffers.length})
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/inquiries`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Inquiries ({relatedInquiries.length})
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/reservations`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Holds ({relatedReservations.length})
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/documents`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Commercial Docs
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/related-assets`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Semen & Embryo Lots
            </Link>
            <Link
              href={`/bovine/animals/breeding-stock/${animal.id}/marketplace/commercial-history`}
              className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 whitespace-nowrap"
            >
              Commercial History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Marketplace Status</div>
            <div className="text-xl font-bold text-emerald-800">
              {primaryListing ? primaryListing.status : 'UNLISTED'}
            </div>
            <div className="text-stone-700 text-[11px]">
              {primaryListing ? `${primaryListing.listingType.replace('_', ' ')}` : 'Private inventory'}
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Asking Price</div>
            <div className="text-xl font-bold text-stone-900">
              {primaryListing ? `$${primaryListing.askingPrice.toLocaleString()} USD` : 'Not Set'}
            </div>
            <div className="text-stone-700 text-[11px]">
              Min bid: {primaryListing?.minimumPrice ? `$${primaryListing.minimumPrice.toLocaleString()}` : 'N/A'}
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Buyer Inquiries</div>
            <div className="text-xl font-bold text-stone-900">
              {relatedInquiries.length}
            </div>
            <div className="text-stone-700 text-[11px]">{relatedOffers.length} active offer(s)</div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <div className="text-stone-700 uppercase text-[10px]">Lifetime Commercial Revenue</div>
            <div className="text-xl font-bold text-stone-900">
              ${totalCommercialRevenue.toLocaleString()} USD
            </div>
            <div className="text-emerald-800 font-bold text-[11px]">Settled in Escrow</div>
          </div>
        </div>

        {/* Active Commercial Offerings */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Active Commercial Offerings For This Animal</h3>
              <p className="text-xs text-stone-600">
                Live listing, frozen semen lots, or embryo packages referencing this animal's canonical genetics.
              </p>
            </div>
            <Link
              href="/bovine/marketplace/listings/new"
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Offering
            </Link>
          </div>

          {activeListings.length === 0 ? (
            <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-600">
              No active marketplace listings currently attached to this animal.
            </div>
          ) : (
            <div className="space-y-4">
              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-stone-800 rounded border border-stone-200">
                        {item.assetType}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded">
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900">{item.title}</h4>
                    <div className="text-xs text-stone-600 font-mono">
                      Views: {item.viewCount} • Saves: {item.saveCount} • Bids: {item.offerCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-xs text-stone-700 uppercase">Asking</div>
                      <div className="text-base font-bold text-stone-900">
                        ${item.askingPrice.toLocaleString()} {item.currency}
                      </div>
                    </div>

                    <Link
                      href={`/bovine/marketplace/listings/${item.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1"
                    >
                      Inspect Public View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
