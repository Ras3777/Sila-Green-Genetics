import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function BovineNotFound() {
  return (
    <div id="bovine-not-found-screen" className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 mb-4">
        <Search className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-semibold text-stone-900 mb-2">Record or Location Not Found</h2>
      <p className="text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
        The requested animal profile, herd record, or operational screen could not be located. Check your animal identifier or selected farm scope.
      </p>
      <div className="flex items-center space-x-3">
        <Link
          id="btn-notfound-animals"
          href="/bovine/animals"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Animal Registry</span>
        </Link>
        <Link
          id="btn-notfound-dashboard"
          href="/bovine/dashboard"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
