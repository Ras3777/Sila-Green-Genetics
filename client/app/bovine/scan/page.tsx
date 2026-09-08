'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  QrCode,
  Camera,
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  CalendarCheck2,
  Eye,
  Truck,
  CheckSquare,
  Plus,
  Clock,
  Zap,
} from 'lucide-react';

interface ScanHistoryItem {
  id: string;
  rawInput: string;
  timestamp: string;
  matchedAnimalName?: string;
  matchedAnimalId?: string;
  matchType: 'EXACT' | 'NOT_FOUND' | 'AMBIGUOUS';
}

export default function BovineScanPage() {
  const router = useRouter();
  const { animals, identifiers, farms, herds, session } = useBovine();

  // Input states
  const [scanInput, setScanInput] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'rfid' | 'manual'>('rfid');

  // Match states
  const [matchedAnimal, setMatchedAnimal] = useState<any | null>(null);
  const [ambiguousMatches, setAmbiguousMatches] = useState<any[]>([]);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);

  // Session scan history
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([
    {
      id: 'sc-1',
      rawInput: '982000412891402',
      timestamp: '07:15 AM',
      matchedAnimalName: 'Altair Supernova ET',
      matchedAnimalId: 'anim-1',
      matchType: 'EXACT',
    },
    {
      id: 'sc-2',
      rawInput: 'US-6330912',
      timestamp: '06:45 AM',
      matchedAnimalName: 'Cloverdale Bella 14',
      matchedAnimalId: 'anim-4',
      matchType: 'EXACT',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically for handheld RFID/barcode wand readers
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeTab]);

  const handleResolveIdentifier = (queryVal: string) => {
    const clean = queryVal.trim();
    if (!clean) return;

    // Search in identifiers and animal records
    const matchingIds = identifiers.filter(
      (i) => i.value.toLowerCase() === clean.toLowerCase()
    );

    const directAnimalMatch = animals.filter(
      (a) =>
        a.primaryIdentifier?.toLowerCase() === clean.toLowerCase() ||
        a.internalId.toLowerCase() === clean.toLowerCase() ||
        a.registrationNumber?.toLowerCase() === clean.toLowerCase()
    );

    // Combine animal IDs
    const matchedAnimalIds = Array.from(
      new Set([
        ...matchingIds.map((i) => i.animalId),
        ...directAnimalMatch.map((a) => a.id),
      ])
    );

    const candidateAnimals = animals.filter((a) => matchedAnimalIds.includes(a.id));

    if (candidateAnimals.length === 1) {
      setMatchedAnimal(candidateAnimals[0]);
      setAmbiguousMatches([]);
      setNotFoundQuery(null);
      // Add to history
      setScanHistory((prev) => [
        {
          id: `sc-${Date.now()}`,
          rawInput: clean,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedAnimalName: candidateAnimals[0].name,
          matchedAnimalId: candidateAnimals[0].id,
          matchType: 'EXACT',
        },
        ...prev.slice(0, 9),
      ]);
    } else if (candidateAnimals.length > 1) {
      setMatchedAnimal(null);
      setAmbiguousMatches(candidateAnimals);
      setNotFoundQuery(null);
      setScanHistory((prev) => [
        {
          id: `sc-${Date.now()}`,
          rawInput: clean,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchType: 'AMBIGUOUS',
        },
        ...prev.slice(0, 9),
      ]);
    } else {
      setMatchedAnimal(null);
      setAmbiguousMatches([]);
      setNotFoundQuery(clean);
      setScanHistory((prev) => [
        {
          id: `sc-${Date.now()}`,
          rawInput: clean,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchType: 'NOT_FOUND',
        },
        ...prev.slice(0, 9),
      ]);
    }
  };

  // Mock presets to simulate RFID wand / Barcode laser tap in the field
  const simulateScanPreset = (tagValue: string) => {
    setScanInput(tagValue);
    handleResolveIdentifier(tagValue);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>Field Telemetry & Identification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Scanner & Identifier Resolver
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Compatible with Bluetooth RFID stick readers, 2D barcode cameras, and keyboard-wedge wands
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('rfid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'rfid' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            RFID / Wand
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'camera' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Camera Lens
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'manual' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Manual Key-in
          </button>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-5">
        {/* Camera simulation viewport if active */}
        {activeTab === 'camera' && (
          <div className="relative rounded-2xl bg-stone-900 text-white overflow-hidden p-6 aspect-16/9 sm:aspect-21/9 flex flex-col items-center justify-center border border-stone-800 shadow-inner">
            <div className="absolute inset-4 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none animate-pulse" />
            <Camera className="w-10 h-10 text-emerald-400 mb-2" />
            <div className="text-sm font-semibold text-white">Live Camera Optical Barcode Viewfinder</div>
            <div className="text-xs text-stone-400 mt-1 max-w-sm text-center">
              Align Ear Tag 2D Datamatrix or QR Code within the viewfinder. Handheld scanning ready.
            </div>
            <button
              onClick={() => simulateScanPreset('US-9941203')}
              className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all"
            >
              Simulate Optical Tag Capture (US-9941203)
            </button>
          </div>
        )}

        {/* Input Bar (Supports Wand Readers) */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            {activeTab === 'rfid' ? 'Listening for RFID Wand or Keyboard Wedge Scanner...' : 'Scan or Enter Animal Identifier'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="input-scanner-resolve"
                type="text"
                placeholder="Scan ear tag, 15-digit RFID, DGR, or National ID..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleResolveIdentifier(scanInput);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
              <QrCode className="w-5 h-5 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
            <button
              id="btn-resolve-scanner"
              onClick={() => handleResolveIdentifier(scanInput)}
              className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Resolve
            </button>
          </div>
        </div>

        {/* Rapid Simulation Presets for technicians testing */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider flex items-center">
            <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" /> Quick Field Taps:
          </span>
          <button
            onClick={() => simulateScanPreset('US-9941203')}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs transition-colors cursor-pointer"
          >
            US-9941203 (Supernova)
          </button>
          <button
            onClick={() => simulateScanPreset('982000318402911')}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs transition-colors cursor-pointer"
          >
            RFID: 982000318402 (Titan)
          </button>
          <button
            onClick={() => simulateScanPreset('US-6330912')}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs transition-colors cursor-pointer"
          >
            US-6330912 (Bella - Fever)
          </button>
          <button
            onClick={() => simulateScanPreset('UNKNOWN-99901')}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs transition-colors cursor-pointer"
          >
            New Unregistered Tag
          </button>
        </div>
      </div>

      {/* MATCH RESULTS SECTION */}

      {/* Case 1: Exact Match Found */}
      {matchedAnimal && (
        <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Resolved Active Livestock
                </div>
                <h2 className="text-xl font-bold text-stone-900">{matchedAnimal.name}</h2>
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                  Primary ID: {matchedAnimal.primaryIdentifier || matchedAnimal.internalId} • Internal: {matchedAnimal.internalId}
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              {matchedAnimal.useStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white border border-emerald-100 text-xs">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-semibold">Sex</span>
              <div className="font-bold text-stone-900">{matchedAnimal.sex}</div>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-semibold">Location</span>
              <div className="font-bold text-stone-900">
                {farms.find((f) => f.id === matchedAnimal.farmId)?.name || 'Farm'}
              </div>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-semibold">Life Status</span>
              <div className="font-bold text-stone-900 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{matchedAnimal.lifeStatus}</span>
              </div>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-semibold">Review Alert</span>
              <div className="font-bold">
                {matchedAnimal.requiresReview ? (
                  <span className="text-amber-800 font-semibold">Needs Review</span>
                ) : (
                  <span className="text-emerald-700">Healthy</span>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Quick Actions (Mobile field friendly) */}
          <div>
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Field Technician Quick Actions
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link
                id="btn-scan-open-profile"
                href={`/bovine/animals/${matchedAnimal.id}`}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs min-h-[44px]"
              >
                <Eye className="w-4 h-4" />
                <span>Open 360</span>
              </Link>

              <Link
                id="btn-scan-daily-log"
                href={`/bovine/animals/${matchedAnimal.id}/daily-log`}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs min-h-[44px]"
              >
                <CalendarCheck2 className="w-4 h-4 text-emerald-800" />
                <span>Log Today Vitals</span>
              </Link>

              <Link
                id="btn-scan-observation"
                href={`/bovine/animals/${matchedAnimal.id}/observations`}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>Record Obs</span>
              </Link>

              <Link
                id="btn-scan-task"
                href={`/bovine/animals/${matchedAnimal.id}/tasks`}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs min-h-[44px]"
              >
                <CheckSquare className="w-4 h-4 text-emerald-800" />
                <span>Add Task</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Case 2: No Match Found -> Offer Registration */}
      {notFoundQuery && (
        <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Unregistered Identifier: &ldquo;{notFoundQuery}&rdquo;</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                No active livestock record or historical ear tag matches this value in the organization database.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <Link
              id="btn-scan-enroll-new"
              href={`/bovine/animals/new?identifier=${encodeURIComponent(notFoundQuery)}`}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Animal with this Tag</span>
            </Link>
          </div>
        </div>
      )}

      {/* Case 3: Ambiguous / Multiple Match Conflict */}
      {ambiguousMatches.length > 0 && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-200 text-rose-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-900">Identifier Conflict Warning</h2>
              <p className="text-xs text-rose-700 mt-0.5">
                Multiple records ({ambiguousMatches.length}) share this scanned identifier. Destructive field actions are locked until resolved by a registrar.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {ambiguousMatches.map((anim) => (
              <div
                key={anim.id}
                className="p-3 rounded-xl bg-white border border-rose-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900">{anim.name}</span>
                  <span className="text-stone-500 font-mono ml-2">ID: {anim.internalId}</span>
                </div>
                <Link
                  href={`/bovine/animals/${anim.id}`}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scans Session Log */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2 text-stone-700 font-bold text-xs">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Session Scans History</span>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">Auto-logged locally</span>
        </div>

        <div className="divide-y divide-stone-100">
          {scanHistory.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-stone-900 font-semibold">{item.rawInput}</span>
                {item.matchType === 'EXACT' && (
                  <span className="text-emerald-800 font-medium">({item.matchedAnimalName})</span>
                )}
                {item.matchType === 'NOT_FOUND' && (
                  <span className="text-stone-400 italic">(Not found)</span>
                )}
                {item.matchType === 'AMBIGUOUS' && (
                  <span className="text-rose-600 font-bold">(Conflict)</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-stone-400 text-[11px]">
                <span>{item.timestamp}</span>
                {item.matchedAnimalId && (
                  <Link
                    href={`/bovine/animals/${item.matchedAnimalId}`}
                    className="text-emerald-800 hover:underline font-medium"
                  >
                    Open
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
