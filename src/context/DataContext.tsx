import React, { createContext, useContext, useState } from 'react';
import {
  AdverseEvent,
  AuditLog,
  ConsentVersionItem,
  DataQuery,
  DocumentItem,
  Milestone,
  NotificationItem,
  Participant,
  ProtocolDeviation,
  ResearchSite,
  SafetySignal,
  Study,
} from '../types/clinical';
import { MOCK_STUDIES } from '../mock/studies';
import { MOCK_PARTICIPANTS } from '../mock/participants';
import { MOCK_MILESTONES } from '../mock/milestones';
import { MOCK_ADVERSE_EVENTS } from '../mock/adverseEvents';
import { MOCK_SAFETY_SIGNALS } from '../mock/safetySignals';
import { MOCK_DEVIATIONS } from '../mock/deviations';
import { MOCK_QUERIES } from '../mock/queries';
import { MOCK_SITES } from '../mock/sites';
import { MOCK_DOCUMENTS, MOCK_CONSENT_VERSIONS } from '../mock/documents';
import { MOCK_AUDIT_LOGS } from '../mock/auditLogs';
import { MOCK_NOTIFICATIONS } from '../mock/notifications';
import { DEMO_ACCOUNTS, DemoAccount } from '../mock/users';
import { useAuth } from './AuthContext';

