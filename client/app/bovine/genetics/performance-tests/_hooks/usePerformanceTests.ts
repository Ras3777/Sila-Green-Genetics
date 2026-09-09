'use client';

import { useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';

export function usePerformanceTests() {
  const { animals } = useBovine();
  const {
    performanceTests,
    performanceTestEnrollments,
    addPerformanceTest,
    enrollAnimalInTest,
  } = useGenetics();

  const [selectedTestId, setSelectedTestId] = useState<string>(performanceTests[0]?.id || '');
  const [createTestModalOpen, setCreateTestModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  // Form states for new test
  const [newTestCode, setNewTestCode] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [newTestStation, setNewTestStation] = useState('Midwest Central Bull Test Station');
  const [newTestStartDate, setNewTestStartDate] = useState('2026-03-01');
  const [newTestEndDate, setNewTestEndDate] = useState('2026-06-20');
  const [newTestSupervisor, setNewTestSupervisor] = useState('Dr. Marcus Vance');
  const [newTestProtocol, setNewTestProtocol] = useState('');

  // Form states for enrollment
  const [enrollAnimalId, setEnrollAnimalId] = useState(animals[0]?.id || '');
  const [enrollEntryWeight, setEnrollEntryWeight] = useState('');

  const selectedTest = performanceTests.find((t) => t.id === selectedTestId) || performanceTests[0];

  // Enrollments for selected test
  const testEnrollments = performanceTestEnrollments.filter(
    (e) => e.performanceTestId === selectedTest?.id
  );

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestCode || !newTestName) return;

    addPerformanceTest({
      code: newTestCode.toUpperCase(),
      name: newTestName,
      testStation: newTestStation,
      startDate: newTestStartDate,
      endDate: newTestEndDate,
      durationDays: 112,
      status: 'ACTIVE',
      enrolledCount: 0,
      supervisor: newTestSupervisor,
      protocolDescription: newTestProtocol || 'Standardized 112-day central feed intake & ADG test.',
      traitsEvaluated: ['ADG', 'FCR', 'RFI', 'REA_US', 'IMF_US'],
    });

    setCreateTestModalOpen(false);
    setNewTestCode('');
    setNewTestName('');
    setNewTestProtocol('');
  };

  const handleEnrollAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === enrollAnimalId);
    if (!animal || !selectedTest) return;

    enrollAnimalInTest({
      performanceTestId: selectedTest.id,
      performanceTestCode: selectedTest.code,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      enrollmentDate: new Date().toISOString().split('T')[0],
      entryWeight: parseFloat(enrollEntryWeight) || 320,
      exitWeight: 0,
      averageDailyGain: 0,
      feedConversionRatio: 0,
      residualFeedIntake: 0,
      status: 'ACTIVE',
      measurements: [],
    });

    setEnrollModalOpen(false);
    setEnrollEntryWeight('');
  };

  return {
    animals,
    performanceTests,
    selectedTest,
    selectedTestId,
    setSelectedTestId,
    testEnrollments,
    createTestModalOpen,
    setCreateTestModalOpen,
    enrollModalOpen,
    setEnrollModalOpen,
    newTestCode,
    setNewTestCode,
    newTestName,
    setNewTestName,
    newTestStation,
    setNewTestStation,
    newTestStartDate,
    setNewTestStartDate,
    newTestEndDate,
    setNewTestEndDate,
    newTestSupervisor,
    setNewTestSupervisor,
    newTestProtocol,
    setNewTestProtocol,
    enrollAnimalId,
    setEnrollAnimalId,
    enrollEntryWeight,
    setEnrollEntryWeight,
    handleCreateTest,
    handleEnrollAnimal,
  };
}
