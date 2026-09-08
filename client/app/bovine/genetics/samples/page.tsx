'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TestTube2,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building,
  QrCode,
  Thermometer,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { GeneticSample, BiologicalSampleType, SampleStatus } from '@/lib/bovine-types';

export default function BiologicalSamplesPage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Laboratory Logistics
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">ISO 17025 Chain of Custody</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <TestTube2 className="w-5 h-5 text-emerald-700" />
            Biological Samples & Custody Tracking
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Strict tracking of tissue sampling units (TSU), EDTA blood vials, and semen straws.
            Maintains permanent audit log of handlers, temperatures, barcodes, and lab statuses.
          </p>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Sample</span>
        </button>
      </div>

      {/* Main Grid: Samples List & Detail Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sample List with Filters */}
        <div className="lg:col-span-6 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap gap-2 text-xs">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search barcode or animal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="COLLECTED">Collected</option>
              <option value="SHIPPED">Shipped</option>
              <option value="RECEIVED">Received</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="TISSUE_TSU">Tissue TSU</option>
              <option value="BLOOD_EDTA">Blood EDTA</option>
              <option value="SEMEN">Semen Straw</option>
              <option value="HAIR_FOLLICLE">Hair Follicles</option>
            </select>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {filteredSamples.map((sample) => {
              const isSelected = sample.id === selectedSample?.id;
              return (
                <div
                  key={sample.id}
                  onClick={() => setSelectedSampleId(sample.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold bg-stone-100 text-stone-900 px-2 py-0.5 rounded">
                        {sample.sampleCode}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                        {sample.sampleType}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sample.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sample.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : sample.status === 'PROCESSING'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sample.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{sample.animalName}</h4>
                      <div className="font-mono text-[11px] text-stone-500">
                        {sample.animalIdentifier}
                      </div>
                    </div>
                    {sample.barcode && (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                        <QrCode className="w-3.5 h-3.5 text-stone-400" />
                        <span>{sample.barcode}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                    <span>Lab: {sample.destinationLabName || 'Unassigned'}</span>
                    <span>Collected {sample.collectedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Chain of Custody Timeline & Sample Metadata */}
        <div className="lg:col-span-6">
          {selectedSample ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      {selectedSample.sampleCode}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600">{selectedSample.sampleType}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">
                    {selectedSample.animalName} ({selectedSample.animalIdentifier})
                  </h3>
                </div>

                <button
                  onClick={() => setCustodyModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Add Custody Event</span>
                </button>
              </div>

              {/* Sample Logistics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Destination Lab</span>
                  <span className="font-bold text-stone-900">{selectedSample.destinationLabName}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Barcode / RFID</span>
                  <span className="font-mono font-bold text-stone-900">{selectedSample.barcode}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Storage Temp & Bin</span>
                  <span className="font-bold text-stone-900">
                    {selectedSample.storageTemp || '+4°C'} ({selectedSample.storageLocation || 'Vault A'})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Courier Tracking</span>
                  <span className="font-mono font-semibold text-emerald-800">
                    {selectedSample.shippingTrackingNumber || 'Pending Courier Pickup'}
                  </span>
                </div>
              </div>

              {/* Chain of Custody Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Chain of Custody Audit Trail
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">Immutable Log</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {selectedSample.chainOfCustody.map((event, idx) => (
                    <div key={idx} className="relative space-y-1 text-xs">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{event.action}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{event.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-stone-600 flex items-center gap-2">
                        <span className="font-medium text-stone-800">{event.handledBy}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              Select a biological sample from the left to view custody timeline.
            </div>
          )}
        </div>
      </div>

      {/* REGISTER SAMPLE MODAL */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <TestTube2 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Register Biological Sample</h3>
              </div>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSample} className="space-y-4 text-xs">
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
                    onChange={(e) => setNewType(e.target.value as any)}
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
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Save Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTODY EVENT MODAL */}
      {custodyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Add Custody Event</h3>
              <button
                onClick={() => setCustodyModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustodyEvent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Action / Event Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Courier pickup; cold-chain box transfer"
                  value={custodyAction}
                  onChange={(e) => setCustodyAction(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Location</label>
                  <input
                    type="text"
                    required
                    value={custodyLocation}
                    onChange={(e) => setNewStorageLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Handled By</label>
                  <input
                    type="text"
                    required
                    value={custodyHandler}
                    onChange={(e) => setCustodyHandler(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Advance Sample Status To</label>
                <select
                  value={custodyStatusNext}
                  onChange={(e) => setCustodyStatusNext(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
                >
                  <option value="SHIPPED">SHIPPED (In Courier Transit)</option>
                  <option value="RECEIVED">RECEIVED (At Laboratory)</option>
                  <option value="PROCESSING">PROCESSING (DNA Extraction / Array)</option>
                  <option value="COMPLETED">COMPLETED (Assay Finished)</option>
                  <option value="REJECTED">REJECTED (Insufficient DNA)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCustodyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Log Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
