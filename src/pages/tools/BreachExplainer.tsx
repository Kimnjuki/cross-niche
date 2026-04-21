import React, { useState, useCallback, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, Shield, ArrowLeft, Search, ChevronRight,
  Users, Calendar, Database, Lock, Eye, Gamepad2, Code2,
  Building2, RefreshCcw, ExternalLink, Activity, Zap,
  AlertOctagon, Clock, CheckCircle, XCircle, Info,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface AudienceImpact {
  segment: 'gamers' | 'general_users' | 'enterprises' | 'developers';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  impact: string;
  risk: 'high' | 'medium' | 'low';
  actions: string[];
}

interface ActionStep {
  priority: 'immediate' | 'this_week' | 'this_month';
  action: string;
  detail: string;
}

interface BreachIncident {
  id: string;
  name: string;
  organization: string;
  date: string;
  discoveredDate?: string;
  disclosedDate?: string;
  severity: Severity;
  affectedRecords: string;
  sector: string;
  dataTypes: string[];
  summary: string;
  technicalDetail: string;
  rootCause: string;
  attackVector: string;
  patchStatus: 'patched' | 'partial' | 'unpatched' | 'mitigated';
  audienceImpacts: AudienceImpact[];
  actionSteps: ActionStep[];
  cveIds?: string[];
  sources: { name: string; url: string }[];
  nexusNote: string;
}

// ── Breach database ───────────────────────────────────────────────────────────
// Swap with your `threatIntel` Convex table for live data

const BREACHES: BreachIncident[] = [
  {
    id: 'change-healthcare-2024',
    name: 'Change Healthcare',
    organization: 'UnitedHealth Group / Change Healthcare',
    date: 'February 2024',
    discoveredDate: 'Feb 21, 2024',
    disclosedDate: 'Mar 5, 2024',
    severity: 'critical',
    affectedRecords: '~190 million',
    sector: 'Healthcare',
    dataTypes: ['Medical records', 'Prescriptions', 'Insurance details', 'SSNs', 'DOB', 'Address', 'Payment info'],
    summary: 'The largest healthcare data breach in US history. ALPHV/BlackCat ransomware group breached Change Healthcare — a claims processor handling 1-in-3 US patient records — via a stolen Citrix credential with no MFA. The attack disrupted prescription fulfilment across the US for weeks.',
    technicalDetail: 'Attackers used compromised Citrix remote-access credentials (no MFA enforced) to gain initial access. Lateral movement via living-off-the-land techniques. ALPHV encrypted systems and exfiltrated ~6TB of data before deploying ransomware across thousands of servers. UnitedHealth paid $22M ransom — then a faction of the group performed a second extortion attempt.',
    rootCause: 'No MFA on legacy Citrix VPN. Over-privileged service accounts. Inadequate network segmentation in a healthcare-critical environment.',
    attackVector: 'Credential theft → Citrix VPN → lateral movement → ransomware deployment',
    patchStatus: 'mitigated',
    audienceImpacts: [
      { segment: 'general_users', label: 'US Patients', icon: Users, impact: 'Your medical history, prescriptions, and insurance data may be for sale on dark-web markets. Identity theft risk is extremely high.', risk: 'high', actions: ['Monitor EOB statements for unknown charges', 'Place a credit freeze at all 3 bureaus', 'Check CHC breach notification site'] },
      { segment: 'enterprises', label: 'Healthcare Orgs', icon: Building2, impact: 'Downstream pharmacies and hospitals were cut off from claims processing for weeks, causing billing paralysis.', risk: 'high', actions: ['Enforce MFA on all remote-access gateways', 'Segment healthcare payment networks', 'Test third-party vendor security annually'] },
      { segment: 'gamers', label: 'Gamers & Consumers', icon: Gamepad2, impact: 'Low direct risk unless you received US prescriptions. If your SSN was exposed, monitor for identity fraud.', risk: 'low', actions: ['Check haveibeenpwned.com with your email', 'Monitor credit report for new accounts'] },
      { segment: 'developers', label: 'Developers & DevOps', icon: Code2, impact: 'Industry-defining lesson: no MFA on VPN gateways is now an unacceptable configuration. Zero-trust adoption will be mandated.', risk: 'medium', actions: ['Audit all remote-access tools for MFA enforcement', 'Review vendor access policies', 'Implement just-in-time privileged access'] },
    ],
    actionSteps: [
      { priority: 'immediate', action: 'Place credit freezes', detail: 'Contact Equifax, Experian, and TransUnion to freeze your credit report immediately.' },
      { priority: 'immediate', action: 'Monitor EOB statements', detail: 'Review your Explanation of Benefits from your insurer for any unfamiliar medical services.' },
      { priority: 'this_week', action: 'Check breach notification', detail: 'Visit the UnitedHealth breach notification portal to see if your data was confirmed in the breach.' },
      { priority: 'this_week', action: 'Enrol in credit monitoring', detail: 'CHC is offering 2 years of free credit monitoring — enrol via the official site.' },
      { priority: 'this_month', action: 'Review insurance EOBs for 12 months', detail: 'Medical identity theft can manifest months later as fraudulent claims in your name.' },
    ],
    sources: [
      { name: 'UnitedHealth Breach Notice', url: 'https://www.unitedhealthgroup.com/ns/cybersecurity-update.html' },
      { name: 'CISA Advisory', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' },
    ],
    nexusNote: 'The single most impactful US healthcare breach ever recorded. If you received US medical care, prescriptions, or had insurance processed through a US pharmacy since 2015, your data is likely exposed.',
  },
  {
    id: 'att-2024',
    name: 'AT&T 73M Records Breach',
    organization: 'AT&T',
    date: 'March 2024',
    discoveredDate: 'Mar 30, 2024',
    disclosedDate: 'Mar 30, 2024',
    severity: 'high',
    affectedRecords: '~73 million',
    sector: 'Telecommunications',
    dataTypes: ['Full names', 'Email addresses', 'Mailing addresses', 'Phone numbers', 'DOB', 'SSNs', 'Account passcodes'],
    summary: 'AT&T disclosed that data for 73 million current and former customers was found on the dark web. The dataset included encrypted passcodes that were easily decryptable. The data originated from a 2019 breach AT&T had previously denied. A second separate breach in July 2024 exposed call records for nearly all AT&T customers.',
    technicalDetail: 'Data includes encrypted 4-digit passcodes that, once decrypted via known patterns, allow account takeover. Passcodes protect against unauthorised account changes. The July 2024 incident separately exposed metadata for 109 billion call and text records stored on third-party cloud infrastructure (Snowflake).',
    rootCause: 'Weak passcode encryption. Third-party cloud storage without adequate access controls.',
    attackVector: 'Third-party data access → exfiltration → dark-web sale',
    patchStatus: 'patched',
    audienceImpacts: [
      { segment: 'general_users', label: 'AT&T Customers', icon: Users, impact: 'Your personal data and account passcode are on the dark web. Risk of SIM-swap attacks and account takeover is elevated.', risk: 'high', actions: ['Reset your AT&T account passcode immediately', 'Enable SIM lock/port freeze with AT&T', 'Freeze credit with all 3 bureaus'] },
      { segment: 'gamers', label: 'Mobile Gamers', icon: Gamepad2, impact: 'If your gaming accounts use SMS 2FA tied to an AT&T number, SIM-swap attacks could bypass that protection.', risk: 'medium', actions: ['Switch gaming accounts from SMS 2FA to an authenticator app', 'Add a SIM PIN with your carrier'] },
      { segment: 'enterprises', label: 'Enterprises', icon: Building2, impact: 'Call metadata exposure (July breach) reveals business relationships, deal discussions, and internal structure.', risk: 'medium', actions: ['Encrypt business communications end-to-end', 'Audit employee AT&T accounts', 'Brief employees on SIM-swap social engineering'] },
      { segment: 'developers', label: 'Developers', icon: Code2, impact: 'SMS OTP is definitively broken as a high-security 2FA method. Implement TOTP/FIDO2 in all your applications.', risk: 'low', actions: ['Remove SMS-as-only-2FA from your applications', 'Implement TOTP or passkeys', 'Never rely on phone numbers as primary identity anchors'] },
    ],
    actionSteps: [
      { priority: 'immediate', action: 'Reset AT&T account passcode', detail: 'Log into myAT&T and change your 4-digit passcode to something unique and not linked to personal info.' },
      { priority: 'immediate', action: 'Add SIM PIN / freeze port-out', detail: 'Call AT&T and enable number port-out protection to prevent SIM-swap attacks.' },
      { priority: 'this_week', action: 'Switch SMS 2FA to authenticator', detail: 'Any account using SMS 2FA with an AT&T number should switch to an authenticator app immediately.' },
      { priority: 'this_month', action: 'Place credit freeze', detail: 'SSNs in the breach enable new account fraud. Freeze your credit at Equifax, Experian, TransUnion.' },
    ],
    sources: [
      { name: 'AT&T Announcement', url: 'https://about.att.com/story/2024/att-data-set.html' },
    ],
    nexusNote: 'Two separate AT&T breaches in 2024. The March breach exposed identity data with crackable passcodes; the July breach exposed call metadata. Together they affect most of AT&T\'s customer base.',
  },
  {
    id: 'salt-typhoon-2024',
    name: 'Salt Typhoon (US Telco Espionage)',
    organization: 'Multiple US Telecoms (Verizon, AT&T, T-Mobile, Lumen)',
    date: 'October 2024',
    discoveredDate: 'Oct 2024',
    disclosedDate: 'Dec 2024',
    severity: 'critical',
    affectedRecords: '~1 million+ (targeted surveillance)',
    sector: 'Telecommunications / National Security',
    dataTypes: ['Real-time call intercepts', 'SMS content', 'Voicemails', 'Geolocation', 'Law enforcement wiretap orders'],
    summary: 'Chinese state-sponsored threat actor Salt Typhoon (APT40) breached multiple major US telecom providers and maintained persistent access for months. The attackers accessed wiretap systems used by law enforcement, call records of high-value political targets, and metadata for a large number of US subscribers.',
    technicalDetail: 'Salt Typhoon exploited known vulnerabilities in Cisco routers at telecom network edges. The group pivoted from core routers into CALEA (Communications Assistance for Law Enforcement Act) intercept infrastructure. They extracted not just call metadata but real-time interception capability. The FBI confirmed access to lawful interception systems.',
    rootCause: 'Unpatched network edge devices. Nation-state level reconnaissance. Fundamental design flaw in CALEA wiretap infrastructure (single backend accessible across networks).',
    attackVector: 'Cisco router exploits → core network → CALEA lawful intercept systems → data exfiltration',
    patchStatus: 'partial',
    cveIds: ['CVE-2023-20198', 'CVE-2023-20273'],
    audienceImpacts: [
      { segment: 'general_users', label: 'All US Phone Users', icon: Users, impact: 'If you called, texted, or received calls in the US, call metadata was likely accessible. High-value individuals (political, govt, finance) had calls intercepted.', risk: 'medium', actions: ['Use encrypted messaging (Signal) for sensitive conversations', 'Enable Lockdown Mode on iPhone if you\'re a high-value target', 'Assume SMS/calls are not private'] },
      { segment: 'gamers', label: 'Gamers (Voice Comms)', icon: Gamepad2, impact: 'Your voice chat and mobile calls were not directly targeted. However this underscores why gaming should use encrypted VOIP.', risk: 'low', actions: ['Use Discord (encrypted) over carrier calls for gaming voice', 'Avoid sharing sensitive info over carrier calls'] },
      { segment: 'enterprises', label: 'High-Value Enterprises', icon: Building2, impact: 'Business calls and internal discussions conducted over PSTN are now demonstrably vulnerable to nation-state collection.', risk: 'high', actions: ['Move all sensitive business comms to encrypted platforms', 'Brief executives on secure communications protocols', 'Assume all carrier metadata is collected'] },
      { segment: 'developers', label: 'Security Teams', icon: Code2, impact: 'This breach defines the new threat model: assume carrier networks are hostile. Encryption in transit is mandatory.', risk: 'medium', actions: ['Design with end-to-end encryption as a baseline', 'Never log sensitive data with telcos', 'Implement encrypted communication APIs'] },
    ],
    actionSteps: [
      { priority: 'immediate', action: 'Switch sensitive comms to Signal', detail: 'Signal provides end-to-end encrypted calls and messages that are cryptographically protected even from carrier-level access.' },
      { priority: 'immediate', action: 'Patch Cisco IOS XE devices', detail: 'If you manage network infrastructure, apply patches for CVE-2023-20198 and CVE-2023-20273 immediately.' },
      { priority: 'this_week', action: 'Audit network edge devices', detail: 'Check all internet-facing routers and switches for known vulnerabilities. Segment network access.' },
      { priority: 'this_month', action: 'Review communications security policy', detail: 'Define which communications require encryption. Train staff on secure communication tools.' },
    ],
    sources: [
      { name: 'CISA Joint Advisory', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a' },
    ],
    nexusNote: 'A defining intelligence failure. Salt Typhoon\'s persistent access to US telecom CALEA infrastructure means phone calls and SMS were never truly private for a period spanning years. Encrypted messaging is now a national security recommendation, not a privacy preference.',
  },
  {
    id: 'powerschool-2025',
    name: 'PowerSchool Student Data Breach',
    organization: 'PowerSchool / Bain Capital',
    date: 'December 2024',
    discoveredDate: 'Dec 28, 2024',
    disclosedDate: 'Jan 7, 2025',
    severity: 'high',
    affectedRecords: '~62 million students & 9.5 million educators',
    sector: 'Education',
    dataTypes: ['Full names', 'Addresses', 'DOB', 'SSNs', 'Medical records', 'Academic records', 'Parent contact info'],
    summary: 'PowerSchool, the largest K-12 student information system provider in North America, was breached via a compromised customer support portal credential (no MFA). Attackers exfiltrated data on tens of millions of children, teachers, and parents across 6,500+ schools in the US, Canada, UK, and Australia.',
    technicalDetail: 'Attackers obtained credentials to the PowerSource customer support portal. From there they accessed a data export function that had no additional authentication or rate limiting. The CSV export tool allowed bulk download of student and staff PII across all districts the support user could access.',
    rootCause: 'Stolen credentials on support portal with no MFA. Overprivileged support account with bulk data export access. No anomaly detection on large data exports.',
    attackVector: 'Credential theft → support portal login → bulk CSV export → data exfiltration',
    patchStatus: 'patched',
    audienceImpacts: [
      { segment: 'general_users', label: 'Students & Parents', icon: Users, impact: 'If your child attended a North American school using PowerSchool (likely), their academic records, DOB, and possibly SSNs are now on the market.', risk: 'high', actions: ['Contact your school district about breach scope', 'Monitor children\'s credit reports (place early credit freeze)', 'Watch for targeted phishing using school-related details'] },
      { segment: 'gamers', label: 'Student Gamers', icon: Gamepad2, impact: 'Minor gamers whose DOB and full name are exposed risk having gaming accounts targeted with identity verification exploits.', risk: 'medium', actions: ['Ensure gaming accounts for minors don\'t expose school details', 'Monitor for account verification attempts'] },
      { segment: 'enterprises', label: 'Schools & Districts', icon: Building2, impact: 'Districts face potential regulatory fines under FERPA/state laws. Trust in vendor-managed student data is now a boardroom issue.', risk: 'high', actions: ['Enforce MFA on all EdTech vendor portals', 'Audit data access permissions for support accounts', 'Review vendor incident response plans'] },
      { segment: 'developers', label: 'EdTech Developers', icon: Code2, impact: 'Bulk data export functions must require step-up auth, rate limiting, and anomaly detection regardless of the user\'s normal permissions.', risk: 'medium', actions: ['Require re-authentication for bulk data exports', 'Implement rate limits on data export APIs', 'Log and alert on unusual export volumes'] },
    ],
    actionSteps: [
      { priority: 'immediate', action: 'Contact your school district', detail: 'Ask if your district uses PowerSchool and which specific data was exposed for students enrolled there.' },
      { priority: 'immediate', action: 'Freeze children\'s credit', detail: 'All three credit bureaus allow freezes for minors. Do this proactively since child identity theft may not surface for years.' },
      { priority: 'this_week', action: 'Monitor for phishing targeting school info', detail: 'Attackers use school-specific data (teacher names, admin contacts) to craft convincing phishing emails.' },
      { priority: 'this_month', action: 'Enrol in free monitoring if offered', detail: 'PowerSchool is providing free Experian monitoring. Enrol via the official district notification.' },
    ],
    sources: [
      { name: 'PowerSchool Statement', url: 'https://www.powerschool.com/security/sis-platform-incident/' },
    ],
    nexusNote: 'The largest breach of K-12 student data ever recorded. Data on children is uniquely dangerous: it won\'t age out, cannot be changed like a password, and enables long-tail fraud years into the future.',
  },
  {
    id: 'snowflake-customers-2024',
    name: 'Snowflake Customer Breach (UNC5537)',
    organization: 'Snowflake customer tenants (Ticketmaster, Santander, AT&T, ~165 orgs)',
    date: 'April–June 2024',
    discoveredDate: 'May 2024',
    disclosedDate: 'Jun 2024',
    severity: 'critical',
    affectedRecords: '~560 million (Ticketmaster alone)',
    sector: 'Multi-sector (via cloud provider)',
    dataTypes: ['Payment card data', 'Personal contact info', 'Call records', 'Internal business data', 'Employee data'],
    summary: 'Threat actor UNC5537 used credentials stolen via infostealer malware to access ~165 Snowflake customer accounts — all protected only by single-factor authentication. Organisations affected included Ticketmaster (560M records), Santander, AT&T, Advance Auto Parts, and many others. Snowflake\'s own infrastructure was not breached.',
    technicalDetail: 'UNC5537 obtained credentials from logs of infostealer malware (Vidar, LUMMA, Raccoon) infecting employee machines. These credentials were then used to authenticate directly to Snowflake tenants that had not enabled MFA or IP-based access controls. No CVEs exploited — pure credential-based access. Snowflake provides MFA but does not enforce it by default.',
    rootCause: 'No MFA enforced on Snowflake tenants. Employee machines infected with infostealer malware harvesting credentials. No IP allowlisting on data warehouse access.',
    attackVector: 'Infostealer malware → credential harvest → cloud data warehouse login → bulk data export',
    patchStatus: 'mitigated',
    audienceImpacts: [
      { segment: 'general_users', label: 'Ticketmaster / Santander Customers', icon: Users, impact: 'Payment card details, purchase history, and contact info exposed. Monitor cards for fraudulent charges.', risk: 'high', actions: ['Monitor bank/card statements for unusual transactions', 'Request a new card number from your bank', 'Enrol in fraud monitoring if offered'] },
      { segment: 'gamers', label: 'Gaming & Entertainment Consumers', icon: Gamepad2, impact: 'Ticketmaster purchases (concerts, gaming events, esports) are in the breach. Card data and contact info are at risk.', risk: 'medium', actions: ['Replace payment cards used at Ticketmaster', 'Watch for targeted phishing using event purchase history'] },
      { segment: 'enterprises', label: 'Enterprises using Snowflake', icon: Building2, impact: 'If your organisation uses Snowflake without MFA, you are at risk right now. Audit immediately.', risk: 'high', actions: ['Enable MFA on all Snowflake accounts immediately', 'Implement IP allowlisting for Snowflake access', 'Audit for infostealer infections on endpoints'] },
      { segment: 'developers', label: 'Data Engineers & DevOps', icon: Code2, impact: 'Cloud data warehouses require the same authentication hardening as production systems. MFA is non-negotiable.', risk: 'high', actions: ['Enable MFA on Snowflake, BigQuery, Redshift, Databricks', 'Rotate all data warehouse service account credentials', 'Scan endpoint fleet for infostealer infections'] },
    ],
    actionSteps: [
      { priority: 'immediate', action: 'Enable Snowflake MFA now', detail: 'If your org uses Snowflake, enable multi-factor authentication and IP allowlisting for all accounts — do this before the end of today.' },
      { priority: 'immediate', action: 'Replace compromised payment cards', detail: 'If you used Ticketmaster, request a card number replacement from your bank.' },
      { priority: 'this_week', action: 'Scan for infostealer infections', detail: 'Run endpoint detection scans for Vidar, LUMMA, and Raccoon infostealers. Rotate all employee credentials stored in browsers.' },
      { priority: 'this_month', action: 'Audit cloud service authentication', detail: 'Inventory all SaaS tools and cloud platforms your org uses. Ensure MFA is enforced — not just available — for all of them.' },
    ],
    sources: [
      { name: 'Mandiant UNC5537 Report', url: 'https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion' },
    ],
    nexusNote: 'The definitive case study for why cloud MFA is not optional. UNC5537 exploited no vulnerabilities — they simply logged in with stolen passwords. 165+ organisations breached because a checkbox was not ticked.',
  },
];

// ── UI helpers ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical',  color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/40' },
  high:     { label: 'High',      color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
  medium:   { label: 'Medium',    color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  low:      { label: 'Low',       color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/40' },
};

const PATCH_CONFIG: Record<BreachIncident['patchStatus'], { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  patched:    { label: 'Patched',     color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
  partial:    { label: 'Partially Mitigated', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertTriangle },
  unpatched:  { label: 'Unpatched',   color: 'text-destructive', icon: XCircle },
  mitigated:  { label: 'Mitigated',   color: 'text-blue-600 dark:text-blue-400', icon: Shield },
};

const PRIORITY_CONFIG: Record<ActionStep['priority'], { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  immediate:   { label: 'Immediate',     color: 'text-destructive', icon: AlertOctagon },
  this_week:   { label: 'This Week',     color: 'text-yellow-600 dark:text-yellow-400', icon: Clock },
  this_month:  { label: 'This Month',    color: 'text-blue-600 dark:text-blue-400', icon: Activity },
};

const RISK_COLOR: Record<'high' | 'medium' | 'low', string> = {
  high: 'text-destructive', medium: 'text-yellow-600 dark:text-yellow-400', low: 'text-green-600 dark:text-green-400',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BreachExplainer() {
  const [selected, setSelected] = useState<BreachIncident | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<AudienceImpact['segment'] | 'all'>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return BREACHES;
    return BREACHES.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.organization.toLowerCase().includes(q) ||
      b.sector.toLowerCase().includes(q) ||
      b.dataTypes.some(d => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const audienceImpacts = useMemo(() => {
    if (!selected) return [];
    if (activeSegment === 'all') return selected.audienceImpacts;
    return selected.audienceImpacts.filter(a => a.segment === activeSegment);
  }, [selected, activeSegment]);

  const handleBack = useCallback(() => {
    setSelected(null);
    setActiveSegment('all');
  }, []);

  return (
    <Layout>
      <SEO
        title="AI-Powered Breach Explainer | The Grid Nexus"
        description="Understand major data breaches clearly — what was stolen, who is affected, and exactly what to do. Covers Change Healthcare, AT&T, Salt Typhoon, PowerSchool, Snowflake."
        canonical="https://thegridnexus.com/tools/breach-explainer"
        ogType="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Security Tools
          </Link>
          <span>/</span>
          {selected ? (
            <>
              <button onClick={handleBack} className="hover:text-foreground transition-colors">Breach Explainer</button>
              <span>/</span>
              <span className="text-foreground font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="text-foreground font-medium">Breach Explainer</span>
          )}
        </div>

        {/* Header */}
        {!selected && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display font-bold text-4xl mb-2">Breach Explainer</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Plain-language breakdowns of major incidents. Find out who was affected, what was taken, and exactly what to do next.
            </p>
          </div>
        )}

        {/* ── BREACH LIST VIEW ── */}
        {!selected && (
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9"
                placeholder="Search by org, sector, or data type…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Breach cards */}
            {filtered.map(breach => {
              const cfg = SEVERITY_CONFIG[breach.severity];
              const patchCfg = PATCH_CONFIG[breach.patchStatus];
              const PatchIcon = patchCfg.icon;
              return (
                <Card
                  key={breach.id}
                  className={cn('border-l-4 hover:border-primary/50 transition-colors cursor-pointer', cfg.border)}
                  onClick={() => setSelected(breach)}
                >
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <Badge className={cn(cfg.color, cfg.bg, 'border-current text-xs')}>{cfg.label}</Badge>
                          <span className="text-xs text-muted-foreground">{breach.sector}</span>
                          <span className={cn('flex items-center gap-1 text-xs', patchCfg.color)}>
                            <PatchIcon className="h-3 w-3" />{patchCfg.label}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg leading-tight">{breach.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{breach.organization} · {breach.date}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{breach.summary}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{breach.affectedRecords} records</span>
                          <span className="flex items-center gap-1"><Database className="h-3 w-3" />{breach.dataTypes.length} data types</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-3" />
                <p className="font-medium">No matching incidents</p>
                <p className="text-sm">Try a different search term or browse all incidents.</p>
                <Button variant="ghost" className="mt-3" onClick={() => setSearchQuery('')}>Clear search</Button>
              </div>
            )}
          </div>
        )}

        {/* ── BREACH DETAIL VIEW ── */}
        {selected && (() => {
          const cfg = SEVERITY_CONFIG[selected.severity];
          const patchCfg = PATCH_CONFIG[selected.patchStatus];
          const PatchIcon = patchCfg.icon;
          return (
            <div className="space-y-5">
              {/* Back */}
              <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground" onClick={handleBack}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> All Incidents
              </Button>

              {/* Hero card */}
              <Card className={cn('border-l-4', cfg.border)}>
                <CardContent className="pt-6 pb-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={cn(cfg.color, cfg.bg, 'border-current')}>{cfg.label} Severity</Badge>
                    <span className={cn('flex items-center gap-1 text-xs font-medium', patchCfg.color)}>
                      <PatchIcon className="h-3.5 w-3.5" />{patchCfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{selected.date}</span>
                  </div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1">{selected.name}</h1>
                  <p className="text-sm text-muted-foreground mb-4">{selected.organization}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Users, label: 'Affected', value: selected.affectedRecords },
                      { icon: Calendar, label: 'Discovered', value: selected.discoveredDate ?? selected.date },
                      { icon: Lock, label: 'Vector', value: selected.attackVector.split('→')[0].trim() },
                      { icon: Database, label: 'Data Types', value: `${selected.dataTypes.length} categories` },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-lg bg-muted/40 p-3 text-center">
                        <stat.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                        <div className="text-sm font-semibold truncate">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">What happened</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.summary}</p>
                  {selected.cveIds && (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.cveIds.map(cve => (
                        <span key={cve} className="font-mono text-xs px-2 py-0.5 rounded bg-destructive/10 border border-destructive/20 text-destructive">{cve}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical detail */}
              <Card className="border-tech/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-tech" /> Technical Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.technicalDetail}</p>
                  <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
                    {[
                      { label: 'Root cause', value: selected.rootCause },
                      { label: 'Attack chain', value: selected.attackVector },
                    ].map(row => (
                      <div key={row.label}>
                        <span className="text-xs font-semibold text-foreground">{row.label}: </span>
                        <span className="text-xs text-muted-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Data types exposed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4 text-destructive" /> Data Exposed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.dataTypes.map(d => (
                      <span key={d} className="text-xs px-2.5 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-medium">{d}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audience impact */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-gaming" /> Who Is Affected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Segment filter */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveSegment('all')}
                      className={cn('text-xs px-3 py-1 rounded-full border transition-colors', activeSegment === 'all' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}
                    >All</button>
                    {selected.audienceImpacts.map(a => (
                      <button
                        key={a.segment}
                        onClick={() => setActiveSegment(a.segment)}
                        className={cn('text-xs px-3 py-1 rounded-full border transition-colors', activeSegment === a.segment ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>

                  {audienceImpacts.map(a => {
                    const AIcon = a.icon;
                    return (
                      <div key={a.segment} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <AIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{a.label}</span>
                          <span className={cn('ml-auto text-xs font-medium', RISK_COLOR[a.risk])}>
                            {a.risk.charAt(0).toUpperCase() + a.risk.slice(1)} Risk
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{a.impact}</p>
                        <ul className="space-y-1">
                          {a.actions.map(action => (
                            <li key={action} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-gaming" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Action steps */}
              <Card className="border-gaming/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gaming" /> Action Plan
                  </CardTitle>
                  <CardDescription>Ordered by urgency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selected.actionSteps.map((step, i) => {
                    const pc = PRIORITY_CONFIG[step.priority];
                    const PIcon = pc.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                        <PIcon className={cn('h-4 w-4 shrink-0 mt-0.5', pc.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold">{step.action}</span>
                            <span className={cn('text-xs', pc.color)}>{pc.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Nexus note */}
              <Card className="border-security/20 bg-security/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-security" /> Nexus Editorial Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.nexusNote}</p>
                </CardContent>
              </Card>

              {/* Sources */}
              {selected.sources.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold">Sources</p>
                  {selected.sources.map(s => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <ExternalLink className="h-3 w-3" />{s.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Related tools */}
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-semibold mb-3">More Security Tools</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { href: '/tools/ioc-lookup',     icon: Search,   label: 'IOC Lookup',   sub: 'Threat analysis',    color: 'text-security hover:bg-security/10 border-security/20' },
                    { href: '/live-threat-dashboard', icon: Activity, label: 'Live Threats', sub: 'Real-time feed',     color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                    { href: '/tools/zero-trust-quiz', icon: Shield,   label: 'Zero-Trust Quiz', sub: 'Org readiness',  color: 'text-tech hover:bg-tech/10 border-tech/20' },
                  ].map(t => (
                    <Link key={t.href} to={t.href} className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                      <t.icon className="h-4 w-4" />
                      <span className="text-xs font-semibold">{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.sub}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleBack}>
                <RefreshCcw className="mr-1.5 h-4 w-4" /> View All Incidents
              </Button>
            </div>
          );
        })()}
      </div>
    </Layout>
  );
}
