'use client';

import React from 'react';
import { usePerformanceTests } from './_hooks/usePerformanceTests';
import {
  PerformanceTestsHeader,
  PerformanceTestCohortList,
  PerformanceTestStationDetail,
  PerformanceTestLeaderboard,
  CreatePerformanceTestModal,
  EnrollAnimalModal,
} from './_components';

export default function PerformanceTestsPage() {
  const {
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
  } = usePerformanceTests();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PerformanceTestsHeader
        onCreateTest={() => setCreateTestModalOpen(true)}
      />

      {/* Main Grid: Tests List & Detailed Station Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Test Cohorts */}
        <PerformanceTestCohortList
          performanceTests={performanceTests}
          selectedTestId={selectedTestId}
          onSelectTest={setSelectedTestId}
        />

        {/* Right Col: Test Detail & Enrolled Animals Leaderboard */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTest ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              <PerformanceTestStationDetail
                selectedTest={selectedTest}
                enrolledCount={testEnrollments.length}
                onEnrollAnimal={() => setEnrollModalOpen(true)}
              />

              <PerformanceTestLeaderboard
                testEnrollments={testEnrollments}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select a performance test to inspect cohort vitals.
            </div>
          )}
        </div>
      </div>

      {/* Create Test Modal */}
      <CreatePerformanceTestModal
        isOpen={createTestModalOpen}
        onClose={() => setCreateTestModalOpen(false)}
        onSubmit={handleCreateTest}
        newTestCode={newTestCode}
        setNewTestCode={setNewTestCode}
        newTestStation={newTestStation}
        setNewTestStation={setNewTestStation}
        newTestName={newTestName}
        setNewTestName={setNewTestName}
        newTestStartDate={newTestStartDate}
        setNewTestStartDate={setNewTestStartDate}
        newTestEndDate={newTestEndDate}
        setNewTestEndDate={setNewTestEndDate}
        newTestSupervisor={newTestSupervisor}
        setNewTestSupervisor={setNewTestSupervisor}
        newTestProtocol={newTestProtocol}
        setNewTestProtocol={setNewTestProtocol}
      />

      {/* Enroll Animal Modal */}
      <EnrollAnimalModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        onSubmit={handleEnrollAnimal}
        testCode={selectedTest?.code}
        animals={animals}
        enrollAnimalId={enrollAnimalId}
        setEnrollAnimalId={setEnrollAnimalId}
        enrollEntryWeight={enrollEntryWeight}
        setEnrollEntryWeight={setEnrollEntryWeight}
      />
    </div>
  );
}
