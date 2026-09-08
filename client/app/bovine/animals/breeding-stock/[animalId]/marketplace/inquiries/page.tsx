'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ChevronRight,
  Send,
  Building,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function AnimalInquiriesPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const { listings, inquiries, replyInquiry } = useMarketplace();

  const animal = animals.find((a) => a.id === animalId);
  const animalListings = listings.filter((l) => l.animalId === animalId);
  const listingIds = animalListings.map((l) => l.id);

  const animalInquiries = inquiries.filter((i) => listingIds.includes(i.listingId));
  const [selectedInquiryId, setSelectedInquiryId] = useState(animalInquiries[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const activeInquiry = animalInquiries.find((i) => i.id === selectedInquiryId) || animalInquiries[0];

  if (!animal) return <div className="p-8 text-center text-stone-500">Animal not found.</div>;

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeInquiry && replyText.trim()) {
      replyInquiry(activeInquiry.id, replyText.trim(), 'Highland Cattle Co.');
      setReplyText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
            <Link href="/bovine" className="hover:underline">Bovine Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/bovine/animals/breeding-stock" className="hover:underline">Breeding Stock</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/bovine/animals/breeding-stock/${animal.id}/marketplace`} className="hover:underline">
              Commercial Hub
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-800 font-semibold">Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-800" />
            Buyer Inquiries for {animal.name || animal.identifiers?.[0]?.value}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Review questions submitted by prospective buyers regarding pedigree, health testing, and delivery.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {animalInquiries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
            No buyer inquiries received for this animal yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              {animalInquiries.map((inq) => (
                <button
                  key={inq.id}
                  onClick={() => setSelectedInquiryId(inq.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    activeInquiry?.id === inq.id
                      ? 'bg-white border-emerald-800 ring-1 ring-emerald-800 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                    {inq.inquiryType}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 line-clamp-1 mt-1">{inq.subject}</h4>
                  <div className="text-xs text-stone-600 font-mono mt-1">{inq.buyerOrgName}</div>
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              {activeInquiry && (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col h-[500px]">
                  <div className="pb-3 border-b border-stone-100">
                    <h3 className="font-bold text-base text-stone-900">{activeInquiry.subject}</h3>
                    <div className="text-xs text-stone-600 font-mono mt-0.5">
                      Buyer: {activeInquiry.buyerName} ({activeInquiry.buyerOrgName})
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    <div className="p-3.5 bg-stone-100 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-stone-900">{activeInquiry.buyerName}</div>
                      <p className="text-stone-800">{activeInquiry.message}</p>
                    </div>

                    {activeInquiry.replies.map((r, i) => (
                      <div key={i} className="p-3.5 bg-emerald-800 text-white rounded-2xl text-xs space-y-1 ml-auto max-w-sm">
                        <div className="font-bold">{r.senderName}</div>
                        <p>{r.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleReply} className="pt-3 border-t border-stone-100 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Reply to buyer..."
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
