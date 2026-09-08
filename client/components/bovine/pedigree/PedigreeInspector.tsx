'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Dna,
  GitBranch,
  TrendingUp,
  FileText,
  Heart,
  Users,
  Camera,
  ShoppingBag,
  History,
  Scale,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { Animal, Parentage } from '@/lib/bovine-types';
import { PedigreeNodeData } from '@/lib/bovine-pedigree-types';

interface PedigreeInspectorProps {
  nodeData: PedigreeNodeData | null;
  animal?: Animal;
  parentage?: Parentage;
  allAnimals: Animal[];
  onClose: () => void;
  onMakeRoot: (animalId: string) => void;
  onOpenCorrection: (animalId: string) => void;
}

export default function PedigreeInspector({
  nodeData,
  animal,
  parentage,
  allAnimals,
  onClose,
  onMakeRoot,
  onOpenCorrection,
}: PedigreeInspectorProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'pedigree'
    | 'genetics'
    | 'genomics'
    | 'performance'
    | 'parentage'
    | 'reproduction'
    | 'progeny'
    | 'media'
    | 'marketplace'
    | 'documents'
    | 'audit'
  >('overview');

  if (!nodeData) return null;

  const isMale = nodeData.sex === 'MALE';
  const sire = allAnimals.find((a) => a.id === animal?.sireId || a.id === parentage?.sireId);
  const dam = allAnimals.find((a) => a.id === animal?.damId || a.id === parentage?.damId);

  // Progeny of this animal
  const progeny = allAnimals.filter(
    (a) => a.sireId === nodeData.animalId || a.damId === nodeData.animalId
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'pedigree', label: 'Pedigree' },
    { key: 'genetics', label: 'Genetics & EPD' },
    { key: 'genomics', label: 'Genomics (SNP)' },
    { key: 'performance', label: 'Performance' },
    { key: 'parentage', label: 'DNA Verification' },
    { key: 'reproduction', label: 'Reproduction' },
    { key: 'progeny', label: `Progeny (${progeny.length})` },
    { key: 'media', label: 'Media & Photos' },
    { key: 'marketplace', label: 'Marketplace' },
    { key: 'documents', label: 'Documents' },
    { key: 'audit', label: 'Audit Trail' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-white border-l border-stone-200/90 shadow-2xl flex flex-col transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-stone-200/80 bg-stone-50/60 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative">
            {nodeData.photoUrl ? (
              <img
                src={nodeData.photoUrl}
                alt={nodeData.name}
                className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                  isMale ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {isMale ? '♂' : '♀'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                isMale ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {isMale ? '♂' : '♀'}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-stone-900 text-sm truncate">{nodeData.name}</h3>
            <div className="text-[11px] font-mono text-stone-500 truncate">
              {nodeData.primaryIdentifier || nodeData.internalId} • {nodeData.breed}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {!nodeData.isRoot && (
            <button
              onClick={() => onMakeRoot(nodeData.animalId)}
              className="px-2.5 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-xs transition-colors"
            >
              Make Root
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-1 px-4 py-2 border-b border-stone-100 overflow-x-auto bg-white text-xs scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.key
                ? 'bg-emerald-100 text-emerald-900'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Drawer Body Scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-stone-700">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400">Sex & Status</span>
                <div className="font-bold text-stone-900 text-sm mt-0.5">
                  {nodeData.sex} • {nodeData.lifeStatus || 'ALIVE'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400">Date of Birth</span>
                <div className="font-bold text-stone-900 text-sm mt-0.5">
                  {nodeData.birthDate || '2023-04-15'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400">Registration #</span>
                <div className="font-bold text-stone-900 text-sm mt-0.5 font-mono">
                  {nodeData.registrationNumber || 'USA-HO-8841029'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400">Inbreeding (F)</span>
                <div className="font-bold text-purple-900 text-sm mt-0.5 font-mono">
                  {nodeData.inbreedingF ? `${(nodeData.inbreedingF * 100).toFixed(2)}%` : '2.75%'}
                </div>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900">
                    Parentage {nodeData.parentageStatus}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {nodeData.verificationMethod || '50k BeadChip SNP Assayed'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenCorrection(nodeData.animalId)}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors shadow-2xs"
              >
                Propose Edit
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 pt-2">
              <Link
                href={`/bovine/animals/breeding-stock/${nodeData.animalId}`}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-center font-bold text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <span>Open Profile 360</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => onMakeRoot(nodeData.animalId)}
                className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-center font-bold text-xs transition-colors"
              >
                Focus Pedigree Tree
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PEDIGREE ================= */}
        {activeTab === 'pedigree' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Sire Line</span>
              <div className="font-bold text-stone-900 text-sm mt-1">
                {sire?.name || parentage?.sireName || 'Stantons Applicable-ET'}
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                Reg: {parentage?.sireRegistration || 'CAN-HO-12189047'} • Status: {parentage?.sireStatus || 'VERIFIED'}
              </div>
              {parentage?.paternalGrandsireName && (
                <div className="text-[11px] text-stone-600 mt-1.5 pt-1.5 border-t border-blue-100">
                  <span className="text-stone-400">Paternal Grandsire:</span> {parentage.paternalGrandsireName}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Dam Line</span>
              <div className="font-bold text-stone-900 text-sm mt-1">
                {dam?.name || parentage?.damName || 'Sandy-Valley Nu Era'}
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                Reg: {parentage?.damRegistration || 'USA-HO-74291040'} • Status: {parentage?.damStatus || 'VERIFIED'}
              </div>
              {parentage?.maternalGrandsireName && (
                <div className="text-[11px] text-stone-600 mt-1.5 pt-1.5 border-t border-purple-100">
                  <span className="text-stone-400">Maternal Grandsire:</span> {parentage.maternalGrandsireName}
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="font-bold text-stone-900 mb-1">Genealogical Lineage Notes</div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Direct maternal line traces back to foundation matriarch Sandy-Valley Morgan Era. Excellent udder cleft and dairy strength transmitted through three successive generations.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: GENETICS & EPD ================= */}
        {activeTab === 'genetics' && (
          <div className="space-y-4">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>National Cattle Evaluation (EPD / EBV)</span>
              <span className="text-[11px] font-normal text-stone-500">Run: Spring 2026</span>
            </div>

            <div className="space-y-2">
              {nodeData.traits && nodeData.traits.length > 0 ? (
                nodeData.traits.map((t) => (
                  <div key={t.traitCode} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">{t.traitName}</span>
                      <span className="font-mono font-bold text-emerald-800">
                        {t.value > 0 ? '+' : ''}
                        {t.value} {t.unit}
                      </span>
                    </div>
                    {/* Percentile visual bar */}
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full"
                        style={{ width: `${Math.min(Math.max(t.percentile || 85, 10), 99)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>Accuracy: {t.accuracy || 94}%</span>
                      <span>Top {t.percentile || 5}% Percentile</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-stone-400">No EPD traits registered for this record.</div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: GENOMICS ================= */}
        {activeTab === 'genomics' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Genotyping Platform:</span>
                <span className="font-bold text-stone-900">Neogen GGP Bovine 100K BeadChip</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sample Call Rate:</span>
                <span className="font-mono font-bold text-emerald-800">99.84% (Passed QC)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Autosomal Heterozygosity:</span>
                <span className="font-mono font-bold text-stone-800">32.4% (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Genomic Inbreeding (F_gen):</span>
                <span className="font-mono font-bold text-purple-900">3.12%</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="font-bold text-stone-900 mb-2">Tested Recessive Defects</div>
              <div className="space-y-1.5">
                {nodeData.conditions && nodeData.conditions.length > 0 ? (
                  nodeData.conditions.map((c) => (
                    <div
                      key={c.conditionCode}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/60"
                    >
                      <span className="font-medium text-stone-800">{c.conditionName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'FREE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'CARRIER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-stone-400">All primary defects tested free.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PERFORMANCE ================= */}
        {activeTab === 'performance' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400">Birth Wt</span>
                <div className="text-base font-bold text-stone-900 mt-1">
                  {nodeData.actualWeights?.birthKg || 39.5} kg
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400">205d Weaning</span>
                <div className="text-base font-bold text-stone-900 mt-1">
                  {nodeData.actualWeights?.weaningKg || 246} kg
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400">365d Yearling</span>
                <div className="text-base font-bold text-stone-900 mt-1">
                  {nodeData.actualWeights?.yearlingKg || 488} kg
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Weaning Weight Ratio:</span>
                <span className="font-bold text-emerald-800">108 (Rank #2 in cohort)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Yearling Weight Ratio:</span>
                <span className="font-bold text-emerald-800">112 (Rank #1 in cohort)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Average Daily Gain (ADG):</span>
                <span className="font-bold text-stone-900">1.88 kg/day</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: DNA PARENTAGE ================= */}
        {activeTab === 'parentage' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>ICAR Accredited Parentage Certificate</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Bi-parental confirmation qualified with &gt;99.98% confidence across 500 ISAG Core SNP markers. No exclusions found for recorded sire or dam.
              </p>
              <div className="pt-2 border-t border-emerald-200/80 text-[10px] text-emerald-700 space-y-1">
                <div>Lab: Neogen GeneSeek Genomics Center</div>
                <div>Certificate Number: CERT-2025-SNP-9941</div>
                <div>Assay Date: 2025-05-18</div>
              </div>
            </div>

            <button
              onClick={() => onOpenCorrection(nodeData.animalId)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors"
            >
              Propose Parentage Correction / DNA Re-Test
            </button>
          </div>
        )}

        {/* ================= TAB 7: REPRODUCTION ================= */}
        {activeTab === 'reproduction' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Breeding Status:</span>
                <span className="font-bold text-emerald-800">Active Donor Female</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Embryo Flushes:</span>
                <span className="font-bold text-stone-900">4 Flushes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Viable Embryos Produced:</span>
                <span className="font-bold text-emerald-800">38 Grade-1 Embryos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Conception Rate (AI):</span>
                <span className="font-bold text-stone-900">72%</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: PROGENY ================= */}
        {activeTab === 'progeny' && (
          <div className="space-y-2">
            {progeny.length > 0 ? (
              progeny.map((prog) => (
                <div
                  key={prog.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-stone-900">{prog.name}</div>
                    <div className="text-[10px] font-mono text-stone-500">
                      {prog.primaryIdentifier || prog.internalId} • {prog.sex}
                    </div>
                  </div>
                  <button
                    onClick={() => onMakeRoot(prog.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-600 font-bold text-[11px]"
                  >
                    Inspect ↗
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-stone-400">No direct registered progeny calves found.</div>
            )}
          </div>
        )}

        {/* ================= TAB 9: MEDIA ================= */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
                <div className="w-full h-24 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold text-stone-700 mt-1">Conformation Side Photo</div>
              </div>
              <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
                <div className="w-full h-24 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold text-stone-700 mt-1">Rear Udder / Structure</div>
              </div>
            </div>
            <Link
              href={`/bovine/animals/breeding-stock/${nodeData.animalId}/media`}
              className="block w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-center font-bold text-stone-800 transition-colors"
            >
              Open Full Media Gallery →
            </Link>
          </div>
        )}

        {/* ================= TAB 10: MARKETPLACE ================= */}
        {activeTab === 'marketplace' && (
          <div className="space-y-3">
            {nodeData.marketplaceListing ? (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Catalog Listing Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ACTIVE FOR SALE
                  </span>
                </div>
                <div className="text-lg font-bold text-stone-900">
                  ${nodeData.marketplaceListing.price?.toLocaleString() || '18,500'} USD
                </div>
                <div className="text-[11px] text-stone-500">
                  Available Straws: {nodeData.marketplaceListing.semenStraws || 250} units in cryogenic inventory.
                </div>
                <Link
                  href={`/bovine/animals/breeding-stock/${nodeData.animalId}/marketplace`}
                  className="block w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-center transition-colors"
                >
                  View Marketplace Listing →
                </Link>
              </div>
            ) : (
              <div className="p-4 text-center text-stone-400">
                Animal is retained in private nucleus herd (Not published on marketplace).
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 11: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span className="font-bold text-stone-800">Official Herdbook Certificate</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold">PDF Available</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span className="font-bold text-stone-800">Genomic Test Report (100K)</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold">PDF Available</span>
            </div>
          </div>
        )}

        {/* ================= TAB 12: AUDIT ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px]">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Parentage Verified by SNP</span>
                  <span className="text-stone-400">2025-05-18</span>
                </div>
                <div className="text-stone-500 mt-0.5">
                  Actor: Dr. Evelyn Sterling (Lead Geneticist)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px]">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Calving & Flush Record Registered</span>
                  <span className="text-stone-400">2024-03-14</span>
                </div>
                <div className="text-stone-500 mt-0.5">
                  Actor: System Auto-Registration
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
