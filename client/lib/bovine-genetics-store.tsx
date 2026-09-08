'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Breed,
  TraitDefinition,
  MeasurementMethod,
  ContemporaryGroup,
  PhenotypeObservation,
  PerformanceTest,
  PerformanceTestEnrollment,
  Laboratory,
  GeneticSample,
  GenotypingAssay,
  AssayQcStatus,
  GenotypeQcResult,
  GeneticMarker,
  AnimalMarkerResult,
  GeneticCondition,
  AnimalGeneticConditionResult,
  GeneticEvaluationRun,
  GeneticTraitEstimate,
  AnimalGeneticMetric,
} from './bovine-types';
import {
  initialBreeds,
  initialTraitDefinitions,
  initialMeasurementMethods,
  initialContemporaryGroups,
  initialPhenotypeObservations,
  initialPerformanceTests,
  initialPerformanceTestEnrollments,
  initialLaboratories,
  initialGeneticSamples,
  initialGenotypingAssays,
  initialGenotypeQcResults,
  initialGeneticMarkers,
  initialAnimalMarkerResults,
  initialGeneticConditions,
  initialAnimalGeneticConditionResults,
  initialGeneticEvaluationRuns,
  initialGeneticTraitEstimates,
  initialAnimalGeneticMetrics,
} from './bovine-genetics-data';

interface BovineGeneticsContextType {
  // Collections
  breeds: Breed[];
  traitDefinitions: TraitDefinition[];
  measurementMethods: MeasurementMethod[];
  contemporaryGroups: ContemporaryGroup[];
  phenotypeObservations: PhenotypeObservation[];
  performanceTests: PerformanceTest[];
  performanceTestEnrollments: PerformanceTestEnrollment[];
  laboratories: Laboratory[];
  geneticSamples: GeneticSample[];
  genotypingAssays: GenotypingAssay[];
  genotypeQcResults: GenotypeQcResult[];
  geneticMarkers: GeneticMarker[];
  animalMarkerResults: AnimalMarkerResult[];
  geneticConditions: GeneticCondition[];
  animalGeneticConditionResults: AnimalGeneticConditionResult[];
  geneticEvaluationRuns: GeneticEvaluationRun[];
  geneticTraitEstimates: GeneticTraitEstimate[];
  animalGeneticMetrics: AnimalGeneticMetric[];

  // Mutations - Breeds
  addBreed: (breed: Omit<Breed, 'id'>) => string;
  updateBreed: (id: string, updates: Partial<Breed>) => void;
  toggleBreedActive: (id: string) => void;

  // Mutations - Trait Definitions
  addTraitDefinition: (trait: Omit<TraitDefinition, 'id' | 'phenotypeCount' | 'geneticEstimateCount'>) => string;
  updateTraitDefinition: (id: string, updates: Partial<TraitDefinition>) => void;

  // Mutations - Measurement Methods
  addMeasurementMethod: (method: Omit<MeasurementMethod, 'id' | 'observationCount'>) => string;
  updateMeasurementMethod: (id: string, updates: Partial<MeasurementMethod>) => void;

  // Mutations - Contemporary Groups
  addContemporaryGroup: (cg: Omit<ContemporaryGroup, 'id' | 'animalCount' | 'phenotypeCount'> & { animalCount?: number; phenotypeCount?: number }) => string;
  updateContemporaryGroup: (id: string, updates: Partial<ContemporaryGroup>) => void;
  closeContemporaryGroup: (id: string) => void;

  // Mutations - Phenotype Observations
  addPhenotypeObservation: (obs: Omit<PhenotypeObservation, 'id'>) => string;
  updatePhenotypeObservation: (id: string, updates: Partial<PhenotypeObservation>) => void;
  setPhenotypeQualityStatus: (id: string, status: PhenotypeObservation['qualityStatus'], flag?: string) => void;
  bulkValidatePhenotypes: (ids: string[]) => void;
  bulkRejectPhenotypes: (ids: string[], reason: string) => void;

