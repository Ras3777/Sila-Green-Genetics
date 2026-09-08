'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Microscope,
  Dna,
  Plus,
  QrCode,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';
import { useGenetics } from '@/lib/bovine-genetics-store';
import { GeneticSampleType, SampleProcessingStatus } from '@/lib/bovine-types';

export default function AnimalGeneticSamplesPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals } = useBovine();
  const {
    geneticSamples,
    laboratories,
    addGeneticSample,
    advanceSampleStatus,
  } = useGenetics();

  const animal = animals.find((a) => a.id === animalId);
  const mySamples = geneticSamples.filter((s) => s.animalId === animalId);

  // Collect Modal State
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [sampleType, setSampleType] = useState<GeneticSampleType>('TISSUE_TSU');
  const [destinationLabId, setDestinationLabId] = useState(laboratories[0]?.id || '');
  const [barcode, setBarcode] = useState('');
  const [collectedBy, setCollectedBy] = useState('Farm Herdsman');
  const [notes, setNotes] = useState('');

  // Status Advance Modal State
  const [selectedSampleForAdvance, setSelectedSampleForAdvance] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<SampleProcessingStatus>('SHIPPED');
  const [handlerName, setHandlerName] = useState('Logistics Staff');
  const [locationName, setLocationName] = useState('Dispatch Dock');
  const [actionNote, setActionNote] = useState('');

  if (!animal) {
    return <div className="p-8 text-stone-500">Livestock record not found.</div>;
  }

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const lab = laboratories.find((l) => l.id === destinationLabId);
    const code = `SMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addGeneticSample({
      sampleCode: code,
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      sampleType,
      collectedDate: new Date().toISOString().split('T')[0],
      collectedBy,
      destinationLabId,
      destinationLabName: lab?.name || 'Central Lab',
      status: 'COLLECTED',
      barcode: barcode || `BC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes: notes || undefined,
      chainOfCustody: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: 'Farm Chute & Processing Pen',
          handledBy: collectedBy,
          action: `Collected ${sampleType.replace(/_/g, ' ')} biological sample`,
          notes: notes || undefined,
        },
      ],
    });

    setIsCollectModalOpen(false);
    setBarcode('');
    setNotes('');
  };

  const handleAdvanceStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSampleForAdvance) return;

    advanceSampleStatus(
      selectedSampleForAdvance,
      nextStatus,
      handlerName,
      locationName,
      actionNote || `Status updated to ${nextStatus}`
    );

    setSelectedSampleForAdvance(null);
    setActionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Laboratory Genomics & Biosamples
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">
              {mySamples.length} Sample{mySamples.length === 1 ? '' : 's'} on Record
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-700" />
            Biological Samples & Chain of Custody
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            TSU ear punches, blood EDTA tubes, and semen straws tracking with laboratory intake verification and custody auditing.
          </p>
        </div>

        <button
          id="btn-collect-sample"
          onClick={() => setIsCollectModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Collect New Sample</span>
        </button>
      </div>

      {/* Samples List */}
      <div className="space-y-4">
        {mySamples.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
            <Microscope className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="font-semibold text-stone-800">No biological samples recorded</p>
            <p className="text-xs text-stone-500 mt-1">
              Collect a tissue notch (TSU) or blood sample to start DNA extraction and genotyping.
            </p>
          </div>
        ) : (
          mySamples.map((sample) => (
            <div
              key={sample.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden"
            >
              {/* Sample Top Card Header */}
              <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        {sample.sampleCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-700 border border-stone-300">
                        {sample.sampleType.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          sample.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : sample.status === 'PROCESSING'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : sample.status === 'RECEIVED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {sample.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 flex items-center space-x-2">
                      <span>Dest: {sample.destinationLabName}</span>
                      <span>•</span>
                      <span>Collected: {sample.collectedDate} ({sample.collectedBy})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {sample.barcode && (
                    <div className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono text-stone-700">
                      <QrCode className="w-3.5 h-3.5 text-stone-400" />
                      <span>{sample.barcode}</span>
                    </div>
                  )}

                  {sample.status !== 'COMPLETED' && (
                    <button
                      onClick={() => {
                        setSelectedSampleForAdvance(sample.id);
                        if (sample.status === 'COLLECTED') setNextStatus('SHIPPED');
                        else if (sample.status === 'SHIPPED') setNextStatus('RECEIVED');
                        else if (sample.status === 'RECEIVED') setNextStatus('PROCESSING');
                        else if (sample.status === 'PROCESSING') setNextStatus('COMPLETED');
                      }}
                      className="px-3 py-1 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Advance Status
                    </button>
                  )}
                </div>
              </div>

              {/* Chain of Custody Flow */}
              <div className="p-4 space-y-3">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Chain of Custody Audit Trail ({sample.chainOfCustody.length} checkpoints)</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {sample.chainOfCustody.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-700 border-2 border-white ring-2 ring-emerald-100" />
                      <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-medium">
                          <span className="font-bold text-stone-900">{entry.action}</span>
                          <span className="font-mono text-[10px] text-stone-500">{entry.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-stone-600 flex items-center space-x-2">
                          <span>Location: <span className="font-semibold text-stone-800">{entry.location}</span></span>
                          <span>•</span>
                          <span>Handler: <span className="font-semibold text-stone-800">{entry.handledBy}</span></span>
                        </div>
                        {entry.notes && (
                          <div className="text-[10px] text-stone-500 italic mt-0.5">
                            &ldquo;{entry.notes}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Collect Sample Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleCollect}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-emerald-700" />
                <span>Collect Biological Sample</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCollectModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sample Biotype</label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value as GeneticSampleType)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="TISSUE_TSU">Tissue TSU Ear Notch</option>
                <option value="BLOOD_EDTA">Blood EDTA Tube</option>
                <option value="HAIR_FOLLICLE">Hair Follicle Card</option>
                <option value="SEMEN">Semen Straw</option>
                <option value="EMBRYO_BIOPSY">Embryo Biopsy</option>
                <option value="NASAL_SWAB">Nasal Swab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Destination Laboratory</label>
              <select
                value={destinationLabId}
                onChange={(e) => setDestinationLabId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name} ({lab.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Vial Barcode / 2D Matrix</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="TSU99201948"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Collector Technician</label>
                <input
                  type="text"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Collection Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Preservative buffer check, puncture site status, storage temp, etc."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCollectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Save Sample
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Advance Status Modal */}
      {selectedSampleForAdvance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleAdvanceStatus}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                <span>Advance Custody Status</span>
              </h2>
              <button
                type="button"
                onClick={() => setSelectedSampleForAdvance(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">New Custody Stage</label>
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as SampleProcessingStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="SHIPPED">SHIPPED - In Transit</option>
                <option value="RECEIVED">RECEIVED - Lab Intake Scanned</option>
                <option value="PROCESSING">PROCESSING - DNA Extraction</option>
                <option value="COMPLETED">COMPLETED - Genotype Sequenced</option>
                <option value="REJECTED">REJECTED - Integrity Failed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Handling Person</label>
                <input
                  type="text"
                  value={handlerName}
                  onChange={(e) => setHandlerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Action Note</label>
              <input
                type="text"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Dispatched via courier, cold pouch integrity verified..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSampleForAdvance(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Record Checkpoint
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
