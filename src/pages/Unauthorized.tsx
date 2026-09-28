import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIGS, DEMO_ACCOUNTS } from '../mock/users';
import { ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types/auth';

export const Unauthorized: React.FC = () => {
  const { role, user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as any) || {};
  const currentRole = role || state.currentRole || 'unauthenticated';
  const attemptedPath = state.attemptedPath || window.location.pathname;
  const currentConfig = role ? ROLE_CONFIGS[role] : null;

  return (
    <div className="min-h-screen bg-[#FBFCFA] flex flex-col justify-center items-center p-6 selection:bg-[#A23A2C]/10 selection:text-[#A23A2C]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-rose-200/80 p-8 text-center relative overflow-hidden">
        {/* Top Warning Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[#A23A2C]"></div>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#A23A2C] mb-5 shadow-xs">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-[#A23A2C] font-bold bg-rose-100/60 px-2.5 py-1 rounded-full">
          HTTP 403 Forbidden • Access Restricted
        </span>

        <h1 className="font-heading text-2xl font-bold text-slate-900 mt-3">
          Role-Based Access Denied
        </h1>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
          Your current authenticated role (
          <span className="font-semibold text-slate-900 uppercase">
            {currentConfig?.label || currentRole}
          </span>
          ) does not possess permission to access the requested portal route:
        </p>

        <div className="my-4 py-2 px-3 bg-slate-100 rounded-lg font-code text-xs text-[#A23A2C] font-semibold border border-slate-200 inline-block">
          {attemptedPath}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          TrialSetu enforces strict role segregation aligned with Indian GCP, CDSCO NDCTR 2019, and institutional governance protocols. Cross-portal access without explicit role authorization is prohibited.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {role && (
            <button
              onClick={() => navigate(`/${role}`, { replace: true })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#1F3A34] hover:bg-[#152723] shadow-xs transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#C2801F]" />
              <span>Return to My Portal (/{role})</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Switch Account / Sign In</span>
          </button>
        </div>

        {/* Quick Role Switcher for Hackathon Testing */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-left">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Switch Demo Role to verify authorized portal:
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => {
                  switchRole(acc.role);
                  navigate(`/${acc.role}`, { replace: true });
                }}
                className={`text-left text-[11px] p-2 rounded-lg border transition-all ${
                  role === acc.role
                    ? 'border-[#1F3A34] bg-emerald-50 text-[#1F3A34] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="uppercase font-mono text-[10px] text-slate-400">{acc.role}</div>
                <div className="truncate">{acc.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
