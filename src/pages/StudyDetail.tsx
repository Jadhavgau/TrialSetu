import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { KpiCard } from '../components/ui/KpiCard';
import { DigitalSignatureModal } from '../components/ui/DigitalSignatureModal';
import {
  Activity,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Shield,
  Stethoscope,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { Milestone } from '../types/clinical';

export const StudyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const {
    studies,
    participants,
    milestones,
    adverseEvents,
    documents,
    auditLogs,
    signMilestone,
    addAuditLog,
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'enrollment' | 'participants' | 'milestones' | 'safety' | 'documents' | 'notes' | 'audit'>('overview');
  const [selectedMilestoneForSign, setSelectedMilestoneForSign] = useState<Milestone | null>(null);
  const [notes, setNotes] = useState<{ id: string; author: string; date: string; text: string }[]>([
    {
      id: 'N-1',
      author: 'Dr. Ananya Rao (PI)',
      date: '2026-09-24 11:30 AM',
      text: 'Interim blood pressure telemetry data from Pune and Delhi sites shows consistent mean systolic reduction of 14 mmHg in Arm A cohort. Preparing data snapshot for DSMB meeting.',
    },
    {
      id: 'N-2',
      author: 'Priya Sharma (Coordinator)',
      date: '2026-09-20 02:15 PM',
      text: 'Subject recruitment at Jaipur NIA site increased following patient awareness camp. 12 new screening appointments scheduled for next week.',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Find study by id or code
  const study = studies.find((s) => s.id === id || s.code.toLowerCase() === id?.toLowerCase()) || studies[0];
  const studyParticipants = participants.filter((p) => p.studyCode === study.code);
  const studyMilestones = milestones.filter((m) => m.studyCode === study.code);
  const studyAEs = adverseEvents.filter((ae) => ae.studyCode === study.code);
  const studyDocs = documents.filter((d) => d.studyCode === study.code);
  const studyLogs = auditLogs.filter((l) => !l.studyCode || l.studyCode === study.code);

  const enrollmentPercent = Math.round((study.enrolled / study.enrollmentTarget) * 100);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'regulator' || !newNoteText.trim() || !user) return;

    const newNote = {
      id: `N-${Date.now()}`,
      author: `${user.name} (${user.role.toUpperCase()})`,
      date: 'Just now',
      text: newNoteText.trim(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
    addAuditLog(
      'DOCUMENT_UPLOADED',
      `Research clinical note recorded for ${study.code} by ${user.name}.`,
      study.code,
      user.name,
      user.role
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(role ? `/${role}` : '/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1F3A34] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C2801F]" />
          <span>Back to {role?.toUpperCase()} Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">CTRI No:</span>
          <span className="font-mono text-xs font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
            {study.ctriNumber}
          </span>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-code text-xs font-bold bg-[#f2f7f5] text-[#1F3A34] border border-[#e2edea] px-2.5 py-1 rounded-md">
                {study.code}
              </span>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                {study.phase}
              </span>
              <span className="text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
                Stage: {study.stage}
              </span>
              <StatusBadge status={study.status} />
            </div>

            <h1 className="font-heading text-2xl font-bold text-slate-900 leading-tight">
              {study.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#C2801F]" />
              <span>Indication: <strong>{study.indication}</strong></span>
              <span className="mx-2 text-slate-300">•</span>
              <span>Product: <strong>{study.investigationalProduct}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f2f7f5] p-3.5 rounded-xl border border-[#e2edea] text-center min-w-[120px]">
              <p className="text-[10px] uppercase font-semibold text-[#1F3A34] tracking-wider">
                Enrollment
              </p>
              <div className="text-xl font-heading font-bold text-[#1F3A34] mt-0.5">
                {study.enrolled} / {study.enrollmentTarget}
              </div>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                {enrollmentPercent}% achieved
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'enrollment', label: 'Enrollment', icon: TrendingUp },
            { id: 'participants', label: `Participants (${studyParticipants.length})`, icon: Users },
            { id: 'milestones', label: `Milestones (${studyMilestones.length})`, icon: Calendar },
            { id: 'safety', label: `Safety & AEs (${studyAEs.length})`, icon: Activity },
            { id: 'documents', label: `Documents (${studyDocs.length})`, icon: FileCheck },
            { id: 'notes', label: `Research Notes (${notes.length})`, icon: MessageSquare },
            { id: 'audit', label: 'Audit Trail', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isCurrent
                    ? 'border-[#1F3A34] text-[#1F3A34]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C2801F]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard label="Phase" value={study.phase} accent="forest" />
            <KpiCard label="Enrollment Rate" value={`${enrollmentPercent}%`} subtext={`${study.enrolled} of ${study.enrollmentTarget} Target`} accent="turmeric" />
            <KpiCard label="Visit Compliance" value={`${study.visitCompliance}%`} accent="forest" />
            <KpiCard label="Open SAEs" value={study.seriousAEs} subtext={`${study.totalAEs} total AEs`} accent={study.seriousAEs > 0 ? 'brick' : 'slate'} highlight={study.seriousAEs > 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900">Protocol Summary</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{study.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Principal Investigator</span>
                  <span className="font-semibold text-slate-800">{study.piName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Coordinator</span>
                  <span className="font-semibold text-slate-800">{study.coordinatorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">IEC Approval Date</span>
                  <span className="font-semibold text-slate-800">{study.iecApprovalDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Study Start Date</span>
                  <span className="font-semibold text-slate-800">{study.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Forecast Completion</span>
                  <span className="font-semibold text-slate-800">{study.forecastDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Protocol Deviations</span>
                  <span className="font-semibold text-slate-800">{study.protocolDeviations} logged</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900">Participating Sites</h3>
              <div className="space-y-2.5">
                {study.sitesList.map((siteName, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#C2801F] shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{siteName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Study Cohort Roster</h3>
              <p className="text-xs text-slate-500">Subject demographics, consenting status, and active visits</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Subject ID</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Arm</th>
                  <th className="px-4 py-3">Compliance</th>
                  <th className="px-4 py-3">Next Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studyParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No participants registered for this study yet.
                    </td>
                  </tr>
                ) : (
                  studyParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-code font-bold text-[#1F3A34]">{p.id}</td>
                      <td className="px-4 py-3 text-slate-700">{p.siteName}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                          {p.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            p.consentVerified ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.consentVersion} {p.consentVerified ? '(Verified)' : '(Pending)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.randomizationArm || 'Pending'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.complianceRate}%</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{p.nextVisit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Key Study Milestones</h3>
              <p className="text-xs text-slate-500">Regulatory checkpoints and electronic signature records</p>
            </div>
          </div>
          <div className="space-y-3">
            {studyMilestones.map((m) => (
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
                    <span>Due: <strong className="font-mono text-slate-700">{m.dueDate}</strong></span>
                    <span>Role: {m.assignedRole}</span>
                    {m.signerName && <span>Signed by: <strong className="text-emerald-800">{m.signerName}</strong></span>}
                  </div>
                </div>

                {m.requiresSignature && m.status === 'Pending' && role === 'pi' && (
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

      {/* Safety & AEs Tab */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">Safety & Adverse Events</h3>
            <p className="text-xs text-slate-500">Adverse event records and MedDRA term codings</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">AE ID</th>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">MedDRA Term</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studyAEs.map((ae) => (
                  <tr key={ae.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-code font-bold text-[#A23A2C]">{ae.id}</td>
                    <td className="px-4 py-3 font-code text-slate-700">{ae.participantId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${ae.isSerious ? 'bg-rose-100 text-[#A23A2C]' : 'bg-slate-100 text-slate-700'}`}>
                        {ae.severity} {ae.isSerious && '(SAE)'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 max-w-xs truncate">{ae.description}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{ae.meddraTerm || 'Uncoded'}</td>
                    <td className="px-4 py-3"><StatusBadge status={ae.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Trial Master File Documents</h3>
              <p className="text-xs text-slate-500">Official protocol versions, approvals, and regulatory filings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studyDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <span className="font-code text-[11px] text-slate-400 block">{doc.id} • {doc.category}</span>
                  <h4 className="font-semibold text-xs text-slate-900 mt-1">{doc.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>{doc.version}</span>
                    <span>{doc.fileSize}</span>
                    <StatusBadge status={doc.status} />
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-[#1F3A34] transition-colors" title="Download Document">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Notes Tab */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900">Clinical Research Notes</h3>
            <p className="text-xs text-slate-500">Investigator and clinical team contemporaneous progress observations</p>
          </div>

          {/* New note input (hidden for regulator) */}
          {role !== 'regulator' ? (
            <form onSubmit={handleAddNote} className="space-y-3 bg-[#f2f7f5] p-4 rounded-xl border border-[#e2edea]">
              <label className="block text-xs font-semibold text-[#1F3A34]">Add Investigator Observation / Note</label>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Record observation regarding protocol adherence, clinical observations, or site updates..."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1F3A34]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1F3A34] hover:bg-[#152723] text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5 text-[#C2801F]" />
                  <span>Post Research Note</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Statutory Read-Only Access:</strong> Regulators possess view-only inspection access. Investigator observations and research notes are strictly managed by protocol investigators.
              </span>
            </div>
          )}

          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{n.author}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{n.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">Cryptographic Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable 21 CFR Part 11 compliant event log for {study.code}</p>
          </div>
          <div className="divide-y divide-slate-100">
            {studyLogs.slice(0, 8).map((log) => (
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
    </div>
  );
};
