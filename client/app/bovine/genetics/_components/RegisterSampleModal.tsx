'use client';

import React from 'react';
import { TestTube2, X } from 'lucide-react';
import { Animal, Laboratory } from '@/lib/bovine-types';

interface RegisterSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  laboratories: Laboratory[];
  newSampleAnimalId: string;
  setNewSampleAnimalId: (id: string) => void;
  newSampleType: 'TISSUE_TSU' | 'BLOOD_EDTA' | 'SEMEN' | 'HAIR_FOLLICLE';
  setNewSampleType: (type: 'TISSUE_TSU' | 'BLOOD_EDTA' | 'SEMEN' | 'HAIR_FOLLICLE') => void;
  newSampleLabId: string;
  setNewSampleLabId: (id: string) => void;
  newSampleBarcode: string;
  setNewSampleBarcode: (barcode: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterSampleModal({
  isOpen,
  onClose,
  animals,
  laboratories,
  newSampleAnimalId,
  setNewSampleAnimalId,
  newSampleType,
  setNewSampleType,
  newSampleLabId,
  setNewSampleLabId,
  newSampleBarcode,
  setNewSampleBarcode,
  onSubmit,
}: RegisterSampleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <TestTube2 className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">Register Biological Sample</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Select Animal</label>
            <select
              value={newSampleAnimalId}
              onChange={(e) => setNewSampleAnimalId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.primaryIdentifier || a.internalId}) - {a.sex}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Sample Type</label>
              <select
                value={newSampleType}
                onChange={(e) => setNewSampleType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="TISSUE_TSU">Tissue TSU (Allflex Ear Notch)</option>
                <option value="BLOOD_EDTA">Blood EDTA (Purple Top)</option>
                <option value="SEMEN">Semen Straw (0.5 mL Liquid N2)</option>
                <option value="HAIR_FOLLICLE">Hair Follicles (Tail Switch)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Destination Laboratory</label>
              <select
                value={newSampleLabId}
                onChange={(e) => setNewSampleLabId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name} ({lab.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Vial 2D Barcode / RFID Tag</label>
            <input
              type="text"
              placeholder="e.g. TSU-9941029482 or leave empty for auto-generated"
              value={newSampleBarcode}
              onChange={(e) => setNewSampleBarcode(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm cursor-pointer"
            >
              Enroll Sample
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
