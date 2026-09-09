'use client';

import React from 'react';
import { useAnimalsDirectory } from './_hooks/useAnimalsDirectory';
import {
  AnimalsDirectoryHeader,
  AnimalsSavedViewsToolbar,
  AnimalsFilterToolbar,
  AnimalsAnalyticsDrawer,
  AnimalsTable,
  AnimalsGrid,
  AnimalsBulkMoveModal,
} from './_components';

export default function BovineAnimalsListPage() {
  const {
    farms,
    herds,
    breedCompositions,
    searchQuery,
    setSearchQuery,
    activeViewTab,
    handleSavedViewSelect,
    filterSex,
    setFilterSex,
    filterFarm,
    setFilterFarm,
    displayMode,
    setDisplayMode,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    selectedAnimalIds,
    setSelectedAnimalIds,
    toggleSelectAll,
    toggleSelectOne,
    filteredAnimals,
    exportToCSV,
    isBulkMoveOpen,
    setIsBulkMoveOpen,
    bulkDestinationFarm,
    setBulkDestinationFarm,
    bulkDestinationHerd,
    setBulkDestinationHerd,
    bulkMoveReason,
    setBulkMoveReason,
    handleBulkMoveSubmit,
    isAnalyticsOpen,
    setIsAnalyticsOpen,
    handleCreateTasks,
  } = useAnimalsDirectory();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <AnimalsDirectoryHeader
        selectedAnimalIds={selectedAnimalIds}
        isAnalyticsOpen={isAnalyticsOpen}
        setIsAnalyticsOpen={setIsAnalyticsOpen}
        onExportCSV={exportToCSV}
      />

      {/* Saved Views Toolbar */}
      <AnimalsSavedViewsToolbar
        activeViewTab={activeViewTab}
        onSelectView={handleSavedViewSelect}
      />

      {/* Filter and Density Toolbar */}
      <AnimalsFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterFarm={filterFarm}
        setFilterFarm={setFilterFarm}
        filterSex={filterSex}
        setFilterSex={setFilterSex}
        farms={farms}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        selectedAnimalIds={selectedAnimalIds}
        onOpenBulkMove={() => setIsBulkMoveOpen(true)}
        onCreateTasks={handleCreateTasks}
        onDeselectAll={() => setSelectedAnimalIds([])}
      />

      {/* Analytics Drawer (Collapsible) */}
      <AnimalsAnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        filteredAnimals={filteredAnimals}
      />

      {/* Main Animals Display */}
      {displayMode === 'table' ? (
        <AnimalsTable
          filteredAnimals={filteredAnimals}
          farms={farms}
          herds={herds}
          breedCompositions={breedCompositions}
          selectedAnimalIds={selectedAnimalIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field) => {
            setSortField(field);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        />
      ) : (
        <AnimalsGrid
          filteredAnimals={filteredAnimals}
          farms={farms}
          herds={herds}
          breedCompositions={breedCompositions}
          selectedAnimalIds={selectedAnimalIds}
          onToggleSelectOne={toggleSelectOne}
        />
      )}

      {/* Bulk Movement Modal Wizard */}
      <AnimalsBulkMoveModal
        isOpen={isBulkMoveOpen}
        onClose={() => setIsBulkMoveOpen(false)}
        selectedCount={selectedAnimalIds.length}
        bulkDestinationFarm={bulkDestinationFarm}
        setBulkDestinationFarm={setBulkDestinationFarm}
        bulkDestinationHerd={bulkDestinationHerd}
        setBulkDestinationHerd={setBulkDestinationHerd}
        bulkMoveReason={bulkMoveReason}
        setBulkMoveReason={setBulkMoveReason}
        farms={farms}
        herds={herds}
        onSubmit={handleBulkMoveSubmit}
      />
    </div>
  );
}
