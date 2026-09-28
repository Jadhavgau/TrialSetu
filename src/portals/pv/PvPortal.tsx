import React, { useState } from 'react';
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
  Bot,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Flame,
  HelpCircle,
  Mic,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const PvPortal: React.FC = () => {
  const { user } = useAuth();
  const { adverseEvents, safetySignals, acceptMeddraCoding } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [codingAccepted, setCodingAccepted] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(safetySignals[0]);

  // SAEs count
  const seriousAEs = adverseEvents.filter((ae) => ae.isSerious);
  const dueTodayAEs = adverseEvents.filter((ae) => ae.deadlineDate === '2026-09-28' || ae.deadlineDate === '2026-09-29');

  const handleAcceptCoding = () => {
    acceptMeddraCoding('AE-1042', 'Headache (MedDRA 10019211)', user?.name || 'Dr. Sunita Deshmukh');
    setCodingAccepted(true);
  };

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Serious AE Warning Banner */}
      <div className="bg-rose-50 border-2 border-rose-300/80 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A23A2C] text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-[#A23A2C]">
                ⚠ 2 Serious Events Require Attention
              </span>
              <span className="bg-[#A23A2C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                STATUTORY 24H ALERT
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-0.5">
              CDSCO / AYUSH NDCTR statutory expedited reporting deadline active for <strong>AE-1042</strong> (Pune site) and <strong>AE-1028</strong> (Varanasi site).
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('sae-queue')}
          className="px-4 py-2 bg-[#A23A2C] hover:bg-[#882f23] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          Review SAE Triage Queue →
        </button>
      </div>

      {/* Top Portal Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              AYUSH-SURAKSHA PHARMACOVIGILANCE
            </span>
            <span className="text-xs text-slate-400">• National PV Coordination</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Dr. Sunita Deshmukh'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Real-time adverse event triage, voice-intake transcription, AI-assisted MedDRA/WHODrug medical coding, and multi-study safety signal detection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#f2f7f5] border border-[#e2edea] p-3 rounded-xl text-center min-w-[120px]">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#1F3A34] tracking-wider">AI Coding Engine</p>
            <p className="text-xl font-heading font-bold text-emerald-800 mt-0.5">94% Conf</p>
            <p className="text-[10px] text-slate-500">MedDRA v27.1 / WHO-DD</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KpiCard
          label="Open AEs"
          value="42"
          subtext="Active in triage roster"
          icon={Activity}
          accent="slate"
        />
        <KpiCard
          label="Serious AEs (SAE)"
          value="06"
          subtext="Expedited review queue"
          icon={AlertOctagon}
          accent="brick"
          highlight
        />
        <KpiCard
          label="Due Today"
          value="02"
          subtext="CDSCO statutory 24-hr mark"
          icon={Clock}
          accent="turmeric"
          highlight
        />
        <KpiCard
          label="Overdue"
          value="01"
          subtext="AE-1025 regulatory filing"
          icon={AlertCircle}
          accent="brick"
        />
        <KpiCard
          label="Safety Signals"
          value="03"
          subtext="Cluster patterns under surveillance"
          icon={Flame}
          accent="forest"
        />
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Row: AE Queue Table + AI Coding Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AE Queue Table (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Active Adverse Event (AE) Triage Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Events ingested from site staff, mobile patient diaries, and automated tele-voice intake
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ae-queue')}
                  className="text-xs font-semibold text-[#1F3A34] hover:underline"
                >
                  View Full Queue ({adverseEvents.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">ID</th>
                      <th className="px-3 py-2.5">Study</th>
                      <th className="px-3 py-2.5">Severity</th>
                      <th className="px-3 py-2.5">Source</th>
                      <th className="px-3 py-2.5">Deadline</th>
                      <th className="px-3 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adverseEvents.slice(0, 6).map((ae) => (
                      <tr key={ae.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3">
                          <span
                            className={`font-code font-bold ${
                              ae.isSerious ? 'text-[#A23A2C]' : 'text-slate-800'
                            }`}
                          >
                            {ae.id}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800">{ae.studyCode}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              ae.isSerious
                                ? 'bg-rose-100 text-[#A23A2C]'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ae.severity} {ae.isSerious && '⚠'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            {ae.source === 'Voice' ? (
                              <Mic className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {ae.source}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono font-medium">
                          {ae.deadlineDate === '2026-09-28' || ae.deadlineDate === '2026-09-29' ? (
                            <span className="text-[#A23A2C] font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              Today (24h)
                            </span>
                          ) : (
                            <span className="text-slate-600">{ae.deadlineDate}</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={ae.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Medical Coding Assistant Card (1 col) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#C2801F] text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      AI Coding Assistant
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    Confidence: 94%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Automated MedDRA & WHODrug ontology match for newly reported adverse events
                </p>

                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Target AE Description
                    </span>
                    <p className="text-xs font-semibold text-slate-800 italic mt-0.5">
                      "Severe throbbing occipital headache with dizziness 45 minutes post evening dosage of Kavacha"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#1F3A34] block tracking-wider">
                        Suggested MedDRA LLT
                      </span>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                        <span>Headache (10019211)</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Exact match
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#1F3A34] block tracking-wider">
                        Suggested WHODrug Record
                      </span>
                      <div className="text-xs text-slate-800 bg-white p-2 rounded border border-slate-200">
                        Rauvolfia serpentina crude extractives (WHO-DD 009214)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {codingAccepted ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coding Accepted & Saved to Regulatory Safety Roster</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAcceptCoding}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1F3A34] hover:bg-[#152723] text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C2801F]" />
                    <span>Accept Coding & Commit Term</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Safety Signals Visualizer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#C2801F]" />
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Safety Signal Detection & Multi-Study Surveillance
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Algorithmic disproportionality scoring across 16 AIIA clinical study cohorts
                </p>
              </div>

              {/* Signal Select Buttons */}
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

            {/* Signal Details and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Safety Signal
                  </span>
                  <h4 className="font-heading font-bold text-slate-900 text-base mt-0.5">
                    {selectedSignal.symptom}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedSignal.meddraSoc}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Reported Events:</span>
                    <strong className="text-slate-900 font-mono">{selectedSignal.reportedEvents}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Studies Affected:</span>
                    <strong className="text-slate-900 font-mono">{selectedSignal.affectedStudiesCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend:</span>
                    <span
                      className={`font-semibold ${
                        selectedSignal.trend === 'Increasing'
                          ? 'text-[#A23A2C]'
                          : selectedSignal.trend === 'Stable'
                          ? 'text-[#C2801F]'
                          : 'text-emerald-700'
                      }`}
                    >
                      {selectedSignal.trend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <StatusBadge status={selectedSignal.status} />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 block">Affected Study Codes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSignal.studies.map((st) => (
                      <span key={st} className="font-code text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-semibold text-[#1F3A34]">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Component */}
              <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">
                    6-Month Longitudinal Reporting Velocity: {selectedSignal.symptom}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Disproportionality Metric: PRR 2.4</span>
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
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAE Queue Full Tab */}
      {(activeTab === 'sae-queue' || activeTab === 'ae-queue') && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                {activeTab === 'sae-queue' ? 'Serious Adverse Events (SAE) Statutory Queue' : 'Full Adverse Event Repository'}
              </h3>
              <p className="text-xs text-slate-500">24h and 7-day reporting mandates under CDSCO NDCTR 2019</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Event ID</th>
                  <th className="px-4 py-3">Study</th>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">MedDRA Term</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'sae-queue' ? seriousAEs : adverseEvents).map((ae) => (
                  <tr key={ae.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-code font-bold text-[#A23A2C]">{ae.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{ae.studyCode}</td>
                    <td className="px-4 py-3 font-code text-slate-600">{ae.participantId}</td>
                    <td className="px-4 py-3 text-slate-600">{ae.siteName}</td>
                    <td className="px-4 py-3 text-slate-800 max-w-xs">{ae.description}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{ae.meddraTerm || 'Uncoded'}</td>
                    <td className="px-4 py-3 font-mono text-[#A23A2C] font-semibold">{ae.deadlineDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={ae.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SharedShell>
  );
};
