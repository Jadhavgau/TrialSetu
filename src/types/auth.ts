export type UserRole =
  | 'pi'
  | 'coordinator'
  | 'monitor'
  | 'ethics'
  | 'pv'
  | 'admin'
  | 'regulator'
  | 'leadership';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  institution: string;
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  token?: string;
}

export interface RoleConfig {
  id: UserRole;
  label: string;
  portalName: string;
  path: string;
  badgeColor: string;
  description: string;
}
