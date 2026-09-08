'use client';

import React from 'react';
import { ShieldCheck, Lock, Sprout } from 'lucide-react';

interface BovineAuthFooterProps {
  variant?: 'login' | 'register';
  className?: string;
}

export default function BovineAuthFooter({
  variant = 'login',
  className = '',
}: BovineAuthFooterProps) {
  if (variant === 'login') {
    return (
      <footer
        className={`w-full flex items-center justify-center sm:justify-start py-5 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-xs text-[#52504A] select-none ${className}`}
      >
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#737067]">
          <Sprout className="w-3.5 h-3.5 text-[#2A4736]" />
          <span>PEOPLE &nbsp;|&nbsp; ANIMALS &nbsp;|&nbsp; SCIENCE &nbsp;|&nbsp; STRONGER TOMORROWS</span>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`w-full flex flex-col sm:flex-row items-center justify-between py-5 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-xs text-[#52504A] gap-4 select-none ${className}`}
    >
      {/* Left Trust Badges for Register Page */}
      <div className="flex items-center gap-5 sm:gap-6">
        <div className="flex items-center gap-1.5 text-[#353430] font-medium text-[11px] sm:text-xs">
          <ShieldCheck className="w-4 h-4 text-[#2A4736]" />
          <span>Secure access</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#353430] font-medium text-[11px] sm:text-xs">
          <Lock className="w-3.5 h-3.5 text-[#2A4736]" />
          <span>Your data stays private</span>
        </div>
      </div>

      {/* Right Brand Principles */}
      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#737067]">
        <span>FARMERS &nbsp;|&nbsp; HEALTHIER HERDS &nbsp;|&nbsp; BRIGHTER TOMORROWS</span>
      </div>
    </footer>
  );
}
