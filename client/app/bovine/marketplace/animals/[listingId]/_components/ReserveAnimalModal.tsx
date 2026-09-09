'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ReserveAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  reserveDeposit: number;
  setReserveDeposit: (amount: number) => void;
}

export function ReserveAnimalModal({
  isOpen,
  onClose,
  onSubmit,
  reserveDeposit,
  setReserveDeposit,
}: ReserveAnimalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Place 14-Day Asset Reservation</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-stone-600">
          Holding this animal locks out other buyers while you perform pre-purchase veterinary inspection and finalize transport.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Required Escrow Deposit ($ USD)</label>
            <input
              type="number"
              value={reserveDeposit}
              onChange={(e) => setReserveDeposit(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
              required
            />
            <div className="text-[11px] text-stone-700 mt-1">Typically 10% of asking price, held in escrow.</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
            <div>✓ 14 days exclusivity period</div>
            <div>✓ Right to veterinary clinical inspection</div>
            <div>✓ Refundable if veterinary inspection fails</div>
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
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
