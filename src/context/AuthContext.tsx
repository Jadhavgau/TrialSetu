import React, { createContext, useContext, useState } from 'react';
import { AuthState, AuthUser, UserRole } from '../types/auth';
import { DEMO_ACCOUNTS } from '../mock/users';

const SESSION_STORAGE_KEY = 'trialsetu_auth_session';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  loading: boolean;
  loginError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Synchronous session recovery from localStorage ensures zero flash and robust persistence on refresh
const getStoredSession = (): { user: AuthUser | null; role: UserRole | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.user && parsed.role) {
        // Validate session timestamp (7 days)
        const sessionTime = parsed.timestamp || 0;
        const now = Date.now();
        if (now - sessionTime < 7 * 24 * 60 * 60 * 1000) {
          // Verify role is one of the valid 8 demo roles
          const validAccount = DEMO_ACCOUNTS.find(
            (acc) => acc.role === parsed.role
          );
          if (validAccount) {
            return {
              user: parsed.user,
              role: parsed.role,
              isAuthenticated: true,
            };
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to load session from storage', e);
  }
  return { user: null, role: null, isAuthenticated: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getStoredSession();
  const [user, setUser] = useState<AuthUser | null>(initialSession.user);
  const [role, setRole] = useState<UserRole | null>(initialSession.role);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialSession.isAuthenticated);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setLoginError(null);

    // Realistic cryptographic verification delay
    await new Promise((res) => setTimeout(res, 200));

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    const matchedAccount = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase().trim() === cleanEmail
    );

    if (!matchedAccount) {
      setLoading(false);
      const err = 'Invalid email credentials. Use one of the 8 demo accounts below.';
      setLoginError(err);
      return { success: false, error: err };
    }

    if (matchedAccount.password !== cleanPassword) {
      setLoading(false);
      const err = 'Incorrect password. Demo password is: Demo@123';
      setLoginError(err);
      return { success: false, error: err };
    }

    // Success: create auth user session
    const authUser: AuthUser = {
      id: matchedAccount.id,
      name: matchedAccount.name,
      email: matchedAccount.email,
      role: matchedAccount.role,
      title: matchedAccount.title,
      institution: matchedAccount.institution,
      phone: matchedAccount.phone,
    };

    setUser(authUser);
    setRole(authUser.role);
    setIsAuthenticated(true);
    setLoginError(null);

    const sessionPayload = {
      user: authUser,
      role: authUser.role,
      timestamp: Date.now(),
      rememberMe,
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    } catch (e) {
      console.error('Failed to write session to localStorage', e);
    }

    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove session from localStorage', e);
    }
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setLoginError(null);
  };

  const switchRole = (newRole: UserRole) => {
    const targetAccount = DEMO_ACCOUNTS.find((acc) => acc.role === newRole);
    if (!targetAccount) return;

    const authUser: AuthUser = {
      id: targetAccount.id,
      name: targetAccount.name,
      email: targetAccount.email,
      role: targetAccount.role,
      title: targetAccount.title,
      institution: targetAccount.institution,
      phone: targetAccount.phone,
    };

    setUser(authUser);
    setRole(newRole);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          user: authUser,
          role: newRole,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error('Failed to update role in session', e);
    }
  };

  const clearError = () => setLoginError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        loginError,
        login,
        logout,
        switchRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