interface DataContextType {
  studies: Study[];
  participants: Participant[];
  milestones: Milestone[];
  adverseEvents: AdverseEvent[];
  safetySignals: SafetySignal[];
  deviations: ProtocolDeviation[];
  queries: DataQuery[];
  sites: ResearchSite[];
  documents: DocumentItem[];
  consentVersions: ConsentVersionItem[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  users: (DemoAccount & { active: boolean })[];

  // RBAC Permission Inquiries
  isReadOnly: boolean;
  canPerformWrite: (action: string) => boolean;

  // Interactive mock mutations (guarded against unauthorized roles like Regulator)
  signMilestone: (id: string, signerName: string) => void;
  markConsentComplete: (participantId: string, actorName: string) => void;
  acceptMeddraCoding: (aeId: string, meddraTerm: string, actorName: string) => void;
  resolveDataQuery: (queryId: string, actorName: string) => void;
  resolveDeviation: (deviationId: string, correctiveAction: string, actorName: string) => void;
  toggleUserStatus: (userId: string, actorName: string) => void;
  approveIecItem: (submissionTitle: string, actorName: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (action: AuditLog['action'], details: string, studyCode?: string, actorName?: string, actorRole?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  const [studies, setStudies] = useState<Study[]>(MOCK_STUDIES);
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>(MOCK_ADVERSE_EVENTS);
  const [safetySignals, setSafetySignals] = useState<SafetySignal[]>(MOCK_SAFETY_SIGNALS);
  const [deviations, setDeviations] = useState<ProtocolDeviation[]>(MOCK_DEVIATIONS);
  const [queries, setQueries] = useState<DataQuery[]>(MOCK_QUERIES);
  const [sites, setSites] = useState<ResearchSite[]>(MOCK_SITES);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [consentVersions, setConsentVersions] = useState<ConsentVersionItem[]>(MOCK_CONSENT_VERSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [users, setUsers] = useState<(DemoAccount & { active: boolean })[]>(
    DEMO_ACCOUNTS.map((u) => ({ ...u, active: true }))
  );

  const isReadOnly = role === 'regulator';

  // Permission evaluator
  const canPerformWrite = (actionName: string): boolean => {
    if (role === 'regulator') {
      return false;
    }
    return true;
  };

  // Enforces strict read-only blocking at the data layer
  const assertWriteAllowed = (actionName: string) => {
    if (role === 'regulator') {
      const msg = `Security Violation: Regulator account is restricted to read-only statutory oversight. Execution of action '${actionName}' is blocked.`;
      console.error(msg);
      throw new Error(msg);
    }
  };

  const addAuditLog = (
    action: AuditLog['action'],
    details: string,
    studyCode?: string,
    actorName = 'Dr. Current User',
    actorRole = 'Clinical Role'
  ) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: formatted,
      actorName,
      actorRole,
      action,
      details,
      studyCode,
      ipAddress: '10.24.10.12',
      hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const signMilestone = (id: string, signerName: string) => {
    assertWriteAllowed('signMilestone');
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Signed',
              completedDate: new Date().toISOString().split('T')[0],
              signerName,
            }
          : m
      )
    );
    const m = milestones.find((x) => x.id === id);
    addAuditLog(
      'MILESTONE_SIGNED',
      `Milestone "${m?.title || id}" signed with cryptographic e-signature by ${signerName}.`,
      m?.studyCode,
      signerName,
      'Principal Investigator'
    );
  };

  const markConsentComplete = (participantId: string, actorName: string) => {
    assertWriteAllowed('markConsentComplete');
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? { ...p, consentVerified: true, stage: p.stage === 'Eligible' ? 'Consented' : p.stage }
          : p
      )
    );
    const p = participants.find((x) => x.id === participantId);
    addAuditLog(
      'CONSENT_UPDATED',
      `Informed consent verified for participant ${participantId} (${p?.consentVersion || 'v2.0'}).`,
      p?.studyCode,
      actorName,
      'Clinical Coordinator'
    );
  };

  const acceptMeddraCoding = (aeId: string, meddraTerm: string, actorName: string) => {
    assertWriteAllowed('acceptMeddraCoding');
    setAdverseEvents((prev) =>
      prev.map((ae) =>
        ae.id === aeId
          ? { ...ae, meddraTerm, status: ae.status === 'Open' ? 'Reported' : ae.status }
          : ae
      )
    );
    const ae = adverseEvents.find((x) => x.id === aeId);
    addAuditLog(
      'AE_CODED',
      `MedDRA coding accepted for ${aeId}: "${meddraTerm}" with WHODrug verification.`,
      ae?.studyCode,
      actorName,
      'Pharmacovigilance Lead'
    );
  };

  const resolveDataQuery = (queryId: string, actorName: string) => {
    assertWriteAllowed('resolveDataQuery');
    setQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, status: 'Closed' } : q))
    );
    const q = queries.find((x) => x.id === queryId);
    addAuditLog(
      'QUERY_RESOLVED',
      `Query ${queryId} (${q?.title}) marked resolved by ${actorName}.`,
      q?.studyCode,
      actorName,
      'Clinical Coordinator'
    );
  };

  const resolveDeviation = (deviationId: string, correctiveAction: string, actorName: string) => {
    assertWriteAllowed('resolveDeviation');
    setDeviations((prev) =>
      prev.map((d) =>
        d.id === deviationId ? { ...d, status: 'Resolved', correctiveAction } : d
      )
    );
    const d = deviations.find((x) => x.id === deviationId);
    addAuditLog(
      'PROTOCOL_DEVIATION_RECORDED',
      `Deviation ${deviationId} corrective resolution documented by ${actorName}.`,
      d?.studyCode,
      actorName,
      'Clinical Monitor (CRA)'
    );
  };

  const toggleUserStatus = (userId: string, actorName: string) => {
    assertWriteAllowed('toggleUserStatus');
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = !u.active;
          addAuditLog(
            'USER_STATUS_CHANGED',
            `User ${u.name} (${u.role.toUpperCase()}) status changed to ${newStatus ? 'ACTIVE' : 'DISABLED'}.`,
            undefined,
            actorName,
            'CTMS Administrator'
          );
          return { ...u, active: newStatus };
        }
        return u;
      })
    );
  };

  const approveIecItem = (submissionTitle: string, actorName: string) => {
    assertWriteAllowed('approveIecItem');
    addAuditLog(
      'IEC_APPROVED',
      `Ethics committee formal clearance granted for submission: "${submissionTitle}".`,
      'AYU-HTN-001',
      actorName,
      'Ethics Committee Secretary'
    );
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DataContext.Provider
      value={{
        studies,
        participants,
        milestones,
        adverseEvents,
        safetySignals,
        deviations,
        queries,
        sites,
        documents,
        consentVersions,
        auditLogs,
        notifications,
        users,
        isReadOnly,
        canPerformWrite,
        signMilestone,
        markConsentComplete,
        acceptMeddraCoding,
        resolveDataQuery,
        resolveDeviation,
        toggleUserStatus,
        approveIecItem,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
