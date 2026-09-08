'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AnimalMedia,
  MediaVerificationStatus,
  MediaVisibility,
  MediaComment,
} from '@/lib/bovine-types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Globe,
  Lock,
  Shield,
  ShoppingBag,
  MessageSquare,
  Link2,
  Info,
  Calendar,
  User,
  Camera,
  Hash,
  Send,
  Sparkles,
  Layers,
  History,
  Check,
} from 'lucide-react';

interface AnimalMediaViewerProps {
  media: AnimalMedia | null;
  mediaList?: AnimalMedia[];
  onClose: () => void;
  onNavigate?: (media: AnimalMedia) => void;
  onVerify?: (mediaId: string, status: MediaVerificationStatus, note?: string) => void;
  onUpdateVisibility?: (mediaId: string, visibility: MediaVisibility) => void;
  onSetPrimary?: (mediaId: string) => void;
  onToggleMarketplace?: (mediaId: string, selected: boolean) => void;
  onAddComment?: (mediaId: string, text: string) => void;
  onCompare?: (media: AnimalMedia) => void;
  currentUser?: { name: string; role: string };
}

export default function AnimalMediaViewer({
  media,
  mediaList = [],
  onClose,
  onNavigate,
  onVerify,
  onUpdateVisibility,
  onSetPrimary,
  onToggleMarketplace,
  onAddComment,
  onCompare,
  currentUser = { name: 'Dr. John Miller', role: 'Farm Manager' },
}: AnimalMediaViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'METADATA' | 'COMMENTS' | 'AUDIT'>('METADATA');
  const [commentInput, setCommentInput] = useState('');
  const [verifyNote, setVerifyNote] = useState('');
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<MediaVerificationStatus>('VERIFIED');

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!media) return null;

  const isVideo = media.mediaType === 'VIDEO' || !!media.videoDurationSeconds;
  const currentIndex = mediaList.findIndex((m) => m.id === media.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < mediaList.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onNavigate) {
        onNavigate(mediaList[currentIndex - 1]);
      }
      if (e.key === 'ArrowRight' && hasNext && onNavigate) {
        onNavigate(mediaList[currentIndex + 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, currentIndex, mediaList, onNavigate, onClose]);

  // Reset zoom & rotation on media change
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
    setIsPlaying(false);
    setShowVerifyPrompt(false);
  }, [media.id]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || media.videoDurationSeconds || 0);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !onAddComment) return;
    onAddComment(media.id, commentInput.trim());
    setCommentInput('');
  };

  const executeVerify = (status: MediaVerificationStatus) => {
    if (onVerify) {
      onVerify(media.id, status, verifyNote.trim() || undefined);
      setShowVerifyPrompt(false);
      setVerifyNote('');
    }
  };

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between px-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Close viewer (Esc)"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate max-w-md">{media.title}</h3>
            <p className="text-[11px] text-white/70">
              {currentIndex >= 0 ? `${currentIndex + 1} of ${mediaList.length} • ` : ''}
              {media.category} • {media.capturedAt || media.takenAt || 'Undated'}
            </p>
          </div>
        </div>

        {/* Viewing Tools */}
        <div className="flex items-center gap-2">
          {!isVideo && (
            <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1 backdrop-blur-xs">
              <button
                onClick={handleZoomOut}
                className="rounded p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-mono px-1 text-white">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="rounded p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleRotate}
                className="rounded p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors ml-1"
                title="Rotate 90°"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              {(zoomLevel !== 1 || rotation !== 0) && (
                <button
                  onClick={handleResetView}
                  className="rounded px-1.5 py-1 text-[10px] font-medium text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          )}

          {onCompare && (
            <button
              onClick={() => onCompare(media)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <Layers className="h-3.5 w-3.5" /> Compare Progression
            </button>
          )}
        </div>
      </div>

      {/* Main Container: Media Canvas on Left, Drawer on Right */}
      <div className="flex h-full w-full pt-14 flex-col lg:flex-row overflow-hidden">
        {/* Left: Media Canvas */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/40 p-4 select-none">
          {/* Previous Media Arrow */}
          {hasPrev && onNavigate && (
            <button
              onClick={() => onNavigate(mediaList[currentIndex - 1])}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-lg backdrop-blur-xs"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next Media Arrow */}
          {hasNext && onNavigate && (
            <button
              onClick={() => onNavigate(mediaList[currentIndex + 1])}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-lg backdrop-blur-xs"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Media Content */}
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            {isVideo ? (
              <div className="relative flex flex-col items-center justify-center max-h-full max-w-4xl w-full">
                <video
                  ref={videoRef}
                  src={media.url}
                  poster={media.thumbnailUrl}
                  className="max-h-[70vh] w-auto rounded-lg shadow-2xl"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                />

                {/* Video Controls Bar */}
                <div className="mt-3 flex w-full max-w-2xl items-center gap-3 rounded-xl bg-black/70 p-2.5 backdrop-blur-md text-white">
                  <button
                    onClick={togglePlay}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </button>

                  <span className="text-[11px] font-mono w-10 text-right">{formatSecs(currentTime)}</span>

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="flex-1 accent-emerald-600 h-1.5 rounded-lg bg-white/20 cursor-pointer"
                  />

                  <span className="text-[11px] font-mono w-10 text-left text-white/60">
                    {formatSecs(duration || media.videoDurationSeconds || 0)}
                  </span>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded p-1 text-white/70 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>

                {/* Video Chapters Jumps */}
                {media.videoChapters && media.videoChapters.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap justify-center">
                    <span className="text-[10px] text-white/60 uppercase font-semibold mr-1">Chapters:</span>
                    {media.videoChapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSeek(ch.timestampSeconds ?? 0)}
                        className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-800 hover:text-white transition-colors"
                      >
                        {formatSecs(ch.timestampSeconds ?? 0)} {ch.title || ch.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="transition-transform duration-150 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={media.url}
                  alt={media.title}
                  className="max-h-[80vh] max-w-[85vw] lg:max-w-[65vw] object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Rich Metadata & Workflow Drawer */}
        <div className="w-full lg:w-96 shrink-0 border-l border-stone-200 bg-white flex flex-col h-auto lg:h-full overflow-hidden shadow-2xl">
          {/* Drawer Subtabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 p-1.5 text-xs gap-1">
            <button
              onClick={() => setActiveTab('METADATA')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'METADATA'
                  ? 'bg-white text-emerald-900 shadow-2xs border border-stone-200/80 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Info className="h-3.5 w-3.5" /> Details
            </button>
            <button
              onClick={() => setActiveTab('COMMENTS')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'COMMENTS'
                  ? 'bg-white text-emerald-900 shadow-2xs border border-stone-200/80 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Notes ({media.comments?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'AUDIT'
                  ? 'bg-white text-emerald-900 shadow-2xs border border-stone-200/80 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Audit Log
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {activeTab === 'METADATA' && (
              <>
                {/* Title & Caption */}
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">{media.title}</h4>
                  {media.caption && (
                    <p className="mt-1 text-stone-500 leading-relaxed">{media.caption}</p>
                  )}
                </div>

                {/* Verification Action Card */}
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                      Verification Status
                    </span>
                    {media.verificationStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {media.verificationStatus === 'PENDING_REVIEW' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Clock className="h-3 w-3" /> Pending Review
                      </span>
                    )}
                    {media.verificationStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                  </div>

                  {media.verifiedBy && (
                    <p className="text-[11px] text-stone-500">
                      Audited by <strong className="text-stone-800">{media.verifiedBy}</strong> on{' '}
                      {media.verifiedAt?.split('T')[0]}
                    </p>
                  )}

                  {media.verificationNote && (
                    <p className="rounded-xl bg-white p-2.5 text-[11px] text-stone-700 italic border border-stone-200/70">
                      "{media.verificationNote}"
                    </p>
                  )}

                  {/* Verification action buttons */}
                  {onVerify && !showVerifyPrompt && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setPendingStatus('VERIFIED');
                          setShowVerifyPrompt(true);
                        }}
                        className="flex-1 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve Asset
                      </button>
                      <button
                        onClick={() => {
                          setPendingStatus('REJECTED');
                          setShowVerifyPrompt(true);
                        }}
                        className="rounded-xl border border-stone-300 hover:border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-semibold px-3.5 py-2 text-xs transition-colors shadow-2xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {showVerifyPrompt && (
                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <p className="text-[11px] font-medium text-stone-900">
                        Add verification audit remark for <strong>{pendingStatus}</strong>:
                      </p>
                      <input
                        type="text"
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="e.g. Conformation and ear tag clear, matches pedigree"
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setShowVerifyPrompt(false)}
                          className="rounded-xl px-3 py-1.5 text-[11px] font-medium text-stone-500 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => executeVerify(pendingStatus)}
                          className={`rounded-xl px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xs ${
                            pendingStatus === 'VERIFIED' ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-rose-700 hover:bg-rose-800'
                          }`}
                        >
                          Confirm {pendingStatus}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Profile & Marketplace Controls */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                    Presentation & Catalog
                  </span>

                  <div className="flex flex-col gap-2">
                    {onSetPrimary && (
                      <button
                        onClick={() => onSetPrimary(media.id)}
                        disabled={media.isIdentityPhoto || media.isProfile}
                        className={`flex items-center justify-between rounded-2xl border p-3 transition-colors text-left ${
                          media.isIdentityPhoto || media.isProfile
                            ? 'border-amber-300 bg-amber-50 text-amber-900'
                            : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50 text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Star className={`h-4 w-4 ${media.isIdentityPhoto ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
                          <div>
                            <p className="font-semibold text-stone-900">Primary Identity Photo</p>
                            <p className="text-[10px] text-stone-500">Used on passports, ear tags & header card</p>
                          </div>
                        </div>
                        {media.isIdentityPhoto ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-lg">Active</span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-800">Set Primary</span>
                        )}
                      </button>
                    )}

                    {onToggleMarketplace && (
                      <button
                        onClick={() => onToggleMarketplace(media.id, !media.marketplaceSelected)}
                        className={`flex items-center justify-between rounded-2xl border p-3 transition-colors text-left ${
                          media.marketplaceSelected
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                            : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50 text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ShoppingBag className={`h-4 w-4 ${media.marketplaceSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                          <div>
                            <p className="font-semibold text-stone-900">Marketplace Commercial Showcase</p>
                            <p className="text-[10px] text-stone-500">Publicly visible on buyer genetics catalog</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${media.marketplaceSelected ? 'text-emerald-800 bg-emerald-100/60 font-bold' : 'text-stone-500'}`}>
                          {media.marketplaceSelected ? 'Enrolled' : 'Enable'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Visibility Configuration */}
                {onUpdateVisibility && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                      Visibility Scope
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['PUBLIC', 'INTERNAL', 'RESTRICTED'] as MediaVisibility[]).map((v) => (
                        <button
                          key={v}
                          onClick={() => onUpdateVisibility(media.id, v)}
                          className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-[11px] font-semibold transition-colors ${
                            media.visibility === v
                              ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                              : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                          }`}
                        >
                          {v === 'PUBLIC' && <Globe className="h-3 w-3" />}
                          {v === 'INTERNAL' && <Lock className="h-3 w-3" />}
                          {v === 'RESTRICTED' && <Shield className="h-3 w-3" />}
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Clinical & Breeding Records */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                    Linked Operational Records
                  </span>
                  {media.links && media.links.length > 0 ? (
                    <div className="space-y-1.5">
                      {media.links.map((lnk) => (
                        <div
                          key={lnk.id}
                          className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="h-3.5 w-3.5 text-emerald-800" />
                            <div>
                              <p className="font-semibold text-stone-900">{lnk.label || lnk.entityType}</p>
                              <p className="text-[10px] text-stone-400">ID: {lnk.entityId}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic">No linked records attached.</p>
                  )}
                </div>

                {/* Technical Specifications */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                    Technical Specifications & Hash
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="rounded-xl bg-stone-50 border border-stone-200/70 p-2.5">
                      <span className="text-stone-400 block text-[10px] uppercase font-sans font-medium">File Size</span>
                      <span className="text-stone-800 font-medium">{media.fileSize || '2.1 MB'}</span>
                    </div>
                    <div className="rounded-xl bg-stone-50 border border-stone-200/70 p-2.5">
                      <span className="text-stone-400 block text-[10px] uppercase font-sans font-medium">Device</span>
                      <span className="text-stone-800 font-medium truncate block">{media.cameraModel || 'Standard Sensor'}</span>
                    </div>
                    <div className="col-span-2 rounded-xl bg-stone-50 border border-stone-200/70 p-2.5">
                      <span className="text-stone-400 block text-[10px] uppercase font-sans font-medium">SHA-256 Checksum</span>
                      <span className="text-stone-700 break-all text-[10px]">
                        {media.checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'COMMENTS' && (
              <div className="space-y-4">
                {/* Existing comments list */}
                <div className="space-y-2.5">
                  {media.comments && media.comments.length > 0 ? (
                    media.comments.map((comm) => (
                      <div key={comm.id} className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-stone-900">{comm.authorName}</span>
                          <span className="text-stone-400">{comm.date?.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed">{comm.text || comm.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-stone-400 italic">
                      No staff remarks on this asset yet.
                    </p>
                  )}
                </div>

                {/* Add new comment form */}
                {onAddComment && (
                  <form onSubmit={handleCommentSubmit} className="space-y-2 pt-3 border-t border-stone-100">
                    <label className="text-[11px] font-semibold text-stone-700">Add Technical Remark</label>
                    <textarea
                      rows={2}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="e.g. Verified claw angle and heel depth during trimming"
                      className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-800 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-emerald-900 shadow-xs transition-colors"
                    >
                      <Send className="h-3 w-3" /> Post Note
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'AUDIT' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                  Lifecycle Audit History
                </span>
                {media.auditHistory && media.auditHistory.length > 0 ? (
                  <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-stone-200">
                    {media.auditHistory.map((aud) => (
                      <div key={aud.id} className="relative">
                        <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-emerald-800" />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-stone-900 uppercase">{aud.action.replace(/_/g, ' ')}</span>
                          <span className="text-stone-400 font-mono">{aud.timestamp?.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">{aud.details || 'Audit record'}</p>
                        <p className="text-[10px] text-emerald-800 font-medium">By: {aud.actorName}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-400 italic py-4">No audit entries recorded.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
