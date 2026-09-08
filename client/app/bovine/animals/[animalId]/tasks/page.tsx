'use client';

import React, { use, useState } from 'react';
import { useBovine } from '@/lib/bovine-store';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
} from 'lucide-react';
import { TaskType } from '@/lib/bovine-types';

export default function AnimalTasksPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const resolvedParams = use(params);
  const animalId = resolvedParams.animalId;

  const { animals, tasks, addAnimalTask, completeTask } = useBovine();
  const animal = animals.find((a) => a.id === animalId);
  const animalTasks = tasks.filter((t) => t.animalId === animalId);

  // New task form state
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('HEALTH_CHECK');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [dueDate, setDueDate] = useState('2026-09-05');
  const [assigneeName, setAssigneeName] = useState('Dr. Sarah Lin (DVM)');
  const [notes, setNotes] = useState('');

  if (!animal) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAnimalTask({
      animalId: animal.id,
      animalName: animal.name,
      animalIdentifier: animal.primaryIdentifier || animal.internalId,
      farmId: animal.farmId,
      herdId: animal.herdId,
      title: title.trim(),
      taskType,
      priority,
      status: 'OPEN',
      dueDate,
      assigneeName,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Existing Tasks List */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-800" />
          <span>Operational Field Tasks for {animal.name}</span>
        </h2>

        <div className="space-y-2.5">
          {animalTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                task.status === 'COMPLETED'
                  ? 'bg-stone-50/60 border-stone-200 text-stone-400'
                  : 'bg-white border-stone-200 shadow-2xs text-stone-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => completeTask(task.id)}
                  disabled={task.status === 'COMPLETED'}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-stone-300 hover:border-emerald-700'
                  }`}
                >
                  {task.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div
                    className={`font-bold text-sm ${
                      task.status === 'COMPLETED' ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5 flex items-center space-x-2">
                    <span>Due: {task.dueDate}</span>
                    <span>•</span>
                    <span>Assigned: {task.assigneeName}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold">{task.taskType}</span>
                  </div>
                  {task.notes && (
                    <div className="text-[11px] text-stone-600 mt-1">{task.notes}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.priority === 'URGENT'
                      ? 'bg-rose-100 text-rose-900'
                      : task.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}

          {animalTasks.length === 0 && (
            <div className="p-6 text-center text-stone-400 text-xs">
              No tasks currently assigned to this animal.
            </div>
          )}
        </div>
      </div>

      {/* Create New Task Form */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
          Create New Animal Task
        </h2>

        <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Administer booster vaccination, Foot bath trim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Task Protocol Type</label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskType)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="HEALTH_CHECK">Health / Physical Exam</option>
              <option value="VACCINATION">Vaccination / Inoculation</option>
              <option value="TREATMENT">Clinical Treatment</option>
              <option value="OPU_PREPARATION">OPU Follicle Prep</option>
              <option value="PREGNANCY_CHECK">Ultrasound Pregnancy Check</option>
              <option value="HOOF_TRIM">Hoof Trimming</option>
              <option value="WEIGHING">Scale Biometric Weighing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent (Immediate)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Target Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Assignee</label>
            <input
              type="text"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Instructions / Notes</label>
            <input
              type="text"
              placeholder="Dosage, pen location or handling instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              id="btn-create-task-submit"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
