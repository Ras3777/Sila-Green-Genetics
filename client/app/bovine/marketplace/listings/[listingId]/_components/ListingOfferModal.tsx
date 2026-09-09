'use client';

import React from 'react';

interface ListingOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerAmount: number;
  setOfferAmount: (amount: number) => void;
  offerMessage: string;
  setOfferMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ListingOfferModal({
  isOpen,
  onClose,
  offerAmount,
  setOfferAmount,
  offerMessage,
  setOfferMessage,
  onSubmit,
}: ListingOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Make Commercial Offer</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">✕</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Offer Price ($ USD)</label>
            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Terms or Message</label>
            <textarea
              rows={3}
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              placeholder="e.g. Price includes freight delivery..."
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-600 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl cursor-pointer">Submit Offer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
