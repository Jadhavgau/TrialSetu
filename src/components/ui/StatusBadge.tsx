import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'status' | 'severity' | 'phase' | 'role';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'status', className = '' }) => {
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  const clean = status.toLowerCase();

  if (clean.includes('on track') || clean.includes('compliant') || clean.includes('signed') || clean.includes('completed') || clean.includes('approved') || clean.includes('active') || clean.includes('resolved')) {
    badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (clean.includes('watch') || clean.includes('under review') || clean.includes('in review') || clean.includes('pending') || clean.includes('moderate')) {
    badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (clean.includes('risk') || clean.includes('overdue') || clean.includes('severe') || clean.includes('life-threatening') || clean.includes('major') || clean.includes('escalated') || clean.includes('disabled')) {
    badgeStyles = 'bg-rose-50 text-[#A23A2C] border-rose-200 font-medium';
  } else if (clean.includes('mild') || clean.includes('minor') || clean.includes('draft')) {
    badgeStyles = 'bg-sky-50 text-sky-800 border-sky-200';
  } else if (clean.includes('phase')) {
    badgeStyles = 'bg-slate-100 text-slate-800 border-slate-300 font-semibold';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {status}
    </span>
  );
};
