'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Baby,
  GitBranch,
  Plus,
} from 'lucide-react';
import AnimalMediaEmbeddedWidget from '@/components/bovine/media/AnimalMediaEmbeddedWidget';

interface PageProps {
  params: Promise<{ animalId: string }>;
}

export default function Animal360ReproductionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const {
    animals,
    breedingCycles,
    breedingEvents,
    pregnancyChecks,
    pregnancies,
    calvingEvents,
    calvingOffspring,
  } = useBovine();

  const animal = animals.find((a) => a.id === animalId);
  const myCycles = breedingCycles.filter((c) => c.animalId === animalId);
  const myBreedings = breedingEvents.filter((b) => b.animalId === animalId);
  const myChecks = pregnancyChecks.filter((c) => c.animalId === animalId);
  const myPregnancies = pregnancies.filter((p) => p.damId === animalId);
  const myCalvings = calvingEvents.filter((c) => c.damId === animalId);

  const activePregnancy = myPregnancies.find((p) => p.status === 'CONFIRMED');

  if (!animal) return null;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
            <Heart className="w-4 h-4 text-emerald-700" />
            <span>Reproduction & Progeny Card</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900">Reproductive Lifecycle: {animal.name}</h2>
          <p className="text-xs text-stone-500">
            Estrus cycles, artificial inseminations, pregnancy status, and maternal parity history.
          </p>
        </div>

        <Link
          href="/bovine/reproduction/breeding-events"
          className="inline-flex items-center px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Log Insemination
        </Link>
      </div>

      {/* Active Pregnancy Card (if pregnant) */}
      {activePregnancy && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 text-sm flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-700" />
              Active Gestation Confirmed
            </span>
            <span className="font-mono text-xs font-bold text-emerald-800">
              Due: {activePregnancy.expectedCalvingDate}
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            Conception recorded on <strong className="font-mono">{activePregnancy.conceptionDate}</strong>. Expected calving in maternity stall.
          </p>
        </div>
      )}

      {/* Inseminations & AI History */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-emerald-800" />
          <span>Insemination & Breeding History ({myBreedings.length})</span>
        </h3>

        {myBreedings.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-4">No inseminations recorded for this animal.</p>
        ) : (
          <div className="divide-y divide-stone-100 text-xs">
            {myBreedings.map((b) => (
              <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">
                    Bred to: <strong className="text-emerald-900">{b.sireName}</strong>{' '}
                    <span className="font-mono text-stone-400 text-[11px]">({b.sireIdentifier})</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {(b.breedingType || b.eventType || 'ARTIFICIAL_INSEMINATION').replace(/_/g, ' ')} • Straw Lot: {b.semenStrawBatchCode || 'Standard'} • By {b.technicianName}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-stone-800">{b.breedingDate}</div>
                  <div className="text-[10px] text-stone-400">Exp: {b.expectedCalvingDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calvings & Offspring Delivered */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <Baby className="w-4 h-4 text-emerald-800" />
          <span>Maternal Calvings & Registered Offspring ({myCalvings.length})</span>
        </h3>

        {myCalvings.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-4">No calving deliveries on record (Virgin heifer / non-calved).</p>
        ) : (
          <div className="space-y-3">
            {myCalvings.map((c) => {
              const offspring = calvingOffspring.filter((o) => o.calvingEventId === c.id);

              return (
                <div key={c.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">
                      Delivered on {c.calvingDate} ({c.birthType})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      Ease: {(c.calvingEase || c.ease || 'NORMAL').replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-stone-200/60">
                    {offspring.map((off) => {
                      const calfAnim = off.calfAnimalId ? animals.find((a) => a.id === off.calfAnimalId) : null;
                      return (
                        <div key={off.id} className="flex items-center justify-between text-[11px]">
                          <span>
                            {calfAnim ? (
                              <Link
                                href={`/bovine/animals/${calfAnim.id}`}
                                className="font-bold text-emerald-800 hover:underline"
                              >
                                {calfAnim.name} ({calfAnim.primaryIdentifier})
                              </Link>
                            ) : (
                              <span>Calf #{off.birthOrder}</span>
                            )}
                            <span className="text-stone-500"> • {off.sex} • {off.birthWeightKg || 38}kg</span>
                          </span>

                          <span className="font-semibold text-stone-700 uppercase text-[10px]">
                            {off.birthOutcome}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reproductive Ultrasound & Embryo/Semen Media */}
      <AnimalMediaEmbeddedWidget
        animalId={animal.id}
        categoryFilter={['REPRODUCTION', 'ULTRASOUND', 'SEMEN_ANALYSIS', 'CALVING']}
        title="Reproductive Diagnostics & Ultrasound Imaging"
        description="Fetal sonograms, ovarian follicle scans, CASA semen motility assays, and calving records."
        galleryPath={`/bovine/animals/${animal.id}/media`}
      />
    </div>
  );
}
