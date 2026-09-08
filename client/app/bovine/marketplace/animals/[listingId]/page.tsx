'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Layers,
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
  Info,
  Dna,
  Lock,
  Download,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function LiveAnimalListingDetailPage() {
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
    getHerdFit,
    getExpectedProgeny,
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const animal = listing?.animalId ? animals.find((a) => a.id === listing.animalId) : null;

  // Selected media index
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'genetics' | 'pedigree' | 'health_docs' | 'logistics' | 'progeny'>('genetics');

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

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
        <h2 className="text-xl font-bold text-stone-900">Listing Not Found</h2>
        <p className="text-sm text-stone-600 mt-2">The animal listing requested does not exist or has been removed.</p>
        <Link
          href="/bovine/marketplace/animals"
          className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
        >
          Return to Animal Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);
  const isCompared = compareListingIds.includes(listing.id);

  // Run Herd Fit
  const herdFit = listing.animalId ? getHerdFit(listing.animalId, targetHerdId) : null;

  // Run Progeny Preview
  const progenyPreview = listing.animalId && selectedMateId
    ? (animal?.sex === 'MALE'
        ? getExpectedProgeny(listing.animalId, selectedMateId)
        : getExpectedProgeny(selectedMateId, listing.animalId))
    : null;

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
    alert('Commercial offer submitted successfully! You can track negotiations in the Offers hub.');
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

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace/animals" className="hover:underline">Live Animals</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Main Grid: Left Gallery & Info, Right Commercial Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Media & Core Bio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative h-96 sm:h-[450px] bg-stone-900">
                {listing.media[activeMediaIdx]?.url ? (
                  <img
                    src={listing.media[activeMediaIdx].url}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono text-sm">
                    No Media Image Available
                  </div>
                )}

                {/* Media Title Overlay */}
                <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-medium">
                  {listing.media[activeMediaIdx]?.title || 'Profile Photo'}
                </div>
              </div>

              {/* Thumbnails */}
              {listing.media.length > 1 && (
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3 overflow-x-auto">
                  {listing.media.map((med, idx) => (
                    <button
                      key={med.id}
                      onClick={() => setActiveMediaIdx(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeMediaIdx === idx ? 'border-emerald-800 shadow-md scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={med.url} alt={med.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Animal Title & Biological Highlights */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                      {listing.listingType.replace('_', ' ')}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-stone-100 text-stone-700 rounded-lg">
                      {animal?.sex === 'MALE' ? 'Breeding Bull / Sire' : 'Breeding Cow / Donor'}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono text-stone-700 bg-stone-50 border border-stone-200 rounded-lg">
                      {animal?.breed || 'Purebred Angus'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {listing.title}
                  </h1>
                  <div className="text-sm text-stone-600 font-mono mt-1 flex flex-wrap items-center gap-3">
                    <span>Tag: <strong className="text-stone-900">{animal?.identifiers?.[0]?.value || 'TAG-601'}</strong></span>
                    <span>•</span>
                    <span>Reg #: <strong className="text-stone-900">AAA +19844201</strong></span>
                    <span>•</span>
                    <span>DOB: <strong className="text-stone-900">{animal?.birthDate || '2022-03-15'}</strong></span>
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
                    title={isCompared ? 'In Compare List' : 'Add to Compare'}
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
                    title={isSaved ? 'Saved' : 'Save Animal'}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-950">
                <span className="font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> System Trust Badges:
                </span>
                {listing.trustBadges.parentageDnaVerified && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> DNA Parentage Verified
                  </span>
                )}
                {listing.trustBadges.genotyped && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    <Dna className="w-3.5 h-3.5 text-blue-600" /> 100K HD Genotyped
                  </span>
                )}
                {listing.trustBadges.carrierFreeStatus && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-800" /> Carrier Free (AM, NH, CA, DD)
                  </span>
                )}
                {listing.trustBadges.healthClearanceCurrent && (
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    <Activity className="w-3.5 h-3.5 text-emerald-800" /> BSE & Health Current
                  </span>
                )}
                <Link
                  href={`/verify?id=${listing.animalId || listing.id}&from=marketplace`}
                  target="_blank"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-3 py-1 rounded-lg shadow-2xs hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Public Digital Twin</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </Link>
              </div>

              {/* Description & Marketing Highlights */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-stone-700">Breeder Remarks & Highlights</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {listing.highlights.map((h, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-stone-100 text-stone-800 rounded-lg font-medium">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deep Domain Biological Tabs */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="border-b border-stone-200 bg-stone-50 px-6 flex items-center gap-2 overflow-x-auto text-sm font-medium">
                <button
                  onClick={() => setActiveTab('genetics')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'genetics'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Genetic Evaluation & EPDs
                </button>
                <button
                  onClick={() => setActiveTab('pedigree')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'pedigree'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-4 h-4" /> 3-Generation Pedigree
                </button>
                <button
                  onClick={() => setActiveTab('health_docs')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'health_docs'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Certificates & Documents ({listing.documents.length})
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
                <button
                  onClick={() => setActiveTab('progeny')}
                  className={`py-4 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === 'progeny'
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Dna className="w-4 h-4" /> Progeny Simulation
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* Tab 1: Genetics & EPDs */}
                {activeTab === 'genetics' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div>
                        <div className="text-xs font-mono uppercase text-stone-700">Official Economic Index ($B)</div>
                        <div className="text-2xl font-extrabold font-mono text-emerald-800">
                          +{animal?.geneticProfile?.selectionIndex || 172}
                        </div>
                      </div>
                      <div className="text-right text-xs font-mono text-stone-700">
                        <div>Evaluation Run: <strong>Fall 2024 National Cattle Evaluation</strong></div>
                        <div>Genomic Method: <strong>Single-Step GBLUP</strong></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase text-stone-700 mb-3">Expected Progeny Differences (EPDs)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { trait: 'Calving Ease (CED)', val: '+12', acc: '0.84', pct: 'Top 10%' },
                          { trait: 'Birth Weight (BW)', val: '-1.4', acc: '0.91', pct: 'Top 5%' },
                          { trait: 'Weaning Weight (WW)', val: '+78', acc: '0.88', pct: 'Top 15%' },
                          { trait: 'Yearling Weight (YW)', val: '+138', acc: '0.86', pct: 'Top 10%' },
                          { trait: 'Marbling (MARB)', val: '+1.15', acc: '0.82', pct: 'Top 3%' },
                          { trait: 'Ribeye Area (REA)', val: '+0.88', acc: '0.81', pct: 'Top 15%' },
                          { trait: 'Maternal Milk (MILK)', val: '+28', acc: '0.79', pct: 'Top 25%' },
                          { trait: 'Docility (DOC)', val: '+24', acc: '0.75', pct: 'Top 15%' },
                        ].map((epd, idx) => (
                          <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                            <div className="text-[11px] text-stone-700 font-medium truncate">{epd.trait}</div>
                            <div className="text-base font-bold font-mono text-stone-900 mt-1">{epd.val}</div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-700 mt-1">
                              <span>Acc: {epd.acc}</span>
                              <span className="text-emerald-800 font-semibold">{epd.pct}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                      <h4 className="text-xs font-mono uppercase text-stone-700 mb-2">Genetic Defects & Conditions</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                          Arthrogryposis (AM): <strong>Free</strong>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                          Neuropathic Hydrocephalus (NH): <strong>Free</strong>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                          Contractural Arachnodactyly (CA): <strong>Free</strong>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                          Developmental Duplications (DD): <strong>Free</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: 3-Generation Pedigree */}
                {activeTab === 'pedigree' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase text-stone-700 mb-3">Certified Ancestry Lineage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      {/* Generation 1: Subject */}
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col justify-center">
                        <div className="text-[10px] text-emerald-800 uppercase font-bold">Candidate Subject</div>
                        <div className="text-sm font-bold text-stone-900 mt-1">{listing.title}</div>
                        <div className="text-stone-700 mt-0.5">{animal?.identifiers?.[0]?.value || 'TAG-601'}</div>
                      </div>

                      {/* Generation 2: Parents */}
                      <div className="space-y-3 flex flex-col justify-center">
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-700 uppercase font-semibold">Sire</div>
                          <div className="font-bold text-stone-900 mt-0.5">GAR Sure Fire 6432</div>
                          <div className="text-stone-700 text-[11px]">AAA +18652033</div>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-700 uppercase font-semibold">Dam</div>
                          <div className="font-bold text-stone-900 mt-0.5">Highland Blackcap 8912</div>
                          <div className="text-stone-700 text-[11px]">AAA +19200451</div>
                        </div>
                      </div>

                      {/* Generation 3: Grandparents */}
                      <div className="space-y-2 flex flex-col justify-center">
                        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
                          <span className="text-stone-700 text-[10px] uppercase">Sire's Sire:</span> Connealy In Sure 8524
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
                          <span className="text-stone-700 text-[10px] uppercase">Sire's Dam:</span> Chair Rock 5050 GAR 8086
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
                          <span className="text-stone-700 text-[10px] uppercase">Dam's Sire:</span> SydGen Enhance
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px]">
                          <span className="text-stone-700 text-[10px] uppercase">Dam's Dam:</span> Highland Blackcap 5410
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Documents Vault */}
                {activeTab === 'health_docs' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">Commercial Document Vault</h4>
                        <p className="text-xs text-stone-600">Access official veterinary health forms, registration certificates, and genomic reports.</p>
                      </div>
                    </div>

                    {/* Official Sovereign Certificate Trust Banner */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950 text-sm">Official Cryptographic Registry Certificate</div>
                          <div className="text-xs text-emerald-800 mt-0.5">
                            Authoritative, tamper-evident digital twin with verifiable SHA-256 binary hash and ECDSA signature.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/verify?id=${listing.animalId || listing.id}&from=marketplace`}
                          target="_blank"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Verify Digital Twin</span>
                        </Link>
                        <Link
                          href="/bovine/documents/verify"
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-600" />
                          <span>Validate PDF</span>
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {listing.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-stone-900">{doc.name}</div>
                              <div className="text-xs text-stone-700 font-mono flex items-center gap-2 mt-0.5">
                                <span>{doc.type.replace('_', ' ')}</span>
                                {doc.issueDate && <span>• Issued: {doc.issueDate}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 text-xs font-mono bg-stone-200 text-stone-700 rounded-md">
                              {doc.visibility.replace('_', ' ')}
                            </span>
                            {doc.visibility === 'PUBLIC' ? (
                              <button
                                onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                                className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" /> Download
                              </button>
                            ) : (
                              <span className="text-xs text-stone-600 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Unlocks upon inquiry/offer
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Logistics & Terms */}
                {activeTab === 'logistics' && (
                  <div className="space-y-5 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="text-xs font-mono text-stone-700 uppercase">Farm Dispatch Location</div>
                        <div className="font-bold text-stone-900 mt-1">{listing.farmName}</div>
                        <div className="text-xs text-stone-600 mt-0.5">{listing.region}</div>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="text-xs font-mono text-stone-700 uppercase">Transport Arrangements</div>
                        <div className="font-bold text-stone-900 mt-1">
                          {listing.logistics.transportArrangedBy === 'BOTH'
                            ? 'Buyer Pickup or Seller Hauling Available'
                            : `${listing.logistics.transportArrangedBy} Arranged`}
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5">
                          Delivery radius: up to {listing.logistics.deliveryRadiusKm || 300} km
                        </div>
                      </div>
                    </div>
                    {listing.logistics.notes && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="text-xs font-mono text-stone-700 uppercase mb-1">Logistics Notes</div>
                        <p className="text-xs text-stone-700">{listing.logistics.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 5: Progeny Simulation */}
                {activeTab === 'progeny' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">Virtual In-Silico Breeding Simulation</h4>
                        <p className="text-xs text-stone-600">Simulate expected parent averages and inbreeding coefficients by mating this animal with a female from your herd.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">
                        Select Dam from Your Herd
                      </label>
                      <select
                        value={selectedMateId}
                        onChange={(e) => setSelectedMateId(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        {potentialMates.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name || m.identifiers?.[0]?.value} ({m.breed || 'Angus'} - {m.sex})
                          </option>
                        ))}
                      </select>
                    </div>

                    {progenyPreview && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                            <div className="text-[11px] text-stone-700">Exp. Inbreeding $F$</div>
                            <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">
                              {(progenyPreview.expectedInbreedingF * 100).toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-stone-600">Safe pedigree threshold</div>
                          </div>
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                            <div className="text-[11px] text-stone-700">Parent Avg CED</div>
                            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                              +{progenyPreview.parentAverageCED}
                            </div>
                          </div>
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                            <div className="text-[11px] text-stone-700">Parent Avg WW</div>
                            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                              +{progenyPreview.parentAverageWW} lbs
                            </div>
                          </div>
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                            <div className="text-[11px] text-stone-700">Parent Avg Marbling</div>
                            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                              +{progenyPreview.parentAverageMARB}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                          <div className="text-xs font-mono uppercase text-stone-700 mb-2">Genetic Condition Offspring Risk</div>
                          <div className="space-y-1.5 text-xs">
                            {progenyPreview.geneticConditionRisks.map((cond, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-none">
                                <span className="font-semibold text-stone-900">{cond.condition}</span>
                                <span className="font-mono text-emerald-800 font-bold">{cond.offspringRisk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Pricing, Commercial Action Card & Seller Profile */}
          <div className="space-y-6">
            {/* Commercial Action Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
              <div>
                <div className="text-xs font-mono text-stone-700 uppercase">Commercial Asking Price</div>
                <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
                  ${listing.askingPrice.toLocaleString()} <span className="text-sm font-normal text-stone-700">{listing.currency}</span>
                </div>
                {listing.priceNegotiable && (
                  <div className="text-xs text-emerald-800 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open to commercial offers & negotiations
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowReserveModal(true)}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Award className="w-4 h-4" /> Reserve Animal (14-Day Hold)
                </button>

                {listing.priceNegotiable && (
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-800" /> Make Commercial Offer
                  </button>
                )}

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Contact Breeder / Inquire
                </button>
              </div>

              {/* Herd Fit Score Widget */}
              {herdFit && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-700 uppercase">
                    <span>Herd Compatibility</span>
                    <span className="text-emerald-800 font-bold">{herdFit.overallCompatibilityScore}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${herdFit.overallCompatibilityScore}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-600 flex items-center justify-between">
                    <span>Inbreeding: {(herdFit.expectedInbreedingAvg * 100).toFixed(1)}%</span>
                    <span className="text-emerald-800 font-semibold">{herdFit.inbreedingRiskTier} RISK</span>
                  </div>
                </div>
              )}

              {/* Seller Information */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="text-xs font-mono text-stone-700 uppercase">Breeder & Farm</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold font-mono text-sm">
                    {listing.sellerOrgName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      {listing.sellerOrgName}
                      {listing.sellerVerified && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {listing.region}
                    </div>
                  </div>
                </div>
              </div>

              {/* Listing Metadata */}
              <div className="pt-4 border-t border-stone-100 space-y-1 text-xs text-stone-600 font-mono">
                <div>Listing ID: <strong>{listing.id}</strong></div>
                <div>Published: <strong>{listing.publishedAt || '2025-01-15'}</strong></div>
                <div>Views: <strong>{listing.viewCount}</strong> • Saves: <strong>{listing.saveCount}</strong></div>
              </div>
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
              <button onClick={() => setShowOfferModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600">
              Submit a formal purchase proposal for <strong className="text-stone-900">{listing.title}</strong>.
            </p>
            <form onSubmit={handleMakeOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Offer Amount ($ USD)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  required
                />
                <div className="text-[11px] text-stone-700 mt-1">Asking price: ${listing.askingPrice.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Terms or Conditions</label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g. Subject to BSE pass and 30-day health clearance."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Submit Offer
                </button>
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
              <h3 className="text-lg font-bold text-stone-900">Place 14-Day Asset Reservation</h3>
              <button onClick={() => setShowReserveModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600">
              Holding this animal locks out other buyers while you perform pre-purchase veterinary inspection and finalize transport.
            </p>
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Required Escrow Deposit ($ USD)</label>
                <input
                  type="number"
                  value={reserveDeposit}
                  onChange={(e) => setReserveDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  required
                />
                <div className="text-[11px] text-stone-700 mt-1">Typically 10% of asking price, held in escrow.</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
                <div>✓ 14 days exclusivity period</div>
                <div>✓ Right to veterinary clinical inspection</div>
                <div>✓ Refundable if veterinary inspection fails</div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReserveModal(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Confirm Reservation
                </button>
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
              <button onClick={() => setShowInquiryModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Inquiring regarding delivery options to Montana"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Write your questions regarding the animal, pedigree certificates, or transport..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
