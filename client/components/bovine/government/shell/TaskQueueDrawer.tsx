'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  CheckSquare,
  Clock,
  Calendar,
  ExternalLink,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useGovernment } from '@/lib/bovine-government-store';
import { InstitutionalTask } from '@/lib/bovine-government-types';

export function TaskQueueDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { taskQueue, completeTask } = useGovernment();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  if (!isOpen) return null;

  const filteredTasks = taskQueue.filter((t: InstitutionalTask) => {
    if (filterStatus === 'PENDING') return t.status === 'PENDING' || t.status === 'IN_PROGRESS';
    if (filterStatus === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const pendingCount = taskQueue.filter((t: InstitutionalTask) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-stone-50/80 flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Regulatory Official Task Queue
                </h3>
                <p className="text-xs text-stone-600">
                  {pendingCount} statutory tasks awaiting action
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-5 py-2.5 border-b border-stone-100 bg-white flex items-center space-x-2 text-xs">
            <span className="text-stone-600 font-medium text-[11px] mr-1">Status:</span>
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-stone-600">
                <Check className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-80" />
                <p className="font-semibold text-stone-800">No regulatory tasks found</p>
                <p className="text-xs mt-1">All audit signoffs and case reviews are up to date.</p>
              </div>
            ) : (
              filteredTasks.map((task: InstitutionalTask) => {
                const isHigh = task.priority === 'HIGH';
                const isCompleted = task.status === 'COMPLETED';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-stone-50/60 border-stone-200 opacity-70'
                        : isHigh
                        ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                        : 'bg-stone-50/80 border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                            isHigh
                              ? 'bg-rose-600 text-white'
                              : 'bg-stone-700 text-white'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-stone-600 font-mono flex items-center">
                          <Calendar className="w-3 h-3 mr-1" /> Due {task.dueDate}
                        </span>
                      </div>

                      {!isCompleted ? (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
                          title="Mark task as completed"
                        >
                          <Check className="w-3 h-3" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-800 font-semibold flex items-center">
                          <Check className="w-3 h-3 mr-0.5" /> Completed
                        </span>
                      )}
                    </div>

                    <h4 className={`font-bold text-xs mt-2 ${isCompleted ? 'line-through text-stone-600' : 'text-stone-900'}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Type: <strong className="text-stone-800">{task.type}</strong>
                      {task.farmName && ` • Target Farm: ${task.farmName}`}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-stone-600">
                        Official: <strong className="text-stone-800">{task.assignedOfficialName}</strong>
                      </span>
                      {task.linkRoute && (
                        <Link
                          href={task.linkRoute}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1 text-emerald-800 font-semibold hover:underline"
                        >
                          <span>Go to Entity</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">
              National Veterinary Task Framework
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
