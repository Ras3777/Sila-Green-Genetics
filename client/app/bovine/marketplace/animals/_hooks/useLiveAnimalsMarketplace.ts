import { useState } from 'react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import { MarketplaceListing } from '@/lib/bovine-marketplace-types';

export function useLiveAnimalsMarketplace() {
  const { animals, herds } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
    getHerdFit,
  } = useMarketplace();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [selectedSex, setSelectedSex] = useState('ALL');
  const [listingTypeFilter, setListingTypeFilter] = useState('ALL');
  const [carrierFreeOnly, setCarrierFreeOnly] = useState(false);
  const [dnaVerifiedOnly, setDnaVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minSelectionIndex, setMinSelectionIndex] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'indexDesc' | 'newest'>('featured');

  // Quick Herd Fit Modal State
  const [fitModalListing, setFitModalListing] = useState<MarketplaceListing | null>(null);
  const [selectedTargetHerd, setSelectedTargetHerd] = useState(herds[0]?.id || 'herd-1');

  // Live animal listings
  const liveAnimalListings = listings.filter((l) => l.assetType === 'LIVE_ANIMAL');

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBreed('ALL');
    setSelectedSex('ALL');
    setListingTypeFilter('ALL');
    setCarrierFreeOnly(false);
    setDnaVerifiedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setMinSelectionIndex('');
  };

  // Filter logic
  const filteredListings = liveAnimalListings.filter((listing) => {
    const animal = listing.animalId ? animals.find((a) => a.id === listing.animalId) : null;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDesc = listing.description.toLowerCase().includes(q);
      const matchSeller = listing.sellerOrgName.toLowerCase().includes(q);
      const matchTag = animal?.identifiers?.some((id: any) => id.value?.toLowerCase().includes(q));
      const matchBreed = animal?.breed?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller && !matchTag && !matchBreed) return false;
    }

    if (selectedBreed !== 'ALL') {
      if (animal && !animal.breed?.toLowerCase().includes(selectedBreed.toLowerCase())) {
        return false;
      }
    }

    if (selectedSex !== 'ALL') {
      if (animal && animal.sex !== selectedSex) return false;
    }

    if (listingTypeFilter !== 'ALL' && listing.listingType !== listingTypeFilter) {
      return false;
    }

    if (carrierFreeOnly && !listing.trustBadges.carrierFreeStatus) {
      return false;
    }

    if (dnaVerifiedOnly && !listing.trustBadges.parentageDnaVerified) {
      return false;
    }

    if (minPrice !== '' && listing.askingPrice < minPrice) return false;
    if (maxPrice !== '' && listing.askingPrice > maxPrice) return false;

    if (minSelectionIndex !== '') {
      const index = animal?.geneticProfile?.selectionIndex || 0;
      if (index < minSelectionIndex) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    const aAnim = a.animalId ? animals.find((an) => an.id === a.animalId) : null;
    const bAnim = b.animalId ? animals.find((an) => an.id === b.animalId) : null;

    if (sortBy === 'priceAsc') return a.askingPrice - b.askingPrice;
    if (sortBy === 'priceDesc') return b.askingPrice - a.askingPrice;
    if (sortBy === 'indexDesc') {
      const aIdx = aAnim?.geneticProfile?.selectionIndex || 0;
      const bIdx = bAnim?.geneticProfile?.selectionIndex || 0;
      return bIdx - aIdx;
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; // featured default
  });

  const activeFitAnalysis = fitModalListing && fitModalListing.animalId
    ? getHerdFit(fitModalListing.animalId, selectedTargetHerd)
    : null;

  return {
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
  };
}
