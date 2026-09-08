'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CowLogo from './CowLogo';
import { ChevronDown, Globe } from 'lucide-react';

interface BovineAuthHeaderProps {
  className?: string;
}

export default function BovineAuthHeader({ className = '' }: BovineAuthHeaderProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English (US)' },
    { code: 'ES', label: 'Español' },
    { code: 'FR', label: 'Français' },
    { code: 'PT', label: 'Português' },
    { code: 'DE', label: 'Deutsch' },
  ];

  return (
    <header
      className={`w-full flex items-center justify-between py-4 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto select-none ${className}`}
    >
      {/* Brand Logo */}
      <CowLogo size="md" href="/login" />

      {/* Middle Slogans (Hidden on very small screens, visible on md+) */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10 text-[12px] lg:text-[13px] text-[#6E6C64] font-normal tracking-wide">
        <span className="hover:text-[#161D18] transition-colors cursor-default">Better Genetics</span>
        <span className="hover:text-[#161D18] transition-colors cursor-default">Healthier Herds</span>
        <span className="hover:text-[#161D18] transition-colors cursor-default">Brighter Tomorrows</span>
      </div>

      {/* Right Utilities: Support & Language Selector */}
      <div className="flex items-center gap-3 text-xs text-[#52504A]">
        <Link
          href="/bovine"
          className="hover:text-[#161D18] transition-colors font-medium text-xs text-[#52504A]"
        >
          Support
        </Link>

        <span className="text-[#D0CDC4]">|</span>

        {/* Language dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 hover:text-[#161D18] transition-colors font-semibold text-xs py-1"
          >
            <span>{selectedLang}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C7A72]" />
          </button>

          {isLangOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLangOpen(false)}
              />
              <div className="absolute right-0 top-7 z-50 w-36 rounded-xl border border-[#E8E5DC] bg-white p-1 shadow-lg text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                      selectedLang === lang.code
                        ? 'bg-[#2A4736]/10 text-[#2A4736] font-bold'
                        : 'hover:bg-[#F8F7F2] text-[#52504A]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] font-mono text-[#8C887E]">{lang.code}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
