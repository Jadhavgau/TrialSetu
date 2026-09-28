import React, { useState } from 'react';
import { Milestone } from '../../types/clinical';
import { Award, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface DigitalSignatureModalProps {
  milestone: Milestone;
  signerName: string;
  signerRole: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  milestone,
  signerName,
  signerRole,
  onConfirm,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [statementChecked, setStatementChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statementChecked) return;
    setSubmitting(true);
    setTimeout(() => {
      onConfirm();
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1F3A34] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C2801F]" />
            <h3 className="font-heading text-lg font-semibold tracking-wide">21 CFR Part 11 / NDCTR E-Signature</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#f2f7f5] rounded-xl p-4 border border-[#e2edea]">
            <p className="text-xs uppercase font-medium text-[#1F3A34] tracking-wider">Document / Milestone</p>
            <h4 className="font-semibold text-slate-900 mt-1 text-base">{milestone.title}</h4>
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
              <span>Study: <strong className="font-code text-slate-800">{milestone.studyCode}</strong></span>
              <span>Type: <strong>{milestone.type}</strong></span>
              <span>Due: <strong>{milestone.dueDate}</strong></span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 border-l-2 border-[#C2801F] pl-3 py-1">
            <p className="font-semibold text-slate-800">Legal Manifestation Statement</p>
            <p>
              By executing this digital signature, I, <span className="font-medium text-slate-900">{signerName}</span> ({signerRole}), affirm that I have reviewed the submitted clinical documentation, protocol metrics, and regulatory obligations, and certify their accuracy under Indian Good Clinical Practice (GCP) guidelines.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={statementChecked}
                onChange={(e) => setStatementChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#1F3A34] focus:ring-[#1F3A34]"
                required
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                I understand that this digital signature constitutes the legally binding equivalent of my handwritten signature.
              </span>
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Enter Digital PIN / 2FA Token (Demo: any 4 digits)
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3.5 py-2 text-center tracking-widest text-lg font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A34] focus:border-[#1F3A34]"
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!statementChecked || !pin || submitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#1F3A34] hover:bg-[#152723] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
            >
              {submitting ? (
                <span>Generating Cryptographic Stamp...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C2801F]" />
                  <span>Execute Digital Signature</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
