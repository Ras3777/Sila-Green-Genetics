'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  CalendarCheck2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckSquare,
  Thermometer,
  Clock,
  Layers,
  Save,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { DailyLog, OperationalStatus, AnimalTask } from '@/lib/bovine-types';

export default function BovineDailyOperationsPage() {
  const {
    session,
    farms,
    herds,
    animals,
    dailyLogs,
    addDailyLog,
    addAnimalTask,
    addObservation,
  } = useBovine();

  const [selectedDate, setSelectedDate] = useState('2026-09-04');
  const [selectedFarm, setSelectedFarm] = useState<string>(session.activeFarmId === 'ALL' ? farms[0]?.id || '' : session.activeFarmId);
  const [selectedHerd, setSelectedHerd] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NOT_LOGGED' | 'NORMAL' | 'ABNORMAL' | 'REQUIRES_REVIEW'>('ALL');
  const [supervisorMode, setSupervisorMode] = useState(false);

  // Form row state mapping animalId -> partial DailyLog
  const [rowInputs, setRowInputs] = useState<Record<string, Partial<DailyLog>>>({});
  const [expandedAnimalId, setExpandedAnimalId] = useState<string | null>(null);

  // Success toast indicator
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Filter animals scoped to farm & herd
  const scopedAnimals = animals.filter((a) => {
    if (selectedFarm !== 'ALL' && a.farmId !== selectedFarm) return false;
    if (selectedHerd !== 'ALL' && a.herdId !== selectedHerd) return false;
    return true;
  });

  // Calculate completion
  const todaysLogs = dailyLogs.filter((l) => l.date === selectedDate);
  const loggedAnimalIds = new Set(todaysLogs.map((l) => l.animalId));

  const loggedCount = scopedAnimals.filter((a) => loggedAnimalIds.has(a.id)).length;
  const missingCount = scopedAnimals.length - loggedCount;
  const abnormalCount = scopedAnimals.filter((a) => {
    const log = todaysLogs.find((l) => l.animalId === a.id);
    return log?.isAbnormal;
  }).length;

  // Initialize or get current input for an animal
  const getRowState = (animalId: string) => {
    const existingLog = todaysLogs.find((l) => l.animalId === animalId);
    if (rowInputs[animalId]) return rowInputs[animalId];
    if (existingLog) return existingLog;

    return {
      operationalStatus: 'HEALTHY' as OperationalStatus,
      temperatureC: 38.6,
      appetite: 'NORMAL' as const,
      activity: 'NORMAL' as const,
      hydration: 'NORMAL' as const,
      manureScore: 3,
      lamenessScore: 1,
      notes: '',
      ruminationMinutes: 440,
      bcs: 3.25,
      weightKg: 620,
    };
  };

  const handleRowChange = (animalId: string, field: string, value: any) => {
    setRowInputs((prev) => ({
      ...prev,
      [animalId]: {
        ...getRowState(animalId),
        [field]: value,
      },
    }));
  };

  // Quick normal action with validation
  const handleQuickNormal = (animal: any) => {
    const defaultNormal: Omit<DailyLog, 'id' | 'createdAt'> = {
      animalId: animal.id,
      date: selectedDate,
      operationalStatus: 'HEALTHY',
      temperatureC: 38.5,
      appetite: 'NORMAL',
      activity: 'NORMAL',
      hydration: 'NORMAL',
      manureScore: 3,
      lamenessScore: 1,
      bcs: 3.25,
      ruminationMinutes: 450,
      notes: 'Routine morning health check. Animal alert and healthy.',
      isAbnormal: false,
      loggedBy: session.name,
      requiresSupervisorReview: false,
    };

    addDailyLog(defaultNormal);
    setSavedMessage(`Recorded normal vitals for ${animal.name}`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  // Save row with clinical thresholds evaluation
  const handleSaveRow = (animal: any) => {
    const state = getRowState(animal.id);

    const isTempElevated = (state.temperatureC || 0) > 39.3;
    const isRuminationLow = (state.ruminationMinutes || 500) < 350;
    const isLame = (state.lamenessScore || 1) >= 3;
    const isOffFeed = state.appetite === 'OFF_FEED';
    const isAbnormal = isTempElevated || isRuminationLow || isLame || isOffFeed || state.operationalStatus === 'SICK' || state.operationalStatus === 'QUARANTINE';

    const logToSave: Omit<DailyLog, 'id' | 'createdAt'> = {
      animalId: animal.id,
      date: selectedDate,
      operationalStatus: state.operationalStatus || 'HEALTHY',
      temperatureC: Number(state.temperatureC) || 38.5,
      heartRateBpm: state.heartRateBpm ? Number(state.heartRateBpm) : undefined,
      respirationRateBpm: state.respirationRateBpm ? Number(state.respirationRateBpm) : undefined,
      appetite: state.appetite || 'NORMAL',
      activity: state.activity || 'NORMAL',
      hydration: state.hydration || 'NORMAL',
      manureScore: Number(state.manureScore) || 3,
      lamenessScore: Number(state.lamenessScore) || 1,
      bcs: Number(state.bcs) || 3.0,
      weightKg: state.weightKg ? Number(state.weightKg) : undefined,
      ruminationMinutes: state.ruminationMinutes ? Number(state.ruminationMinutes) : undefined,
      notes: state.notes || '',
      isAbnormal,
      loggedBy: session.name,
      requiresSupervisorReview: isAbnormal,
    };

    addDailyLog(logToSave);

    // If abnormal, automatically offer task creation or log observation
    if (isAbnormal) {
      addObservation({
        animalId: animal.id,
        observerName: session.name,
        observationDate: selectedDate,
        category: 'HEALTH',
        severity: isTempElevated ? 'HIGH' : 'MEDIUM',
        notes: `Abnormal vitals logged on ${selectedDate}: Temp ${state.temperatureC}°C, Lameness ${state.lamenessScore}, Status: ${state.operationalStatus}. ${state.notes || ''}`,
        isFlaggedForReview: true,
      });

      addAnimalTask({
        animalId: animal.id,
        animalName: animal.name,
        animalIdentifier: animal.primaryIdentifier || animal.internalId,
        title: `Veterinary Follow-up: ${animal.name}`,
        description: `Automated task: review abnormal vitals (Temp ${state.temperatureC}°C, ${state.operationalStatus})`,
        taskType: 'REVIEW',
        priority: isTempElevated ? 'URGENT' : 'HIGH',
        status: 'OPEN',
        dueDate: selectedDate,
        assigneeName: session.name,
        farmId: animal.farmId,
        herdId: animal.herdId,
      });

      setSavedMessage(`Saved & generated veterinary review alert for ${animal.name}`);
    } else {
      setSavedMessage(`Saved daily log for ${animal.name}`);
    }

    setTimeout(() => setSavedMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Herd Health Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Operations Workbench
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Rapid mass vital-entry, rumination telemetry, and clinical abnormality flags
          </p>
        </div>

        {/* Date & Supervisor Mode */}
        <div className="flex items-center space-x-2">
          <input
            id="input-daily-ops-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs"
          />

          <button
            id="btn-toggle-supervisor-mode"
            onClick={() => setSupervisorMode(!supervisorMode)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
              supervisorMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {supervisorMode ? 'Supervisor Review Active' : 'Supervisor Mode'}
          </button>
        </div>
      </div>

      {/* Scope Selectors & Completion Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
        <div>
          <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Farm Station</label>
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
          >
            <option value="ALL">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Herd Group</label>
          <select
            value={selectedHerd}
            onChange={(e) => setSelectedHerd(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
          >
            <option value="ALL">All Herds</option>
            {herds
              .filter((h) => selectedFarm === 'ALL' || h.farmId === selectedFarm)
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.purpose})
                </option>
              ))}
          </select>
        </div>

        {/* Completion Meter */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-1.5 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-stone-200 pt-3 lg:pt-0">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>Daily Progress Meter</span>
            <span>
              {loggedCount} of {scopedAnimals.length} Head Logged ({Math.round((loggedCount / (scopedAnimals.length || 1)) * 100)}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
            <div
              className="bg-emerald-700 h-full transition-all"
              style={{ width: `${(loggedCount / (scopedAnimals.length || 1)) * 100}%` }}
            />
            {abnormalCount > 0 && (
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${(abnormalCount / (scopedAnimals.length || 1)) * 100}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>{missingCount} checks pending</span>
            <span className="text-amber-800 font-semibold">{abnormalCount} flagged abnormal</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Animal Worklist Table */}
      <div className="space-y-4">
        {scopedAnimals
          .filter((animal) => {
            const existingLog = todaysLogs.find((l) => l.animalId === animal.id);
            if (supervisorMode) return existingLog?.isAbnormal || animal.requiresReview;
            if (statusFilter === 'NOT_LOGGED') return !existingLog;
            if (statusFilter === 'NORMAL') return existingLog && !existingLog.isAbnormal;
            if (statusFilter === 'ABNORMAL') return existingLog && existingLog.isAbnormal;
            if (statusFilter === 'REQUIRES_REVIEW') return animal.requiresReview;
            return true;
          })
          .map((animal) => {
            const existingLog = todaysLogs.find((l) => l.animalId === animal.id);
            const rowState = getRowState(animal.id);
            const isExpanded = expandedAnimalId === animal.id;
            const isAbnormal = rowState.operationalStatus === 'SICK' ||
              (rowState.temperatureC && rowState.temperatureC > 39.3) ||
              (rowState.lamenessScore && rowState.lamenessScore >= 3);

            return (
              <div
                key={animal.id}
                className={`rounded-3xl bg-white border transition-all ${
                  existingLog?.isAbnormal || isAbnormal
                    ? 'border-amber-300 shadow-xs'
                    : existingLog
                    ? 'border-stone-200/90'
                    : 'border-stone-200/80 shadow-2xs'
                }`}
              >
                {/* Compact Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Animal Info */}
                  <div className="flex items-center space-x-3 min-w-[200px]">
                    <div className={`w-3 h-3 rounded-full ${existingLog ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    <div>
                      <div className="font-bold text-stone-900 text-sm flex items-center space-x-1.5">
                        <Link href={`/bovine/animals/${animal.id}`} className="hover:text-emerald-800 hover:underline">
                          {animal.name}
                        </Link>
                        {animal.requiresReview && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Review
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        {animal.primaryIdentifier || animal.internalId} • {animal.useStatus}
                      </div>
                    </div>
                  </div>

                  {/* Fast Field Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 flex-1 text-xs">
                    {/* Status */}
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Status</label>
                      <select
                        value={rowState.operationalStatus || 'HEALTHY'}
                        onChange={(e) => handleRowChange(animal.id, 'operationalStatus', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs font-semibold text-stone-800"
                      >
                        <option value="HEALTHY">Healthy</option>
                        <option value="IN_HEAT">In Heat</option>
                        <option value="SICK">Sick</option>
                        <option value="INJURED">Injured</option>
                        <option value="IN_TREATMENT">In Treatment</option>
                        <option value="QUARANTINE">Quarantine</option>
                        <option value="OFF_FEED">Off Feed</option>
                      </select>
                    </div>

                    {/* Temp (°C) */}
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Temp (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={rowState.temperatureC || 38.5}
                        onChange={(e) => handleRowChange(animal.id, 'temperatureC', parseFloat(e.target.value))}
                        className={`w-full bg-stone-50 border rounded-xl px-2 py-1 text-xs font-mono font-bold ${
                          (rowState.temperatureC || 0) > 39.3 ? 'border-amber-400 text-amber-800 bg-amber-50' : 'border-stone-200 text-stone-800'
                        }`}
                      />
                    </div>

                    {/* Appetite */}
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Appetite</label>
                      <select
                        value={rowState.appetite || 'NORMAL'}
                        onChange={(e) => handleRowChange(animal.id, 'appetite', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs text-stone-800"
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="REDUCED">Reduced</option>
                        <option value="OFF_FEED">Off-Feed</option>
                      </select>
                    </div>

                    {/* Lameness (1-5) */}
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Lameness (1-5)</label>
                      <select
                        value={rowState.lamenessScore || 1}
                        onChange={(e) => handleRowChange(animal.id, 'lamenessScore', parseInt(e.target.value))}
                        className={`w-full bg-stone-50 border rounded-xl px-2 py-1 text-xs ${
                          (rowState.lamenessScore || 1) >= 3 ? 'border-amber-400 text-amber-800 bg-amber-50 font-bold' : 'border-stone-200 text-stone-800'
                        }`}
                      >
                        <option value={1}>1 - Normal Gait</option>
                        <option value={2}>2 - Mildly Lame</option>
                        <option value={3}>3 - Moderately Lame</option>
                        <option value={4}>4 - Lame</option>
                        <option value={5}>5 - Severely Lame</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                      <label className="block text-[10px] uppercase font-semibold text-stone-400 mb-0.5">Clinical Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Mild cough, clear eyes"
                        value={rowState.notes || ''}
                        onChange={(e) => handleRowChange(animal.id, 'notes', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs text-stone-800"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 justify-end">
                    {!existingLog && (
                      <button
                        onClick={() => handleQuickNormal(animal)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
                        title="Mark healthy and normal with standard vitals"
                      >
                        Normal
                      </button>
                    )}

                    <button
                      onClick={() => handleSaveRow(animal)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setExpandedAnimalId(isExpanded ? null : animal.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                      title={isExpanded ? 'Collapse vitals' : 'Expand detailed vitals'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Vitals Drawer */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-100 rounded-b-3xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Rumination (min/day)</label>
                      <input
                        type="number"
                        value={rowState.ruminationMinutes || 450}
                        onChange={(e) => handleRowChange(animal.id, 'ruminationMinutes', parseInt(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Body Condition (BCS)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={rowState.bcs || 3.25}
                        onChange={(e) => handleRowChange(animal.id, 'bcs', parseFloat(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Weight (kg)</label>
                      <input
                        type="number"
                        value={rowState.weightKg || 620}
                        onChange={(e) => handleRowChange(animal.id, 'weightKg', parseFloat(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={rowState.heartRateBpm || 68}
                        onChange={(e) => handleRowChange(animal.id, 'heartRateBpm', parseInt(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Respiration (breaths/m)</label>
                      <input
                        type="number"
                        value={rowState.respirationRateBpm || 26}
                        onChange={(e) => handleRowChange(animal.id, 'respirationRateBpm', parseInt(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Manure Score (1-5)</label>
                      <select
                        value={rowState.manureScore || 3}
                        onChange={(e) => handleRowChange(animal.id, 'manureScore', parseInt(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs"
                      >
                        <option value={1}>1 - Liquid</option>
                        <option value={2}>2 - Loose</option>
                        <option value={3}>3 - Ideal / Porridge</option>
                        <option value={4}>4 - Thick</option>
                        <option value={5}>5 - Dry balls</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
