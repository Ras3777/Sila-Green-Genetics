'use client';

import React, { useState } from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { useBovineTrust } from '@/lib/bovine-trust-store';
import { Download, Printer, Eye, QrCode, ShieldCheck, Loader2 } from 'lucide-react';
import { CertificateViewerModal } from './CertificateViewerModal';
import { CertificateQrModal } from './CertificateQrModal';

interface CertificatePdfActionsProps {
  certificate: CertificateRecord;
  variant?: 'toolbar' | 'compact' | 'dropdown';
  onVerifyClick?: () => void;
}

export function CertificatePdfActions({
  certificate,
  variant = 'toolbar',
  onVerifyClick,
}: CertificatePdfActionsProps) {
  const { downloadCertificate, printCertificate } = useBovineTrust();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCertificate(certificate);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintStatus('Preparing Official Document...');
    try {
      const res = await printCertificate(certificate);
      if (res.success) {
        setPrintStatus('Print dialog ready');
        setTimeout(() => setPrintStatus(null), 3000);
      } else {
        setPrintStatus('Print failed: Download PDF manually');
        setTimeout(() => setPrintStatus(null), 4000);
      }
    } finally {
      setIsPrinting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsViewerOpen(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Preview official PDF"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Download signed original PDF"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Print official certificate"
          >
            {isPrinting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsQrOpen(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Show Public QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        </div>

        {isViewerOpen && (
          <CertificateViewerModal certificate={certificate} onClose={() => setIsViewerOpen(false)} />
        )}
        {isQrOpen && (
          <CertificateQrModal certificate={certificate} onClose={() => setIsQrOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsViewerOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview PDF</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
          ) : (
            <Download className="w-3.5 h-3.5 text-stone-600" />
          )}
          <span>Download Original</span>
        </button>

        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPrinting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
          ) : (
            <Printer className="w-3.5 h-3.5 text-stone-600" />
          )}
          <span>Print</span>
        </button>

        <button
          onClick={() => setIsQrOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          title="Show Public QR Code"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Show QR</span>
        </button>

        {onVerifyClick && (
          <button
            onClick={onVerifyClick}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
        )}

        {printStatus && (
          <span className="text-[11px] font-mono text-stone-500 animate-pulse">{printStatus}</span>
        )}
      </div>

      {isViewerOpen && (
        <CertificateViewerModal certificate={certificate} onClose={() => setIsViewerOpen(false)} />
      )}
      {isQrOpen && (
        <CertificateQrModal certificate={certificate} onClose={() => setIsQrOpen(false)} />
      )}
    </>
  );
}
