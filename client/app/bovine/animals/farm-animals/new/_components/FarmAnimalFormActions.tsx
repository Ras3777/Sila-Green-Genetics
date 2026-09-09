'use client';

import React from 'react';
import Link from 'next/link';

export function FarmAnimalFormActions() {
  return (
    <div className="flex items-center justify-end space-x-3 pt-2">
      <Link
        href="/bovine/animals/farm-animals"
        className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
      >
        Cancel
      </Link>
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
      >
        Confirm &amp; Register Farm Animal
      </button>
    </div>
  );
}
