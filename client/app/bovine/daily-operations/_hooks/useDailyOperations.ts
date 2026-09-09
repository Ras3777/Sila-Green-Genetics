'use client';

import { useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { DailyLog, OperationalStatus, Animal } from '@/lib/bovine-types';

export function useDailyOperations() {
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
  const [selectedFarm, setSelectedFarm] = useState<string>(
    session.activeFarmId === 'ALL' ? farms[0]?.id || '' : session.activeFarmId
  );
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
  const handleQuickNormal = (animal: Animal) => {
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
  const handleSaveRow = (animal: Animal) => {
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

  const filteredScopedAnimals = scopedAnimals.filter((animal) => {
    const existingLog = todaysLogs.find((l) => l.animalId === animal.id);
    if (supervisorMode) return existingLog?.isAbnormal || animal.requiresReview;
    if (statusFilter === 'NOT_LOGGED') return !existingLog;
    if (statusFilter === 'NORMAL') return existingLog && !existingLog.isAbnormal;
    if (statusFilter === 'ABNORMAL') return existingLog && existingLog.isAbnormal;
    if (statusFilter === 'REQUIRES_REVIEW') return animal.requiresReview;
    return true;
  });

  return {
    farms,
    herds,
    selectedDate,
    setSelectedDate,
    selectedFarm,
    setSelectedFarm,
    selectedHerd,
    setSelectedHerd,
    statusFilter,
    setStatusFilter,
    supervisorMode,
    setSupervisorMode,
    expandedAnimalId,
    setExpandedAnimalId,
    savedMessage,
    scopedAnimals,
    filteredScopedAnimals,
    todaysLogs,
    loggedCount,
    missingCount,
    abnormalCount,
    getRowState,
    handleRowChange,
    handleQuickNormal,
    handleSaveRow,
  };
}
