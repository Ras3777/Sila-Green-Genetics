'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Clock, HelpCircle } from 'lucide-react';

export type StampStatus = 'VERIFIED' | 'REVOKED' | 'SUPERSEDED' | 'INVALID' | 'UNKNOWN';

interface CryptographicVerificationStampProps {
  status: StampStatus;
  issuer?: string;
  digest?: string;
  timestamp?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'seal' | 'compact';
}

export function CryptographicVerificationStamp({
  status,
  issuer = 'National Bovine Genetics Registry',
  digest,
  timestamp,
  size = 'md',
  variant = 'seal',
}: CryptographicVerificationStampProps) {
  const getStyle = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          title: 'DIGITALLY ATTESTED',
          subtitle: 'Registry Verified Clean',
          icon: ShieldCheck,
          accent: 'text-emerald-900',
          bg: 'bg-emerald-50/90',
          border: 'border-emerald-700',
          ring: 'border-emerald-300',
          badgeBg: 'bg-emerald-800 text-white',
        };
      case 'REVOKED':
        return {
          title: 'CERTIFICATE VOID',
          subtitle: 'Officially Revoked',
          icon: ShieldX,
          accent: 'text-rose-900',
          bg: 'bg-rose-50/90',
          border: 'border-rose-700',
          ring: 'border-rose-300',
          badgeBg: 'bg-rose-800 text-white',
        };
      case 'SUPERSEDED':
        return {
          title: 'HISTORICAL DOCUMENT',
          subtitle: 'Superseded by Newer Version',
          icon: Clock,
          accent: 'text-amber-900',
          bg: 'bg-amber-50/90',
          border: 'border-amber-700',
          ring: 'border-amber-300',
          badgeBg: 'bg-amber-800 text-white',
        };
      case 'INVALID':
        return {
          title: 'SIGNATURE REJECTED',
          subtitle: 'Cryptographic Validation Failed',
          icon: ShieldAlert,
          accent: 'text-rose-900',
          bg: 'bg-rose-100',
          border: 'border-rose-800',
          ring: 'border-rose-400',
          badgeBg: 'bg-rose-900 text-white',
        };
      case 'UNKNOWN':
      default:
        return {
          title: 'UNVERIFIED REFERENCE',
          subtitle: 'Not in Official Registry',
          icon: HelpCircle,
          accent: 'text-stone-800',
          bg: 'bg-stone-100',
          border: 'border-stone-400',
          ring: 'border-stone-200',
          badgeBg: 'bg-stone-700 text-white',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border-2 ${style.border} ${style.bg} ${style.accent}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <div className="text-left font-mono">
          <div className="font-extrabold text-[11px] leading-tight tracking-wider">{style.title}</div>
          {digest && <div className="text-[9px] text-stone-600">SHA256: {digest.slice(0, 12)}...</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 border-dashed ${style.border} ${style.bg} shadow-xs text-center transition-all select-none overflow-hidden max-w-sm`}
    >
      {/* Outer decorative seal ring */}
      <div className={`absolute inset-1 rounded-xl border ${style.ring} pointer-events-none opacity-60`} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
          <span>Official Trust Mark</span>
        </div>

        <div className="flex items-center justify-center space-x-2 my-1">
          <Icon className={`w-5 h-5 ${style.accent}`} />
          <span className={`text-sm sm:text-base font-black tracking-wide ${style.accent}`}>
            {style.title}
          </span>
        </div>

        <p className="text-[11px] font-medium text-stone-700 mt-0.5">{style.subtitle}</p>

        <div className="mt-2.5 pt-2 border-t border-stone-200/80 w-full text-[10px] font-mono text-stone-600 space-y-0.5">
          <div className="truncate font-semibold">{issuer}</div>
          {timestamp && (
            <div className="text-stone-500 text-[9px]">
              Verified: {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          {digest && (
            <div className="text-[9px] text-stone-500 font-bold mt-1">
              DIGEST: <span className="text-stone-800">{digest.slice(0, 16)}...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
