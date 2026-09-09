'use client';

import React from 'react';
import { useBiologicalSamples } from './_hooks/useBiologicalSamples';
import {
  BiologicalSamplesHeader,
  SampleListFilterBar,
  SampleCardList,
  SampleCustodyTimeline,
  RegisterSampleModal,
  AddCustodyEventModal,
} from './_components';

export default function BiologicalSamplesPage() {
  const {
    animals,
    laboratories,
    selectedSample,
    selectedSampleId,
    setSelectedSampleId,
    filteredSamples,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    registerModalOpen,
    setRegisterModalOpen,
    custodyModalOpen,
    setCustodyModalOpen,
    newAnimalId,
    setNewAnimalId,
    newType,
    setNewType,
    newLabId,
    setNewLabId,
    newBarcode,
    setNewBarcode,
    newStorageLocation,
    setNewStorageLocation,
    newStorageTemp,
    setNewStorageTemp,
    custodyAction,
    setCustodyAction,
    custodyLocation,
    setCustodyLocation,
    custodyHandler,
    setCustodyHandler,
    custodyStatusNext,
    setCustodyStatusNext,
    handleRegisterSample,
    handleAddCustodyEvent,
  } = useBiologicalSamples();

  return (
    <div className="space-y-6">
      {/* Header */}
      <BiologicalSamplesHeader
        onRegisterSample={() => setRegisterModalOpen(true)}
      />

      {/* Main Grid: Samples List & Detail Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sample List with Filters */}
        <div className="lg:col-span-6 space-y-4">
          <SampleListFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          <SampleCardList
            samples={filteredSamples}
            selectedSampleId={selectedSampleId}
            onSelectSample={setSelectedSampleId}
          />
        </div>

        {/* Right Col: Chain of Custody Timeline & Sample Metadata */}
        <div className="lg:col-span-6">
          <SampleCustodyTimeline
            selectedSample={selectedSample}
            onAddCustodyEvent={() => setCustodyModalOpen(true)}
          />
        </div>
      </div>

      {/* Register Sample Modal */}
      <RegisterSampleModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegisterSample}
        animals={animals}
        laboratories={laboratories}
        newAnimalId={newAnimalId}
        setNewAnimalId={setNewAnimalId}
        newType={newType}
        setNewType={setNewType}
        newLabId={newLabId}
        setNewLabId={setNewLabId}
        newBarcode={newBarcode}
        setNewBarcode={setNewBarcode}
        newStorageLocation={newStorageLocation}
        setNewStorageLocation={setNewStorageLocation}
        newStorageTemp={newStorageTemp}
        setNewStorageTemp={setNewStorageTemp}
      />

      {/* Add Custody Event Modal */}
      <AddCustodyEventModal
        isOpen={custodyModalOpen}
        onClose={() => setCustodyModalOpen(false)}
        onSubmit={handleAddCustodyEvent}
        custodyAction={custodyAction}
        setCustodyAction={setCustodyAction}
        custodyLocation={custodyLocation}
        setCustodyLocation={setCustodyLocation}
        custodyHandler={custodyHandler}
        setCustodyHandler={setCustodyHandler}
        custodyStatusNext={custodyStatusNext}
        setCustodyStatusNext={setCustodyStatusNext}
      />
    </div>
  );
}
