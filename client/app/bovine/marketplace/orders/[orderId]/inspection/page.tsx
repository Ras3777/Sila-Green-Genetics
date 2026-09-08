'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Upload,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';
import { InspectionType, InspectionResult } from '@/lib/bovine-marketplace-types';

export default function OrderInspectionPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders, updateInspection, advanceOrderStep } = useMarketplace();
  const order = orders.find((o) => o.id === orderId);

  const [inspectionType, setInspectionType] = useState<InspectionType>('VETERINARY_CLINICAL');
  const [inspectorName, setInspectorName] = useState('Dr. Sarah Jenkins, DVM');
  const [vetRegNo, setVetRegNo] = useState('VET-MT-88421');
  const [scheduledDate, setScheduledDate] = useState('2025-02-18');
  const [findings, setFindings] = useState(
    'Breeding Soundness Evaluation passed. Scrotal circumference 41cm. Motility 75% rapid progressive. No structural faults detected in feet or hocks.'
  );
  const [result, setResult] = useState<InspectionResult>('PASSED');

  if (!order) {
    return <div className="p-12 text-center text-stone-600">Order not found.</div>;
  }

  const handleSaveAndAdvance = (inspectionOutcome: InspectionResult) => {
    setResult(inspectionOutcome);

    if (order.inspectionId) {
      updateInspection(order.inspectionId, {
        type: inspectionType,
        inspectorName,
        vetRegistrationNo: vetRegNo,
        findings,
        result: inspectionOutcome,
        status: 'COMPLETED',
        completedDate: new Date().toISOString().split('T')[0],
      });
    }

    if (inspectionOutcome === 'PASSED') {
      advanceOrderStep(order.id, 4, `Pre-purchase inspection passed (${inspectorName})`);
      alert('Inspection recorded as PASSED! Order successfully moved to Step 4: Commercial Documents & Bill of Sale.');
      router.push(`/bovine/marketplace/orders/${order.id}/documents`);
    } else {
      alert(`Inspection marked as ${inspectionOutcome}. Notice sent to buyer and seller.`);
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
            <span className="text-emerald-800 font-semibold">Step 3: Inspection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-800" />
            Step 3: Pre-Purchase Veterinary Inspection
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Official health verification, Breeding Soundness Exam (BSE), and clinical examination for order #{order.id}.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Order Context Banner */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-stone-700 uppercase">Subject:</span>
              <div className="font-bold text-stone-900 text-sm">{order.listingTitle}</div>
            </div>
            <div>
              <span className="text-stone-700 uppercase">Current Result:</span>
              <div className="font-bold text-emerald-800 text-sm">{order.inspectionStatus}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Inspection Protocol</label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="VETERINARY_CLINICAL">Veterinary Clinical Exam & BSE Soundness</option>
                <option value="BUYER_PHYSICAL">Buyer On-Farm Physical Confirmation</option>
                <option value="PREGNANCY_CONFIRMATION">Ultrasound Pregnancy Confirmation</option>
                <option value="SEMEN_QUALITY">CASA Post-Thaw Semen Quality Test</option>
                <option value="IDENTITY_VERIFICATION">RFID / Brand Registry Identity Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Scheduled / Exam Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Designated Inspector / Veterinarian</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Veterinary Registration / License #</label>
              <input
                type="text"
                value={vetRegNo}
                onChange={(e) => setVetRegNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Clinical Findings & Diagnosis</label>
            <textarea
              rows={4}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Certificate attachment stub */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>Veterinary Examination Signed Certificate Attached (PDF)</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold rounded-lg">
              Verified
            </span>
          </div>

          {/* Decision Outcome Actions */}
          <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/bovine/marketplace/orders/${order.id}`}
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Back to Stepper
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveAndAdvance('FAILED')}
                className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                Fail Inspection
              </button>
              <button
                type="button"
                onClick={() => handleSaveAndAdvance('RECHECK_REQUIRED')}
                className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
              >
                Request Re-Check
              </button>
              <button
                type="button"
                onClick={() => handleSaveAndAdvance('PASSED')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Pass Inspection & Advance →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
