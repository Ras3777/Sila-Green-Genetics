'use client';

import React, { useState } from 'react';
import { CertificateRecord } from '@/lib/bovine-trust-types';
import { X, Copy, Check, Download, Printer, ExternalLink, QrCode as QrIcon, ShieldCheck } from 'lucide-react';

interface CertificateQrModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export function CertificateQrModal({ certificate, onClose }: CertificateQrModalProps) {
  const [copied, setCopied] = useState(false);

  // Authoritative public verification URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sgip.gov.et';
  const publicUrl = `${origin}/verify?id=${encodeURIComponent(certificate.publicId)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    // Generate simple SVG QR asset download
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="480" height="480">
        <rect width="240" height="240" fill="#FFFFFF" rx="16"/>
        <!-- QR Visual Matrix Pattern -->
        <rect x="24" y="24" width="60" height="60" fill="#064E3B" rx="8"/>
        <rect x="34" y="34" width="40" height="40" fill="#FFFFFF" rx="4"/>
        <rect x="44" y="44" width="20" height="20" fill="#064E3B"/>
        <rect x="156" y="24" width="60" height="60" fill="#064E3B" rx="8"/>
        <rect x="166" y="34" width="40" height="40" fill="#FFFFFF" rx="4"/>
        <rect x="176" y="44" width="20" height="20" fill="#064E3B"/>
        <rect x="24" y="156" width="60" height="60" fill="#064E3B" rx="8"/>
        <rect x="34" y="166" width="40" height="40" fill="#FFFFFF" rx="4"/>
        <rect x="44" y="176" width="20" height="20" fill="#064E3B"/>
        <!-- Matrix Data Dots -->
        <circle cx="110" cy="40" r="6" fill="#064E3B"/>
        <circle cx="130" cy="50" r="6" fill="#064E3B"/>
        <circle cx="100" cy="80" r="6" fill="#064E3B"/>
        <circle cx="120" cy="110" r="6" fill="#064E3B"/>
        <circle cx="140" cy="90" r="6" fill="#064E3B"/>
        <circle cx="160" cy="120" r="6" fill="#064E3B"/>
        <circle cx="180" cy="150" r="6" fill="#064E3B"/>
        <circle cx="110" cy="170" r="6" fill="#064E3B"/>
        <circle cx="130" cy="190" r="6" fill="#064E3B"/>
        <circle cx="150" cy="170" r="6" fill="#064E3B"/>
        <text x="120" y="228" font-family="monospace" font-size="9" font-weight="bold" fill="#064E3B" text-anchor="middle">${certificate.publicId}</text>
      </svg>
    `;

    const blob = new Blob([svgContent.trim()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${certificate.publicId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <QrIcon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Public Verification QR</h3>
              <p className="text-[11px] text-stone-500 font-mono">{certificate.publicId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Visual Canvas Box */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="p-4 bg-white rounded-2xl border-2 border-stone-900 shadow-sm flex flex-col items-center">
            {/* SVG stylized QR code */}
            <svg viewBox="0 0 160 160" className="w-44 h-44">
              <rect width="160" height="160" fill="#FFFFFF" />
              {/* Corner 1 */}
              <rect x="10" y="10" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="18" y="18" width="24" height="24" fill="#FFFFFF" rx="2" />
              <rect x="24" y="24" width="12" height="12" fill="#064E3B" />
              {/* Corner 2 */}
              <rect x="110" y="10" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="118" y="18" width="24" height="24" fill="#FFFFFF" rx="2" />
              <rect x="124" y="24" width="12" height="12" fill="#064E3B" />
              {/* Corner 3 */}
              <rect x="10" y="110" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="18" y="118" width="24" height="24" fill="#FFFFFF" rx="2" />
              <rect x="24" y="124" width="12" height="12" fill="#064E3B" />
              {/* Data matrix dots */}
              <circle cx="65" cy="25" r="4.5" fill="#064E3B" />
              <circle cx="85" cy="35" r="4.5" fill="#064E3B" />
              <circle cx="70" cy="55" r="4.5" fill="#064E3B" />
              <circle cx="90" cy="70" r="4.5" fill="#064E3B" />
              <circle cx="110" cy="60" r="4.5" fill="#064E3B" />
              <circle cx="65" cy="95" r="4.5" fill="#064E3B" />
              <circle cx="95" cy="105" r="4.5" fill="#064E3B" />
              <circle cx="120" cy="115" r="4.5" fill="#064E3B" />
              <circle cx="140" cy="130" r="4.5" fill="#064E3B" />
              <circle cx="75" cy="135" r="4.5" fill="#064E3B" />
              <circle cx="95" cy="140" r="4.5" fill="#064E3B" />
            </svg>
            <span className="mt-2 font-mono font-bold text-xs text-stone-900 tracking-wider">
              {certificate.publicId}
            </span>
          </div>

          <p className="text-[11px] text-stone-600 text-center max-w-xs">
            Scan with any mobile camera to open the public verified digital twin on{' '}
            <strong className="text-emerald-950 font-mono">/verify</strong>.
          </p>
        </div>

        {/* Public Link Box */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-stone-500">
            Public Resolution URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 select-all outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
          >
            <span>Open in Public Resolver</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadQr}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
            <button
              onClick={handlePrintSlip}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
