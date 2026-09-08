'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  ChevronRight,
  CheckCircle2,
  Download,
  Upload,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function OrderDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders, advanceOrderStep } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const [signedBillOfSale, setSignedBillOfSale] = useState(true);
  const [signedRegistryApp, setSignedRegistryApp] = useState(true);
  const [signedEscrowRelease, setSignedEscrowRelease] = useState(false);

  if (!order) {
    return <div className="p-12 text-center text-stone-600">Order not found.</div>;
  }

  const allSigned = signedBillOfSale && signedRegistryApp && signedEscrowRelease;

  const handleAdvanceToPayment = () => {
    if (allSigned) {
      advanceOrderStep(order.id, 5, 'Commercial bill of sale and escrow agreements signed by all parties');
      alert('Commercial agreements executed! Moving to Step 5: Escrow Payment & Settlement.');
      router.push(`/bovine/marketplace/orders/${order.id}/payment`);
    } else {
      alert('Please acknowledge and sign all documents before proceeding.');
    }
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
            <span className="text-emerald-800 font-semibold">Step 4: Documents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-800" />
            Step 4: Commercial Documents & Bill of Sale
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Execute binding commercial sales contracts, breed registry transfer forms, and escrow warranties.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900">Required Legal Contracts & Affidavits</h3>
            <p className="text-xs text-stone-600">Both buyer and seller must execute these documents before escrow funds can be transferred.</p>
          </div>

          <div className="space-y-4">
            {/* Doc 1: Bill of Sale */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Commercial Livestock Bill of Sale & Purchase Agreement</h4>
                  <div className="text-xs text-stone-600 font-mono mt-0.5">
                    Covers warranties, health certifications, and clear title transfer.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => alert('Downloading Bill of Sale PDF...')}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg text-xs flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={signedBillOfSale}
                    onChange={(e) => setSignedBillOfSale(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Signed & Executed</span>
                </label>
              </div>
            </div>

            {/* Doc 2: Breed Registry Application */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Breed Association Official Transfer Authorization</h4>
                  <div className="text-xs text-stone-600 font-mono mt-0.5">
                    Prepares national breed registry change of ownership from {order.sellerOrgName} to {order.buyerOrgName}.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => alert('Downloading Registry Transfer form...')}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg text-xs flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={signedRegistryApp}
                    onChange={(e) => setSignedRegistryApp(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Signed & Executed</span>
                </label>
              </div>
            </div>

            {/* Doc 3: Escrow Release Agreement */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Escrow Settlement & Disbursement Agreement</h4>
                  <div className="text-xs text-stone-600 font-mono mt-0.5">
                    Authorizes third-party trust escrow holding of ${order.totalAmount.toLocaleString()} USD until movement arrives.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => alert('Downloading Escrow Agreement PDF...')}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg text-xs flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={signedEscrowRelease}
                    onChange={(e) => setSignedEscrowRelease(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Sign Digitally</span>
                </label>
              </div>
            </div>
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
              onClick={handleAdvanceToPayment}
              disabled={!allSigned}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                allSigned
                  ? 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-700 cursor-not-allowed'
              }`}
            >
              Execute Documents & Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
