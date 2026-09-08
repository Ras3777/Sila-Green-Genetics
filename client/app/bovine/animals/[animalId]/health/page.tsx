'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  HeartPulse,
  Stethoscope,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
} from 'lucide-react';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

interface PageProps {
  params: Promise<{ animalId: string }>;
}

export default function Animal360HealthPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    healthEvents,
    diagnoses,
    treatments,
    medicationAdministrations,
    vaccinationEvents,
    preventiveCareEvents,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  const myHealthEvents = healthEvents.filter((he) => he.animalId === animalId);
  const myTreatments = treatments.filter((t) => t.animalId === animalId);
  const myMeds = medicationAdministrations.filter((m) => m.animalId === animalId);
  const myVaccines = vaccinationEvents.filter((v) => v.animalId === animalId);
  const myPreventive = preventiveCareEvents.filter((p) => p.animalId === animalId);

  if (!animal) return null;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            <span>Clinical History & Therapeutics</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900">Medical Record: {animal.name}</h2>
          <p className="text-xs text-stone-500">
            Open clinical cases, veterinary treatment courses, and food safety withholding status.
          </p>
        </div>

        <Link
          href="/bovine/health/cases"
          className="inline-flex items-center px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Open Case
        </Link>
      </div>

      {/* Clinical Cases List */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <Stethoscope className="w-4 h-4 text-emerald-800" />
          <span>Clinical Health Cases ({myHealthEvents.length})</span>
        </h3>

        {myHealthEvents.length === 0 ? (
          <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
            <p className="text-xs font-semibold text-stone-800">Clean Health Record</p>
            <p className="text-[11px] text-stone-400">No medical cases on file for this animal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myHealthEvents.map((c) => {
              const diag = diagnoses.find((d) => d.healthEventId === c.id);
              const treat = treatments.find((t) => t.healthEventId === c.id);

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 text-sm">{c.reason}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'UNDER_TREATMENT'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : c.status === 'RESOLVED'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="font-mono text-stone-400 text-[11px]">
                      Opened: {new Date(c.openedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {c.notes && <p className="text-stone-600 leading-relaxed">{c.notes}</p>}

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-2 border-t border-stone-200/60">
                    {diag && (
                      <span>
                        Diagnosis: <strong className="text-stone-800">{diag.diseaseName}</strong> (
                        {diag.confidence})
                      </span>
                    )}
                    {treat && (
                      <span>
                        Protocol: <strong className="text-emerald-800">{treat.protocolName}</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Medication & Vaccination History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medications Given */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
            <Pill className="w-4 h-4 text-emerald-800" />
            <span>Medications & Prescriptions ({myMeds.length})</span>
          </h3>

          {myMeds.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4">No medication administrations logged.</p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {myMeds.map((m) => (
                <div key={m.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">{m.medication}</div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {m.dose} {m.doseUnit} • {m.route} • Lot {m.batchNumber || '—'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.status === 'GIVEN'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {new Date(m.administeredAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vaccinations & Preventive Care */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Vaccinations & Parasite Control</span>
          </h3>

          {myVaccines.length === 0 && myPreventive.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4">No immunizations or routine care logged.</p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {myVaccines.map((v) => (
                <div key={v.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">{v.vaccineName}</div>
                    <div className="text-[11px] text-stone-400">
                      Vaccine • Lot {v.batchNumber}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-stone-500">
                    {v.administeredAt.split('T')[0]}
                  </div>
                </div>
              ))}

              {myPreventive.map((p) => (
                <div key={p.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">
                      {p.type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {p.productName || 'Routine service'}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-stone-500">
                    {(p.administeredAt || p.performedAt || '').split('T')[0] || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clinical Photographic Evidence & Diagnostics */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        categoryFilter={['HEALTH_CLINICAL', 'ULTRASOUND', 'WALKING_VIDEO']}
        title="Clinical Photographic Evidence & Ultrasound Scans"
        description="Lesion tracking, digital claw examination, ultrasound diagnostics, and gait evaluation videos."
        galleryPath={`/bovine/animals/${animal.id}/media`}
      />
    </div>
  );
}
