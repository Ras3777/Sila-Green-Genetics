'use client';

import React from 'react';
import Link from 'next/link';

interface CowLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function CowLogo({
  className = '',
  size = 'md',
  href = '/login',
}: CowLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-xs tracking-[0.18em]',
    md: 'text-[15px] tracking-[0.2em] font-extrabold',
    lg: 'text-lg tracking-[0.22em] font-black',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.14em]',
    md: 'text-[10px] tracking-[0.16em] font-bold',
    lg: 'text-xs tracking-[0.18em] font-bold',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Cow Head Line-Art SVG */}
      <svg
        className={`${iconSizes[size]} text-[#161D18] shrink-0`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head Contour & Horns */}
        <path
          d="M14 15C13 11 15 7 18 6C20 8.5 21 11 21 13M34 15C35 11 33 7 30 6C28 8.5 27 11 27 13"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top of Head */}
        <path
          d="M20 13.5C21.5 13 26.5 13 28 13.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Left Ear */}
        <path
          d="M16 16C12 16.5 7 19 6 22.5C9 24.5 14 22 16 19.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Ear */}
        <path
          d="M32 16C36 16.5 41 19 42 22.5C39 24.5 34 22 32 19.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Face Outline */}
        <path
          d="M16 18C15 25 15.5 29 17 33C17.5 34.5 19 39 24 39C29 39 30.5 34.5 31 33C32.5 29 33 25 32 18"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Snout / Muzzle */}
        <path
          d="M18 31C20 30 28 30 30 31C30.5 33.5 29.5 37 24 37C18.5 37 17.5 33.5 18 31Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Nostrils */}
        <circle cx="21" cy="34" r="1" fill="currentColor" />
        <circle cx="27" cy="34" r="1" fill="currentColor" />
        {/* Eyes */}
        <path
          d="M18.5 23C19.5 23 20.5 24 20.5 24.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M29.5 23C28.5 23 27.5 24 27.5 24.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-sans font-black text-[#161D18] uppercase ${titleSizes[size]}`}>
          BOVINE
        </span>
        <span className={`font-sans text-[#161D18] uppercase mt-0.5 ${subtitleSizes[size]}`}>
          GENETICS
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
