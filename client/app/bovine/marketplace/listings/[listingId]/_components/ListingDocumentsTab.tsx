'use client';

import React from 'react';
import { FileText, Download, Lock } from 'lucide-react';
import { MarketplaceListingDocument } from '@/lib/bovine-marketplace-types';

interface ListingDocumentsTabProps {
  documents: MarketplaceListingDocument[];
}

export function ListingDocumentsTab({ documents }: ListingDocumentsTabProps) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-800" />
            <div>
              <div className="font-bold text-stone-900 text-sm">{doc.name}</div>
              <div className="text-stone-700 font-mono">{doc.type}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md font-mono">
              {doc.visibility}
            </span>
            {doc.visibility === 'PUBLIC' ? (
              <button
                onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                className="px-3 py-1.5 font-semibold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            ) : (
              <span className="text-stone-600 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
