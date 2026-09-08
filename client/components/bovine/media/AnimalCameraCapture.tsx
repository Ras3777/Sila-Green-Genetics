'use client';

import React, { useState } from 'react';
import { AnimalMedia, MediaCategory } from '@/lib/bovine-types';
import {
  Camera,
  X,
  CheckCircle2,
  Circle,
  Video,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Eye,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface AngleSpec {
  id: string;
  label: string;
  instruction: string;
  category: MediaCategory;
  defaultTitle: string;
  sampleUrl: string;
}

const CAPTURE_MODES: {
  [key: string]: { name: string; description: string; angles: AngleSpec[] };
} = {
  IDENTIFICATION: {
    name: 'Identification & Biometric Registry',
    description: 'Capture the standard 5-point biometric angles required for official herd book and passport certification.',
    angles: [
      {
        id: 'front',
        label: 'Frontal Head & Muzzle',
        instruction: 'Stand 2m directly in front. Ensure eyes, muzzle markings, and poll structure are clearly visible.',
        category: 'IDENTIFICATION',
        defaultTitle: 'Frontal Head & Muzzle Biometric Profile',
        sampleUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'left_flank',
        label: 'Left Flank Profile',
        instruction: 'Full lateral view perpendicular to the cow. Include all 4 feet on level ground.',
        category: 'CONFORMATION',
        defaultTitle: 'Left Flank Conformation Profile',
        sampleUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'right_flank',
        label: 'Right Flank Profile',
        instruction: 'Full lateral view from the right side. Check flank coat markings and barrel depth.',
        category: 'CONFORMATION',
        defaultTitle: 'Right Flank Conformation Profile',
        sampleUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'rear',
        label: 'Rear & Udder / Scrotal Profile',
        instruction: 'Direct rear view. Capture pin bones, rear udder height/cleft, or testicular symmetry.',
        category: 'CONFORMATION',
        defaultTitle: 'Rear View & Udder/Pelvic Conformation',
        sampleUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'ear_tag',
        label: 'Official Ear Tag Macro',
        instruction: 'Close-up macro of RFID or national visual ear tag. Numbers must be sharp and legible.',
        category: 'IDENTIFICATION',
        defaultTitle: 'Primary Official Ear Tag Macro Identification',
        sampleUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&auto=format&fit=crop&q=80',
      },
    ],
  },
  LAMENESS_GAIT: {
    name: 'Locomotion & Hoof Tracking Suite',
    description: 'Capture walking gait kinematics and claw condition for veterinary locomotion scoring.',
    angles: [
      {
        id: 'walking_video',
        label: 'Walking Gait Video (Lateral)',
        instruction: 'Record cow walking 10-15m on flat concrete. Observe spine arch and stride length.',
        category: 'WALKING_VIDEO',
        defaultTitle: 'Walking Gait Kinematics & Locomotion Recording',
        sampleUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      {
        id: 'left_hind',
        label: 'Left Hind Claw Angle',
        instruction: 'Clear shot of the lateral and medial claws, heel bulb, and pastern slope.',
        category: 'HEALTH_CLINICAL',
        defaultTitle: 'Left Hind Claw Digital Examination Photo',
        sampleUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'right_hind',
        label: 'Right Hind Claw Angle',
        instruction: 'Inspect interdigital space and outer claw wear balance.',
        category: 'HEALTH_CLINICAL',
        defaultTitle: 'Right Hind Claw Digital Examination Photo',
        sampleUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1200&auto=format&fit=crop&q=80',
      },
    ],
  },
};

interface AnimalCameraCaptureProps {
  animalId: string;
  isOpen: boolean;
  onClose: () => void;
  onCapture: (media: Omit<AnimalMedia, 'id'>) => void;
  initialMode?: 'IDENTIFICATION' | 'LAMENESS_GAIT';
  currentUser?: { name: string; role: string };
}

export default function AnimalCameraCapture({
  animalId,
  isOpen,
  onClose,
  onCapture,
  initialMode = 'IDENTIFICATION',
  currentUser = { name: 'Dr. John Miller', role: 'Farm Manager' },
}: AnimalCameraCaptureProps) {
  const [selectedModeKey, setSelectedModeKey] = useState<string>(initialMode);
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [completedAngleIds, setCompletedAngleIds] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCapturedPreview, setLastCapturedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMode = CAPTURE_MODES[selectedModeKey] || CAPTURE_MODES.IDENTIFICATION;
  const currentAngle = currentMode.angles[currentAngleIndex] || currentMode.angles[0];
  const progressPct = Math.round((completedAngleIds.length / currentMode.angles.length) * 100);

  const handleTriggerCapture = () => {
    setIsCapturing(true);

    setTimeout(() => {
      setIsCapturing(false);
      setLastCapturedPreview(currentAngle.sampleUrl);

      const isVid = currentAngle.category === 'WALKING_VIDEO';

      const newMedia: Omit<AnimalMedia, 'id'> = {
        animalId,
        title: currentAngle.defaultTitle,
        caption: `Guided capture protocol: ${currentAngle.label}. Captured via SGIP Field Cam Assist.`,
        category: currentAngle.category,
        stage: 'MATURE',
        mediaType: isVid ? 'VIDEO' : 'PHOTO',
        url: currentAngle.sampleUrl,
        thumbnailUrl: currentAngle.sampleUrl,
        capturedAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        capturedBy: currentUser.name,
        uploadedBy: currentUser.name,
        cameraModel: 'SGIP Guided Field Cam (Optical Zoom & AI Alignment)',
        isIdentityPhoto: currentAngle.id === 'front' || currentAngle.id === 'left_flank',
        isProfile: currentAngle.id === 'front' || currentAngle.id === 'left_flank',
        visibility: 'INTERNAL',
        verificationStatus: 'VERIFIED',
        verifiedBy: currentUser.name,
        verifiedAt: new Date().toISOString(),
        verificationNote: `Guided capture angle "${currentAngle.label}" passed automated silhouette alignment.`,
        fileSize: isVid ? '14.2 MB' : '3.6 MB',
        checksum: `sha256-guid-${Math.random().toString(36).substring(2, 10)}`,
        videoDurationSeconds: isVid ? 28 : undefined,
        tags: ['guided-capture', currentAngle.id, selectedModeKey.toLowerCase()],
      };

      onCapture(newMedia);

      if (!completedAngleIds.includes(currentAngle.id)) {
        setCompletedAngleIds([...completedAngleIds, currentAngle.id]);
      }

      // Automatically advance to next incomplete angle if available
      if (currentAngleIndex < currentMode.angles.length - 1) {
        setCurrentAngleIndex(currentAngleIndex + 1);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[92vh] w-full max-w-4xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Guided Field Camera Capture</h3>
              <p className="text-xs text-stone-500">
                Assisted alignment checklists for Animal #{animalId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedModeKey}
              onChange={(e) => {
                setSelectedModeKey(e.target.value);
                setCurrentAngleIndex(0);
                setCompletedAngleIds([]);
                setLastCapturedPreview(null);
              }}
              className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-emerald-800 outline-none shadow-2xs"
            >
              <option value="IDENTIFICATION">Identification Protocol (5 angles)</option>
              <option value="LAMENESS_GAIT">Locomotion & Gait Protocol (3 angles)</option>
            </select>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport and Guided Silhouette Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Simulated Camera Feed */}
          <div className="relative h-full w-full flex items-center justify-center">
            <img
              src={lastCapturedPreview || currentAngle.sampleUrl}
              alt={currentAngle.label}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                isCapturing ? 'opacity-20 scale-95' : 'opacity-80'
              }`}
            />

            {/* Silhouette Frame Guide Overlay */}
            <div className="absolute inset-8 pointer-events-none flex flex-col items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />

              {/* Crosshair Center */}
              <div className="h-8 w-8 rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              {/* Guide Prompt Overlay */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-xs border border-white/20 shadow-lg flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Align cow outline with frame: <strong>{currentAngle.label}</strong></span>
              </div>
            </div>

            {/* Shutter flash animation */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-out fade-out duration-300" />
            )}
          </div>

          {/* Shutter Button & Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
            <button
              type="button"
              onClick={handleTriggerCapture}
              disabled={isCapturing}
              className="group flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              title="Snap angle"
            >
              <div className="h-12 w-12 rounded-full bg-white group-hover:scale-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Angle Checklist Steps */}
        <div className="border-t border-stone-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">Protocol Progress</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {completedAngleIds.length} of {currentMode.angles.length} Captured ({progressPct}%)
              </span>
            </div>

            <span className="text-[11px] text-stone-500 font-medium">{currentAngle.instruction}</span>
          </div>

          {/* Angles step list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {currentMode.angles.map((angle, idx) => {
              const isDone = completedAngleIds.includes(angle.id);
              const isActive = idx === currentAngleIndex;

              return (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setCurrentAngleIndex(idx)}
                  className={`flex flex-col items-start rounded-2xl border p-2.5 text-left transition-all ${
                    isActive
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/30'
                      : 'border-stone-200/80 bg-stone-50/70 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-stone-400">Angle #{idx + 1}</span>
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-stone-300" />
                    )}
                  </div>
                  <span className="mt-1 text-xs font-semibold text-stone-900 truncate w-full">
                    {angle.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
