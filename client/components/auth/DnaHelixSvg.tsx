'use client';

import React from 'react';

interface DnaHelixSvgProps {
  variant?: 'flowing' | 'vertical';
  className?: string;
}

export default function DnaHelixSvg({
  variant = 'flowing',
  className = '',
}: DnaHelixSvgProps) {
  if (variant === 'vertical') {
    return (
      <svg
        className={`w-16 sm:w-20 h-44 sm:h-52 text-[#7F9988]/40 ${className}`}
        viewBox="0 0 100 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical DNA Strand 1 */}
        <path
          d="M 50 10 Q 80 45 50 80 Q 20 115 50 150 Q 80 185 50 220 Q 20 255 50 290 Q 80 325 50 360"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Vertical DNA Strand 2 */}
        <path
          d="M 50 10 Q 20 45 50 80 Q 80 115 50 150 Q 20 185 50 220 Q 80 255 50 290 Q 20 325 50 360"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Cross rungs */}
        <line x1="32" y1="45" x2="68" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="62" x2="62" y2="62" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="38" y1="98" x2="62" y2="98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="115" x2="68" y2="115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="132" x2="62" y2="132" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="38" y1="168" x2="62" y2="168" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="185" x2="68" y2="185" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="202" x2="62" y2="202" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="38" y1="238" x2="62" y2="238" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="255" x2="68" y2="255" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="272" x2="62" y2="272" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Flowing DNA curve for the Login Page
  return (
    <svg
      className={`text-[#7E9685]/35 pointer-events-none select-none ${className}`}
      viewBox="0 0 340 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ribbon Strand A */}
      <path
        d="M 170 10 C 240 70, 240 130, 170 190 C 100 250, 100 310, 170 370 C 240 430, 240 490, 170 550"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Ribbon Strand B */}
      <path
        d="M 170 10 C 100 70, 100 130, 170 190 C 240 250, 240 310, 170 370 C 100 430, 100 490, 170 550"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Rungs connecting Strand A and B */}
      <line x1="120" y1="70" x2="220" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="135" y1="100" x2="205" y2="100" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="145" y1="130" x2="195" y2="130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="150" y1="160" x2="190" y2="160" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      <line x1="150" y1="220" x2="190" y2="220" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="145" y1="250" x2="195" y2="250" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="135" y1="280" x2="205" y2="280" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="120" y1="310" x2="220" y2="310" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

      <line x1="135" y1="340" x2="205" y2="340" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="145" y1="370" x2="195" y2="370" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="150" y1="400" x2="190" y2="400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="135" y1="460" x2="205" y2="460" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
