import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBFCFA] flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1F3A34]/10 text-[#1F3A34] flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 text-[#C2801F]" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
        Error 404
      </span>
      <h1 className="font-heading text-3xl font-bold text-slate-900 mt-2">
        Page Not Found
      </h1>
      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
        The clinical portal page or trial dossier you are attempting to locate does not exist or has been relocated.
      </p>

      <button
        onClick={() => {
          if (isAuthenticated && role) {
            navigate(`/${role}`);
          } else {
            navigate('/login');
          }
        }}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#1F3A34] hover:bg-[#152723] shadow-xs transition-colors"
      >
        <Home className="w-4 h-4 text-[#C2801F]" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
