'use client';

import React from 'react';
import { CertificateStatus } from '@/lib/bovine-trust-types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, FileText, Ban } from 'lucide-react';

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function CertificateStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: CertificateStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'ACTIVE',
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'SUPERSEDED':
        return {
          label: 'SUPERSEDED',
          icon: Clock,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'REVOKED':
        return {
          label: 'REVOKED',
          icon: Ban,
          bg: 'bg-rose-50',
          text: 'text-rose-800',
          border: 'border-rose-200',
          dot: 'bg-rose-600',
        };
      case 'EXPIRED':
        return {
          label: 'EXPIRED',
          icon: AlertTriangle,
          bg: 'bg-stone-100',
          text: 'text-stone-700',
          border: 'border-stone-300',
          dot: 'bg-stone-500',
        };
      case 'SIGNING':
      case 'GENERATING':
      case 'REGISTERING':
        return {
          label: status,
          icon: Clock,
          bg: 'bg-sky-50',
          text: 'text-sky-800',
          border: 'border-sky-200',
          dot: 'bg-sky-600 animate-pulse',
        };
      case 'FAILED':
        return {
          label: 'FAILED',
          icon: XCircle,
          bg: 'bg-rose-100',
          text: 'text-rose-900',
          border: 'border-rose-300',
          dot: 'bg-rose-700',
        };
      case 'DRAFT':
      default:
        return {
          label: 'DRAFT',
          icon: FileText,
          bg: 'bg-stone-100',
          text: 'text-stone-700',
          border: 'border-stone-200',
          dot: 'bg-stone-400',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] space-x-1'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs space-x-2'
      : 'px-2.5 py-1 text-[11px] space-x-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold font-mono rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
}
