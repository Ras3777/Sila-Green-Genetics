import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export type UniversalListingTab = 'overview' | 'genetics' | 'pedigree' | 'documents' | 'logistics';

export function useUniversalListingDetail(listingId: string) {
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
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const animal = listing?.animalId ? animals.find((a) => a.id === listing.animalId) : null;

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<UniversalListingTab>('overview');

  // Modals
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(listing ? listing.askingPrice : 0);
  const [offerMessage, setOfferMessage] = useState('');

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveDeposit, setReserveDeposit] = useState(listing ? Math.round(listing.askingPrice * 0.1) : 500);

  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionType, setInspectionType] = useState('VETERINARY_CLINICAL');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectorName, setInspectorName] = useState('');

  // Target Herd for Fit
  const [targetHerdId, setTargetHerdId] = useState(herds[0]?.id || 'herd-1');

  const isSaved = listing ? savedListingIds.includes(listing.id) : false;
  const isCompared = listing ? compareListingIds.includes(listing.id) : false;

  const herdFit = listing?.animalId ? getHerdFit(listing.animalId, targetHerdId) : null;

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
    alert('Offer successfully submitted!');
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
      subject: inquirySubject || `Commercial inquiry on ${listing.title}`,
      message: inquiryMessage,
      inquiryType: 'GENERAL',
      status: 'OPEN',
    });
    setShowInquiryModal(false);
    alert('Inquiry sent to seller!');
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
    });
    setShowReserveModal(false);
    alert('Asset reservation confirmed!');
    router.push('/bovine/marketplace/orders');
  };

  const handleRequestInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInspectionModal(false);
    alert(`Pre-purchase inspection scheduled for ${inspectionDate || 'next business day'}. Inspector: ${inspectorName || 'Assigned DVM'}`);
  };

  return {
    listing,
    animal,
    isSaved,
    isCompared,
    activeMediaIdx,
    setActiveMediaIdx,
    activeTab,
    setActiveTab,
    herdFit,
    targetHerdId,
    setTargetHerdId,
    toggleSaveListing,
    toggleCompareListing,
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
    // Inspection modal
    showInspectionModal,
    setShowInspectionModal,
    inspectionType,
    setInspectionType,
    inspectionDate,
    setInspectionDate,
    inspectorName,
    setInspectorName,
    handleRequestInspection,
  };
}
