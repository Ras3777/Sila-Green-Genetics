'use client';

import React from 'react';
import { Trophy, X } from 'lucide-react';

interface CreatePerformanceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTestCode: string;
  setNewTestCode: (v: string) => void;
  newTestStation: string;
  setNewTestStation: (v: string) => void;
  newTestName: string;
  setNewTestName: (v: string) => void;
  newTestStartDate: string;
  setNewTestStartDate: (v: string) => void;
  newTestEndDate: string;
  setNewTestEndDate: (v: string) => void;
  newTestSupervisor: string;
  setNewTestSupervisor: (v: string) => void;
  newTestProtocol: string;
  setNewTestProtocol: (v: string) => void;
}

export function CreatePerformanceTestModal({
  isOpen,
  onClose,
  onSubmit,
  newTestCode,
  setNewTestCode,
  newTestStation,
  setNewTestStation,
  newTestName,
  setNewTestName,
  newTestStartDate,
  setNewTestStartDate,
  newTestEndDate,
  setNewTestEndDate,
  newTestSupervisor,
  setNewTestSupervisor,
  newTestProtocol,
  setNewTestProtocol,
}: CreatePerformanceTestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">Schedule Performance Test</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
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
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              Schedule Trial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
