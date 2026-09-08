'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreeding } from '@/lib/bovine-breeding-store';
import { useBovine } from '@/lib/bovine-store';
import {
  Building2,
  Users,
  ShieldCheck,
  Plus,
  Mail,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function OrganizationManagementPage() {
  const { organizations } = useBreeding();
  const org = organizations[0];

  const [members, setMembers] = useState([
    {
      id: 'mem-1',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@holsteingenomics.org',
      role: 'BREEDING_DIRECTOR',
      status: 'ACTIVE',
      joinedDate: '2023-04-12',
    },
    {
      id: 'mem-2',
      name: 'Marcus Vance',
      email: 'm.vance@holsteingenomics.org',
      role: 'GENETICS_ANALYST',
      status: 'ACTIVE',
      joinedDate: '2023-08-01',
    },
    {
      id: 'mem-3',
      name: 'Elena Rostova',
      email: 'e.rostova@holsteingenomics.org',
      role: 'AI_TECHNICIAN',
      status: 'ACTIVE',
      joinedDate: '2024-01-15',
    },
    {
      id: 'mem-4',
      name: 'Dr. David Chen',
      email: 'd.chen@holsteingenomics.org',
      role: 'VETERINARIAN',
      status: 'ACTIVE',
      joinedDate: '2024-05-10',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('AI_TECHNICIAN');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    setMembers([
      ...members,
      {
        id: `mem-${Date.now()}`,
        name: newName,
        email: newEmail,
        role: newRole,
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().slice(0, 10),
      },
    ]);

    setNewEmail('');
    setNewName('');
    setModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Multi-Tenant Enterprise &amp; Governance • Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Organization &amp; Access Control</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage breeding enterprise profile, tenant hierarchy, user role permissions, and compliance scopes.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Organization Info Card */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {org?.code || 'ORG-HOLSTEIN-INTL'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ENTERPRISE
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              {org?.name || 'Holstein International Breeding Syndicate'}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Type: Commercial Dairy &amp; Artificial Insemination Stud &bull; Country: United States &bull; NAAB Code: 029
            </p>
          </div>

          <div className="text-right text-xs text-stone-500">
            <div>Tenant ID: <span className="font-mono text-stone-800">{org?.id || 'org-1'}</span></div>
            <div>Data Isolation: Dedicated Firestore Multi-Region</div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Active Organization Members ({members.length})
            </h2>
          </div>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="p-3.5">Member Name</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Member Since</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {members.map((mem) => (
              <tr key={mem.id} className="hover:bg-stone-50">
                <td className="p-3.5 font-bold text-stone-900">{mem.name}</td>
                <td className="p-3.5 font-mono text-stone-600">{mem.email}</td>
                <td className="p-3.5">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      mem.role === 'BREEDING_DIRECTOR'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : mem.role === 'GENETICS_ANALYST'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    {mem.role}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {mem.status}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-stone-500">{mem.joinedDate}</td>
                <td className="p-3.5 text-right">
                  <button className="text-stone-400 hover:text-stone-700 font-semibold text-xs">
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix Preview */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Role-Based Access Control (RBAC) Entitlements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900">Breeding Director</span>
            <p className="text-[11px] text-stone-500">
              Full authority to create breeding programs, authorize selection index revisions, and approve seasonal mating plans.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900">Genetics Analyst</span>
            <p className="text-[11px] text-stone-500">
              Authority to upload evaluation run files, configure index component weights, run candidate simulations, and analyze inbreeding trends.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900">AI / ET Technician</span>
            <p className="text-[11px] text-stone-500">
              Authority to execute semen dispensations, log embryo transfers, update pregnancy check outcomes, and log field overrides.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Invite New Organization Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Watson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 bg-white font-mono"
                >
                  <option value="BREEDING_DIRECTOR">Breeding Director</option>
                  <option value="GENETICS_ANALYST">Genetics Analyst</option>
                  <option value="AI_TECHNICIAN">AI Technician</option>
                  <option value="VETERINARIAN">Veterinarian</option>
                  <option value="AUDITOR">Auditor / Read-Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
