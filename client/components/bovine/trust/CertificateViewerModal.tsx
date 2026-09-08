'use client';

import React, { useState, useEffect } from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { buildOfficialCertificatePdf } from '@/lib/bovine-trust-pdf';
import { CertificateStatusBadge } from './CertificateStatusBadge';
import { CertificateMetadataDrawer } from './CertificateMetadataDrawer';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  FileCheck2,
} from 'lucide-react';

interface CertificateViewerModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export function CertificateViewerModal({ certificate, onClose }: CertificateViewerModalProps) {
  const { downloadCertificate, printCertificate } = useBovineTrust();
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    // Generate exact binary blob from authoritative certificate record
    const pdfBytes = buildOfficialCertificatePdf(certificate);
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [certificate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-stone-300 truncate">
                  {certificate.publicId}
                </span>
                <span className="text-stone-600">•</span>
                <span className="text-xs text-stone-400 font-mono">v{certificate.version}</span>
                <CertificateStatusBadge status={certificate.status} size="sm" />
              </div>
              <h2 className="text-sm font-bold text-stone-100 truncate">{certificate.title}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsMetadataOpen(!isMetadataOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              title="View cryptographic & registry metadata"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit Details</span>
            </button>

            <button
              onClick={() => downloadCertificate(certificate)}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => printCertificate(certificate)}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer transition-colors"
              title="Print official binary PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory Trust Banner */}
        <div className="px-5 py-2 bg-emerald-950/60 border-b border-emerald-900/60 flex items-center justify-between text-xs text-emerald-300 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Viewing exact official signed binary. Browser client cannot alter authenticated bytes.</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-[11px] text-emerald-400/80">
            <span>SHA256: {certificate.cryptography.sha256Digest.slice(0, 16)}...</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative bg-stone-900 overflow-hidden flex">
          {/* PDF Viewer Frame */}
          <div className="flex-1 h-full overflow-auto flex items-center justify-center p-3 bg-stone-950/50">
            {blobUrl ? (
              <iframe
                src={`${blobUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full rounded-xl border border-stone-800 shadow-lg bg-white"
                title="Official Certificate Binary Viewer"
              />
            ) : (
              <div className="text-stone-500 text-xs font-mono animate-pulse">
                Loading official certificate binary...
              </div>
            )}
          </div>

          {/* Slide-over Metadata Drawer */}
          {isMetadataOpen && (
            <div className="w-80 sm:w-96 border-l border-stone-800 bg-stone-950/95 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-300">
                  Cryptographic Ledger
                </h3>
                <button
                  onClick={() => setIsMetadataOpen(false)}
                  className="text-stone-500 hover:text-stone-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-500 font-mono text-[10px] uppercase block">Authority</span>
                  <span className="font-semibold text-stone-200">{certificate.issuer.name}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-mono text-[10px] uppercase block">Signing Key</span>
                  <span className="font-mono text-stone-300">{certificate.cryptography.signingKeyId}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-mono text-[10px] uppercase block">Algorithm</span>
                  <span className="font-mono text-stone-300">{certificate.cryptography.signatureAlgorithm}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-mono text-[10px] uppercase block">SHA-256 Digest</span>
                  <div className="font-mono text-[10px] text-emerald-400 bg-stone-900 p-2 rounded-lg break-all border border-stone-800 select-all mt-1">
                    {certificate.cryptography.sha256Digest}
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 font-mono text-[10px] uppercase block">Animal Attached</span>
                  <div className="mt-1 font-medium text-stone-200">
                    {certificate.animalSummary.name} ({certificate.animalSummary.dgr})
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Ear Tag: {certificate.animalSummary.earTag} • {certificate.animalSummary.breed}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500">
                  Issued: {new Date(certificate.issuedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
