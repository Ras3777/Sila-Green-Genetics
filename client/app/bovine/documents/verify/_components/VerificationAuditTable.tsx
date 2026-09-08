'use client';

import React, { useState } from 'react';
import { VerificationAuditEvent, VerificationStatus } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { Search, Download, Filter, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface VerificationAuditTableProps {
  audits: VerificationAuditEvent[];
  onSelectAudit?: (audit: VerificationAuditEvent) => void;
}

export function VerificationAuditTable({ audits, onSelectAudit }: VerificationAuditTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = audits.filter((a) => {
    if (statusFilter !== 'ALL' && a.result !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        (a.certificateId && a.certificateId.toLowerCase().includes(q)) ||
        a.verifiedBy.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['Verification ID', 'Certificate ID', 'Result', 'Source', 'Verified By', 'Timestamp', 'Notes'];
    const rows = filtered.map((a) => [
      a.id,
      a.certificateId || 'N/A',
      a.result,
      a.source,
      `"${a.verifiedBy.replace(/"/g, '""')}"`,
      a.verifiedAt,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verification_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h3 className="font-bold text-stone-900 text-sm flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>Statutory Verification Audit Trail</span>
          </h3>
          <p className="text-xs text-stone-500">
            Immutable log of all internal document validations and public QR verification events.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by ID, certificate, officer name, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 outline-none focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">All Outcomes</option>
            <option value="VALID">VALID (Passed)</option>
            <option value="HASH_MISMATCH">HASH_MISMATCH</option>
            <option value="REVOKED">REVOKED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="UNKNOWN_CERTIFICATE">UNKNOWN</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">Audit ID</th>
              <th className="py-3 px-3.5">Certificate ID</th>
              <th className="py-3 px-3.5">Verdict</th>
              <th className="py-3 px-3.5">Channel / Source</th>
              <th className="py-3 px-3.5">Verified By</th>
              <th className="py-3 px-3.5">Timestamp</th>
              <th className="py-3 px-3.5">Audit Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.length > 0 ? (
              filtered.map((audit) => (
                <tr
                  key={audit.id}
                  onClick={() => onSelectAudit && onSelectAudit(audit)}
                  className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-stone-900">{audit.id}</td>
                  <td className="py-3 px-3.5 font-mono text-emerald-900 font-semibold">
                    {audit.certificateId || '—'}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                        audit.result === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : audit.result === 'SUPERSEDED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {audit.result}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-stone-500">{audit.source}</td>
                  <td className="py-3 px-3.5 font-medium text-stone-800">{audit.verifiedBy}</td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-stone-500">
                    {new Date(audit.verifiedAt).toLocaleDateString()}{' '}
                    {new Date(audit.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3.5 text-stone-600 max-w-xs truncate">{audit.notes || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-500">
                  No matching verification audit records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
