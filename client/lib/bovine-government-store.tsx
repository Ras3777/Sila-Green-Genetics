'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Jurisdiction,
  ReportingPeriod,
  ReportingPeriodKey,
  DataFreshness,
  MetricDefinition,
  InstitutionalKPI,
  DiseaseEvent,
  QuarantineRecord,
  VaccinationSurveillanceRecord,
  MovementException,
  ComplianceAudit,
  ComplianceFinding,
  CorrectiveAction,
  InspectionSchedule,
  DataQualityIssue,
  CrossFarmQualityScore,
  InvestigationCase,
  InvestigationEvidence,
  GovernmentProgram,
  GovernmentOfficial,
  OfficialAssignment,
  StandardReport,
  InstitutionalExportJob,
  InstitutionalAlert,
  InstitutionalTask,
} from './bovine-government-types';
import {
  initialJurisdictions,
  initialReportingPeriods,
  initialDataFreshness,
  initialMetricDefinitions,
  initialInstitutionalKPIs,
  initialDiseaseEvents,
  initialQuarantineRecords,
  initialVaccinationSurveillance,
  initialMovementExceptions,
  initialComplianceAudits,
  initialComplianceFindings,
  initialCorrectiveActions,
  initialInspectionSchedules,
  initialCrossFarmQualityScores,
  initialDataQualityIssues,
  initialInvestigationCases,
  initialGovernmentPrograms,
  initialGovernmentOfficials,
  initialOfficialAssignments,
  initialStandardReports,
  initialExportJobs,
  initialInstitutionalAlerts,
  initialInstitutionalTasks,
} from './bovine-government-data';

interface BovineGovernmentContextType {
  // Jurisdictions & Scope
  jurisdictions: Jurisdiction[];
  selectedJurisdiction: Jurisdiction;
  selectedJurisdictionId: string;
  selectJurisdiction: (id: string) => void;

  // Reporting Periods
  reportingPeriods: ReportingPeriod[];
  selectedPeriod: ReportingPeriod;
  selectedPeriodKey: ReportingPeriodKey;
  selectReportingPeriod: (key: ReportingPeriodKey) => void;

  // Data Freshness
  freshness: DataFreshness;

  // Metric Definitions & Drawer
  metricDefinitions: Record<string, MetricDefinition>;
  activeMetricDefinition: MetricDefinition | null;
  openMetricDefinitionDrawer: (metricKey: string) => void;
  closeMetricDefinitionDrawer: () => void;

  // Institutional KPIs
  kpis: InstitutionalKPI[];
  getKpi: (key: string) => InstitutionalKPI | undefined;

  // Health Surveillance & Disease
  diseaseEvents: DiseaseEvent[];
  quarantines: QuarantineRecord[];
  vaccinationRecords: VaccinationSurveillanceRecord[];
  addDiseaseEvent: (event: Omit<DiseaseEvent, 'id' | 'code'>) => string;
  addQuarantine: (quar: Omit<QuarantineRecord, 'id'>) => string;
  liftQuarantine: (id: string) => void;

  // Movements & Traceability
  movementExceptions: MovementException[];
  resolveMovementException: (id: string, resolvedBy: string) => void;

  // Compliance, Audits & Inspections
  complianceAudits: ComplianceAudit[];
  complianceFindings: ComplianceFinding[];
  correctiveActions: CorrectiveAction[];
  inspections: InspectionSchedule[];
  addComplianceAudit: (audit: Omit<ComplianceAudit, 'id' | 'code'>) => string;
  addFinding: (finding: Omit<ComplianceFinding, 'id'>) => string;
  updateFindingStatus: (id: string, status: ComplianceFinding['status']) => void;
  issueCorrectiveAction: (ca: Omit<CorrectiveAction, 'id' | 'issuedAt' | 'outcome'>) => string;
  respondToCorrectiveAction: (id: string, response: string, evidenceUrls?: string[]) => void;
  reviewCorrectiveAction: (id: string, outcome: CorrectiveAction['outcome'], notes?: string) => void;

