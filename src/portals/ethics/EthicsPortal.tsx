import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Shield,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const EthicsPortal: React.FC = () => {
  const { user } = useAuth();
  const { consentVersions, approveIecItem } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [submissions, setSubmissions] = useState([
    {
      id: 'IEC-SUB-201',
      study: 'AYU-HTN-001',
      submissionType: 'Protocol Amendment v2 (Dosage Titration Protocol)',
      submittedDate: '27 Sep 2026',
      submittedBy: 'Dr. Ananya Rao (PI)',
      status: 'Pending',
      urgency: 'Standard Expedited',
    },
    {
      id: 'IEC-SUB-199',
      study: 'AYU-DM-002',
      submissionType: 'Informed Consent Form Revision (Consent v3.0)',
      submittedDate: '25 Sep 2026',
      submittedBy: 'Priya Sharma (Coordinator)',
      status: 'Under Review',
      urgency: 'High (Re-consent pending)',
    },
    {
      id: 'IEC-SUB-192',
      study: 'AYU-ARTH-003',
      submissionType: 'Annual Continuing Review Report 2026',
      submittedDate: '20 Sep 2026',
      submittedBy: 'Dr. Harish Chandra (PI)',
      status: 'Approved',
      urgency: 'Routine Annual',
    },
    {
      id: 'IEC-SUB-188',
      study: 'AYU-IMM-004',
      submissionType: 'Interim DSMB Safety Assessment Dossier',
      submittedDate: '15 Sep 2026',
      submittedBy: 'Dr. Ananya Rao (PI)',
      status: 'Approved',
      urgency: 'Routine Periodic',
    },
  ]);

  const handleApprove = (id: string, title: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Approved' } : s))
    );
    approveIecItem(title, user?.name || 'Dr. V. K. Nambiar');
  };

  const pendingCount = submissions.filter((s) => s.status !== 'Approved').length;

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              INSTITUTIONAL ETHICS COMMITTEE (IEC) SECRETARIAT
            </span>
            <span className="text-xs text-slate-400">• Human Research Protection</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Dr. V. K. Nambiar'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Ethical review clearance dossiers, Informed Consent Form (ICF) version tracking, serious adverse event ethical oversight, and annual study renewals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-center min-w-[130px]">
            <p className="text-[10px] uppercase font-bold text-purple-900 tracking-wider">Pending Agenda</p>
            <p className="text-2xl font-heading font-bold text-purple-900 mt-0.5">07</p>
            <p className="text-[10px] text-purple-700">Next meeting: 03 Oct</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pending Reviews"
          value="07"
          subtext="2 expedited • 5 full board review"
          icon={Clock}
          accent="brick"
          highlight
        />
        <KpiCard
          label="Approved This Month"
          value="14"
          subtext="Protocols & safety amendments"
          icon={CheckCircle2}
          trend={{ value: '+4', isPositive: true }}
          accent="forest"
        />
        <KpiCard
          label="Consent Versions"
          value="22"
          subtext="Controlled bilingual ICF documents"
          icon={FileCheck}
          accent="turmeric"
        />
        <KpiCard
          label="Expiring Approvals"
          value="03"
          subtext="Renewal required within 30 days"
          icon={AlertTriangle}
          accent="slate"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* IEC Approval Queue */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    IEC Formal Submission Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Protocol amendments, annual reports, and patient documentation requiring committee decision
                  </p>
                </div>
                <span className="text-xs font-mono bg-purple-50 text-purple-900 font-semibold px-2.5 py-1 rounded border border-purple-200">
                  {pendingCount} Pending Approvals
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Study</th>
                      <th className="px-3.5 py-2.5">Submission Details</th>
                      <th className="px-3.5 py-2.5">Submitted</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-3">
                          <div className="font-code font-bold text-[#1F3A34]">{sub.study}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sub.id}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-semibold text-slate-900">{sub.submissionType}</div>
                          <div className="text-[11px] text-slate-500">{sub.submittedBy}</div>
                        </td>
                        <td className="px-3.5 py-3 text-slate-600 font-mono whitespace-nowrap">
                          {sub.submittedDate}
                        </td>
                        <td className="px-3.5 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          {sub.status !== 'Approved' ? (
                            <button
                              onClick={() => handleApprove(sub.id, sub.submissionType)}
                              className="px-3 py-1 bg-[#1F3A34] hover:bg-[#152723] text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-emerald-700 text-xs font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Cleared
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consent Version History */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Consent Version History
                  </h3>
                  <p className="text-xs text-slate-500">Controlled informed consent revisions</p>
                </div>
              </div>

              <div className="space-y-3">
                {consentVersions.map((cv) => (
                  <div
                    key={cv.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-slate-900">{cv.version}</span>
                      <StatusBadge status={cv.status} />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{cv.changesSummary}</p>
                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Study: <strong className="font-code text-slate-700">{cv.studyCode}</strong></span>
                      <span>Effective: <strong className="font-mono text-slate-700">{cv.effectiveDate}</strong></span>
                    </div>
                    {cv.reconsentRequired && (
                      <span className="inline-block text-[10px] font-semibold bg-rose-50 text-[#A23A2C] px-2 py-0.5 rounded border border-rose-200">
                        Participant Re-consent Mandatory
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Versions Tab */}
      {activeTab === 'consent-versions' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Institutional Consent Version Control Log
            </h3>
            <p className="text-xs text-slate-500">
              Approved, under-review, and superseded informed consent templates across all AIIA studies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consentVersions.map((cv) => (
              <div key={cv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-sm text-slate-900">{cv.version}</div>
                  <StatusBadge status={cv.status} />
                </div>
                <div className="text-xs text-slate-600">
                  Study: <strong className="font-code text-slate-800">{cv.studyCode}</strong> • Languages: {cv.language}
                </div>
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                  {cv.changesSummary}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Submitted by: {cv.submittedBy}</span>
                  <span className="font-mono">{cv.effectiveDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SharedShell>
  );
};
