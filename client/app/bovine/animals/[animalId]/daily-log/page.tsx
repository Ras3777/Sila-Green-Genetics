'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  CalendarCheck2,
  Plus,
  Thermometer,
  Activity,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

type AppetiteLevel = 'NORMAL' | 'REDUCED' | 'OFF_FEED' | 'EXCESSIVE';
type ActivityLevel = 'NORMAL' | 'LETHARGIC' | 'RESTLESS' | 'HYPERACTIVE';

export default function AnimalDailyLogsPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, dailyLogs, addDailyLog } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const logs = dailyLogs.filter((l) => l.animalId === animalId);

  // New Log form
  const [logDate, setLogDate] = useState('2026-09-04');
  const [temperatureC, setTemperatureC] = useState<number>(38.6);
  const [appetite, setAppetite] = useState<AppetiteLevel>('NORMAL');
  const [activity, setActivity] = useState<ActivityLevel>('NORMAL');
  const [lamenessScore, setLamenessScore] = useState<number>(1);
  const [bcs, setBcs] = useState<number>(3.25);
  const [ruminationMinutes, setRuminationMinutes] = useState<number>(470);
  const [weightKg, setWeightKg] = useState<number>(625);
  const [notes, setNotes] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!animal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addDailyLog({
      animalId: animal.id,
      date: logDate,
      operationalStatus: isAbnormal || temperatureC > 39.3 ? 'SICK' : 'HEALTHY',
      temperatureC: Number(temperatureC),
      appetite,
      activity,
      lamenessScore: Number(lamenessScore),
      bcs: Number(bcs),
      ruminationMinutes: Number(ruminationMinutes),
      weightKg: Number(weightKg),
      loggedBy: 'Dr. Sarah Lin (DVM)',
      notes: notes.trim() || undefined,
      requiresAttention: isAbnormal || temperatureC > 39.3,
    });

    setSuccess(true);
    setNotes('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Historical Logs */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <CalendarCheck2 className="w-4 h-4 text-emerald-800" />
          <span>Daily Health & Vital History</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Temp (°C)</th>
                <th className="p-3">Appetite</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Lameness</th>
                <th className="p-3">Rumination</th>
                <th className="p-3">BCS</th>
                <th className="p-3">Observer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50/70">
                  <td className="p-3 font-semibold text-stone-900">{l.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        l.operationalStatus === 'NORMAL'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {l.operationalStatus}
                    </span>
                  </td>
                  <td className={`p-3 font-bold ${(l.temperature || 38.5) > 39.3 ? 'text-rose-600' : 'text-stone-900'}`}>
                    {l.temperature || 38.5}°C
                  </td>
                  <td className="p-3">{l.appetiteScore ? `${l.appetiteScore}/5` : 'Normal'}</td>
                  <td className="p-3">{l.activityScore ? `${l.activityScore}/5` : 'Normal'}</td>
                  <td className="p-3">{l.lamenessScore || 1} / 5</td>
                  <td className="p-3">{l.ruminationMinutes || '—'} min</td>
                  <td className="p-3">{l.bcs || 3.0}</td>
                  <td className="p-3 text-stone-500">{l.loggedBy}</td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-stone-400">
                    No daily logs recorded yet for this animal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Log Entry Form */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
          Record Daily Clinical Vitals
        </h2>

        {success && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Daily vital entry saved and recorded on the animal ledger.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Check Date</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rectal Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              value={temperatureC}
              onChange={(e) => setTemperatureC(parseFloat(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Appetite</label>
            <select
              value={appetite}
              onChange={(e) => setAppetite(e.target.value as AppetiteLevel)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="NORMAL">Normal Appetite</option>
              <option value="REDUCED">Reduced Intake</option>
              <option value="ANOREXIC">Anorexic (Off Feed)</option>
              <option value="VORACIOUS">Voracious</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="NORMAL">Normal Mobility</option>
              <option value="DEPRESSED">Depressed / Lethargic</option>
              <option value="HYPERACTIVE">Hyperactive / In Heat</option>
              <option value="RECUMBENT">Recumbent (Downer)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Lameness Score (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={lamenessScore}
              onChange={(e) => setLamenessScore(parseInt(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rumination (Mins)</label>
            <input
              type="number"
              value={ruminationMinutes}
              onChange={(e) => setRuminationMinutes(parseInt(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Clinical Notes</label>
            <input
              type="text"
              placeholder="e.g. Mild nasal discharge, clear lung sounds"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="sm:col-span-3 flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="chk-abnormal"
              checked={isAbnormal}
              onChange={(e) => setIsAbnormal(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700"
            />
            <label htmlFor="chk-abnormal" className="text-xs font-semibold text-stone-800">
              Flag as abnormal (Triggers veterinary attention and manager notification)
            </label>
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              id="btn-save-daily-vitals"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Submit Vital Check
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
