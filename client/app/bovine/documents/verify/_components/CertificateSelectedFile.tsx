'use client';

import React from 'react';
import { FileText, Trash2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface CertificateSelectedFileProps {
  file: File;
  onRemove: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}

export function CertificateSelectedFile({
  file,
  onRemove,
  onVerify,
  isVerifying,
}: CertificateSelectedFileProps) {
  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
      <div className="flex items-center space-x-3.5 min-w-0">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
          <FileText className="w-6 h-6" />
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-stone-900 text-sm truncate">{file.name}</h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
            <span>{formatSize(file.size)}</span>
            <span>•</span>
            <span>{file.type || 'application/pdf'}</span>
            <span>•</span>
            <span className="text-emerald-800 font-bold font-sans">Ready for Verification</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          type="button"
          onClick={onRemove}
          disabled={isVerifying}
          className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>

        <button
          type="button"
          onClick={onVerify}
          disabled={isVerifying}
          className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Registry...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Certificate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
