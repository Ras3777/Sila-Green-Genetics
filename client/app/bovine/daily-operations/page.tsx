'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDailyOperations } from './_hooks/useDailyOperations';
import {
  DailyOperationsHeader,
  DailyOperationsScopeMeter,
  DailyOperationsWorklist,
} from './_components';

export default function BovineDailyOperationsPage() {
  const {
    farms,
    herds,
    selectedDate,
    setSelectedDate,
    selectedFarm,
    setSelectedFarm,
    selectedHerd,
    setSelectedHerd,
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
  } = useDailyOperations();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <DailyOperationsHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        supervisorMode={supervisorMode}
        onToggleSupervisorMode={() => setSupervisorMode(!supervisorMode)}
      />

      {/* Scope Selectors & Completion Meter */}
      <DailyOperationsScopeMeter
        farms={farms}
        selectedFarm={selectedFarm}
        onSelectFarm={setSelectedFarm}
        herds={herds}
        selectedHerd={selectedHerd}
        onSelectHerd={setSelectedHerd}
        loggedCount={loggedCount}
        scopedAnimalsCount={scopedAnimals.length}
        missingCount={missingCount}
        abnormalCount={abnormalCount}
      />

      {/* Success Banner */}
      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Animal Worklist Table */}
      <DailyOperationsWorklist
        animals={filteredScopedAnimals}
        todaysLogs={todaysLogs}
        getRowState={getRowState}
        expandedAnimalId={expandedAnimalId}
        onToggleExpand={(id) => setExpandedAnimalId(expandedAnimalId === id ? null : id)}
        onRowChange={handleRowChange}
        onQuickNormal={handleQuickNormal}
        onSaveRow={handleSaveRow}
      />
    </div>
  );
}
