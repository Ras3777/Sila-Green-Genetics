'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  History,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Truck,
  HeartPulse,
  Sparkles,
  CheckSquare,
  Baby,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'BIRTH' | 'REGISTRATION' | 'MOVEMENT' | 'DAILY_LOG' | 'OBSERVATION' | 'TASK';
  title: string;
  description: string;
  icon: any;
  color: string;
}

export default function AnimalTimelinePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, movements, dailyLogs, observations, tasks, farms } = useBovine();
  const animal = animals.find((a) => a.id === animalId);

  const [filterType, setFilterType] = useState<string>('ALL');

  if (!animal) return null;

  // Synthesize unified chronological event timeline
  const events: TimelineEvent[] = [
    {
      id: 'evt-birth',
      date: animal.birthDate,
      type: 'BIRTH',
      title: 'Birth & Enrolment',
      description: `Born as ${animal.birthType} calf, birth weight ${animal.birthWeightKg || 42} kg. Horn status: ${animal.hornStatus}.`,
      icon: Baby,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'evt-reg',
      date: animal.birthDate,
      type: 'REGISTRATION',
      title: 'Pedigree Registration Approved',
      description: `Enrolled into official registry under internal tag ${animal.internalId} / ${animal.primaryIdentifier}.`,
      icon: CheckCircle2,
      color: 'bg-blue-100 text-blue-800',
    },
  ];

  // Movements
  movements
    .filter((m) => m.animalId === animal.id)
    .forEach((m) => {
      events.push({
        id: m.id,
        date: m.movementDate,
        type: 'MOVEMENT',
        title: `Inter-Facility Movement: ${m.fromFarmName} -> ${m.toFarmName}`,
        description: `Reason: ${m.reason}. Ref: ${m.referenceNumber}.`,
        icon: Truck,
        color: 'bg-purple-100 text-purple-800',
      });
    });

  // Daily Vitals
  dailyLogs
    .filter((l) => l.animalId === animal.id)
    .forEach((l) => {
      events.push({
        id: l.id,
        date: l.date,
        type: 'DAILY_LOG',
        title: `Daily Vitals Check: ${l.operationalStatus}`,
        description: `Temp: ${l.temperature || 38.5}°C, Appetite: ${l.appetite || 'Normal'}, BCS: ${l.bcs || 3.5}, Rumination: ${l.ruminationMinutes || 'N/A'} min. ${l.notes || ''}`,
        icon: HeartPulse,
        color: (l.temperature || 38.5) > 39.3 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800',
      });
    });

  // Observations
  observations
    .filter((o) => o.animalId === animal.id)
    .forEach((o) => {
      events.push({
        id: o.id,
        date: o.date,
        type: 'OBSERVATION',
        title: `Observation [${o.category}]: ${o.summary}`,
        description: o.details || 'No additional clinical remarks.',
        icon: Sparkles,
        color: o.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800',
      });
    });

  // Tasks
  tasks
    .filter((t) => t.animalId === animal.id)
    .forEach((t) => {
      events.push({
        id: t.id,
        date: t.dueDate,
        type: 'TASK',
        title: `Task: ${t.title}`,
        description: `Assigned to ${t.assigneeName}. Status: ${t.status}.`,
        icon: CheckSquare,
        color: 'bg-stone-100 text-stone-700',
      });
    });

  // Sort descending by date
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredEvents = filterType === 'ALL'
    ? events
    : events.filter((e) => e.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-800" />
              <span>Full Historical Animal Event Ledger</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Comprehensive chronological ledger of life events, clinical observations, transfers, and vitals
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-500 font-semibold">Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
            >
              <option value="ALL">All Event Types</option>
              <option value="DAILY_LOG">Daily Vitals Checks</option>
              <option value="OBSERVATION">Clinical Observations</option>
              <option value="MOVEMENT">Movement Transfers</option>
              <option value="TASK">Tasks & Treatments</option>
            </select>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {filteredEvents.map((evt) => {
            const Icon = evt.icon;
            return (
              <div key={evt.id} className="relative group">
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${evt.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span className="text-sm">{evt.title}</span>
                    <span className="font-mono text-[11px] text-stone-500 font-normal">{evt.date}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-medium">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
