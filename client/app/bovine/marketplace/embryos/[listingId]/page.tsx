'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRightLeft,
  DollarSign,
  Building,
  Award,
  Activity,
  FileText,
  Truck,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Package,
  Layers,
  Dna,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function EmbryoListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.listingId as string;

  const { animals } = useBovine();
  const {
    listings,
    savedListingIds,
    compareListingIds,
    toggleSaveListing,
    toggleCompareListing,
    createOrder,
    makeOffer,
    sendInquiry,
    getExpectedProgeny,
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const details = listing?.embryoDetails;

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
        <h2 className="text-xl font-bold text-stone-900">Embryo Package Not Found</h2>
        <Link
          href="/bovine/marketplace/embryos"
          className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
        >
          Back to Embryo Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);
  const isCompared = compareListingIds.includes(listing.id);

  // Expected progeny calculations
  const progeny = details?.sireAnimalId && details?.donorCowAnimalId
    ? getExpectedProgeny(details.sireAnimalId, details.donorCowAnimalId)
    : null;

  const handleOrder = () => {
    const orderId = createOrder({
      listingId: listing.id,
      listingTitle: listing.title,
      assetType: 'EMBRYO',
      quantity: details?.quantity || 1,
      buyerId: 'usr-buyer-current',
      buyerName: 'Highland Cattle Co.',
      buyerOrgName: 'Highland Cattle Co.',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      sellerOrgName: listing.sellerOrgName,
      totalAmount: listing.askingPrice,
      currency: listing.currency,
      status: 'OFFER_ACCEPTED',
      currentStep: 2,
      inspectionStatus: 'WAIVED',
      paymentDetails: {
        paymentMethod: 'ESCROW',
        depositPaid: true,
        depositAmount: Math.round(listing.askingPrice * 0.15),
        finalPaymentPaid: false,
      },
      timeline: [
        { step: 1, title: 'Embryo Lot Order Placed', status: 'COMPLETED', completedAt: new Date().toISOString() },
        { step: 2, title: 'Cryo Shipper & Certificate Preparation', status: 'CURRENT' },
      ],
    });

    alert('Embryo lot order initiated in escrow! Redirecting to commercial order tracker...');
    router.push(`/bovine/marketplace/orders/${orderId}`);
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
            <Link href="/bovine/marketplace/embryos" className="hover:underline">Embryos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-purple-100 text-purple-800 rounded-lg">
                      {details?.ivfOrInVivo || 'IVF'} Lot
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 rounded-lg">
                      IETS {details?.grade || 'Grade 1'}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono bg-stone-100 text-stone-700 rounded-lg">
                      Direct Thaw (Ethylene Glycol)
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {listing.title}
                  </h1>
                  <p className="text-sm text-stone-600 mt-1">
                    Lot Code: <strong>{details?.embryoCode || 'EMB-2025-01'}</strong> • Cryo Facility: <strong>{details?.storageCenter || 'Boviteq Cryo Vault'}</strong>
                  </p>
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

              {/* Mating Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-stone-700">Donor Dam</div>
                  <div className="font-bold text-stone-900">{details?.donorName || 'Highland Blackcap 8912'}</div>
                  <div className="text-xs text-stone-600">Reg: AAA +19200451 • Proven Donor</div>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-stone-700">Mating Sire</div>
                  <div className="font-bold text-stone-900">{details?.sireName || 'GAR Sure Fire 6432'}</div>
                  <div className="text-xs text-stone-600">Reg: AAA +18652033 • Top 1% $B</div>
                </div>
              </div>

              {/* Embryological Specifications */}
              <div>
                <h3 className="text-xs font-mono uppercase text-stone-700 mb-3">Embryo Stage & Technical Specs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Development Stage</div>
                    <div className="text-base font-bold text-stone-900 mt-1">{details?.stage || 'Stage 6'}</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">Blastocyst</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Quality Grade</div>
                    <div className="text-base font-bold text-emerald-800 mt-1">{details?.grade || 'Grade 1'}</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">Excellent</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Preservation</div>
                    <div className="text-base font-bold text-stone-900 mt-1">Direct Thaw</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">1.5M Ethylene Glycol</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Package Quantity</div>
                    <div className="text-base font-bold text-emerald-800 mt-1">{details?.quantity || 4} Embryos</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">Sold as complete lot</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-stone-700">Breeder Mating Rationale</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Expected Progeny Preview */}
              {progeny && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-xs font-mono uppercase text-stone-700 flex items-center gap-1.5">
                    <Dna className="w-4 h-4 text-emerald-800" /> Simulated Parent Averages (Expected Progeny)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="text-stone-700 text-[10px]">Expected Inbreeding $F$</div>
                      <div className="font-bold text-emerald-800 text-sm mt-0.5">
                        {(progeny.expectedInbreedingF * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="text-stone-700 text-[10px]">Parent Avg CED</div>
                      <div className="font-bold text-stone-900 text-sm mt-0.5">+{progeny.parentAverageCED}</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="text-stone-700 text-[10px]">Parent Avg WW</div>
                      <div className="font-bold text-stone-900 text-sm mt-0.5">+{progeny.parentAverageWW} lbs</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="text-stone-700 text-[10px]">Parent Avg Marbling</div>
                      <div className="font-bold text-stone-900 text-sm mt-0.5">+{progeny.parentAverageMARB}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Purchase & Action Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
              <div>
                <div className="text-xs font-mono text-stone-700 uppercase">Package Asking Price</div>
                <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
                  ${listing.askingPrice.toLocaleString()} <span className="text-xs font-normal text-stone-700">USD</span>
                </div>
                <div className="text-xs text-stone-600 font-mono mt-1">
                  (${Math.round(listing.askingPrice / (details?.quantity || 1))} per embryo • {details?.quantity || 4} straws total)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs space-y-1.5">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" /> Commercial Guarantee
                </div>
                <p className="text-emerald-900">
                  Certified IETS wash protocols applied. Eligible for domestic transfer or authorized dry shipper courier dispatch.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleOrder}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Package className="w-4 h-4" /> Purchase Embryo Package
                </button>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Inquire with Embryologist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Inquire About Embryo Lot</h3>
              <button onClick={() => setShowInquiryModal(false)} className="p-1 text-stone-600 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendInquiry({
                  listingId: listing.id,
                  listingTitle: listing.title,
                  buyerId: 'usr-buyer-current',
                  buyerName: 'Highland Cattle Co.',
                  buyerOrgName: 'Highland Cattle Co.',
                  sellerId: listing.sellerId,
                  sellerName: listing.sellerName,
                  subject: inquirySubject || `Question regarding ${listing.title}`,
                  message: inquiryMessage,
                  inquiryType: 'GENERAL',
                  status: 'OPEN',
                });
                setShowInquiryModal(false);
                alert('Inquiry submitted!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Recipient synchronization timing"
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
                  placeholder="Ask questions about freeze protocol, thaw media, or shipping..."
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
