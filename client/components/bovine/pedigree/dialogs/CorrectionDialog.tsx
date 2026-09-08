'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Animal, Parentage, ParentageStatus } from '@/lib/bovine-types';
import { useBovine } from '@/lib/bovine-store';

interface CorrectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetAnimalId: string;
  allAnimals: Animal[];
  currentParentage?: Parentage;
}

export default function CorrectionDialog({
  isOpen,
  onClose,
  targetAnimalId,
  allAnimals,
  currentParentage,
}: CorrectionDialogProps) {
  const { updateParentage, updateAnimal } = useBovine();
  const animal = allAnimals.find((a) => a.id === targetAnimalId);

  const candidateSires = allAnimals.filter(
    (a) => a.sex === 'MALE' && a.id !== targetAnimalId
  );
  const candidateDams = allAnimals.filter(
    (a) => a.sex === 'FEMALE' && a.id !== targetAnimalId
  );

  const [selectedSireId, setSelectedSireId] = useState<string>(
    animal?.sireId || currentParentage?.sireId || ''
  );
  const [selectedDamId, setSelectedDamId] = useState<string>(
    animal?.damId || currentParentage?.damId || ''
  );
  const [verificationMethod, setVerificationMethod] = useState<string>(
    'Genomic SNP 50K BeadChip Verification'
  );
  const [status, setStatus] = useState<ParentageStatus>('VERIFIED');
  const [reason, setReason] = useState<string>(
    'Parentage re-assayed following genomic parentage verification protocol.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !animal) return null;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleExecuteSave = () => {
    setIsSubmitting(true);

    const chosenSire = allAnimals.find((a) => a.id === selectedSireId);
    const chosenDam = allAnimals.find((a) => a.id === selectedDamId);

    const updatedParentage: Parentage = {
      ...(currentParentage || {
        source: 'Breeder Registration',
        confidence: 'HIGH',
        sireStatus: 'RECORDED',
        damStatus: 'RECORDED',
      }),
      sireId: chosenSire ? chosenSire.id : undefined,
      sireName: chosenSire ? chosenSire.name : undefined,
      sireIdentifier: chosenSire ? chosenSire.primaryIdentifier : undefined,
      sireStatus: status,
      damId: chosenDam ? chosenDam.id : undefined,
      damName: chosenDam ? chosenDam.name : undefined,
      damIdentifier: chosenDam ? chosenDam.primaryIdentifier : undefined,
      damStatus: status,
      verificationMethod,
      verificationStatus: status,
      source: reason,
      lastUpdated: new Date().toISOString(),
    };

    updateParentage(animal.id, updatedParentage);
    updateAnimal(animal.id, {
      sireId: chosenSire?.id,
      sireName: chosenSire?.name,
      damId: chosenDam?.id,
      damName: chosenDam?.name,
    });

    setIsSubmitting(false);
    setShowConfirmModal(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Parentage Assignment & Correction
              </h3>
              <p className="text-stone-500 text-xs">
                Modify verified parentage for {animal.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleOpenConfirm} className="p-6 space-y-4 text-xs">
          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Parentage records successfully updated in store.</span>
            </div>
          )}

          {/* Sire Selection */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Sire Assignment</label>
            <select
              value={selectedSireId}
              onChange={(e) => setSelectedSireId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
            >
              <option value="">No Sire Assigned (Unknown)</option>
              {candidateSires.map((bull) => (
                <option key={bull.id} value={bull.id}>
                  {bull.name} ({bull.primaryIdentifier || bull.internalId})
                </option>
              ))}
            </select>
          </div>

          {/* Dam Selection */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Dam Assignment</label>
            <select
              value={selectedDamId}
              onChange={(e) => setSelectedDamId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
            >
              <option value="">No Dam Assigned (Unknown)</option>
              {candidateDams.map((cow) => (
                <option key={cow.id} value={cow.id}>
                  {cow.name} ({cow.primaryIdentifier || cow.internalId})
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Verification Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ParentageStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
              >
                <option value="VERIFIED">VERIFIED (DNA Confirmed)</option>
                <option value="RECORDED">RECORDED (Breeder Logged)</option>
                <option value="PROPOSED">PROPOSED (Pending Confirmation)</option>
                <option value="DISPUTED">DISPUTED (Exclusion Flag)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Method</label>
              <select
                value={verificationMethod}
                onChange={(e) => setVerificationMethod(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
              >
                <option value="Genomic SNP 50K BeadChip Verification">SNP 50K Chip</option>
                <option value="ISAG STR 12-Microsatellite Panel">STR 12-Marker</option>
                <option value="Official Association Herdbook Certificate">Herdbook Certificate</option>
                <option value="Embryo Transfer Flush Sheet #2026-F19">ET Flush Sheet</option>
                <option value="Breeder AI Service Certificate">AI Service Certificate</option>
              </select>
            </div>
          </div>

          {/* Reason / Evidence Notes */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Audit Justification & Notes
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 placeholder:text-stone-400"
              placeholder="Provide justification and certificate reference..."
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors shadow-xs"
            >
              Review & Submit
            </button>
          </div>
        </form>

        {/* Verification Modal for Mutation Confirmation (Strict Rule compliance) */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-bold text-stone-900 text-base">
                  Confirm Parentage Update
                </h4>
                <p className="text-stone-500 text-xs">
                  Modifying the parentage of <span className="font-bold">{animal.name}</span> will recalculate all inbreeding coefficients, genetic percentiles, and ancestral connections.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div>
                  <span className="text-stone-400">Status:</span>{' '}
                  <span className="font-bold text-emerald-800">{status}</span>
                </div>
                <div>
                  <span className="text-stone-400">Method:</span>{' '}
                  <span className="font-bold text-stone-800">{verificationMethod}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSave}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
