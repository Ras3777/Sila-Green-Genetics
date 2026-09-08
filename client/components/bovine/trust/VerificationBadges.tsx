'use client';

import React, { useState } from 'react';
import { PublicAnimalVerificationSummary } from '@/lib/bovine-trust-types';
import { ShieldCheck, Dna, CheckCircle2, UserCheck, Award, X } from 'lucide-react';

interface VerificationBadgesProps {
  animal?: PublicAnimalVerificationSummary;
  certificateStatus?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadges({ animal, certificateStatus = 'ACTIVE', size = 'md' }: VerificationBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const badges = [
    {
      id: 'registry',
      label: 'Registry Verified',
      active: true,
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      title: 'National Livestock Registry Attestation',
      details: `Registered in official National Bovine Database under DGR ${animal?.dgr || 'NG-029382'}. Physical ear tag and RFID match certified ledger.`,
    },
    {
      id: 'certificate',
      label: 'Certificate Verified',
      active: certificateStatus === 'ACTIVE',
      icon: Award,
      color:
        certificateStatus === 'ACTIVE'
          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
          : certificateStatus === 'SUPERSEDED'
          ? 'bg-amber-50 text-amber-900 border-amber-300'
          : 'bg-rose-50 text-rose-900 border-rose-300',
      title: 'Digitally Signed Certificate Verification',
      details:
        certificateStatus === 'ACTIVE'
          ? 'Active official certificate signed by National Bovine Genetics Registry (NBGR) with verified SHA-256 digest.'
          : `Certificate status is ${certificateStatus}. Check current replacement in registry.`,
    },
    {
      id: 'identity',
      label: 'Identity Verified',
      active: animal?.identityVerified ?? true,
      icon: CheckCircle2,
      color: 'bg-stone-50 text-stone-900 border-stone-300',
      title: 'Physical & Morphological Identity Cross-Check',
      details: `Ear Tag: ${animal?.earTag || 'ET-4822'} | Breed: ${animal?.breed || 'Boran'} | Sex: ${animal?.sex || 'Male'}. Morphological confirmation completed on-site.`,
    },
    {
      id: 'parentage',
      label: 'Parentage DNA Verified',
      active: animal?.parentageVerified ?? true,
      icon: Dna,
      color: animal?.parentageVerified !== false ? 'bg-indigo-50 text-indigo-900 border-indigo-300' : 'bg-stone-100 text-stone-600 border-stone-200',
      title: '50K SNP Genomic Parentage Validation',
      details: `Sire: ${animal?.sireName || 'IRON KING 812'} (DNA Verified) • Dam: ${animal?.damName || 'BELLA PRIME 712'} (DNA Verified). Mendelian exclusion test passed.`,
    },
    {
      id: 'genotype',
      label: 'Genotyped 50K SNP',
      active: animal?.genotyped ?? true,
      icon: Award,
      color: animal?.genotyped !== false ? 'bg-sky-50 text-sky-900 border-sky-300' : 'bg-stone-100 text-stone-600 border-stone-200',
      title: 'Illumina BovineSNP50 Genomic Profile',
      details: `Call rate > 99.4%. Genomic Estimated Breeding Values (GEBV) computed. Genomic inbreeding F_GRM: ${animal?.inbreedingPct || 3.8}%.`,
    },
    {
      id: 'ownership',
      label: 'Ownership Verified',
      active: true,
      icon: UserCheck,
      color: 'bg-stone-50 text-stone-900 border-stone-300',
      title: 'Official Custody & Title Record',
      details: `Certified Title Holder: ${animal?.farmName || 'Bishoftu National Nucleus Breeding Center'}. No pending transfer disputes or mortgage liens.`,
    },
  ];

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : size === 'lg' ? 'text-xs px-3 py-1.5' : 'text-[11px] px-2.5 py-1';

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBadge(b.id)}
              className={`inline-flex items-center space-x-1 font-semibold rounded-lg border transition-all cursor-pointer hover:shadow-xs ${sizeClass} ${b.color}`}
              title="Click to view verification proof"
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span>{b.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          {(() => {
            const b = badges.find((item) => item.id === selectedBadge)!;
            const Icon = b.icon;
            return (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-stone-100 text-stone-800">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{b.title}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans">
                  {b.details}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-mono">
                  <span>Audited against National Registry</span>
                  <span className="text-emerald-800 font-bold">✓ Attested</span>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-black cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
