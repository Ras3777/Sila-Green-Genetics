'use client';

import React from 'react';
import { CertificateVerificationResult, CertificateRecord } from '@/lib/bovine-trust-types';
import { Check, X, AlertTriangle, ShieldCheck, Database, KeyRound, Clock, Layers } from 'lucide-react';

interface CertificateTrustSummaryProps {
  result?: CertificateVerificationResult;
  certificate?: CertificateRecord;
}

export function CertificateTrustSummary({ result, certificate }: CertificateTrustSummaryProps) {
  const cert = certificate || result?.certificate;

  const rows = [
    {
      label: 'Registry Record',
      icon: Database,
      value: cert ? `Found (${cert.publicId})` : 'Unregistered Reference',
      status: cert ? 'VALID' : 'INVALID',
    },
    {
      label: 'SHA-256 Digest',
      icon: Layers,
      value: result?.document.digestMatch !== false ? 'Exact Match' : 'Digest Mismatch',
      status: result?.document.digestMatch !== false ? 'VALID' : 'INVALID',
    },
    {
      label: 'Digital Signature',
      icon: KeyRound,
      value: cert?.cryptography.signatureValid ? 'Valid (ECDSA FIPS-186)' : 'Invalid Signature',
      status: cert?.cryptography.signatureValid ? 'VALID' : 'INVALID',
    },
    {
      label: 'Issuing Authority',
      icon: ShieldCheck,
      value: cert?.issuer.name || 'National Bovine Genetics Registry',
      status: cert?.issuer.status === 'TRUSTED' ? 'VALID' : 'WARNING',
    },
    {
      label: 'Certificate Lifecycle',
      icon: Clock,
      value:
        cert?.status === 'ACTIVE'
          ? 'Active & Current'
          : cert?.status === 'REVOKED'
          ? 'Officially Revoked'
          : cert?.status === 'SUPERSEDED'
          ? 'Superseded by Newer Version'
          : cert?.status || 'Active',
      status: cert?.status === 'ACTIVE' ? 'VALID' : cert?.status === 'SUPERSEDED' ? 'WARNING' : 'INVALID',
    },
    {
      label: 'Template & Version',
      icon: Layers,
      value: cert ? `Version ${cert.version} (${cert.templateVersion})` : 'Version 1.0',
      status: cert?.status === 'SUPERSEDED' ? 'WARNING' : 'VALID',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>Authoritative Trust Ledger Checklist</span>
        </h3>
        <span className="text-[10px] text-stone-500 font-mono">Discrete Cryptographic Facts</span>
      </div>

      <div className="divide-y divide-stone-100 text-xs">
        {rows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center space-x-2.5">
                <Icon className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-600 font-medium">{row.label}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-stone-800 font-semibold">{row.value}</span>
                {row.status === 'VALID' ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : row.status === 'WARNING' ? (
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
