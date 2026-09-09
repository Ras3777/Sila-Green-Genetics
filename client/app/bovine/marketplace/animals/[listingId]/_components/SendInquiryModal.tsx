'use client';

import React from 'react';
import { X } from 'lucide-react';

interface SendInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  inquirySubject: string;
  setInquirySubject: (subj: string) => void;
  inquiryMessage: string;
  setInquiryMessage: (msg: string) => void;
}

export function SendInquiryModal({
  isOpen,
  onClose,
  onSubmit,
  inquirySubject,
  setInquirySubject,
  inquiryMessage,
  setInquiryMessage,
}: SendInquiryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Commercial Inquiry</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
            <input
              type="text"
              value={inquirySubject}
              onChange={(e) => setInquirySubject(e.target.value)}
              placeholder="e.g. Inquiring regarding delivery options to Montana"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Message</label>
            <textarea
              rows={4}
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="Write your questions regarding the animal, pedigree certificates, or transport..."
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              required
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
              Send Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
