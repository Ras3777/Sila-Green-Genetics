'use client';

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface CertificateDropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export function CertificateDropzone({ onFileAccepted, disabled }: CertificateDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024, // 25 MB
    disabled,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-700/40 ${
          disabled
            ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
            : isDragActive && !isDragReject
            ? 'bg-emerald-50/80 border-emerald-600 ring-4 ring-emerald-100'
            : isDragReject
            ? 'bg-rose-50/80 border-rose-600 ring-4 ring-rose-100'
            : 'bg-stone-50/60 hover:bg-stone-100/70 border-stone-300 hover:border-emerald-700'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isDragActive
                ? 'bg-emerald-800 text-white scale-110 shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 shadow-xs'
            }`}
          >
            {isDragActive ? <UploadCloud className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              {isDragActive
                ? 'Release to verify official certificate'
                : 'Drop official certificate PDF here'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              or <span className="text-emerald-800 font-semibold underline">Browse local files</span>
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-stone-500 bg-white/80 px-3 py-1 rounded-full border border-stone-200">
            <span>Accepted: PDF only</span>
            <span>•</span>
            <span>Max size: 25 MB</span>
          </div>
        </div>
      </div>

      {/* Rejection Notice */}
      {fileRejections.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start space-x-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Invalid file selection:</span>
            {fileRejections.map(({ file, errors }, idx) => (
              <ul key={idx} className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px] text-rose-800">
                {errors.map((e) => (
                  <li key={e.code}>
                    {e.code === 'file-invalid-type'
                      ? `${file.name} is not a valid PDF document. Only official PDF files are accepted.`
                      : e.code === 'file-too-large'
                      ? `${file.name} exceeds the 25 MB limit.`
                      : e.message}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
