'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ChevronRight,
  ShieldCheck,
  Download,
  Upload,
  Lock,
  Eye,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { DocumentVisibility } from '@/lib/bovine-marketplace-types';

export default function AnimalCommercialDocumentsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const listing = listings.find((l) => l.animalId === animalId);

  const [documents, setDocuments] = useState(
    listing?.documents || [
      {
        id: 'doc-1',
        name: 'Official Breed Registry Certificate',
        type: 'REGISTRY_CERT',
        visibility: 'PUBLIC' as DocumentVisibility,
        url: '#',
        verified: true,
      },
      {
        id: 'doc-2',
        name: 'Neogen GGP 100K Genomic Evaluation Report',
        type: 'GENOMIC_REPORT',
        visibility: 'PUBLIC' as DocumentVisibility,
        url: '#',
        verified: true,
      },
      {
        id: 'doc-3',
        name: 'Annual Breeding Soundness Exam (BSE) Form',
        type: 'VET_HEALTH_CERT',
        visibility: 'AFTER_INQUIRY' as DocumentVisibility,
        url: '#',
        verified: true,
      },
    ]
  );

  const [newDocName, setNewDocName] = useState('');
  const [newDocVisibility, setNewDocVisibility] = useState<DocumentVisibility>('AFTER_INQUIRY');
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!animal) return <div className="p-8 text-center text-stone-500">Animal not found.</div>;

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocName.trim()) {
      setDocuments([
        ...documents,
        {
          id: `doc-${Date.now()}`,
          name: newDocName.trim(),
          type: 'VET_HEALTH_CERT' as any,
          visibility: newDocVisibility,
          url: '#',
          verified: true,
        },
      ]);
      setNewDocName('');
      setShowUploadModal(false);
      alert('Document attached to commercial vault!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`} className="hover:underline">
                  Commercial Hub
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Commercial Documents</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-emerald-800" />
                Commercial Document Vault: {animal.name || animal.identifiers?.[0]?.value}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Attach registry certificates, health clearances, and genomic assays with gated buyer visibility rules.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {documents.map((doc, idx) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-base text-stone-900">{doc.name}</h4>
                <div className="text-xs text-stone-600 font-mono mt-0.5 flex items-center gap-2">
                  <span>Type: {doc.type}</span>
                  <span>•</span>
                  <span className="text-emerald-800 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={doc.visibility}
                onChange={(e) => {
                  const next = [...documents];
                  next[idx].visibility = e.target.value as any;
                  setDocuments(next);
                }}
                className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono font-medium"
              >
                <option value="PUBLIC">Public (Anyone)</option>
                <option value="AFTER_INQUIRY">After Inquiry</option>
                <option value="AFTER_OFFER">After Formal Offer</option>
                <option value="AFTER_RESERVATION">After Hold / Deposit</option>
                <option value="PRIVATE">Private (Only Me)</option>
              </select>

              <button
                onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Attach Commercial Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Trichomoniasis Negative Lab Report"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Buyer Visibility Rule</label>
                <select
                  value={newDocVisibility}
                  onChange={(e) => setNewDocVisibility(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="PUBLIC">Public (Available to all prospective buyers)</option>
                  <option value="AFTER_INQUIRY">After Inquiry (Unlocks upon message)</option>
                  <option value="AFTER_OFFER">After Formal Offer</option>
                  <option value="AFTER_RESERVATION">After Hold / Deposit</option>
                  <option value="PRIVATE">Private (Internal Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-xs text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl">Attach Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
