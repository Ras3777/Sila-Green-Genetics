'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BovineTrustProvider, useBovineTrust } from '@/lib/bovine-trust-store';
import { CertificateVerificationResult } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from '@/components/bovine/trust/CertificateStatusBadge';
import { CryptographicVerificationStamp } from '@/components/bovine/trust/CryptographicVerificationStamp';
import { CertificatePdfActions } from '@/components/bovine/trust/CertificatePdfActions';
import { Sha256DigestDisplay } from '@/components/bovine/trust/Sha256DigestDisplay';
import { PublicAnimalIdentityCard } from './_components/PublicAnimalIdentityCard';
import { PublicPedigreePreview } from './_components/PublicPedigreePreview';
import { PublicGeneticsPreview } from './_components/PublicGeneticsPreview';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Info,
  X,
  HelpCircle,
} from 'lucide-react';

function PublicVerifyPageContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const fromMarketplace = searchParams.get('from') === 'marketplace';

  const { verifyByPublicId, isVerifying, activeResult, resetVerification } = useBovineTrust();

  const [inputRef, setInputRef] = useState(queryId);
  const [auctionMode, setAuctionMode] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Auto-verify if ID provided in query
  useEffect(() => {
    if (queryId) {
      setInputRef(queryId);
      verifyByPublicId(queryId);
    }
  }, [queryId]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;
    verifyByPublicId(inputRef.trim());
  };

  const handleSelectSample = (sampleId: string) => {
    setInputRef(sampleId);
    verifyByPublicId(sampleId);
  };

  const cert = activeResult?.certificate;
  const animal = activeResult?.animal;

  return (
    <div
      className={`min-h-screen font-sans transition-colors ${
        auctionMode ? 'bg-stone-950 text-stone-100' : 'bg-[#FAF9F5] text-stone-900'
      }`}
    >
      {/* Top Header */}
      <header
        className={`border-b sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors ${
          auctionMode
            ? 'bg-stone-950/90 border-stone-800'
            : 'bg-[#FAF9F5]/90 border-stone-200/80'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight">SGIP National Bovine Registry</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold">
                PUBLIC RESOLVER
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Ministry of Agriculture • Livestock Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {fromMarketplace && (
            <Link
              href="/bovine/marketplace"
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Marketplace</span>
            </Link>
          )}

          {/* Auction Mode Toggle */}
          <button
            onClick={() => setAuctionMode(!auctionMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              auctionMode
                ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {auctionMode ? '⚡ Auction Mode ON' : 'Auction Mode'}
          </button>

          <button
            onClick={() => setShowHowItWorks(true)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="How verification works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search / QR Input Form */}
        <div
          className={`p-5 rounded-3xl border shadow-xs space-y-3 ${
            auctionMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold">Public Digital Twin &amp; Certificate Lookup</h2>
              <p className="text-xs text-stone-500">
                Scan printed ear tag QR, certificate QR, or enter statutory certificate ID below.
              </p>
            </div>

            {/* Quick test buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 text-[11px] font-mono">Sample QRs:</span>
              <button
                onClick={() => handleSelectSample('CERT-2026-0029382')}
                className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 text-[10px] font-mono font-bold cursor-pointer hover:bg-emerald-200"
              >
                Golden Star v3 (Active)
              </button>
              <button
                onClick={() => handleSelectSample('CERT-2026-0014209')}
                className="px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-900 text-[10px] font-mono font-bold cursor-pointer hover:bg-rose-200"
              >
                Highland Chief (Revoked)
              </button>
              <button
                onClick={() => handleSelectSample('CERT-2025-0018491')}
                className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 text-[10px] font-mono font-bold cursor-pointer hover:bg-amber-200"
              >
                Golden Star v2 (Superseded)
              </button>
            </div>
          </div>

          <form onSubmit={handleManualSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={inputRef}
                onChange={(e) => setInputRef(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CERT-2026-0029382) or Ear Tag / DGR..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-mono outline-none transition-colors ${
                  auctionMode
                    ? 'bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-400'
                    : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-emerald-700'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Resolving...' : 'Verify Now'}</span>
            </button>
          </form>
        </div>

        {/* Verification Result Display */}
        {isVerifying ? (
          <div
            className={`p-12 rounded-3xl border text-center space-y-3 ${
              auctionMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Checking Official Registry...</h3>
            <p className="text-xs text-stone-500 font-mono">
              Resolving digital twin, cryptographic signature, and active certificate status.
            </p>
          </div>
        ) : activeResult ? (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Verdict Header Banner */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 shadow-xs space-y-3 ${
                activeResult.status === 'VALID'
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : activeResult.status === 'REVOKED'
                  ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                  : activeResult.status === 'SUPERSEDED'
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                  : 'bg-stone-100 border-stone-300 text-stone-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 rounded-2xl bg-white shadow-xs shrink-0 mt-0.5">
                    {activeResult.status === 'VALID' ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                    ) : activeResult.status === 'SUPERSEDED' ? (
                      <Clock className="w-7 h-7 text-amber-700" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-rose-700" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500">
                        Official Status
                      </span>
                      {cert && <CertificateStatusBadge status={cert.status} size="sm" />}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
                      {activeResult.status === 'VALID'
                        ? 'REGISTRY VERIFIED CLEAN'
                        : activeResult.status === 'REVOKED'
                        ? 'CERTIFICATE OFFICIALLY REVOKED'
                        : activeResult.status === 'SUPERSEDED'
                        ? 'HISTORICAL VERSION (SUPERSEDED)'
                        : 'UNKNOWN CERTIFICATE REFERENCE'}
                    </h2>
                    <p className="text-xs sm:text-sm mt-0.5 font-medium opacity-90">
                      {activeResult.notes ||
                        'Cryptographic signatures and registry record validated successfully.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right sm:border-l sm:border-stone-200/60 sm:pl-4">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Verified At</span>
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {new Date(activeResult.timestamp).toLocaleDateString()}{' '}
                    {new Date(activeResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Linked Replacement for Revoked / Superseded */}
              {activeResult.replacementCertificate && (
                <div className="p-3 rounded-xl bg-white/90 border border-stone-200/80 flex items-center justify-between text-xs font-sans">
                  <span>
                    Current Registered Active Certificate:{' '}
                    <strong className="font-mono">{activeResult.replacementCertificate.publicId}</strong>
                  </span>
                  <button
                    onClick={() => handleSelectSample(activeResult.replacementCertificate!.publicId)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                  >
                    View Active Version &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Animal Digital Twin Identity Card (for physical ear tag comparison) */}
            {animal && <PublicAnimalIdentityCard animal={animal} auctionMode={auctionMode} />}

            {/* Certificate Scope & Signed Binary Delivery */}
            {cert && (
              <div
                className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
                  auctionMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/40">
                  <div>
                    <span className="text-stone-400 text-[10px] font-mono uppercase font-bold block">
                      Issued Certificate
                    </span>
                    <h4 className="text-base font-bold">{cert.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono mt-0.5">
                      <span>ID: {cert.publicId}</span>
                      <span>•</span>
                      <span>Version {cert.version}</span>
                      <span>•</span>
                      <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <CertificateStatusBadge status={cert.status} size="md" />
                </div>

                {/* PDF Actions Toolbar */}
                <div className="pt-1">
                  <CertificatePdfActions certificate={cert} variant="toolbar" />
                </div>

                <div className="pt-3 border-t border-stone-200/40">
                  <Sha256DigestDisplay
                    digest={cert.cryptography.sha256Digest}
                    label="Official SHA-256 Ledger Digest"
                    match={true}
                  />
                </div>
              </div>
            )}

            {/* Pedigree & Genetics Sections */}
            {animal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PublicPedigreePreview animal={animal} auctionMode={auctionMode} />
                <PublicGeneticsPreview animal={animal} auctionMode={auctionMode} />
              </div>
            )}
          </div>
        ) : (
          /* Empty Search Prompt */
          <div
            className={`p-12 rounded-3xl border text-center space-y-4 ${
              auctionMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold">Official Bovine Registry Verification</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Scan the QR code printed on the official certificate PDF, or enter the Certificate ID to inspect
                its cryptographic signature and physical digital twin.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => handleSelectSample('CERT-2026-0029382')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Inspect Demo Verified Animal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* How it Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white text-stone-900 rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base">How Official Verification Works</h3>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-stone-700">
              <p>
                <strong>1. Physical to Digital Twin:</strong> The QR printed on the physical certificate or ear tag
                acts as a tamper-evident pointer to the authoritative National Bovine Database.
              </p>
              <p>
                <strong>2. Cryptographic Digest:</strong> Every official certificate PDF is hashed server-side using
                SHA-256 and digitally signed with the Ministry issuing key (ECDSA).
              </p>
              <p>
                <strong>3. Anti-Fraud Comparison:</strong> Buyers should always cross-reference the physical ear
                tag, horn status, and coat color with the verified digital photo displayed here.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicVerifyPage() {
  return (
    <BovineTrustProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-stone-600 font-mono text-xs">
            Loading public verification resolver...
          </div>
        }
      >
        <PublicVerifyPageContent />
      </Suspense>
    </BovineTrustProvider>
  );
}
