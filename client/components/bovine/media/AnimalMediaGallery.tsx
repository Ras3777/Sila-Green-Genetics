'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  AnimalMedia,
  MediaCategory,
  MediaVerificationStatus,
  MediaVisibility,
  MediaAlbum,
} from '@/lib/bovine-types';
import AnimalMediaGrid from './AnimalMediaGrid';
import AnimalMediaTimeline from './AnimalMediaTimeline';
import AnimalMediaList from './AnimalMediaList';
import AnimalMediaViewer from './AnimalMediaViewer';
import AnimalMediaUploader from './AnimalMediaUploader';
import AnimalCameraCapture from './AnimalCameraCapture';
import AnimalMediaBeforeAfter from './AnimalMediaBeforeAfter';
import AnimalMediaStageComparison from './AnimalMediaStageComparison';
import AnimalMediaMarketplaceSelector from './AnimalMediaMarketplaceSelector';
import AnimalMediaCompletenessCard from './AnimalMediaCompletenessCard';
import {
  Camera,
  Upload,
  Layers,
  Sparkles,
  ShoppingBag,
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Calendar,
  FolderPlus,
  ShieldCheck,
  Video,
  CheckCircle2,
  Clock,
  ChevronRight,
  Folder,
  X,
  FileText,
  Lock,
} from 'lucide-react';

interface AnimalMediaGalleryProps {
  animalId: string;
  variant?: 'FARM_ANIMAL' | 'BREEDING_STOCK' | 'CANONICAL';
  backHref?: string;
  hideHeroBanner?: boolean;
}

