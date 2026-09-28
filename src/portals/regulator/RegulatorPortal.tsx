import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Flame,
  Layers,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const RegulatorPortal: React.FC = () => {
  const { user } = useAuth();
  const { studies, adverseEvents, auditLogs, safetySignals } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [studyFilter, setStudyFilter] = useState('');
  const [selectedSignal, setSelectedSignal] = useState(safetySignals[0]);

  // Read-only compliance matrix dataset
  const complianceMatrix = [
    {
      code: 'AYU-HTN-001',
      title: 'Ayurvedic Intervention for Essential Hypertension',
      phase: 'Phase II',
      ctri: true,
      ctriNumber: 'CTRI/2025/11/048912',
      iec: true,
      iecClearanceDate: '2025-10-22',
      safety: true,
      overall: 'Compliant',
      lastInspection: '2026-08-14',
      pi: 'Dr. Ananya Rao',
      status: 'On Track',
    },
    {
      code: 'AYU-DM-002',
      title: 'Ayurvedic Diabetes Management Study',
      phase: 'Phase III',
      ctri: true,
      ctriNumber: 'CTRI/2025/07/045230',
      iec: true,
      iecClearanceDate: '2025-06-18',
      safety: false, // Flagged due to 24h SAE review
      overall: 'Review',
      lastInspection: '2026-09-02',
      pi: 'Dr. Ananya Rao',
      status: 'Watch',
    },
    {
      code: 'AYU-ARTH-003',
      title: 'Evaluation of Shallaki and Yograj Guggulu in Osteoarthritis',
      phase: 'Phase II',
      ctri: true,
      ctriNumber: 'CTRI/2025/12/049811',
      iec: false, // Overdue annual continuation dossier
      iecClearanceDate: '2025-11-28',
      safety: true,
      overall: 'Attention Required',
      lastInspection: '2026-07-22',
      pi: 'Dr. Harish Chandra',
      status: 'Risk',
    },
    {
      code: 'AYU-IMM-004',
      title: 'Ashwagandha & Guduchi in Immunosenescence in Geriatric Cohort',
      phase: 'Phase III',
      ctri: true,
      ctriNumber: 'CTRI/2025/04/043110',
      iec: true,
      iecClearanceDate: '2025-04-10',
      safety: true,
      overall: 'Compliant',
      lastInspection: '2026-08-28',
      pi: 'Dr. Ananya Rao',
      status: 'On Track',
    },
    {
      code: 'AYU-RESP-005',
      title: 'Clinical Efficacy of Kantakari Avaleha in Bronchial Asthma',
      phase: 'Phase II',
      ctri: true,
      ctriNumber: 'CTRI/2026/01/050412',
      iec: true,
      iecClearanceDate: '2026-01-15',
      safety: true,
      overall: 'Compliant',
      lastInspection: '2026-09-11',
      pi: 'Dr. Smita Patil',
      status: 'Watch',
    },
    {
      code: 'AYU-HEP-006',
      title: 'Standardized Bhumi Amla extract in Non-Alcoholic Fatty Liver Disease',
      phase: 'Phase I/II',
      ctri: true,
      ctriNumber: 'CTRI/2026/03/051892',
      iec: true,
      iecClearanceDate: '2026-03-02',
      safety: true,
      overall: 'Compliant',
      lastInspection: '2026-08-30',
      pi: 'Dr. Rameshwar Upadhyay',
      status: 'On Track',
    },
  ];

  // Portfolio charts data for regulator inspection
  const portfolioStatusData = [
    { name: 'On Track', value: 10, color: '#1F3A34' },
    { name: 'Under Review', value: 3, color: '#C2801F' },
    { name: 'Attention Required', value: 3, color: '#A23A2C' },
  ];

  const stagesData = [
    { stage: 'Protocol/IEC', count: 2 },
    { stage: 'CTRI Reg', count: 1 },
    { stage: 'Site Activation', count: 2 },
    { stage: 'Screening', count: 3 },
    { stage: 'Enrollment', count: 4 },
    { stage: 'Randomized', count: 2 },
    { stage: 'Ongoing', count: 1 },
    { stage: 'Close-out', count: 1 },
  ];

  const forecasts = [
    { code: 'AYU-HTN-001', title: 'Hypertension Sarpagandha Study', current: 342, target: 500, forecast: 'Dec 2026', risk: 'Low' },
    { code: 'AYU-DM-002', title: 'Diabetes Management Polyherbal', current: 184, target: 400, forecast: 'Mar 2027', risk: 'Medium' },
    { code: 'AYU-ARTH-003', title: 'Osteoarthritis Shallaki & Guggulu', current: 93, target: 300, forecast: 'Jun 2027', risk: 'High' },
    { code: 'AYU-IMM-004', title: 'Geriatric Immunosenescence Cohort', current: 512, target: 600, forecast: 'Nov 2026', risk: 'Low' },
  ];

  const seriousEvents = adverseEvents.filter((ae) => ae.isSerious);

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Prominent Statutory Read-Only Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C2801F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-amber-950">
                READ-ONLY REGULATORY INSPECTION SUITE
              </span>
              <span className="bg-[#1F3A34] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                CDSCO / AYUSH
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-0.5">
              Read-only statutory inspection access active. You can inspect protocol compliance, GCP trial dossiers, pharmacovigilance reports, portfolio trajectories, and cryptographic audit trails. Creation, editing, deletion, uploading, and configuration actions are strictly prohibited.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-950 bg-amber-200/50 px-3 py-1.5 rounded-lg border border-amber-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#1F3A34]" />
          <span>Statutory Inspection Role</span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              REGULATORY AUDIT & INSPECTION PORTAL
            </span>
            <span className="text-xs text-slate-400">• New Drugs & Clinical Trials Rules 2019</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Dr. R. C. Meena'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Independent statutory surveillance of All India Institute of Ayurveda clinical trials, CTRI registrations, ethical approvals, and serious adverse drug reactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center min-w-[130px]">
            <p className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">GCP Compliance</p>
            <p className="text-2xl font-heading font-bold text-amber-950 mt-0.5">81.3%</p>
            <p className="text-[10px] text-amber-700">13 of 16 fully cleared</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Registered Studies"
          value="16"
          subtext="Valid CTRI registered protocols"
          icon={BookOpen}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Fully Compliant"
          value="13"
          subtext="All regulatory criteria met"
          icon={CheckCircle2}
          accent="forest"
        />
        <KpiCard
          label="Under Review"
          value="02"
          subtext="Protocol / safety reviews pending"
          icon={Shield}
          accent="turmeric"
        />
        <KpiCard
          label="Attention Required"
          value="01"
          subtext="AYU-ARTH-003 overdue renewal"
          icon={AlertOctagon}
          accent="brick"
          highlight
        />
      </div>

      {/* TAB 1: Inspection Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statutory Compliance Matrix Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  National Clinical Trial Regulatory Compliance Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time statutory status across CTRI, Institutional Ethics Committees, and Serious AE reporting
                </p>
              </div>
              <button
                onClick={() => setActiveTab('compliance')}
                className="text-xs font-semibold text-[#1F3A34] hover:underline"
              >
                View Full Compliance Matrix →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Study Code</th>
                    <th className="px-4 py-3">Study Title</th>
                    <th className="px-4 py-3 text-center">CTRI Registry</th>
                    <th className="px-4 py-3 text-center">IEC Approval</th>
                    <th className="px-4 py-3 text-center">Safety Surveillance</th>
                    <th className="px-4 py-3 text-center">Overall Compliance</th>
                    <th className="px-4 py-3 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complianceMatrix.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-code font-bold text-[#1F3A34]">{item.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                          ✓
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.iec ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-[#A23A2C] font-bold">
                            !
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.safety ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800 font-bold">
                            !
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item.overall} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/studies/${item.code}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#1F3A34] hover:text-white rounded text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Pharmacovigilance Inspection Roster */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Statutory Serious Adverse Event (SAE) Submissions
                </h3>
                <p className="text-xs text-slate-500">
                  24-hour statutory notification audit trail under Section 39 of NDCTR Rules
                </p>
              </div>
              <button
                onClick={() => setActiveTab('safety')}
                className="text-xs font-semibold text-[#1F3A34] hover:underline"
              >
                Inspect All Safety Data →
              </button>
            </div>

            <div className="space-y-3">
              {seriousEvents.map((sae) => (
                <div
                  key={sae.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-code font-bold text-[#A23A2C]">{sae.id}</span>
                      <span className="font-semibold text-slate-900">Study: {sae.studyCode}</span>
                      <StatusBadge status={sae.status} />
                    </div>
                    <p className="text-slate-700 mt-1">{sae.description}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-[11px]">
                      <span>Participant: <strong className="font-code">{sae.participantId}</strong></span>
                      <span>Site: {sae.siteName}</span>
                      <span>MedDRA: {sae.meddraTerm}</span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] shrink-0">
                    <span className="text-slate-400 block">Statutory Filing Deadline</span>
                    <span className="font-mono font-bold text-[#A23A2C]">{sae.deadlineDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: View Compliance */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                National Clinical Trial Regulatory Compliance Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Statutory audit against CDSCO New Drugs and Clinical Trials Rules (NDCTR 2019) & Schedule Y
              </p>
            </div>
            <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
              Read-Only Audit Roster
            </span>
          </div>

          <div className="space-y-4">
            {complianceMatrix.map((item) => (
              <div
                key={item.code}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-code text-xs font-bold bg-[#f2f7f5] text-[#1F3A34] px-2 py-0.5 rounded border border-[#e2edea]">
                      {item.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{item.title}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {item.phase}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.overall} />
                    <button
                      onClick={() => navigate(`/studies/${item.code}`)}
                      className="px-2.5 py-1 bg-white hover:bg-[#1F3A34] hover:text-white border border-slate-200 rounded text-xs font-semibold transition-colors"
                    >
                      Inspect Dossier →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">CTRI Registry</span>
                    <span className="font-mono font-medium text-slate-800">{item.ctriNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">IEC Clearance</span>
                    <span className="font-mono font-medium text-slate-800">{item.iecClearanceDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Principal Investigator</span>
                    <span className="font-medium text-slate-800">{item.pi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last Field Audit</span>
                    <span className="font-mono font-medium text-slate-800">{item.lastInspection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: View Safety Information */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          {/* Multi-Study Safety Signal Detection Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#C2801F]" />
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Statutory Safety Signal Surveillance
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Read-only disproportionality surveillance across All India Institute of Ayurveda trial cohorts
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {safetySignals.map((sig) => (
                  <button
                    key={sig.id}
                    onClick={() => setSelectedSignal(sig)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedSignal.id === sig.id
                        ? 'bg-[#1F3A34] text-white border-[#1F3A34]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sig.symptom} ({sig.reportedEvents})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Safety Signal
                  </span>
                  <h4 className="font-heading font-bold text-slate-900 text-base mt-0.5">
                    {selectedSignal.symptom}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedSignal.meddraSoc}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Reported Incidents:</span>
                    <strong className="text-slate-900 font-mono">{selectedSignal.reportedEvents}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Affected Protocols:</span>
                    <strong className="text-slate-900 font-mono">{selectedSignal.affectedStudiesCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Surveillance Trend:</span>
                    <strong className="text-[#A23A2C]">{selectedSignal.trend}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <StatusBadge status={selectedSignal.status} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">
                    6-Month Longitudinal Frequency Velocity: {selectedSignal.symptom}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Disproportionality PRR 2.4</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSignal.historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F3A34',
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#C2801F"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#1F3A34', stroke: '#C2801F', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Full Adverse Event Roster (Read-Only) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-heading font-bold text-base text-slate-900">
                National Adverse Event (AE/SAE) Surveillance Register
              </h3>
              <p className="text-xs text-slate-500">
                Contemporaneous pharmacovigilance reports under statutory NDCTR Section 39 inspection
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Event ID</th>
                    <th className="px-4 py-3">Study</th>
                    <th className="px-4 py-3">Subject ID</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">MedDRA Classification</th>
                    <th className="px-4 py-3">Statutory Deadline</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adverseEvents.map((ae) => (
                    <tr key={ae.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-code font-bold text-[#A23A2C]">{ae.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{ae.studyCode}</td>
                      <td className="px-4 py-3 font-code text-slate-600">{ae.participantId}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            ae.isSerious ? 'bg-rose-100 text-[#A23A2C]' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ae.severity} {ae.isSerious && '⚠'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-xs">{ae.description}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{ae.meddraTerm || 'Pending coding'}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#A23A2C]">{ae.deadlineDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={ae.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: View Studies */}
      {activeTab === 'studies' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Registered Clinical Trial Dossiers</h3>
              <p className="text-xs text-slate-500">Read-only statutory inspection views of approved protocols</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter study code or PI..."
                value={studyFilter}
                onChange={(e) => setStudyFilter(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full sm:w-60 focus:outline-hidden focus:ring-1 focus:ring-[#1F3A34]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {studies
              .filter(
                (s) =>
                  s.code.toLowerCase().includes(studyFilter.toLowerCase()) ||
                  s.title.toLowerCase().includes(studyFilter.toLowerCase()) ||
                  s.piName.toLowerCase().includes(studyFilter.toLowerCase())
              )
              .map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-code font-bold text-[#1F3A34]">{s.code}</span>
                      <span className="font-bold text-slate-900">{s.title}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-slate-600 mt-1">{s.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-slate-400 text-[11px]">
                      <span>PI: <strong className="text-slate-700">{s.piName}</strong></span>
                      <span>CTRI: <strong className="font-mono text-slate-700">{s.ctriNumber}</strong></span>
                      <span>Enrolled: <strong>{s.enrolled} / {s.enrollmentTarget}</strong></span>
                      <span>Compliance: <strong className="text-emerald-800">{s.visitCompliance}%</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/studies/${s.code}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A34] text-white rounded-lg text-xs font-semibold shrink-0 shadow-2xs hover:bg-[#152723] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier →</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: View Portfolio Information */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Status Donut */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  National Portfolio Health Status
                </h3>
                <p className="text-xs text-slate-500">Inspection compliance status across 16 registered trials</p>
              </div>

              <div className="h-52 w-full flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {portfolioStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs">
                {portfolioStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600">{item.name}:</span>
                    <strong className="text-slate-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Studies by Clinical Stage (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Clinical Lifecycle Stage Distribution
                </h3>
                <p className="text-xs text-slate-500">Statutory protocol distribution across clinical development</p>
              </div>

              <div className="h-52 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stagesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="stage" stroke="#64748b" fontSize={10} angle={-25} textAnchor="end" height={40} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F3A34',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="count" fill="#1F3A34" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 text-center">
                Inspection cadence prioritizes protocols active in <strong>Screening & Randomized Treatment</strong>
              </div>
            </div>
          </div>

          {/* Enrollment Projections Table (Read-Only) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Cohort Enrollment Surveillance & Projections
              </h3>
              <p className="text-xs text-slate-500">
                Verification of trial completion trajectories against CTRI declared sample sizes
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Study</th>
                    <th className="px-4 py-3">Enrolled</th>
                    <th className="px-4 py-3">Declared Target</th>
                    <th className="px-4 py-3">Completion Pace</th>
                    <th className="px-4 py-3">Forecast Completion</th>
                    <th className="px-4 py-3">Regulatory Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {forecasts.map((f) => {
                    const pct = Math.round((f.current / f.target) * 100);
                    return (
                      <tr key={f.code} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-code font-bold text-[#1F3A34]">{f.code}</div>
                          <div className="text-slate-600 text-[11px]">{f.title}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{f.current}</td>
                        <td className="px-4 py-3 text-slate-500">{f.target}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{pct}%</td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800">{f.forecast}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              f.risk === 'High'
                                ? 'bg-rose-100 text-[#A23A2C]'
                                : f.risk === 'Medium'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {f.risk} Risk
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: View Audit History */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Statutory Immutable System Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                21 CFR Part 11 compliant cryptographically chained logs for regulatory compliance certification
              </p>
            </div>
            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold">
              SHA-256 Verified
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-slate-500">• {log.actorName}</span>
                    {log.studyCode && (
                      <span className="font-code text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                        {log.studyCode}
                      </span>
                    )}
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
    </SharedShell>
  );
};
