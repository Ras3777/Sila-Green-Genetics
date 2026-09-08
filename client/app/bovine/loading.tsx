export default function BovineLoading() {
  return (
    <div id="bovine-loading-screen" className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold animate-pulse">
          B
        </div>
        <span className="text-lg font-medium text-stone-800 tracking-tight">Bovine Genetics Management</span>
      </div>
      <div className="flex items-center space-x-2 text-stone-500 text-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
        <span>Loading livestock operations...</span>
      </div>
    </div>
  );
}
