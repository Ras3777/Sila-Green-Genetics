'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Phone,
  Mail,
  User,
} from 'lucide-react';

export default function BovineNewFarmPage() {
  const router = useRouter();
  const { organizations, addFarm, farms } = useBovine();

  const [code, setCode] = useState(`FARM-${(farms.length + 1).toString().padStart(3, '0')}`);
  const [name, setName] = useState('');
  const [type, setType] = useState<'DAIRY' | 'BEEF' | 'SEEDSTOCK' | 'GENOMIC_HUB' | 'COMMERCIAL' | 'RESEARCH'>('DAIRY');
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || 'org-apex');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('Midwest');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(43.0731);
  const [longitude, setLongitude] = useState(-89.4012);
  const [elevation, setElevation] = useState(280);
  const [capacity, setCapacity] = useState(100);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Facility name is required');
      return;
    }
    if (!code.trim()) {
      setError('Facility code is required');
      return;
    }

    // Code uniqueness check
    if (farms.some((f) => f.code.toLowerCase() === code.trim().toLowerCase())) {
      setError(`Facility code "${code}" is already assigned to another station`);
      return;
    }

    const newFarmId = addFarm({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      organizationId,
      country,
      region,
      district: district.trim() || region,
      city: city.trim() || 'Headquarters',
      address: address.trim() || 'Rural Route 1',
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      elevation: Number(elevation) || 0,
      capacity: Number(capacity) || 100,
      contactName: contactName.trim() || 'Facility Manager',
      contactEmail: contactEmail.trim() || 'operations@farm.internal',
      contactPhone: contactPhone.trim() || '+1 (555) 0100',
      active: true,
    });

    router.push(`/bovine/farms/${newFarmId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/bovine/farms" className="hover:text-emerald-800 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Farm Facilities</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-900">Enroll New Station</span>
      </div>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Operational Facility Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Enroll New Agricultural Station
        </h1>
        <p className="text-sm text-stone-500">
          Configure physical bounds, geographic coordinates, biosecurity capacity, and enterprise allocation.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6 text-xs">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-[11px] pb-2 border-b border-stone-100 flex items-center space-x-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Facility Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Official Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MDG-01"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono font-bold uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Facility Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Meadowlands Dairy & Genetics Hub"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Operational Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="DAIRY">Dairy Production</option>
                <option value="BEEF">Beef Station</option>
                <option value="GENOMIC_HUB">Genomic Hub & IVF Lab</option>
                <option value="SEEDSTOCK">Seedstock Breeding</option>
                <option value="COMMERCIAL">Commercial Milking</option>
                <option value="RESEARCH">Research Station</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Parent Organization</label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Total Head Capacity</label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Location & Geospatial */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-[11px] pb-2 border-b border-stone-100 flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>Geographic Placement & Coordinates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="4280 Prairie Valley Rd"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City / Township</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Madison"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State / Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Midwest"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District / County</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Dane County"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Longitude (°E/W)</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Elevation (Meters)</label>
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Management Contact */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-[11px] pb-2 border-b border-stone-100 flex items-center space-x-2">
            <User className="w-3.5 h-3.5 text-emerald-800" />
            <span>Station Supervision & Operations Lead</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Manager Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Dr. Evelyn Sterling"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="sterling@apexbovine.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Telephone / Radio</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (608) 555-0144"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-100">
          <Link
            href="/bovine/farms"
            className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Save &amp; Enroll Station
          </button>
        </div>
      </form>
    </div>
  );
}
