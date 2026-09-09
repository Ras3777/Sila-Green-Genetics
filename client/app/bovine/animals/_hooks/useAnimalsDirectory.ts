import { useState, useMemo } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { Animal } from '@/lib/bovine-types';

export function useAnimalsDirectory() {
  const {
    animals,
    identifiers,
    breedCompositions,
    farms,
    herds,
    moveAnimals,
    addAnimalTask,
  } = useBovine();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewTab, setActiveViewTab] = useState<string>('ALL');
  const [filterSex, setFilterSex] = useState<string>('ALL');
  const [filterFarm, setFilterFarm] = useState<string>('ALL');
  const [filterHerd, setFilterHerd] = useState<string>('ALL');
  const [filterLifeStatus, setFilterLifeStatus] = useState<string>('ALIVE');
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('table');

  // Sorting
  const [sortField, setSortField] = useState<'name' | 'birthDate' | 'internalId'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection & Bulk Actions
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [isBulkMoveOpen, setIsBulkMoveOpen] = useState(false);
  const [bulkDestinationFarm, setBulkDestinationFarm] = useState(farms[0]?.id || '');
  const [bulkDestinationHerd, setBulkDestinationHerd] = useState('');
  const [bulkMoveReason, setBulkMoveReason] = useState('MANAGEMENT_ROTATION');

  // Analytics Drawer
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Saved Views configuration
  const handleSavedViewSelect = (view: string) => {
    setActiveViewTab(view);
    if (view === 'DONORS') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'RECIPIENTS') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'CULL') {
      setFilterLifeStatus('ALIVE');
    } else if (view === 'REVIEW') {
      setFilterLifeStatus('ALL');
    } else if (view === 'ALL') {
      setFilterLifeStatus('ALL');
      setFilterSex('ALL');
    }
  };

  // Filtered & Sorted Animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Saved View Filter
      if (activeViewTab === 'DONORS' && animal.useStatus !== 'DONOR') return false;
      if (activeViewTab === 'RECIPIENTS' && animal.useStatus !== 'RECIPIENT') return false;
      if (activeViewTab === 'BREEDING_STOCK' && animal.useStatus !== 'BREEDING_STOCK') return false;
      if (activeViewTab === 'CULL' && animal.useStatus !== 'CULL_CANDIDATE') return false;
      if (activeViewTab === 'REVIEW' && !animal.requiresReview) return false;
      if (activeViewTab === 'MISSING_DATA' && animal.primaryIdentifier) return false;

      // Text Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = animal.name.toLowerCase().includes(q);
        const matchesId = animal.internalId.toLowerCase().includes(q);
        const matchesPrimary = animal.primaryIdentifier?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPrimary) return false;
      }

      if (filterSex !== 'ALL' && animal.sex !== filterSex) return false;
      if (filterLifeStatus !== 'ALL' && animal.lifeStatus !== filterLifeStatus) return false;
      if (filterFarm !== 'ALL' && animal.farmId !== filterFarm) return false;
      if (filterHerd !== 'ALL' && animal.herdId !== filterHerd) return false;

      return true;
    }).sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === 'birthDate') {
        return sortOrder === 'asc' ? a.birthDate.localeCompare(b.birthDate) : b.birthDate.localeCompare(a.birthDate);
      }
      return sortOrder === 'asc' ? a.internalId.localeCompare(b.internalId) : b.internalId.localeCompare(a.internalId);
    });
  }, [
    animals,
    searchQuery,
    activeViewTab,
    filterSex,
    filterLifeStatus,
    filterFarm,
    filterHerd,
    sortField,
    sortOrder,
  ]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedAnimalIds.length === filteredAnimals.length) {
      setSelectedAnimalIds([]);
    } else {
      setSelectedAnimalIds(filteredAnimals.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export Generator
  const exportToCSV = () => {
    const headers = ['Internal ID', 'Name', 'Primary Identifier', 'Sex', 'Birth Date', 'Life Status', 'Use Status', 'Farm ID', 'Herd ID'];
    const rows = filteredAnimals.map((a) => [
      a.internalId,
      `"${a.name}"`,
      a.primaryIdentifier || '',
      a.sex,
      a.birthDate,
      a.lifeStatus,
      a.useStatus,
      a.farmId,
      a.herdId,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bovine_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Bulk Movement
  const handleBulkMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0 || !bulkDestinationFarm) return;

    moveAnimals({
      animalIds: selectedAnimalIds,
      destinationFarmId: bulkDestinationFarm,
      destinationHerdId: bulkDestinationHerd || undefined,
      movementDate: '2026-09-04',
      reason: bulkMoveReason,
    });

    setIsBulkMoveOpen(false);
    setSelectedAnimalIds([]);
  };

  const handleCreateTasks = () => {
    selectedAnimalIds.forEach((id) => {
      const anim = animals.find((a) => a.id === id);
      if (anim) {
        addAnimalTask({
          animalId: anim.id,
          animalName: anim.name,
          animalIdentifier: anim.primaryIdentifier || anim.internalId,
          title: `Bulk Check: ${anim.name}`,
          taskType: 'HEALTH_CHECK',
          priority: 'MEDIUM',
          status: 'OPEN',
          dueDate: '2026-09-05',
          assigneeName: 'Unassigned',
          farmId: anim.farmId,
          herdId: anim.herdId,
        });
      }
    });
    setSelectedAnimalIds([]);
  };

  return {
    animals,
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
  };
}
