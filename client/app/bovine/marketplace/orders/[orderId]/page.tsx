'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Truck,
  Building,
  User,
  AlertCircle,
  Award,
  Layers,
  Activity,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function OrderLifecycleStepperPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders, advanceOrderStep } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const [advanceNotes, setAdvanceNotes] = useState('');

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-12 text-center">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <Link
          href="/bovine/marketplace/orders"
          className="mt-4 inline-block px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-xl"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const stepsList = [
    {
      step: 1,
      title: 'Commercial Offer Accepted',
      desc: 'Offer agreed upon by buyer and seller with price and baseline terms locked.',
      href: null,
      icon: DollarSign,
    },
    {
      step: 2,
      title: 'Reservation & Escrow Deposit',
      desc: 'Exclusive 14-day hold placed on the asset and initial deposit secured.',
      href: null,
      icon: Award,
    },
    {
      step: 3,
      title: 'Pre-Purchase Inspection',
      desc: 'Clinical veterinary examination, BSE soundness, and health testing performed.',
      href: `/bovine/marketplace/orders/${order.id}/inspection`,
      icon: ShieldCheck,
    },
    {
      step: 4,
      title: 'Commercial Documents & Bill of Sale',
      desc: 'Bill of Sale, registry transfer applications, and health certificates executed.',
      href: `/bovine/marketplace/orders/${order.id}/documents`,
      icon: FileText,
    },
    {
      step: 5,
      title: 'Escrow Settlement & Final Payment',
      desc: 'Remaining commercial balance held in escrow and cleared for settlement.',
      href: `/bovine/marketplace/orders/${order.id}/payment`,
      icon: DollarSign,
    },
    {
      step: 6,
      title: 'Official Ownership Transfer',
      desc: 'Canonical AnimalOwnership record updated and registry transfer certificate signed.',
      href: `/bovine/marketplace/orders/${order.id}/transfer`,
      icon: CheckCircle2,
    },
    {
      step: 7,
      title: 'Animal Movement & Dispatch',
      desc: 'Transportation route logged, health clearance verified, and receiving confirmed.',
      href: `/bovine/marketplace/orders/${order.id}/movement`,
      icon: Truck,
    },
    {
      step: 8,
      title: 'Transaction Completed',
      desc: 'Escrow released, post-arrival quarantine initiated, and records finalized.',
      href: null,
      icon: Package,
    },
  ];

  const handleAdvanceStep = () => {
    if (order.currentStep < 8) {
      const nextStep = order.currentStep + 1;
      advanceOrderStep(order.id, nextStep, advanceNotes || `Advanced to step ${nextStep}`);
      setAdvanceNotes('');
      alert(`Order advanced to Step ${nextStep}: ${stepsList[nextStep - 1]?.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-24">
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
                <Link href="/bovine/marketplace/orders" className="hover:underline">Orders</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-800 font-semibold">{order.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-800" />
                Order #{order.id}: {order.listingTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-mono mt-1">
                <span>Buyer: <strong className="text-stone-900">{order.buyerOrgName}</strong></span>
                <span>•</span>
                <span>Seller: <strong className="text-stone-900">{order.sellerOrgName}</strong></span>
                <span>•</span>
                <span>Asset: <strong className="text-emerald-800">{order.assetType}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs font-mono font-bold rounded-xl ${
                  order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: 8-Step Lifecycle Stepper */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">8-Stage Commercial Order Lifecycle</h3>
                <p className="text-xs text-stone-600">
                  Step-by-step progress tracking for pre-purchase veterinary inspection, escrow funding, legal transfer, and transport.
                </p>
              </div>

              {/* Stepper list */}
              <div className="space-y-4">
                {stepsList.map((st) => {
                  const Icon = st.icon;
                  const isCompleted = order.currentStep > st.step || order.status === 'COMPLETED';
                  const isCurrent = order.currentStep === st.step && order.status !== 'COMPLETED';
                  const isUpcoming = order.currentStep < st.step && order.status !== 'COMPLETED';

                  return (
                    <div
                      key={st.step}
                      className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isCurrent
                          ? 'border-emerald-800 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-800'
                          : isCompleted
                          ? 'border-stone-200 bg-stone-50/80'
                          : 'border-stone-100 bg-white opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-800 text-white'
                              : isCurrent
                              ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : st.step}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-stone-900">{st.title}</h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-800 text-white rounded-md uppercase">
                                Action Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">{st.desc}</p>
                        </div>
                      </div>

                      {/* Right Subpage Link / Button */}
                      {st.href && (
                        <Link
                          href={st.href}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-2xs'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          Open Panel <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fast-Forward Step Controller (for demo & admin test) */}
              {order.currentStep < 8 && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 pt-4">
                  <div className="text-xs font-mono text-stone-700 uppercase font-bold">Advance Order Lifecycle</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={advanceNotes}
                      onChange={(e) => setAdvanceNotes(e.target.value)}
                      placeholder="Optional milestone note (e.g. Health clearance signed off)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleAdvanceStep}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl whitespace-nowrap transition-colors"
                    >
                      Advance to Step {order.currentStep + 1} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Order Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-6">
              <div>
                <div className="text-xs font-mono text-stone-700 uppercase">Commercial Order Total</div>
                <div className="text-3xl font-extrabold font-mono text-stone-900 mt-1">
                  ${order.totalAmount.toLocaleString()} <span className="text-xs font-normal text-stone-700">{order.currency}</span>
                </div>
                <div className="text-xs text-stone-600 font-mono mt-0.5">
                  Deposit: ${order.paymentDetails?.depositAmount || Math.round(order.totalAmount * 0.1)} (
                  <span className="text-emerald-800 font-semibold">
                    {order.paymentDetails?.depositPaid ? 'PAID IN ESCROW' : 'PENDING'}
                  </span>)
                </div>
              </div>

              {/* Quick Links to Order Sub-Modules */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs font-medium">
                <div className="font-mono text-stone-700 uppercase text-[10px]">Order Sub-Panels</div>

                <Link
                  href={`/bovine/marketplace/orders/${order.id}/inspection`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    Step 3: Pre-Purchase Inspection
                  </span>
                  <span className="font-mono text-stone-700">{order.inspectionStatus}</span>
                </Link>

                <Link
                  href={`/bovine/marketplace/orders/${order.id}/documents`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-800" />
                    Step 4: Documents & Bill of Sale
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-600" />
                </Link>

                <Link
                  href={`/bovine/marketplace/orders/${order.id}/payment`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-800" />
                    Step 5: Escrow Settlement
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-600" />
                </Link>

                <Link
                  href={`/bovine/marketplace/orders/${order.id}/transfer`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    Step 6: Official Ownership Transfer
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-600" />
                </Link>

                <Link
                  href={`/bovine/marketplace/orders/${order.id}/movement`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-800" />
                    Step 7: Movement & Dispatch
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-600" />
                </Link>
              </div>

              {/* Timeline Log */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <div className="text-[10px] font-mono uppercase text-stone-700">Audit Milestone Log</div>
                <div className="space-y-2 text-xs">
                  {order.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-800 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-900">{item.title}</div>
                        {item.completedAt && (
                          <div className="text-[10px] text-stone-700 font-mono">
                            {new Date(item.completedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
