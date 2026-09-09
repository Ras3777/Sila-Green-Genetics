'use client';

import React from 'react';
import { X } from 'lucide-react';
import { SampleStatus } from '@/lib/bovine-types';

interface AddCustodyEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  custodyAction: string;
  setCustodyAction: (v: string) => void;
  custodyLocation: string;
  setCustodyLocation: (v: string) => void;
  custodyHandler: string;
  setCustodyHandler: (v: string) => void;
  custodyStatusNext: SampleStatus;
  setCustodyStatusNext: (v: SampleStatus) => void;
}

export function AddCustodyEventModal({
  isOpen,
  onClose,
  onSubmit,
  custodyAction,
  setCustodyAction,
  custodyLocation,
  setCustodyLocation,
  custodyHandler,
  setCustodyHandler,
  custodyStatusNext,
  setCustodyStatusNext,
}: AddCustodyEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900">Add Custody Event</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Action / Event Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Courier pickup; cold-chain box transfer"
              value={custodyAction}
              onChange={(e) => setCustodyAction(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Location</label>
              <input
                type="text"
                required
                value={custodyLocation}
                onChange={(e) => setCustodyLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Handled By</label>
              <input
                type="text"
                required
                value={custodyHandler}
                onChange={(e) => setCustodyHandler(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Advance Sample Status To</label>
            <select
              value={custodyStatusNext}
              onChange={(e) => setCustodyStatusNext(e.target.value as SampleStatus)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
            >
              <option value="SHIPPED">SHIPPED (In Courier Transit)</option>
              <option value="RECEIVED">RECEIVED (At Laboratory)</option>
              <option value="PROCESSING">PROCESSING (DNA Extraction / Array)</option>
              <option value="COMPLETED">COMPLETED (Assay Finished)</option>
              <option value="REJECTED">REJECTED (Insufficient DNA)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              Log Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
