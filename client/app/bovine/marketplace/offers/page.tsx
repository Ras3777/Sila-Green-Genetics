'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Clock,
  Building,
  User,
  X,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { MarketplaceOffer, OfferStatus } from '@/lib/bovine-marketplace-types';

export default function OffersHubPage() {
  const router = useRouter();
  const { offers, respondToOffer, createOrder, listings } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'INCOMING' | 'OUTGOING'>('INCOMING');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Counter Modal State
  const [counterOffer, setCounterOffer] = useState<MarketplaceOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterMessage, setCounterMessage] = useState('');

  const filteredOffers = offers.filter((o) => {
    // Current user context is Highland Cattle Co.
    if (activeTab === 'INCOMING') {
      if (o.sellerOrgName !== 'Highland Cattle Co.' && o.sellerName !== 'Highland Cattle Co.') return false;
    } else {
      if (o.buyerOrgName !== 'Highland Cattle Co.' && o.buyerName !== 'Highland Cattle Co.') return false;
    }

    if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false;
    return true;
  });

  const handleOpenCounter = (offer: MarketplaceOffer) => {
    setCounterOffer(offer);
    setCounterPrice(offer.amount + 250);
    setCounterMessage(`Counter-proposal: We can accept $${offer.amount + 250} with delivery included.`);
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterOffer) {
      respondToOffer(counterOffer.id, 'COUNTERED', Number(counterPrice), counterMessage);
      setCounterOffer(null);
      alert('Counter-proposal dispatched to buyer!');
    }
  };

  const handleAcceptOffer = (offer: MarketplaceOffer) => {
    respondToOffer(offer.id, 'ACCEPTED');
    alert(`Offer of $${offer.amount} accepted! Initiating commercial order...`);

    // Create Order and advance
    const orderId = createOrder({
      listingId: offer.listingId,
      listingTitle: offer.listingTitle,
      assetType: offer.assetType,
      quantity: 1,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerOrgName: offer.buyerOrgName,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      sellerOrgName: 'Highland Cattle Co.',
      totalAmount: offer.amount,
      currency: offer.currency,
      status: 'OFFER_ACCEPTED',
      currentStep: 2,
      offerId: offer.id,
      inspectionStatus: 'PENDING',
      paymentDetails: {
        paymentMethod: 'ESCROW',
        depositPaid: false,
        finalPaymentPaid: false,
      },
      timeline: [
        { step: 1, title: 'Commercial Offer Accepted', status: 'COMPLETED', completedAt: new Date().toISOString() },
        { step: 2, title: 'Reservation & Escrow Deposit', status: 'CURRENT' },
      ],
    });

    router.push(`/bovine/marketplace/orders/${orderId}`);
  };

  const handleRejectOffer = (offerId: string) => {
    if (confirm('Are you sure you want to decline this offer?')) {
      respondToOffer(offerId, 'REJECTED');
    }
  };

  const handleWithdrawOffer = (offerId: string) => {
    if (confirm('Withdraw your purchase offer?')) {
      respondToOffer(offerId, 'WITHDRAWN');
    }
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
                <span className="text-emerald-800 font-semibold">Negotiations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-emerald-800" />
                Offers & Counteroffers Hub
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Formal legal proposals, price negotiations, counteroffers, and conversion into binding commercial escrow orders.
              </p>
            </div>

            {/* Inbound / Outbound Switch */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                onClick={() => setActiveTab('INCOMING')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'INCOMING'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Incoming Bids ({offers.filter((o) => o.sellerOrgName === 'Highland Cattle Co.' || o.sellerName === 'Highland Cattle Co.').length})
              </button>
              <button
                onClick={() => setActiveTab('OUTGOING')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'OUTGOING'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                My Outbound Bids ({offers.filter((o) => o.buyerOrgName === 'Highland Cattle Co.' || o.buyerName === 'Highland Cattle Co.').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {['ALL', 'PENDING', 'COUNTERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No formal purchase offers in this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const isPending = offer.status === 'PENDING';
              const isCountered = offer.status === 'COUNTERED';
              const isAccepted = offer.status === 'ACCEPTED';

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-stone-100 text-stone-700 rounded-md">
                        {offer.assetType.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md ${
                          isAccepted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isCountered
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {offer.status}
                      </span>
                      <span className="text-xs text-stone-700 font-mono">
                        Expires: {offer.expiresAt.split('T')[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{offer.listingTitle}</h3>
                      <div className="text-xs text-stone-600 font-mono mt-0.5 flex items-center gap-3">
                        <span>Buyer: <strong>{offer.buyerOrgName}</strong></span>
                        <span>•</span>
                        <span>Seller: <strong>{offer.sellerName}</strong></span>
                      </div>
                    </div>

                    {offer.message && (
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
                        <span className="font-mono text-stone-700 uppercase block mb-1">Buyer Proposal Terms:</span>
                        <p>{offer.message}</p>
                      </div>
                    )}

                    {offer.counterAmount && (
                      <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900">
                        <span className="font-mono text-blue-700 uppercase block mb-1">Active Counter-Offer:</span>
                        <div className="font-bold text-base font-mono">${offer.counterAmount.toLocaleString()} USD</div>
                        <p className="mt-0.5">{offer.counterMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* Pricing Box & Actions */}
                  <div className="md:w-64 flex flex-col justify-between p-6 bg-stone-50 rounded-2xl border border-stone-200">
                    <div>
                      <div className="text-xs font-mono uppercase text-stone-700">Proposed Bid</div>
                      <div className="text-2xl font-extrabold font-mono text-stone-900 mt-0.5">
                        ${offer.amount.toLocaleString()} <span className="text-xs font-normal text-stone-700">{offer.currency}</span>
                      </div>
                      <div className="text-[11px] text-stone-700 mt-1 font-mono">
                        Submitted: {offer.createdAt.split('T')[0]}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-200 space-y-2">
                      {activeTab === 'INCOMING' && isPending && (
                        <>
                          <button
                            onClick={() => handleAcceptOffer(offer)}
                            className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Accept Offer
                          </button>
                          <button
                            onClick={() => handleOpenCounter(offer)}
                            className="w-full py-2 px-3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-4 h-4 text-emerald-800" /> Counter Offer
                          </button>
                          <button
                            onClick={() => handleRejectOffer(offer.id)}
                            className="w-full py-1.5 px-3 text-xs text-stone-600 hover:text-red-600 hover:underline"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {activeTab === 'OUTGOING' && isPending && (
                        <button
                          onClick={() => handleWithdrawOffer(offer.id)}
                          className="w-full py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 font-semibold rounded-xl text-xs transition-colors"
                        >
                          Withdraw Offer
                        </button>
                      )}

                      {isAccepted && (
                        <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Binding Order Created
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Counter Modal */}
      {counterOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Propose Counteroffer</h3>
              <button onClick={() => setCounterOffer(null)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSubmitCounter} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Counter Amount ($ USD)
                </label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                  required
                />
                <div className="text-[11px] text-stone-700 mt-1">
                  Buyer offered: ${counterOffer.amount.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Counter Terms & Message
                </label>
                <textarea
                  rows={3}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterOffer(null)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Send Counteroffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
