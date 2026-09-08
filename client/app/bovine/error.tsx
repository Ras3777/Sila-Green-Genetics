'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function BovineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Bovine module error:', error);
  }, [error]);

  return (
    <div id="bovine-error-screen" className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-semibold text-stone-900 mb-2">Operational View Interrupted</h2>
      <p className="text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
        An unexpected error occurred while loading this bovine management record. You can attempt to retry the action or return to the main dashboard.
      </p>
      <div className="flex items-center space-x-3">
        <button
          id="btn-retry-error"
          onClick={() => reset()}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          id="btn-error-home"
          href="/bovine/dashboard"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Bovine Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
