'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Truck,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Building,
  AlertCircle,
  Clock,
  Package,
  Check,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function OrderMovementPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders, completeMovement } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const [originFarm, setOriginFarm] = useState('North Pastures Farm (Montana, USA)');
  const [destinationFarm, setDestinationFarm] = useState('Highland Valley Ranch (Wyoming, USA)');
  const [transporter, setTransporter] = useState('Iron Horse Livestock Transport LLC');
  const [departureDate, setDepartureDate] = useState('2025-02-22');
  const [arrivalDate, setArrivalDate] = useState('2025-02-23');
  const [cviNumber, setCviNumber] = useState('CVI-MT-2025-9921');
  const [quarantineDays, setQuarantineDays] = useState(30);
  const [arrivalInspected, setArrivalInspected] = useState(true);

  if (!order) {
    return <div className="p-12 text-center text-stone-600">Order not found.</div>;
  }

  const handleConfirmArrival = () => {
    if (!arrivalInspected) {
      alert('Please verify physical arrival inspection.');
      return;
    }

    completeMovement(order.id, {
      departureDate,
      arrivalDate,
      transporter,
    });

    alert('Animal arrival confirmed! Escrow funds released to seller and order marked COMPLETED (Step 8).');
    router.push(`/bovine/marketplace/orders/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace/orders" className="hover:underline">Orders</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/bovine/marketplace/orders/${order.id}`} className="hover:underline">{order.id}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">Step 7: Movement & Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-emerald-800" />
            Step 7: Animal Movement, Dispatch & Arrival
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Log transportation manifests, interstate veterinary clearances, and confirm physical delivery to release escrow.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Route Map Card */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <h3 className="text-xs font-mono uppercase text-stone-700 font-bold">Transport Route & Location Manifest</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] font-mono uppercase text-stone-700">Origin Dispatch Point</div>
                <div className="font-bold text-sm text-stone-900">{originFarm}</div>
                <div className="text-xs text-stone-600">Departure: {departureDate}</div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">Destination Receiving Point</div>
                <div className="font-bold text-sm text-stone-900">{destinationFarm}</div>
                <div className="text-xs text-stone-600">Expected Arrival: {arrivalDate}</div>
              </div>
            </div>
          </div>

          {/* Transporter Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Livestock Carrier / Transporter</label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Certificate of Veterinary Inspection (CVI #)</label>
              <input
                type="text"
                value={cviNumber}
                onChange={(e) => setCviNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Receiving Quarantine Protocol */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 text-amber-950">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-800" /> Biosecurity Quarantine Recommendation
            </div>
            <p className="text-stone-700">
              Upon reception, isolate newly introduced genetics in a dedicated isolation paddock for a minimum of <strong>{quarantineDays} days</strong> with secondary monitoring for respiratory and enteric pathogens.
            </p>
          </div>

          {/* Arrival Confirmation Box */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-sm font-bold text-stone-900">Buyer Delivery Verification</h4>
            <label className="flex items-start gap-3 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={arrivalInspected}
                onChange={(e) => setArrivalInspected(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-emerald-700 mt-0.5"
              />
              <span>
                I confirm that the physical animal(s) or cryogenic straws have arrived safely at the designated facility, matched identification ear tags, and passed arrival visual inspection.
              </span>
            </label>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <Link
              href={`/bovine/marketplace/orders/${order.id}`}
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900"
            >
              Back to Stepper
            </Link>

            <button
              type="button"
              onClick={handleConfirmArrival}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Arrival & Release Escrow (Complete Order)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
