'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
  Check,
  Activity,
  Award,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function RecipientEvaluationDetailPage({
  params,
}: {
  params: Promise<{ evaluationId: string }>;
}) {
  const resolvedParams = use(params);
  const evaluationId = resolvedParams.evaluationId;

  const { animals, recipientEvaluations, farms, updateRecipientEvaluation } = useBovine();
  const evaluation = recipientEvaluations.find((e) => e.id === evaluationId);

  if (!evaluation) {
    return (
      <div className="p-8 text-center text-stone-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
        <h2 className="text-lg font-bold text-stone-900">Evaluation Record Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">The requested recipient evaluation does not exist.</p>
        <Link
          href="/bovine/reproduction/recipient-evaluations"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Evaluations Directory
        </Link>
      </div>
    );
  }

  const cow = animals.find((a) => a.id === evaluation.cowAnimalId);
  const farm = farms.find((f) => f.id === evaluation.farmId);

  const toggleVerified = () => {
    updateRecipientEvaluation(evaluation.id, {
      verified: !evaluation.verified,
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/reproduction" className="hover:text-emerald-800">
          Reproduction &amp; AI
        </Link>
        <span>/</span>
        <Link href="/bovine/reproduction/recipient-evaluations" className="hover:text-emerald-800">
          Recipient Evaluations
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Evaluation #{evaluation.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  evaluation.overallStatus === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : evaluation.overallStatus === 'CONDITIONAL'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {evaluation.overallStatus} FOR TRANSFER
              </span>
              {evaluation.verified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Verified Audit
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <span>{cow ? cow.name : 'Recipient Cow'}</span>
              <span className="text-sm font-mono text-stone-400 font-normal">
                (Ear Tag: {evaluation.earTag})
              </span>
            </h1>

            <p className="text-xs text-stone-600">
              Evaluated by <span className="font-semibold text-stone-800">{evaluation.evaluator}</span> on{' '}
              <span className="font-mono">{evaluation.evaluationDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleVerified}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                evaluation.verified
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {evaluation.verified ? 'Revoke Verification' : 'Verify Evaluation'}
            </button>

            {cow && (
              <Link
                href={`/bovine/animals/${cow.id}`}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Animal 360</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Body Condition (BCS)</span>
            <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
              {evaluation.bcs} <span className="text-xs text-stone-400 font-normal">/ 9</span>
            </div>
            <span className="text-[10px] text-emerald-700">Ideal Transfer Range</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Estrus Expression</span>
            <div className="text-base font-bold text-stone-900 mt-0.5">
              {evaluation.estrusScore} <span className="text-xs text-stone-400 font-normal">/ 5</span>
            </div>
            <span className="text-[10px] text-stone-500">Strong standing response</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Corpus Luteum</span>
            <div className="text-xs font-bold text-stone-900 mt-1 truncate" title={evaluation.clQuality}>
              {evaluation.clQuality}
            </div>
            <span className="text-[10px] text-emerald-700">Functional tissue</span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70">
            <span className="text-[10px] font-bold uppercase text-stone-400 block tracking-wider">Gestation Status</span>
            <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono">
              {evaluation.gestationStatus?.replace(/_/g, ' ') || 'OPEN'}
            </div>
            <span className="text-[10px] text-stone-500">Last check: {evaluation.lastPregnancyCheckDate || '—'}</span>
          </div>
        </div>
      </div>

      {/* Sections Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reproductive Evaluation */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-700" />
            <span>Reproductive &amp; Ovarian Findings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
              <span className="text-stone-600">Corpus Luteum Morphology</span>
              <span className="font-bold text-stone-900">{evaluation.clQuality}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
              <span className="text-stone-600">Estrus Score</span>
              <span className="font-bold text-stone-900">{evaluation.estrusScore} / 5</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
              <span className="text-stone-600">Gestation Status</span>
              <span className="font-bold font-mono text-emerald-800">{evaluation.gestationStatus}</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">Calf Outcome Record</span>
              <p className="text-stone-700 leading-relaxed">{evaluation.calfOutcome}</p>
            </div>
          </div>
        </div>

        {/* Structural & Conformation Scoring */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Health &amp; Structural Scoring</span>
          </h3>

          {(() => {
            const hs = evaluation.healthAndStructure || {};
            return (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Body Condition (BCS)</span>
                  <span className="font-bold font-mono text-stone-900">{hs.bodyTypeBcs ?? '—'} / 9</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">General Conformation</span>
                  <span className="font-bold font-mono text-stone-900">
                    Score {hs.generalConformationScore ?? '—'} / 5
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Pelvic / Body Structure</span>
                  <span className="font-medium text-stone-900">{hs.bodyStructure || '—'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Head &amp; Eyes</span>
                  <span className="font-medium text-stone-900">{hs.headEyes || '—'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Parasite Load (Ticks)</span>
                  <span className="font-medium text-stone-900">{hs.tickCount ?? '—'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Ear Tag Verification</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Match</span>
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Clinical Notes */}
      {evaluation.notes && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 text-xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1">
            Veterinarian Notes &amp; Summary
          </span>
          <p className="text-stone-800 leading-relaxed italic">&ldquo;{evaluation.notes}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
