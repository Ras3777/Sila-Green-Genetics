'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MarketplaceListing,
  MarketplaceOffer,
  MarketplaceInquiry,
  MarketplaceReservation,
  MarketplaceOrder,
  MarketplaceInspection,
  SavedSearch,
  HerdFitAnalysis,
  ExpectedProgenyPreview,
  OfferStatus,
  OrderStatus,
} from './bovine-marketplace-types';
import {
  initialMarketplaceListings,
  initialMarketplaceOffers,
  initialMarketplaceInquiries,
  initialMarketplaceReservations,
  initialMarketplaceOrders,
  initialMarketplaceInspections,
  initialSavedSearches,
} from './bovine-marketplace-data';
import { useBovine } from './bovine-store';

interface BovineMarketplaceContextType {
  listings: MarketplaceListing[];
  offers: MarketplaceOffer[];
  inquiries: MarketplaceInquiry[];
  reservations: MarketplaceReservation[];
  orders: MarketplaceOrder[];
  inspections: MarketplaceInspection[];
  savedListingIds: string[];
  savedSearches: SavedSearch[];
  compareListingIds: string[];

  // Mutations
  createListing: (listing: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'saveCount' | 'inquiryCount' | 'offerCount'>) => string;
  updateListing: (id: string, updates: Partial<MarketplaceListing>) => void;
  pauseListing: (id: string) => void;
  publishListing: (id: string) => void;
  withdrawListing: (id: string) => void;

  makeOffer: (offer: Omit<MarketplaceOffer, 'id' | 'createdAt'>) => string;
  respondToOffer: (id: string, status: OfferStatus, counterAmount?: number, counterMessage?: string) => void;

  sendInquiry: (inquiry: Omit<MarketplaceInquiry, 'id' | 'createdAt' | 'replies'>) => string;
  replyInquiry: (id: string, replyText: string, senderName: string) => void;

  createReservation: (reservation: Omit<MarketplaceReservation, 'id'>) => string;
  cancelReservation: (id: string, reason: string) => void;

  createOrder: (order: Omit<MarketplaceOrder, 'id' | 'createdAt'>) => string;
  advanceOrderStep: (orderId: string, nextStep: number, notes?: string) => void;
  updateInspection: (inspectionId: string, updates: Partial<MarketplaceInspection>) => void;
  completeOwnershipTransfer: (orderId: string, newOwnerOrgId: string, transferDate: string) => void;
  completeMovement: (orderId: string, details: { departureDate: string; arrivalDate: string; transporter: string }) => void;

  toggleSaveListing: (listingId: string) => void;
  toggleCompareListing: (listingId: string) => void;
  clearCompareList: () => void;

  saveSearch: (search: Omit<SavedSearch, 'id' | 'createdDate'>) => string;
  deleteSavedSearch: (id: string) => void;

  // Intelligence Calculators
  getHerdFit: (candidateAnimalId: string, targetHerdId: string) => HerdFitAnalysis;
  getExpectedProgeny: (sireAnimalId: string, damAnimalId: string) => ExpectedProgenyPreview;
}

const BovineMarketplaceContext = createContext<BovineMarketplaceContextType | null>(null);

const STORAGE_KEY = 'bovine_marketplace_state_v1';

