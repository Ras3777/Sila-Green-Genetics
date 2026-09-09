'use client';

import React from 'react';

interface BulkRejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  rejectReason: string;
  setRejectReason: (val: string) => void;
}

export function BulkRejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  rejectReason,
  setRejectReason,
}: BulkRejectReasonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <h3 className="text-base font-bold text-stone-900">Reject Selected Observations</h3>
        <p className="text-xs text-stone-600">
          Provide an audit reason for flagging and rejecting {selectedCount} observations:
        </p>
        <input
          type="text"
          placeholder="e.g. Scale tare failure or technician protocol deviation"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900"
        />
        <div className="flex justify-end space-x-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-700 text-white font-semibold"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
