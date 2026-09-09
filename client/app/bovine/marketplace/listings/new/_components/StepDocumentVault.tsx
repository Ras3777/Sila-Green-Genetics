'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentVisibility } from '@/lib/bovine-marketplace-types';

interface StepDocumentVaultProps {
  documents: Array<{
    id: string;
    name: string;
    type: any;
    visibility: DocumentVisibility;
    url: string;
    verified: boolean;
  }>;
  setDocuments: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string;
        name: string;
        type: any;
        visibility: DocumentVisibility;
        url: string;
        verified: boolean;
      }>
    >
  >;
}

export function StepDocumentVault({
  documents,
  setDocuments,
}: StepDocumentVaultProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">Commercial Document Vault</h3>
        <p className="text-xs text-stone-600">
          Control when buyers can view registration titles, vet health certificates, and genomic reports.
        </p>
      </div>

      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-800" />
              <div>
                <div className="font-bold text-stone-900">{doc.name}</div>
                <div className="text-stone-700 font-mono">{doc.type}</div>
              </div>
            </div>

            <select
              value={doc.visibility}
              onChange={(e) => {
                const next = [...documents];
                next[idx].visibility = e.target.value as any;
                setDocuments(next);
              }}
              className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono"
            >
              <option value="PUBLIC">Public (Anyone)</option>
              <option value="AFTER_INQUIRY">After Inquiry</option>
              <option value="AFTER_OFFER">After Formal Offer</option>
              <option value="AFTER_RESERVATION">After Reservation</option>
              <option value="PRIVATE">Private (Only Me)</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
