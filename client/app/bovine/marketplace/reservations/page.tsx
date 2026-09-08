'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  ChevronRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign,
  XCircle,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { MarketplaceReservation } from '@/lib/bovine-marketplace-types';

export default function ReservationsPage() {
  const router = useRouter();
  const { reservations, cancelReservation, createOrder } = useMarketplace();

  const [cancelModalRes, setCancelModalRes] = useState<MarketplaceReservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelModalRes) {
      cancelReservation(cancelModalRes.id, cancelReason);
      setCancelModalRes(null);
      setCancelReason('');
      alert('Hold reservation cancelled and asset returned to active marketplace status.');
    }
  };

  const handleConvertToOrder = (res: MarketplaceReservation) => {
    const orderId = createOrder({
      listingId: res.listingId,
      listingTitle: res.listingTitle,
      assetType: 'LIVE_ANIMAL',
      quantity: 1,
      buyerId: res.buyerId,
      buyerName: res.buyerName,
      buyerOrgName: res.buyerName,
      sellerId: res.sellerId,
      sellerName: res.sellerName,
      sellerOrgName: res.sellerName,
      totalAmount: 4500,
      currency: 'USD',
      status: 'RESERVED',
      currentStep: 3, // Advances to inspection
      reservationId: res.id,
      inspectionStatus: 'PENDING',
      paymentDetails: {
        paymentMethod: 'ESCROW',
        depositPaid: res.depositStatus === 'PAID',
        depositAmount: res.depositAmount || 500,
        finalPaymentPaid: false,
      },
      timeline: [
        { step: 1, title: 'Offer & Terms', status: 'COMPLETED', completedAt: res.reservedAt },
        { step: 2, title: 'Asset Reservation & Deposit', status: 'COMPLETED', completedAt: new Date().toISOString() },
        { step: 3, title: 'Pre-Purchase Inspection', status: 'CURRENT' },
      ],
    });

    alert('Reservation converted to active order! Redirecting to 8-step commercial stepper...');
    router.push(`/bovine/marketplace/orders/${orderId}`);
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
                <span className="text-emerald-800 font-semibold">Reservations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-800" />
                Active Asset Holds & Reservations
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Manage 14-day exclusive holds, escrow deposits, and pre-purchase inspection milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {reservations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No active asset holds or reservations found.
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => {
              const isConfirmed = res.status === 'CONFIRMED';
              const isPendingDeposit = res.depositStatus === 'PENDING';

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-100 text-amber-800 rounded-md">
                        {res.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-stone-700 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-600" /> Expires: {res.expiresAt.split('T')[0]}
                      </span>
                      {res.depositRequired && (
                        <span className="px-2 py-0.5 text-xs font-mono rounded-md bg-stone-100 text-stone-700">
                          Deposit: ${res.depositAmount} ({res.depositStatus})
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{res.listingTitle}</h3>
                      <div className="text-xs text-stone-600 font-mono mt-0.5 flex items-center gap-3">
                        <span>Buyer: <strong>{res.buyerName}</strong></span>
                        <span>•</span>
                        <span>Seller: <strong>{res.sellerName}</strong></span>
                      </div>
                    </div>

                    {res.conditions && (
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
                        <span className="font-mono text-stone-700 uppercase block mb-1">Reservation Stipulations:</span>
                        <p>{res.conditions}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Box */}
                  <div className="md:w-64 flex flex-col justify-between p-6 bg-stone-50 rounded-2xl border border-stone-200">
                    <div>
                      <div className="text-xs font-mono uppercase text-stone-700">Hold Status</div>
                      <div className="text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-800" /> Exclusive Hold Active
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1">Locked against other marketplace buyers</div>
                    </div>

                    <div className="pt-4 border-t border-stone-200 space-y-2">
                      {isConfirmed && (
                        <button
                          onClick={() => handleConvertToOrder(res)}
                          className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileCheck className="w-4 h-4" /> Convert to Binding Order
                        </button>
                      )}

                      <button
                        onClick={() => setCancelModalRes(res)}
                        className="w-full py-2 px-3 text-xs text-stone-600 hover:text-red-600 hover:underline"
                      >
                        Cancel Hold
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Cancel Asset Reservation</h3>
              <button onClick={() => setCancelModalRes(null)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you wish to release the hold on <strong className="text-stone-900">{cancelModalRes.listingTitle}</strong>?
            </p>
            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Reason for Cancellation</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Failed clinical soundness exam or mutual agreement..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setCancelModalRes(null)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl">Release Hold</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
