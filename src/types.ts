export interface MetricData {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface UserProfile {
  name: string;
  fullName: string;
  ageYears: number;
  ageMonths: number;
  quote: string;
  healthRiskScore: number;
  riskCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
}

export interface Biomarker {
  id: string;
  name: string;
  value: string;
  status: 'Low' | 'Moderate' | 'High' | 'Normal' | 'Good' | string;
  color: string; // e.g. text-green-400, text-amber-400, etc.
}

export interface AssessmentItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  category: string;
}

export interface Message {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
}

export interface HRAPreferredAnswers {
  smoking: string;
  alcohol: string;
  exercise: string;
  sleep: string;
  nutrition: string;
  glucose: string;
}