  // Data Quality
  dataQualityIssues: DataQualityIssue[];
  crossFarmQualityScores: CrossFarmQualityScore[];
  resolveDataQualityIssue: (id: string) => void;

  // Investigations
  investigations: InvestigationCase[];
  selectedInvestigation: InvestigationCase | null;
  selectInvestigation: (id: string | null) => void;
  addInvestigation: (caseData: Omit<InvestigationCase, 'id' | 'caseNumber' | 'openedAt'>) => string;
  addEvidenceToCase: (caseId: string, evidence: Omit<InvestigationEvidence, 'id' | 'caseId' | 'timestamp'>) => string;

  // Programs & Campaigns
  programs: GovernmentProgram[];

  // Institutional Hierarchy & Officials
  officials: GovernmentOfficial[];
  assignments: OfficialAssignment[];
  assignOfficial: (assignment: Omit<OfficialAssignment, 'id' | 'effectiveFrom' | 'active'>) => string;

  // Reports & Exports
  standardReports: StandardReport[];
  exportJobs: InstitutionalExportJob[];
  createExportJob: (job: Omit<InstitutionalExportJob, 'id' | 'status' | 'requestedAt'>) => string;

  // Alerts & Task Queue
  alerts: InstitutionalAlert[];
  taskQueue: InstitutionalTask[];
  dismissAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  completeTask: (id: string) => void;

  // Global Search Drawer
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Active Alert Center & Task Drawers
  alertCenterOpen: boolean;
  setAlertCenterOpen: (open: boolean) => void;
  taskQueueOpen: boolean;
  setTaskQueueOpen: (open: boolean) => void;
}

const BovineGovernmentContext = createContext<BovineGovernmentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bovine_gov_observer_v1';

