'use client';

import React, { useState } from 'react';
import { AnimalMedia, MediaVerificationStatus, MediaVisibility } from '@/lib/bovine-types';
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
  MoreVertical,
  Link2,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Trash2,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';

interface AnimalMediaCardProps {
  media: AnimalMedia;
  isSelected?: boolean;
  onToggleSelect?: (mediaId: string) => void;
  onOpenViewer: (media: AnimalMedia) => void;
  onSetPrimary?: (mediaId: string) => void;
  onVerify?: (mediaId: string, status: MediaVerificationStatus) => void;
  onToggleMarketplace?: (mediaId: string, selected: boolean) => void;
  onDelete?: (mediaId: string) => void;
  onAddToAlbum?: (mediaId: string) => void;
  onCompare?: (media: AnimalMedia) => void;
  showBatchCheckbox?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  IDENTIFICATION: { label: 'Identification', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONFORMATION: { label: 'Conformation', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  HEALTH_CLINICAL: { label: 'Health / Clinical', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  REPRODUCTION: { label: 'Reproduction', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  ULTRASOUND: { label: 'Ultrasound Scan', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  SEMEN_ANALYSIS: { label: 'Semen Analysis', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  CALVING: { label: 'Calving', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  GROWTH_STAGE: { label: 'Growth Stage', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  MARKETPLACE_HERO: { label: 'Marketplace Hero', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  WALKING_VIDEO: { label: 'Gait / Locomotion', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  OTHER: { label: 'Media', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
};

export default function AnimalMediaCard({
  media,
  isSelected = false,
  onToggleSelect,
  onOpenViewer,
  onSetPrimary,
  onVerify,
  onToggleMarketplace,
  onDelete,
  onAddToAlbum,
  onCompare,
  showBatchCheckbox = true,
}: AnimalMediaCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isVideo = media.mediaType === 'VIDEO' || !!media.videoDurationSeconds;
  const isPrimary = media.isIdentityPhoto || media.isProfile;
  const categoryInfo = CATEGORY_STYLES[media.category || 'OTHER'] || CATEGORY_STYLES.OTHER;
  const captureDate = media.capturedAt || media.takenAt || media.uploadedAt || '—';
  const displayDate = captureDate.includes('T') ? captureDate.split('T')[0] : captureDate;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs hover:shadow-md ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
          : 'border-stone-200/80 hover:border-stone-300'
      }`}
    >
      {/* Media Preview Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onOpenViewer(media)}>
        <img
          src={media.thumbnailUrl || media.url}
          alt={media.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Video Overlay Indicator */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-5 w-5 fill-white ml-0.5" />
            </div>
            {media.videoDurationSeconds && (
              <span className="absolute bottom-2 right-2 rounded-lg bg-black/75 px-2 py-0.5 text-[11px] font-mono font-medium text-white backdrop-blur-xs">
                {Math.floor(media.videoDurationSeconds / 60)}:
                {(media.videoDurationSeconds % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        )}

        {/* Top Badges Bar */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Primary Profile Badge */}
            {isPrimary && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                <Star className="h-3 w-3 fill-white" /> Primary
              </span>
            )}

            {/* Marketplace Selected Badge */}
            {media.marketplaceSelected && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-700/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                <ShoppingBag className="h-3 w-3" /> Catalog #{media.marketplaceOrder || 1}
              </span>
            )}

            {/* Life Stage Badge */}
            {media.stage && (
              <span className="inline-flex items-center rounded-lg bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white">
                {media.stage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Visibility Badge */}
            {media.visibility === 'PUBLIC' && (
              <span className="rounded-lg bg-black/50 backdrop-blur-xs p-1 text-emerald-300" title="Public Visibility">
                <Globe className="h-3 w-3" />
              </span>
            )}
            {media.visibility === 'INTERNAL' && (
              <span className="rounded-lg bg-black/50 backdrop-blur-xs p-1 text-stone-300" title="Internal Farm Only">
                <Lock className="h-3 w-3" />
              </span>
            )}
            {media.visibility === 'RESTRICTED' && (
              <span className="rounded-lg bg-black/50 backdrop-blur-xs p-1 text-rose-300" title="Restricted / Confidential">
                <Shield className="h-3 w-3" />
              </span>
            )}

            {/* Verification Status */}
            {media.verificationStatus === 'VERIFIED' && (
              <span className="rounded-lg bg-emerald-700/95 backdrop-blur-xs p-1 text-white" title={`Verified by ${media.verifiedBy || 'Staff'}`}>
                <CheckCircle2 className="h-3 w-3" />
              </span>
            )}
            {media.verificationStatus === 'PENDING_REVIEW' && (
              <span className="rounded-lg bg-amber-500/95 backdrop-blur-xs p-1 text-white" title="Pending Verification Review">
                <Clock className="h-3 w-3" />
              </span>
            )}
            {media.verificationStatus === 'REJECTED' && (
              <span className="rounded-lg bg-rose-600/95 backdrop-blur-xs p-1 text-white" title="Verification Rejected">
                <XCircle className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* Multi-select Checkbox */}
        {showBatchCheckbox && onToggleSelect && (
          <div
            className={`absolute bottom-2 left-2 z-10 transition-opacity ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(media.id);
            }}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors shadow-xs ${
                isSelected
                  ? 'bg-emerald-800 border-emerald-800 text-white'
                  : 'bg-white/95 border-stone-300 hover:bg-white text-transparent'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Title and Category */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-semibold border mb-1.5 ${categoryInfo.bg} ${categoryInfo.text} ${categoryInfo.border}`}
            >
              {categoryInfo.label}
            </span>
            <h4
              className="text-xs font-semibold text-stone-900 truncate cursor-pointer hover:text-emerald-800 transition-colors"
              onClick={() => onOpenViewer(media)}
              title={media.title}
            >
              {media.title}
            </h4>
          </div>

          {/* Context Menu Trigger */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-7 z-50 w-48 rounded-2xl border border-stone-200 bg-white p-1.5 text-stone-800 shadow-xl text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenViewer(media);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 text-left transition-colors font-medium"
                  >
                    <Eye className="h-3.5 w-3.5 text-stone-500" /> Full Inspection
                  </button>

                  {!isPrimary && onSetPrimary && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onSetPrimary(media.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 text-left transition-colors font-medium"
                    >
                      <Star className="h-3.5 w-3.5 text-amber-500" /> Set as Primary Profile
                    </button>
                  )}

                  {onToggleMarketplace && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleMarketplace(media.id, !media.marketplaceSelected);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 text-left transition-colors font-medium"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
                      {media.marketplaceSelected ? 'Remove from Catalog' : 'Feature in Catalog'}
                    </button>
                  )}

                  {onVerify && media.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onVerify(media.id, 'VERIFIED');
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-emerald-800 text-left transition-colors font-semibold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verify Asset
                    </button>
                  )}

                  {onCompare && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onCompare(media);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 text-left transition-colors font-medium"
                    >
                      <Layers className="h-3.5 w-3.5 text-indigo-500" /> Compare Progression
                    </button>
                  )}

                  {onAddToAlbum && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onAddToAlbum(media.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 text-left transition-colors font-medium"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Add to Album
                    </button>
                  )}

                  {onDelete && (
                    <>
                      <div className="my-1 border-t border-stone-100" />
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onDelete(media.id);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-rose-50 text-rose-700 text-left transition-colors font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Asset
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Caption */}
        {media.caption && (
          <p className="mt-1 text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
            {media.caption}
          </p>
        )}

        {/* Linked Records & Tags */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {media.links && media.links.length > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-lg bg-stone-100 border border-stone-200/60 px-2 py-0.5 text-[10px] font-medium text-stone-700"
              title={media.links.map((l) => `${l.entityType}: ${l.label || l.entityId}`).join(', ')}
            >
              <Link2 className="h-2.5 w-2.5 text-stone-500" />
              {media.links[0].label || media.links[0].entityType}
              {media.links.length > 1 && ` +${media.links.length - 1}`}
            </span>
          )}

          {media.ageMonthsAtCapture !== undefined && (
            <span className="rounded-lg bg-stone-100 border border-stone-200/60 px-2 py-0.5 text-[10px] font-medium text-stone-600">
              {media.ageMonthsAtCapture} mos
            </span>
          )}

          {media.comments && media.comments.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-stone-400 ml-auto font-medium">
              <MessageSquare className="h-2.5 w-2.5" /> {media.comments.length}
            </span>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" /> {displayDate}
          </span>
          <span>{media.fileSize || 'Standard'}</span>
        </div>
      </div>
    </div>
  );
}
