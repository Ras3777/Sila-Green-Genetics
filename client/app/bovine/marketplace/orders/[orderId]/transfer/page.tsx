'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building,
  Calendar,
  Award,
  ArrowRight,
  Layers,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { useBovine } from '@/lib/bovine-store';

export default function OrderOwnershipTransferPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { animals } = useBovine();
  const { orders, completeOwnershipTransfer } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const animal = order?.animalId ? animals.find((a) => a.id === order.animalId) : null;

  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [registryCertNo, setRegistryCertNo] = useState('AAA-XFER-2025-0891');
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!order) {
    return <div className="p-12 text-center text-stone-600">Order not found.</div>;
  }

  const handleExecuteTransfer = () => {
    if (!termsAccepted) {
      alert('Please accept legal title transfer terms.');
      return;
    }

    completeOwnershipTransfer(order.id, order.buyerId || 'org-buyer-default', transferDate);
    alert('Official ownership transfer completed in registry! Canonical Animal record preserved without duplication. Moving to Step 7: Movement & Dispatch.');
    router.push(`/bovine/marketplace/orders/${order.id}/movement`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/marketplace/orders" className="hover:underline">Orders</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/bovine/marketplace/orders/${order.id}`} className="hover:underline">{order.id}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">Step 6: Ownership Transfer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-800" />
            Step 6: Canonical Ownership Transfer
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Reassign official legal ownership of animal records within the registry without duplicate entity creation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Canonical Principle Notice */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="block font-bold text-stone-900 mb-0.5">Canonical Domain Integrity Rule</strong>
              This transaction updates the underlying <code className="font-mono text-emerald-800">AnimalOwnership</code> table, closes the seller's tenure, and registers the buyer's organization. The canonical Animal ID, historical telemetry, and parentage records remain unaltered and unified.
            </div>
          </div>

          {/* Transfer Parties Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="text-[10px] font-mono uppercase text-stone-700">Relinquishing Owner (Seller)</div>
              <div className="font-bold text-base text-stone-900">{order.sellerOrgName}</div>
              <div className="text-xs text-stone-600 font-mono">Status: Full Title Conveyance</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">New Registered Owner (Buyer)</div>
              <div className="font-bold text-base text-stone-900">{order.buyerOrgName}</div>
              <div className="text-xs text-emerald-900 font-mono">Status: Designated Title Holder</div>
            </div>
          </div>

          {/* Subject Genetic Asset Details */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono">
            <div className="text-stone-700 uppercase">Subject Genetic Asset</div>
            <div className="text-sm font-bold text-stone-900">{order.listingTitle}</div>
            <div className="text-stone-700 flex flex-wrap gap-4 pt-1">
              <span>Canonical ID: <strong className="text-stone-900">{order.animalId || 'anim-canonical-01'}</strong></span>
              <span>•</span>
              <span>Asset Category: <strong className="text-emerald-800">{order.assetType}</strong></span>
              <span>•</span>
              <span>Quantity: <strong>{order.quantity}</strong></span>
            </div>
          </div>

          {/* Transfer Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Effective Transfer Date</label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Registry Transfer Cert Number</label>
              <input
                type="text"
                value={registryCertNo}
                onChange={(e) => setRegistryCertNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Legal Acknowledgement */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-emerald-700 mt-0.5"
              />
              <span>
                Both parties verify that consideration has been delivered into escrow and authorize the automated registry update of this livestock asset, warranty rights, and official pedigree certificate.
              </span>
            </label>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <Link
              href={`/bovine/marketplace/orders/${order.id}`}
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900"
            >
              Back to Stepper
            </Link>

            <button
              type="button"
              onClick={handleExecuteTransfer}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" /> Authorize Transfer & Proceed to Movement →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
