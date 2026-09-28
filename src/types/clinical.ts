export type StudyPhase = 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Observational';
export type StudyStatus = 'On Track' | 'Watch' | 'Risk' | 'Completed' | 'Pending Approval';
export type StudyStage =
  | 'Protocol / IEC'
  | 'CTRI Registration'
  | 'Site Activation'
  | 'Screening'
  | 'Enrollment'
  | 'Randomization'
  | 'Ongoing'
  | 'Close-out';

export interface Study {
  id: string;
  code: string; // e.g. AYU-HTN-001
  title: string;
  indication: string;
  investigationalProduct: string;
  phase: StudyPhase;
  stage: StudyStage;
  status: StudyStatus;
  screened: number;
  enrolled: number;
  randomized: number;
  enrollmentTarget: number;
  startDate: string;
  forecastDate: string;
  piName: string;
  piId: string;
  coordinatorName: string;
  sitesCount: number;
  sitesList: string[];
  visitCompliance: number; // percentage
  protocolDeviations: number;
  openDataQueries: number;
  seriousAEs: number;
  totalAEs: number;
  ctriNumber: string;
  iecApprovalDate: string;
  description: string;
}

export type ParticipantStage =
  | 'Identified'
  | 'Screened'
  | 'Eligible'
  | 'Consented'
  | 'Enrolled'
  | 'Randomized'
  | 'Completed'
  | 'Withdrawn';

export interface Participant {
  id: string; // e.g. PT-HTN-0102
  studyCode: string;
  siteName: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  stage: ParticipantStage;
  consentDate: string;
  consentVersion: string;
  consentVerified: boolean;
  screeningDate: string;
  enrollmentDate?: string;
  randomizationArm?: string;
  lastVisit: string;
  nextVisit: string;
  complianceRate: number;
  activeAEs: number;
}

export interface Milestone {
  id: string;
  studyCode: string;
  title: string;
  type: 'Protocol' | 'Site' | 'Regulatory' | 'Interim Analysis' | 'Database Lock';
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'Signed' | 'In Review' | 'Completed' | 'Overdue';
  requiresSignature: boolean;
  assignedRole: string;
  signerName?: string;
}

export type AESeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
export type AESource = 'Voice' | 'Staff' | 'Patient' | 'Lab Alert';
export type AEStatus = 'Open' | 'Reported' | 'In Review' | 'Closed' | 'Overdue';

export interface AdverseEvent {
  id: string; // e.g. AE-1042
  studyCode: string;
  participantId: string;
  siteName: string;
  description: string;
  isSerious: boolean;
  severity: AESeverity;
  source: AESource;
  reportedDate: string;
  deadlineDate: string; // statutory reporting window
  status: AEStatus;
  meddraTerm?: string;
  meddraConfidence?: number;
  whoDrugClassification?: string;
  actionTaken?: string;
  outcome?: string;
}

export interface SafetySignal {
  id: string;
  symptom: string;
  reportedEvents: number;
  affectedStudiesCount: number;
  studies: string[];
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  status: 'Review' | 'Under Investigation' | 'Resolved';
  confidenceScore: number;
  meddraSoc: string;
  historyData: { month: string; count: number }[];
}

export interface ProtocolDeviation {
  id: string; // e.g. PD-001
  studyCode: string;
  siteName: string;
  participantId?: string;
  category: 'Visit Window' | 'Informed Consent' | 'Investigational Product' | 'Inclusion/Exclusion' | 'Documentation';
  description: string;
  severity: 'Minor' | 'Moderate' | 'Major';
  reportedDate: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  correctiveAction?: string;
}

export interface DataQuery {
  id: string;
  title: string;
  description: string;
  studyCode: string;
  siteName: string;
  participantId: string;
  ageDays: number;
  status: 'Open' | 'Escalated' | 'Answered' | 'Closed';
  createdDate: string;
  category: 'Lab Value' | 'Consent' | 'Visit Schedule' | 'Dosage' | 'AE Details';
}

export interface ResearchSite {
  id: string; // e.g. SITE-DEL-001
  name: string;
  city: string;
  state: string;
  activeStudiesCount: number;
  assignedPi: string;
  coordinator: string;
  complianceRate: number;
  lastAuditDate: string;
  nextVisitDate: string;
  openDeviations: number;
  status: 'Active' | 'Under Review' | 'On Hold';
}

export interface DocumentItem {
  id: string;
  title: string;
  studyCode: string;
  category: 'Protocol' | 'Informed Consent' | 'Investigator Brochure' | 'IEC Approval' | 'Site Log' | 'Regulatory';
  version: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  status: 'Approved' | 'Draft' | 'Under Review' | 'Archived';
}

export interface ConsentVersionItem {
  id: string;
  studyCode: string;
  version: string;
  effectiveDate: string;
  submittedBy: string;
  status: 'Approved' | 'Under Review' | 'Superseded' | 'Draft';
  language: string;
  reconsentRequired: boolean;
  changesSummary: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'STUDY_VIEWED'
    | 'PARTICIPANT_ENROLLED'
    | 'CONSENT_UPDATED'
    | 'MILESTONE_SIGNED'
    | 'AE_CREATED'
    | 'AE_CODED'
    | 'DOCUMENT_UPLOADED'
    | 'IEC_APPROVED'
    | 'PROTOCOL_DEVIATION_RECORDED'
    | 'USER_STATUS_CHANGED'
    | 'QUERY_RESOLVED';
  details: string;
  studyCode?: string;
  ipAddress: string;
  hash: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  studyCode?: string;
  timestamp: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  read: boolean;
  link?: string;
}

export interface CtmsQuestion {
  question: string;
  keywords: string[];
  response: string;
  category: string;
}
