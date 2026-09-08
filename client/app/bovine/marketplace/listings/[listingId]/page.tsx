'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRightLeft,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  Award,
  Activity,
  FileText,
  Truck,
  MessageSquare,
  AlertCircle,
  Clock,
  Check,
  X,
  Share2,
  Dna,
  Lock,
  Download,
  Package,
  Layers,
  TestTubes,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function UniversalListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.listingId as string;

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
    createOrder,
    getHerdFit,
    getExpectedProgeny,
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const animal = listing?.animalId ? animals.find((a) => a.id === listing.animalId) : null;

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'genetics' | 'pedigree' | 'documents' | 'logistics'>('overview');

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

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
        <h2 className="text-xl font-bold text-stone-900">Listing Not Found</h2>
        <p className="text-sm text-stone-600 mt-2">The requested genetic lot does not exist or has expired.</p>
        <Link
          href="/bovine/marketplace/listings"
          className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
        >
          Return to Marketplace Directory
        </Link>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);
  const isCompared = compareListingIds.includes(listing.id);

  const herdFit = listing.animalId ? getHerdFit(listing.animalId, targetHerdId) : null;

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace/listings" className="hover:underline">Directory</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative h-96 bg-stone-900">
                {listing.media[activeMediaIdx]?.url ? (
                  <img
                    src={listing.media[activeMediaIdx].url}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono text-sm">
                    {listing.assetType}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-medium">
                  {listing.media[activeMediaIdx]?.title || 'Visual Media'}
                </div>
              </div>

              {listing.media.length > 1 && (
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3 overflow-x-auto">
                  {listing.media.map((med, idx) => (
                    <button
                      key={med.id}
                      onClick={() => setActiveMediaIdx(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeMediaIdx === idx ? 'border-emerald-800 scale-105' : 'border-stone-200 opacity-70'
                      }`}
                    >
                      <img src={med.url} alt={med.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header info */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                      {listing.assetType.replace('_', ' ')}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-stone-100 text-stone-700 rounded-lg">
                      {listing.listingType.replace('_', ' ')}
                    </span>
                    {animal?.breed && (
                      <span className="px-2.5 py-1 text-xs font-mono text-stone-700 bg-stone-50 border border-stone-200 rounded-lg">
                        {animal.breed}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {listing.title}
                  </h1>
                  <div className="text-xs text-stone-600 font-mono mt-1 flex items-center gap-2">
                    <span>Seller: <strong>{listing.sellerOrgName}</strong></span>
                    <span>•</span>
                    <span>Location: <strong>{listing.region}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompareListing(listing.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isCompared
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleSaveListing(listing.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-950">
                <span className="font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> System Trust Badges:
                </span>
                {listing.trustBadges.parentageDnaVerified && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> DNA Parentage Verified
                  </span>
                )}
                {listing.trustBadges.genotyped && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Dna className="w-3.5 h-3.5 text-blue-600" /> Genotyped 100K
                  </span>
                )}
                {listing.trustBadges.carrierFreeStatus && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-800" /> Carrier-Free
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-stone-700">Description & Highlights</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {listing.highlights.map((h, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-stone-100 text-stone-800 rounded-lg font-medium">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deep Tabs */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="border-b border-stone-200 bg-stone-50 px-6 flex items-center gap-2 overflow-x-auto text-sm font-medium">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'overview'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Commercial Overview
                </button>
                <button
                  onClick={() => setActiveTab('genetics')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'genetics'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Genetics & EPDs
                </button>
                <button
                  onClick={() => setActiveTab('pedigree')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'pedigree'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Dna className="w-4 h-4" /> Certified Pedigree
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'documents'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Documents Vault ({listing.documents.length})
                </button>
                <button
                  onClick={() => setActiveTab('logistics')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'logistics'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Truck className="w-4 h-4" /> Logistics & Delivery
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Asset Type</div>
                        <div className="font-bold text-stone-900 mt-1">{listing.assetType}</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Status</div>
                        <div className="font-bold text-emerald-800 mt-1">{listing.status}</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Available From</div>
                        <div className="font-bold text-stone-900 mt-1">{listing.availableFrom}</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Inquiries Received</div>
                        <div className="font-bold text-stone-900 mt-1">{listing.inquiryCount}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'genetics' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase text-stone-700">Official EPD Evaluation</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] text-stone-700">Calving Ease (CED)</div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">+12</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] text-stone-700">Birth Weight (BW)</div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">-1.4</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] text-stone-700">Weaning Weight (WW)</div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">+78 lbs</div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] text-stone-700">Marbling Score (MARB)</div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">+1.15</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pedigree' && (
                  <div className="space-y-4 text-xs font-mono">
                    <h4 className="text-xs uppercase text-stone-700">Pedigree Ancestry Lineage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Sire</div>
                        <div className="font-bold text-stone-900 mt-1">GAR Sure Fire 6432</div>
                        <div className="text-stone-700 text-[11px]">AAA +18652033</div>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="text-[10px] text-stone-700 uppercase">Dam</div>
                        <div className="font-bold text-stone-900 mt-1">Highland Blackcap 8912</div>
                        <div className="text-stone-700 text-[11px]">AAA +19200451</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    {listing.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-800" />
                          <div>
                            <div className="font-bold text-stone-900 text-sm">{doc.name}</div>
                            <div className="text-stone-700 font-mono">{doc.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md font-mono">
                            {doc.visibility}
                          </span>
                          {doc.visibility === 'PUBLIC' ? (
                            <button
                              onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                              className="px-3 py-1.5 font-semibold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </button>
                          ) : (
                            <span className="text-stone-600 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'logistics' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="font-bold text-stone-900 text-sm">Transport & Fulfillment</div>
                      <div className="text-stone-700 mt-1">
                        Transport arrangement: <strong>{listing.logistics.transportArrangedBy}</strong>
                      </div>
                      <div className="text-stone-700 mt-0.5">
                        Delivery radius: <strong>{listing.logistics.deliveryRadiusKm || 300} km</strong>
                      </div>
                      {listing.logistics.notes && (
                        <p className="mt-2 text-stone-700 italic">{listing.logistics.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
              <div>
                <div className="text-xs font-mono text-stone-700 uppercase">Asking Price</div>
                <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
                  ${listing.askingPrice.toLocaleString()} <span className="text-xs font-normal text-stone-700">{listing.currency}</span>
                </div>
                {listing.priceNegotiable && (
                  <div className="text-xs text-emerald-800 font-medium mt-1">
                    ✓ Open to commercial negotiation
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowReserveModal(true)}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Award className="w-4 h-4" /> Reserve Asset
                </button>

                {listing.priceNegotiable && (
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-800" /> Make Offer
                  </button>
                )}

                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-800" /> Request Inspection
                </button>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2 px-3 text-xs text-stone-600 hover:text-stone-900 hover:underline flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Send Commercial Inquiry
                </button>
              </div>

              {/* Herd Fit score */}
              {herdFit && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-stone-700 uppercase">
                    <span>Herd Compatibility</span>
                    <span className="text-emerald-800 font-bold">{herdFit.overallCompatibilityScore}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${herdFit.overallCompatibilityScore}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Make Commercial Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleMakeOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Offer Price ($ USD)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Terms or Message</label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g. Price includes freight delivery..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowOfferModal(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl">Submit Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reserve Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Reserve Asset (Hold)</h3>
              <button onClick={() => setShowReserveModal(false)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Escrow Deposit ($ USD)</label>
                <input
                  type="number"
                  value={reserveDeposit}
                  onChange={(e) => setReserveDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReserveModal(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl">Confirm Hold</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Commercial Inquiry</h3>
              <button onClick={() => setShowInquiryModal(false)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Inquiring regarding pedigree certificates"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowInquiryModal(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Schedule Pre-Purchase Inspection</h3>
              <button onClick={() => setShowInspectionModal(false)} className="p-1 text-stone-600 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleRequestInspection} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Inspection Type</label>
                <select
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="VETERINARY_CLINICAL">Veterinary Clinical & BSE Examination</option>
                  <option value="BUYER_PHYSICAL">Buyer On-Farm Physical Inspection</option>
                  <option value="GENOMIC_DOCUMENT_VERIFICATION">Genomic & Pedigree Verification</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Target Inspection Date</label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Designated Veterinarian / Inspector</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="e.g. Dr. Robert Vance, DVM"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-xl">Book Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
