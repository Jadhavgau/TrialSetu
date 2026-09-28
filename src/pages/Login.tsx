import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, ROLE_CONFIGS } from '../mock/users';
import { UserRole } from '../types/auth';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated, role, loginError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('pi@trialsetu.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to their role portal
  React.useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/${role}`, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      const cleanEmail = email.toLowerCase().trim();
      const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase().trim() === cleanEmail);
      if (matched) {
        // Check if there was an attempted path that this role can legitimately access
        const fromPath = (location.state as any)?.from?.pathname;
        if (fromPath && (fromPath.startsWith(`/${matched.role}`) || fromPath.startsWith('/studies/'))) {
          navigate(fromPath, { replace: true });
        } else {
          // Strictly redirect each role to its dedicated portal
          navigate(`/${matched.role}`, { replace: true });
        }
      }
    }
  };

  const handleInstantLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    clearError();
    setIsSubmitting(true);
    const result = await login(demoEmail, 'Demo@123', true);
    setIsSubmitting(false);

    if (result.success) {
      const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase().trim() === demoEmail.toLowerCase().trim());
      if (matched) {
        navigate(`/${matched.role}`, { replace: true });
      }
    }
  };

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    clearError();
  };

  return (
    <div className="min-h-screen bg-[#FBFCFA] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#C2801F]/20 selection:text-[#1F3A34]">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#1F3A34_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo and Brand Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1F3A34] text-white shadow-md border border-[#2c524a] mb-4">
          <span className="font-heading font-bold text-2xl text-amber-200">TS</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
          TrialSetu
        </h1>
        <p className="mt-1 text-sm font-semibold text-[#1F3A34] uppercase tracking-wider">
          All India Institute of Ayurveda (AIIA)
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Clinical Trial Management System • Smart India Hackathon PS26046
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 rounded-2xl">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900">Sign in to Portal</h2>
              <p className="text-xs text-slate-500">Real authentication & role-based routing</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono bg-emerald-50 text-[#1F3A34] border border-emerald-200 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>RBAC v1.0</span>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[#A23A2C] text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication failed: </span>
                {loginError}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Stakeholder Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) clearError();
                  }}
                  placeholder="e.g. pi@trialsetu.demo"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A34] focus:border-[#1F3A34]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) clearError();
                  }}
                  className="block w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A34] focus:border-[#1F3A34]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#1F3A34] focus:ring-[#1F3A34]"
                />
                <span className="text-slate-600">Remember credentials in local storage</span>
              </label>
              <span className="text-slate-400 font-mono text-[11px]">Demo pass: Demo@123</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-[#1F3A34] hover:bg-[#152723] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3A34] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating Role & Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to TrialSetu</span>
                  <ArrowRight className="w-4 h-4 text-[#C2801F]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection Box for Hackathon Reviewers */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C2801F]" />
                <span className="text-xs font-bold text-slate-800">
                  8 Demo Stakeholder Accounts (Click to autofill or instant login):
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Password: Demo@123</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const config = ROLE_CONFIGS[acc.role];
                const isSelected = email.toLowerCase().trim() === acc.email.toLowerCase().trim();

                return (
                  <div
                    key={acc.role}
                    className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1F3A34] bg-[#f2f7f5] ring-2 ring-[#1F3A34]/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => selectDemoAccount(acc.email)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold uppercase text-[10px] text-[#1F3A34]">
                          {acc.role}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2801F]"></span>
                      </div>
                      <p className="font-semibold text-slate-900 truncate leading-snug">{acc.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{config.label}</p>
                      <span className="text-[9px] font-mono text-slate-400 block truncate mt-1">
                        {acc.email}
                      </span>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-slate-500">/{acc.role}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantLogin(acc.email);
                        }}
                        className="text-[10px] font-bold text-[#1F3A34] hover:text-[#C2801F] hover:underline flex items-center gap-0.5"
                      >
                        <span>Login →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500 leading-relaxed">
              <strong>Evaluation Note:</strong> Each account routes to its purpose-built portal. Unauthenticated users or attempts to cross into other portals will be blocked by client-side RBAC guards (403 Unauthorized).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
