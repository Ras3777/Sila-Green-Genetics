'use client';

import React, { useState } from 'react';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { CertificateDropzone } from './_components/CertificateDropzone';
import { CertificateSelectedFile } from './_components/CertificateSelectedFile';
import { CertificateVerificationProgress } from './_components/CertificateVerificationProgress';
import { CertificateVerificationResultView } from './_components/CertificateVerificationResultView';
import { VerificationAuditTable } from './_components/VerificationAuditTable';
import { IntegrityReviewQueue } from './_components/IntegrityReviewQueue';
import {
  ShieldCheck,
  FileCheck2,
  History,
  AlertTriangle,
  UploadCloud,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function DocumentVerificationPage() {
  const {
    verifyUploadedFile,
    isVerifying,
    uploadProgress,
    verificationSteps,
    activeResult,
    resetVerification,
    auditEvents,
    integritySignals,
    certificates,
  } = useBovineTrust();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'VALIDATOR' | 'AUDIT' | 'ANOMALIES'>('VALIDATOR');

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    resetVerification();
  };

  const handleRunVerification = async () => {
    if (!selectedFile) return;
    await verifyUploadedFile(selectedFile);
  };

  // Quick-load demo samples for verification demonstration
  const handleLoadSample = (sampleType: 'VALID' | 'REVOKED' | 'TAMPERED') => {
    let filename = 'Golden-Star-1248-Genetic-Registration-v3.pdf';
    let fileContent = 'Authoritative Certificate Content - Golden Star 1248';

    if (sampleType === 'REVOKED') {
      filename = 'Highland-Chief-88-Parentage-Revoked.pdf';
      fileContent = 'Revoked Certificate Content - Highland Chief 88';
    } else if (sampleType === 'TAMPERED') {
      filename = 'Golden-Star-1248-Altered-Hash.pdf';
      fileContent = 'Altered PDF Bytes With Modified Sire Information';
    }

    const blob = new Blob([fileContent], { type: 'application/pdf' });
    const file = new File([blob], filename, { type: 'application/pdf', lastModified: Date.now() });
    setSelectedFile(file);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 mb-1">
            <span>Intelligence &amp; Governance</span>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Trust &amp; Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Official Certificate Verification</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Cryptographic document validation, registered SHA-256 ledger comparison, and digital signature inspection.
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium mr-1">Load Demo PDF:</span>
          <button
            onClick={() => handleLoadSample('VALID')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold cursor-pointer transition-colors"
          >
            ✓ Active v3 PDF
          </button>
          <button
            onClick={() => handleLoadSample('REVOKED')}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold cursor-pointer transition-colors"
          >
            ⚠ Revoked PDF
          </button>
          <button
            onClick={() => handleLoadSample('TAMPERED')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold cursor-pointer transition-colors"
          >
            ✕ Altered Digest PDF
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 text-xs font-bold">
        {[
          { key: 'VALIDATOR' as const, label: 'Document Validator', icon: FileCheck2 },
          {
            key: 'AUDIT' as const,
            label: 'Verification Audit Trail',
            icon: History,
            badge: auditEvents.length,
          },
          {
            key: 'ANOMALIES' as const,
            label: 'Integrity Review Queue',
            icon: AlertTriangle,
            badge: integritySignals.filter((s) => s.status !== 'RESOLVED').length,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'border-emerald-800 text-emerald-950 font-black'
                  : 'border-transparent text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === tab.key ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Validator */}
      {activeTab === 'VALIDATOR' && (
        <div className="space-y-6">
          {!activeResult ? (
            <div className="space-y-4">
              {!selectedFile ? (
                <CertificateDropzone onFileAccepted={handleFileAccepted} disabled={isVerifying} />
              ) : (
                <CertificateSelectedFile
                  file={selectedFile}
                  onRemove={handleRemoveFile}
                  onVerify={handleRunVerification}
                  isVerifying={isVerifying}
                />
              )}

              {isVerifying && (
                <CertificateVerificationProgress
                  uploadProgress={uploadProgress}
                  steps={verificationSteps}
                />
              )}
            </div>
          ) : (
            <CertificateVerificationResultView
              result={activeResult}
              onReset={() => {
                resetVerification();
                setSelectedFile(null);
              }}
            />
          )}
        </div>
      )}

      {/* Tab 2: Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div>
          <VerificationAuditTable audits={auditEvents} />
        </div>
      )}

      {/* Tab 3: Integrity Queue */}
      {activeTab === 'ANOMALIES' && (
        <div>
          <IntegrityReviewQueue signals={integritySignals} />
        </div>
      )}
    </div>
  );
}
