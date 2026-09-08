'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Baby,
  GitBranch,
} from 'lucide-react';

export default function BovineReproCalendarPage() {
  const {
    session,
    farms,
    animals,
    breedingEvents,
    pregnancies,
    pregnancyChecks,
  } = useBovine();

  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  // Build unified calendar items
  const calendarItems: Array<{
    id: string;
    date: string;
    title: string;
    subtitle: string;
    type: 'BREEDING' | 'PREG_CHECK' | 'DRY_OFF' | 'CALVING';
    animalId: string;
    animalName: string;
    badgeColor: string;
  }> = [];

  // Inseminations
  breedingEvents.forEach((b) => {
    const anim = animals.find((a) => a.id === (b.animalId || b.femaleAnimalId));
    calendarItems.push({
      id: `cal-b-${b.id}`,
      date: b.breedingDate || b.eventAt?.split('T')[0] || '',
      title: `AI: ${anim?.name || 'Animal'}`,
      subtitle: `Bred to ${b.sireName || 'Sire'} (${(b.breedingType || b.eventType || 'AI').replace(/_/g, ' ')})`,
      type: 'BREEDING',
      animalId: b.animalId || b.femaleAnimalId || '',
      animalName: anim?.name || 'Unknown',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    });
  });

  // Pregnancy Checks
  pregnancyChecks.forEach((c) => {
    const anim = animals.find((a) => a.id === c.animalId);
    calendarItems.push({
      id: `cal-pc-${c.id}`,
      date: c.checkDate || c.checkedAt?.split('T')[0] || '',
      title: `Preg Check: ${anim?.name || 'Animal'}`,
      subtitle: `${c.result.replace(/_/g, ' ')} via ${c.method}`,
      type: 'PREG_CHECK',
      animalId: c.animalId,
      animalName: anim?.name || 'Unknown',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    });
  });

  // Expected Calvings & Dry-offs from Pregnancies
  pregnancies.forEach((p) => {
    const dam = animals.find((a) => a.id === p.damId);

    // Expected Calving
    calendarItems.push({
      id: `cal-exp-${p.id}`,
      date: p.expectedCalvingDate || '',
      title: `Expected Calving: ${dam?.name || 'Dam'}`,
      subtitle: `Due date (conceived ${p.conceptionDate || '—'})`,
      type: 'CALVING',
      animalId: p.damId,
      animalName: dam?.name || 'Unknown',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    });

    // Dry-off date (conception + 220 days)
    const concDate = new Date(p.conceptionDate || '2026-01-01');
    const dryOffDate = new Date(concDate.getTime() + 220 * 86400000).toISOString().split('T')[0];
    calendarItems.push({
      id: `cal-dry-${p.id}`,
      date: dryOffDate,
      title: `Dry-Off Due: ${dam?.name || 'Dam'}`,
      subtitle: `Begin 60-day dry period before calving`,
      type: 'DRY_OFF',
      animalId: p.damId,
      animalName: dam?.name || 'Unknown',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    });
  });

  // Sort chronological
  calendarItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredItems = calendarItems.filter((item) => {
    if (eventTypeFilter !== 'ALL' && item.type !== eventTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <Link href="/bovine/reproduction" className="hover:text-emerald-800 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Reproduction Hub</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Timeline & Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Reproduction Schedule & Milestones</h1>
          <p className="text-xs text-stone-500 mt-1">
            Chronological calendar of standing heats, inseminations, pregnancy exams, dry-offs, and expected births.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          >
            <option value="ALL">All Event Milestones</option>
            <option value="BREEDING">Inseminations / AI</option>
            <option value="PREG_CHECK">Pregnancy Checks</option>
            <option value="DRY_OFF">Dry-Off Milestones</option>
            <option value="CALVING">Expected Calvings</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
        <div className="relative pl-6 border-l-2 border-stone-100 space-y-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                  item.type === 'CALVING'
                    ? 'bg-blue-600 ring-blue-100'
                    : item.type === 'DRY_OFF'
                    ? 'bg-amber-500 ring-amber-100'
                    : item.type === 'PREG_CHECK'
                    ? 'bg-purple-600 ring-purple-100'
                    : 'bg-emerald-600 ring-emerald-100'
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.badgeColor}`}>
                    {item.type.replace(/_/g, ' ')}
                  </span>
                  <Link
                    href={`/bovine/animals/${item.animalId}/reproduction`}
                    className="font-bold text-stone-900 text-sm hover:text-emerald-800"
                  >
                    {item.title}
                  </Link>
                </div>

                <span className="font-mono text-xs font-semibold text-stone-600">
                  {item.date}
                </span>
              </div>

              <p className="text-xs text-stone-500">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
