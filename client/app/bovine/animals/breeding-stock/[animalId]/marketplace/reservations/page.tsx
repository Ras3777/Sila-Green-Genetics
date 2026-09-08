'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  Award,
  ChevronRight,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalReservationsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, reservations } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const animalListings = listings.filter((l) => l.animalId === animalId);
  const listingIds = animalListings.map((l) => l.id);

  const animalReservations = reservations.filter((r) => listingIds.includes(r.listingId));

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
            <span className="text-emerald-800 font-semibold">Reservations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-800" />
            Active Holds & Reservations for {animal.name || animal.identifiers?.[0]?.value}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track 14-day pre-purchase exclusivity agreements, escrow deposits, and pending veterinary inspections.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {animalReservations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No active reservations or holds placed on this animal.
          </div>
        ) : (
          animalReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-100 text-amber-800 rounded-md">
                    {res.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-stone-700 font-mono">
                    Expires: {res.expiresAt.split('T')[0]}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900">
                  Reserved by {res.buyerName}
                </h3>

                <div className="text-xs text-stone-600 font-mono flex items-center gap-2">
                  <span>Deposit: <strong>${res.depositAmount} USD</strong></span>
                  <span>•</span>
                  <span>Status: <strong>{res.depositStatus}</strong></span>
                </div>

                {res.conditions && <p className="text-xs text-stone-700 italic">"{res.conditions}"</p>}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/bovine/marketplace/orders"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                >
                  View Order Stepper
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
