'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  CreditCard,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function OrderPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders, advanceOrderStep } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const [paymentMethod, setPaymentMethod] = useState<'ESCROW' | 'BANK_WIRE' | 'DIRECT_SETTLEMENT'>('ESCROW');
  const [wireRef, setWireRef] = useState('WT-2025-998124');
  const [depositSecured, setDepositSecured] = useState(true);
  const [balanceFunded, setBalanceFunded] = useState(true);

  if (!order) {
    return <div className="p-12 text-center text-stone-600">Order not found.</div>;
  }

  const depositAmount = order.paymentDetails?.depositAmount || Math.round(order.totalAmount * 0.1);
  const balanceAmount = order.totalAmount - depositAmount;

  const handleAuthorizePayment = () => {
    advanceOrderStep(order.id, 6, `Full escrow balance of $${order.totalAmount} USD funded via ${paymentMethod}`);
    alert('Escrow payment verified and locked in trust! Moving to Step 6: Official Ownership Transfer.');
    router.push(`/bovine/marketplace/orders/${order.id}/transfer`);
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
            <span className="text-emerald-800 font-semibold">Step 5: Payment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-800" />
            Step 5: Escrow Payment & Financial Settlement
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Funds are securely held in third-party escrow and only released after official registry transfer and arrival confirmation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Escrow Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <strong className="block font-bold mb-0.5">Automated Escrow Protection Guarantee</strong>
              Funds remain in insured escrow trust. The seller will not receive final payout until you authorize delivery reception in Step 7.
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-stone-700 uppercase">Total Order Amount</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">${order.totalAmount.toLocaleString()} USD</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-stone-700 uppercase">10% Reservation Deposit</div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">${depositAmount.toLocaleString()} USD</div>
              <div className="text-[10px] text-emerald-800 font-bold mt-0.5">✓ PAID IN ESCROW</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-stone-700 uppercase">Remaining Balance</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">${balanceAmount.toLocaleString()} USD</div>
              <div className="text-[10px] text-stone-700 mt-0.5">Pending settlement release</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-2">Settlement Channel</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ESCROW', label: 'Commercial Escrow Trust', desc: 'Protected wire holding' },
                { id: 'BANK_WIRE', label: 'Direct Fedwire / ACH', desc: 'Direct bank-to-bank' },
                { id: 'DIRECT_SETTLEMENT', label: 'Internal Farm Clearing', desc: 'Inter-branch credit' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === m.id
                      ? 'border-emerald-800 bg-emerald-50/50 ring-1 ring-emerald-800'
                      : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900">{m.label}</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wire Reference / ACH details */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-700 uppercase">Escrow Reference Number:</span>
              <strong className="text-stone-900">{wireRef}</strong>
            </div>
            <div className="text-xs text-stone-700">
              Trustee: <strong>First Agrarian Escrow Corporation</strong> (Member FDIC)
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
              onClick={handleAuthorizePayment}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" /> Fund Escrow & Proceed to Transfer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
