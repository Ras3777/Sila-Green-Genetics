'use client';

import { useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { BiologicalSampleType, SampleStatus } from '@/lib/bovine-types';

export function useBiologicalSamples() {
  const { animals } = useBovine();
  const {
    geneticSamples,
    laboratories,
    addGeneticSample,
    updateGeneticSampleStatus,
    addSampleCustodyEvent,
  } = useGenetics();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(geneticSamples[0]?.id || '');

  // Modals
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [custodyModalOpen, setCustodyModalOpen] = useState(false);

  // New sample form
  const [newAnimalId, setNewAnimalId] = useState(animals[0]?.id || '');
  const [newType, setNewType] = useState<BiologicalSampleType>('TISSUE_TSU');
  const [newLabId, setNewLabId] = useState(laboratories[0]?.id || '');
  const [newBarcode, setNewBarcode] = useState('');
  const [newStorageLocation, setNewStorageLocation] = useState('Cryo-Box A12');
  const [newStorageTemp, setNewStorageTemp] = useState('+4°C');
  const [newCollectedBy, setNewCollectedBy] = useState('Dr. John Miller');

  // New custody event form
  const [custodyAction, setCustodyAction] = useState('');
  const [custodyLocation, setCustodyLocation] = useState('Logistics Dock');
  const [custodyHandler, setCustodyHandler] = useState('Lab Courier Lead');
  const [custodyStatusNext, setCustodyStatusNext] = useState<SampleStatus>('SHIPPED');

  const selectedSample = geneticSamples.find((s) => s.id === selectedSampleId) || geneticSamples[0];

  const filteredSamples = geneticSamples.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && s.sampleType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.sampleCode.toLowerCase().includes(q) ||
        s.animalName.toLowerCase().includes(q) ||
        s.barcode?.toLowerCase().includes(q) ||
        s.animalIdentifier?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegisterSample = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === newAnimalId);
    const lab = laboratories.find((l) => l.id === newLabId);
    if (!animal) return;

    const sampleCode = `SMP-${Date.now().toString().slice(-6)}`;
    const barcodeVal = newBarcode || `TSU-${Date.now().toString().slice(-8)}`;

    addGeneticSample({
      sampleCode,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      sampleType: newType,
      collectedDate: new Date().toISOString().split('T')[0],
      collectedBy: newCollectedBy,
      destinationLabId: newLabId,
      destinationLabName: lab?.name,
      status: 'COLLECTED',
      storageLocation: newStorageLocation,
      storageTemp: newStorageTemp,
      barcode: barcodeVal,
      chainOfCustody: [
        {
          timestamp: new Date().toLocaleString(),
          location: 'Farm Hospital Unit',
          handledBy: newCollectedBy,
          action: 'Biological tissue collected and sealed in preservative vial',
        },
      ],
    });

    setRegisterModalOpen(false);
    setNewBarcode('');
  };

  const handleAddCustodyEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSample || !custodyAction) return;

    addSampleCustodyEvent(selectedSample.id, {
      timestamp: new Date().toLocaleString(),
      location: custodyLocation,
      handledBy: custodyHandler,
      action: custodyAction,
    });

    if (custodyStatusNext) {
      updateGeneticSampleStatus(selectedSample.id, custodyStatusNext);
    }

    setCustodyModalOpen(false);
    setCustodyAction('');
  };

  return {
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
    newCollectedBy,
    setNewCollectedBy,
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
  };
}