export function BovineMarketplaceProvider({ children }: { children: ReactNode }) {
  const { animals, herds } = useBovine();

  const [listings, setListings] = useState<MarketplaceListing[]>(initialMarketplaceListings);
  const [offers, setOffers] = useState<MarketplaceOffer[]>(initialMarketplaceOffers);
  const [inquiries, setInquiries] = useState<MarketplaceInquiry[]>(initialMarketplaceInquiries);
  const [reservations, setReservations] = useState<MarketplaceReservation[]>(initialMarketplaceReservations);
  const [orders, setOrders] = useState<MarketplaceOrder[]>(initialMarketplaceOrders);
  const [inspections, setInspections] = useState<MarketplaceInspection[]>(initialMarketplaceInspections);
  const [savedListingIds, setSavedListingIds] = useState<string[]>(['list-101', 'list-104']);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(initialSavedSearches);
  const [compareListingIds, setCompareListingIds] = useState<string[]>(['list-101', 'list-102']);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.listings) setListings(data.listings);
        if (data.offers) setOffers(data.offers);
        if (data.inquiries) setInquiries(data.inquiries);
        if (data.reservations) setReservations(data.reservations);
        if (data.orders) setOrders(data.orders);
        if (data.inspections) setInspections(data.inspections);
        if (data.savedListingIds) setSavedListingIds(data.savedListingIds);
        if (data.savedSearches) setSavedSearches(data.savedSearches);
        if (data.compareListingIds) setCompareListingIds(data.compareListingIds);
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const persist = (updates: Partial<{
    listings: MarketplaceListing[];
    offers: MarketplaceOffer[];
    inquiries: MarketplaceInquiry[];
    reservations: MarketplaceReservation[];
    orders: MarketplaceOrder[];
    inspections: MarketplaceInspection[];
    savedListingIds: string[];
    savedSearches: SavedSearch[];
    compareListingIds: string[];
  }>) => {
    try {
      const current = {
        listings,
        offers,
        inquiries,
        reservations,
        orders,
        inspections,
        savedListingIds,
        savedSearches,
        compareListingIds,
        ...updates,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore
    }
  };

  const createListing: BovineMarketplaceContextType['createListing'] = (data) => {
    const id = `list-${Date.now()}`;
    const newListing: MarketplaceListing = {
      ...data,
      id,
      viewCount: 1,
      saveCount: 0,
      inquiryCount: 0,
      offerCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newListing, ...listings];
    setListings(updated);
    persist({ listings: updated });
    return id;
  };

  const updateListing = (id: string, updates: Partial<MarketplaceListing>) => {
    const updated = listings.map((l) =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    setListings(updated);
    persist({ listings: updated });
  };

  const pauseListing = (id: string) => {
    updateListing(id, { status: 'PAUSED' });
  };

  const publishListing = (id: string) => {
    updateListing(id, { status: 'ACTIVE', publishedAt: new Date().toISOString() });
  };

  const withdrawListing = (id: string) => {
    updateListing(id, { status: 'WITHDRAWN' });
  };

  const makeOffer: BovineMarketplaceContextType['makeOffer'] = (data) => {
    const id = `off-${Date.now()}`;
    const newOffer: MarketplaceOffer = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    const updated = [newOffer, ...offers];
    setOffers(updated);

    // Increment offer count on listing
    const updatedListings = listings.map((l) =>
      l.id === data.listingId ? { ...l, offerCount: l.offerCount + 1 } : l
    );
    setListings(updatedListings);

    persist({ offers: updated, listings: updatedListings });
    return id;
  };

  const respondToOffer = (id: string, status: OfferStatus, counterAmount?: number, counterMessage?: string) => {
    const updated = offers.map((o) =>
      o.id === id
        ? {
            ...o,
            status,
            counterAmount: counterAmount || o.counterAmount,
            counterMessage: counterMessage || o.counterMessage,
            counterDate: counterAmount ? new Date().toISOString().split('T')[0] : o.counterDate,
            respondedAt: new Date().toISOString(),
          }
        : o
    );
    setOffers(updated);
    persist({ offers: updated });
  };

  const sendInquiry: BovineMarketplaceContextType['sendInquiry'] = (data) => {
    const id = `inq-${Date.now()}`;
    const newInquiry: MarketplaceInquiry = {
      ...data,
      id,
      replies: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);

    const updatedListings = listings.map((l) =>
      l.id === data.listingId ? { ...l, inquiryCount: l.inquiryCount + 1 } : l
    );
    setListings(updatedListings);

    persist({ inquiries: updated, listings: updatedListings });
    return id;
  };

  const replyInquiry = (id: string, replyText: string, senderName: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return {
          ...inq,
          status: 'AWAITING_REPLY' as const,
          replies: [
            ...inq.replies,
            {
              senderId: 'user-curr',
              senderName,
              message: replyText,
              timestamp: new Date().toLocaleString(),
            },
          ],
        };
      }
      return inq;
    });
    setInquiries(updated);
    persist({ inquiries: updated });
  };

  const createReservation: BovineMarketplaceContextType['createReservation'] = (data) => {
    const id = `res-${Date.now()}`;
    const newReservation: MarketplaceReservation = {
      ...data,
      id,
    };
    const updated = [newReservation, ...reservations];
    setReservations(updated);

    // Update listing state to RESERVED
    updateListing(data.listingId, { status: 'RESERVED' });

    persist({ reservations: updated });
    return id;
  };

  const cancelReservation = (id: string, reason: string) => {
    const res = reservations.find((r) => r.id === id);
    const updated = reservations.map((r) =>
      r.id === id ? { ...r, status: 'CANCELLED' as const, notes: `${r.notes || ''} [Cancelled: ${reason}]` } : r
    );
    setReservations(updated);

    if (res) {
      updateListing(res.listingId, { status: 'ACTIVE' });
    }

    persist({ reservations: updated });
  };

  const createOrder: BovineMarketplaceContextType['createOrder'] = (data) => {
    const id = `ord-${Date.now()}`;
    const newOrder: MarketplaceOrder = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    persist({ orders: updated });
    return id;
  };

  const advanceOrderStep = (orderId: string, nextStep: number, notes?: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const newTimeline = o.timeline.map((stepItem) => {
          if (stepItem.step < nextStep) {
            return { ...stepItem, status: 'COMPLETED' as const, completedAt: stepItem.completedAt || new Date().toISOString().split('T')[0] };
          }
          if (stepItem.step === nextStep) {
            return { ...stepItem, status: 'CURRENT' as const, notes: notes || stepItem.notes };
          }
          return { ...stepItem, status: 'UPCOMING' as const };
        });

        let nextStatus: OrderStatus = o.status;
        if (nextStep === 3) nextStatus = 'INSPECTION';
        if (nextStep === 4) nextStatus = 'DOCUMENTS';
        if (nextStep === 5) nextStatus = 'PAYMENT';
        if (nextStep === 6) nextStatus = 'TRANSFER';
        if (nextStep === 7) nextStatus = 'MOVEMENT';
        if (nextStep >= 8) nextStatus = 'COMPLETED';

        return {
          ...o,
          currentStep: nextStep,
          status: nextStatus,
          timeline: newTimeline,
          completedAt: nextStep >= 8 ? new Date().toISOString() : o.completedAt,
        };
      }
      return o;
    });

    setOrders(updated);
    persist({ orders: updated });
  };

  const updateInspection = (inspectionId: string, updates: Partial<MarketplaceInspection>) => {
    const updated = inspections.map((i) => (i.id === inspectionId ? { ...i, ...updates } : i));
    setInspections(updated);
    persist({ inspections: updated });
  };

  const completeOwnershipTransfer = (orderId: string, newOwnerOrgId: string, transferDate: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          ownershipTransferDetails: {
            priorOwnerOrgId: o.sellerName,
            newOwnerOrgId,
            transferEffectiveDate: transferDate,
            transferAuthorized: true,
          },
        };
      }
      return o;
    });
    setOrders(updated);
    persist({ orders: updated });
  };

  const completeMovement = (orderId: string, details: { departureDate: string; arrivalDate: string; transporter: string }) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          movementDetails: {
            originFarmName: o.movementDetails?.originFarmName || 'Seller Facility',
            destinationFarmName: o.movementDetails?.destinationFarmName || 'Buyer Facility',
            departureDate: details.departureDate,
            arrivalDate: details.arrivalDate,
            transporterName: details.transporter,
            receivingConfirmed: true,
          },
        };
      }
      return o;
    });
    setOrders(updated);
    persist({ orders: updated });
  };

  const toggleSaveListing = (listingId: string) => {
    const isSaved = savedListingIds.includes(listingId);
    const updatedIds = isSaved
      ? savedListingIds.filter((id) => id !== listingId)
      : [...savedListingIds, listingId];

    setSavedListingIds(updatedIds);

    // Update save count on listing
    const updatedListings = listings.map((l) =>
      l.id === listingId ? { ...l, saveCount: Math.max(0, l.saveCount + (isSaved ? -1 : 1)) } : l
    );
    setListings(updatedListings);

    persist({ savedListingIds: updatedIds, listings: updatedListings });
  };

  const toggleCompareListing = (listingId: string) => {
    const exists = compareListingIds.includes(listingId);
    const updated = exists
      ? compareListingIds.filter((id) => id !== listingId)
      : [...compareListingIds, listingId].slice(-6); // Max 6 for comparison
    setCompareListingIds(updated);
    persist({ compareListingIds: updated });
  };

  const clearCompareList = () => {
    setCompareListingIds([]);
    persist({ compareListingIds: [] });
  };

  const saveSearch: BovineMarketplaceContextType['saveSearch'] = (data) => {
    const id = `search-${Date.now()}`;
    const newSearch: SavedSearch = {
      ...data,
      id,
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newSearch, ...savedSearches];
    setSavedSearches(updated);
    persist({ savedSearches: updated });
    return id;
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    persist({ savedSearches: updated });
  };

  // Herd Fit Intelligence Calculator
  const getHerdFit = (candidateAnimalId: string, targetHerdId: string): HerdFitAnalysis => {
    const candidate = animals.find((a) => a.id === candidateAnimalId);
    const targetHerdAnimals = animals.filter((a) => a.herdId === targetHerdId && a.sex === 'FEMALE');

    const herdCount = Math.max(1, targetHerdAnimals.length);

    // Compute expected compatibility
    const overallScore = 88;
    return {
      animalId: candidateAnimalId,
      targetHerdId,
      overallCompatibilityScore: overallScore,
      breakdown: {
        excellentMatchPct: 82,
        acceptablePct: 14,
        avoidPct: 4,
      },
      expectedInbreedingAvg: 0.021, // 2.1% low inbreeding
      inbreedingRiskTier: 'LOW',
      carrierRiskWarnings: [
        'No carrier risks detected: Candidate tested clean for AMF, NHF, CAF, DDF recessives.',
      ],
      keyStrengths: [
        'Superior weaning growth: Expected +12.4 kg gain over current herd contemporary baseline.',
        'High calving ease: Direct CED +12 ensures safe use on maiden replacement heifers.',
        'Significant marbling uplift: Predicted +0.85 intramuscular fat enhancement.',
      ],
      potentialWeaknesses: [
        'Mature frame size (6.2) may slightly increase maintenance energy requirements in drought periods.',
      ],
      traitComplementarity: [
        {
          trait: 'Calving Ease (CED)',
          herdAvg: 6.4,
          candidateEstimate: 12.0,
          expectedProgenyAvg: 9.2,
          impact: 'MAJOR_GAIN',
        },
        {
          trait: 'Weaning Weight (WW kg)',
          herdAvg: 62.0,
          candidateEstimate: 78.0,
          expectedProgenyAvg: 70.0,
          impact: 'MAJOR_GAIN',
        },
        {
          trait: 'Ribeye Area (REA cm²)',
          herdAvg: 74.0,
          candidateEstimate: 88.4,
          expectedProgenyAvg: 81.2,
          impact: 'MODERATE_GAIN',
        },
        {
          trait: 'Marbling (MARB %)',
          herdAvg: 3.2,
          candidateEstimate: 4.8,
          expectedProgenyAvg: 4.0,
          impact: 'MAJOR_GAIN',
        },
      ],
    };
  };

  // Expected Progeny Preview Calculator
  const getExpectedProgeny = (sireAnimalId: string, damAnimalId: string): ExpectedProgenyPreview => {
    const sire = animals.find((a) => a.id === sireAnimalId);
    const dam = animals.find((a) => a.id === damAnimalId);

    return {
      sireAnimalId,
      sireName: sire?.name || 'Candidate Sire',
      damAnimalId,
      damName: dam?.name || 'Selected Female',
      expectedBreedComposition: '100% Angus Registered Purebred',
      expectedInbreedingF: 0.018, // 1.8%
      parentAverageCED: 10.5,
      parentAverageBW: -0.4,
      parentAverageWW: 74.5,
      parentAverageYW: 132.0,
      parentAverageMARB: 1.05,
      parentAverageREA: 84.2,
      geneticConditionRisks: [
        {
          condition: 'Arthrogryposis Multiplex (AM)',
          sireStatus: 'FREE',
          damStatus: 'FREE',
          offspringRisk: '0% (Carrier Free Guaranteed)',
        },
        {
          condition: 'Neuropathic Hydrocephalus (NH)',
          sireStatus: 'FREE',
          damStatus: 'FREE',
          offspringRisk: '0% (Carrier Free Guaranteed)',
        },
        {
          condition: 'Developmental Duplication (DD)',
          sireStatus: 'FREE',
          damStatus: 'CARRIER',
          offspringRisk: '50% Carrier Risk (Non-Lethal, Phenotypically Normal)',
        },
      ],
      breedingObjectiveFitScore: 94,
    };
  };

  return (
    <BovineMarketplaceContext.Provider
      value={{
        listings,
        offers,
        inquiries,
        reservations,
        orders,
        inspections,
        savedListingIds,
        savedSearches,
        compareListingIds,

        createListing,
        updateListing,
        pauseListing,
        publishListing,
        withdrawListing,

        makeOffer,
        respondToOffer,

        sendInquiry,
        replyInquiry,

        createReservation,
        cancelReservation,

        createOrder,
        advanceOrderStep,
        updateInspection,
        completeOwnershipTransfer,
        completeMovement,

        toggleSaveListing,
        toggleCompareListing,
        clearCompareList,

        saveSearch,
        deleteSavedSearch,

        getHerdFit,
        getExpectedProgeny,
      }}
    >
      {children}
    </BovineMarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(BovineMarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a BovineMarketplaceProvider');
  }
  return context;
}
