import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DigitalSignatureModal } from '../../components/ui/DigitalSignatureModal';
import { Milestone } from '../../types/clinical';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const PiPortal: React.FC = () => {
  const { user } = useAuth();
  const { studies, milestones, documents, auditLogs, signMilestone } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMilestoneForSign, setSelectedMilestoneForSign] = useState<Milestone | null>(null);

  // Filter studies where Dr. Ananya Rao is PI (or matching piId)
  const myStudies = studies.filter((s) => s.piId === 'USR-001' || s.piName.includes('Ananya'));
  const pendingMilestones = milestones.filter((m) => m.requiresSignature && m.status === 'Pending');
  const studiesAtRisk = myStudies.filter((s) => s.status === 'Risk' || s.status === 'Watch').length;

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              PI INVESTIGATOR SUITE
            </span>
            <span className="text-xs text-slate-400">• Kayachikitsa Division</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Dr. Ananya Rao'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Protocol oversight, clinical trial compliance, milestone authorizations, and institutional safety surveillance for All India Institute of Ayurveda.
          </p>
        </div>

        {pendingMilestones.length > 0 && (
          <div className="flex items-center gap-3 bg-[#fdf8ed] border border-[#fceed2] p-3 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-[#C2801F] text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">{pendingMilestones.length} Pending E-Signatures</p>
              <p className="text-[11px] text-amber-700">21 CFR Part 11 cryptographic signoff required</p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="My Active Studies"
          value={`0${myStudies.length}`}
          subtext="Protocol lead & principal investigator"
          icon={BookOpen}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Enrollment Progress"
          value="68%"
          subtext="342 of 500 subjects enrolled"
          icon={TrendingUp}
          trend={{ value: '+4.2%', isPositive: true, label: 'this month' }}
          accent="turmeric"
        />
        <KpiCard
          label="Pending Signatures"
          value={`0${pendingMilestones.length}`}
          subtext="Protocol amendments & site reports"
          icon={Award}
          accent="brick"
          highlight={pendingMilestones.length > 0}
        />
        <KpiCard
          label="Studies at Risk"
          value={`0${studiesAtRisk}`}
          subtext="AYU-DM-002 requiring enrollment pace review"
          icon={AlertTriangle}
          accent="slate"
        />
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Study Overview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Principal Investigator Study Portfolio
                </h3>
                <button
                  onClick={() => setActiveTab('studies')}
                  className="text-xs font-semibold text-[#1F3A34] hover:underline"
                >
                  View All Studies →
                </button>
              </div>

              <div className="space-y-3.5">
                {myStudies.map((s) => {
                  const pct = Math.round((s.enrolled / s.enrollmentTarget) * 100);
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-[#1F3A34]/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/studies/${s.code}`)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-code text-xs font-bold bg-[#f2f7f5] text-[#1F3A34] px-2 py-0.5 rounded border border-[#e2edea]">
                              {s.code}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {s.phase}
                            </span>
                            <span className="text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-medium">
                              Stage: {s.stage}
                            </span>
                            <StatusBadge status={s.status} />
                          </div>
                          <h4 className="font-heading font-bold text-slate-900 text-base">
                            {s.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Enrollment</span>
                            <span className="font-bold text-slate-800">{s.enrolled} / {s.enrollmentTarget} ({pct}%)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sites</span>
                            <span className="font-medium text-slate-800">{s.sitesCount} research sites</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Compliance</span>
                            <span className="font-semibold text-emerald-800">{s.visitCompliance}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${s.status === 'On Track' ? 'bg-[#1F3A34]' : 'bg-[#C2801F]'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Pending E-Signatures & Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Pending E-Signatures
                </h3>
                <span className="text-xs text-slate-500 font-mono">{pendingMilestones.length} actions</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
                {pendingMilestones.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                    All protocol milestones signed and up to date!
                  </div>
                ) : (
                  pendingMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-lg border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/70 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-code text-[11px] text-[#1F3A34] font-semibold block">
                            {m.studyCode} • {m.type}
                          </span>
                          <h5 className="font-semibold text-xs text-slate-900 leading-snug">{m.title}</h5>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                          Due: {m.dueDate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">Signer: {m.signerName}</span>
                        <button
                          onClick={() => setSelectedMilestoneForSign(m)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#1F3A34] hover:bg-[#152723] text-white text-xs font-semibold rounded-md shadow-2xs transition-all"
                        >
                          <Award className="w-3.5 h-3.5 text-[#C2801F]" />
                          <span>Sign Milestone</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <div className="p-3 bg-[#f2f7f5] rounded-lg border border-[#e2edea] text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1F3A34] shrink-0 mt-0.5" />
                  <span>
                    Electronic signatures are authenticated via SHA-256 cryptographic keys and archived in the immutable CTMS audit trail.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Studies Tab */}
      {activeTab === 'studies' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">My Clinical Studies Registry</h3>
              <p className="text-xs text-slate-500">Protocol phases, recruitment status, and compliance scores</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Study</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3">Compliance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myStudies.map((s) => {
                  const pct = Math.round((s.enrolled / s.enrollmentTarget) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-code font-bold text-[#1F3A34]">{s.code}</div>
                        <div className="text-slate-700 font-medium line-clamp-1">{s.title}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{s.phase}</td>
                      <td className="px-4 py-3 text-slate-700">{s.stage}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900">{s.enrolled} / {s.enrollmentTarget}</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">({pct}%)</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-800">{s.visitCompliance}%</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/studies/${s.code}`)}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#1F3A34] hover:text-white rounded text-xs font-semibold transition-colors"
                        >
                          Open Study →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Milestones & Signatures Tab */}
      {(activeTab === 'milestones' || activeTab === 'signatures') && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Milestones & Electronic Signatures</h3>
              <p className="text-xs text-slate-500">21 CFR Part 11 compliant milestone signoffs for Dr. Ananya Rao</p>
            </div>
          </div>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code text-xs font-semibold text-[#1F3A34]">{m.id}</span>
                    <span className="text-xs font-bold text-slate-900">{m.title}</span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                    <span>Study: <strong className="font-code text-slate-700">{m.studyCode}</strong></span>
                    <span>Due: <strong className="font-mono text-slate-700">{m.dueDate}</strong></span>
                    {m.signerName && <span>Signed by: <strong className="text-emerald-800">{m.signerName}</strong></span>}
                  </div>
                </div>

                {m.requiresSignature && m.status === 'Pending' && (
                  <button
                    onClick={() => setSelectedMilestoneForSign(m)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A34] hover:bg-[#152723] text-white rounded-lg text-xs font-semibold transition-all shrink-0"
                  >
                    <Award className="w-3.5 h-3.5 text-[#C2801F]" />
                    <span>Sign Milestone</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Trial Master File Documents</h3>
              <p className="text-xs text-slate-500">Regulatory documentation, ethics submissions, and protocols</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <span className="font-code text-[11px] text-slate-400 block">{d.id} • {d.studyCode}</span>
                  <h4 className="font-semibold text-xs text-slate-900 mt-1">{d.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>{d.version}</span>
                    <span>{d.fileSize}</span>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">Principal Investigator Audit Trail</h3>
            <p className="text-xs text-slate-500">Cryptographically hashed actions recorded for AIIA clinical studies</p>
          </div>
          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-slate-500">• {log.actorName} ({log.actorRole})</span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.details}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  <div>{log.timestamp}</div>
                  <div className="text-[10px] text-slate-300 truncate max-w-[120px]">{log.hash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Signature Modal */}
      {selectedMilestoneForSign && (
        <DigitalSignatureModal
          milestone={selectedMilestoneForSign}
          signerName={user?.name || 'Dr. Ananya Rao'}
          signerRole={user?.title || 'Principal Investigator'}
          onConfirm={() => {
            signMilestone(selectedMilestoneForSign.id, user?.name || 'Dr. Ananya Rao');
            setSelectedMilestoneForSign(null);
          }}
          onClose={() => setSelectedMilestoneForSign(null)}
        />
      )}
    </SharedShell>
  );
};