export default function AnimalMediaGallery({
  animalId,
  variant = 'CANONICAL',
  backHref,
  hideHeroBanner = false,
}: AnimalMediaGalleryProps) {
  const {
    animals,
    media,
    mediaAlbums,
    addAnimalMedia,
    updateAnimalMedia,
    deleteAnimalMedia,
    setPrimaryProfilePhoto,
    addMediaComment,
    verifyAnimalMedia,
    updateMediaVisibility,
    toggleMarketplaceMedia,
    createMediaAlbum,
    addMediaToAlbum,
    removeMediaFromAlbum,
    session,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);

  // View state
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PHOTOS' | 'VIDEOS' | 'TIMELINE' | 'ALBUMS' | 'TAGGED' | 'MARKETPLACE' | 'PRIVATE'
  >('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TIMELINE' | 'LIST'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'CATEGORY'>('NEWEST');

  // Active album filter (if viewing inside an album)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Modals state
  const [activeViewerMedia, setActiveViewerMedia] = useState<AnimalMedia | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isGuidedCaptureOpen, setIsGuidedCaptureOpen] = useState(false);
  const [isBeforeAfterOpen, setIsBeforeAfterOpen] = useState(false);
  const [isStageComparisonOpen, setIsStageComparisonOpen] = useState(false);
  const [isMarketplaceCuratorOpen, setIsMarketplaceCuratorOpen] = useState(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  // Animal media pool
  const animalMediaList = useMemo(() => {
    return media.filter((m) => m.animalId === animalId);
  }, [media, animalId]);

  // Filtered list based on subtabs, search, and dropdowns
  const filteredList = useMemo(() => {
    return animalMediaList.filter((m) => {
      // Subtab filter
      if (activeTab === 'PHOTOS' && (m.mediaType === 'VIDEO' || m.videoDurationSeconds)) return false;
      if (activeTab === 'VIDEOS' && m.mediaType !== 'VIDEO' && !m.videoDurationSeconds) return false;
      if (activeTab === 'TAGGED' && (!m.links || m.links.length === 0)) return false;
      if (activeTab === 'MARKETPLACE' && !m.marketplaceSelected) return false;
      if (activeTab === 'PRIVATE' && m.visibility !== 'RESTRICTED') return false;

      // Album filter
      if (selectedAlbumId) {
        const album = mediaAlbums.find((a) => a.id === selectedAlbumId);
        if (album && !album.mediaIds.includes(m.id)) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCaption = m.caption?.toLowerCase().includes(q) || false;
        const matchTags = m.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        const matchAuthor = m.capturedBy?.toLowerCase().includes(q) || m.uploadedBy?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchCaption && !matchTags && !matchAuthor) return false;
      }

      // Category Dropdown
      if (categoryFilter !== 'ALL' && m.category !== categoryFilter) return false;

      // Stage Dropdown
      if (stageFilter !== 'ALL' && m.stage !== stageFilter) return false;

      // Verification Dropdown
      if (verificationFilter !== 'ALL' && m.verificationStatus !== verificationFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') {
        const dA = new Date(a.capturedAt || a.takenAt || a.uploadedAt || 0).getTime();
        const dB = new Date(b.capturedAt || b.takenAt || b.uploadedAt || 0).getTime();
        return dB - dA;
      }
      if (sortBy === 'OLDEST') {
        const dA = new Date(a.capturedAt || a.takenAt || a.uploadedAt || 0).getTime();
        const dB = new Date(b.capturedAt || b.takenAt || b.uploadedAt || 0).getTime();
        return dA - dB;
      }
      if (sortBy === 'CATEGORY') {
        return (a.category || '').localeCompare(b.category || '');
      }
      return 0;
    });
  }, [
    animalMediaList,
    activeTab,
    selectedAlbumId,
    mediaAlbums,
    searchQuery,
    categoryFilter,
    stageFilter,
    verificationFilter,
    sortBy,
  ]);

  // Statistics
  const totalCount = animalMediaList.length;
  const verifiedCount = animalMediaList.filter((m) => m.verificationStatus === 'VERIFIED').length;
  const videoCount = animalMediaList.filter((m) => m.mediaType === 'VIDEO' || m.videoDurationSeconds).length;
  const marketplaceCount = animalMediaList.filter((m) => m.marketplaceSelected).length;
  const verifiedPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;
    createMediaAlbum({
      title: newAlbumTitle.trim(),
      description: newAlbumDesc.trim() || undefined,
      animalId,
      mediaIds: [],
    });
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setIsCreateAlbumOpen(false);
  };

  if (!animal) {
    return (
      <div className="p-8 text-center text-stone-500">
        <p className="text-sm font-semibold text-stone-700">Animal record #{animalId} not found.</p>
        <Link href="/bovine/animals" className="mt-2 text-xs text-emerald-800 hover:underline block font-semibold">
          Return to Animal Registry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Context Info */}
      {!hideHeroBanner ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
              <img
                src={animal.photoUrl || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=300&auto=format&fit=crop&q=80'}
                alt={animal.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-stone-900">{animal.name}</h2>
                <span className="rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200 px-2.5 py-0.5">
                  {animal.primaryIdentifier}
                </span>
                <span className="rounded-lg bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 border border-stone-200">
                  {variant === 'BREEDING_STOCK'
                    ? 'Breeding Stock Gallery'
                    : variant === 'FARM_ANIMAL'
                    ? 'Farm Animal Gallery'
                    : 'Canonical Media Ledger'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {animal.breed} • {animal.sex} • {animal.status} • {totalCount} total media records
              </p>
            </div>
          </div>

          {/* Global Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4" /> Upload Evidence
            </button>

            <button
              type="button"
              onClick={() => setIsGuidedCaptureOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4 text-emerald-700" /> Guided Field Cam
            </button>

            <button
              type="button"
              onClick={() => setIsBeforeAfterOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
              title="Side by side comparison"
            >
              <Layers className="h-4 w-4 text-indigo-700" /> Compare
            </button>

            <button
              type="button"
              onClick={() => setIsStageComparisonOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
              title="Lifecycle stage progression"
            >
              <Sparkles className="h-4 w-4 text-amber-700" /> Stages
            </button>

            <button
              type="button"
              onClick={() => setIsMarketplaceCuratorOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
              title="Curate marketplace catalog"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-700" /> Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>
                {variant === 'BREEDING_STOCK'
                  ? 'Breeding Conformation & Photographic Dossier'
                  : variant === 'FARM_ANIMAL'
                  ? 'Operational Farm Evidence & Field Media'
                  : 'Canonical Livestock Media Ledger'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {animal.name} &bull; Visual Evidence &amp; Media
            </h2>
            <p className="text-xs text-stone-500">
              Conformation angles, ultrasound scans, locomotion clips, and biometric verification records ({totalCount} assets).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Evidence</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGuidedCaptureOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-800" />
              <span>Guided Field Cam</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBeforeAfterOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Side by side comparison"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-700" />
              <span>Compare</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStageComparisonOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Lifecycle stage progression"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Stages</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMarketplaceCuratorOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Curate marketplace catalog"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" />
              <span>Catalog</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Evidence</span>
          <p className="text-xl font-bold font-mono text-stone-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-stone-500 block mt-0.5">Photos &amp; Videos</span>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Audit Verified</span>
          <p className="text-xl font-bold font-mono text-emerald-900 mt-1">{verifiedCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">{verifiedPct}% compliance</span>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Gait &amp; Videos</span>
          <p className="text-xl font-bold font-mono text-stone-900 mt-1">{videoCount}</p>
          <span className="text-[11px] text-stone-500 block mt-0.5">Locomotion clips</span>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Catalog Featured</span>
          <p className="text-xl font-bold font-mono text-amber-900 mt-1">{marketplaceCount}</p>
          <span className="text-[11px] text-amber-700 font-medium block mt-0.5">Enrolled in marketplace</span>
        </div>
      </div>

      {/* Media Dossier Completeness Meter */}
      <AnimalMediaCompletenessCard
        mediaList={animalMediaList}
        onOpenGuidedCapture={() => setIsGuidedCaptureOpen(true)}
        onOpenViewer={(m) => setActiveViewerMedia(m)}
      />

      {/* Subtabs Bar & View Mode Toggle */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-2 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All (${totalCount})` },
            { id: 'PHOTOS', label: `Photos (${totalCount - videoCount})` },
            { id: 'VIDEOS', label: `Videos (${videoCount})` },
            { id: 'TIMELINE', label: 'Timeline' },
            { id: 'ALBUMS', label: `Albums (${mediaAlbums.length})` },
            { id: 'TAGGED', label: 'Linked Records' },
            { id: 'MARKETPLACE', label: `Catalog (${marketplaceCount})` },
            { id: 'PRIVATE', label: 'Confidential' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedAlbumId(null);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('GRID')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'GRID'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('TIMELINE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'TIMELINE'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Timeline view"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'LIST'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Ledger list view"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title, tag, or note..."
            className="w-full bg-white rounded-xl border border-stone-300 pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white rounded-xl border border-stone-300 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="ALL">All Categories</option>
            <option value="IDENTIFICATION">Identification</option>
            <option value="CONFORMATION">Conformation</option>
            <option value="HEALTH_CLINICAL">Health / Clinical</option>
            <option value="REPRODUCTION">Reproduction</option>
            <option value="ULTRASOUND">Ultrasound Scan</option>
            <option value="SEMEN_ANALYSIS">Semen Analysis</option>
            <option value="CALVING">Calving</option>
            <option value="GROWTH_STAGE">Growth Stage</option>
            <option value="WALKING_VIDEO">Gait / Video</option>
            <option value="MARKETPLACE_HERO">Marketplace Hero</option>
          </select>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-white rounded-xl border border-stone-300 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="ALL">All Life Stages</option>
            <option value="BIRTH">Birth Phase</option>
            <option value="MATERNAL">Maternal Phase I</option>
            <option value="WEANING">Weaning Phase II</option>
            <option value="YEARLING">Yearling Phase III</option>
            <option value="MATURE">Mature Herd Stock</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-white rounded-xl border border-stone-300 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="ALL">All Verification</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white rounded-xl border border-stone-300 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="NEWEST">Newest Captured</option>
            <option value="OLDEST">Oldest Captured</option>
            <option value="CATEGORY">By Category</option>
          </select>

          {(searchQuery || categoryFilter !== 'ALL' || stageFilter !== 'ALL' || verificationFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setStageFilter('ALL');
                setVerificationFilter('ALL');
              }}
              className="rounded-xl p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              title="Reset Filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Album Breadcrumb (if inside an album) */}
      {selectedAlbumId && (
        <div className="flex items-center justify-between rounded-2xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-indigo-700" />
            <span className="font-semibold text-indigo-900">
              Album: {mediaAlbums.find((a) => a.id === selectedAlbumId)?.title}
            </span>
          </div>
          <button
            onClick={() => setSelectedAlbumId(null)}
            className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
          >
            Back to All Albums
          </button>
        </div>
      )}

      {/* Main Content Area based on Subtabs and View Mode */}
      {activeTab === 'ALBUMS' && !selectedAlbumId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Animal Media Albums ({mediaAlbums.length})</h3>
            <button
              type="button"
              onClick={() => setIsCreateAlbumOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" /> Create New Album
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaAlbums.map((album) => {
              const albumMedia = media.filter((m) => album.mediaIds.includes(m.id));
              const coverMedia = albumMedia[0];

              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-700/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/9] w-full bg-stone-100 relative overflow-hidden">
                    {coverMedia ? (
                      <img
                        src={coverMedia.thumbnailUrl || coverMedia.url}
                        alt={album.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-400">
                        <Folder className="w-8 h-8" />
                      </div>
                    )}
                    {album.isSystemAlbum && (
                      <span className="absolute top-2 left-2 rounded-md bg-stone-900/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                        System Album
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 rounded-md bg-stone-900/80 px-2 py-0.5 text-[11px] font-mono font-medium text-white backdrop-blur-xs">
                      {albumMedia.length} assets
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {album.title}
                      </h4>
                      {album.description && (
                        <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                      <span>View Album Contents</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === 'TIMELINE' || activeTab === 'TIMELINE' ? (
        <AnimalMediaTimeline
          mediaList={filteredList}
          onOpenViewer={(m) => setActiveViewerMedia(m)}
          onCompare={(m) => {
            setActiveViewerMedia(null);
            setIsBeforeAfterOpen(true);
          }}
        />
      ) : viewMode === 'LIST' ? (
        <AnimalMediaList
          mediaList={filteredList}
          onOpenViewer={(m) => setActiveViewerMedia(m)}
          onSetPrimary={(id) => setPrimaryProfilePhoto(animalId, id)}
          onVerify={(id, st) => verifyAnimalMedia(id, st)}
          onToggleMarketplace={(id, sel) => toggleMarketplaceMedia(id, sel)}
          onDelete={(id) => deleteAnimalMedia(id)}
        />
      ) : (
        <AnimalMediaGrid
          mediaList={filteredList}
          onOpenViewer={(m) => setActiveViewerMedia(m)}
          onSetPrimary={(id) => setPrimaryProfilePhoto(animalId, id)}
          onVerify={(id, st) => verifyAnimalMedia(id, st)}
          onToggleMarketplace={(id, sel) => toggleMarketplaceMedia(id, sel)}
          onDelete={(id) => deleteAnimalMedia(id)}
          onCompare={(m) => {
            setActiveViewerMedia(null);
            setIsBeforeAfterOpen(true);
          }}
          onBatchVerify={(ids, st) => {
            ids.forEach((id) => verifyAnimalMedia(id, st));
          }}
          onBatchMarketplace={(ids, sel) => {
            ids.forEach((id) => toggleMarketplaceMedia(id, sel));
          }}
          onBatchDelete={(ids) => {
            ids.forEach((id) => deleteAnimalMedia(id));
          }}
          onOpenUploader={() => setIsUploaderOpen(true)}
        />
      )}

      {/* Lightbox Viewer */}
      {activeViewerMedia && (
        <AnimalMediaViewer
          media={activeViewerMedia}
          mediaList={filteredList}
          onClose={() => setActiveViewerMedia(null)}
          onNavigate={(m) => setActiveViewerMedia(m)}
          onVerify={(id, st, note) => verifyAnimalMedia(id, st, note)}
          onUpdateVisibility={(id, vis) => updateMediaVisibility(id, vis)}
          onSetPrimary={(id) => setPrimaryProfilePhoto(animalId, id)}
          onToggleMarketplace={(id, sel) => toggleMarketplaceMedia(id, sel)}
          onAddComment={(id, text) =>
            addMediaComment(id, {
              authorName: session.name || 'Staff User',
              authorRole: session.role || 'Farm Staff',
              text,
            })
          }
          onCompare={(m) => {
            setActiveViewerMedia(null);
            setIsBeforeAfterOpen(true);
          }}
        />
      )}

      {/* Uploader Modal */}
      {isUploaderOpen && (
        <AnimalMediaUploader
          animalId={animalId}
          isOpen={isUploaderOpen}
          onClose={() => setIsUploaderOpen(false)}
          onUpload={(data) => {
            addAnimalMedia(data);
          }}
        />
      )}

      {/* Guided Camera Capture Modal */}
      {isGuidedCaptureOpen && (
        <AnimalCameraCapture
          animalId={animalId}
          isOpen={isGuidedCaptureOpen}
          onClose={() => setIsGuidedCaptureOpen(false)}
          onCapture={(data) => {
            addAnimalMedia(data);
          }}
        />
      )}

      {/* Before / After Comparison Modal */}
      {isBeforeAfterOpen && (
        <AnimalMediaBeforeAfter
          mediaList={animalMediaList}
          isOpen={isBeforeAfterOpen}
          onClose={() => setIsBeforeAfterOpen(false)}
        />
      )}

      {/* Lifecycle Stage Comparison Modal */}
      {isStageComparisonOpen && (
        <AnimalMediaStageComparison
          mediaList={animalMediaList}
          isOpen={isStageComparisonOpen}
          onClose={() => setIsStageComparisonOpen(false)}
          onOpenViewer={(m) => setActiveViewerMedia(m)}
          onAddStagePhoto={(stg) => {
            setIsStageComparisonOpen(false);
            setIsUploaderOpen(true);
          }}
        />
      )}

      {/* Marketplace Media Curator Modal */}
      {isMarketplaceCuratorOpen && (
        <AnimalMediaMarketplaceSelector
          mediaList={animalMediaList}
          isOpen={isMarketplaceCuratorOpen}
          onClose={() => setIsMarketplaceCuratorOpen(false)}
          onUpdateMarketplaceList={(items) => {
            items.forEach((item) => {
              toggleMarketplaceMedia(item.mediaId, item.selected, item.order);
            });
          }}
        />
      )}

      {/* Create Album Modal */}
      {isCreateAlbumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-emerald-800" />
                Create Animal Media Album
              </h4>
              <button
                onClick={() => setIsCreateAlbumOpen(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbumSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Album Title *</label>
                <input
                  type="text"
                  required
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="e.g. 2026 Conformation Progression"
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 py-2 text-xs text-stone-900 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-all placeholder:text-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="e.g. Collection of lateral stance and walking photos for exhibition review"
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-xs text-stone-900 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-all placeholder:text-stone-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateAlbumOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2 text-xs font-semibold shadow-xs transition-colors"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
