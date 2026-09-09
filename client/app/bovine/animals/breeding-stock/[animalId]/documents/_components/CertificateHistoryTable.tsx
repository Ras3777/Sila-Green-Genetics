'use client';

import React from 'react';
import { History, Search, FileText, ArrowRightLeft } from 'lucide-react';
import { CertificateRecord, CertificateStatus } from '@/lib/bovine-trust-types';
import { CertificateStatusBadge } from '@/components/bovine/trust/CertificateStatusBadge';
import { Sha256DigestDisplay } from '@/components/bovine/trust/Sha256DigestDisplay';
import { CertificatePdfActions } from '@/components/bovine/trust/CertificatePdfActions';

interface CertificateHistoryTableProps {
  filteredCertificates: CertificateRecord[];
  activeCertificate?: CertificateRecord;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'ALL' | CertificateStatus;
  onStatusFilterChange: (st: 'ALL' | CertificateStatus) => void;
  onCompare: (older: CertificateRecord, newer: CertificateRecord) => void;
  onOpenMetadata: (cert: CertificateRecord) => void;
  onRevoke: (cert: CertificateRecord) => void;
}

export function CertificateHistoryTable({
  filteredCertificates,
  activeCertificate,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCompare,
  onOpenMetadata,
  onRevoke,
}: CertificateHistoryTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
      {/* Table Filters & Toolbar */}
      <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-800" />
            <span>Certificate Lifecycle &amp; Registry History</span>
            <span className="text-xs font-normal text-stone-500 font-mono">
              ({filteredCertificates.length} {filteredCertificates.length === 1 ? 'record' : 'records'})
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Auditable record of all active, historical, superseded, and revoked binaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search certificate # or hash..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-48 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {(['ALL', 'ACTIVE', 'SUPERSEDED', 'REVOKED', 'EXPIRED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onStatusFilterChange(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records Table */}
      {filteredCertificates.length === 0 ? (
        <div className="p-12 text-center text-stone-500 text-xs space-y-2">
          <FileText className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-semibold text-stone-700">No certificate records match the selected filter.</p>
          <p>Try resetting the status filter or clearing your search term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500">
              <tr>
                <th className="py-3 px-4">Status &amp; Certificate #</th>
                <th className="py-3 px-4">Scope &amp; Version</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCertificates.map((cert: CertificateRecord) => {
                const isCurrentActive = cert.status === 'ACTIVE';
                const isSuperseded = cert.status === 'SUPERSEDED';

                return (
                  <tr
                    key={cert.id}
                    className={`hover:bg-stone-50/60 transition-colors ${
                      isCurrentActive ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    {/* Status & Certificate Number */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <CertificateStatusBadge status={cert.status} />
                        <span className="font-bold text-stone-900">{cert.publicId}</span>
                      </div>
                      {cert.revocationReason && (
                        <div className="text-[10px] text-red-600 font-sans mt-0.5">
                          Revoked: {cert.revocationReason}
                        </div>
                      )}
                    </td>

                    {/* Scope & Version */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">
                        {cert.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Template: {cert.templateVersion} • v{cert.version}.0
                      </div>
                    </td>

                    {/* Issuing Authority */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">
                        {cert.issuer.name}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Trust: {cert.issuer.trustLevel}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</div>
                      {cert.expiresAt && (
                        <div className="text-stone-500 text-[10px]">
                          Exp: {new Date(cert.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* SHA-256 Digest */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Sha256DigestDisplay
                        digest={cert.cryptography.sha256Digest}
                        match={cert.status === 'ACTIVE' || cert.status === 'SUPERSEDED'}
                        truncate
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <CertificatePdfActions
                          certificate={cert}
                          variant="compact"
                        />

                        {/* Version comparison button if superseded and an active certificate exists */}
                        {isSuperseded && activeCertificate && (
                          <button
                            onClick={() =>
                              onCompare(cert, activeCertificate)
                            }
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs transition-colors cursor-pointer"
                            title="Compare with Active Certificate"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-stone-600" />
                          </button>
                        )}

                        {/* Metadata Inspector Drawer */}
                        <button
                          onClick={() => onOpenMetadata(cert)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs transition-colors cursor-pointer"
                          title="Deep Cryptographic Metadata"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-600" />
                        </button>

                        {/* Revoke button if active */}
                        {isCurrentActive && (
                          <button
                            onClick={() => onRevoke(cert)}
                            className="px-2 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
