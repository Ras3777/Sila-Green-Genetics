'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Layers,
  CalendarCheck2,
  Sparkles,
  CheckSquare,
  Truck,
  Edit,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dna,
  GitBranch,
  Building2,
  FileText,
  History,
  Image as ImageIcon,
  Tag,
  Activity,
  Microscope,
  Calculator,
  HeartPulse,
  Heart,
  TrendingUp,
  Radio,
  Trophy,
  FlaskConical,
} from 'lucide-react';

interface AnimalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ animalId: string }>;
}

export default function BovineAnimal360Layout({ children, params }: AnimalLayoutProps) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;
  const pathname = usePathname();

  const {
    animals,
    farms,
    herds,
    breedCompositions,
    dailyLogs,
    moveAnimals,
    addAnimalTask,
    addObservation,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);

  // Quick Action Modals
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [targetFarmId, setTargetFarmId] = useState(farms[0]?.id || '');
  const [targetHerdId, setTargetHerdId] = useState('');
  const [moveReason, setMoveReason] = useState('MANAGEMENT_ROTATION');

  if (!animal) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Livestock Record Not Found</h1>
        <p className="text-xs text-stone-500">No active animal matches ID &ldquo;{animalId}&rdquo;.</p>
        <Link
          href="/bovine/animals"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
        >
          Return to Animal Registry
        </Link>
      </div>
    );
  }

  const farm = farms.find((f) => f.id === animal.farmId);
  const herd = herds.find((h) => h.id === animal.herdId);
  const bcs = breedCompositions.filter((bc) => bc.animalId === animal.id);
  const breedSummary = bcs.map((b) => `${b.percentage}% ${b.breedName}`).join(', ');

  const calculateAge = (birthDateStr: string) => {
    const birth = new Date(birthDateStr);
    const now = new Date('2026-09-04');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 12) return `${diffMonths} mo`;
    const years = Math.floor(diffMonths / 12);
    const remainingMo = diffMonths % 12;
    return remainingMo > 0 ? `${years}y ${remainingMo}m` : `${years} yrs`;
  };

  const tabs = [
    { href: `/bovine/animals/${animal.id}`, label: 'Overview', icon: Layers, exact: true },
    { href: `/bovine/animals/${animal.id}/identity`, label: 'Identity & IDs', icon: Tag },
    { href: `/bovine/animals/${animal.id}/health`, label: 'Health & Meds', icon: HeartPulse },
    { href: `/bovine/animals/${animal.id}/reproduction`, label: 'Reproduction', icon: Heart },
    { href: `/bovine/animals/${animal.id}/production`, label: 'Production', icon: TrendingUp },
    { href: `/bovine/animals/${animal.id}/sensors`, label: 'Sensors & Bio', icon: Radio },
    { href: `/bovine/animals/${animal.id}/pedigree`, label: 'Pedigree', icon: GitBranch },
    { href: `/bovine/animals/${animal.id}/phenotypes`, label: 'Phenotypes', icon: Activity },
    { href: `/bovine/animals/${animal.id}/performance`, label: 'Performance', icon: Trophy },
    { href: `/bovine/animals/${animal.id}/samples`, label: 'Samples & Labs', icon: FlaskConical },
    { href: `/bovine/animals/${animal.id}/genomics`, label: 'Genomics & QC', icon: Microscope },
    { href: `/bovine/animals/${animal.id}/evaluations`, label: 'EBVs & EPDs', icon: Calculator },
    { href: `/bovine/animals/${animal.id}/breed-composition`, label: 'Breed Mix', icon: Dna },
    { href: `/bovine/animals/${animal.id}/ownership`, label: 'Placement', icon: Building2 },
    { href: `/bovine/animals/${animal.id}/movements`, label: 'Movements', icon: Truck },
    { href: `/bovine/animals/${animal.id}/media`, label: 'Media & Docs', icon: ImageIcon },
    { href: `/bovine/animals/${animal.id}/daily-log`, label: 'Daily Vitals', icon: CalendarCheck2 },
    { href: `/bovine/animals/${animal.id}/observations`, label: 'Observations', icon: Sparkles },
    { href: `/bovine/animals/${animal.id}/timeline`, label: 'Timeline', icon: History },
    { href: `/bovine/animals/${animal.id}/tasks`, label: 'Tasks', icon: CheckSquare },
  ];

  const handleExecuteMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFarmId) return;

    moveAnimals({
      animalIds: [animal.id],
      destinationFarmId: targetFarmId,
      destinationHerdId: targetHerdId || undefined,
      movementDate: '2026-09-04',
      reason: moveReason,
    });

    setIsMoveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions & Context */}
      <div className="bg-white border-b border-stone-200/90 px-4 sm:px-6 lg:px-8 py-5 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <Link href="/bovine/animals" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Animal Registry</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-stone-700">{animal.internalId}</span>
            <span>/</span>
            <span className="font-semibold text-stone-900">{animal.name}</span>
          </div>

          {/* Animal Profile Header Details */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              {animal.photoUrl ? (
                <img
                  src={animal.photoUrl}
                  alt={animal.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold">
                  <Layers className="w-8 h-8" />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    {animal.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                    {animal.primaryIdentifier || animal.internalId}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                    {animal.useStatus.replace(/_/g, ' ')}
                  </span>
                  {animal.requiresReview && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Review Alert
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-500">
                  <span>{animal.sex}</span>
                  <span>•</span>
                  <span>Age: {calculateAge(animal.birthDate)}</span>
                  <span>•</span>
                  <span>DOB: {animal.birthDate}</span>
                  <span>•</span>
                  <span className="text-stone-800 font-medium">{breedSummary || 'Unspecified Breed'}</span>
                  <span>•</span>
                  <span>{farm?.name || 'Unassigned Farm'} ({herd?.name || 'Herd'})</span>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
              <Link
                id="btn-360-log-vitals"
                href={`/bovine/animals/${animal.id}/daily-log`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>Log Vitals</span>
              </Link>

              <Link
                id="btn-360-add-obs"
                href={`/bovine/animals/${animal.id}/observations`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                <span>Observation</span>
              </Link>

              <Link
                id="btn-360-add-task"
                href={`/bovine/animals/${animal.id}/tasks`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-800" />
                <span>Task</span>
              </Link>

              <button
                id="btn-360-move"
                onClick={() => setIsMoveModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                <span>Transfer</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pt-2 border-t border-stone-100">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Subpage Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </div>

      {/* Quick Move Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleExecuteMove}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">Transfer Animal Placement</h2>
              <button
                type="button"
                onClick={() => setIsMoveModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Farm</label>
              <select
                value={targetFarmId}
                onChange={(e) => setTargetFarmId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Herd</label>
              <select
                value={targetHerdId}
                onChange={(e) => setTargetHerdId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="">Default / Main Herd</option>
                {herds
                  .filter((h) => h.farmId === targetFarmId)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.purpose})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Movement Reason</label>
              <select
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="MANAGEMENT_ROTATION">Management Rotation</option>
                <option value="OPU_ET_COLLECTION">OPU / Embryo Transfer Collection</option>
                <option value="CALVING_RELOCATION">Calving Barn Relocation</option>
                <option value="QUARANTINE">Quarantine & Isolation</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMoveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
              >
                Confirm Move
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
