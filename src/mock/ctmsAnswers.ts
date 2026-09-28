import { CtmsQuestion } from '../types/clinical';

export const SUGGESTED_CTMS_QUESTIONS: string[] = [
  'Which studies are at risk?',
  'How many serious AEs are open?',
  'Which studies are in site activation?',
  'What is the enrollment status across all trials?',
  'Which deadlines are overdue?',
  'What is the status of AYU-HTN-001?',
];

export const CTMS_KNOWLEDGE_BASE: CtmsQuestion[] = [
  {
    question: 'Which studies are at risk?',
    keywords: ['risk', 'studies at risk', 'trouble', 'failing', 'behind', 'delay'],
    response:
      'Currently, 1 study is formally flagged as "Risk" (AYU-ARTH-003: Knee Osteoarthritis Study) due to slow screening conversion (31% of target) and an overdue ethical continuation dossier. Additionally, 2 studies are on "Watch" status: AYU-DM-002 (46% enrollment pace, with minor site dispensing deviations) and AYU-RESP-005 (in site qualification delay).',
    category: 'Portfolio Health',
  },
  {
    question: 'How many serious AEs are open?',
    keywords: ['serious', 'sae', 'adverse', 'deaths', 'hospitalization', 'emergency', 'open sae', 'ae'],
    response:
      'There are currently 6 open Adverse Events in the system, including 2 Serious Adverse Events (SAEs) requiring statutory CDSCO 24-hour expedited handling: AE-1042 (Severe throbbing occipital headache in AYU-HTN-001, reported today via voice triage) and AE-1028 (Symptomatic hypoglycemia in AYU-DM-002). Both have active PV monitor alerts.',
    category: 'Safety & Pharmacovigilance',
  },
  {
    question: 'Which studies are in site activation?',
    keywords: ['activation', 'site activation', 'initiating', 'launching', 'sites', 'activating'],
    response:
      'Currently, AYU-RESP-005 (Kantakari Avaleha in Bronchial Asthma) is in the Site Activation stage, preparing 3 trial sites (AIIA New Delhi, Pune, and Thiruvananthapuram CARI). AYU-HEP-006 is in the preceding Protocol / IEC Clearance stage.',
    category: 'Study Pipeline',
  },
  {
    question: 'What is the enrollment status across all trials?',
    keywords: ['enrollment', 'target', 'screened', 'enrolled', 'progress', 'total participants', 'funnel', 'recruitment'],
    response:
      'Across the AIIA portfolio: 1,785 subjects have been screened, with 1,256 subjects enrolled across 6 active clinical trials, representing an overall 57.1% portfolio enrollment completion against the cumulative 2,200 subject target. AYU-IMM-004 leads with 85.3% enrollment (512/600), while AYU-HTN-001 is on track at 68.4% (342/500).',
    category: 'Enrollment & Recruitment',
  },
  {
    question: 'Which deadlines are overdue?',
    keywords: ['overdue', 'deadlines', 'late', 'pending', 'expired', 'delinquent', 'due'],
    response:
      'Two items are currently overdue: 1) Milestone MLS-004 (AYU-ARTH-003 Annual Ethical Continuation Dossier) is overdue by 8 days; 2) Protocol Deviation PD-001 corrective resolution at Pune site is past its initial 7-day review window. All PI e-signatures are due within the next 48-72 hours.',
    category: 'Compliance & Milestones',
  },
  {
    question: 'What is the status of AYU-HTN-001?',
    keywords: ['htn', 'ayu-htn-001', 'hypertension', 'sarpagandha', 'arjuna'],
    response:
      'AYU-HTN-001 (Phase II Essential Hypertension) is ON TRACK. 342 of 500 subjects enrolled (68.4%), 310 randomized across 4 sites (AIIA Delhi, Pune, Jaipur, Bengaluru). Visit compliance is 93.4%. 1 SAE was reported today (AE-1042) and is being managed by the PV desk. Protocol Amendment v2 e-signature is pending PI sign-off.',
    category: 'Study Detail',
  },
  {
    question: 'What is the overall compliance status?',
    keywords: ['compliance', 'audit', 'gcp', 'regulatory', 'cdsco', 'ndctr'],
    response:
      'Overall GCP compliance across the 12 assigned research sites stands at 91.4%. 13 of 16 registered clinical trials are fully compliant with CDSCO New Drugs & Clinical Trials Rules 2019. 2 studies are under expedited review, and 1 requires ethical continuation renewal.',
    category: 'Compliance',
  },
  {
    question: 'What are the current ethics committee approvals?',
    keywords: ['ethics', 'iec', 'approval', 'amendment', 'committee', 'clearance'],
    response:
      'The Institutional Ethics Committee (IEC) currently has 7 pending submissions, including Protocol Amendment v2 for AYU-HTN-001 and Consent v3.0 for AYU-DM-002. 14 protocols and amendments have been cleared this month, and 22 controlled consent versions are active.',
    category: 'Ethics',
  },
];

export function findCtmsAnswer(query: string): string {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return 'Please enter a question regarding clinical studies, enrollment, safety, or compliance.';
  }

  // 1. Direct exact or substring matches
  for (const item of CTMS_KNOWLEDGE_BASE) {
    if (cleanQuery === item.question.toLowerCase() || cleanQuery.includes(item.question.toLowerCase())) {
      return item.response;
    }
  }

  // 2. Keyword matches
  for (const item of CTMS_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => cleanQuery.includes(kw))) {
      return item.response;
    }
  }

  // 3. Fallback response for unindexed queries
  return `Based on current CTMS records for "${query}": The All India Institute of Ayurveda trial portfolio comprises 16 registered studies (6 active in this multicenter cohort). Overall GCP compliance is 91.4%, with 12 assigned research sites. For specific protocol metrics, try asking: "Which studies are at risk?", "How many serious AEs are open?", or "What is the status of AYU-HTN-001?".`;
}
