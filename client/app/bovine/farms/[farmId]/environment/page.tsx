'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Sun,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  Activity,
  Compass,
} from 'lucide-react';
import { FarmEnvironmentLog } from '@/lib/bovine-types';

export default function BovineFarmEnvironmentPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { farms, environmentLogs, addFarmEnvironmentLog } = useBovine();
  const farm = farms.find((f) => f.id === farmId);
  const logs = environmentLogs.filter((e) => e.farmId === farmId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('2026-09-04 14:00');
  const [airTempC, setAirTempC] = useState(24.5);
  const [relativeHumidityPct, setRelativeHumidityPct] = useState(55);
  const [thi, setThi] = useState(70);
  const [heatStressRisk, setHeatStressRisk] = useState<'NONE' | 'MILD' | 'MODERATE' | 'SEVERE'>('MILD');
  const [rainfallMm, setRainfallMm] = useState(0);
  const [windSpeedKmh, setWindSpeedKmh] = useState(14);
  const [barnTempC, setBarnTempC] = useState(22.0);
  const [ventilationStatus, setVentilationStatus] = useState<'OPTIMAL' | 'FAIR' | 'POOR'>('OPTIMAL');
  const [beddingScore, setBeddingScore] = useState(4.5);
  const [mudScore, setMudScore] = useState(1.2);
  const [pastureScore, setPastureScore] = useState(4.2);
  const [shadeScore, setShadeScore] = useState(5.0);
  const [waterAvailabilityScore, setWaterAvailabilityScore] = useState(4.8);
  const [source, setSource] = useState<'MANUAL' | 'SENSOR' | 'IMPORTED'>('MANUAL');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!farm) return null;

  // Auto calculate THI when temperature or humidity changes
  // Standard Bovine THI formula: THI = (1.8 * T + 32) - ((0.55 - 0.0055 * RH) * (1.8 * T - 26))
  const handleTempChange = (temp: number, rh: number) => {
    setAirTempC(temp);
    setRelativeHumidityPct(rh);
    const calculatedThi = Math.round((1.8 * temp + 32) - ((0.55 - 0.0055 * rh) * (1.8 * temp - 26)));
    setThi(calculatedThi);

    if (calculatedThi < 68) setHeatStressRisk('NONE');
    else if (calculatedThi < 72) setHeatStressRisk('MILD');
    else if (calculatedThi < 80) setHeatStressRisk('MODERATE');
    else setHeatStressRisk('SEVERE');
  };

  const handleCreateEnvLog = (e: React.FormEvent) => {
    e.preventDefault();

    addFarmEnvironmentLog({
      farmId: farm.id,
      date,
      airTempC: Number(airTempC),
      relativeHumidityPct: Number(relativeHumidityPct),
      thi: Number(thi),
      heatStressRisk,
      rainfallMm: Number(rainfallMm),
      windSpeedKmh: Number(windSpeedKmh),
      barnTempC: Number(barnTempC),
      ventilationStatus,
      beddingScore: Number(beddingScore),
      mudScore: Number(mudScore),
      pastureScore: Number(pastureScore),
      shadeScore: Number(shadeScore),
      waterAvailabilityScore: Number(waterAvailabilityScore),
      source,
    });

    setIsModalOpen(false);
    setSuccessMsg('Environmental reading logged successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Environmental Telemetry &amp; Heat Stress Matrix</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Temperature-Humidity Index (THI), ventilation quality, barn conditions, and pasture wetness scores
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Environment Log</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Environmental Logs Timeline */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-base text-stone-900">{log.date}</span>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                  log.heatStressRisk === 'SEVERE'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : log.heatStressRisk === 'MODERATE'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : log.heatStressRisk === 'MILD'
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  THI {log.thi} • {log.heatStressRisk} Risk
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono text-[10px]">
                  {log.source}
                </span>
              </div>
              <span className="text-stone-400 text-[11px]">Ventilation: {log.ventilationStatus}</span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Ambient Air &amp; Barn</span>
                <div className="text-lg font-bold text-stone-900 mt-0.5">{log.airTempC}°C Air</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{log.barnTempC}°C in Barn</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Humidity &amp; Rain</span>
                <div className="text-lg font-bold text-stone-900 mt-0.5">{log.relativeHumidityPct}% RH</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{log.rainfallMm} mm Rain</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Bedding &amp; Mud</span>
                <div className="text-lg font-bold text-stone-900 mt-0.5">{log.beddingScore} / 5.0</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Mud Score: {log.mudScore} / 5.0</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Pasture &amp; Water</span>
                <div className="text-lg font-bold text-stone-900 mt-0.5">{log.waterAvailabilityScore} / 5.0</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Pasture: {log.pastureScore} / Shade: {log.shadeScore}</div>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs bg-white rounded-3xl border border-stone-200">
            <Sun className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            No environmental sensor readings logged for this farm station.
          </div>
        )}
      </div>

      {/* Record Environment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
          <form
            onSubmit={handleCreateEnvLog}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Record Environmental Telemetry Reading</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date &amp; Time</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ambient Air Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={airTempC}
                  onChange={(e) => handleTempChange(parseFloat(e.target.value), relativeHumidityPct)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Relative Humidity (%)</label>
                <input
                  type="number"
                  value={relativeHumidityPct}
                  onChange={(e) => handleTempChange(airTempC, parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            {/* Calculated THI preview */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Calculated THI Index</span>
                <div className="text-xl font-bold text-stone-900 mt-0.5">{thi}</div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                heatStressRisk === 'SEVERE'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : heatStressRisk === 'MODERATE'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {heatStressRisk} Heat Stress Risk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Barn Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={barnTempC}
                  onChange={(e) => setBarnTempC(parseFloat(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ventilation Status</label>
                <select
                  value={ventilationStatus}
                  onChange={(e) => setVentilationStatus(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="OPTIMAL">Optimal (Fans + Curtains Active)</option>
                  <option value="FAIR">Fair (Slight Static Air)</option>
                  <option value="POOR">Poor (Stuffy / High Ammonia)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Reading Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="MANUAL">Manual Reading</option>
                  <option value="SENSOR">IoT Weather Station</option>
                  <option value="IMPORTED">Imported NOAA Feed</option>
                </select>
              </div>
            </div>

            {/* Scores (1-5) */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">Bedding &amp; Facility Scores (1-5)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Bedding Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={beddingScore}
                    onChange={(e) => setBeddingScore(parseFloat(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Mud Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={mudScore}
                    onChange={(e) => setMudScore(parseFloat(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Pasture Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={pastureScore}
                    onChange={(e) => setPastureScore(parseFloat(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Water Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={waterAvailabilityScore}
                    onChange={(e) => setWaterAvailabilityScore(parseFloat(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs"
              >
                Save Environment Reading
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
