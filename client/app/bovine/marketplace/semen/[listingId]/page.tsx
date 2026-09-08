'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  TestTubes,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRightLeft,
  DollarSign,
  Building,
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
  Package,
  Layers,
  Thermometer,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function SemenListingDetailPage() {
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
    createOrder,
    getHerdFit,
  } = useMarketplace();

  const listing = listings.find((l) => l.id === listingId);
  const sire = listing?.animalId ? animals.find((a) => a.id === listing.animalId) : null;
  const details = listing?.semenDetails;

  const [doseCount, setDoseCount] = useState(10);
  const [shippingMethod, setShippingMethod] = useState<'RENTAL_SHIPPER' | 'CUSTOMER_SHIPPER'>('RENTAL_SHIPPER');

  // Modals
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(listing ? listing.askingPrice * 10 : 500);
  const [offerMessage, setOfferMessage] = useState('');

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Target Herd for Sire Fit
  const [targetHerdId, setTargetHerdId] = useState(herds[0]?.id || 'herd-1');

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
        <h2 className="text-xl font-bold text-stone-900">Semen Lot Not Found</h2>
        <Link
          href="/bovine/marketplace/semen"
          className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
        >
          Back to Semen Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);
  const isCompared = compareListingIds.includes(listing.id);

  // Pricing calculations
  const unitPrice = doseCount >= 50 ? listing.askingPrice * 0.85 : doseCount >= 20 ? listing.askingPrice * 0.9 : listing.askingPrice;
  const subtotal = Math.round(unitPrice * doseCount);
  const tankRentalFee = shippingMethod === 'RENTAL_SHIPPER' ? 120 : 0;
  const totalAmount = subtotal + tankRentalFee;

  const herdFit = listing.animalId ? getHerdFit(listing.animalId, targetHerdId) : null;

  const handleCreateOrder = () => {
    const orderId = createOrder({
      listingId: listing.id,
      listingTitle: `${doseCount}x Straws - ${listing.title}`,
      assetType: 'SEMEN',
      animalId: listing.animalId,
      quantity: doseCount,
      buyerId: 'usr-buyer-current',
      buyerName: 'Highland Cattle Co.',
      buyerOrgName: 'Highland Cattle Co.',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      sellerOrgName: listing.sellerOrgName,
      totalAmount,
      currency: listing.currency,
      status: 'OFFER_ACCEPTED',
      currentStep: 2, // Moves directly to reservation & deposit
      inspectionStatus: 'WAIVED',
      paymentDetails: {
        paymentMethod: 'DIRECT_SETTLEMENT',
        depositPaid: true,
        depositAmount: Math.round(totalAmount * 0.2),
        finalPaymentPaid: false,
      },
      timeline: [
        { step: 1, title: 'Commercial Order Created', status: 'COMPLETED', completedAt: new Date().toISOString(), actor: 'Highland Cattle Co.' },
        { step: 2, title: 'Cryo Vault Tank Preparation', status: 'CURRENT' },
      ],
    });

    alert('Semen purchase order submitted! Proceeding to commercial order view...');
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
            <Link href="/bovine/marketplace/semen" className="hover:underline">Semen</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-100 text-blue-800 rounded-lg">
                      {details?.sexedType === 'FEMALE_SEXED' ? 'Sexed Female (90%+)' : 'Conventional Straws'}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 rounded-lg">
                      CSS Health Certified
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono bg-stone-100 text-stone-700 rounded-lg">
                      Batch #{details?.batchNumber || 'SM-9021'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {listing.title}
                  </h1>
                  <p className="text-sm text-stone-600 mt-1">
                    AI Sire Registration: <strong>AAA +19844201</strong> • Cryo Vault: <strong>{details?.storageVault || 'Hawkeye Breeders'}</strong>
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

              {/* Lab Batch Specifications */}
              <div>
                <h3 className="text-xs font-mono uppercase text-stone-700 mb-3">Cryo Lab Quality & Motility Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Post-Thaw Motility</div>
                    <div className="text-base font-bold text-emerald-800 mt-1">{details?.motilityPercent || 65}%</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">CASA Verified</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Concentration</div>
                    <div className="text-base font-bold text-stone-900 mt-1">{details?.concentrationMml || 30}M / ml</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">0.5 ml Straws</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Cryo Protocol</div>
                    <div className="text-base font-bold text-stone-900 mt-1">{details?.cryoMethod || 'LN2 Vapor'}</div>
                    <div className="text-[10px] text-stone-600 mt-0.5">-196°C Storage</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-700 uppercase">Available Inventory</div>
                    <div className="text-base font-bold text-stone-900 mt-1">{details?.availableDoses || 120} straws</div>
                    <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">Ready for dispatch</div>
                  </div>
                </div>
              </div>

              {/* Description & Breeder Notes */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-stone-700">Sire Description & Production Remarks</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Sire EPD Evaluation Summary */}
              <div>
                <h3 className="text-xs font-mono uppercase text-stone-700 mb-3">AI Sire Genetic Evaluation (EPDs)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { trait: 'Calving Ease (CED)', val: '+12', pct: 'Top 10%' },
                    { trait: 'Birth Weight (BW)', val: '-1.4', pct: 'Top 5%' },
                    { trait: 'Weaning Weight (WW)', val: '+78', pct: 'Top 15%' },
                    { trait: 'Yearling Weight (YW)', val: '+138', pct: 'Top 10%' },
                    { trait: 'Marbling (MARB)', val: '+1.15', pct: 'Top 3%' },
                    { trait: 'Ribeye Area (REA)', val: '+0.88', pct: 'Top 15%' },
                    { trait: 'Selection Index ($B)', val: '+172', pct: 'Top 5%' },
                    { trait: 'Combined Index ($C)', val: '+298', pct: 'Top 4%' },
                  ].map((epd, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="text-[11px] text-stone-700 font-medium truncate">{epd.trait}</div>
                      <div className="text-base font-bold font-mono text-stone-900 mt-1">{epd.val}</div>
                      <div className="text-[10px] text-emerald-800 font-mono font-semibold mt-1">{epd.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryo Logistics & Dry Shipper Specifications */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800" /> Cryogenic Tank Dispatch & Safe Shipping
              </h3>
              <p className="text-xs text-stone-600">
                Straws are maintained at liquid nitrogen vapor temperature (-196°C) throughout transport. You may rent a certified vapor dry shipper (holding temperature for up to 21 days) or provide your own tank.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="font-bold text-stone-900">Rental Vapor Shipper ($120 fee)</div>
                  <div className="text-stone-600 mt-1">Includes pre-charged liquid nitrogen vapor tank with return FedEx prepaid shipping label.</div>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="font-bold text-stone-900">Vault-to-Vault Transfer</div>
                  <div className="text-stone-600 mt-1">Direct cryogenic transfer to Hawkeye, ABS, Select Sires, or Genex customer accounts.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Volume Straw Selector & Order Calculator */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
              <div>
                <div className="text-xs font-mono text-stone-700 uppercase">Straw Pricing Structure</div>
                <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
                  ${unitPrice} <span className="text-xs font-normal text-stone-700">/ straw</span>
                </div>
                <div className="text-xs text-emerald-800 font-medium mt-1">
                  {doseCount >= 50 ? 'Tier 3 (50+ straws): 15% discount applied' : doseCount >= 20 ? 'Tier 2 (20+ straws): 10% discount applied' : 'Standard dose pricing'}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">
                  Select Quantity of Straws
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setDoseCount(qty)}
                      className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                        doseCount === qty
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  max={details?.availableDoses || 100}
                  value={doseCount}
                  onChange={(e) => setDoseCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Shipper Choice */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1.5">Shipping Method</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="RENTAL_SHIPPER">Rental Vapor Shipper (+$120)</option>
                  <option value="CUSTOMER_SHIPPER">Customer Owned Shipper / Vault Transfer ($0)</option>
                </select>
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-600">
                  <span>{doseCount} straws @ ${unitPrice}</span>
                  <span>${subtotal}</span>
                </div>
                {tankRentalFee > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Liquid N2 Vapor Tank Rental</span>
                    <span>${tankRentalFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span>${totalAmount} USD</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleCreateOrder}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Package className="w-4 h-4" /> Order Straws Now
                </button>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Inquire with Cryo Lab
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
              <h3 className="text-lg font-bold text-stone-900">Inquire About Semen Lot</h3>
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
                  subject: inquirySubject || `Question about ${listing.title}`,
                  message: inquiryMessage,
                  inquiryType: 'SEMEN_QUALITY' as any,
                  status: 'OPEN',
                });
                setShowInquiryModal(false);
                alert('Inquiry sent to semen distributor!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Export certificate for Canadian delivery"
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
                  placeholder="Ask questions regarding tank compatibility, CSS certificates, or storage..."
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