export function BovineGovernmentProvider({ children }: { children: React.ReactNode }) {
  const [jurisdictions] = useState<Jurisdiction[]>(initialJurisdictions);
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<string>('jur-national');

  const [reportingPeriods] = useState<ReportingPeriod[]>(initialReportingPeriods);
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<ReportingPeriodKey>('YTD');

  const [freshness] = useState<DataFreshness>(initialDataFreshness);
  const [metricDefinitions] = useState<Record<string, MetricDefinition>>(initialMetricDefinitions);
  const [activeMetricDefinition, setActiveMetricDefinition] = useState<MetricDefinition | null>(null);

  const [kpis] = useState<InstitutionalKPI[]>(initialInstitutionalKPIs);

  const [diseaseEvents, setDiseaseEvents] = useState<DiseaseEvent[]>(initialDiseaseEvents);
  const [quarantines, setQuarantines] = useState<QuarantineRecord[]>(initialQuarantineRecords);
  const [vaccinationRecords] = useState<VaccinationSurveillanceRecord[]>(initialVaccinationSurveillance);

  const [movementExceptions, setMovementExceptions] = useState<MovementException[]>(initialMovementExceptions);

  const [complianceAudits, setComplianceAudits] = useState<ComplianceAudit[]>(initialComplianceAudits);
  const [complianceFindings, setComplianceFindings] = useState<ComplianceFinding[]>(initialComplianceFindings);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(initialCorrectiveActions);
  const [inspections] = useState<InspectionSchedule[]>(initialInspectionSchedules);

  const [dataQualityIssues, setDataQualityIssues] = useState<DataQualityIssue[]>(initialDataQualityIssues);
  const [crossFarmQualityScores] = useState<CrossFarmQualityScore[]>(initialCrossFarmQualityScores);

  const [investigations, setInvestigations] = useState<InvestigationCase[]>(initialInvestigationCases);
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string | null>(null);

  const [programs] = useState<GovernmentProgram[]>(initialGovernmentPrograms);
  const [officials] = useState<GovernmentOfficial[]>(initialGovernmentOfficials);
  const [assignments, setAssignments] = useState<OfficialAssignment[]>(initialOfficialAssignments);

  const [standardReports] = useState<StandardReport[]>(initialStandardReports);
  const [exportJobs, setExportJobs] = useState<InstitutionalExportJob[]>(initialExportJobs);

  const [alerts, setAlerts] = useState<InstitutionalAlert[]>(initialInstitutionalAlerts);
  const [taskQueue, setTaskQueue] = useState<InstitutionalTask[]>(initialInstitutionalTasks);

  // Drawers
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertCenterOpen, setAlertCenterOpen] = useState(false);
  const [taskQueueOpen, setTaskQueueOpen] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.selectedJurisdictionId) setSelectedJurisdictionId(p.selectedJurisdictionId);
        if (p.selectedPeriodKey) setSelectedPeriodKey(p.selectedPeriodKey);
        if (p.diseaseEvents) setDiseaseEvents(p.diseaseEvents);
        if (p.quarantines) setQuarantines(p.quarantines);
        if (p.movementExceptions) setMovementExceptions(p.movementExceptions);
        if (p.complianceAudits) setComplianceAudits(p.complianceAudits);
        if (p.complianceFindings) setComplianceFindings(p.complianceFindings);
        if (p.correctiveActions) setCorrectiveActions(p.correctiveActions);
        if (p.investigations) setInvestigations(p.investigations);
        if (p.alerts) setAlerts(p.alerts);
        if (p.taskQueue) setTaskQueue(p.taskQueue);
        if (p.exportJobs) setExportJobs(p.exportJobs);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (diff: Record<string, any>) => {
    try {
      const current = {
        selectedJurisdictionId,
        selectedPeriodKey,
        diseaseEvents,
        quarantines,
        movementExceptions,
        complianceAudits,
        complianceFindings,
        correctiveActions,
        investigations,
        alerts,
        taskQueue,
        exportJobs,
        ...diff,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
  };

  const selectedJurisdiction =
    jurisdictions.find((j) => j.id === selectedJurisdictionId) || jurisdictions[0];

  const selectedPeriod =
    reportingPeriods.find((p) => p.key === selectedPeriodKey) || reportingPeriods[0];

  const selectJurisdiction = (id: string) => {
    setSelectedJurisdictionId(id);
    persist({ selectedJurisdictionId: id });
  };

  const selectReportingPeriod = (key: ReportingPeriodKey) => {
    setSelectedPeriodKey(key);
    persist({ selectedPeriodKey: key });
  };

  const openMetricDefinitionDrawer = (metricKey: string) => {
    const kpi = kpis.find((k) => k.key === metricKey);
    const defKey = kpi ? kpi.definitionKey : metricKey;
    const def = metricDefinitions[defKey] || initialMetricDefinitions['pop-total'];
    setActiveMetricDefinition(def);
  };

  const closeMetricDefinitionDrawer = () => {
    setActiveMetricDefinition(null);
  };

  const getKpi = (key: string) => {
    return kpis.find((k) => k.key === key);
  };

  // Mutations
  const addDiseaseEvent = (eventData: Omit<DiseaseEvent, 'id' | 'code'>) => {
    const id = `dis-${Date.now()}`;
    const code = `DE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newEvent: DiseaseEvent = { ...eventData, id, code };
    const next = [newEvent, ...diseaseEvents];
    setDiseaseEvents(next);
    persist({ diseaseEvents: next });
    return id;
  };

  const addQuarantine = (quarData: Omit<QuarantineRecord, 'id'>) => {
    const id = `quar-${Date.now()}`;
    const newQuar: QuarantineRecord = { ...quarData, id };
    const next = [newQuar, ...quarantines];
    setQuarantines(next);
    persist({ quarantines: next });
    return id;
  };

  const liftQuarantine = (id: string) => {
    const next = quarantines.map((q) =>
      q.id === id ? { ...q, status: 'LIFTED' as const, endedAt: new Date().toISOString().slice(0, 10) } : q
    );
    setQuarantines(next);
    persist({ quarantines: next });
  };

  const resolveMovementException = (id: string, resolvedBy: string) => {
    const next = movementExceptions.map((m) =>
      m.id === id
        ? { ...m, resolved: true, resolvedAt: new Date().toISOString().slice(0, 10), resolvedBy }
        : m
    );
    setMovementExceptions(next);
    persist({ movementExceptions: next });
  };

  const addComplianceAudit = (auditData: Omit<ComplianceAudit, 'id' | 'code'>) => {
    const id = `aud-${Date.now()}`;
    const code = `AUD-GOV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAudit: ComplianceAudit = { ...auditData, id, code };
    const next = [newAudit, ...complianceAudits];
    setComplianceAudits(next);
    persist({ complianceAudits: next });
    return id;
  };

  const addFinding = (findingData: Omit<ComplianceFinding, 'id'>) => {
    const id = `find-${Date.now()}`;
    const newFinding: ComplianceFinding = { ...findingData, id };
    const next = [newFinding, ...complianceFindings];
    setComplianceFindings(next);
    persist({ complianceFindings: next });
    return id;
  };

  const updateFindingStatus = (id: string, status: ComplianceFinding['status']) => {
    const next = complianceFindings.map((f) => (f.id === id ? { ...f, status } : f));
    setComplianceFindings(next);
    persist({ complianceFindings: next });
  };

  const issueCorrectiveAction = (caData: Omit<CorrectiveAction, 'id' | 'issuedAt' | 'outcome'>) => {
    const id = `ca-${Date.now()}`;
    const issuedAt = new Date().toISOString().slice(0, 10);
    const newCA: CorrectiveAction = { ...caData, id, issuedAt, outcome: 'PENDING' };
    const next = [newCA, ...correctiveActions];
    setCorrectiveActions(next);

    // Update parent finding
    updateFindingStatus(caData.findingId, 'CORRECTIVE_ACTION_ISSUED');

    persist({ correctiveActions: next });
    return id;
  };

  const respondToCorrectiveAction = (id: string, response: string, evidenceUrls?: string[]) => {
    const next = correctiveActions.map((ca) =>
      ca.id === id
        ? {
            ...ca,
            farmResponse: response,
            evidenceUrls: evidenceUrls || ca.evidenceUrls,
            submittedAt: new Date().toISOString().slice(0, 10),
          }
        : ca
    );
    setCorrectiveActions(next);

    const targetCA = next.find((ca) => ca.id === id);
    if (targetCA) {
      updateFindingStatus(targetCA.findingId, 'RESPONSE_SUBMITTED');
    }

    persist({ correctiveActions: next });
  };

  const reviewCorrectiveAction = (id: string, outcome: CorrectiveAction['outcome'], notes?: string) => {
    const next = correctiveActions.map((ca) =>
      ca.id === id
        ? {
            ...ca,
            outcome,
            reviewedAt: new Date().toISOString().slice(0, 10),
            notes: notes || ca.notes,
          }
        : ca
    );
    setCorrectiveActions(next);

    const targetCA = next.find((ca) => ca.id === id);
    if (targetCA) {
      if (outcome === 'ACCEPTED' || outcome === 'RESOLVED') {
        updateFindingStatus(targetCA.findingId, 'RESOLVED');
      } else if (outcome === 'REJECTED') {
        updateFindingStatus(targetCA.findingId, 'CORRECTIVE_ACTION_ISSUED');
      }
    }

    persist({ correctiveActions: next });
  };

  const resolveDataQualityIssue = (id: string) => {
    const next = dataQualityIssues.map((d) => (d.id === id ? { ...d, status: 'CORRECTED' as const } : d));
    setDataQualityIssues(next);
  };

  const selectedInvestigation =
    investigations.find((inv) => inv.id === selectedInvestigationId) || null;

  const selectInvestigation = (id: string | null) => {
    setSelectedInvestigationId(id);
  };

  const addInvestigation = (caseData: Omit<InvestigationCase, 'id' | 'caseNumber' | 'openedAt'>) => {
    const id = `inv-${Date.now()}`;
    const caseNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const openedAt = new Date().toISOString().slice(0, 10);
    const newCase: InvestigationCase = { ...caseData, id, caseNumber, openedAt };
    const next = [newCase, ...investigations];
    setInvestigations(next);
    persist({ investigations: next });
    return id;
  };

  const addEvidenceToCase = (
    caseId: string,
    evidenceData: Omit<InvestigationEvidence, 'id' | 'caseId' | 'timestamp'>
  ) => {
    const id = `evi-${Date.now()}`;
    const timestamp = new Date().toISOString().slice(0, 10);
    const newEvidence: InvestigationEvidence = { ...evidenceData, id, caseId, timestamp };

    const next = investigations.map((inv) => {
      if (inv.id !== caseId) return inv;
      return {
        ...inv,
        evidenceItems: [...inv.evidenceItems, newEvidence],
      };
    });
    setInvestigations(next);
    persist({ investigations: next });
    return id;
  };

  const assignOfficial = (data: Omit<OfficialAssignment, 'id' | 'effectiveFrom' | 'active'>) => {
    const id = `ass-${Date.now()}`;
    const effectiveFrom = new Date().toISOString().slice(0, 10);
    const newAss: OfficialAssignment = { ...data, id, effectiveFrom, active: true };
    const next = [newAss, ...assignments];
    setAssignments(next);
    return id;
  };

  const createExportJob = (jobData: Omit<InstitutionalExportJob, 'id' | 'status' | 'requestedAt'>) => {
    const id = `exp-${Date.now()}`;
    const requestedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newJob: InstitutionalExportJob = {
      ...jobData,
      id,
      status: 'READY',
      requestedAt,
      completedAt: requestedAt,
      downloadUrl: '#',
    };
    const next = [newJob, ...exportJobs];
    setExportJobs(next);
    persist({ exportJobs: next });
    return id;
  };

  const dismissAlert = (id: string) => {
    const next = alerts.map((a) => (a.id === id ? { ...a, status: 'DISMISSED' as const } : a));
    setAlerts(next);
    persist({ alerts: next });
  };

  const acknowledgeAlert = (id: string) => {
    const next = alerts.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
    setAlerts(next);
    persist({ alerts: next });
  };

  const completeTask = (id: string) => {
    const next = taskQueue.map((t) => (t.id === id ? { ...t, status: 'COMPLETED' as const } : t));
    setTaskQueue(next);
    persist({ taskQueue: next });
  };

  const value: BovineGovernmentContextType = {
    jurisdictions,
    selectedJurisdiction,
    selectedJurisdictionId,
    selectJurisdiction,

    reportingPeriods,
    selectedPeriod,
    selectedPeriodKey,
    selectReportingPeriod,

    freshness,

    metricDefinitions,
    activeMetricDefinition,
    openMetricDefinitionDrawer,
    closeMetricDefinitionDrawer,

    kpis,
    getKpi,

    diseaseEvents,
    quarantines,
    vaccinationRecords,
    addDiseaseEvent,
    addQuarantine,
    liftQuarantine,

    movementExceptions,
    resolveMovementException,

    complianceAudits,
    complianceFindings,
    correctiveActions,
    inspections,
    addComplianceAudit,
    addFinding,
    updateFindingStatus,
    issueCorrectiveAction,
    respondToCorrectiveAction,
    reviewCorrectiveAction,

    dataQualityIssues,
    crossFarmQualityScores,
    resolveDataQualityIssue,

    investigations,
    selectedInvestigation,
    selectInvestigation,
    addInvestigation,
    addEvidenceToCase,

    programs,

    officials,
    assignments,
    assignOfficial,

    standardReports,
    exportJobs,
    createExportJob,

    alerts,
    taskQueue,
    dismissAlert,
    acknowledgeAlert,
    completeTask,

    searchOpen,
    setSearchOpen,
    alertCenterOpen,
    setAlertCenterOpen,
    taskQueueOpen,
    setTaskQueueOpen,
  };

  return (
    <BovineGovernmentContext.Provider value={value}>
      {children}
    </BovineGovernmentContext.Provider>
  );
}

export function useGovernment() {
  const context = useContext(BovineGovernmentContext);
  if (!context) {
    throw new Error('useGovernment must be used within a BovineGovernmentProvider');
  }
  return context;
}
