import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Home,
  Key,
  Lock,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const { users, sites, studies, toggleUserStatus, auditLogs } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('pi');

  const activeUsersCount = users.filter((u) => u.active).length;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    // User added in mock session
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              CTMS SYSTEM ADMINISTRATION & SECURITY
            </span>
            <span className="text-xs text-slate-400">• Health Informatics Cell</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Vikramaditya Sen'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Stakeholder identity lifecycle, Role-Based Access Control (RBAC) governance, trial site activation provisioning, and 21 CFR Part 11 system audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1F3A34] hover:bg-[#152723] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#C2801F]" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Provisioned Users"
          value="48"
          subtext={`${activeUsersCount} currently active across 8 roles`}
          icon={Users}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Active Users"
          value={`0${activeUsersCount}`}
          subtext="Authenticated within last 24 hours"
          icon={UserCheck}
          accent="blue"
        />
        <KpiCard
          label="Clinical Studies"
          value="16"
          subtext="6 active in recruitment cohort"
          icon={BookOpen}
          accent="turmeric"
        />
        <KpiCard
          label="Research Sites"
          value="32"
          subtext="AIIA central + 31 collaborative sites"
          icon={Home}
          accent="slate"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* User Management Roster */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Stakeholder RBAC User Management
                </h3>
                <p className="text-xs text-slate-500">
                  Active CTMS access credentials, security roles, and user status toggles
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter users or roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full sm:w-60 focus:outline-hidden focus:ring-1 focus:ring-[#1F3A34]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Name & Title</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter(
                      (u) =>
                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-code font-bold text-slate-700">{u.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{u.title}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] font-bold uppercase bg-slate-100 text-[#1F3A34] px-2 py-0.5 rounded border border-slate-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              u.active
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.active ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            ></span>
                            {u.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => toggleUserStatus(u.id, user?.name || 'Vikramaditya Sen')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors border ${
                              u.active
                                ? 'bg-white hover:bg-rose-50 text-[#A23A2C] border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {u.active ? 'Disable' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Site Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Multicenter Research Site Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Institutional site credentials, PIs, and GCP regulatory status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-code text-xs font-bold text-[#1F3A34]">{s.id}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.city}, {s.state}</p>
                  <div className="pt-2 border-t border-slate-200 text-xs space-y-1 text-slate-600">
                    <div>Assigned PI: <strong className="text-slate-800">{s.assignedPi}</strong></div>
                    <div>Coordinator: <strong className="text-slate-800">{s.coordinator}</strong></div>
                    <div>Compliance Rate: <strong className="text-emerald-800">{s.complianceRate}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">All CTMS Users Roster</h3>
              <p className="text-xs text-slate-500">Full identity registry with permission maps</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-[#1F3A34] text-white rounded-lg text-xs font-semibold"
            >
              + Add User
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{u.name}</span>
                  <span className="text-slate-500 ml-2">({u.email})</span>
                  <div className="text-[11px] text-slate-400">{u.title} • {u.department}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                  <button
                    onClick={() => toggleUserStatus(u.id, user?.name || 'Vikramaditya Sen')}
                    className="text-xs font-medium text-slate-600 hover:text-[#1F3A34]"
                  >
                    {u.active ? 'Disable' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal Mock */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900">Provision New TrialSetu User</h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar, MD"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rkumar@aiia.gov.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  <option value="pi">Principal Investigator (PI)</option>
                  <option value="coordinator">Clinical Coordinator</option>
                  <option value="monitor">Clinical Monitor (CRA)</option>
                  <option value="ethics">Ethics Committee Member</option>
                  <option value="pv">Pharmacovigilance Officer</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1F3A34] text-white rounded-lg font-semibold"
                >
                  Save & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SharedShell>
  );
};
