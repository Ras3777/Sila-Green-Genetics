'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  HeartPulse,
  AlertTriangle,
  Pill,
  ShieldCheck,
  Stethoscope,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  ArrowRight,
  Plus,
  Filter,
  Syringe,
  ChevronRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { HealthEventSeverity, HealthEventStatus } from '@/lib/bovine-types';

export default function BovineHealthDashboard() {
  const {
    session,
    farms,
    animals,
    healthEvents,
    diagnoses,
    treatments,
    medicationAdministrations,
    vaccinationEvents,
    preventiveCareEvents,
    recordMedicationGiven,
  } = useBovine();

  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');

  // Filter animals and health records based on selected farm
  const currentFarm = farms.find((f) => f.id === session.activeFarmId);
  const effectiveFarmId = session.activeFarmId !== 'ALL' ? session.activeFarmId : filterFarmId;

  const filteredAnimals = animals.filter(
    (a) => effectiveFarmId === 'ALL' || a.farmId === effectiveFarmId
  );
  const animalIds = new Set(filteredAnimals.map((a) => a.id));

  const scopedHealthEvents = healthEvents.filter((he) => animalIds.has(he.animalId));
  const openCases = scopedHealthEvents.filter((he) => he.status === 'OPEN' || he.status === 'UNDER_TREATMENT');
  const criticalCases = openCases.filter((he) => he.severity === 'CRITICAL' || he.severity === 'HIGH');
  
  const pendingMedications = medicationAdministrations.filter(
    (m) => animalIds.has(m.animalId) && m.status === 'PENDING'
  );

  const activeTreatments = treatments.filter((t) => animalIds.has(t.animalId) && t.status === 'IN_PROGRESS');

  // Withdrawal count
  const withdrawalMedications = medicationAdministrations.filter((m) => {
    if (!animalIds.has(m.animalId) || m.status !== 'GIVEN') return false;
    const treat = treatments.find((t) => t.id === m.treatmentId);
    if (!treat || !treat.meatWithdrawalDays) return false;
    const adminDate = new Date(m.administeredAt);
    const releaseDate = new Date(adminDate.getTime() + treat.meatWithdrawalDays * 86400000);
    return releaseDate > new Date();
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            <span>Clinical & Veterinary Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Health & Herd Wellness
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Active clinical case surveillance, treatment compliance protocols, medication administrations, and food safety withdrawal clearance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session.activeFarmId === 'ALL' && (
            <select
              value={filterFarmId}
              onChange={(e) => setFilterFarmId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="ALL">All Facilities</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <Link
            href="/bovine/health/cases"
            className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Open Health Case
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Active Clinical Cases</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {openCases.length}
            </span>
            <span className="text-xs text-amber-800 font-medium">
              {criticalCases.length} urgent
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Animals under active clinical monitoring</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Pending Medications</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {pendingMedications.length}
            </span>
            <span className="text-xs text-stone-400 font-medium">due today</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Scheduled antibiotic & supportive doses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Withdrawal Restrictions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {withdrawalMedications.length}
            </span>
            <span className="text-xs text-rose-800 font-medium">active lock</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Animals withholding milk or meat</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Active Treatments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {activeTreatments.length}
            </span>
            <span className="text-xs text-blue-700 font-medium">courses running</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Veterinary protocols underway</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/bovine/health/cases"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Health Cases</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{openCases.length} open</span>
        </Link>

        <Link
          href="/bovine/health/medications"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Pill className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Medications</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{pendingMedications.length} pending</span>
        </Link>

        <Link
          href="/bovine/health/treatments"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Treatments</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{treatments.length} protocols</span>
        </Link>

        <Link
          href="/bovine/health/vaccinations"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Syringe className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Vaccinations</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{vaccinationEvents.length} recorded</span>
        </Link>

        <Link
          href="/bovine/health/preventive-care"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Preventive Care</span>
          <span className="text-[11px] text-stone-400 mt-0.5">{preventiveCareEvents.length} events</span>
        </Link>

        <Link
          href="/bovine/health/withdrawal"
          className="bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-xs transition-all group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-stone-800">Withdrawal Timers</span>
          <span className="text-[11px] text-rose-800 font-medium mt-0.5">{withdrawalMedications.length} restricted</span>
        </Link>
      </div>

      {/* Main Workspace Grid: Urgent Attention Queue & Pending Administrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Attention Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-800" />
                <h2 className="text-base font-bold text-stone-900">Clinical Attention Queue</h2>
              </div>
              <Link
                href="/bovine/health/cases"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
              >
                <span>View All ({openCases.length})</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            {openCases.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-900">Herd Clinical Status Normal</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  No active health incidents or sick cases require supervisor intervention right now.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {openCases.map((c) => {
                  const anim = animals.find((a) => a.id === c.animalId);
                  const diag = diagnoses.find((d) => d.healthEventId === c.id);
                  const treat = treatments.find((t) => t.healthEventId === c.id);

                  return (
                    <div key={c.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            c.severity === 'CRITICAL'
                              ? 'bg-rose-600 ring-4 ring-rose-100'
                              : c.severity === 'HIGH'
                              ? 'bg-amber-500 ring-4 ring-amber-100'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/bovine/animals/${c.animalId}`}
                              className="text-sm font-bold text-stone-900 hover:text-emerald-800"
                            >
                              {anim?.name || 'Unknown Animal'}
                            </Link>
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                              {anim?.primaryIdentifier || anim?.internalId}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                c.status === 'UNDER_TREATMENT'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {c.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-stone-700 font-medium mt-0.5">
                            {c.reason}
                          </p>

                          {c.notes && (
                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{c.notes}</p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                            <span>Opened: {new Date(c.openedAt).toLocaleDateString()}</span>
                            {diag && (
                              <span>
                                Diagnosis: <strong className="text-stone-700">{diag.diseaseName}</strong>
                              </span>
                            )}
                            {treat && (
                              <span>
                                Protocol: <strong className="text-emerald-800">{treat.protocolName}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <Link
                          href={`/bovine/animals/${c.animalId}/health`}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          View Animal 360
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Preventive Campaigns */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-stone-900">Recent Preventive Care & Hoof Health</h2>
              <Link
                href="/bovine/health/preventive-care"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center"
              >
                <span>Full Ledger</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {preventiveCareEvents.slice(0, 4).map((p) => {
                const anim = animals.find((a) => a.id === p.animalId);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-xl bg-white border border-stone-200 text-emerald-800 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">
                          {p.type.replace(/_/g, ' ')}: {p.productName || 'Routine Service'}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {anim?.name} ({anim?.primaryIdentifier}) • {(p.administeredAt || p.performedAt || '').split('T')[0] || 'Recently'} • By {p.administeredByName || p.performedByName || 'Staff'}
                        </div>
                      </div>
                    </div>
                    {p.nextDueDate && (
                      <div className="text-right font-mono text-[11px] text-stone-500">
                        Next Due: {p.nextDueDate}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Medication Administrations Due */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-bold text-stone-900">Doses Due Today</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                {pendingMedications.length}
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Click to quickly sign off administered medications directly into the herd audit log.
            </p>

            {pendingMedications.length === 0 ? (
              <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-stone-700">All Scheduled Doses Given</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Zero overdue medication tasks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMedications.map((m) => {
                  const anim = animals.find((a) => a.id === m.animalId);
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-800/40 bg-stone-50/50 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-stone-900 text-xs">
                            {m.medication} ({m.dose} {m.doseUnit})
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {anim?.name} • <span className="font-mono">{anim?.primaryIdentifier}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                            Route: {m.route?.replace(/_/g, ' ') || 'N/A'}
                          </div>
                        </div>

                        <button
                          onClick={() => recordMedicationGiven(m.id, 'LOT-CONFIRMED', 'Administered on shift')}
                          className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0 flex items-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Given
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-stone-100">
              <Link
                href="/bovine/health/medications"
                className="w-full inline-flex justify-center items-center py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
              >
                <span>Open Full Medication Worklist</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Quick Veterinary Tip / Food Safety Banner */}
          <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Food Safety Protocol Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Animals receiving intramammary ceftiofur or subcutaneous tulathromycin are automatically placed under milk and meat withholding locks until withdrawal timers expire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
