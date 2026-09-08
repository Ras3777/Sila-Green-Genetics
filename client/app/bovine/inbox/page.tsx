'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  Bell,
  CheckCheck,
  Archive,
  Filter,
  AlertTriangle,
  CheckSquare,
  Truck,
  Building2,
  Calendar,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';
import { Notification } from '@/lib/bovine-types';

export default function BovineInboxPage() {
  const {
    notifications,
    markNotificationRead,
    archiveNotification,
    bulkMarkNotificationsRead,
  } = useBovine();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread' && (n.isRead || n.isArchived)) return false;
    if (activeTab === 'archived' && !n.isArchived) return false;
    if (activeTab === 'all' && n.isArchived) return false;
    if (selectedType !== 'ALL' && n.type !== selectedType) return false;
    return true;
  });

  // Group notifications into Today, Yesterday, Earlier
  const todayItems: Notification[] = [];
  const yesterdayItems: Notification[] = [];
  const earlierItems: Notification[] = [];

  filteredNotifications.forEach((n) => {
    if (n.timestamp.includes('2026-09-04') || n.timestamp.includes('07:') || n.timestamp.includes('06:')) {
      todayItems.push(n);
    } else if (n.timestamp.includes('2026-09-03')) {
      yesterdayItems.push(n);
    } else {
      earlierItems.push(n);
    }
  });

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'TASK':
        return <CheckSquare className="w-4 h-4 text-emerald-700" />;
      case 'MOVEMENT':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'REGISTRATION':
        return <Bell className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Operational Signals & Notification Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Notification Inbox
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Vital sign spikes, task assignments, herd arrivals, and registration approvals
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-mark-all-read"
            onClick={() => bulkMarkNotificationsRead()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-800" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Type Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'unread' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Unread Only
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'archived' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Archived
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-400 font-semibold uppercase text-[10px]">Filter by Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
          >
            <option value="ALL">All Categories</option>
            <option value="ALERT">Health & Vitals Alerts</option>
            <option value="TASK">Task Assignments</option>
            <option value="MOVEMENT">Livestock Movements</option>
            <option value="REGISTRATION">Registrations</option>
          </select>
        </div>
      </div>

      {/* Notification Lists by Time Category */}
      <div className="space-y-6">
        {/* Today */}
        {todayItems.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">Today</div>
            <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs divide-y divide-stone-100">
              {todayItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationRead(item.id);
                    setSelectedNotification(item);
                  }}
                  className={`p-4 flex items-start justify-between cursor-pointer hover:bg-stone-50/80 transition-colors ${
                    !item.isRead ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="mt-0.5 p-2 rounded-xl bg-stone-100 border border-stone-200">
                      {getIconForType(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${!item.isRead ? 'text-stone-900' : 'text-stone-700'}`}>
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{item.message}</p>
                      <div className="text-[11px] text-stone-400 mt-1 font-mono">{item.timestamp}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={item.linkUrl}
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(item.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
                      title="Open Record"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveNotification(item.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yesterday & Earlier */}
        {(yesterdayItems.length > 0 || earlierItems.length > 0) && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">Yesterday & Earlier</div>
            <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs divide-y divide-stone-100">
              {[...yesterdayItems, ...earlierItems].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationRead(item.id);
                    setSelectedNotification(item);
                  }}
                  className={`p-4 flex items-start justify-between cursor-pointer hover:bg-stone-50/80 transition-colors ${
                    !item.isRead ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="mt-0.5 p-2 rounded-xl bg-stone-100 border border-stone-200">
                      {getIconForType(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${!item.isRead ? 'text-stone-900' : 'text-stone-700'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{item.message}</p>
                      <div className="text-[11px] text-stone-400 mt-1 font-mono">{item.timestamp}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={item.linkUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-stone-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs bg-white rounded-3xl border border-stone-200">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            No notifications found for this view.
          </div>
        )}
      </div>

      {/* Notification Detail Drawer */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getIconForType(selectedNotification.type)}
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {selectedNotification.type} Details
                </span>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base font-bold text-stone-900">{selectedNotification.title}</h2>
            <p className="text-xs text-stone-600 leading-relaxed">{selectedNotification.message}</p>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Entity Scope:</span>
                <span className="font-semibold text-stone-800">{selectedNotification.entityType} ({selectedNotification.entityId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Time:</span>
                <span className="font-mono text-stone-800">{selectedNotification.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  archiveNotification(selectedNotification.id);
                  setSelectedNotification(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Archive
              </button>
              <Link
                href={selectedNotification.linkUrl}
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center space-x-1"
              >
                <span>Go to Record</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
