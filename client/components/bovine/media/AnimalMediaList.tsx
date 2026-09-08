'use client';

import React from 'react';
import { AnimalMedia, MediaVerificationStatus } from '@/lib/bovine-types';
import {
  Image as ImageIcon,
  Video,
  Play,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Star,
  Globe,
  Lock,
  Shield,
  Link2,
  ShoppingBag,
  Trash2,
  FileText,
  Calendar,
} from 'lucide-react';

interface AnimalMediaListProps {
  mediaList: AnimalMedia[];
  onOpenViewer: (media: AnimalMedia) => void;
  onSetPrimary?: (mediaId: string) => void;
  onVerify?: (mediaId: string, status: MediaVerificationStatus) => void;
  onToggleMarketplace?: (mediaId: string, selected: boolean) => void;
  onDelete?: (mediaId: string) => void;
}

export default function AnimalMediaList({
  mediaList,
  onOpenViewer,
  onSetPrimary,
  onVerify,
  onToggleMarketplace,
  onDelete,
}: AnimalMediaListProps) {
  if (mediaList.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center text-stone-500 shadow-2xs">
        <FileText className="h-8 w-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm font-semibold text-stone-700">No media ledger entries found</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Category / Stage</th>
              <th className="py-3 px-4">Captured At & Author</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4">Marketplace</th>
              <th className="py-3 px-4">Linked Records</th>
              <th className="py-3 px-4">Specs & Hash</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-normal">
            {mediaList.map((media) => {
              const isVideo = media.mediaType === 'VIDEO' || !!media.videoDurationSeconds;
              const dateStr = media.capturedAt || media.takenAt || media.uploadedAt || '—';
              const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

              return (
                <tr key={media.id} className="hover:bg-stone-50/60 transition-colors group">
                  {/* Asset Thumbnail + Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative h-12 w-16 shrink-0 rounded-xl overflow-hidden bg-stone-100 cursor-pointer border border-stone-200"
                        onClick={() => onOpenViewer(media)}
                      >
                        <img
                          src={media.thumbnailUrl || media.url}
                          alt={media.title}
                          className="h-full w-full object-cover"
                        />
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="h-3.5 w-3.5 fill-white text-white" />
                          </div>
                        )}
                        {media.isIdentityPhoto && (
                          <span className="absolute top-0.5 left-0.5 rounded bg-amber-500 p-0.5 text-white">
                            <Star className="h-2 w-2 fill-white" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[220px]">
                        <p
                          className="font-semibold text-stone-900 truncate hover:text-emerald-800 cursor-pointer transition-colors"
                          onClick={() => onOpenViewer(media)}
                        >
                          {media.title}
                        </p>
                        {media.caption && (
                          <p className="text-[11px] text-stone-500 truncate">{media.caption}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category / Stage */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <span className="inline-block rounded-lg bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                        {media.category || media.mediaType}
                      </span>
                      {media.stage && (
                        <p className="text-[10px] font-mono text-stone-500">Stage: {media.stage}</p>
                      )}
                    </div>
                  </td>

                  {/* Captured At & Author */}
                  <td className="py-3 px-4">
                    <p className="font-mono text-[11px] font-medium text-stone-900">{cleanDate}</p>
                    <p className="text-[10px] text-stone-500 truncate">
                      By: {media.capturedBy || media.uploadedBy || 'Staff'}
                    </p>
                    {media.ageMonthsAtCapture !== undefined && (
                      <span className="text-[10px] text-emerald-800 font-semibold">
                        Age: {media.ageMonthsAtCapture} mos
                      </span>
                    )}
                  </td>

                  {/* Verification */}
                  <td className="py-3 px-4">
                    {media.verificationStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {media.verificationStatus === 'PENDING_REVIEW' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        <Clock className="h-3 w-3" /> Pending Review
                      </span>
                    )}
                    {media.verificationStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                    {media.verifiedBy && (
                      <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                        {media.verifiedBy}
                      </p>
                    )}
                  </td>

                  {/* Marketplace */}
                  <td className="py-3 px-4">
                    {media.marketplaceSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        <ShoppingBag className="h-3 w-3" /> Featured (#{media.marketplaceOrder || 1})
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">Not in Catalog</span>
                    )}
                  </td>

                  {/* Linked Records */}
                  <td className="py-3 px-4">
                    {media.links && media.links.length > 0 ? (
                      <div className="space-y-1">
                        {media.links.map((lnk) => (
                          <span
                            key={lnk.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-stone-100 border border-stone-200/60 px-2 py-0.5 text-[10px] text-stone-700 font-medium mr-1"
                          >
                            <Link2 className="h-2.5 w-2.5 text-stone-400" />
                            {lnk.label || lnk.entityType}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-stone-400">—</span>
                    )}
                  </td>

                  {/* Specs & Hash */}
                  <td className="py-3 px-4 font-mono text-[10px] text-stone-500">
                    <p>{media.fileSize || '1.8 MB'}</p>
                    {media.checksum && (
                      <p className="truncate max-w-[90px]" title={media.checksum}>
                        sha256:{media.checksum.slice(0, 8)}...
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenViewer(media)}
                        className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                        title="Open inspection lightbox"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {!media.isIdentityPhoto && onSetPrimary && (
                        <button
                          onClick={() => onSetPrimary(media.id)}
                          className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-amber-500 transition-colors"
                          title="Set as primary profile"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {onVerify && media.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => onVerify(media.id, 'VERIFIED')}
                          className="rounded-xl p-1.5 text-stone-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          title="Verify asset"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${media.title}"?`)) {
                              onDelete(media.id);
                            }
                          }}
                          className="rounded-xl p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Delete asset"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
