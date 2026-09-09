'use client';

import React from 'react';

interface ListingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquirySubject: string;
  setInquirySubject: (subject: string) => void;
  inquiryMessage: string;
  setInquiryMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ListingInquiryModal({
  isOpen,
  onClose,
  inquirySubject,
  setInquirySubject,
  inquiryMessage,
  setInquiryMessage,
  onSubmit,
}: ListingInquiryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Commercial Inquiry</h3>
          <button onClick={onClose} className="p-1 text-stone-600 hover:text-stone-700 cursor-pointer">✕</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
            <input
              type="text"
              value={inquirySubject}
              onChange={(e) => setInquirySubject(e.target.value)}
              placeholder="e.g. Inquiring regarding pedigree certificates"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Message</label>
            <textarea
              rows={4}
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-600 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl cursor-pointer">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
