'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Plus,
  Calendar,
  Building,
  UserCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Scale,
  Award,
  X,
  FileText,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { PerformanceTest, PerformanceTestEnrollment } from '@/lib/bovine-types';

export default function PerformanceTestsPage() {
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Standardized Cohort Testing
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Feed Efficiency & Carcass Ultrasound</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-700" />
            Performance Testing Cohorts
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Controlled test station trials measuring Average Daily Gain (ADG), Feed Conversion Ratio (FCR), Residual Feed Intake (RFI) via Insentec/Calan feeders, and real-time carcass ultrasound.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setCreateTestModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Test</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tests List & Detailed Station Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Test Cohorts */}
        <div className="lg:col-span-4 space-y-3">
          {performanceTests.map((pt) => {
            const isSelected = pt.id === selectedTest?.id;
            return (
              <div
                key={pt.id}
                onClick={() => setSelectedTestId(pt.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {pt.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pt.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {pt.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{pt.name}</h4>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                    <span>{pt.testStation}</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
                  <span className="font-semibold">{pt.durationDays} Days Duration</span>
                  <span>{pt.enrolledCount} Head Enrolled</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Test Detail & Enrolled Animals Leaderboard */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTest ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      {selectedTest.code}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600">{selectedTest.durationDays} Days Standard Trial</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedTest.name}</h3>
                </div>

                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll Animal</span>
                </button>
              </div>

              {/* Station Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Test Station</span>
                  <span className="font-bold text-stone-900">{selectedTest.testStation}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Trial Supervisor</span>
                  <span className="font-bold text-stone-900">{selectedTest.supervisor}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Date Window</span>
                  <span className="font-bold text-stone-900">{selectedTest.startDate} to {selectedTest.endDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Active Cohort Size</span>
                  <span className="font-bold text-emerald-800">{testEnrollments.length} Bulls Enrolled</span>
                </div>
              </div>

              {/* Standard Operating Protocol Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  Trial Protocol Specification:
                </span>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  {selectedTest.protocolDescription} Evaluated traits: {(selectedTest.traitsEvaluated || []).join(', ')}.
                  Interim weights taken every 28 days with calibrated multi-point load cells.
                </p>
              </div>

              {/* Leaderboard Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Cohort Performance Rankings & Vitals
                </h4>

                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Animal</th>
                        <th className="py-2.5 px-3">Entry Wt</th>
                        <th className="py-2.5 px-3">Exit Wt</th>
                        <th className="py-2.5 px-3">ADG (kg/d)</th>
                        <th className="py-2.5 px-3">FCR</th>
                        <th className="py-2.5 px-3">RFI (kg/d)</th>
                        <th className="py-2.5 px-3">Ultrasound REA</th>
                        <th className="py-2.5 px-3">IMF Marbling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {testEnrollments.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-stone-500">
                            No animals currently enrolled in this test cohort.
                          </td>
                        </tr>
                      ) : (
                        testEnrollments.map((enr) => (
                          <tr key={enr.id} className="hover:bg-stone-50/70">
                            <td className="py-3 px-3">
                              {enr.rank ? (
                                <span
                                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                                    enr.rank === 1
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : enr.rank === 2
                                      ? 'bg-stone-200 text-stone-800'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}
                                >
                                  {enr.rank}
                                </span>
                              ) : (
                                <span className="text-stone-400 font-mono">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-stone-900">{enr.animalName}</div>
                              <div className="font-mono text-[10px] text-stone-500">
                                {enr.animalIdentifier}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono">{enr.entryWeight} kg</td>
                            <td className="py-3 px-3 font-mono font-semibold">
                              {enr.exitWeight ? `${enr.exitWeight} kg` : 'In Progress'}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                              {enr.averageDailyGain ? `+${enr.averageDailyGain} kg` : '-'}
                            </td>
                            <td className="py-3 px-3 font-mono text-stone-800">
                              {enr.feedConversionRatio || '-'}
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-blue-900">
                              {enr.residualFeedIntake ? `${enr.residualFeedIntake > 0 ? '+' : ''}${enr.residualFeedIntake}` : '-'}
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {enr.ultrasoundRibeyeArea ? `${enr.ultrasoundRibeyeArea} cm²` : '-'}
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {enr.ultrasoundMarbling ? `${enr.ultrasoundMarbling}%` : '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select a performance test to inspect cohort vitals.
            </div>
          )}
        </div>
      </div>

      {/* CREATE TEST MODAL */}
      {createTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Schedule Performance Test</h3>
              </div>
              <button
                onClick={() => setCreateTestModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Test Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PT-2026-FALL-01"
                    value={newTestCode}
                    onChange={(e) => setNewTestCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Test Station</label>
                  <input
                    type="text"
                    required
                    value={newTestStation}
                    onChange={(e) => setNewTestStation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Test Cohort Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 National Bull Intake & Carcass Trial"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newTestStartDate}
                    onChange={(e) => setNewTestStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={newTestEndDate}
                    onChange={(e) => setNewTestEndDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Supervisor / Station Master</label>
                <input
                  type="text"
                  value={newTestSupervisor}
                  onChange={(e) => setNewTestSupervisor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Protocol Details</label>
                <textarea
                  rows={2}
                  value={newTestProtocol}
                  onChange={(e) => setNewTestProtocol(e.target.value)}
                  placeholder="Feeding regimen, 2-day on/off weigh rules, ultrasound protocol..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateTestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Schedule Trial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL ANIMAL MODAL */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Enroll Animal in {selectedTest?.code}</h3>
              <button
                onClick={() => setEnrollModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollAnimal} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Select Animal</label>
                <select
                  value={enrollAnimalId}
                  onChange={(e) => setEnrollAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Official Entry Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 340.5"
                  value={enrollEntryWeight}
                  onChange={(e) => setEnrollEntryWeight(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
