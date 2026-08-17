/**
 * SEO Experiments Log — tracks all SEO experiments, their status, and results.
 *
 * Used by the SEO team to track:
 * - Title/meta description rewrites (GN-P1-02, GN-P1-03)
 * - Navigation IA changes (GN-P1-06)
 * - Topic hub internal linking (GN-P1-07)
 * - Tool replication structured data (GN-P1-09)
 * - Canonical/redirect fixes (GN-P1-01)
 * - Prerender/SSR experiments (GN-P0-04)
 */

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'rolled-back';
export type ExperimentMetric = 'ctr' | 'clicks' | 'impressions' | 'position' | 'conversion' | 'core-web-vitals' | 'index-coverage' | 'organic-traffic';

export interface ExperimentResult {
  metric: ExperimentMetric;
  before: number;
  after: number;
  change: number;
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface SEOExperiment {
  id: string;
  name: string;
  hypothesis: string;
  implementationDate: string;
  status: ExperimentStatus;
  priority: 'p0' | 'p1' | 'p2' | 'p3';
  hypothesisTicket?: string;
  details: {
    affectedUrls: string[];
    changeDescription: string;
    experimentType: 'title' | 'meta' | 'navigation' | 'internal-linking' | 'structured-data' | 'canonical' | 'redirect' | 'content' | 'technical' | 'ux';
  };
  results?: ExperimentResult[];
  deployedToProd: boolean;
  notes?: string;
}

export const SEO_EXPERIMENTS: SEOExperiment[] = [
  {
    id: 'gn-p1-02-ctr-title-rewrites',
    name: 'Gaming Account Security Title Rewrite',
    hypothesis: 'Including "compromised" and "2026" in title will increase CTR from 3.2% to 5.5%',
    implementationDate: '2026-08-17',
    status: 'running',
    priority: 'p1',
    hypothesisTicket: 'GN-P1-02',
    details: {
      affectedUrls: ['/article/how-to-check-if-your-gaming-accounts-have-been-compromised'],
      changeDescription: 'Rewrote meta title from "How to Check If Your Gaming Accounts Have Been Compromised" to "Is Your Gaming Account Hacked? 5 Ways to Check + Fix It (2026) [Guide]".',
      experimentType: 'title',
    },
    deployedToProd: true,
    notes: 'Waiting for GSC data to show CTR improvement. Expected 2-4 weeks for statistical significance.',
  },
  {
    id: 'gn-p1-06-nav-reorg',
    name: 'Gaming-Security Navigation Reorganization',
    hypothesis: 'Repositioning navigation around gaming-security intent will increase time-on-site from 2:15 to 3:45 and reduce bounce from 68% to 55%',
    implementationDate: '2026-08-17',
    status: 'running',
    priority: 'p1',
    hypothesisTicket: 'GN-P1-06',
    details: {
      affectedUrls: ['/*'],
      changeDescription: 'Reorganized navigation: Gaming Security, Account Protection, Scams & Threats, Tools, Steam Scanner, Checkup, Guides, Latest.',
      experimentType: 'navigation',
    },
    deployedToProd: true,
  },
  {
    id: 'gn-p1-09-tool-structured-data',
    name: 'Steam Security Scanner SoftwareApplication Schema',
    hypothesis: 'Adding SoftwareApplication schema will increase rich result appearance and CTR for tool queries',
    implementationDate: '2026-08-17',
    status: 'running',
    priority: 'p1',
    hypothesisTicket: 'GN-P1-09',
    details: {
      affectedUrls: ['/tools/steam-scanner'],
      changeDescription: 'Migrated SteamScanner page to ToolPageSEO with SoftwareApplication structured data.',
      experimentType: 'structured-data',
    },
    deployedToProd: true,
  },
];
