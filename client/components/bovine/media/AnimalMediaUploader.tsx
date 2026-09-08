'use client';

import React, { useState } from 'react';
import {
  AnimalMedia,
  MediaCategory,
  MediaVisibility,
  MediaVerificationStatus,
} from '@/lib/bovine-types';
import {
  Upload,
  X,
  Camera,
  CheckCircle2,
  Wifi,
  WifiOff,
  Star,
  ShoppingBag,
  Link2,
  Calendar,
  Image as ImageIcon,
  Video,
  FileCode,
  Shield,
  Layers,
} from 'lucide-react';

interface AnimalMediaUploaderProps {
  animalId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (mediaData: Omit<AnimalMedia, 'id'>) => void;
  currentUser?: { name: string; role: string };
}

export default function AnimalMediaUploader({
  animalId,
  isOpen,
  onClose,
  onUpload,
  currentUser = { name: 'Dr. John Miller', role: 'Farm Manager' },
}: AnimalMediaUploaderProps) {
  const [isFieldMode, setIsFieldMode] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<MediaCategory>('CONFORMATION');
  const [stage, setStage] = useState<'BIRTH' | 'MATERNAL' | 'WEANING' | 'YEARLING' | 'MATURE'>('MATURE');
  const [visibility, setVisibility] = useState<MediaVisibility>('INTERNAL');
  const [url, setUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [featureMarketplace, setFeatureMarketplace] = useState(false);
  const [capturedAt, setCapturedAt] = useState(new Date().toISOString().split('T')[0]);
  const [capturedBy, setCapturedBy] = useState(currentUser.name);
  const [deviceModel, setDeviceModel] = useState('Apple iPhone 16 Pro (LiDAR)');
  const [linkedEntityType, setLinkedEntityType] = useState<string>('NONE');
  const [linkedEntityLabel, setLinkedEntityLabel] = useState<string>('');
  const [tags, setTags] = useState<string>('conformation, routine');

  // Quick preset sample URLs for rapid testing
  const SAMPLE_PRESETS = [
    {
      label: 'Side Conformation',
      url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1200&auto=format&fit=crop&q=80',
      category: 'CONFORMATION' as MediaCategory,
      title: 'Left Flank Conformation Profile',
    },
    {
      label: 'Ultrasound Scan',
      url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1200&auto=format&fit=crop&q=80',
      category: 'ULTRASOUND' as MediaCategory,
      title: 'Ovarian Follicle Diagnostic Sonogram',
    },
    {
      label: 'Walking Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      category: 'WALKING_VIDEO' as MediaCategory,
      title: 'Locomotion & Hoof Tracking Video',
    },
    {
      label: 'Ear Tag Close-up',
      url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&auto=format&fit=crop&q=80',
      category: 'IDENTIFICATION' as MediaCategory,
      title: 'Official USDA Ear Tag Close-up Verification',
    },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const mediaUrl =
      url.trim() ||
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1200&auto=format&fit=crop&q=80';

    const isVideo = mediaUrl.endsWith('.mp4') || category === 'WALKING_VIDEO';

    const newMedia: Omit<AnimalMedia, 'id'> = {
      animalId,
      title: title.trim(),
      caption: caption.trim() || undefined,
      category,
      stage,
      mediaType: isVideo ? 'VIDEO' : 'PHOTO',
      url: mediaUrl,
      thumbnailUrl: mediaUrl,
      capturedAt: `${capturedAt}T10:00:00Z`,
      uploadedAt: new Date().toISOString(),
      capturedBy: capturedBy.trim() || currentUser.name,
      uploadedBy: currentUser.name,
      cameraModel: deviceModel.trim(),
      isIdentityPhoto: isPrimary,
      isProfile: isPrimary,
      visibility,
      verificationStatus: 'PENDING_REVIEW' as MediaVerificationStatus,
      marketplaceSelected: featureMarketplace,
      marketplaceStatus: featureMarketplace ? 'APPROVED_FOR_PUBLIC' : 'NOT_LISTED',
      marketplaceOrder: featureMarketplace ? 1 : undefined,
      fileSize: isVideo ? '18.4 MB' : '3.8 MB',
      checksum: `sha256-${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
      videoDurationSeconds: isVideo ? 45 : undefined,
      videoChapters: isVideo
        ? [
            { timestamp: '00:00', label: 'Introduction & Frontal Stance', timestampSeconds: 0, title: 'Introduction & Frontal Stance' },
            { timestamp: '00:15', label: 'Lateral Walking Cadence', timestampSeconds: 15, title: 'Lateral Walking Cadence' },
            { timestamp: '00:30', label: 'Rear Leg & Hock Flexion', timestampSeconds: 30, title: 'Rear Leg & Hock Flexion' },
          ]
        : undefined,
      links:
        linkedEntityType !== 'NONE' && linkedEntityLabel
          ? [
              {
                id: `lnk-${Date.now()}`,
                mediaAssetId: '',
                entityType: linkedEntityType as any,
                relationType: 'SUPPORTING',
                entityId: `ent-${Date.now()}`,
                label: linkedEntityLabel,
              },
            ]
          : [],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onUpload(newMedia);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Upload Animal Media Evidence</h3>
              <p className="text-xs text-stone-500">
                Canonical photo, video, or diagnostic record for Animal #{animalId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Field / Offline Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsFieldMode(!isFieldMode)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition-colors border ${
                isFieldMode
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-2xs'
              }`}
              title="Field mode saves evidence with offline capture flag for later sync"
            >
              {isFieldMode ? <WifiOff className="h-3.5 w-3.5 text-amber-600" /> : <Wifi className="h-3.5 w-3.5 text-stone-400" />}
              {isFieldMode ? 'Field / Offline Mode' : 'Online Sync'}
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Quick Presets for Demo / Testing */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3 space-y-2">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
              Quick Sample Presets
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTitle(p.title);
                    setUrl(p.url);
                    setCategory(p.category);
                  }}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/30 transition-colors shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title and Media URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Asset Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Right Flank Conformation Profile"
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all placeholder:text-stone-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Media URL (Image or Video) *</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://... (or select a quick preset above)"
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Caption / Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Technical Caption & Observation Notes</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Optimal skeletal depth, strong rump width, excellent claw pigmentation, clean skin folds."
              className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all placeholder:text-stone-400 resize-none"
            />
          </div>

          {/* Category & Life Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              >
                <option value="CONFORMATION">Conformation (Side / Rear)</option>
                <option value="IDENTIFICATION">Identification (Muzzle / Tag)</option>
                <option value="HEALTH_CLINICAL">Health / Clinical / Hoof</option>
                <option value="REPRODUCTION">Reproduction / OPU</option>
                <option value="ULTRASOUND">Ultrasound Scan</option>
                <option value="SEMEN_ANALYSIS">Semen Analysis (CASA)</option>
                <option value="CALVING">Calving / Neonatal</option>
                <option value="GROWTH_STAGE">Growth Stage Milestone</option>
                <option value="MARKETPLACE_HERO">Marketplace Hero Showcase</option>
                <option value="WALKING_VIDEO">Walking / Locomotion Video</option>
                <option value="OTHER">General Documentation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Lifecycle Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              >
                <option value="BIRTH">Birth (Day 0 - 14)</option>
                <option value="MATERNAL">Maternal Phase I (Day 15 - 120)</option>
                <option value="WEANING">Weaning Phase II (Day 120 - 205)</option>
                <option value="YEARLING">Yearling Phase III (Day 205 - 365)</option>
                <option value="MATURE">Mature Herd Stock (365d+)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Access Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as MediaVisibility)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              >
                <option value="INTERNAL">Internal Farm Staff Only</option>
                <option value="PUBLIC">Public (Buyer Marketplace)</option>
                <option value="RESTRICTED">Restricted (Veterinary Confidential)</option>
              </select>
            </div>
          </div>

          {/* Capture Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Captured Date</label>
              <input
                type="date"
                value={capturedAt}
                onChange={(e) => setCapturedAt(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Operator / Technician</label>
              <input
                type="text"
                value={capturedBy}
                onChange={(e) => setCapturedBy(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Capture Device</label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Operational Linkage */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
              Link Directly to Operational Workflow Record
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-500">Record Type</label>
                <select
                  value={linkedEntityType}
                  onChange={(e) => setLinkedEntityType(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all"
                >
                  <option value="NONE">No direct link (Standalone)</option>
                  <option value="HEALTH_EVENT">Health & Clinical Case</option>
                  <option value="BREEDING_EVENT">Breeding / Insemination Event</option>
                  <option value="PREGNANCY_CHECK">Pregnancy Ultrasound Check</option>
                  <option value="CALVING_EVENT">Calving & Neonatal Record</option>
                  <option value="WEANING_RECORD">Weaning Phase Record</option>
                  <option value="YEARLING_RECORD">Yearling Development Record</option>
                  <option value="TASK">Scheduled Maintenance Task</option>
                </select>
              </div>

              {linkedEntityType !== 'NONE' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500">Record Descriptor / Label</label>
                  <input
                    type="text"
                    value={linkedEntityLabel}
                    onChange={(e) => setLinkedEntityLabel(e.target.value)}
                    placeholder="e.g. Post-treatment Recovery Check"
                    className="w-full rounded-xl border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all placeholder:text-stone-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200/80 p-3.5 cursor-pointer hover:bg-stone-50/60 transition-colors bg-white shadow-2xs">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-800"
              />
              <div>
                <p className="font-semibold text-stone-900">Set as Primary Profile Photo</p>
                <p className="text-[10px] text-stone-500">Updates passport and main avatar</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-stone-200/80 p-3.5 cursor-pointer hover:bg-stone-50/60 transition-colors bg-white shadow-2xs">
              <input
                type="checkbox"
                checked={featureMarketplace}
                onChange={(e) => setFeatureMarketplace(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-800"
              />
              <div>
                <p className="font-semibold text-stone-900">Feature in Marketplace Showcase</p>
                <p className="text-[10px] text-stone-500">Enrolls into public genetics catalog</p>
              </div>
            </label>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="conformation, gait, ultrasound, post-op"
              className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <Upload className="h-4 w-4" />
              {isFieldMode ? 'Save to Offline Field Queue' : 'Upload into Canonical Media Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
