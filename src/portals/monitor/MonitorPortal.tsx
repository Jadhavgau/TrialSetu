import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AlertOctagon,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Home,
  MapPin,
  Shield,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export const MonitorPortal: React.FC = () => {
  const { user } = useAuth();
  const { sites, deviations, resolveDeviation } = useData();

  const [activeTab, setActiveTab] = useState('overview');

  const openDeviationsCount = deviations.filter((d) => d.status !== 'Resolved').length;

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              CRA SITE MONITORING & GCP AUDIT
            </span>
            <span className="text-xs text-slate-400">• Quality Assurance Cell</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Rahul Joshi'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Multi-site clinical inspection logs, source data verification (SDV), protocol deviation management, and Good Clinical Practice (GCP) compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-center min-w-[130px]">
            <p className="text-[10px] uppercase font-bold text-teal-900 tracking-wider">Average Compliance</p>
            <p className="text-2xl font-heading font-bold text-teal-900 mt-0.5">91.4%</p>
            <p className="text-[10px] text-teal-700">12 assigned trial sites</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Assigned Sites"
          value="12"
          subtext="6 primary AIIA trial nodes"
          icon={Home}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Visits This Month"
          value="18"
          subtext="14 SIV/IMV completed • 4 scheduled"
          icon={Calendar}
          accent="blue"
        />
        <KpiCard
          label="GCP Compliance"
          value="91%"
          subtext="Portfolio mean source data verification"
          icon={Shield}
          trend={{ value: '+1.8%', isPositive: true }}
          accent="turmeric"
        />
        <KpiCard
          label="Open Deviations"
          value={`0${openDeviationsCount}`}
          subtext="2 major deviations requiring resolution"
          icon={AlertOctagon}
          accent="brick"
          highlight={openDeviationsCount > 0}
        />
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assigned Sites Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Assigned Research Sites Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Source data verification progress, visit cadence, and open protocol discrepancies
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('sites')}
                  className="text-xs font-semibold text-[#1F3A34] hover:underline"
                >
                  View All Sites →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Site Name</th>
                      <th className="px-3.5 py-2.5">City / State</th>
                      <th className="px-3.5 py-2.5">Last Visit</th>
                      <th className="px-3.5 py-2.5">Next Visit</th>
                      <th className="px-3.5 py-2.5">Compliance</th>
                      <th className="px-3.5 py-2.5">Deviations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sites.map((site) => (
                      <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-3">
                          <div className="font-semibold text-slate-900">{site.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{site.id}</div>
                        </td>
                        <td className="px-3.5 py-3 text-slate-600">
                          {site.city}, {site.state}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-600">{site.lastAuditDate}</td>
                        <td className="px-3.5 py-3 font-mono text-emerald-700 font-semibold">{site.nextVisitDate}</td>
                        <td className="px-3.5 py-3">
                          <span className="font-bold text-emerald-800">{site.complianceRate}%</span>
                        </td>
                        <td className="px-3.5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              site.openDeviations > 0
                                ? 'bg-rose-100 text-[#A23A2C]'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {site.openDeviations} open
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Protocol Deviations Queue */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Protocol Deviations Log
                  </h3>
                  <p className="text-xs text-slate-500">{openDeviationsCount} open GCP observations</p>
                </div>
              </div>

              <div className="space-y-3">
                {deviations.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-code text-xs font-bold text-[#A23A2C]">{dev.id}</span>
                      <StatusBadge status={dev.status} />
                    </div>
                    <h5 className="font-semibold text-xs text-slate-900">{dev.description}</h5>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>Study: <strong className="font-code text-slate-700">{dev.studyCode}</strong></div>
                      <div>Site: {dev.siteName}</div>
                      <div>Severity: <strong className="text-slate-800">{dev.severity}</strong></div>
                    </div>

                    {dev.status !== 'Resolved' && (
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() =>
                            resolveDeviation(
                              dev.id,
                              'CRA verified corrective re-training and confirmed GCP reconciliation.',
                              user?.name || 'Rahul Joshi'
                            )
                          }
                          className="px-2.5 py-1 bg-[#1F3A34] text-white hover:bg-[#152723] rounded text-xs font-semibold shadow-2xs transition-colors"
                        >
                          Document Resolution
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Sites Full View */}
      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-code text-xs font-bold text-[#1F3A34]">{s.id}</span>
                  <h4 className="font-heading font-bold text-slate-900 text-base mt-0.5">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.city}, {s.state}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Assigned PI:</span>
                  <span className="font-semibold text-slate-800">{s.assignedPi}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Coordinator:</span>
                  <span className="font-semibold text-slate-800">{s.coordinator}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Rate:</span>
                  <span className="font-bold text-emerald-800">{s.complianceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Next SIV/IMV Visit:</span>
                  <span className="font-mono text-slate-800 font-semibold">{s.nextVisitDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Protocol Deviations Tab */}
      {activeTab === 'deviations' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">Protocol Deviations Full Log</h3>
            <p className="text-xs text-slate-500">Comprehensive list of protocol exceptions and audit observations</p>
          </div>
          <div className="divide-y divide-slate-100">
            {deviations.map((dev) => (
              <div key={dev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code font-bold text-[#A23A2C]">{dev.id}</span>
                    <span className="font-semibold text-slate-900">{dev.category}</span>
                    <StatusBadge status={dev.status} />
                  </div>
                  <p className="text-slate-700 mt-1">{dev.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-[11px]">
                    <span>Study: <strong className="font-code text-slate-700">{dev.studyCode}</strong></span>
                    <span>Site: {dev.siteName}</span>
                    <span>Severity: <strong className="text-slate-800">{dev.severity}</strong></span>
                  </div>
                </div>

                {dev.status !== 'Resolved' && (
                  <button
                    onClick={() =>
                      resolveDeviation(
                        dev.id,
                        'CRA verified corrective re-training and confirmed GCP reconciliation.',
                        user?.name || 'Rahul Joshi'
                      )
                    }
                    className="px-3 py-1.5 bg-[#1F3A34] text-white hover:bg-[#152723] rounded-lg font-semibold shrink-0"
                  >
                    Resolve Deviation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </SharedShell>
  );
};
