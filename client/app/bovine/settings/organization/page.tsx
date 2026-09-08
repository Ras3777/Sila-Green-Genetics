'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  Settings,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function SettingsOrganizationPage() {
  const { organizations, farms, session } = useBovine();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/settings" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>System Settings</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Organization Profiles</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Multi-Tenant Enterprise Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Organization Registry & Memberships
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Manage consortium partners, tenant entities, livestock registry ownerships, and operating boundaries
          </p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 text-xs font-semibold">
        <Link
          href="/bovine/settings"
          className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          General & RBAC
        </Link>
        <Link
          href="/bovine/settings/preferences"
          className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          Clinical Thresholds
        </Link>
        <Link
          href="/bovine/settings/organization"
          className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white shadow-2xs"
        >
          Organization Profiles
        </Link>
      </div>

      {/* Organizations List */}
      <div className="space-y-4">
        {organizations.map((org) => {
          const orgFarms = farms.filter((f) => f.organizationId === org.id);

          return (
            <div
              key={org.id}
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {org.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      Active Enterprise Tenant
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">{org.name}</h3>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Assigned Stations</span>
                  <span className="font-bold text-stone-900">{orgFarms.length} facilities</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50/70 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Headquarters</span>
                  <div className="flex items-center text-stone-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                    <span>{org.headquarters}, {org.country}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50/70 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Primary Contact</span>
                  <div className="flex items-center text-stone-800 font-medium">
                    <Users className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                    <span>{org.primaryContact}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50/70 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Communications</span>
                  <div className="flex items-center text-stone-800 font-medium truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                    <span className="truncate">{org.email}</span>
                  </div>
                </div>
              </div>

              {/* Farms owned by this org */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Operating Facilities under {org.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {orgFarms.map((f) => (
                    <Link
                      key={f.id}
                      href={`/bovine/farms/${f.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{f.name} ({f.code})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
