'use client';

import React, { useState } from 'react';
import {
  Building,
  Plus,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  TestTube2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { Laboratory } from '@/lib/bovine-types';

export default function LaboratoriesPage() {
  const { laboratories, geneticSamples, addLaboratory } = useGenetics();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newTurnaround, setNewTurnaround] = useState('10-14 days');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newAssays, setNewAssays] = useState('Illumina BovineSNP50, GGP Bovine 100K');

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    addLaboratory({
      code: newCode.toUpperCase(),
      name: newName,
      country: newCountry,
      accreditations: ['ISO 17025', 'ICAR Certified', 'ISAG Parentage'],
      primaryAssays: newAssays.split(',').map((s) => s.trim()),
      turnaroundDaysAvg: parseInt(newTurnaround) || 12,
      active: true,
      contactEmail: newEmail,
      contactPhone: newPhone,
      contactPerson: newContactPerson,
    });

    setCreateModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Accredited Genomics Partners
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">ICAR & ISAG Certified</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-700" />
            Genomics Laboratories Directory
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Certified partner laboratories processing high-density BeadChips, low-pass sequencing, and ICAR-standard parentage SNP panels.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Laboratory</span>
        </button>
      </div>

      {/* Grid of Laboratories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {laboratories.map((lab) => {
          const labSamples = geneticSamples.filter((s) => s.destinationLabId === lab.id);
          return (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  {lab.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active Partner</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">{lab.name}</h3>
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{lab.country}</span>
                </div>
              </div>

              {/* Accreditations */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  Certifications & Standards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(lab.accreditations || []).map((acc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-medium text-[10px] border border-stone-200 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>{acc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Assays */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                  Supported Genomic Platforms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(lab.primaryAssays || []).map((assay, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-mono text-[10px] border border-blue-200"
                    >
                      {assay}
                    </span>
                  ))}
                </div>
              </div>

              {/* Turnaround & Samples active */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Turnaround Avg
                  </span>
                  <span className="font-bold text-stone-900">{lab.turnaroundDaysAvg || lab.averageTurnaroundDays || 10} Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Active Samples
                  </span>
                  <span className="font-bold text-emerald-800">{labSamples.length} in Processing</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-stone-100 space-y-1 text-stone-600 text-[11px]">
                {lab.contactPerson && <div>Contact: <span className="font-semibold text-stone-800">{lab.contactPerson}</span></div>}
                {lab.contactEmail && (
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{lab.contactEmail}</span>
                  </div>
                )}
                {lab.contactPhone && (
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{lab.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE LAB MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Add Accredited Laboratory</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLab} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Lab Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZOETIS-US"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 uppercase font-mono font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Country</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Laboratory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zoetis Genetics Kalamazoo Lab"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Primary Assays (comma-separated)</label>
                <input
                  type="text"
                  value={newAssays}
                  onChange={(e) => setNewAssays(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Contact Email</label>
                  <input
                    type="email"
                    placeholder="intake@genomicslab.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 800-555-0199"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Register Laboratory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
