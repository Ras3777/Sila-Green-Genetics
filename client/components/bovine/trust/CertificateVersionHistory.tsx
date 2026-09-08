'use client';

import React from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from './CertificateStatusBadge';
import { Clock, ArrowRight, ArrowRightLeft, FileCheck2, Download } from 'lucide-react';

interface CertificateVersionHistoryProps {
  certificates: CertificateRecord[];
  currentCertId?: string;
  onSelectCertificate: (cert: CertificateRecord) => void;
  onCompareVersions: (cert1: CertificateRecord, cert2: CertificateRecord) => void;
}

export function CertificateVersionHistory({
  certificates,
  currentCertId,
  onSelectCertificate,
  onCompareVersions,
}: CertificateVersionHistoryProps) {
  // Sort by version descending
  const sorted = [...certificates].sort((a, b) => b.version - a.version);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-emerald-800" />
            <span>Certificate Version History</span>
          </h3>
          <p className="text-xs text-stone-500">
            Historical official binaries are permanently preserved and remain resolvable via registry ledger.
          </p>
        </div>

        {sorted.length >= 2 && (
          <button
            onClick={() => onCompareVersions(sorted[1], sorted[0])}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-stone-600" />
            <span>Compare v{sorted[1].version} &rarr; v{sorted[0].version}</span>
          </button>
        )}
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {sorted.map((cert) => {
          const isSelected = cert.publicId === currentCertId;
          return (
            <div key={cert.id} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                  cert.status === 'ACTIVE'
                    ? 'bg-emerald-600 border-white ring-4 ring-emerald-100'
                    : cert.status === 'SUPERSEDED'
                    ? 'bg-amber-500 border-white ring-2 ring-stone-100'
                    : 'bg-rose-500 border-white ring-2 ring-stone-100'
                }`}
              />

              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 text-xs font-mono">
                        Version {cert.version}
                      </span>
                      <CertificateStatusBadge status={cert.status} size="sm" />
                      <span className="text-stone-400 font-mono text-[10px]">{cert.publicId}</span>
                    </div>

                    <div className="text-xs text-stone-600 mt-1 font-medium">{cert.title}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()} by {cert.issuer.name}
                    </div>

                    {cert.status === 'REVOKED' && (
                      <p className="text-[11px] text-rose-700 font-medium mt-1">
                        Revocation Reason: {cert.revocationReason}
                      </p>
                    )}
                    {cert.status === 'SUPERSEDED' && (
                      <p className="text-[11px] text-amber-800 font-medium mt-1">
                        Superseded by {cert.supersededByCertificateId || 'Newer Version'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onSelectCertificate(cert)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-stone-600" />
                      <span>Inspect Binary</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
