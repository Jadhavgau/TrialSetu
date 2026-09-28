import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SharedShell } from '../../components/layout/SharedShell';
import { KpiCard } from '../../components/ui/KpiCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Activity,
  AlertOctagon,
  Award,
  BookOpen,
  Calendar,
  Compass,
  FileSpreadsheet,
  Flame,
  Layers,
  Shield,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const LeadershipPortal: React.FC = () => {
  const { user } = useAuth();
  const { studies, adverseEvents } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  // Portfolio Status Breakdown
  const portfolioStatusData = [
    { name: 'On Track', value: 10, color: '#1F3A34' },
    { name: 'Watch', value: 3, color: '#C2801F' },
    { name: 'Risk', value: 3, color: '#A23A2C' },
  ];

  // Studies by Stage Bar Chart Data
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

  // Forecast table
  const forecasts = [
    { code: 'AYU-HTN-001', title: 'Hypertension Sarpagandha Study', current: 342, target: 500, forecast: 'Dec 2026', risk: 'Low' },
    { code: 'AYU-DM-002', title: 'Diabetes Management Polyherbal', current: 184, target: 400, forecast: 'Mar 2027', risk: 'Medium' },
    { code: 'AYU-ARTH-003', title: 'Osteoarthritis Shallaki & Guggulu', current: 93, target: 300, forecast: 'Jun 2027', risk: 'High' },
    { code: 'AYU-IMM-004', title: 'Geriatric Immunosenescence Cohort', current: 512, target: 600, forecast: 'Nov 2026', risk: 'Low' },
  ];

  return (
    <SharedShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              EXECUTIVE PORTFOLIO INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">• Office of the Director General</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome, {user?.name || 'Prof. (Dr.) Tanuja Nesari'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Strategic governance across the All India Institute of Ayurveda national trial portfolio, recruitment trajectories, safety surveillance, and regulatory milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#f2f7f5] border border-[#e2edea] p-3 rounded-xl text-center min-w-[130px]">
            <p className="text-[10px] uppercase font-bold text-[#1F3A34] tracking-wider">Overall Portfolio</p>
            <p className="text-2xl font-heading font-bold text-slate-900 mt-0.5">16 Trials</p>
            <p className="text-[10px] text-slate-500">2,200 subject capacity</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KpiCard
          label="Total Studies"
          value="16"
          subtext="Ayurvedic clinical research pipeline"
          icon={BookOpen}
          accent="forest"
          highlight
        />
        <KpiCard
          label="Active Recruitment"
          value="12"
          subtext="Recruiting across 32 sites"
          icon={Compass}
          accent="blue"
        />
        <KpiCard
          label="At Risk Studies"
          value="03"
          subtext="AYU-ARTH & 2 ongoing watch"
          icon={ShieldAlert}
          accent="brick"
          highlight
        />
        <KpiCard
          label="Open AEs"
          value="42"
          subtext="Monitored by central PV desk"
          icon={Activity}
          accent="slate"
        />
        <KpiCard
          label="Serious AEs (SAE)"
          value="06"
          subtext="Expedited statutory oversight"
          icon={AlertOctagon}
          accent="turmeric"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts Row: Portfolio Status (Donut) + Studies by Stage (Bar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart: Portfolio Health */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Portfolio Health Status
                </h3>
                <p className="text-xs text-slate-500">Categorization by adherence to timeline & enrollment</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-xs">
                {portfolioStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600">{item.name}:</span>
                    <strong className="text-slate-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Studies by Clinical Stage (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Clinical Research Pipeline by Stage
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across protocol inception through close-out</p>
                </div>
                <span className="font-mono text-xs text-slate-500">16 Total Protocols</span>
              </div>

              <div className="h-56 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stagesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="stage"
                      stroke="#64748b"
                      fontSize={10}
                      angle={-25}
                      textAnchor="end"
                      height={40}
                    />
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
                Peak concentration in <strong>Screening & Multicenter Enrollment</strong> phases
              </div>
            </div>
          </div>

          {/* Row 2: Risk Matrix Heatmap + Enrollment Forecast Projection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Institutional Risk Heatmap */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Institutional Risk Heatmap
                </h3>
                <p className="text-xs text-slate-500">Weighted evaluation of safety, speed, and GCP audit findings</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#A23A2C]">High Risk (1 Protocol)</span>
                    <span className="font-code text-[11px] font-bold text-[#A23A2C]">AYU-ARTH-003</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Screening conversion behind by 42%; overdue annual continuation dossier.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800">Medium Risk / Watch (2 Protocols)</span>
                    <span className="font-code text-[11px] font-bold text-amber-800">AYU-DM-002, AYU-RESP-005</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    2 pending SAE investigations; minor investigational product accountability variance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800">Low Risk / Stable (13 Protocols)</span>
                    <span className="font-code text-[11px] font-bold text-emerald-800">AYU-HTN, IMM, HEP & Pipeline</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Meeting or exceeding participant enrollment trajectory; 0 major audit findings.
                  </p>
                </div>
              </div>
            </div>

            {/* Enrollment Forecast Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Enrollment Forecast Projections
                  </h3>
                  <p className="text-xs text-slate-500">
                    Predictive completion timelines based on 60-day historical recruitment velocity
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Monte Carlo Projection
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Study</th>
                      <th className="px-4 py-3">Current</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3">Projected Completion</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {forecasts.map((f) => {
                      const pct = Math.round((f.current / f.target) * 100);
                      return (
                        <tr key={f.code} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-code font-bold text-[#1F3A34]">{f.code}</div>
                            <div className="text-slate-600 text-[11px] line-clamp-1">{f.title}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">{f.current}</td>
                          <td className="px-4 py-3 text-slate-500">{f.target}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${pct > 60 ? 'bg-emerald-600' : pct > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-slate-800">{pct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                            {f.forecast}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => navigate(`/studies/${f.code}`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#1F3A34] hover:text-white rounded text-xs font-semibold transition-colors"
                            >
                              Details →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Studies by Stage Tab */}
      {activeTab === 'stages' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900">Studies by Lifecycle Stage</h3>
            <p className="text-xs text-slate-500">Pipeline governance and trial milestones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stagesData.map((st) => (
              <div key={st.stage} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{st.stage}</span>
                <span className="text-2xl font-heading font-bold text-slate-900 mt-1 block">{st.count} Studies</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SharedShell>
  );
};
