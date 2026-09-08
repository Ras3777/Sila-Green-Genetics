'use client';

import React, { useState } from 'react';
import { BovineGovernmentProvider } from '@/lib/bovine-government-store';
import { GovernmentHeader } from '@/components/bovine/government/shell/GovernmentHeader';
import { GovernmentSidebar } from '@/components/bovine/government/shell/GovernmentSidebar';
import { MetricDefinitionDrawer } from '@/components/bovine/government/shell/MetricDefinitionDrawer';
import { AlertCenterDrawer } from '@/components/bovine/government/shell/AlertCenterDrawer';
import { TaskQueueDrawer } from '@/components/bovine/government/shell/TaskQueueDrawer';
import { ExportJobModal } from '@/components/bovine/government/shell/ExportJobModal';

function GovernmentLayoutInner({ children }: { children: React.ReactNode }) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF9F5] text-stone-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar */}
      <GovernmentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <GovernmentHeader
          onOpenAlerts={() => setAlertsOpen(true)}
          onOpenTasks={() => setTasksOpen(true)}
          onOpenExport={() => setExportOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Global Drawers & Modals */}
        <MetricDefinitionDrawer />
        <AlertCenterDrawer isOpen={alertsOpen} onClose={() => setAlertsOpen(false)} />
        <TaskQueueDrawer isOpen={tasksOpen} onClose={() => setTasksOpen(false)} />
        <ExportJobModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
      </div>
    </div>
  );
}

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <BovineGovernmentProvider>
      <GovernmentLayoutInner>{children}</GovernmentLayoutInner>
    </BovineGovernmentProvider>
  );
}
