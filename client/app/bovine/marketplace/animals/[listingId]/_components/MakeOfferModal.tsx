'use client';

import React from 'react';
import { X } from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  listing: MarketplaceListing;
  offerAmount: number;
  setOfferAmount: (amount: number) => void;
  offerMessage: string;
  setOfferMessage: (msg: string) => void;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  onSubmit,
  listing,
  offerAmount,
  setOfferAmount,
  offerMessage,
  setOfferMessage,
}: MakeOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Make Commercial Offer</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-stone-600">
          Submit a formal purchase proposal for <strong className="text-stone-900">{listing.title}</strong>.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Offer Amount ($ USD)</label>
            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
              required
            />
            <div className="text-[11px] text-stone-700 mt-1">Asking price: ${listing.askingPrice.toLocaleString()}</div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Terms or Conditions</label>
            <textarea
              rows={3}
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              placeholder="e.g. Subject to BSE pass and 30-day health clearance."
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl cursor-pointer"
            >
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
