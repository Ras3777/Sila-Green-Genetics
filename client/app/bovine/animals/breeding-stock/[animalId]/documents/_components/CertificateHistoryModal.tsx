'use client';

import React from 'react';
import { History, X } from 'lucide-react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { CertificateVersionHistory } from '@/components/bovine/trust/CertificateVersionHistory';

interface CertificateHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateRecord[];
  currentCertId?: string;
  onSelectCertificate: (cert: CertificateRecord) => void;
  onCompareVersions: (older: CertificateRecord, newer: CertificateRecord) => void;
}

export function CertificateHistoryModal({
  isOpen,
  onClose,
  certificates,
  currentCertId,
  onSelectCertificate,
  onCompareVersions,
}: CertificateHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-stone-900 text-sm">Certificate Version Trail</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <CertificateVersionHistory
            certificates={certificates}
            currentCertId={currentCertId}
            onSelectCertificate={(c) => {
              onClose();
              onSelectCertificate(c);
            }}
            onCompareVersions={(older, newer) => {
              onClose();
              onCompareVersions(older, newer);
            }}
          />
        </div>
      </div>
    </div>
  );
}
