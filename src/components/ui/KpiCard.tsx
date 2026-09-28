import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accent?: 'forest' | 'turmeric' | 'brick' | 'slate' | 'blue';
  highlight?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  accent = 'forest',
  highlight = false,
}) => {
  const accentColors = {
    forest: 'border-l-[#1F3A34] text-[#1F3A34]',
    turmeric: 'border-l-[#C2801F] text-[#C2801F]',
    brick: 'border-l-[#A23A2C] text-[#A23A2C]',
    slate: 'border-l-slate-600 text-slate-700',
    blue: 'border-l-blue-600 text-blue-700',
  };

  const iconBgColors = {
    forest: 'bg-emerald-50 text-[#1F3A34]',
    turmeric: 'bg-amber-50 text-[#C2801F]',
    brick: 'bg-rose-50 text-[#A23A2C]',
    slate: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-sm ${
        highlight ? `border-l-4 ${accentColors[accent]}` : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-emerald-700' : 'text-[#A23A2C]'
                }`}
              >
                {trend.value} {trend.label && <span className="font-normal text-slate-400">{trend.label}</span>}
              </span>
            )}
          </div>
          {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBgColors[accent]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
