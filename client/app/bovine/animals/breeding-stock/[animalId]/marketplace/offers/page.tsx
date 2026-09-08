'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Building,
  Clock,
  ArrowRightLeft,
  XCircle,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalOffersPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, offers, respondToOffer } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const animalListings = listings.filter((l) => l.animalId === animalId);
  const listingIds = animalListings.map((l) => l.id);

  const animalOffers = offers.filter((o) => listingIds.includes(o.listingId));

  if (!animal) return <div className="p-8 text-center text-stone-500">Animal not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`} className="hover:underline">
              Commercial Hub
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">Offers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-800" />
            Commercial Bids & Offers for {animal.name || animal.identifiers?.[0]?.value}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Formal purchase proposals and counter-negotiations submitted by verified buyers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {animalOffers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No formal bids or offers have been placed on this animal yet.
          </div>
        ) : (
          animalOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md ${
                      offer.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : offer.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {offer.status}
                  </span>
                  <span className="text-xs text-stone-700 font-mono">Expires: {offer.expiresAt.split('T')[0]}</span>
                </div>

                <h3 className="font-bold text-base text-stone-900">
                  Bid from {offer.buyerOrgName} ({offer.buyerName})
                </h3>

                {offer.message && <p className="text-xs text-stone-700 italic">"{offer.message}"</p>}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <div className="text-xs text-stone-700 uppercase">Proposed Bid</div>
                  <div className="text-2xl font-bold text-stone-900">
                    ${offer.amount.toLocaleString()} {offer.currency}
                  </div>
                </div>

                {offer.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        respondToOffer(offer.id, 'ACCEPTED');
                        alert('Offer accepted!');
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-2xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        respondToOffer(offer.id, 'REJECTED');
                        alert('Offer rejected.');
                      }}
                      className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-red-600 rounded-xl"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
