import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  Search,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

export const CoordinatorPortal: React.FC = () => {
  const { user } = useAuth();
  const { participants, queries, markConsentComplete, resolveDataQuery } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Funnel numbers
  const funnelSteps = [
    { label: 'Identified', count: 1560, pct: '100%', drop: null },
    { label: 'Screened', count: 1284, pct: '82.3%', drop: '-17.7%' },
    { label: 'Eligible', count: 980, pct: '62.8%', drop: '-23.6%' },
    { label: 'Consented', count: 921, pct: '59.0%', drop: '-6.0%' },
    { label: 'Enrolled', count: 842, pct: '54.0%', drop: '-8.5%' },
    { label: 'Randomized', count: 780, pct: '50.0%', drop: '-7.4%' },
  ];

  const pendingConsentList = participants.filter((p) => !p.consentVerified);

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              COORDINATOR OPERATIONS HUB
            </span>
            <span className="text-xs text-slate-400">• Central Trials Unit</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Priya Sharma'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Real-time participant screening pipelines, ICF consenting verification, data queries resolution, and site visit schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#f2f7f5] border border-[#e2edea] p-3 rounded-xl text-center min-w-[130px]">
            <p className="text-[10px] uppercase font-bold text-[#1F3A34] tracking-wider">ICF Completion</p>
            <p className="text-2xl font-heading font-bold text-emerald-800 mt-0.5">94%</p>
            <p className="text-[10px] text-slate-500">38 pending verification</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Subjects Screened"
          value="1,284"
          subtext="+48 screened this week"
          icon={Filter}
          trend={{ value: '+8.4%', isPositive: true }}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Enrolled Cohort"
          value="842"
          subtext="65.5% of active phase target"
          icon={Users}
          accent="blue"
        />
        <KpiCard
          label="Consent Completion"
          value="94%"
          subtext="38 pending • 4 expired/review"
          icon={UserCheck}
          accent="turmeric"
        />
        <KpiCard
          label="Open Data Queries"
          value="27"
          subtext="3 escalated to site CRA"
          icon={HelpCircle}
          accent="brick"
          highlight
        />
      </div>

      {/* Main Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Visual Enrollment Funnel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Multicenter Enrollment Funnel
                </h3>
                <p className="text-xs text-slate-500">
                  Conversion metrics from community identification to active randomized treatment
                </p>
              </div>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                Portfolio Conversion: 50.0%
              </span>
            </div>

            {/* Visual Funnel Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {funnelSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 relative flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span>Step 0{idx + 1}</span>
                    <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {step.pct}
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      {step.label}
                    </span>
                    <span className="font-heading text-2xl font-bold text-slate-900 mt-0.5 block">
                      {step.count.toLocaleString()}
                    </span>
                  </div>
                  {step.drop && (
                    <div className="flex items-center gap-1 text-[10px] text-rose-700 font-medium pt-2 border-t border-slate-200/60">
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                      <span>{step.drop} drop-off</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2 Columns: Consent Verification + Open Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consent Module */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Consent Verification Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    94% Verified • 38 Pending Countersignature
                  </p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200">
                  {pendingConsentList.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {pendingConsentList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    All participant consent records verified!
                  </div>
                ) : (
                  pendingConsentList.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-code font-bold text-[#1F3A34] text-xs">{p.id}</span>
                          <span className="font-medium text-xs text-slate-800">{p.studyCode}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                            {p.consentVersion}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Site: {p.siteName} • Signed on: {p.consentDate}
                        </p>
                      </div>

                      <button
                        onClick={() => markConsentComplete(p.id, user?.name || 'Priya Sharma')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A34] hover:bg-[#152723] text-white rounded-lg text-xs font-semibold shadow-2xs transition-all shrink-0"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#C2801F]" />
                        <span>Verify Consent</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Open Data Queries */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Active eCRF Data Queries
                  </h3>
                  <p className="text-xs text-slate-500">Discrepancies flagged by automated validation checks</p>
                </div>
                <span className="text-xs font-mono text-[#A23A2C] font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  {queries.filter((q) => q.status !== 'Closed').length} Active
                </span>
              </div>

              <div className="space-y-3">
                {queries.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-code text-[11px] text-[#A23A2C] font-bold">{q.id}</span>
                        <span className="font-semibold text-xs text-slate-900">{q.title}</span>
                        <StatusBadge status={q.status} />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{q.description}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500">
                        <span>Study: <strong className="font-code text-slate-700">{q.studyCode}</strong></span>
                        <span>Site: {q.siteName}</span>
                        <span>Age: <strong className="text-rose-700">{q.ageDays}d</strong></span>
                      </div>
                    </div>

                    {q.status !== 'Closed' && (
                      <button
                        onClick={() => resolveDataQuery(q.id, user?.name || 'Priya Sharma')}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#1F3A34] text-[#1F3A34] rounded-lg text-xs font-semibold shadow-2xs transition-all shrink-0"
                      >
                        Resolve Query
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Roster Tab */}
      {(activeTab === 'participants' || activeTab === 'enrollment' || activeTab === 'screening') && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Participant Operational Registry
              </h3>
              <p className="text-xs text-slate-500">
                Screening identification, ICF tracking, visit windows, and protocol milestones
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject or study..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-hidden focus:ring-1 focus:ring-[#1F3A34]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Subject ID</th>
                  <th className="px-4 py-3">Study</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Compliance</th>
                  <th className="px-4 py-3">Next Visit</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants
                  .filter(
                    (p) =>
                      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.studyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.siteName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-code font-bold text-[#1F3A34]">{p.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.studyCode}</td>
                      <td className="px-4 py-3 text-slate-600">{p.siteName}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                          {p.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold inline-flex items-center gap-1 ${
                            p.consentVerified ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.consentVersion} {p.consentVerified ? '(Verified)' : '(Pending)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.complianceRate}%</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{p.nextVisit}</td>
                      <td className="px-4 py-3 text-right">
                        {!p.consentVerified && (
                          <button
                            onClick={() => markConsentComplete(p.id, user?.name || 'Priya Sharma')}
                            className="px-2.5 py-1 bg-[#1F3A34] text-white hover:bg-[#152723] rounded text-[11px] font-semibold transition-colors"
                          >
                            Verify ICF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Queries Tab */}
      {activeTab === 'queries' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                All Open Data Queries (eCRF Discrepancies)
              </h3>
              <p className="text-xs text-slate-500">27 total queries across multicenter sites</p>
            </div>
          </div>
          <div className="space-y-3">
            {queries.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code text-xs text-[#A23A2C] font-bold">{q.id}</span>
                    <span className="font-semibold text-xs text-slate-900">{q.title}</span>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{q.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Study: <strong className="font-code text-slate-800">{q.studyCode}</strong></span>
                    <span>Site: {q.siteName}</span>
                    <span>Age: <strong className="text-rose-700">{q.ageDays} days</strong></span>
                  </div>
                </div>

                {q.status !== 'Closed' && (
                  <button
                    onClick={() => resolveDataQuery(q.id, user?.name || 'Priya Sharma')}
                    className="px-3.5 py-1.5 bg-[#1F3A34] text-white hover:bg-[#152723] rounded-lg text-xs font-semibold shadow-2xs transition-all shrink-0"
                  >
                    Mark Resolved
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
