'use client';

import React from 'react';
import { TestTube2, X } from 'lucide-react';
import { Animal, BiologicalSampleType, Laboratory } from '@/lib/bovine-types';

interface RegisterSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  animals: Animal[];
  laboratories: Laboratory[];
  newAnimalId: string;
  setNewAnimalId: (v: string) => void;
  newType: BiologicalSampleType;
  setNewType: (v: BiologicalSampleType) => void;
  newLabId: string;
  setNewLabId: (v: string) => void;
  newBarcode: string;
  setNewBarcode: (v: string) => void;
  newStorageLocation: string;
  setNewStorageLocation: (v: string) => void;
  newStorageTemp: string;
  setNewStorageTemp: (v: string) => void;
}

export function RegisterSampleModal({
  isOpen,
  onClose,
  onSubmit,
  animals,
  laboratories,
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
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Animal</label>
            <select
              value={newAnimalId}
              onChange={(e) => setNewAnimalId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
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
                value={newType}
                onChange={(e) => setNewType(e.target.value as BiologicalSampleType)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              >
                <option value="TISSUE_TSU">Tissue TSU (Ear Notch)</option>
                <option value="BLOOD_EDTA">Blood EDTA (Purple Top)</option>
                <option value="SEMEN">Semen Straw (0.5 mL LN2)</option>
                <option value="HAIR_FOLLICLE">Hair Follicles (Tail Switch)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Destination Lab</label>
              <select
                value={newLabId}
                onChange={(e) => setNewLabId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
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
            <label className="font-semibold text-stone-700">Vial 2D Barcode</label>
            <input
              type="text"
              placeholder="e.g. TSU-99881029 or leave blank for auto-generate"
              value={newBarcode}
              onChange={(e) => setNewBarcode(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Storage Location</label>
              <input
                type="text"
                value={newStorageLocation}
                onChange={(e) => setNewStorageLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700">Storage Temperature</label>
              <input
                type="text"
                value={newStorageTemp}
                onChange={(e) => setNewStorageTemp(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
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
              Save Sample
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
