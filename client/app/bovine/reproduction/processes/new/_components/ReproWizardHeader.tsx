'use client';

import React from 'react';
import Link from 'next/link';

interface ReproWizardHeaderProps {
  procedureType: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER';
  setProcedureType: (type: 'ARTIFICIAL_INSEMINATION' | 'EMBRYO_TRANSFER') => void;
}

export function ReproWizardHeader({
  procedureType,
  setProcedureType,
}: ReproWizardHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <Link href="/bovine/reproduction/processes" className="hover:text-emerald-800">
          Processes
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">New Process Wizard</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Lifecycle Wizard
          </span>
          <h1 className="text-xl font-bold text-stone-900 mt-1">
            Initiate Reproductive Procedure (AI / ET)
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Step-by-step workflow covering synchronization, donor &amp; sire genetics, service recording, and automated gestation schedules.
          </p>
        </div>

        {/* Procedure Selector Pill */}
        <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
          <button
            type="button"
            onClick={() => setProcedureType('ARTIFICIAL_INSEMINATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              procedureType === 'ARTIFICIAL_INSEMINATION'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Artificial Insemination (AI)
          </button>
          <button
            type="button"
            onClick={() => setProcedureType('EMBRYO_TRANSFER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              procedureType === 'EMBRYO_TRANSFER'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Embryo Transfer (ET)
          </button>
        </div>
      </div>
    </div>
  );
}
