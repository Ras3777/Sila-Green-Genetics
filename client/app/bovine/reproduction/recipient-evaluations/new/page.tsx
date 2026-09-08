'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
  Check,
  Activity,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useBovine } from '@/lib/bovine-store';

export default function NewRecipientEvaluationPage() {
  const router = useRouter();
  const { animals, farms, addRecipientEvaluation } = useBovine();

  const femaleAnimals = animals.filter((a) => a.sex === 'FEMALE');

  // Form State
  // Section A: Recipient Identity
  const [cowAnimalId, setCowAnimalId] = useState(femaleAnimals[0]?.id || '');
  const [earTag, setEarTag] = useState(femaleAnimals[0]?.primaryIdentifier || 'REC-104');
  const [farmId, setFarmId] = useState(femaleAnimals[0]?.farmId || farms[0]?.id || '');
  const [breed, setBreed] = useState(femaleAnimals[0]?.breed || 'Nelore x Angus F1');

  // Section B: Synchronization & Estrus
  const [syncProtocol, setSyncProtocol] = useState('7-Day CIDR + PGF2a');
  const [estrusScore, setEstrusScore] = useState(4);
  const [standingHeat, setStandingHeat] = useState(true);
  const [cervicalMucus, setCervicalMucus] = useState('Clear, viscous, abundant');
  const [uterineTone, setUterineTone] = useState('Good / Turgid');

  // Section C: Pregnancy Evaluation
  const [clQuality, setClQuality] = useState('Grade 1 (Excellent / >20mm)');
  const [clSide, setClSide] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [clDiameterMm, setClDiameterMm] = useState('22.5');
  const [uterineFluid, setUterineFluid] = useState('None (Clean)');
  const [gestationStatus, setGestationStatus] = useState<'OPEN' | 'CONFIRMED_PREGNANT' | 'SUSPECT'>('OPEN');
  const [lastCheckDate, setLastCheckDate] = useState(new Date().toISOString().split('T')[0]);

  // Section D: Calf Outcome
  const [calfOutcome, setCalfOutcome] = useState('Strong maternal instinct, calved unassisted previously, high milk yield.');

  // Section E: Health & Structural Evaluation
  const [bcs, setBcs] = useState(6.0);
  const [tickCount, setTickCount] = useState('Low / Parasite-Free');
  const [headEyes, setHeadEyes] = useState('Alert, clear eyes, feminine head');
  const [coatColor, setCoatColor] = useState('Smooth coat, clean dermis');
  const [muscleDevelopment, setMuscleDevelopment] = useState('Moderate, ideal for maternal surrogate');
  const [umbilicalCondition, setUmbilicalCondition] = useState('Normal, healthy navel');
  const [bodyStructure, setBodyStructure] = useState('Deep rib, wide pelvic canal, sound hooves');
  const [generalConformationScore, setGeneralConformationScore] = useState(4);
  const [earTagVerified, setEarTagVerified] = useState(true);

  // Evaluator & Status
  const [evaluator, setEvaluator] = useState('Dr. Helena Rocha (DVM / Theriogenologist)');
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split('T')[0]);
  const [overallStatus, setOverallStatus] = useState<'APPROVED' | 'CONDITIONAL' | 'REJECTED'>('APPROVED');
  const [verified, setVerified] = useState(true);
  const [notes, setNotes] = useState('Excellent recipient candidate with robust functional corpus luteum.');

  const handleCowChange = (id: string) => {
    setCowAnimalId(id);
    const selected = animals.find((a) => a.id === id);
    if (selected) {
      setEarTag(selected.primaryIdentifier || selected.internalId);
      setFarmId(selected.farmId);
      if (selected.breed) setBreed(selected.breed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addRecipientEvaluation({
      cowAnimalId,
      earTag,
      farmId,
      breed,
      bcs,
      estrusScore,
      clQuality: `${clQuality} (${clSide} ovary, ${clDiameterMm}mm)`,
      gestationStatus,
      lastPregnancyCheckDate: lastCheckDate,
      calfOutcome,
      healthAndStructure: {
        tickCount,
        headEyes,
        bodyTypeBcs: bcs,
        coatColor,
        muscleDevelopment,
        umbilicalCondition,
        bodyStructure,
        generalConformationScore,
        earTagVerified,
      },
      verified,
      evaluator,
      evaluationDate,
      overallStatus,
      notes: notes || undefined,
    });

    router.push('/bovine/reproduction/recipient-evaluations');
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
        <span className="font-semibold text-stone-900">New Recipient Evaluation</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Clinical Screening
          </span>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            New Recipient Cow Evaluation Scorecard
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Conduct standardized pre-transfer reproductive, structural, and maternal capability audits for embryo surrogates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={overallStatus}
            onChange={(e) => setOverallStatus(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs rounded-xl px-3 py-2"
          >
            <option value="APPROVED">ET APPROVED</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A: Recipient Identity */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-700" />
            <span>Section A: Recipient Identity &amp; Placement</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Candidate Cow *
              </label>
              <select
                value={cowAnimalId}
                onChange={(e) => handleCowChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              >
                {femaleAnimals.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.primaryIdentifier || f.internalId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ear Tag / Identifier *
              </label>
              <input
                type="text"
                value={earTag}
                onChange={(e) => setEarTag(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farm / Facility
              </label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Breed / Cross
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section B: Synchronization & Estrus */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <span>Section B: Synchronization &amp; Estrus Responsiveness</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sync Protocol
              </label>
              <input
                type="text"
                value={syncProtocol}
                onChange={(e) => setSyncProtocol(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estrus Expression Score (1-5)
              </label>
              <select
                value={estrusScore}
                onChange={(e) => setEstrusScore(parseInt(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              >
                <option value={5}>5 - Vigorous Standing Heat</option>
                <option value={4}>4 - Distinct Estrual Behavior</option>
                <option value={3}>3 - Moderate Signs</option>
                <option value={2}>2 - Weak / Marginal Heat</option>
                <option value={1}>1 - Anestrus / Unresponsive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cervical Mucus Discharge
              </label>
              <input
                type="text"
                value={cervicalMucus}
                onChange={(e) => setCervicalMucus(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Uterine Tone &amp; Edema
              </label>
              <input
                type="text"
                value={uterineTone}
                onChange={(e) => setUterineTone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section C: Pregnancy & Ovarian Evaluation */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Section C: Ovarian &amp; Corpus Luteum (CL) Evaluation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                CL Morphological Quality
              </label>
              <select
                value={clQuality}
                onChange={(e) => setClQuality(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="Grade 1 (Excellent / >20mm)">Grade 1 (Excellent / &gt;20mm)</option>
                <option value="Grade 2 (Good / 16-20mm)">Grade 2 (Good / 16-20mm)</option>
                <option value="Grade 3 (Marginal / <16mm)">Grade 3 (Marginal / &lt;16mm)</option>
                <option value="Cavitary CL">Cavitary CL (Fluid-filled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                CL Ovary Side
              </label>
              <select
                value={clSide}
                onChange={(e) => setClSide(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              >
                <option value="RIGHT">Right Ovary</option>
                <option value="LEFT">Left Ovary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                CL Diameter (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={clDiameterMm}
                onChange={(e) => setClDiameterMm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gestation Status
              </label>
              <select
                value={gestationStatus}
                onChange={(e) => setGestationStatus(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
              >
                <option value="OPEN">Open (Ready for ET Transfer)</option>
                <option value="CONFIRMED_PREGNANT">Confirmed Pregnant</option>
                <option value="SUSPECT">Suspect / Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section D: Calf Outcome */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>Section D: Maternal &amp; Calf Outcome Track Record</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Historical Calving, Colostrum Quality &amp; Nursing Instinct
            </label>
            <textarea
              value={calfOutcome}
              onChange={(e) => setCalfOutcome(e.target.value)}
              rows={2}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>
        </div>

        {/* Section E: Health & Structural Conformation */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>Section E: Health &amp; Structural Phenotypic Scoring</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Body Condition Score (BCS 1-9) *
              </label>
              <input
                type="number"
                step="0.25"
                min="1"
                max="9"
                value={bcs}
                onChange={(e) => setBcs(parseFloat(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tick / Ectoparasite Burden
              </label>
              <input
                type="text"
                value={tickCount}
                onChange={(e) => setTickCount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Head &amp; Eyes Conformation
              </label>
              <input
                type="text"
                value={headEyes}
                onChange={(e) => setHeadEyes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pelvic &amp; Body Structure
              </label>
              <input
                type="text"
                value={bodyStructure}
                onChange={(e) => setBodyStructure(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Umbilical / Navel Fold
              </label>
              <input
                type="text"
                value={umbilicalCondition}
                onChange={(e) => setUmbilicalCondition(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                General Conformation Score (1-5)
              </label>
              <select
                value={generalConformationScore}
                onChange={(e) => setGeneralConformationScore(parseInt(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              >
                <option value={5}>5 - Outstanding</option>
                <option value={4}>4 - Superior Maternal</option>
                <option value={3}>3 - Acceptable Standard</option>
                <option value={2}>2 - Marginal</option>
                <option value={1}>1 - Unsuitable</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="cb-ear-tag-verified"
              checked={earTagVerified}
              onChange={(e) => setEarTagVerified(e.target.checked)}
              className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 cursor-pointer"
            />
            <label htmlFor="cb-ear-tag-verified" className="text-xs text-stone-700 font-semibold cursor-pointer">
              Physically verified visual ear tag matches registry record
            </label>
          </div>
        </div>

        {/* Audit Sign-Off */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <span>Auditor Sign-Off &amp; Qualification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Licensed Evaluator / Vet *
              </label>
              <input
                type="text"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Evaluation Date *
              </label>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Final Recommendation
              </label>
              <select
                value={overallStatus}
                onChange={(e) => setOverallStatus(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
              >
                <option value="APPROVED">APPROVED FOR TRANSFER</option>
                <option value="CONDITIONAL">CONDITIONAL (Follow-up)</option>
                <option value="REJECTED">REJECTED (Not Suitable)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical Evaluation Summary Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <Link
            href="/bovine/reproduction/recipient-evaluations"
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Recipient Evaluation</span>
          </button>
        </div>
      </form>
    </div>
  );
}
