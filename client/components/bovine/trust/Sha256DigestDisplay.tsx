'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Hash } from 'lucide-react';

interface Sha256DigestDisplayProps {
  digest: string;
  label?: string;
  match?: boolean | null;
  expectedDigest?: string;
  truncate?: boolean;
}

export function Sha256DigestDisplay({
  digest,
  label = 'SHA-256 Digest',
  match,
  expectedDigest,
  truncate = true,
}: Sha256DigestDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!truncate);

  const handleCopy = () => {
    if (!digest) return;
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayDigest = expanded ? digest : `${digest.slice(0, 16)}...${digest.slice(-12)}`;

  return (
    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
          <Hash className="w-3.5 h-3.5 text-stone-500" />
          <span>{label}</span>
          {match !== undefined && match !== null && (
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                match ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {match ? 'MATCH' : 'MISMATCH'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {truncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-stone-500 hover:text-stone-800 text-[10px] font-semibold flex items-center space-x-0.5 cursor-pointer"
            >
              <span>{expanded ? 'Collapse' : 'Full'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Copy full digest"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="font-mono text-stone-800 text-[11px] break-all select-all leading-relaxed bg-white p-2 rounded-lg border border-stone-200/80">
        {displayDigest}
      </div>

      {expectedDigest && expectedDigest !== digest && (
        <div className="mt-2 pt-2 border-t border-stone-200 text-[10px]">
          <span className="text-stone-500 font-bold uppercase block">Registered Target Digest:</span>
          <span className="font-mono text-stone-700 break-all select-all">{expectedDigest}</span>
        </div>
      )}
    </div>
  );
}
