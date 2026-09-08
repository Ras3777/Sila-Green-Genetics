'use client';

import React, { useState } from 'react';
import { CertificateScope, CertificateRecord } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import {
  X,
  Award,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CertificateIssueModalProps {
  animalId: string;
  animalName: string;
  isOpen: boolean;
  onClose: () => void;
  onIssuedSuccess?: (newCert: CertificateRecord) => void;
}

export function CertificateIssueModal({
  animalId,
  animalName,
  isOpen,
  onClose,
  onIssuedSuccess,
}: CertificateIssueModalProps) {
  const { issueCertificate } = useBovineTrust();

  const [certType, setCertType] = useState<CertificateScope>('GENETIC_REGISTRATION');
  const [templateVersion, setTemplateVersion] = useState('v2.4-STATUTORY');
  const [language, setLanguage] = useState('EN / AM');
  const [includedSections, setIncludedSections] = useState<string[]>([
    'IDENTITY',
    'PARENTAGE',
    'GENOMICS',
    'CRYPTO_LEDGER',
  ]);
  const [reason, setReason] = useState('Standard registry certification for breeding stock');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuingStage, setIssuingStage] = useState<string>('');
  const [newlyIssuedCert, setNewlyIssuedCert] = useState<CertificateRecord | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setIncludedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const stages = [
      'Validating registry preconditions...',
      'Rendering official high-res PDF layout...',
      'Embedding tamper-evident official watermark...',
      'Computing authoritative SHA-256 binary digest...',
      'Applying ECDSA digital signature with Key ID KEY-2026-NBGR...',
      'Registering in National Bovine Ledger...',
    ];

    for (const stage of stages) {
      setIssuingStage(stage);
      await new Promise((r) => setTimeout(r, 220));
    }

    try {
      const created = await issueCertificate({
        animalId,
        type: certType,
        templateVersion,
        language,
        includedSections,
        reason,
      });

      setNewlyIssuedCert(created);
      if (onIssuedSuccess) onIssuedSuccess(created);
    } finally {
      setIsSubmitting(false);
      setIssuingStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Issue Official Certificate</h3>
              <p className="text-xs text-stone-500 font-medium">Target: {animalName}</p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Successful Issuance View */}
        {newlyIssuedCert ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bold text-emerald-950 text-base">Official Certificate Issued &amp; Signed</h4>
              <p className="text-xs text-emerald-800 font-mono mt-1 font-bold">
                {newlyIssuedCert.publicId} (Version {newlyIssuedCert.version})
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Exact signed binary PDF registered in the National Bovine Database with verified SHA-256 digest.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-left text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-emerald-800">{newlyIssuedCert.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">SHA-256:</span>
                <span className="text-stone-700 truncate max-w-[200px]">
                  {newlyIssuedCert.cryptography.sha256Digest.slice(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Signed By:</span>
                <span className="text-stone-700">{newlyIssuedCert.issuer.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setNewlyIssuedCert(null);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Return to Certificates
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          <div className="p-8 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-800 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-stone-900 text-sm">Authoritative Backend Issuance</h4>
              <p className="text-xs text-emerald-800 font-mono animate-pulse">{issuingStage}</p>
            </div>
            <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
              The backend is executing the digital signature and registering the exact SHA-256 digest in the registry ledger.
            </p>
          </div>
        ) : (
          /* Issuance Form */
          <form onSubmit={handleIssue} className="space-y-4 text-xs">
            {/* Eligibility Preconditions Panel */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider block">
                Statutory Eligibility Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-700">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Physical ID &amp; Ear Tag</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>50K SNP Genotyped</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Parentage Confirmed</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Breeding Tier Approved</span>
                </div>
              </div>
            </div>

            {/* Scope Selection */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Certificate Type Scope</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateScope)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 font-medium outline-none cursor-pointer"
              >
                <option value="GENETIC_REGISTRATION">Genetic Registration Certificate (Master DGR)</option>
                <option value="PEDIGREE_CERTIFICATE">Official Pedigree &amp; Ancestry Certificate</option>
                <option value="GENOMIC_CERTIFICATE">50K SNP Genomic Characterization Certificate</option>
                <option value="PARENTAGE_CERTIFICATE">DNA Parentage Attestation Certificate</option>
                <option value="BREEDING_STOCK_CERTIFICATE">Certified Elite Breeding Stock Credential</option>
                <option value="PERFORMANCE_CERTIFICATE">Annual Performance &amp; ADG Certificate</option>
              </select>
            </div>

            {/* Template Version & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Template Specification</label>
                <select
                  value={templateVersion}
                  onChange={(e) => setTemplateVersion(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono outline-none"
                >
                  <option value="v2.4-STATUTORY">v2.4-STATUTORY (Standard)</option>
                  <option value="v3.0-GENOMIC">v3.0-GENOMIC (Advanced)</option>
                  <option value="v2.0-COMMERCIAL">v2.0-COMMERCIAL (Marketplace)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Language Variant</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
                >
                  <option value="EN / AM">Bilingual (English / Amharic)</option>
                  <option value="EN">English Only (International Trade)</option>
                  <option value="AM">Amharic Only (Domestic Registry)</option>
                </select>
              </div>
            </div>

            {/* Sections Included */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Included Certified Sections</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'IDENTITY', label: 'Animal Identity & Ear Tag' },
                  { id: 'PARENTAGE', label: 'Pedigree & DNA Parentage' },
                  { id: 'GENOMICS', label: '50K SNP Genomic Scores' },
                  { id: 'CRYPTO_LEDGER', label: 'Digital Signature Ledger' },
                ].map((sec) => (
                  <label
                    key={sec.id}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/60"
                  >
                    <input
                      type="checkbox"
                      checked={includedSections.includes(sec.id)}
                      onChange={() => toggleSection(sec.id)}
                      className="rounded text-emerald-800 focus:ring-emerald-700"
                    />
                    <span className="text-stone-800 text-[11px] font-medium">{sec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Reason for Issuance</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-900 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Authoritative signature will be computed on server.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Issue &amp; Sign</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
