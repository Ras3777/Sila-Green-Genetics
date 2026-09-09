'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, QrCode, FileText, Download, Lock } from 'lucide-react';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

interface AnimalListingDocumentsTabProps {
  listing: MarketplaceListing;
}

export function AnimalListingDocumentsTab({ listing }: AnimalListingDocumentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h4 className="text-sm font-bold text-stone-900">Commercial Document Vault</h4>
          <p className="text-xs text-stone-600">Access official veterinary health forms, registration certificates, and genomic reports.</p>
        </div>
      </div>

      {/* Official Sovereign Certificate Trust Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 text-sm">Official Cryptographic Registry Certificate</div>
            <div className="text-xs text-emerald-800 mt-0.5">
              Authoritative, tamper-evident digital twin with verifiable SHA-256 binary hash and ECDSA signature.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/verify?id=${listing.animalId || listing.id}&from=marketplace`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-300" />
            <span>Verify Digital Twin</span>
          </Link>
          <Link
            href="/bovine/documents/verify"
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Validate PDF</span>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {listing.documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-stone-900">{doc.name}</div>
                <div className="text-xs text-stone-700 font-mono flex items-center gap-2 mt-0.5">
                  <span>{doc.type.replace('_', ' ')}</span>
                  {doc.issueDate && <span>• Issued: {doc.issueDate}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 text-xs font-mono bg-stone-200 text-stone-700 rounded-md">
                {doc.visibility.replace('_', ' ')}
              </span>
              {doc.visibility === 'PUBLIC' ? (
                <button
                  onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              ) : (
                <span className="text-xs text-stone-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Unlocks upon inquiry/offer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
