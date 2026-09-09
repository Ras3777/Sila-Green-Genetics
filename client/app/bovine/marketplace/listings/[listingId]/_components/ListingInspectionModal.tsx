'use client';

import React from 'react';

interface ListingInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionType: string;
  setInspectionType: (type: string) => void;
  inspectionDate: string;
  setInspectionDate: (date: string) => void;
  inspectorName: string;
  setInspectorName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ListingInspectionModal({
  isOpen,
  onClose,
  inspectionType,
  setInspectionType,
  inspectionDate,
  setInspectionDate,
  inspectorName,
  setInspectorName,
  onSubmit,
}: ListingInspectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Schedule Pre-Purchase Inspection</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">✕</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Inspection Type</label>
            <select
              value={inspectionType}
              onChange={(e) => setInspectionType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="VETERINARY_CLINICAL">Veterinary Clinical &amp; BSE Examination</option>
              <option value="BUYER_PHYSICAL">Buyer On-Farm Physical Inspection</option>
              <option value="GENOMIC_DOCUMENT_VERIFICATION">Genomic &amp; Pedigree Verification</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Target Inspection Date</label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Designated Veterinarian / Inspector</label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance, DVM"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-600 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl cursor-pointer">Book Inspection</button>
          </div>
        </form>
      </div>
    </div>
  );
}
