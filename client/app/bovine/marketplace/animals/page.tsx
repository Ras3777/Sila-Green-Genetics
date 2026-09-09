'use client';

import React from 'react';
import { useLiveAnimalsMarketplace } from './_hooks/useLiveAnimalsMarketplace';
import {
  LiveAnimalsHeader,
  LiveAnimalsFilterSidebar,
  LiveAnimalsControlBar,
  LiveAnimalsGrid,
  LiveAnimalsHerdFitModal,
} from './_components';

export default function LiveAnimalsMarketplacePage() {
  const {
    animals,
    herds,
    liveAnimalListings,
    sortedListings,
    compareListingIds,
    savedListingIds,
    toggleCompareListing,
    toggleSaveListing,
    // Filters
    searchQuery,
    setSearchQuery,
    selectedBreed,
    setSelectedBreed,
    selectedSex,
    setSelectedSex,
    listingTypeFilter,
    setListingTypeFilter,
    carrierFreeOnly,
    setCarrierFreeOnly,
    dnaVerifiedOnly,
    setDnaVerifiedOnly,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSelectionIndex,
    setMinSelectionIndex,
    sortBy,
    setSortBy,
    resetFilters,
    // Herd fit modal
    fitModalListing,
    setFitModalListing,
    selectedTargetHerd,
    setSelectedTargetHerd,
    activeFitAnalysis,
  } = useLiveAnimalsMarketplace();

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Top Breadcrumb & Header */}
      <LiveAnimalsHeader
        compareCount={compareListingIds.length}
        liveAnimalCount={liveAnimalListings.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <LiveAnimalsFilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSex={selectedSex}
              setSelectedSex={setSelectedSex}
              selectedBreed={selectedBreed}
              setSelectedBreed={setSelectedBreed}
              listingTypeFilter={listingTypeFilter}
              setListingTypeFilter={setListingTypeFilter}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minSelectionIndex={minSelectionIndex}
              setMinSelectionIndex={setMinSelectionIndex}
              dnaVerifiedOnly={dnaVerifiedOnly}
              setDnaVerifiedOnly={setDnaVerifiedOnly}
              carrierFreeOnly={carrierFreeOnly}
              setCarrierFreeOnly={setCarrierFreeOnly}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Listing Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar */}
            <LiveAnimalsControlBar
              listingCount={sortedListings.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Grid or Empty State */}
            <LiveAnimalsGrid
              sortedListings={sortedListings}
              animals={animals}
              savedListingIds={savedListingIds}
              compareListingIds={compareListingIds}
              onToggleCompare={toggleCompareListing}
              onToggleSave={toggleSaveListing}
              onOpenFitModal={(listing) => setFitModalListing(listing)}
              onClearFilters={resetFilters}
            />
          </div>
        </div>
      </div>

      {/* Quick Herd Fit Modal */}
      <LiveAnimalsHerdFitModal
        listing={fitModalListing}
        onClose={() => setFitModalListing(null)}
        selectedTargetHerd={selectedTargetHerd}
        setSelectedTargetHerd={setSelectedTargetHerd}
        herds={herds}
        activeFitAnalysis={activeFitAnalysis}
      />
    </div>
  );
}
