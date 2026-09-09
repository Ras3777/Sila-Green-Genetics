'use client';

import React from 'react';
import { BreedingStockTab } from '../_hooks/useBreedingStockProfile';

interface TabItem {
  key: BreedingStockTab;
  label: string;
  badge?: string;
}

interface BreedingTabsHeaderProps {
  tabs: TabItem[];
  activeTab: BreedingStockTab;
  setActiveTab: (tab: BreedingStockTab) => void;
}

export function BreedingTabsHeader({ tabs, activeTab, setActiveTab }: BreedingTabsHeaderProps) {
  return (
    <div className="border-b border-stone-200 overflow-x-auto">
      <div className="flex space-x-1 min-w-max pb-px">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3.5 py-2.5 text-xs font-semibold transition-all rounded-t-xl cursor-pointer flex items-center gap-1.5 ${
              activeTab === t.key
                ? 'border-b-2 border-amber-600 text-amber-900 bg-white shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === t.key
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-200/70 text-stone-700'
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
