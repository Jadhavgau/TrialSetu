import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLE_CONFIGS, DEMO_ACCOUNTS } from '../../mock/users';
import { UserRole } from '../../types/auth';
import {
  Activity,
  AlertOctagon,
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronDown,
  Clock,
  Compass,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { AskCtmsDrawer } from '../ui/AskCtmsDrawer';
import { NotificationsPopover } from '../ui/NotificationsPopover';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface SharedShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const SharedShell: React.FC<SharedShellProps> = ({ children, activeTab, onTabChange }) => {
  const { user, role, logout, switchRole } = useAuth();
  const { notifications } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCtmsOpen, setIsCtmsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const currentRoleConfig = role ? ROLE_CONFIGS[role] : null;

  // Role specific navigation items
  const getNavItems = (currentRole: UserRole): NavItem[] => {
    switch (currentRole) {
      case 'pi':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'studies', label: 'My Studies', icon: BookOpen },
          { id: 'milestones', label: 'Milestones & Timeline', icon: Calendar },
          { id: 'signatures', label: 'E-Signatures', icon: Award, badge: '3' },
          { id: 'documents', label: 'Study Documents', icon: FileText },
          { id: 'notes', label: 'Research Notes', icon: MessageSquare },
          { id: 'audit', label: 'Audit Trail', icon: FileSpreadsheet },
        ];
      case 'coordinator':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'screening', label: 'Screening Pipeline', icon: Filter },
          { id: 'enrollment', label: 'Enrollment Funnel', icon: TrendingUp },
          { id: 'consent', label: 'Consent Verification', icon: UserCheck, badge: '94%' },
          { id: 'queries', label: 'Open Data Queries', icon: HelpCircle, badge: '27' },
          { id: 'participants', label: 'Participants Roster', icon: Users },
          { id: 'documents', label: 'Study Documents', icon: FileText },
        ];
      case 'monitor':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'sites', label: 'Assigned Sites', icon: Home, badge: '12' },
          { id: 'visits', label: 'Site Visits & SIV', icon: Calendar },
          { id: 'deviations', label: 'Protocol Deviations', icon: AlertOctagon, badge: '7' },
          { id: 'compliance', label: 'GCP Compliance', icon: Shield },
          { id: 'audit', label: 'Audit Inspection', icon: FileSpreadsheet },
        ];
      case 'ethics':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'approval-queue', label: 'IEC Approval Queue', icon: CheckSquare, badge: '7' },
          { id: 'consent-versions', label: 'Consent Versions', icon: FileCheck, badge: '22' },
          { id: 'active-protocols', label: 'Approved Protocols', icon: BookOpen },
          { id: 'documents', label: 'Ethics Repository', icon: FileText },
          { id: 'audit', label: 'Review Trail', icon: FileSpreadsheet },
        ];
      case 'pv':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'ae-queue', label: 'AE Triage Queue', icon: Activity, badge: '42' },
          { id: 'sae-queue', label: 'Serious AEs (SAE)', icon: AlertOctagon, badge: '6', badgeColor: 'bg-[#A23A2C]' },
          { id: 'coding', label: 'MedDRA / WHODrug AI', icon: Sparkles },
          { id: 'deadlines', label: 'Statutory Deadlines', icon: Clock, badge: '2' },
          { id: 'signals', label: 'Safety Signals', icon: Flame, badge: '3' },
          { id: 'audit', label: 'Pharmacovigilance Log', icon: FileSpreadsheet },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'users', label: 'User Management', icon: Users, badge: '48' },
          { id: 'sites', label: 'Site Management', icon: Home, badge: '32' },
          { id: 'studies', label: 'Clinical Studies', icon: BookOpen, badge: '16' },
          { id: 'audit', label: 'System Audit Trail', icon: FileSpreadsheet },
          { id: 'config', label: 'CTMS Configuration', icon: Settings },
        ];
      case 'regulator':
        return [
          { id: 'overview', label: 'Inspection Overview', icon: LayoutDashboard },
          { id: 'compliance', label: 'CTRI / IEC Compliance', icon: ShieldCheckIcon },
          { id: 'safety', label: 'Safety Surveillance', icon: AlertOctagon },
          { id: 'studies', label: 'Study Dossiers', icon: BookOpen },
          { id: 'portfolio', label: 'Portfolio Information', icon: Compass },
          { id: 'audit', label: 'Statutory Audit Logs', icon: FileSpreadsheet },
        ];
      case 'leadership':
        return [
          { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'portfolio', label: 'Portfolio Health', icon: Compass },
          { id: 'stages', label: 'Studies by Stage', icon: Layers },
          { id: 'risk-map', label: 'Risk Heatmap', icon: ShieldAlert },
          { id: 'forecasts', label: 'Enrollment Forecasts', icon: TrendingUp },
          { id: 'safety-summary', label: 'Safety Overview', icon: Activity },
        ];
      default:
        return [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }];
    }
  };

  const navItems = role ? getNavItems(role) : [];

  return (
    <div className="min-h-screen bg-[#FBFCFA] flex flex-col selection:bg-[#C2801F]/20 selection:text-[#1F3A34]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1F3A34] text-white shadow-sm border-b border-[#2c524a]">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Left: Branding & Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => role && navigate(`/${role}`)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#C2801F] flex items-center justify-center text-white shadow-xs font-heading font-bold text-lg border border-amber-300/30">
                TS
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg tracking-wide text-white group-hover:text-amber-200 transition-colors">
                    TrialSetu
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-white/15 text-amber-200 px-1.5 py-0.5 rounded">
                    CTMS
                  </span>
                </div>
                <span className="text-[11px] text-emerald-200/80 -mt-0.5 hidden sm:block">
                  All India Institute of Ayurveda (AIIA)
                </span>
              </div>
            </div>

            {/* Portal Badge in Header */}
            {currentRoleConfig && (
              <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
                <span className="text-xs uppercase font-medium text-emerald-200/90 tracking-wider">
                  Active Portal:
                </span>
                <span className="bg-white/10 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md border border-white/15 font-semibold">
                  {currentRoleConfig.portalName}
                </span>
              </div>
            )}
          </div>

          {/* Right: Quick actions, CTMS AI, Notifications, User */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick CTMS Question Trigger */}
            <button
              onClick={() => setIsCtmsOpen(true)}
              className="flex items-center gap-2 bg-[#C2801F] hover:bg-[#df9729] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-all hover:scale-[1.02]"
              title="Ask anything about your clinical trials"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Ask-the-CTMS</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={`Notifications (${unreadNotifs} unread)`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#A23A2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1F3A34] shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* Quick Role Switcher for Testing / Judge Demo */}
            <div className="relative hidden xl:flex items-center">
              <select
                value={role || ''}
                onChange={(e) => {
                  const targetRole = e.target.value as UserRole;
                  switchRole(targetRole);
                  navigate(`/${targetRole}`);
                }}
                className="bg-white/10 text-emerald-100 border border-white/20 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-300 font-medium cursor-pointer"
                title="Quick Role Switcher for Hackathon Judges"
              >
                {DEMO_ACCOUNTS.map((acc) => (
                  <option key={acc.role} value={acc.role} className="bg-slate-900 text-white">
                    Switch to: {acc.name} ({acc.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* User Profile & Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C2801F]/80 border border-amber-300/40 text-white font-semibold text-xs flex items-center justify-center">
                    {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-200/80 uppercase tracking-wider font-mono">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                      <p className="text-[11px] text-[#1F3A34] font-medium mt-1">{user.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{user.institution}</p>
                    </div>

                    <div className="px-2 py-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                        Switch Demo Role
                      </span>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {DEMO_ACCOUNTS.map((acc) => (
                          <button
                            key={acc.role}
                            onClick={() => {
                              switchRole(acc.role);
                              navigate(`/${acc.role}`);
                              setIsUserMenuOpen(false);
                            }}
                            className={`text-left text-[11px] px-2 py-1 rounded-md transition-colors ${
                              user.role === acc.role
                                ? 'bg-[#1F3A34] text-white font-medium'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {acc.role.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="px-2 pt-1.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#A23A2C] hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of TrialSetu</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-200 z-30 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } hidden lg:flex`}
        >
          {/* Sidebar Top: Current Stakeholder Info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              {isSidebarOpen ? (
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Stakeholder Portal
                  </span>
                  <h2 className="font-heading font-bold text-slate-800 text-sm mt-0.5 truncate">
                    {currentRoleConfig?.label}
                  </h2>
                </div>
              ) : (
                <div className="mx-auto font-heading font-bold text-[#1F3A34] text-base">
                  {role?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (!activeTab && item.id === 'overview');

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F3A34] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C2801F]' : 'text-slate-400'}`} />
                    {isSidebarOpen && <span className="truncate">{item.label}</span>}
                  </div>

                  {isSidebarOpen && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setIsCtmsOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1F3A34] bg-[#f2f7f5] hover:bg-[#e2edea] border border-[#e2edea] rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#C2801F] shrink-0" />
              {isSidebarOpen && <span>Ask-the-CTMS</span>}
            </button>

            <div className="pt-2 text-[10px] text-slate-400 text-center">
              {isSidebarOpen ? 'TrialSetu v1.0 • AIIA SIH PS26046' : 'v1.0'}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-white h-full shadow-2xl p-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#1F3A34] text-white flex items-center justify-center font-bold text-xs">
                    TS
                  </div>
                  <span className="font-heading font-bold text-slate-800">TrialSetu CTMS</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  {currentRoleConfig?.label} Portal
                </span>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange && onTabChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                        isActive ? 'bg-[#1F3A34] text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#A23A2C] border border-rose-200 rounded-lg hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FBFCFA]">
          {/* Regulator strict read-only banner */}
          {role === 'regulator' && (
            <div className="bg-amber-500/10 border-b border-amber-300/60 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-800">
                  READ-ONLY REGULATORY VIEW:
                </span>
                <span>
                  You can inspect compliance, study status, safety information, and audit history. Write actions are strictly prohibited.
                </span>
              </div>
              <span className="font-mono text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-semibold">
                CDSCO / AYUSH INSPECTORATE
              </span>
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Ask-the-CTMS Drawer */}
      <AskCtmsDrawer isOpen={isCtmsOpen} onClose={() => setIsCtmsOpen(false)} />
    </div>
  );
};

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
