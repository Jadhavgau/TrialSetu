import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { SharedShell } from './components/layout/SharedShell';

// Pages
import { Login } from './pages/Login';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';
import { StudyDetail } from './pages/StudyDetail';

// 8 Dedicated Portals
import { PiPortal } from './portals/pi/PiPortal';
import { CoordinatorPortal } from './portals/coordinator/CoordinatorPortal';
import { MonitorPortal } from './portals/monitor/MonitorPortal';
import { EthicsPortal } from './portals/ethics/EthicsPortal';
import { PvPortal } from './portals/pv/PvPortal';
import { AdminPortal } from './portals/admin/AdminPortal';
import { RegulatorPortal } from './portals/regulator/RegulatorPortal';
import { LeadershipPortal } from './portals/leadership/LeadershipPortal';

// Root Route Handler: Redirects authenticated users to their specific portal, or to /login
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFCFA] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#1F3A34] text-white flex items-center justify-center font-heading font-bold text-xl mb-4 animate-pulse">
          TS
        </div>
        <div className="text-slate-600 text-xs font-medium">Loading TrialSetu CTMS...</div>
      </div>
    );
  }

  if (isAuthenticated && role) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Authentication & Errors */}
            <Route path="/login" element={<Login />} />
            <Route path="/403" element={<Unauthorized />} />

            {/* PI Portal */}
            <Route
              path="/pi"
              element={
                <ProtectedRoute allowedRoles={['pi']}>
                  <PiPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pi/*"
              element={
                <ProtectedRoute allowedRoles={['pi']}>
                  <PiPortal />
                </ProtectedRoute>
              }
            />

            {/* Coordinator Portal */}
            <Route
              path="/coordinator"
              element={
                <ProtectedRoute allowedRoles={['coordinator']}>
                  <CoordinatorPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/*"
              element={
                <ProtectedRoute allowedRoles={['coordinator']}>
                  <CoordinatorPortal />
                </ProtectedRoute>
              }
            />

            {/* Clinical Monitor Portal */}
            <Route
              path="/monitor"
              element={
                <ProtectedRoute allowedRoles={['monitor']}>
                  <MonitorPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitor/*"
              element={
                <ProtectedRoute allowedRoles={['monitor']}>
                  <MonitorPortal />
                </ProtectedRoute>
              }
            />

            {/* Ethics Committee Portal */}
            <Route
              path="/ethics"
              element={
                <ProtectedRoute allowedRoles={['ethics']}>
                  <EthicsPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ethics/*"
              element={
                <ProtectedRoute allowedRoles={['ethics']}>
                  <EthicsPortal />
                </ProtectedRoute>
              }
            />

            {/* Pharmacovigilance Portal */}
            <Route
              path="/pv"
              element={
                <ProtectedRoute allowedRoles={['pv']}>
                  <PvPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pv/*"
              element={
                <ProtectedRoute allowedRoles={['pv']}>
                  <PvPortal />
                </ProtectedRoute>
              }
            />

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />

            {/* Regulator Portal */}
            <Route
              path="/regulator"
              element={
                <ProtectedRoute allowedRoles={['regulator']}>
                  <RegulatorPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/regulator/*"
              element={
                <ProtectedRoute allowedRoles={['regulator']}>
                  <RegulatorPortal />
                </ProtectedRoute>
              }
            />

            {/* Institutional Leadership Portal */}
            <Route
              path="/leadership"
              element={
                <ProtectedRoute allowedRoles={['leadership']}>
                  <LeadershipPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leadership/*"
              element={
                <ProtectedRoute allowedRoles={['leadership']}>
                  <LeadershipPortal />
                </ProtectedRoute>
              }
            />

            {/* Studies Overview / Detail */}
            <Route
              path="/studies"
              element={
                <ProtectedRoute>
                  <RootRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studies/:id"
              element={
                <ProtectedRoute>
                  <SharedShell>
                    <StudyDetail />
                  </SharedShell>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