  // Mutations - Performance Tests
  addPerformanceTest: (pt: Omit<PerformanceTest, 'id' | 'enrolledCount' | 'completedCount'> & { enrolledCount?: number; completedCount?: number }) => string;
  updatePerformanceTest: (id: string, updates: Partial<PerformanceTest>) => void;
  enrollAnimalInTest: (enrollment: Omit<PerformanceTestEnrollment, 'id'>) => string;
  updateTestEnrollment: (id: string, updates: Partial<PerformanceTestEnrollment>) => void;

  // Mutations - Laboratories
  addLaboratory: (lab: Omit<Laboratory, 'id' | 'sampleVolume' | 'assayVolume'>) => string;
  updateLaboratory: (id: string, updates: Partial<Laboratory>) => void;

  // Mutations - Genetic Samples
  addGeneticSample: (sample: Omit<GeneticSample, 'id' | 'assayCount'>) => string;
  updateGeneticSample: (id: string, updates: Partial<GeneticSample>) => void;
  updateGeneticSampleStatus: (id: string, status: GeneticSample['status']) => void;
  advanceSampleStatus: (id: string, newStatus: GeneticSample['status'], handler: string, location: string, actionNote: string) => void;
  addSampleCustodyEvent: (sampleId: string, event: { timestamp: string; location: string; handledBy: string; action: string; notes?: string }) => void;

  // Mutations - Genotyping Assays & QC
  addGenotypingAssay: (assay: Omit<GenotypingAssay, 'id'>) => string;
  updateGenotypingAssay: (id: string, updates: Partial<GenotypingAssay>) => void;
  updateAssayQcStatus: (id: string, qcStatus: AssayQcStatus, notes?: string) => void;
  addGenotypeQcResult: (qc: Omit<GenotypeQcResult, 'id'>) => string;

  // Mutations - Markers & Conditions
  addGeneticMarker: (marker: Omit<GeneticMarker, 'id' | 'resultCount'>) => string;
  updateGeneticMarker: (id: string, updates: Partial<GeneticMarker>) => void;
  addAnimalMarkerResult: (result: Omit<AnimalMarkerResult, 'id'>) => string;
  addGeneticCondition: (condition: Omit<GeneticCondition, 'id'>) => string;
  updateGeneticCondition: (id: string, updates: Partial<GeneticCondition>) => void;
  addAnimalGeneticConditionResult: (result: Omit<AnimalGeneticConditionResult, 'id'>) => string;
  updateAnimalGeneticConditionResult: (id: string, updates: Partial<AnimalGeneticConditionResult>) => void;

  // Mutations - Genetic Evaluation Runs & Estimates
  addGeneticEvaluationRun: (run: Omit<GeneticEvaluationRun, 'id' | 'animalCount' | 'traitCount'>) => string;
  updateGeneticEvaluationRun: (id: string, updates: Partial<GeneticEvaluationRun>) => void;
  publishGeneticEvaluationRun: (id: string) => void;
  publishEvaluationRun: (id: string) => void;
  addGeneticTraitEstimate: (est: Omit<GeneticTraitEstimate, 'id'>) => string;
  bulkAddEstimates: (estimates: Omit<GeneticTraitEstimate, 'id'>[]) => void;

  // Mutations - Animal Genetic Metrics
  addAnimalGeneticMetric: (metric: Omit<AnimalGeneticMetric, 'id'>) => string;
  updateAnimalGeneticMetric: (id: string, updates: Partial<AnimalGeneticMetric>) => void;

  // Reset
  resetGeneticsToDefaults: () => void;
}

const BovineGeneticsContext = createContext<BovineGeneticsContextType | null>(null);

