'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBovine } from '@/lib/bovine-store';
import {
  CheckSquare,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  QrCode,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { AnimalTask, TaskPriority, TaskType } from '@/lib/bovine-types';

export default function BovineTasksPage() {
  const {
    tasks,
    animals,
    farms,
    herds,
    session,
    addAnimalTask,
    completeAnimalTask,
  } = useBovine();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'overdue' | 'today' | 'completed'>('my');
  const [selectedFarm, setSelectedFarm] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [mobileWalkMode, setMobileWalkMode] = useState<boolean>(false);

  // New task modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAnimalId, setNewTaskAnimalId] = useState(animals[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<TaskType>('HEALTH_CHECK');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-09-04');
  const [newTaskAssignee, setNewTaskAssignee] = useState(session.name);
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'my' && t.assigneeName !== session.name) return false;
    if (activeTab === 'completed' && t.status !== 'COMPLETED') return false;
    if (activeTab !== 'completed' && t.status === 'COMPLETED') return false;
    if (activeTab === 'today' && t.dueDate !== '2026-09-04') return false;
    if (activeTab === 'overdue' && (t.dueDate >= '2026-09-04' || t.status === 'COMPLETED')) return false;

    if (selectedFarm !== 'ALL' && t.farmId !== selectedFarm) return false;
    if (selectedType !== 'ALL' && t.taskType !== selectedType) return false;
    if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) return false;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const anim = animals.find((a) => a.id === newTaskAnimalId);
    if (!anim || !newTaskTitle.trim()) return;

    addAnimalTask({
      animalId: anim.id,
      animalName: anim.name,
      animalIdentifier: anim.primaryIdentifier || anim.internalId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || undefined,
      taskType: newTaskType,
      priority: newTaskPriority,
      status: 'OPEN',
      dueDate: newTaskDueDate,
      assigneeName: newTaskAssignee,
      farmId: anim.farmId,
      herdId: anim.herdId,
    });

    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Field Operational Assignments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Livestock Task Manager
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Routine vitals, vaccinations, tissue sampling, OPU preparations, and hoof trimming
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-toggle-walk-mode"
            onClick={() => setMobileWalkMode(!mobileWalkMode)}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
              mobileWalkMode
                ? 'bg-emerald-800 text-white border-emerald-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{mobileWalkMode ? 'Exit Walk Mode' : 'Pen Walking Mode'}</span>
          </button>

          <button
            id="btn-open-create-task"
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Tabs & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'my' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            My Tasks ({tasks.filter((t) => t.assigneeName === session.name && t.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'team' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            All Open ({tasks.filter((t) => t.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'today' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'completed' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Walking Mode Banner */}
      {mobileWalkMode && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-medium">
            <QrCode className="w-5 h-5 text-emerald-700" />
            <span>
              <strong>Pen Walking Mode Activated:</strong> Walk down the pen. Tap checkmarks directly or scan ear tags to instantly complete action items.
            </span>
          </div>
          <Link href="/bovine/scan" className="text-emerald-800 font-bold hover:underline">
            Open Scanner &rarr;
          </Link>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isUrgent = task.priority === 'URGENT';
          const isCompleted = task.status === 'COMPLETED';

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all ${
                isCompleted
                  ? 'border-stone-200/60 opacity-75'
                  : isUrgent
                  ? 'border-amber-300 shadow-xs'
                  : 'border-stone-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => completeAnimalTask(task.id)}
                    disabled={isCompleted}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-stone-300 hover:border-emerald-700'
                    }`}
                    title={isCompleted ? 'Completed' : 'Click to complete task'}
                  >
                    {isCompleted && <CheckSquare className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{task.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {task.taskType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{task.description}</p>
                    )}

                    {/* Inline Animal Identity Link */}
                    <div className="flex items-center space-x-3 mt-2.5 text-xs text-stone-500">
                      <Link
                        href={`/bovine/animals/${task.animalId}`}
                        className="font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{task.animalName}</span>
                        <span className="font-mono text-[11px] text-stone-500 font-normal">
                          ({task.animalIdentifier})
                        </span>
                      </Link>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span>Assigned to: {task.assigneeName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {!isCompleted ? (
                    <button
                      onClick={() => completeAnimalTask(task.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                    >
                      Complete
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs bg-white rounded-3xl border border-stone-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            No tasks found in this view.
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">Create Field Task</h2>
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Livestock</label>
              <select
                value={newTaskAnimalId}
                onChange={(e) => setNewTaskAnimalId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                {animals.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.primaryIdentifier || a.internalId}) - {a.useStatus}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Administer booster vaccine, OPU ultrasound check"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Task Type</label>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="HEALTH_CHECK">Health Check</option>
                  <option value="VACCINATION">Vaccination</option>
                  <option value="SAMPLING">Sampling</option>
                  <option value="WEIGHT_RECORDING">Weight Recording</option>
                  <option value="HOOF_TRIMMING">Hoof Trimming</option>
                  <option value="HEAT_CHECK">Heat Check</option>
                  <option value="REVIEW">Veterinary Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Protocol Notes</label>
              <textarea
                rows={3}
                placeholder="Specific instructions for technician or veterinarian..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
