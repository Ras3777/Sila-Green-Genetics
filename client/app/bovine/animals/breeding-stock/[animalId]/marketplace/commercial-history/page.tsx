'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  History,
  ChevronRight,
  DollarSign,
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Building,
  User,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalCommercialHistoryPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, orders, offers } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const listing = listings.find((l) => l.animalId === animalId);

  if (!animal) return <div className="p-8 text-center text-stone-500">Animal not found.</div>;

  // Chronological commercial events
  const events = [
    {
      date: '2025-02-18 14:30',
      title: 'Commercial Offer Accepted & Order Generated',
      actor: 'Highland Cattle Co.',
      category: 'ORDER',
      notes: 'Accepted purchase proposal for $4,500 USD from Midwest Angus Ranch.',
      icon: DollarSign,
    },
    {
      date: '2025-02-15 09:15',
      title: 'Pre-Purchase BSE Inspection Completed',
      actor: 'Dr. Sarah Jenkins, DVM',
      category: 'INSPECTION',
      notes: 'Clinical breeding soundness passed (Scrotal 41cm, Motility 75%).',
      icon: ShieldCheck,
    },
    {
      date: '2025-02-10 11:20',
      title: '14-Day Exclusive Hold Reservation Placed',
      actor: 'Midwest Angus Ranch',
      category: 'RESERVATION',
      notes: '$500 USD escrow hold deposit confirmed.',
      icon: Award,
    },
    {
      date: '2025-01-25 16:45',
      title: 'Commercial Price Adjustment',
      actor: 'Highland Cattle Co.',
      category: 'PRICE_CHANGE',
      notes: 'Asking price adjusted from $4,800 to $4,500 USD.',
      icon: DollarSign,
    },
    {
      date: '2025-01-15 10:00',
      title: 'Marketplace Listing Published',
      actor: 'Highland Cattle Co.',
      category: 'PUBLISH',
      notes: 'Live breeding animal offering published to global catalog.',
      icon: CheckCircle2,
    },
  ];

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
            <span className="text-emerald-800 font-semibold">Commercial History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <History className="w-8 h-8 text-emerald-800" />
            Commercial & Transaction History: {animal.name || animal.identifiers?.[0]?.value}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Complete chronological audit log of pricing changes, buyer bids, inspections, holds, and transfers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
            {events.map((ev, idx) => {
              const Icon = ev.icon;
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center ring-4 ring-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-[10px] uppercase font-bold text-emerald-800">{ev.category}</span>
                      <span className="text-stone-700">{ev.date}</span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900">{ev.title}</h4>
                    <p className="text-stone-700">{ev.notes}</p>
                    <div className="text-[11px] text-stone-700 font-mono pt-1">
                      Logged by: <strong>{ev.actor}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
