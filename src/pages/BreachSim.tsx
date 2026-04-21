import React, { memo, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import {
  Play, RotateCcw, Share2, Lock, ChevronDown, ChevronUp,
  AlertTriangle, Shield, Clock, DollarSign, Target, CheckCircle,
  XCircle, Eye, Zap, ArrowLeft, Copy, Check, ExternalLink,
  Flame, Activity, FileText, Users, Server, Smartphone,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ScenarioId =
  | 'streamer_account_takeover'
  | 'gaming_clan_discord_breach'
  | 'small_saas_compromise'
  | 'mobile_gamer_sim_swap'
  | 'ransomware_home_lab';

type Phase = 'select' | 'running' | 'report';

interface TimelineEvent {
  time: string;
  actor: 'attacker' | 'defender' | 'system';
  action: string;
  impact: string;
}

interface BlastEntry {
  asset: string;
  exposure: 'critical' | 'high' | 'medium' | 'low';
  detail: string;
}

interface DetectionWindow {
  stage: string;
  window: string;
  signal: string;
  missed: boolean;
}

interface RecoveryStep {
  priority: number;
  action: string;
  timeEst: string;
  tool?: string;
  toolLink?: string;
}

interface HardeningItem {
  control: string;
  effort: 'quick' | 'medium' | 'project';
  impact: 'high' | 'medium' | 'low';
  detail: string;
}

interface MitreEntry {
  tactic: string;
  technique: string;
  id: string;
  description: string;
}

interface SimReport {
  executiveSummary: string;
  attackVector: string;
  totalDamageEst: string;
  breachDuration: string;
  detectionTime: string;
  timeline: TimelineEvent[];
  blastRadius: BlastEntry[];
  detectionWindows: DetectionWindow[];
  recoveryChecklist: RecoveryStep[];
  hardeningRoadmap: HardeningItem[];
  mitre: MitreEntry[];
}

interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  persona: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  tags: string[];
  report: SimReport;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 'streamer_account_takeover',
    title: 'Streamer Account Takeover',
    description: 'A popular Twitch/YouTube streamer loses their account to a credential-stuffing attack after a gaming platform breach.',
    persona: 'Streamer / Creator',
    difficulty: 'Beginner',
    duration: '~3 min read',
    icon: Activity,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    tags: ['Credential Stuffing', 'Session Hijacking', 'Social Engineering'],
    report: {
      executiveSummary: 'A threat actor obtained plaintext credentials from a third-party gaming forum breach and used them to access the streamer\'s primary accounts due to password reuse. Within 6 hours the attacker had monetised the channel, locked the victim out, and harvested subscriber PII. Total estimated loss: $14,200 in ad revenue reversal, lost sponsorships, and platform re-verification costs.',
      attackVector: 'Credential Stuffing via leaked gaming forum database',
      totalDamageEst: '$14,200',
      breachDuration: '6 hours 22 minutes',
      detectionTime: '4 hours 15 minutes (fan reports)',
      timeline: [
        { time: 'T-0', actor: 'attacker', action: 'Downloads leaked DB from dark-web forum (120k creds)', impact: 'Attack surface established' },
        { time: 'T+00:12', actor: 'attacker', action: 'Runs credential stuffing tool against Twitch login', impact: '847 valid logins found' },
        { time: 'T+00:34', actor: 'attacker', action: 'Logs into target account — no MFA configured', impact: 'Full account access gained' },
        { time: 'T+00:38', actor: 'attacker', action: 'Changes email + backup codes, adds new phone number', impact: 'Victim locked out' },
        { time: 'T+01:10', actor: 'attacker', action: 'Runs fraudulent donation scam stream to 18k live viewers', impact: '$3,400 fraudulent donations collected' },
        { time: 'T+02:00', actor: 'attacker', action: 'Exports subscriber email list via connected tools', impact: '22,000 subscriber emails harvested' },
        { time: 'T+04:15', actor: 'defender', action: 'Fans notice suspicious content; victim alerted via Discord DM', impact: 'Breach discovered' },
        { time: 'T+04:45', actor: 'defender', action: 'Victim contacts Twitch Trust & Safety, files ticket', impact: 'Platform recovery process begins' },
        { time: 'T+06:22', actor: 'system', action: 'Account recovered after identity verification', impact: 'Access restored; damage assessment begins' },
      ],
      blastRadius: [
        { asset: 'Twitch Account', exposure: 'critical', detail: 'Full takeover — content deleted, monetisation diverted' },
        { asset: 'YouTube Channel', exposure: 'high', detail: 'Linked OAuth — attacker had read access to analytics' },
        { asset: 'Discord Server (18k members)', exposure: 'high', detail: 'Admin rights exploited; fake NFT links posted' },
        { asset: 'Subscriber Email List', exposure: 'critical', detail: '22,000 emails exported; phishing campaign risk' },
        { asset: 'Sponsorship Relationships', exposure: 'medium', detail: 'Brand mentions during fraud stream; sponsor notified' },
        { asset: 'PayPal/Stripe Payout Account', exposure: 'low', detail: 'Separate credentials; not accessed in this incident' },
      ],
      detectionWindows: [
        { stage: 'Initial Login', window: 'T+00:34', signal: 'New device / impossible travel login alert (not enabled)', missed: true },
        { stage: 'Email Change', window: 'T+00:38', signal: 'Recovery email should have received change notification', missed: true },
        { stage: 'Live Stream Anomaly', window: 'T+01:10', signal: 'Content moderation AI could flag donation-scam overlays', missed: true },
        { stage: 'Fan Reports', window: 'T+04:15', signal: 'Community Discord report surfaced the breach', missed: false },
        { stage: 'Platform Detection', window: 'T+06:22', signal: 'Twitch Trust & Safety manual review completed', missed: false },
      ],
      recoveryChecklist: [
        { priority: 1, action: 'Contact platform Trust & Safety with government ID proof', timeEst: '1–4 hrs' },
        { priority: 2, action: 'Enable MFA on ALL connected accounts immediately after recovery', timeEst: '15 min', tool: 'Security Score', toolLink: '/security-score' },
        { priority: 3, action: 'Rotate passwords on all accounts sharing the compromised password', timeEst: '30 min' },
        { priority: 4, action: 'Revoke all third-party OAuth app authorisations', timeEst: '20 min' },
        { priority: 5, action: 'Notify subscriber community about phishing risk from harvested emails', timeEst: '1 hr' },
        { priority: 6, action: 'File FTC/IC3 report for fraudulent donation collection', timeEst: '45 min' },
        { priority: 7, action: 'Audit connected payment accounts for unauthorised transactions', timeEst: '30 min' },
      ],
      hardeningRoadmap: [
        { control: 'Enable TOTP/hardware key MFA on Twitch, YouTube, Discord', effort: 'quick', impact: 'high', detail: 'Blocks 99.9% of credential stuffing attacks' },
        { control: 'Use unique passwords via a password manager', effort: 'quick', impact: 'high', detail: 'Eliminates credential stuffing entirely' },
        { control: 'Set up login alerts on all platforms', effort: 'quick', impact: 'medium', detail: 'Average 94-minute earlier detection' },
        { control: 'Separate business email from public-facing handles', effort: 'medium', impact: 'high', detail: 'Reduces social engineering surface' },
        { control: 'Review and prune OAuth app connections quarterly', effort: 'medium', impact: 'medium', detail: 'Reduces blast radius of any future compromise' },
        { control: 'Run IOC Lookup on email before major brand deals', effort: 'quick', impact: 'medium', detail: 'Catches data broker exposure early' },
      ],
      mitre: [
        { tactic: 'Initial Access', technique: 'Valid Accounts', id: 'T1078', description: 'Adversary used valid credentials obtained from a prior third-party breach' },
        { tactic: 'Credential Access', technique: 'Brute Force: Credential Stuffing', id: 'T1110.004', description: 'Automated stuffing of 120k leaked credentials' },
        { tactic: 'Persistence', technique: 'Account Manipulation', id: 'T1098', description: 'Email and 2FA settings modified to maintain access' },
        { tactic: 'Collection', technique: 'Data from Information Repositories', id: 'T1213', description: 'Subscriber list exported from connected analytics tools' },
        { tactic: 'Impact', technique: 'Financial Theft', id: 'T1657', description: 'Fraudulent donation overlay run during hijacked livestream' },
      ],
    },
  },
  {
    id: 'gaming_clan_discord_breach',
    title: 'Gaming Clan Discord Breach',
    description: 'A 500-member esports clan Discord is compromised via a malicious bot invite, leading to mass DM phishing.',
    persona: 'Community Manager / Gamer',
    difficulty: 'Intermediate',
    duration: '~4 min read',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    tags: ['Malicious Bot', 'Phishing', 'Token Theft'],
    report: {
      executiveSummary: 'An attacker gained Discord server admin access by tricking a moderator into inviting a trojanised bot with excessive OAuth permissions. The bot harvested moderator tokens, posted mass DMs with a fake "free Nitro" phishing link to all 500 members, and exfiltrated server member data. 47 members clicked the link; 12 had credentials stolen.',
      attackVector: 'Malicious Discord Bot with excessive OAuth scopes',
      totalDamageEst: '$2,800 (account recovery + lost memberships)',
      breachDuration: '2 hours 10 minutes',
      detectionTime: '45 minutes (member reports)',
      timeline: [
        { time: 'T-0', actor: 'attacker', action: 'Creates convincing "Tournament Manager" bot with hidden malicious payload', impact: 'Infrastructure prepared' },
        { time: 'T+00:05', actor: 'attacker', action: 'Contacts clan owner via DM, offers "free tournament automation"', impact: 'Social engineering begins' },
        { time: 'T+00:22', actor: 'defender', action: 'Moderator invites bot with Administrator scope without reviewing permissions', impact: 'Full server access granted to attacker' },
        { time: 'T+00:23', actor: 'attacker', action: 'Bot harvests all moderator tokens present in server', impact: '3 moderator accounts compromised' },
        { time: 'T+00:30', actor: 'attacker', action: 'Mass DM sent to all 500 members: fake Nitro gift link', impact: '47 members click link; 12 enter credentials' },
        { time: 'T+00:45', actor: 'defender', action: 'Members report suspicious DMs in general chat', impact: 'Incident first noticed' },
        { time: 'T+00:55', actor: 'defender', action: 'Owner kicks bot, revokes moderator tokens', impact: 'Attack vector closed' },
        { time: 'T+02:10', actor: 'defender', action: 'All 12 affected accounts recovered; server audit complete', impact: 'Full recovery achieved' },
      ],
      blastRadius: [
        { asset: 'Discord Server', exposure: 'critical', detail: 'Admin access via harvested mod tokens' },
        { asset: '500 Member Accounts', exposure: 'high', detail: 'All received phishing DMs; 47 clicked' },
        { asset: '12 Member Credentials', exposure: 'critical', detail: 'Discord tokens stolen, accounts hijacked' },
        { asset: 'Server Reputation', exposure: 'high', detail: 'Phishing source — 38 members left after incident' },
        { asset: 'Private Tournament Channels', exposure: 'medium', detail: 'Bot had read access to all channels' },
      ],
      detectionWindows: [
        { stage: 'Bot Invite', window: 'T+00:22', signal: 'Bot requested Administrator scope — red flag', missed: true },
        { stage: 'Token Harvest', window: 'T+00:23', signal: 'Unusual API calls from new bot', missed: true },
        { stage: 'Mass DM', window: 'T+00:30', signal: 'Discord rate limiting should have triggered', missed: true },
        { stage: 'Member Reports', window: 'T+00:45', signal: 'Community self-reported suspicious DMs', missed: false },
      ],
      recoveryChecklist: [
        { priority: 1, action: 'Kick all suspicious bots immediately and reset invite links', timeEst: '5 min' },
        { priority: 2, action: 'Force-reset tokens for all moderators (Settings → Authorised Apps → Revoke All)', timeEst: '10 min' },
        { priority: 3, action: 'Post incident notice in server with clear phishing warning', timeEst: '15 min' },
        { priority: 4, action: 'DM all 47 click victims individually with recovery instructions', timeEst: '1 hr' },
        { priority: 5, action: 'Audit bot permissions — never grant Administrator scope', timeEst: '20 min' },
        { priority: 6, action: 'Enable 2FA requirement for all moderator roles', timeEst: '10 min' },
      ],
      hardeningRoadmap: [
        { control: 'Bot permission policy: never grant Administrator scope', effort: 'quick', impact: 'high', detail: 'Use minimal required permissions only' },
        { control: 'Enable 2FA enforcement for all moderators', effort: 'quick', impact: 'high', detail: 'Prevents token theft from cascading' },
        { control: 'Server verification level: Phone Verified for DM privileges', effort: 'quick', impact: 'medium', detail: 'Slows mass DM attack vectors' },
        { control: 'Vetting process for any new bot additions', effort: 'medium', impact: 'high', detail: 'Review source code or use known-good bots' },
        { control: 'Disable DMs from server members by default', effort: 'quick', impact: 'medium', detail: 'Reduces phishing DM reach' },
      ],
      mitre: [
        { tactic: 'Initial Access', technique: 'Phishing: Spearphishing via Service', id: 'T1566.003', description: 'Bot invite request delivered via Discord DM to server owner' },
        { tactic: 'Credential Access', technique: 'Steal Application Access Token', id: 'T1528', description: 'Bot harvested Discord OAuth tokens from active sessions' },
        { tactic: 'Lateral Movement', technique: 'Use Alternate Authentication Material', id: 'T1550', description: 'Stolen tokens used to act as moderators' },
        { tactic: 'Collection', technique: 'Data from Information Repositories', id: 'T1213', description: 'Member list and private channel history accessed' },
        { tactic: 'Impact', technique: 'Phishing for Information', id: 'T1598', description: 'Mass DM phishing to harvest additional credentials' },
      ],
    },
  },
  {
    id: 'small_saas_compromise',
    title: 'Small SaaS API Key Exposure',
    description: 'A solo developer accidentally commits AWS + Stripe API keys to a public GitHub repo.',
    persona: 'Indie Dev / SaaS Founder',
    difficulty: 'Intermediate',
    duration: '~4 min read',
    icon: Server,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    tags: ['Secret Exposure', 'Cloud Compromise', 'Data Exfiltration'],
    report: {
      executiveSummary: 'A developer pushed a .env file containing AWS root keys and Stripe live keys to a public GitHub repository. Automated scanners detected the secrets within 4 minutes. Within 30 minutes, an attacker spun up $18,000 worth of EC2 instances for crypto mining, exfiltrated the customer database (1,200 records), and initiated 14 fraudulent Stripe charges totalling $4,600.',
      attackVector: '.env file committed to public GitHub repository',
      totalDamageEst: '$22,600 (AWS bill + Stripe fraud + customer notification costs)',
      breachDuration: '47 minutes',
      detectionTime: '31 minutes (AWS billing alert)',
      timeline: [
        { time: 'T-0', actor: 'defender', action: 'Developer accidentally commits .env to public repo (git add -A)', impact: 'Secrets exposed publicly' },
        { time: 'T+00:04', actor: 'attacker', action: 'Automated secret scanner detects AWS keys on GitHub', impact: 'Keys discovered within 4 minutes of push' },
        { time: 'T+00:07', actor: 'attacker', action: 'Validates AWS keys — root account with no MFA', impact: 'Full AWS account access confirmed' },
        { time: 'T+00:12', actor: 'attacker', action: 'Spins up 40x p3.8xlarge GPU instances in 6 regions for XMR mining', impact: '$18,000/day spend initiated' },
        { time: 'T+00:18', actor: 'attacker', action: 'Creates new IAM admin user with attacker-controlled email', impact: 'Persistent backdoor established' },
        { time: 'T+00:22', actor: 'attacker', action: 'Dumps RDS database — 1,200 customer records (PII + emails)', impact: 'Customer data exfiltrated' },
        { time: 'T+00:25', actor: 'attacker', action: 'Runs 14 fraudulent Stripe charges against stored card tokens', impact: '$4,600 fraudulent charges' },
        { time: 'T+00:31', actor: 'system', action: 'AWS billing alert fires at $500 threshold', impact: 'Developer alerted' },
        { time: 'T+00:35', actor: 'defender', action: 'Developer rotates keys, deletes instances, revokes Stripe keys', impact: 'Attack contained' },
        { time: 'T+00:47', actor: 'defender', action: 'All services secured; incident documentation begins', impact: 'Breach fully contained' },
      ],
      blastRadius: [
        { asset: 'AWS Account', exposure: 'critical', detail: 'Root-level access; 40 GPU instances spun up across 6 regions' },
        { asset: 'Customer Database (1,200 records)', exposure: 'critical', detail: 'Full PII exfiltration — GDPR/CCPA notification required' },
        { asset: 'Stripe Live Keys', exposure: 'critical', detail: '14 fraudulent charges; all stored card tokens at risk' },
        { asset: 'Application Infrastructure', exposure: 'high', detail: 'S3 buckets, Lambda functions — all exposed to root account' },
        { asset: 'Developer Reputation', exposure: 'medium', detail: 'Customer trust impact; potential regulatory action' },
      ],
      detectionWindows: [
        { stage: 'Git Push', window: 'T-0', signal: 'Pre-commit hook (git-secrets / gitleaks) could have blocked push', missed: true },
        { stage: 'GitHub Push', window: 'T+00:04', signal: 'GitHub Secret Scanning (free for public repos) sends alert', missed: true },
        { stage: 'AWS Login', window: 'T+00:07', signal: 'CloudTrail + GuardDuty impossible-travel alert', missed: true },
        { stage: 'EC2 Spin-up', window: 'T+00:12', signal: 'AWS Budgets alert could have fired at $0 threshold', missed: true },
        { stage: 'Billing Alert', window: 'T+00:31', signal: 'AWS billing alert at $500 fired (31 min late)', missed: false },
      ],
      recoveryChecklist: [
        { priority: 1, action: 'Immediately revoke ALL exposed credentials (AWS + Stripe + any others)', timeEst: '10 min' },
        { priority: 2, action: 'Remove sensitive commit from git history (git filter-branch or BFG)', timeEst: '20 min' },
        { priority: 3, action: 'Audit AWS CloudTrail for all attacker actions in the window', timeEst: '45 min' },
        { priority: 4, action: 'Delete all unauthorised IAM users, roles, and access keys', timeEst: '20 min' },
        { priority: 5, action: 'Dispute fraudulent Stripe charges with Stripe support', timeEst: '30 min' },
        { priority: 6, action: 'Notify affected customers per GDPR/CCPA requirements (72-hour window)', timeEst: '4 hrs' },
        { priority: 7, action: 'File AWS abuse report and request billing credit', timeEst: '30 min' },
        { priority: 8, action: 'Rotate all remaining secrets and move to secrets manager', timeEst: '2 hrs' },
      ],
      hardeningRoadmap: [
        { control: 'Install gitleaks pre-commit hook to block secret commits', effort: 'quick', impact: 'high', detail: 'Prevents the entire attack class' },
        { control: 'Enable GitHub Secret Scanning and push protection', effort: 'quick', impact: 'high', detail: 'Free for all repos; blocks secrets on push' },
        { control: 'Use AWS Secrets Manager / Parameter Store instead of .env', effort: 'medium', impact: 'high', detail: 'Secrets never exist in code' },
        { control: 'Enable MFA on AWS root and all IAM users', effort: 'quick', impact: 'high', detail: 'Stops attacker even with valid keys' },
        { control: 'Set AWS Budgets alert at $5 threshold', effort: 'quick', impact: 'medium', detail: 'Reduces detection time to minutes' },
        { control: 'Rotate all secrets quarterly via automated rotation', effort: 'project', impact: 'medium', detail: 'Limits blast radius of any exposure' },
      ],
      mitre: [
        { tactic: 'Initial Access', technique: 'Valid Accounts: Cloud Accounts', id: 'T1078.004', description: 'AWS root keys used directly from public repository exposure' },
        { tactic: 'Persistence', technique: 'Create Account', id: 'T1136', description: 'New IAM admin user created as backdoor' },
        { tactic: 'Resource Development', technique: 'Acquire Infrastructure', id: 'T1583', description: '40 GPU instances acquired for crypto mining' },
        { tactic: 'Collection', technique: 'Data from Cloud Storage Object', id: 'T1530', description: 'RDS customer database dumped via root credentials' },
        { tactic: 'Impact', technique: 'Financial Theft', id: 'T1657', description: '14 fraudulent Stripe charges via exposed API keys' },
      ],
    },
  },
  {
    id: 'mobile_gamer_sim_swap',
    title: 'Mobile Gamer SIM Swap',
    description: 'A mobile gaming whale loses $8,000 in in-game currency after a SIM swap attack targets their phone number.',
    persona: 'Mobile Gamer',
    difficulty: 'Advanced',
    duration: '~4 min read',
    icon: Smartphone,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    tags: ['SIM Swap', 'SMS MFA Bypass', 'Account Takeover'],
    report: {
      executiveSummary: 'An attacker used publicly available social media information to socially engineer a mobile carrier into transferring the victim\'s phone number to an attacker-controlled SIM. This bypassed SMS-based 2FA on the victim\'s mobile gaming account, allowing the attacker to drain $8,000 in premium in-game currency and trade rare items to mule accounts within 90 minutes.',
      attackVector: 'SIM swap via carrier social engineering using OSINT',
      totalDamageEst: '$8,400 (in-game currency + items + carrier dispute costs)',
      breachDuration: '1 hour 32 minutes',
      detectionTime: '52 minutes (failed SMS delivery noticed)',
      timeline: [
        { time: 'T-48hrs', actor: 'attacker', action: 'Collects victim\'s DOB, carrier, last 4 of account number from social media + OSINT', impact: 'Reconnaissance complete' },
        { time: 'T-0', actor: 'attacker', action: 'Calls carrier, impersonates victim with gathered info, requests SIM transfer', impact: 'Carrier completes SIM swap in 12 minutes' },
        { time: 'T+00:12', actor: 'system', action: 'All SMS to victim\'s number now go to attacker\'s SIM', impact: 'Phone number hijacked' },
        { time: 'T+00:15', actor: 'attacker', action: 'Initiates "Forgot Password" on gaming account using phone number', impact: 'SMS OTP received by attacker' },
        { time: 'T+00:18', actor: 'attacker', action: 'Full access to gaming account achieved', impact: '4 year account accessed' },
        { time: 'T+00:25', actor: 'attacker', action: 'Sells all premium items to attacker-controlled accounts', impact: '$6,200 in rare items transferred' },
        { time: 'T+00:40', actor: 'attacker', action: 'Converts in-game currency to gift cards via in-game shop', impact: '$1,800 converted' },
        { time: 'T+00:52', actor: 'defender', action: 'Victim notices SMS not delivering; contacts carrier', impact: 'SIM swap discovered' },
        { time: 'T+01:20', actor: 'defender', action: 'Carrier reverses SIM swap after identity verification', impact: 'Phone number recovered' },
        { time: 'T+01:32', actor: 'defender', action: 'Gaming account locked; incident report filed', impact: 'Breach contained; recovery process begun' },
      ],
      blastRadius: [
        { asset: 'Mobile Gaming Account', exposure: 'critical', detail: 'Full access; 4 years of progress + $8K in assets stolen' },
        { asset: 'Phone Number', exposure: 'critical', detail: 'Hijacked for 1 hour 20 minutes; all SMS intercepted' },
        { asset: 'All SMS-2FA Accounts', exposure: 'high', detail: 'Any account using phone as 2FA was exposed during window' },
        { asset: 'Email Account', exposure: 'high', detail: 'If linked to phone; reset was possible during window' },
        { asset: 'Banking SMS OTP', exposure: 'medium', detail: 'No banking compromise confirmed in this incident' },
      ],
      detectionWindows: [
        { stage: 'OSINT Reconnaissance', window: 'T-48hrs', signal: 'Profile privacy settings could have hidden carrier/DOB', missed: true },
        { stage: 'Carrier SIM Swap', window: 'T-0', signal: 'Carrier port-out PIN / account lock could have blocked swap', missed: true },
        { stage: 'SMS Delivery Failure', window: 'T+00:12', signal: 'Carrier should notify account holder via email on SIM swap', missed: true },
        { stage: 'Failed SMS Notice', window: 'T+00:52', signal: 'Victim self-detected via lack of SMS delivery', missed: false },
      ],
      recoveryChecklist: [
        { priority: 1, action: 'Contact carrier immediately to reverse SIM swap', timeEst: '30–60 min' },
        { priority: 2, action: 'Set a carrier account PIN and request port-freeze', timeEst: '20 min' },
        { priority: 3, action: 'Contact game publisher support with account recovery proof', timeEst: '1–48 hrs' },
        { priority: 4, action: 'Replace SMS 2FA with authenticator app on ALL accounts', timeEst: '45 min', tool: 'Security Score', toolLink: '/security-score' },
        { priority: 5, action: 'Audit all accounts that used phone as recovery — check for changes', timeEst: '30 min' },
        { priority: 6, action: 'Lock social media profiles to hide carrier/phone info', timeEst: '15 min' },
        { priority: 7, action: 'File FTC report for SIM swap fraud', timeEst: '30 min' },
      ],
      hardeningRoadmap: [
        { control: 'Switch from SMS 2FA to TOTP authenticator app or hardware key', effort: 'quick', impact: 'high', detail: 'SMS 2FA provides zero protection against SIM swap' },
        { control: 'Set a carrier account PIN + port-freeze', effort: 'quick', impact: 'high', detail: 'Most carriers offer free port-freeze on request' },
        { control: 'Remove phone number from social media profiles', effort: 'quick', impact: 'medium', detail: 'Reduces OSINT available to attacker for social engineering' },
        { control: 'Use a separate email for high-value gaming accounts', effort: 'medium', impact: 'medium', detail: 'Breaks the single-point-of-failure chain' },
        { control: 'Enable login notifications on gaming platform', effort: 'quick', impact: 'medium', detail: 'Earlier detection window' },
      ],
      mitre: [
        { tactic: 'Initial Access', technique: 'Valid Accounts', id: 'T1078', description: 'Account access via SMS OTP bypass through SIM swap' },
        { tactic: 'Reconnaissance', technique: 'Gather Victim Identity Information', id: 'T1589', description: 'OSINT collection of DOB, carrier, account number from social media' },
        { tactic: 'Resource Development', technique: 'Compromise Accounts: Phone Accounts', id: 'T1586.004', description: 'SIM swap via carrier social engineering' },
        { tactic: 'Credential Access', technique: 'Multi-Factor Authentication Interception', id: 'T1111', description: 'SMS OTP intercepted after SIM swap' },
        { tactic: 'Impact', technique: 'Financial Theft', id: 'T1657', description: 'In-game assets converted to transferable value' },
      ],
    },
  },
  {
    id: 'ransomware_home_lab',
    title: 'Ransomware: Home Lab Takeover',
    description: 'A home lab / self-hosted gaming server is hit by ransomware via an exposed RDP port.',
    persona: 'Sysadmin / Home Lab',
    difficulty: 'Advanced',
    duration: '~5 min read',
    icon: FileText,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    tags: ['Ransomware', 'RDP Exploit', 'Lateral Movement'],
    report: {
      executiveSummary: 'An exposed RDP port (3389) with a weak password was discovered by automated internet scanners. After brute-forcing the password in 2 hours, the attacker deployed LockBit ransomware which encrypted 4.2TB of data including game servers, personal files, and backups on network shares. No offline backups existed. Ransom demand: $3,500 in BTC. Total recovery cost exceeded $12,000 in time, hardware, and data recovery attempts.',
      attackVector: 'Exposed RDP (port 3389) with weak credentials — brute forced',
      totalDamageEst: '$12,000+ (recovery time + partial data loss)',
      breachDuration: '3 hours 45 minutes until encryption complete',
      detectionTime: '3 hours 51 minutes (when files unreadable)',
      timeline: [
        { time: 'T-0', actor: 'attacker', action: 'Shodan/Masscan identifies exposed RDP on residential IP', impact: 'Target identified in automated scan' },
        { time: 'T+00:30', actor: 'attacker', action: 'Credential brute force begins (automated tool)', impact: 'Password spray against common passwords' },
        { time: 'T+02:00', actor: 'attacker', action: 'Password "Gaming2023!" cracked; RDP login achieved', impact: 'Full desktop access to Windows server' },
        { time: 'T+02:05', actor: 'attacker', action: 'Disables Windows Defender + Volume Shadow Copy service', impact: 'Security and backup mechanisms disabled' },
        { time: 'T+02:15', actor: 'attacker', action: 'Lateral movement to NAS via SMB using found credentials', impact: 'Backup NAS compromised' },
        { time: 'T+02:20', actor: 'attacker', action: 'Deploys LockBit ransomware — encryption begins', impact: '4.2TB encryption starts' },
        { time: 'T+03:45', actor: 'attacker', action: 'Encryption complete; ransom note deposited in all directories', impact: 'All data encrypted; ransom demanded' },
        { time: 'T+03:51', actor: 'defender', action: 'Sysadmin notices game server unresponsive; investigates files', impact: 'Ransomware discovered' },
        { time: 'T+04:00', actor: 'defender', action: 'Network cable pulled; affected machines isolated', impact: 'Spread contained' },
      ],
      blastRadius: [
        { asset: 'Windows Game Server (4.2TB)', exposure: 'critical', detail: 'Full encryption; all game server data unreadable' },
        { asset: 'Network Attached Storage (NAS)', exposure: 'critical', detail: 'SMB network share encrypted; "backups" also lost' },
        { asset: 'Personal Files (Documents, Photos)', exposure: 'critical', detail: 'Co-located on same network; fully encrypted' },
        { asset: 'Other LAN Machines', exposure: 'high', detail: 'Network isolated before spread; no additional encryption' },
        { asset: 'Game Server Community', exposure: 'medium', detail: 'Server offline for 3 weeks; player community disbanded' },
      ],
      detectionWindows: [
        { stage: 'Port Exposure', window: 'Ongoing', signal: 'Shodan monitoring alert for own IP would show RDP exposed', missed: true },
        { stage: 'Brute Force', window: 'T+00:30', signal: 'Failed login lockout policy would have blocked after 5 attempts', missed: true },
        { stage: 'Defender Disabled', window: 'T+02:05', signal: 'Windows Security Center alert on Defender disable', missed: true },
        { stage: 'Shadow Copy Delete', window: 'T+02:05', signal: 'VSS deletion is a known ransomware indicator — EDR would catch', missed: true },
        { stage: 'Encryption Starts', window: 'T+02:20', signal: 'Mass file modification events detectable via file integrity monitoring', missed: true },
        { stage: 'Files Unreadable', window: 'T+03:51', signal: 'Self-detected when game server unresponsive', missed: false },
      ],
      recoveryChecklist: [
        { priority: 1, action: 'Immediately isolate all affected machines from network', timeEst: '5 min' },
        { priority: 2, action: 'Do NOT pay ransom — contact FBI/IC3 for decryption key availability', timeEst: '1 hr' },
        { priority: 3, action: 'Check nomoreransom.org for LockBit decryptors', timeEst: '30 min' },
        { priority: 4, action: 'Preserve encrypted drives as forensic evidence', timeEst: '1 hr' },
        { priority: 5, action: 'Wipe and reinstall OS from clean media', timeEst: '3–6 hrs' },
        { priority: 6, action: 'Close RDP exposure — use VPN or Tailscale instead', timeEst: '1 hr', tool: 'NexusGuard', toolLink: '/nexus-guard' },
        { priority: 7, action: 'Restore from offline backups (USB/cloud cold storage)', timeEst: '4–24 hrs' },
        { priority: 8, action: 'Enable account lockout policy (5 attempts → 30 min lockout)', timeEst: '15 min' },
      ],
      hardeningRoadmap: [
        { control: 'Never expose RDP to internet — use VPN/Tailscale for remote access', effort: 'medium', impact: 'high', detail: 'RDP on public internet is scanned within hours' },
        { control: 'Implement 3-2-1 backup strategy with offline copy', effort: 'project', impact: 'high', detail: 'NAS on same LAN is not a backup — it\'s a second target' },
        { control: 'Enable account lockout policy on Windows', effort: 'quick', impact: 'high', detail: 'Blocks brute force after 5 attempts' },
        { control: 'Deploy Windows Defender with tamper protection enabled', effort: 'quick', impact: 'medium', detail: 'Tamper protection prevents attacker disabling Defender' },
        { control: 'Enable Volume Shadow Copy protection', effort: 'quick', impact: 'medium', detail: 'Makes VSS deletion require additional privileges' },
        { control: 'Monitor own IP on Shodan for exposed services', effort: 'quick', impact: 'medium', detail: 'Know what attackers know about your exposure' },
      ],
      mitre: [
        { tactic: 'Initial Access', technique: 'External Remote Services', id: 'T1133', description: 'RDP exposed to internet, brute-forced with automated tooling' },
        { tactic: 'Credential Access', technique: 'Brute Force: Password Spraying', id: 'T1110.003', description: 'Common password list used against RDP login' },
        { tactic: 'Defense Evasion', technique: 'Impair Defenses: Disable or Modify Tools', id: 'T1562.001', description: 'Windows Defender and VSS disabled before encryption' },
        { tactic: 'Lateral Movement', technique: 'Remote Services: SMB/Windows Admin Shares', id: 'T1021.002', description: 'SMB used to spread to NAS and destroy backups' },
        { tactic: 'Impact', technique: 'Data Encrypted for Impact', id: 'T1486', description: 'LockBit deployed; 4.2TB encrypted across server and NAS' },
      ],
    },
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const difficultyColor = (d: string) =>
  d === 'Beginner' ? 'text-green-400 bg-green-400/10' :
  d === 'Intermediate' ? 'text-yellow-400 bg-yellow-400/10' :
  'text-red-400 bg-red-400/10';

const exposureConfig = {
  critical: { label: 'CRITICAL', cls: 'bg-red-500/20 text-red-300 border border-red-500/30' },
  high:     { label: 'HIGH',     cls: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
  medium:   { label: 'MEDIUM',   cls: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
  low:      { label: 'LOW',      cls: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
};

const effortConfig = {
  quick:   { label: 'Quick Win', cls: 'text-green-400' },
  medium:  { label: 'This Sprint', cls: 'text-yellow-400' },
  project: { label: 'Project', cls: 'text-red-400' },
};

const actorConfig = {
  attacker: { dot: 'bg-red-400',   label: 'Attacker' },
  defender: { dot: 'bg-blue-400',  label: 'Defender' },
  system:   { dot: 'bg-zinc-400',  label: 'System' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const ScenarioCard = memo(function ScenarioCard({
  scenario,
  onSelect,
}: {
  scenario: Scenario;
  onSelect: (id: ScenarioId) => void;
}) {
  const Icon = scenario.icon;
  return (
    <button
      onClick={() => onSelect(scenario.id)}
      className={cn(
        'w-full text-left rounded-xl border p-5 transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20',
        scenario.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-2.5 rounded-lg bg-black/30 flex-shrink-0', scenario.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-white text-sm">{scenario.title}</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', difficultyColor(scenario.difficulty))}>
              {scenario.difficulty}
            </span>
          </div>
          <p className="text-zinc-400 text-xs mb-3 leading-relaxed">{scenario.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {scenario.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{scenario.persona}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{scenario.duration}</span>
          </div>
        </div>
        <Play className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
});

const SectionToggle = memo(function SectionToggle({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  accent = 'text-zinc-300',
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn('w-4 h-4', accent)} />
          <span className="font-semibold text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
});

const PremiumLock = memo(function PremiumLock() {
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
        <Lock className="w-6 h-6 text-yellow-400" />
      </div>
      <h4 className="font-bold text-white mb-1">Full MITRE ATT&CK Map</h4>
      <p className="text-zinc-400 text-sm mb-4">
        Complete technique mapping with sub-technique breakdown, detection rules, and Sigma rules export is a Pro feature.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium cursor-not-allowed">
        <Lock className="w-3.5 h-3.5" /> Unlock with Pro
      </div>
    </div>
  );
});

const ReportView = memo(function ReportView({
  scenario,
  onReset,
}: {
  scenario: Scenario;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { report } = scenario;

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/breach-sim?s=${scenario.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [scenario.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={onReset}
            className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to scenarios
          </button>
          <h2 className="text-xl font-bold text-white">{scenario.title}</h2>
          <p className="text-zinc-400 text-sm">{scenario.persona} · {scenario.difficulty}</p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs hover:bg-white/10 transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Est. Damage', value: report.totalDamageEst, icon: DollarSign, color: 'text-red-400' },
          { label: 'Breach Duration', value: report.breachDuration, icon: Clock, color: 'text-orange-400' },
          { label: 'Detection Time', value: report.detectionTime, icon: Eye, color: 'text-yellow-400' },
          { label: 'Attack Vector', value: report.attackVector, icon: Zap, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-white/8 bg-white/3 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn('w-4 h-4', color)} />
              <span className="text-zinc-500 text-xs">{label}</span>
            </div>
            <div className="text-white font-bold text-sm leading-tight">{value}</div>
          </div>
        ))}
      </div>

      <SectionToggle title="Executive Summary" icon={FileText} defaultOpen accent="text-blue-400">
        <p className="text-zinc-300 text-sm leading-relaxed pt-1">{report.executiveSummary}</p>
      </SectionToggle>

      <SectionToggle title="Attack Timeline" icon={Activity} defaultOpen accent="text-orange-400">
        <div className="space-y-1 pt-1">
          {report.timeline.map((event, i) => {
            const cfg = actorConfig[event.actor];
            return (
              <div key={i} className="flex gap-3 items-start py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 min-w-[90px] flex-shrink-0">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dot)} />
                  <span className="text-xs font-mono text-zinc-500">{event.time}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-xs font-medium">{event.action}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{event.impact}</div>
                </div>
                <span className={cn('text-xs px-1.5 py-0.5 rounded flex-shrink-0',
                  event.actor === 'attacker' ? 'bg-red-500/10 text-red-400' :
                  event.actor === 'defender' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-zinc-500/10 text-zinc-400'
                )}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </SectionToggle>

      <SectionToggle title="Blast Radius" icon={Target} defaultOpen accent="text-red-400">
        <div className="space-y-2 pt-1">
          {report.blastRadius.map((entry, i) => {
            const cfg = exposureConfig[entry.exposure];
            return (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <span className={cn('text-xs px-2 py-0.5 rounded font-mono font-bold flex-shrink-0 mt-0.5', cfg.cls)}>
                  {cfg.label}
                </span>
                <div>
                  <div className="text-white text-xs font-medium">{entry.asset}</div>
                  <div className="text-zinc-500 text-xs">{entry.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionToggle>

      <SectionToggle title="Detection Windows" icon={Eye} accent="text-yellow-400">
        <div className="space-y-2 pt-1">
          {report.detectionWindows.map((dw, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              {dw.missed
                ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              }
              <div className="flex-1">
                <div className="text-white text-xs font-medium">
                  {dw.stage} <span className="text-zinc-500 font-normal">({dw.window})</span>
                </div>
                <div className="text-zinc-500 text-xs">{dw.signal}</div>
              </div>
              <span className={cn('text-xs flex-shrink-0', dw.missed ? 'text-red-400' : 'text-green-400')}>
                {dw.missed ? 'Missed' : 'Caught'}
              </span>
            </div>
          ))}
        </div>
      </SectionToggle>

      <SectionToggle title="Recovery Checklist" icon={CheckCircle} accent="text-green-400">
        <div className="space-y-2 pt-1">
          {report.recoveryChecklist.map((step) => (
            <div key={step.priority} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-xs text-zinc-400 font-bold">
                {step.priority}
              </div>
              <div className="flex-1">
                <div className="text-white text-xs font-medium">{step.action}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{step.timeEst}
                  </span>
                  {step.tool && step.toolLink && (
                    <Link to={step.toolLink} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      {step.tool} <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionToggle>

      <SectionToggle title="Hardening Roadmap" icon={Shield} accent="text-blue-400">
        <div className="space-y-2 pt-1">
          {report.hardeningRoadmap.map((item, i) => {
            const eff = effortConfig[item.effort];
            const impactColor = item.impact === 'high' ? 'text-green-400' : item.impact === 'medium' ? 'text-yellow-400' : 'text-zinc-400';
            return (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <Shield className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white text-xs font-medium">{item.control}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{item.detail}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn('text-xs', eff.cls)}>{eff.label}</span>
                    <span className={cn('text-xs', impactColor)}>
                      {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)} Impact
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionToggle>

      <SectionToggle title="MITRE ATT&CK Map" icon={Flame} accent="text-purple-400">
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {report.mitre.slice(0, 2).map((m, i) => (
              <div key={i} className="rounded-lg border border-white/8 bg-white/3 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{m.id}</span>
                  <span className="text-xs text-zinc-500">{m.tactic}</span>
                </div>
                <div className="text-white text-xs font-medium">{m.technique}</div>
                <div className="text-zinc-500 text-xs mt-1">{m.description}</div>
              </div>
            ))}
          </div>
          <PremiumLock />
        </div>
      </SectionToggle>

      {/* Cross-tool CTAs */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <p className="text-zinc-400 text-xs mb-3">Act on these findings:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Check Security Score', to: '/security-score', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
            { label: 'Run IOC Lookup', to: '/tools/ioc-lookup', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
            { label: 'View Live Threats', to: '/live-threat-dashboard', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
            { label: 'Generate Brief', to: '/nexus-guard', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
          ].map(({ label, to, color }) => (
            <Link
              key={to}
              to={to}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-opacity hover:opacity-80', color)}
            >
              {label} <ExternalLink className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

const RunningView = memo(function RunningView({ scenario }: { scenario: Scenario }) {
  const Icon = scenario.icon;
  const steps = [
    'Mapping attack surface...',
    'Reconstructing timeline...',
    'Calculating blast radius...',
    'Identifying detection gaps...',
    'Building recovery checklist...',
    'Generating hardening roadmap...',
  ];
  const [stepIdx, setStepIdx] = useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setStepIdx(s => Math.min(s + 1, steps.length - 1)), 420);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-64 flex flex-col items-center justify-center gap-6 py-12">
      <div className={cn('w-16 h-16 rounded-2xl border flex items-center justify-center', scenario.bg)}>
        <Icon className={cn('w-8 h-8', scenario.color)} />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-white mb-1">Simulating: {scenario.title}</h3>
        <p className="text-zinc-400 text-sm">Running breach simulation...</p>
      </div>
      <div className="space-y-2 w-full max-w-xs">
        {steps.map((s, i) => (
          <div key={i} className={cn('flex items-center gap-3 text-sm transition-all duration-300', i <= stepIdx ? 'text-zinc-300' : 'text-zinc-700')}>
            {i < stepIdx ? (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : i === stepIdx ? (
              <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-zinc-700 flex-shrink-0" />
            )}
            {s}
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────

const BreachSimPage = memo(function BreachSimPage() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedId, setSelectedId] = useState<ScenarioId | null>(null);

  const selectedScenario = useMemo(
    () => SCENARIOS.find(s => s.id === selectedId) ?? null,
    [selectedId]
  );

  const handleSelect = useCallback((id: ScenarioId) => {
    setSelectedId(id);
    setPhase('running');
    setTimeout(() => setPhase('report'), 2800);
  }, []);

  const handleReset = useCallback(() => {
    setPhase('select');
    setSelectedId(null);
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Breach Simulator — GamerNexus Security"
        description="Run prebuilt breach simulations: streamer account takeover, Discord clan breach, SaaS API exposure, SIM swap, and ransomware. Full narrative reports with timelines, blast radius, and hardening roadmaps."
        keywords={['breach simulator', 'cyber attack simulation', 'incident response', 'ransomware', 'account takeover', 'SIM swap']}
        url={typeof window !== 'undefined' ? window.location.href : '/breach-sim'}
        type="website"
      />

      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

          {phase === 'select' && (
            <div className="mb-8">
              <Link to="/tools" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Tools
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Breach Simulator</h1>
                  <p className="text-zinc-400 text-sm">5 prebuilt scenarios · Structured narrative reports · No signup required</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mt-4 max-w-2xl leading-relaxed">
                Pick a real-world scenario and get a full structured report: executive summary, attack timeline, blast radius,
                detection windows, recovery checklist, and hardening roadmap — all tailored to your persona.
              </p>
            </div>
          )}

          {phase === 'select' && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Choose a Scenario</h2>
              {SCENARIOS.map(scenario => (
                <ScenarioCard key={scenario.id} scenario={scenario} onSelect={handleSelect} />
              ))}
            </div>
          )}

          {phase === 'running' && selectedScenario && (
            <RunningView scenario={selectedScenario} />
          )}

          {phase === 'report' && selectedScenario && (
            <ReportView scenario={selectedScenario} onReset={handleReset} />
          )}
        </div>
      </div>
    </Layout>
  );
});

export default BreachSimPage;
