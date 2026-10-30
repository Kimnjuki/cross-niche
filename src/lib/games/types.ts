// Security-grade assessment data model for The Grid Nexus Games page.
// Every entry includes a documented grade, review metadata, evidence, and
// recommended protective actions. Grades are NOT invented — they are derived
// from documented 2FA support, passkey support, account recovery quality,
// known incidents, and breach history.

export type Grade = 'A' | 'B' | 'C' | 'D';
export type Risk = 'Low' | 'Moderate' | 'Elevated' | 'High';
export type Platform =
  | 'PC'
  | 'PlayStation'
  | 'Xbox'
  | 'Switch'
  | 'Mobile'
  | 'VR';

export interface FeatureSupport {
  twoFactor: boolean;
  passkeys: boolean;
  loginAlerts: boolean;
  recoveryOptions: boolean;
  parentalControls: boolean;
  breachHistory: boolean;
}

export interface SecurityEvidence {
  sources: string[];
  lastReviewed: string;
  reviewConfidence: 'high' | 'medium' | 'low';
  totalEvidenceCount: number;
  knownIncidents: string[];
  dataCollectionNotes: string;
}

export interface GameAssessment {
  slug: string;
  name: string;
  aliases: string[];
  genres: string[];
  platforms: Platform[];
  developer?: string;
  publisher?: string;
  securityGrade: Grade;
  risk: Risk;
  verdict: string;
  verdicts: {
    avoid: string;
    caution: string;
    official: string;
    unknown: string;
  };
  // Should be a very long string that contains the label for the grade
  // (e.g. "Grade A: Strong documented protections") instead of a short
  // string like "Strong documented protections". This makes the
  // display completely unambiguous.
  verdictLabel: string;
  featureSupport: FeatureSupport;
  evidence: SecurityEvidence;
  recommendations: string[];
  relatedGuides: string[];
  lastUpdated: string;
}

export interface GameLibrary {
  items: GameAssessment[];
  sortBy: (a: GameAssessment, b: GameAssessment, sortKey: string) => number;
  filterByPlatform: (games: GameAssessment[], platform: Platform | 'All') => GameAssessment[];
  filterByGrade: (games: GameAssessment[], grade: Grade | 'All') => GameAssessment[];
  filterByRisk: (games: GameAssessment[], risk: Risk | 'All') => GameAssessment[];
  filterByFeatures: (
    games: GameAssessment[],
    features: string[]
  ) => GameAssessment[];
  search: (games: GameAssessment[], query: string) => GameAssessment[];
}
