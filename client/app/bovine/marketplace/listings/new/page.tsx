'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ChevronRight,
  Layers,
  TestTubes,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  Upload,
  FileText,
  Truck,
  Eye,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Dna,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';
import { MarketplaceAssetType, MarketplaceListingType, DocumentVisibility } from '@/lib/bovine-marketplace-types';

export default function NewMarketplaceListingPage() {
  const router = useRouter();
  const { animals, herds, farms } = useBovine();
  const { createListing } = useMarketplace();

  const [step, setStep] = useState(1);

  // Form State
  const [assetType, setAssetType] = useState<MarketplaceAssetType>('LIVE_ANIMAL');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');

  // Commercial Pricing
  const [listingType, setListingType] = useState<MarketplaceListingType>('NEGOTIABLE');
  const [askingPrice, setAskingPrice] = useState<number>(4500);
  const [minimumPrice, setMinimumPrice] = useState<number>(4000);
  const [priceNegotiable, setPriceNegotiable] = useState(true);

  // Semen specific
  const [semenBatch, setSemenBatch] = useState('SM-2025-X');
  const [semenMotility, setSemenMotility] = useState(65);
  const [semenConcentration, setSemenConcentration] = useState(30);
  const [semenDoses, setSemenDoses] = useState(50);
  const [semenVault, setSemenVault] = useState('Hawkeye Cryo Banking');
  const [semenSexedType, setSemenSexedType] = useState<'CONVENTIONAL' | 'FEMALE_SEXED' | 'MALE_SEXED'>('CONVENTIONAL');

  // Embryo specific
  const [embryoCode, setEmbryoCode] = useState('EMB-2025-LOT');
  const [embryoDonor, setEmbryoDonor] = useState('');
  const [embryoSire, setEmbryoSire] = useState('');
  const [embryoStage, setEmbryoStage] = useState('Stage 6');
  const [embryoGrade, setEmbryoGrade] = useState('Grade 1');
  const [embryoQty, setEmbryoQty] = useState(4);
  const [embryoMethod, setEmbryoMethod] = useState<'IVF' | 'IN_VIVO'>('IVF');

  // Presentation & Marketing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['DNA Parentage Verified', 'Top 5% Selection Index']);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaList, setMediaList] = useState<Array<{ id: string; url: string; title: string; type: 'IMAGE' }>>([]);

  // Documents
  const [docName, setDocName] = useState('Registry Certificate');
  const [docType, setDocType] = useState<'REGISTRY_CERT' | 'VET_HEALTH_CERT' | 'GENOMIC_REPORT'>('REGISTRY_CERT');
  const [docVisibility, setDocVisibility] = useState<DocumentVisibility>('PUBLIC');
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; type: any; visibility: DocumentVisibility; url: string; verified: boolean }>>([
    { id: 'doc-auto-1', name: 'Official Breed Registry Certificate', type: 'REGISTRY_CERT', visibility: 'PUBLIC', url: '#', verified: true },
    { id: 'doc-auto-2', name: 'Breeding Soundness Evaluation (BSE)', type: 'VET_HEALTH_CERT', visibility: 'AFTER_INQUIRY', url: '#', verified: true },
  ]);

  // Logistics
  const [transportArrangedBy, setTransportArrangedBy] = useState<'SELLER' | 'BUYER' | 'BOTH'>('BOTH');
  const [deliveryRadius, setDeliveryRadius] = useState(350);
  const [logisticsNotes, setLogisticsNotes] = useState('Hauling available via climate-controlled livestock trailer. Buyer pickup welcome.');

  // Privacy
  const [showLocation, setShowLocation] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  // Auto-fill from selected animal
  const handleSelectAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    const chosen = animals.find((a) => a.id === animalId);
    if (chosen) {
      setTitle(`${chosen.name || chosen.identifiers?.[0]?.value || 'Registered Animal'} - ${chosen.breed || 'Angus'}`);
      setDescription(`Exceptional registered ${chosen.breed} ${chosen.sex === 'MALE' ? 'breeding bull' : 'donor female'}. Sound feet, excellent maternal lines, and high economic selection index.`);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddMedia = () => {
    if (mediaUrl.trim()) {
      setMediaList([
        ...mediaList,
        { id: `med-${Date.now()}`, url: mediaUrl.trim(), title: 'Uploaded Photo', type: 'IMAGE' },
      ]);
      setMediaUrl('');
    }
  };

  const handlePublish = () => {
    const listingId = createListing({
      assetType,
      animalId: selectedAnimalId || undefined,
      semenDetails:
        assetType === 'SEMEN'
          ? {
              batchNumber: semenBatch,
              collectionDate: new Date().toISOString().split('T')[0],
              collectionCenter: semenVault,
              cryoMethod: 'Liquid Nitrogen Vapor',
              qualityGrade: 'CSS Approved',
              motilityPercent: semenMotility,
              concentrationMml: semenConcentration,
              availableDoses: semenDoses,
              storageVault: semenVault,
              sexedType: semenSexedType,
            }
          : undefined,
      embryoDetails:
        assetType === 'EMBRYO'
          ? {
              embryoCode,
              donorCowAnimalId: selectedAnimalId || 'anim-2',
              donorName: embryoDonor || 'Highland Blackcap 8912',
              sireAnimalId: 'anim-1',
              sireName: embryoSire || 'GAR Sure Fire 6432',
              collectionDate: new Date().toISOString().split('T')[0],
              stage: embryoStage,
              grade: embryoGrade,
              preservation: 'FROZEN',
              quantity: embryoQty,
              storageCenter: 'Boviteq Cryo Vault',
              ivfOrInVivo: embryoMethod,
            }
          : undefined,
      sellerId: 'usr-current',
      sellerName: 'Highland Cattle Co.',
      sellerOrgId: 'org-1',
      sellerOrgName: 'Highland Cattle Co.',
      sellerVerified: true,
      farmId: 'farm-1',
      farmName: 'North Pastures Farm',
      region: 'Montana, USA',
      listingType,
      status: 'ACTIVE',
      currency: 'USD',
      askingPrice: Number(askingPrice),
      minimumPrice: Number(minimumPrice),
      priceNegotiable,
      availableFrom: new Date().toISOString().split('T')[0],
      title: title || 'Registered Breeding Stock Listing',
      description,
      highlights,
      media:
        mediaList.length > 0
          ? mediaList
          : [
              {
                id: 'med-default',
                type: 'IMAGE',
                url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&q=80',
                title: 'Primary Photo',
                isPrimary: true,
              },
            ],
      documents,
      logistics: {
        pickupAvailable: true,
        transportArrangedBy,
        deliveryRadiusKm: deliveryRadius,
        notes: logisticsNotes,
      },
      privacy: {
        showExactLocation: showLocation,
        showContactPhone: showPhone,
        showContactEmail: true,
      },
      trustBadges: {
        identityVerified: true,
        ownershipVerified: true,
        parentageDnaVerified: true,
        genotyped: true,
        carrierFreeStatus: true,
        healthClearanceCurrent: true,
        registryCertified: true,
      },
    });

    alert('Commercial listing published successfully!');
    if (assetType === 'LIVE_ANIMAL') {
      router.push(`/bovine/marketplace/animals/${listingId}`);
    } else if (assetType === 'SEMEN') {
      router.push(`/bovine/marketplace/semen/${listingId}`);
    } else if (assetType === 'EMBRYO') {
      router.push(`/bovine/marketplace/embryos/${listingId}`);
    } else {
      router.push(`/bovine/marketplace/listings/${listingId}`);
    }
  };

  const steps = [
    { num: 1, title: 'Asset & Identity' },
    { num: 2, title: 'Commercial Terms' },
    { num: 3, title: 'Technical Specs' },
    { num: 4, title: 'Presentation & Media' },
    { num: 5, title: 'Documents & Vault' },
    { num: 6, title: 'Logistics & Review' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">New Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <Plus className="w-8 h-8 text-emerald-800" />
            Publish Commercial Genetics Listing
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Back your commercial listing with verified canonical pedigree, EPDs, and health certificates from your herd.
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100 overflow-x-auto">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-2 pr-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs whitespace-nowrap font-medium ${step === s.num ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step 1: Asset Type & Animal Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Select Commercial Asset Type</h3>
                <p className="text-xs text-stone-600">Choose the classification of bovine genetics you wish to offer.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'LIVE_ANIMAL', label: 'Live Breeding Animal', icon: Layers, desc: 'Bulls, donors, heifers' },
                  { id: 'SEMEN', label: 'Semen Straws', icon: TestTubes, desc: 'CSS certified cryo doses' },
                  { id: 'EMBRYO', label: 'Embryo Lots', icon: Sparkles, desc: 'IVF & in-vivo packages' },
                  { id: 'BREEDING_SERVICE', label: 'Breeding Service', icon: Award, desc: 'Flushing, recipient sync' },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAssetType(type.id as any)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                        assetType === type.id
                          ? 'border-emerald-800 bg-emerald-50/50 shadow-xs'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${assetType === type.id ? 'text-emerald-800' : 'text-stone-700'}`} />
                      <div>
                        <div className="font-bold text-sm text-stone-900">{type.label}</div>
                        <div className="text-[11px] text-stone-600">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Link to Canonical Animal */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Dna className="w-4 h-4 text-emerald-800" /> Connect to Canonical Herd Record (Recommended)
                  </h4>
                  <p className="text-xs text-stone-600">
                    Auto-imports official pedigree, EPDs, genomic evaluations, and health badges.
                  </p>
                </div>

                <select
                  value={selectedAnimalId}
                  onChange={(e) => handleSelectAnimal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  <option value="">-- Select Animal from Your Herd Registry --</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name || a.identifiers?.[0]?.value} ({a.breed} - {a.sex}) • Index +{a.geneticProfile?.selectionIndex || 160}
                    </option>
                  ))}
                </select>

                {selectedAnimalId && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Canonical DNA parentage, 100K genotype, and EPDs connected automatically.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Commercial Pricing & Terms */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Commercial Pricing & Terms</h3>
                <p className="text-xs text-stone-600">Define asking price, negotiation terms, and minimum acceptable bid.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Pricing Model</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="NEGOTIABLE">Negotiable (Offers Accepted)</option>
                    <option value="FIXED_PRICE">Fixed Price (Buy Now Only)</option>
                    <option value="PRIVATE_TREATY">Private Treaty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                    Asking Price ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
                    <input
                      type="number"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                    Minimum Acceptable Offer ($ USD)
                  </label>
                  <input
                    type="number"
                    value={minimumPrice}
                    onChange={(e) => setMinimumPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <span className="text-[11px] text-stone-700 mt-1 block">Offers below this will be automatically declined.</span>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={priceNegotiable}
                      onChange={(e) => setPriceNegotiable(e.target.checked)}
                      className="rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                    />
                    <span>Allow counteroffers and custom buyer terms</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Technical Specifications */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Technical Specifications</h3>
                <p className="text-xs text-stone-600">Enter lot and preservation details specific to this asset category.</p>
              </div>

              {assetType === 'SEMEN' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Batch / Collection #</label>
                    <input
                      type="text"
                      value={semenBatch}
                      onChange={(e) => setSemenBatch(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Storage Cryo Vault</label>
                    <input
                      type="text"
                      value={semenVault}
                      onChange={(e) => setSemenVault(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Post-Thaw Motility (%)</label>
                    <input
                      type="number"
                      value={semenMotility}
                      onChange={(e) => setSemenMotility(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Available Straws</label>
                    <input
                      type="number"
                      value={semenDoses}
                      onChange={(e) => setSemenDoses(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              {assetType === 'EMBRYO' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Lot Code</label>
                    <input
                      type="text"
                      value={embryoCode}
                      onChange={(e) => setEmbryoCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Quantity in Lot</label>
                    <input
                      type="number"
                      value={embryoQty}
                      onChange={(e) => setEmbryoQty(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Donor Dam Name</label>
                    <input
                      type="text"
                      value={embryoDonor}
                      onChange={(e) => setEmbryoDonor(e.target.value)}
                      placeholder="e.g. Highland Blackcap 8912"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Mating Sire Name</label>
                    <input
                      type="text"
                      value={embryoSire}
                      onChange={(e) => setEmbryoSire(e.target.value)}
                      placeholder="e.g. GAR Sure Fire 6432"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {assetType === 'LIVE_ANIMAL' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-stone-900">Live Animal Verification Specs</div>
                  <p>Physical inspection, quarantine facilities, and veterinary health clearances will be scheduled through the order stepper.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Presentation & Media */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Presentation & Marketing</h3>
                <p className="text-xs text-stone-600">Add compelling headlines, key strengths, and photography.</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Listing Headline / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. GAR Sure Fire 6432 - Elite Calving Ease AI Sire"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Breeder Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe maternal qualities, phenotypic soundness, carcass traits, or semen collection data..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Highlights tags */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Commercial Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g. Heifer Safe, Top 3% Marbling"
                    className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((h, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-1 font-medium">
                      {h}
                      <button type="button" onClick={() => handleRemoveHighlight(i)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Media URL add */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Paste image link (https://...)"
                    className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
                  >
                    Add Image
                  </button>
                </div>
                {mediaList.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {mediaList.map((m) => (
                      <div key={m.id} className="relative h-20 rounded-xl overflow-hidden border border-stone-200">
                        <img src={m.url} alt="Uploaded" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Document Vault & Visibility */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Commercial Document Vault</h3>
                <p className="text-xs text-stone-600">
                  Control when buyers can view registration titles, vet health certificates, and genomic reports.
                </p>
              </div>

              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-800" />
                      <div>
                        <div className="font-bold text-stone-900">{doc.name}</div>
                        <div className="text-stone-700 font-mono">{doc.type}</div>
                      </div>
                    </div>

                    <select
                      value={doc.visibility}
                      onChange={(e) => {
                        const next = [...documents];
                        next[idx].visibility = e.target.value as any;
                        setDocuments(next);
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                    >
                      <option value="PUBLIC">Public (Anyone)</option>
                      <option value="AFTER_INQUIRY">After Inquiry</option>
                      <option value="AFTER_OFFER">After Formal Offer</option>
                      <option value="AFTER_RESERVATION">After Reservation</option>
                      <option value="PRIVATE">Private (Only Me)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Logistics & Review */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Logistics & Final Review</h3>
                <p className="text-xs text-stone-600">Review all terms before publishing to the live marketplace.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Transport Arrangement</label>
                  <select
                    value={transportArrangedBy}
                    onChange={(e) => setTransportArrangedBy(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="BOTH">Both Pickup and Delivery Available</option>
                    <option value="SELLER">Seller Hauling Only</option>
                    <option value="BUYER">Buyer Pickup Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Delivery Radius (km)</label>
                  <input
                    type="number"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Review Summary Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="text-xs font-mono uppercase text-stone-700 font-bold">Summary Preview</div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Title:</span>
                  <span className="font-bold text-stone-900">{title || 'Registered Genetic Offering'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Asset Category:</span>
                  <span className="font-mono text-emerald-800 font-bold">{assetType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Asking Price:</span>
                  <span className="font-mono text-stone-900 font-bold">${askingPrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Seller Organization:</span>
                  <span className="font-semibold text-stone-900">Highland Cattle Co.</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Stepper Controls */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish Listing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
