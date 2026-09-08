'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Building,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  MessageSquare,
  Clock,
  MapPin,
  Plus,
  Star,
  Layers,
  Activity,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

interface BreedingServiceItem {
  id: string;
  title: string;
  category: 'IVF_OPU' | 'RECIPIENT_HOSTING' | 'AI_SERVICE' | 'CRYO_BANKING' | 'GENOMIC_CONSULTING';
  providerName: string;
  providerOrg: string;
  location: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  pricingModel: string;
  accredited: boolean;
  description: string;
  deliverables: string[];
  leadTimeWeeks: number;
}

const initialServices: BreedingServiceItem[] = [
  {
    id: 'srv-1',
    title: 'On-Farm Donor OPU (Ovum Pick-Up) & IVF Production',
    category: 'IVF_OPU',
    providerName: 'Trans Ova Advanced Genetics',
    providerOrg: 'Trans Ova Genetics',
    location: 'Iowa / Regional Midwest Hub',
    rating: 4.9,
    reviewCount: 42,
    basePrice: 1850,
    pricingModel: 'Per Donor Collection Cycle + Culture Fee',
    accredited: true,
    description: 'Complete on-farm mobile ultrasound-guided ovum pick-up (OPU) session followed by high-yield laboratory in-vitro fertilization and culture to blastocyst stage.',
    deliverables: [
      'Veterinary ultrasonographer on site',
      'Media, aspiration needles & transport inc.',
      'CASA quality fertilization report',
      'Stage 6 Grade 1 direct-thaw freezing',
    ],
    leadTimeWeeks: 2,
  },
  {
    id: 'srv-2',
    title: 'Commercial Recipient Herd Synchronization & Embryo Transfer',
    category: 'RECIPIENT_HOSTING',
    providerName: 'Midwest Reproductive Bovine Specialists',
    providerOrg: 'Midwest Reproductive Bovine Specialists',
    location: 'Nebraska & South Dakota',
    rating: 4.8,
    reviewCount: 29,
    basePrice: 650,
    pricingModel: 'Per Confirmed 60-Day Pregnancy',
    accredited: true,
    description: 'Host your frozen or fresh IVF embryos in our high-maternal commercial Angus recipient herd. Zero charge if 60-day ultrasound pregnancy check is negative.',
    deliverables: [
      'CIDR/GnRH estrus synchronization protocol',
      'Certified AETA embryo transfer technician',
      '30-day & 60-day ultrasound confirmation',
      'Full BVD-PI negative herd biosecurity',
    ],
    leadTimeWeeks: 4,
  },
  {
    id: 'srv-3',
    title: 'Bull Collection, Cryo-Banking & CSS Health Quarantine',
    category: 'CRYO_BANKING',
    providerName: 'Hawkeye Cryo Banking Centers',
    providerOrg: 'Hawkeye Breeders',
    location: 'Adel, Iowa',
    rating: 5.0,
    reviewCount: 58,
    basePrice: 1200,
    pricingModel: 'Quarantine Entry + $2.20 / Straw Processed',
    accredited: true,
    description: 'Certified Semen Services (CSS) compliant collection and cryopreservation. Housing, feed, biosecurity health isolation, and domestic or export certification.',
    deliverables: [
      'CSS compliant 60-day health testing',
      'CASA computerized post-thaw motility',
      '0.5 ml automated straw filling & printing',
      'Vault insurance and liquid N2 storage',
    ],
    leadTimeWeeks: 3,
  },
  {
    id: 'srv-4',
    title: 'Genomic Mating Strategy & Inbreeding Minimization Consulting',
    category: 'GENOMIC_CONSULTING',
    providerName: 'Bovine Precision Genomics Lab',
    providerOrg: 'Bovine Precision Genomics Lab',
    location: 'Remote / Global Delivery',
    rating: 4.9,
    reviewCount: 19,
    basePrice: 950,
    pricingModel: 'Flat Fee per 100 Head Evaluated',
    accredited: true,
    description: 'Algorithmic herd-wide pedigree & GBLUP genomic analysis. Generates individual mating sire allocations maximizing selection index while capping inbreeding coefficient below 2.5%.',
    deliverables: [
      'Genomic inbreeding matrix generation',
      'Defect carrier risk exclusion match',
      'Individual cow-to-sire allocation sheet',
      '1-on-1 geneticist consultation session',
    ],
    leadTimeWeeks: 1,
  },
];

