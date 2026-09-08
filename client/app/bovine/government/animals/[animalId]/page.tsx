'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  Download,
  Dna,
  Scale,
  Activity,
  Calendar,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Truck,
  HeartPulse,
  Image as ImageIcon,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { useBovine } from '@/lib/bovine-store';
import { Animal } from '@/lib/bovine-types';
import { InstitutionalStatCard } from '@/components/bovine/government/cards/InstitutionalStatCard';

export default function AnimalStatutoryProfilePage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const { animals, farms, identifiers, parentages } = useBovine();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GENOMICS' | 'MOVEMENTS' | 'HEALTH' | 'IMAGES'>('OVERVIEW');

  const animal: Animal = animals.find((a: Animal) => a.id === resolvedParams.animalId) || animals[0];
  const farm = farms.find((f) => f.id === animal.farmId);
  const rfid = identifiers.find((i) => i.animalId === animal.id && i.type === 'RFID')?.value || `982-0000-${animal.internalId.replace('ANIM-', '')}`;

  // Find parentage
  const parentRel = parentages ? parentages[animal.id] : undefined;
  const sire = parentRel?.sireId ? animals.find((a) => a.id === parentRel.sireId) : null;
  const dam = parentRel?.damId ? animals.find((a) => a.id === parentRel.damId) : null;

  // Performance metrics (preserves SilaGenetics)
  const weight = animal.currentWeightKg || animal.birthWeightKg || 420;
  const breedName = animal.breed || 'Boran';
  const adg = animal.adgKg || (breedName.includes('Boran') ? 1.15 : 0.95);
  const indexEfficiency = breedName.includes('Boran') ? 108.4 : 96.2;
  const racialComp = breedName.includes('Boran') ? '100% Boran Indigenous' : '75% Holstein / 25% Boran';

  const handleExportCSV = () => {
    const data = [
      ['Attribute', 'Value'],
      ['Name', animal.name],
      ['National RFID', rfid],
      ['DGR / Internal ID', animal.internalId],
      ['Registration Number', animal.registrationNumber || 'N/A'],
      ['Breed', breedName],
      ['Sex', animal.sex],
      ['Weight (kg)', String(weight)],
      ['Average Daily Gain (kg/d)', String(adg)],
      ['Index Efficiency', String(indexEfficiency)],
      ['Racial Composition', racialComp],
      ['Farm Facility', farm?.name || 'N/A'],
      ['Region', farm?.region || 'N/A'],
      ['Sire', sire?.name || 'Borana Bull ET-091'],
      ['Dam', dam?.name || 'Borana Dam ET-044'],
      ['50K SNP Genotype Status', 'VERIFIED_COMPLIANT'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + data.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `animal_profile_${animal.internalId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/bovine/government/animals"
            className="text-stone-600 hover:text-stone-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Animal Registry</span>
          </Link>
          <span className="text-stone-400">/</span>
          <span className="font-bold text-stone-900">{animal.name}</span>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Statutory Dossier</span>
        </button>
      </div>

      {/* Animal Identity Crest */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono font-bold text-[10px]">
              RFID: {rfid}
            </span>
            <span className="font-mono text-stone-600 text-xs">DGR: {animal.internalId}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              VERIFIED CLEAN
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900 mt-1">
            {animal.name} ({breedName} • {animal.sex})
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
            <span>Facility: <strong className="text-stone-800">{farm?.name} ({farm?.region})</strong></span>
            <span>Registration Date: <strong className="text-stone-800 font-mono">{animal.birthDate || '2023-04-12'}</strong></span>
            <span>Breeding Tier: <strong className="text-stone-800">{animal.classification || animal.useStatus || 'BREEDING_STOCK'}</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Performance KPI Cards (from SilaGenetics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <InstitutionalStatCard
          metricCode="ANIM-WEIGHT"
          label="Certified Live Weight"
          value={`${weight} kg`}
          trend="UP"
          delta="+24 kg"
          domain="PHYSICAL"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANIM-ADG"
          label="Average Daily Gain (ADG)"
          value={`${adg.toFixed(2)} kg/d`}
          trend="UP"
          delta="+0.12 kg/d"
          domain="GROWTH"
          target="1.00 kg/d"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANIM-EFFICIENCY-INDEX"
          label="Feed Efficiency Index"
          value={indexEfficiency.toFixed(1)}
          trend="UP"
          delta="Top 10th percentile"
          domain="EFFICIENCY"
          status="NORMAL"
        />

        <InstitutionalStatCard
          metricCode="ANIM-GENOMIC-CALL"
          label="50K SNP Call Rate"
          value="99.4%"
          trend="STABLE"
          delta="Mendelian clean"
          domain="GENOMICS"
          target="> 98%"
          coveragePct={99.4}
          status="NORMAL"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 text-xs overflow-x-auto">
        {[
          { key: 'OVERVIEW' as const, label: 'Overview & Genealogy', icon: Layers },
          { key: 'GENOMICS' as const, label: '50K SNP Genomics', icon: Dna },
          { key: 'MOVEMENTS' as const, label: 'Traceability & Transit', icon: Truck },
          { key: 'HEALTH' as const, label: 'Health Passport', icon: HeartPulse },
          { key: 'IMAGES' as const, label: 'Photo Gallery & Documents', icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Physical & Growth Attributes */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center">
              <Scale className="w-4 h-4 mr-1.5 text-emerald-800" /> Physical & Growth Attributes
            </h3>
            <div className="space-y-2 text-xs divide-y divide-stone-100">
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Current Weight:</span>
                <span className="font-mono font-bold text-stone-900">{weight} kg</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Average Daily Gain (ADG):</span>
                <span className="font-mono font-bold text-stone-900">{adg.toFixed(2)} kg/day</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Growth Index Efficiency:</span>
                <span className="font-mono font-bold text-emerald-800">{indexEfficiency.toFixed(1)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Racial Composition:</span>
                <span className="font-medium text-stone-900">{racialComp}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Breeding Type:</span>
                <span className="font-medium text-stone-900">Artificial Insemination (AI Core)</span>
              </div>
            </div>
          </div>

          {/* Genealogy & Parentage */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center">
              <Dna className="w-4 h-4 mr-1.5 text-emerald-800" /> Verified Genealogy & Lineage
            </h3>
            <div className="space-y-2 text-xs divide-y divide-stone-100">
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Sire (Father):</span>
                <span className="font-bold text-stone-900">{sire?.name || 'Borana Bull ET-091'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Sire Breed:</span>
                <span className="font-medium text-stone-800">{sire?.breed || 'Pure Boran (Nucleus Bull)'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Dam (Mother):</span>
                <span className="font-bold text-stone-900">{dam?.name || 'Borana Dam ET-044'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Dam Breed:</span>
                <span className="font-medium text-stone-800">{dam?.breed || 'Pure Boran Elite Donor'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600">Parentage Verification Method:</span>
                <span className="font-mono font-bold text-emerald-800">50K SNP Genotype Verified (99.8%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'GENOMICS' && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">50K SNP Genomic Characterization</h3>
              <p className="text-xs text-stone-600">Laboratory Assay Report: LAB-ILRI-2026-992</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono font-bold text-xs">
              MENDELIAN CLEAN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">SNP Call Rate</span>
              <div className="text-lg font-bold text-stone-900 mt-1">99.4%</div>
              <p className="text-[10px] text-stone-500 mt-0.5">53,212 / 54,000 loci resolved</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Genomic Inbreeding (F_GRM)</span>
              <div className="text-lg font-bold text-emerald-800 mt-1">3.8%</div>
              <p className="text-[10px] text-stone-500 mt-0.5">Well below 5.0% statutory threshold</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Boran Purity Index</span>
              <div className="text-lg font-bold text-emerald-800 mt-1">99.2%</div>
              <p className="text-[10px] text-stone-500 mt-0.5">Admixture analysis confirmed</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MOVEMENTS' && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Official Lifetime Traceability Log</h3>
          <div className="space-y-3">
            {[
              { date: '2026-03-10', event: 'Current Farm Residency Check', location: `${farm?.name} (${farm?.region})`, status: 'CONFIRMED' },
              { date: '2025-08-14', event: 'Approved Inter-Farm Transit', location: 'Oromia Seedstock Farm → Bishoftu Nucleus', status: 'PERMIT_PERM-2025-88' },
              { date: '2023-04-12', event: 'Birth Registration & Ear Tagging', location: 'Boran Nucleus Breeding Center', status: 'TAGGED_RFID' },
            ].map((m, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <Truck className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{m.event}</span>
                    <span className="font-mono text-[10px] text-stone-500">{m.date}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">Location: {m.location}</p>
                  <span className="inline-block mt-1 text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">National Veterinary Health Passport</h3>
          <div className="space-y-2 text-xs">
            {[
              { disease: 'Foot and Mouth Disease (FMD)', date: '2026-01-15', batch: 'FMD-ETH-2025-B4', status: 'VACCINATED' },
              { disease: 'Contagious Bovine Pleuropneumonia (CBPP)', date: '2025-11-20', batch: 'CBPP-PANVAC-90', status: 'VACCINATED' },
              { disease: 'Anthrax & Blackleg Bivalent', date: '2025-06-10', batch: 'ANTH-BL-441', status: 'VACCINATED' },
              { disease: 'Bovine Brucellosis Serological Test', date: '2025-06-08', batch: 'RBT-NEG', status: 'TESTED_NEGATIVE' },
            ].map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">{v.disease}</div>
                  <div className="text-[10px] text-stone-500 font-mono">Date: {v.date} • Batch: {v.batch}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'IMAGES' && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Certified Photographs & Dossier Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Lateral Confirmation View', type: 'High-Res Animal Profile Photo', date: '2026-02-18' },
              { title: 'Facial Identification & Ear Tag Scan', type: 'RFID & Visual Barcode Verification', date: '2026-02-18' },
              { title: 'Veterinary Health Certificate Scan', type: 'PDF Document Attachment', date: '2025-08-14' },
            ].map((img, i) => (
              <div key={i} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div className="h-32 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400">
                  <ImageIcon className="w-8 h-8 opacity-60" />
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-xs text-stone-900">{img.title}</h4>
                  <p className="text-[10px] text-stone-600 mt-0.5">{img.type}</p>
                  <span className="text-[9px] font-mono text-stone-400 block mt-1">{img.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
