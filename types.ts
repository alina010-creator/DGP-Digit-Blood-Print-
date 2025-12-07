export interface BloodGroupAnalysis {
  bloodGroup: string;
  confidence: number;
  patternType: string;
  reasoning: string;
  personalityTraits: string[];
  rarity: string;
}

export interface AnalysisError {
  message: string;
}

export interface PatientDetails {
  name: string;
  fatherName: string;
  age: string;
  contact: string;
}