export function BovineGeneticsProvider({ children }: { children: React.ReactNode }) {
  const [breeds, setBreeds] = useState<Breed[]>(initialBreeds);
  const [traitDefinitions, setTraitDefinitions] = useState<TraitDefinition[]>(initialTraitDefinitions);
  const [measurementMethods, setMeasurementMethods] = useState<MeasurementMethod[]>(initialMeasurementMethods);
  const [contemporaryGroups, setContemporaryGroups] = useState<ContemporaryGroup[]>(initialContemporaryGroups);
  const [phenotypeObservations, setPhenotypeObservations] = useState<PhenotypeObservation[]>(initialPhenotypeObservations);
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>(initialPerformanceTests);
  const [performanceTestEnrollments, setPerformanceTestEnrollments] = useState<PerformanceTestEnrollment[]>(initialPerformanceTestEnrollments);
  const [laboratories, setLaboratories] = useState<Laboratory[]>(initialLaboratories);
  const [geneticSamples, setGeneticSamples] = useState<GeneticSample[]>(initialGeneticSamples);
  const [genotypingAssays, setGenotypingAssays] = useState<GenotypingAssay[]>(initialGenotypingAssays);
  const [genotypeQcResults, setGenotypeQcResults] = useState<GenotypeQcResult[]>(initialGenotypeQcResults);
  const [geneticMarkers, setGeneticMarkers] = useState<GeneticMarker[]>(initialGeneticMarkers);
  const [animalMarkerResults, setAnimalMarkerResults] = useState<AnimalMarkerResult[]>(initialAnimalMarkerResults);
  const [geneticConditions, setGeneticConditions] = useState<GeneticCondition[]>(initialGeneticConditions);
  const [animalGeneticConditionResults, setAnimalGeneticConditionResults] = useState<AnimalGeneticConditionResult[]>(initialAnimalGeneticConditionResults);
  const [geneticEvaluationRuns, setGeneticEvaluationRuns] = useState<GeneticEvaluationRun[]>(initialGeneticEvaluationRuns);
  const [geneticTraitEstimates, setGeneticTraitEstimates] = useState<GeneticTraitEstimate[]>(initialGeneticTraitEstimates);
  const [animalGeneticMetrics, setAnimalGeneticMetrics] = useState<AnimalGeneticMetric[]>(initialAnimalGeneticMetrics);

  // Persistence to localStorage
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('bovine_genetics_state_v1') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const timer = setTimeout(() => {
          if (parsed.breeds) setBreeds(parsed.breeds);
          if (parsed.traitDefinitions) setTraitDefinitions(parsed.traitDefinitions);
          if (parsed.measurementMethods) setMeasurementMethods(parsed.measurementMethods);
          if (parsed.contemporaryGroups) setContemporaryGroups(parsed.contemporaryGroups);
          if (parsed.phenotypeObservations) setPhenotypeObservations(parsed.phenotypeObservations);
          if (parsed.performanceTests) setPerformanceTests(parsed.performanceTests);
          if (parsed.performanceTestEnrollments) setPerformanceTestEnrollments(parsed.performanceTestEnrollments);
          if (parsed.laboratories) setLaboratories(parsed.laboratories);
          if (parsed.geneticSamples) setGeneticSamples(parsed.geneticSamples);
          if (parsed.genotypingAssays) setGenotypingAssays(parsed.genotypingAssays);
          if (parsed.genotypeQcResults) setGenotypeQcResults(parsed.genotypeQcResults);
          if (parsed.geneticMarkers) setGeneticMarkers(parsed.geneticMarkers);
          if (parsed.animalMarkerResults) setAnimalMarkerResults(parsed.animalMarkerResults);
          if (parsed.geneticConditions) setGeneticConditions(parsed.geneticConditions);
          if (parsed.animalGeneticConditionResults) setAnimalGeneticConditionResults(parsed.animalGeneticConditionResults);
          if (parsed.geneticEvaluationRuns) setGeneticEvaluationRuns(parsed.geneticEvaluationRuns);
          if (parsed.geneticTraitEstimates) setGeneticTraitEstimates(parsed.geneticTraitEstimates);
          if (parsed.animalGeneticMetrics) setAnimalGeneticMetrics(parsed.animalGeneticMetrics);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Failed to parse saved genetics state:', e);
    }
  }, []);

  const persistState = (delta: Record<string, unknown>) => {
    try {
      if (typeof window === 'undefined') return;
      const current = localStorage.getItem('bovine_genetics_state_v1');
      const base = current ? JSON.parse(current) : {};
      const next = { ...base, ...delta };
      localStorage.setItem('bovine_genetics_state_v1', JSON.stringify(next));
    } catch (e) {
      console.error('Genetics state persistence error:', e);
    }
  };

  // Breeds
  const addBreed = (data: Omit<Breed, 'id'>) => {
    const id = `breed-${Date.now()}`;
    const newBreed: Breed = { ...data, id };
    const next = [...breeds, newBreed];
    setBreeds(next);
    persistState({ breeds: next });
    return id;
  };

  const updateBreed = (id: string, updates: Partial<Breed>) => {
    const next = breeds.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBreeds(next);
    persistState({ breeds: next });
  };

  const toggleBreedActive = (id: string) => {
    const next = breeds.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    setBreeds(next);
    persistState({ breeds: next });
  };

  // Trait Definitions
  const addTraitDefinition = (data: Omit<TraitDefinition, 'id' | 'phenotypeCount' | 'geneticEstimateCount'>) => {
    const id = `trait-${Date.now()}`;
    const newTrait: TraitDefinition = {
      ...data,
      id,
      phenotypeCount: 0,
      geneticEstimateCount: 0,
    };
    const next = [...traitDefinitions, newTrait];
    setTraitDefinitions(next);
    persistState({ traitDefinitions: next });
    return id;
  };

  const updateTraitDefinition = (id: string, updates: Partial<TraitDefinition>) => {
    const next = traitDefinitions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTraitDefinitions(next);
    persistState({ traitDefinitions: next });
  };

  // Measurement Methods
  const addMeasurementMethod = (data: Omit<MeasurementMethod, 'id' | 'observationCount'>) => {
    const id = `method-${Date.now()}`;
    const newMethod: MeasurementMethod = {
      ...data,
      id,
      observationCount: 0,
    };
    const next = [...measurementMethods, newMethod];
    setMeasurementMethods(next);
    persistState({ measurementMethods: next });
    return id;
  };

  const updateMeasurementMethod = (id: string, updates: Partial<MeasurementMethod>) => {
    const next = measurementMethods.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMeasurementMethods(next);
    persistState({ measurementMethods: next });
  };

  // Contemporary Groups
  const addContemporaryGroup = (data: Omit<ContemporaryGroup, 'id' | 'animalCount' | 'phenotypeCount'> & { animalCount?: number; phenotypeCount?: number }) => {
    const id = `cg-${Date.now()}`;
    const newCg: ContemporaryGroup = {
      ...data,
      id,
      animalCount: data.animalCount ?? 0,
      phenotypeCount: data.phenotypeCount ?? 0,
    };
    const next = [...contemporaryGroups, newCg];
    setContemporaryGroups(next);
    persistState({ contemporaryGroups: next });
    return id;
  };

  const updateContemporaryGroup = (id: string, updates: Partial<ContemporaryGroup>) => {
    const next = contemporaryGroups.map((cg) => (cg.id === id ? { ...cg, ...updates } : cg));
    setContemporaryGroups(next);
    persistState({ contemporaryGroups: next });
  };

  const closeContemporaryGroup = (id: string) => {
    const next = contemporaryGroups.map((cg) => (cg.id === id ? { ...cg, status: 'CLOSED' as const, endDate: new Date().toISOString().split('T')[0] } : cg));
    setContemporaryGroups(next);
    persistState({ contemporaryGroups: next });
  };

  // Phenotype Observations
  const addPhenotypeObservation = (data: Omit<PhenotypeObservation, 'id'>) => {
    const id = `pheno-${Date.now()}`;
    const newPheno: PhenotypeObservation = { ...data, id };
    const next = [newPheno, ...phenotypeObservations];
    setPhenotypeObservations(next);
    persistState({ phenotypeObservations: next });

    // Update phenotype count in trait
    setTraitDefinitions((prev) =>
      prev.map((t) => (t.id === data.traitId ? { ...t, phenotypeCount: (t.phenotypeCount || 0) + 1 } : t))
    );
    return id;
  };

  const updatePhenotypeObservation = (id: string, updates: Partial<PhenotypeObservation>) => {
    const next = phenotypeObservations.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPhenotypeObservations(next);
    persistState({ phenotypeObservations: next });
  };

  const setPhenotypeQualityStatus = (id: string, status: PhenotypeObservation['qualityStatus'], flag?: string) => {
    const next = phenotypeObservations.map((p) => {
      if (p.id !== id) return p;
      const flags = [...(p.qualityFlags || [])];
      if (flag && !flags.includes(flag)) {
        flags.push(flag);
      }
      return { ...p, qualityStatus: status, qualityFlags: flags };
    });
    setPhenotypeObservations(next);
    persistState({ phenotypeObservations: next });
  };

  const bulkValidatePhenotypes = (ids: string[]) => {
    const next = phenotypeObservations.map((p) =>
      ids.includes(p.id) ? { ...p, qualityStatus: 'VALIDATED' as const } : p
    );
    setPhenotypeObservations(next);
    persistState({ phenotypeObservations: next });
  };

  const bulkRejectPhenotypes = (ids: string[], reason: string) => {
    const next = phenotypeObservations.map((p) => {
      if (!ids.includes(p.id)) return p;
      const flags = [...(p.qualityFlags || []), `REJECTED: ${reason}`];
      return { ...p, qualityStatus: 'REJECTED' as const, qualityFlags: flags };
    });
    setPhenotypeObservations(next);
    persistState({ phenotypeObservations: next });
  };

  // Performance Tests
  const addPerformanceTest = (data: Omit<PerformanceTest, 'id' | 'enrolledCount' | 'completedCount'> & { enrolledCount?: number; completedCount?: number }) => {
    const id = `pt-${Date.now()}`;
    const newPt: PerformanceTest = {
      ...data,
      id,
      enrolledCount: data.enrolledCount ?? 0,
      completedCount: data.completedCount ?? 0,
    };
    const next = [...performanceTests, newPt];
    setPerformanceTests(next);
    persistState({ performanceTests: next });
    return id;
  };

  const updatePerformanceTest = (id: string, updates: Partial<PerformanceTest>) => {
    const next = performanceTests.map((pt) => (pt.id === id ? { ...pt, ...updates } : pt));
    setPerformanceTests(next);
    persistState({ performanceTests: next });
  };

  const enrollAnimalInTest = (data: Omit<PerformanceTestEnrollment, 'id'>) => {
    const id = `pte-${Date.now()}`;
    const newEnrollment: PerformanceTestEnrollment = { ...data, id };
    const next = [...performanceTestEnrollments, newEnrollment];
    setPerformanceTestEnrollments(next);
    persistState({ performanceTestEnrollments: next });

    // Update test enrolled count
    setPerformanceTests((prev) =>
      prev.map((pt) =>
        pt.id === data.performanceTestId
          ? { ...pt, enrolledCount: (pt.enrolledCount || 0) + 1 }
          : pt
      )
    );
    return id;
  };

  const updateTestEnrollment = (id: string, updates: Partial<PerformanceTestEnrollment>) => {
    const next = performanceTestEnrollments.map((pte) =>
      pte.id === id ? { ...pte, ...updates } : pte
    );
    setPerformanceTestEnrollments(next);
    persistState({ performanceTestEnrollments: next });
  };

  // Laboratories
  const addLaboratory = (data: Omit<Laboratory, 'id' | 'sampleVolume' | 'assayVolume'>) => {
    const id = `lab-${Date.now()}`;
    const newLab: Laboratory = {
      ...data,
      id,
      sampleVolume: 0,
      assayVolume: 0,
    };
    const next = [...laboratories, newLab];
    setLaboratories(next);
    persistState({ laboratories: next });
    return id;
  };

  const updateLaboratory = (id: string, updates: Partial<Laboratory>) => {
    const next = laboratories.map((l) => (l.id === id ? { ...l, ...updates } : l));
    setLaboratories(next);
    persistState({ laboratories: next });
  };

  // Genetic Samples
  const addGeneticSample = (data: Omit<GeneticSample, 'id' | 'assayCount'>) => {
    const id = `sample-${Date.now()}`;
    const newSample: GeneticSample = {
      ...data,
      id,
      assayCount: 0,
    };
    const next = [newSample, ...geneticSamples];
    setGeneticSamples(next);
    persistState({ geneticSamples: next });
    return id;
  };

  const updateGeneticSample = (id: string, updates: Partial<GeneticSample>) => {
    const next = geneticSamples.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setGeneticSamples(next);
    persistState({ geneticSamples: next });
  };

  const updateGeneticSampleStatus = (id: string, status: GeneticSample['status']) => {
    updateGeneticSample(id, { status });
  };

  const advanceSampleStatus = (
    id: string,
    newStatus: GeneticSample['status'],
    handler: string,
    location: string,
    actionNote: string
  ) => {
    const next = geneticSamples.map((s) => {
      if (s.id !== id) return s;
      const custody = [
        ...(s.chainOfCustody || []),
        {
          timestamp: new Date().toLocaleString(),
          location,
          handledBy: handler,
          action: actionNote,
        },
      ];
      return {
        ...s,
        status: newStatus,
        chainOfCustody: custody,
      };
    });
    setGeneticSamples(next);
    persistState({ geneticSamples: next });
  };

  const addSampleCustodyEvent = (
    sampleId: string,
    event: { timestamp: string; location: string; handledBy: string; action: string; notes?: string }
  ) => {
    const next = geneticSamples.map((s) => {
      if (s.id !== sampleId) return s;
      const custody = [...(s.chainOfCustody || []), event];
      return { ...s, chainOfCustody: custody };
    });
    setGeneticSamples(next);
    persistState({ geneticSamples: next });
  };

  // Genotyping Assays & QC
  const addGenotypingAssay = (data: Omit<GenotypingAssay, 'id'>) => {
    const id = `assay-${Date.now()}`;
    const newAssay: GenotypingAssay = { ...data, id };
    const next = [newAssay, ...genotypingAssays];
    setGenotypingAssays(next);
    persistState({ genotypingAssays: next });

    // Update sample assay count
    setGeneticSamples((prev) =>
      prev.map((s) => (s.id === data.sampleId ? { ...s, assayCount: (s.assayCount || 0) + 1, status: 'COMPLETED' } : s))
    );
    return id;
  };

  const updateGenotypingAssay = (id: string, updates: Partial<GenotypingAssay>) => {
    const next = genotypingAssays.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setGenotypingAssays(next);
    persistState({ genotypingAssays: next });
  };

  const updateAssayQcStatus = (id: string, qcStatus: AssayQcStatus, notes?: string) => {
    updateGenotypingAssay(id, { qcStatus, ...(notes ? { qcNotes: notes } : {}) });
  };

  const addGenotypeQcResult = (data: Omit<GenotypeQcResult, 'id'>) => {
    const id = `qc-${Date.now()}`;
    const newQc: GenotypeQcResult = { ...data, id };
    const next = [...genotypeQcResults, newQc];
    setGenotypeQcResults(next);
    persistState({ genotypeQcResults: next });
    return id;
  };

  // Markers & Conditions
  const addGeneticMarker = (data: Omit<GeneticMarker, 'id' | 'resultCount'>) => {
    const id = `marker-${Date.now()}`;
    const newMarker: GeneticMarker = {
      ...data,
      id,
      resultCount: 0,
    };
    const next = [...geneticMarkers, newMarker];
    setGeneticMarkers(next);
    persistState({ geneticMarkers: next });
    return id;
  };

  const updateGeneticMarker = (id: string, updates: Partial<GeneticMarker>) => {
    const next = geneticMarkers.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setGeneticMarkers(next);
    persistState({ geneticMarkers: next });
  };

  const addAnimalMarkerResult = (data: Omit<AnimalMarkerResult, 'id'>) => {
    const id = `amr-${Date.now()}`;
    const newResult: AnimalMarkerResult = { ...data, id };
    const next = [...animalMarkerResults, newResult];
    setAnimalMarkerResults(next);
    persistState({ animalMarkerResults: next });

    setGeneticMarkers((prev) =>
      prev.map((m) => (m.id === data.markerId ? { ...m, resultCount: (m.resultCount || 0) + 1 } : m))
    );
    return id;
  };

  const addGeneticCondition = (data: Omit<GeneticCondition, 'id'>) => {
    const id = `cond-${Date.now()}`;
    const newCond: GeneticCondition = { ...data, id };
    const next = [...geneticConditions, newCond];
    setGeneticConditions(next);
    persistState({ geneticConditions: next });
    return id;
  };

  const updateGeneticCondition = (id: string, updates: Partial<GeneticCondition>) => {
    const next = geneticConditions.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setGeneticConditions(next);
    persistState({ geneticConditions: next });
  };

  const addAnimalGeneticConditionResult = (data: Omit<AnimalGeneticConditionResult, 'id'>) => {
    const id = `agcr-${Date.now()}`;
    const newResult: AnimalGeneticConditionResult = { ...data, id };
    const next = [...animalGeneticConditionResults, newResult];
    setAnimalGeneticConditionResults(next);
    persistState({ animalGeneticConditionResults: next });
    return id;
  };

  const updateAnimalGeneticConditionResult = (id: string, updates: Partial<AnimalGeneticConditionResult>) => {
    const next = animalGeneticConditionResults.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setAnimalGeneticConditionResults(next);
    persistState({ animalGeneticConditionResults: next });
  };

  // Genetic Evaluation Runs & Estimates
  const addGeneticEvaluationRun = (data: Omit<GeneticEvaluationRun, 'id' | 'animalCount' | 'traitCount'>) => {
    const id = `run-${Date.now()}`;
    const newRun: GeneticEvaluationRun = {
      ...data,
      id,
      animalCount: 0,
      traitCount: 0,
    };
    const next = [newRun, ...geneticEvaluationRuns];
    setGeneticEvaluationRuns(next);
    persistState({ geneticEvaluationRuns: next });
    return id;
  };

  const updateGeneticEvaluationRun = (id: string, updates: Partial<GeneticEvaluationRun>) => {
    const next = geneticEvaluationRuns.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setGeneticEvaluationRuns(next);
    persistState({ geneticEvaluationRuns: next });
  };

  const publishGeneticEvaluationRun = (id: string) => {
    const next = geneticEvaluationRuns.map((r) =>
      r.id === id
        ? {
            ...r,
            status: 'PUBLISHED' as const,
            publishedDate: new Date().toISOString().split('T')[0],
          }
        : r
    );
    setGeneticEvaluationRuns(next);
    persistState({ geneticEvaluationRuns: next });
  };

  const addGeneticTraitEstimate = (data: Omit<GeneticTraitEstimate, 'id'>) => {
    const id = `est-${Date.now()}`;
    const newEst: GeneticTraitEstimate = { ...data, id };
    const next = [...geneticTraitEstimates, newEst];
    setGeneticTraitEstimates(next);
    persistState({ geneticTraitEstimates: next });
    return id;
  };

  const bulkAddEstimates = (estimates: Omit<GeneticTraitEstimate, 'id'>[]) => {
    const created: GeneticTraitEstimate[] = estimates.map((e, idx) => ({
      ...e,
      id: `est-${Date.now()}-${idx}`,
    }));
    const next = [...geneticTraitEstimates, ...created];
    setGeneticTraitEstimates(next);
    persistState({ geneticTraitEstimates: next });
  };

  // Animal Genetic Metrics
  const addAnimalGeneticMetric = (data: Omit<AnimalGeneticMetric, 'id'>) => {
    const id = `agm-${Date.now()}`;
    const newMetric: AnimalGeneticMetric = { ...data, id };
    const next = [...animalGeneticMetrics, newMetric];
    setAnimalGeneticMetrics(next);
    persistState({ animalGeneticMetrics: next });
    return id;
  };

  const updateAnimalGeneticMetric = (id: string, updates: Partial<AnimalGeneticMetric>) => {
    const next = animalGeneticMetrics.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setAnimalGeneticMetrics(next);
    persistState({ animalGeneticMetrics: next });
  };

  const resetGeneticsToDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bovine_genetics_state_v1');
    }
    setBreeds(initialBreeds);
    setTraitDefinitions(initialTraitDefinitions);
    setMeasurementMethods(initialMeasurementMethods);
    setContemporaryGroups(initialContemporaryGroups);
    setPhenotypeObservations(initialPhenotypeObservations);
    setPerformanceTests(initialPerformanceTests);
    setPerformanceTestEnrollments(initialPerformanceTestEnrollments);
    setLaboratories(initialLaboratories);
    setGeneticSamples(initialGeneticSamples);
    setGenotypingAssays(initialGenotypingAssays);
    setGenotypeQcResults(initialGenotypeQcResults);
    setGeneticMarkers(initialGeneticMarkers);
    setAnimalMarkerResults(initialAnimalMarkerResults);
    setGeneticConditions(initialGeneticConditions);
    setAnimalGeneticConditionResults(initialAnimalGeneticConditionResults);
    setGeneticEvaluationRuns(initialGeneticEvaluationRuns);
    setGeneticTraitEstimates(initialGeneticTraitEstimates);
    setAnimalGeneticMetrics(initialAnimalGeneticMetrics);
  };

  return (
    <BovineGeneticsContext.Provider
      value={{
        breeds,
        traitDefinitions,
        measurementMethods,
        contemporaryGroups,
        phenotypeObservations,
        performanceTests,
        performanceTestEnrollments,
        laboratories,
        geneticSamples,
        genotypingAssays,
        genotypeQcResults,
        geneticMarkers,
        animalMarkerResults,
        geneticConditions,
        animalGeneticConditionResults,
        geneticEvaluationRuns,
        geneticTraitEstimates,
        animalGeneticMetrics,

        addBreed,
        updateBreed,
        toggleBreedActive,

        addTraitDefinition,
        updateTraitDefinition,

        addMeasurementMethod,
        updateMeasurementMethod,

        addContemporaryGroup,
        updateContemporaryGroup,
        closeContemporaryGroup,

        addPhenotypeObservation,
        updatePhenotypeObservation,
        setPhenotypeQualityStatus,
        bulkValidatePhenotypes,
        bulkRejectPhenotypes,

        addPerformanceTest,
        updatePerformanceTest,
        enrollAnimalInTest,
        updateTestEnrollment,

        addLaboratory,
        updateLaboratory,

        addGeneticSample,
        updateGeneticSample,
        updateGeneticSampleStatus,
        advanceSampleStatus,
        addSampleCustodyEvent,

        addGenotypingAssay,
        updateGenotypingAssay,
        updateAssayQcStatus,
        addGenotypeQcResult,

        addGeneticMarker,
        updateGeneticMarker,
        addAnimalMarkerResult,
        addGeneticCondition,
        updateGeneticCondition,
        addAnimalGeneticConditionResult,
        updateAnimalGeneticConditionResult,

        addGeneticEvaluationRun,
        updateGeneticEvaluationRun,
        publishGeneticEvaluationRun,
        publishEvaluationRun: publishGeneticEvaluationRun,
        addGeneticTraitEstimate,
        bulkAddEstimates,

        addAnimalGeneticMetric,
        updateAnimalGeneticMetric,

        resetGeneticsToDefaults,
      }}
    >
      {children}
    </BovineGeneticsContext.Provider>
  );
}

export function useGenetics() {
  const context = useContext(BovineGeneticsContext);
  if (!context) {
    throw new Error('useGenetics must be used within a BovineGeneticsProvider');
  }
  return context;
}
