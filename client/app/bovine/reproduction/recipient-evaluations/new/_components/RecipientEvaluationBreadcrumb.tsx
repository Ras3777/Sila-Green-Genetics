'use client';

import React from 'react';
import Link from 'next/link';

export function RecipientEvaluationBreadcrumb() {
  return (
    <div className="flex items-center space-x-2 text-xs text-stone-500">
      <Link href="/bovine/reproduction" className="hover:text-emerald-800">
        Reproduction &amp; AI
      </Link>
      <span>/</span>
      <Link href="/bovine/reproduction/recipient-evaluations" className="hover:text-emerald-800">
        Recipient Evaluations
      </Link>
      <span>/</span>
      <span className="font-semibold text-stone-900">New Recipient Evaluation</span>
    </div>
  );
}