export default function BreedingServicesMarketplacePage() {
  const [services] = useState<BreedingServiceItem[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking inquiry modal
  const [bookingService, setBookingService] = useState<BreedingServiceItem | null>(null);
  const [preferredDate, setPreferredDate] = useState('');
  const [headCount, setHeadCount] = useState(10);
  const [bookingNotes, setBookingNotes] = useState('');

  const filtered = services.filter((s) => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchProv = s.providerName.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      if (!matchTitle && !matchProv && !matchDesc) return false;
    }
    return true;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Service inquiry dispatched to ${bookingService?.providerName}! The reproductive center will contact you with slot availability.`);
    setBookingService(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/bovine/marketplace" className="hover:underline">Marketplace</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">Breeding Services</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Activity className="w-8 h-8 text-emerald-800" />
                Reproductive & Breeding Services Directory
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Book certified veterinary IVF flushing, recipient synchronization, cryogenic bull banking, and genomic mating consultants.
              </p>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-stone-100 pt-4 text-sm font-medium">
            <Link
              href="/bovine/marketplace"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Marketplace Hub
            </Link>
            <Link
              href="/bovine/marketplace/animals"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Live Animals
            </Link>
            <Link
              href="/bovine/marketplace/semen"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Semen Marketplace
            </Link>
            <Link
              href="/bovine/marketplace/embryos"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Embryo Lots
            </Link>
            <Link
              href="/bovine/marketplace/breeding-services"
              className="px-3 py-1.5 text-emerald-800 bg-emerald-50 rounded-lg font-semibold whitespace-nowrap"
            >
              Breeding Services ({services.length})
            </Link>
            <Link
              href="/bovine/marketplace/orders"
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg whitespace-nowrap"
            >
              Orders & Escrow
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'IVF_OPU', label: 'IVF & OPU Flushing' },
              { id: 'RECIPIENT_HOSTING', label: 'Recipient Hosting' },
              { id: 'CRYO_BANKING', label: 'Cryo Bull Banking' },
              { id: 'GENOMIC_CONSULTING', label: 'Genomic Consulting' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider or service..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    {srv.category.replace('_', ' ')}
                  </span>
                  {srv.accredited && (
                    <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-stone-100 text-stone-700 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> AETA / CSS Accredited
                    </span>
                  )}
                  <span className="text-xs text-stone-700 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Lead time: ~{srv.leadTimeWeeks} wks
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900">{srv.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-stone-600 mt-1 font-mono">
                    <span className="flex items-center gap-1 font-semibold text-stone-900">
                      <Building className="w-3.5 h-3.5 text-emerald-800" /> {srv.providerName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-600" /> {srv.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {srv.rating} ({srv.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-700 leading-relaxed max-w-2xl">{srv.description}</p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-mono uppercase text-stone-700">Included Deliverables:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                    {srv.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Box */}
              <div className="md:w-64 flex flex-col justify-between p-6 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <div className="text-xs font-mono uppercase text-stone-700">Commercial Rate</div>
                  <div className="text-2xl font-extrabold font-mono text-stone-900 mt-0.5">
                    ${srv.basePrice.toLocaleString()} <span className="text-xs font-normal text-stone-700">USD</span>
                  </div>
                  <div className="text-xs text-stone-600 mt-1 font-medium">{srv.pricingModel}</div>
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <button
                    onClick={() => setBookingService(srv)}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Request Booking / Slot
                  </button>
                  <button
                    onClick={() => {
                      alert(`Opening direct conversation thread with ${srv.providerName}`);
                    }}
                    className="w-full py-2 px-3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-medium rounded-xl text-xs transition-colors"
                  >
                    Ask Technical Question
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Request Service Booking</h3>
              <button onClick={() => setBookingService(null)} className="p-1 text-stone-600 hover:text-stone-700">
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Submit your herd details and preferred timeline to <strong className="text-stone-900">{bookingService.providerName}</strong>.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Target Service Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Estimated Head / Animals</label>
                <input
                  type="number"
                  value={headCount}
                  onChange={(e) => setHeadCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Special Requirements / Farm Notes</label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Mention facilities, chute setup, donor ear tags, or specific hormone protocols..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl"
                >
                  Send Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
