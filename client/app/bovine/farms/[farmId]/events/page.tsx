'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import { FarmOperationalEvent } from '@/lib/bovine-types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Search,
  Check,
  X,
  Building2,
  Calendar,
  User,
  Activity,
  Flame,
  Droplets,
  Wrench,
  CloudLightning,
  TreePine,
  HelpCircle,
} from 'lucide-react';

interface FarmEventsPageProps {
  params: Promise<{ farmId: string }>;
}

const EVENT_TYPE_LABELS: Record<FarmOperationalEvent['eventType'], { label: string; icon: React.ElementType; color: string }> = {
  BIOSECURITY: { label: 'Biosecurity Breach', icon: ShieldAlert, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  DISEASE_OUTBREAK: { label: 'Disease / Outbreak', icon: Flame, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  FEED_SHORTAGE: { label: 'Feed Shortage', icon: AlertTriangle, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  WATER_SUPPLY: { label: 'Water Supply Issue', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  EQUIPMENT_FAILURE: { label: 'Equipment Failure', icon: Wrench, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  WEATHER_EXTREME: { label: 'Extreme Weather', icon: CloudLightning, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  PASTURE_EVENT: { label: 'Pasture / Pen Event', icon: TreePine, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  OTHER: { label: 'Other Operational', icon: HelpCircle, color: 'text-stone-700 bg-stone-50 border-stone-200' },
};

export default function FarmEventsPage({ params }: FarmEventsPageProps) {
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const { farms, farmEvents, addFarmOperationalEvent, resolveFarmOperationalEvent, session } = useBovine();
  const farm = farms.find((f) => f.id === farmId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resolveModalEvent, setResolveModalEvent] = useState<FarmOperationalEvent | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<FarmOperationalEvent['eventType']>('EQUIPMENT_FAILURE');
  const [newSeverity, setNewSeverity] = useState<FarmOperationalEvent['severity']>('MEDIUM');
  const [newNotes, setNewNotes] = useState('');
  const [newReporter, setNewReporter] = useState(session.userName || 'Facility Lead');

  if (!farm) {
    return null; // Parent layout handles not found
  }

  const events = farmEvents.filter((e) => e.farmId === farm.id);

  const filteredEvents = events.filter((e) => {
    if (statusFilter === 'ACTIVE' && e.status === 'RESOLVED') return false;
    if (statusFilter === 'RESOLVED' && e.status !== 'RESOLVED') return false;
    if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchNotes = e.notes?.toLowerCase().includes(q);
      const matchReporter = e.reportedBy.toLowerCase().includes(q);
      return matchTitle || matchNotes || matchReporter;
    }
    return true;
  });

  const openCount = events.filter((e) => e.status !== 'RESOLVED').length;
  const criticalCount = events.filter((e) => e.status !== 'RESOLVED' && (e.severity === 'CRITICAL' || e.severity === 'HIGH')).length;
  const resolvedCount = events.filter((e) => e.status === 'RESOLVED').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addFarmOperationalEvent({
      farmId: farm.id,
      farmName: farm.name,
      title: newTitle.trim(),
      eventType: newType,
      severity: newSeverity,
      occurrenceTime: new Date().toISOString(),
      status: 'OPEN',
      notes: newNotes.trim() || undefined,
      reportedBy: newReporter.trim() || 'Facility Lead',
    });

    setNewTitle('');
    setNewNotes('');
    setIsCreateModalOpen(false);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalEvent) return;

    resolveFarmOperationalEvent(resolveModalEvent.id, resolutionNotes.trim() || 'Issue inspected and cleared by operator.');
    setResolveModalEvent(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Recorded</div>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">{events.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Facility incidents & alerts</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Open / Active
          </div>
          <div className="text-2xl font-bold text-rose-950 mt-1 font-mono">{openCount}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Requiring attention</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Critical / High</div>
          <div className="text-2xl font-bold text-amber-950 mt-1 font-mono">{criticalCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Severe priority events</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1 font-mono">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Cleared & logged</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ACTIVE' ? 'bg-white text-rose-700 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active ({openCount})
            </button>
            <button
              onClick={() => setStatusFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'RESOLVED' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Incident</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <ShieldAlert className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No Incidents Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {events.length === 0
              ? 'No operational incidents or biosecurity alerts have been logged for this facility yet.'
              : 'No incidents match your current search and filter criteria.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log First Operational Incident</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const typeConfig = EVENT_TYPE_LABELS[evt.eventType] || EVENT_TYPE_LABELS.OTHER;
            const TypeIcon = typeConfig.icon;
            const isResolved = evt.status === 'RESOLVED';

            return (
              <div
                key={evt.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-2xs ${
                  isResolved
                    ? 'border-stone-200/80 opacity-80'
                    : evt.severity === 'CRITICAL'
                    ? 'border-rose-300 bg-rose-50/10'
                    : evt.severity === 'HIGH'
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-stone-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.label}
                      </span>

                      {/* Severity badge */}
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : evt.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : evt.severity === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {evt.severity}
                      </span>

                      {/* Status */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : evt.status === 'INVESTIGATING'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900">{evt.title}</h4>

                    {evt.notes && (
                      <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                        {evt.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                    <div className="text-[11px] text-stone-500 space-y-0.5 sm:text-right">
                      <div className="flex items-center gap-1 sm:justify-end">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{new Date(evt.occurrenceTime).toLocaleDateString()} {new Date(evt.occurrenceTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:justify-end">
                        <User className="w-3 h-3 text-stone-400" />
                        <span>By {evt.reportedBy}</span>
                      </div>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => setResolveModalEvent(evt)}
                        className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                {isResolved && evt.resolutionTime && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved on {new Date(evt.resolutionTime).toLocaleString()}
                    </span>
                    <span className="font-mono text-stone-400">ID: {evt.id}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Log Incident Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                <h3 className="text-base font-bold text-stone-900">Log Operational Incident</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milking parlor vacuum pump fluctuation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Event Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as FarmOperationalEvent['eventType'])}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    {Object.keys(EVENT_TYPE_LABELS).map((t) => (
                      <option key={t} value={t}>
                        {EVENT_TYPE_LABELS[t as FarmOperationalEvent['eventType']].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as FarmOperationalEvent['severity'])}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  >
                    <option value="LOW">Low - Minor Observation</option>
                    <option value="MEDIUM">Medium - Operational Impact</option>
                    <option value="HIGH">High - Urgent Action</option>
                    <option value="CRITICAL">Critical - Biosecurity / Danger</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Reported By
                </label>
                <input
                  type="text"
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide affected pens, observed symptoms, immediate containment actions..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  Record Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolveModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Mark Incident Resolved</h3>
              </div>
              <button
                onClick={() => setResolveModalEvent(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Resolving <strong className="text-stone-900">&ldquo;{resolveModalEvent.title}&rdquo;</strong>.
              Add resolution and preventive maintenance findings below.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Resolution Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Technician replaced faulty pressure valve, test milk run completed normally."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setResolveModalEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
