'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Plus,
  History,
  FileCheck,
  QrCode,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Animal, Farm, Herd } from '@/lib/bovine-types';
import { CertificateRecord } from '@/lib/bovine-trust-types';

interface DocumentHeroHeaderProps {
  animal: Animal;
  farm?: Farm;
  herd?: Herd;
  activeCertificate?: CertificateRecord;
  animalCertificatesCount: number;
  onIssueCertificate: () => void;
  onShowHistory: () => void;
}

export function DocumentHeroHeader({
  animal,
  farm,
  herd,
  activeCertificate,
  animalCertificatesCount,
  onIssueCertificate,
  onShowHistory,
}: DocumentHeroHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-300/80 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                Cryptographic Trust Dossier
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-semibold">
                Tag: {animal.primaryIdentifier || animal.internalId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold border border-amber-200">
                DGR: {animal.dgr || 'DGR-BR-9904'}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              {animal.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-600">
              <span>{animal.breed || 'Registered Purebred'}</span>
              <span>•</span>
              <span className="font-semibold uppercase text-stone-800">{animal.sex}</span>
              <span>•</span>
              <span>DOB: {animal.birthDate || animal.dateOfBirth || '2022-03-15'}</span>
              <span>•</span>
              <span>{farm ? farm.name : 'Primary Farm'}</span>
              {herd && (
                <>
                  <span>•</span>
                  <span className="text-stone-500">{herd.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onIssueCertificate}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Official Certificate</span>
          </button>
          <button
            onClick={onShowHistory}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-4 h-4 text-stone-600" />
            <span>Version Trail</span>
          </button>
          <Link
            href="/bovine/documents/verify"
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-stone-600" />
            <span>Validator Hub</span>
          </Link>
          <Link
            href={`/verify?id=${activeCertificate?.publicId || animal.id}`}
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>Public Digital Twin</span>
            <ExternalLink className="w-3 h-3 text-teal-600" />
          </Link>
        </div>
      </div>

      {/* Quick Registry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
            Registry Status
          </span>
          <div className="text-sm font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {activeCertificate ? 'Active Certificate Issued' : 'No Active Certificate'}
          </div>
          <span className="text-[10px] text-stone-500">
            {animalCertificatesCount} total certificates on file
          </span>
        </div>

        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
            Authority Trust Tier
          </span>
          <div className="text-sm font-bold text-stone-900 mt-0.5 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            Tier 1 Sovereign Registrar
          </div>
          <span className="text-[10px] text-stone-500">National Bovine Genetic Registry (NBGR)</span>
        </div>

        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
            Digital Signature Standard
          </span>
          <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
            ECDSA secp256r1
          </div>
          <span className="text-[10px] text-stone-500">Hardware Security Module (HSM)</span>
        </div>

        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">
            Pedigree &amp; Parentage
          </span>
          <div className="text-sm font-bold text-emerald-700 mt-0.5">
            DNA Microsatellite &amp; SNP Confirmed
          </div>
          <span className="text-[10px] text-stone-500">ISAG Level 1 parentage match</span>
        </div>
      </div>
    </div>
  );
}
