'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ChevronRight,
  Send,
  User,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '@/lib/bovine-marketplace-store';

export default function InquiriesHubPage() {
  const { inquiries, replyInquiry } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(inquiries[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const filteredInquiries = inquiries.filter((inq) => {
    // Current user context is Highland Cattle Co. (seller on list-101, buyer on others)
    if (activeTab === 'RECEIVED') {
      return inq.sellerOrgName === 'Highland Cattle Co.';
    } else {
      return inq.buyerOrgName === 'Highland Cattle Co.' || inq.buyerName === 'Highland Cattle Co.';
    }
  });

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId) || filteredInquiries[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInquiry && replyText.trim()) {
      replyInquiry(selectedInquiry.id, replyText.trim(), 'Highland Cattle Co.');
      setReplyText('');
    }
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
                <span className="text-emerald-800 font-semibold">Inquiries</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-emerald-800" />
                Commercial Inquiries & Messaging Hub
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Direct buyer-to-breeder inquiries regarding health records, pedigree verifications, and delivery logistics.
              </p>
            </div>

            {/* Inbound / Outbound toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                onClick={() => setActiveTab('RECEIVED')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'RECEIVED'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Inbound Inquiries ({inquiries.filter((i) => i.sellerOrgName === 'Highland Cattle Co.').length})
              </button>
              <button
                onClick={() => setActiveTab('SENT')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'SENT'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                My Outbound ({inquiries.filter((i) => i.buyerOrgName === 'Highland Cattle Co.' || i.buyerName === 'Highland Cattle Co.').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries Thread List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="text-xs font-mono uppercase text-stone-700 font-semibold px-1">
              Conversations ({filteredInquiries.length})
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-600">
                No active inquiries in this folder.
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <button
                  key={inq.id}
                  onClick={() => setSelectedInquiryId(inq.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-white border-emerald-800 shadow-sm ring-1 ring-emerald-800'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                      {inq.inquiryType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-stone-700 font-mono">{inq.createdAt.split('T')[0]}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{inq.subject}</h4>
                    <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">{inq.message}</p>
                  </div>

                  <div className="flex items-center justify-between w-full text-xs text-stone-700 pt-2 border-t border-stone-100">
                    <span className="truncate">
                      {activeTab === 'RECEIVED' ? inq.buyerOrgName : inq.sellerOrgName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100">
                      {inq.replies.length} replies
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Active Conversation Detail */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
                {/* Header */}
                <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md">
                        {selectedInquiry.inquiryType}
                      </span>
                      <span className="text-xs text-stone-700 font-mono">
                        Status: <strong className="text-stone-900">{selectedInquiry.status}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{selectedInquiry.subject}</h3>
                    <div className="text-xs text-stone-600 font-mono mt-0.5">
                      Regarding: <strong className="text-stone-900">{selectedInquiry.listingTitle}</strong>
                    </div>
                  </div>

                  <Link
                    href={`/bovine/marketplace/listings/${selectedInquiry.listingId}`}
                    className="p-2 text-xs font-medium text-stone-700 hover:text-emerald-800 flex items-center gap-1 bg-white border border-stone-200 rounded-xl"
                  >
                    View Listing <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Message Thread */}
                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                  {/* Original Question */}
                  <div className="p-4 rounded-2xl bg-stone-100 max-w-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-700 font-mono">
                      <span className="font-bold text-stone-900">{selectedInquiry.buyerName}</span>
                      <span>{new Date(selectedInquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-stone-800 leading-relaxed">{selectedInquiry.message}</p>
                  </div>

                  {/* Replies */}
                  {selectedInquiry.replies.map((reply, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl max-w-xl space-y-1 ${
                        reply.senderName === 'Highland Cattle Co.'
                          ? 'ml-auto bg-emerald-800 text-white'
                          : 'bg-stone-100 text-stone-900'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between text-[11px] font-mono ${
                          reply.senderName === 'Highland Cattle Co.' ? 'text-emerald-200' : 'text-stone-700'
                        }`}
                      >
                        <span className="font-bold">{reply.senderName}</span>
                        <span>{new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-stone-200 bg-stone-50 flex items-center gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the buyer/breeder..."
                    className="flex-1 px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Reply
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-600">
                Select an inquiry from the left to view the messaging thread.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
