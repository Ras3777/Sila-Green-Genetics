'use client';

import React from 'react';

interface TopographicContourSvgProps {
  className?: string;
}

export default function TopographicContourSvg({ className = '' }: TopographicContourSvgProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      <svg
        className="w-full h-full opacity-[0.35] text-[#D8D3C5]"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Soft undulating topographic curves */}
        <path
          d="M -100 120 C 200 80, 450 220, 750 140 C 1050 60, 1300 200, 1600 110"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -120 180 C 180 140, 430 280, 730 200 C 1030 120, 1280 260, 1580 170"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -80 240 C 220 200, 470 340, 770 260 C 1070 180, 1320 320, 1620 230"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -140 300 C 160 260, 410 400, 710 320 C 1010 240, 1260 380, 1560 290"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -100 650 C 250 580, 500 740, 800 660 C 1100 580, 1350 720, 1650 630"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -120 720 C 230 650, 480 810, 780 730 C 1080 650, 1330 790, 1630 700"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M -80 790 C 270 720, 520 880, 820 800 C 1120 720, 1370 860, 1670 770"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
