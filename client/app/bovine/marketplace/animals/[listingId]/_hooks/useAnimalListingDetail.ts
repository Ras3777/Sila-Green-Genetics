import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export type AnimalListingTab = 'genetics' | 'pedigree' | 'health_docs' | 'logistics' | 'progeny';

export function useAnimalListingDetail(listingId: string) {
  const router = useRouter();
  const { animals, herds } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
    makeOffer,
    sendInquiry,
    createReservation,
    getHerdFit,
    getExpectedProgeny,
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const animal = listing?.animalId ? animals.find((a) => a.id === listing.animalId) : null;

  // Selected media index
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AnimalListingTab>('genetics');

  // Modals state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(listing ? listing.askingPrice : 0);
  const [offerMessage, setOfferMessage] = useState('');

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveDeposit, setReserveDeposit] = useState(listing ? Math.round(listing.askingPrice * 0.1) : 500);

  // Herd Fit Target Herd
  const [targetHerdId, setTargetHerdId] = useState(herds[0]?.id || 'herd-1');

  // Expected Progeny Mate Selection (Select Cow for Bull or Sire for Cow)
  const potentialMates = animals.filter((a) => a.sex !== animal?.sex);
  const [selectedMateId, setSelectedMateId] = useState(potentialMates[0]?.id || '');

  const isSaved = listing ? savedListingIds.includes(listing.id) : false;
  const isCompared = listing ? compareListingIds.includes(listing.id) : false;

  // Run Herd Fit
  const herdFit = listing?.animalId ? getHerdFit(listing.animalId, targetHerdId) : null;

  // Run Progeny Preview
  const progenyPreview = listing?.animalId && selectedMateId
    ? (animal?.sex === 'MALE'
        ? getExpectedProgeny(listing.animalId, selectedMateId)
        : getExpectedProgeny(selectedMateId, listing.animalId))
    : null;

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    makeOffer({
      listingId: listing.id,
      listingTitle: listing.title,
      assetType: listing.assetType,
      buyerId: 'usr-buyer-current',
      buyerName: 'Highland Cattle Co.',
      buyerOrgName: 'Highland Cattle Co.',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      amount: Number(offerAmount),
      currency: listing.currency,
      status: 'PENDING',
      message: offerMessage,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    setShowOfferModal(false);
    alert('Commercial offer submitted successfully! You can track negotiations in the Offers hub.');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    sendInquiry({
      listingId: listing.id,
      listingTitle: listing.title,
      buyerId: 'usr-buyer-current',
      buyerName: 'Highland Cattle Co.',
      buyerOrgName: 'Highland Cattle Co.',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      subject: inquirySubject || `Commercial inquiry regarding ${listing.title}`,
      message: inquiryMessage,
      inquiryType: 'GENERAL',
      status: 'OPEN',
    });
    setShowInquiryModal(false);
    alert('Inquiry dispatched to seller. Check your commercial Inquiries hub for replies.');
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    createReservation({
      listingId: listing.id,
      listingTitle: listing.title,
      buyerId: 'usr-buyer-current',
      buyerName: 'Highland Cattle Co.',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      reservedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      depositRequired: true,
      depositAmount: Number(reserveDeposit),
      depositStatus: 'PENDING',
      inspectionRequired: true,
      status: 'CONFIRMED',
      conditions: 'Pending veterinary clinical inspection and health certificate signoff.',
    });
    setShowReserveModal(false);
    alert('Animal reserved for 14 days! Proceeding to order creation...');
    router.push('/bovine/marketplace/orders');
  };

  return {
    listing,
    animal,
    potentialMates,
    selectedMateId,
    setSelectedMateId,
    activeMediaIdx,
    setActiveMediaIdx,
    activeTab,
    setActiveTab,
    isSaved,
    isCompared,
    toggleSaveListing,
    toggleCompareListing,
    herdFit,
    progenyPreview,
    targetHerdId,
    setTargetHerdId,
    // Offer modal
    showOfferModal,
    setShowOfferModal,
    offerAmount,
    setOfferAmount,
    offerMessage,
    setOfferMessage,
    handleMakeOffer,
    // Inquiry modal
    showInquiryModal,
    setShowInquiryModal,
    inquirySubject,
    setInquirySubject,
    inquiryMessage,
    setInquiryMessage,
    handleSendInquiry,
    // Reserve modal
    showReserveModal,
    setShowReserveModal,
    reserveDeposit,
    setReserveDeposit,
    handleReserve,
  };
}
