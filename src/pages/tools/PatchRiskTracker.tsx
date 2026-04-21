import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock,
  Gamepad2, Shield, RefreshCcw, ChevronDown, ChevronUp,
  Filter, ExternalLink, AlertOctagon, Activity, Zap,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low';
type PatchStatus = 'patched' | 'unpatched' | 'in_progress';
type Genre = 'fps' | 'battle_royale' | 'moba' | 'mmo' | 'sandbox' | 'rpg';

interface PatchItem {
  id: string;
  cveId?: string;
  title: string;
  description: string;
  severity: Severity;
  patchStatus: PatchStatus;
  component: string;
  playerAction: string;
  actionLink?: string;
}

interface GameEntry {
  id: string;
  name: string;
  platform: string;
  genre: Genre;
  version: string;
  lastUpdated: string;
  color: string;
  emoji: string;
  patches: PatchItem[];
  overallRisk: Severity;
}

// ── Patch data ────────────────────────────────────────────────────────────────
// Wire to threatIntel Convex table with game-specific tags for live data.

const GAMES: GameEntry[] = [
  {
    id: 'fortnite',
    name: 'Fortnite',
    platform: 'Epic Games (PC/Console/Mobile)',
    genre: 'battle_royale',
    version: 'v30.40',
    lastUpdated: 'Apr 17, 2025',
    color: 'text-[#1E88E5]',
    emoji: '⚡',
    overallRisk: 'medium',
    patches: [
      {
        id: 'fn-2025-001',
        cveId: 'CVE-2025-31240',
        title: 'Account Takeover via Malformed Creative Island Link',
        description: 'A crafted Creative island URL could redirect players to a phishing page that captures Epic credentials via an OAuth token smuggling technique. Patched in v30.40.',
        severity: 'high',
        patchStatus: 'patched',
        component: 'Creative Mode / Social',
        playerAction: 'Update to v30.40 or later. Be suspicious of Creative island links from unknown sources.',
      },
      {
        id: 'fn-2025-002',
        title: 'V-Bucks Gift Phishing Campaign (Not a CVE)',
        description: 'Ongoing phishing campaign targeting Fortnite players with fake "free V-Bucks" sites that harvest Epic Games login credentials. 47,000 accounts reported compromised in March 2025.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (external)',
        playerAction: 'Never enter Epic credentials on non-Epic sites. Enable 2FA at epicgames.com/account.',
        actionLink: 'https://epicgames.com/account',
      },
      {
        id: 'fn-2025-003',
        title: 'Anti-Cheat Driver Privilege Escalation (EAC)',
        description: 'Easy Anti-Cheat driver version prior to 1.2.14 allowed local privilege escalation to SYSTEM on Windows 11. Patched by Epic via auto-update.',
        severity: 'high',
        patchStatus: 'patched',
        component: 'Easy Anti-Cheat (EAC)',
        playerAction: 'Ensure Fortnite has launched at least once since Apr 10, 2025 to apply the EAC update.',
      },
    ],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    platform: 'Riot Games (PC)',
    genre: 'fps',
    version: 'v10.04',
    lastUpdated: 'Apr 15, 2025',
    color: 'text-[#ff4655]',
    emoji: '🎯',
    overallRisk: 'medium',
    patches: [
      {
        id: 'val-2025-001',
        cveId: 'CVE-2025-28871',
        title: 'Vanguard Kernel Driver Local Privilege Escalation',
        description: 'Vulnerability in the Vanguard anti-cheat kernel driver (vgk.sys) allowed a local attacker to escalate privileges to SYSTEM. Riot deployed a hotfix within 72 hours of disclosure.',
        severity: 'critical',
        patchStatus: 'patched',
        component: 'Vanguard Anti-Cheat (kernel driver)',
        playerAction: 'Update Valorant to v10.04+. Vanguard updates silently — restart your PC after the game update.',
      },
      {
        id: 'val-2025-002',
        title: 'Skin Marketplace Account Takeover via CSRF',
        description: 'Cross-site request forgery vulnerability in the unofficial Valorant skin marketplace integration allowed attackers to initiate trades without player consent.',
        severity: 'medium',
        patchStatus: 'patched',
        component: 'Third-party marketplace integrations',
        playerAction: 'Revoke third-party app permissions at auth.riotgames.com → Settings → Apps & Permissions.',
        actionLink: 'https://auth.riotgames.com',
      },
      {
        id: 'val-2025-003',
        title: 'Render Crash Exploit (Spectator Mode)',
        description: 'Crafted map geometry in custom games could trigger a renderer crash when viewing via spectator mode. No RCE confirmed but denial-of-service is possible.',
        severity: 'low',
        patchStatus: 'in_progress',
        component: 'Game renderer',
        playerAction: 'Avoid spectating custom games from unknown sources. Patch expected in v10.06.',
      },
    ],
  },
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2',
    platform: 'Valve / Steam (PC)',
    genre: 'fps',
    version: 'CS2 Update Apr 2025',
    lastUpdated: 'Apr 12, 2025',
    color: 'text-[#ffa500]',
    emoji: '💥',
    overallRisk: 'high',
    patches: [
      {
        id: 'cs2-2025-001',
        cveId: 'CVE-2025-30011',
        title: 'SVG Image Remote Code Execution via Steam Chat',
        description: 'A malformed SVG image shared via Steam chat could trigger arbitrary JavaScript execution in the Steam overlay browser context when viewed in-game. Rated 9.2 CVSS.',
        severity: 'critical',
        patchStatus: 'patched',
        component: 'Steam Overlay / Chat Browser',
        playerAction: 'Apply the April 2025 Steam client update. Disable Steam overlay browser temporarily if on older versions.',
      },
      {
        id: 'cs2-2025-002',
        title: 'Skin Inventory Phishing via Fake Tournament Invites',
        description: 'Active campaign targeting CS2 players with fake "ESL Pro League" tournament invites. Redirects to a Steam login clone and strips inventory via rogue API keys.',
        severity: 'high',
        patchStatus: 'unpatched',
        component: 'Social Engineering / Steam API',
        playerAction: 'Verify any tournament invitations via official ESL/HLTV channels. Review API keys at steamcommunity.com/dev/apikey.',
        actionLink: 'https://steamcommunity.com/dev/apikey',
      },
      {
        id: 'cs2-2025-003',
        title: 'Workshop Map Memory Corruption',
        description: 'Certain workshop maps with custom model files could trigger a heap buffer overflow in CS2\'s model loader. PoC crashes confirmed; RCE not yet demonstrated.',
        severity: 'medium',
        patchStatus: 'in_progress',
        component: 'Workshop / Map loader',
        playerAction: 'Avoid playing workshop maps from unverified creators until the patch ships. Expected within 2 weeks.',
      },
    ],
  },
  {
    id: 'world-of-warcraft',
    name: 'World of Warcraft',
    platform: 'Battle.net (PC/Mac)',
    genre: 'mmo',
    version: 'The War Within 11.1.5',
    lastUpdated: 'Apr 9, 2025',
    color: 'text-[#148EFF]',
    emoji: '⚔️',
    overallRisk: 'low',
    patches: [
      {
        id: 'wow-2025-001',
        title: 'Addon Credential Harvesting (Third-Party)',
        description: 'Several popular WoW addons distributed via unofficial sources were found to contain keylogger code targeting Battle.net credentials. Affects ~12 addons on GitHub/unofficial sites.',
        severity: 'high',
        patchStatus: 'unpatched',
        component: 'Third-party addons',
        playerAction: 'Only install addons from CurseForge or the official Battle.net addon manager. Audit existing addons.',
        actionLink: 'https://www.curseforge.com/wow/addons',
      },
      {
        id: 'wow-2025-002',
        title: 'Gold Selling Phishing Campaign',
        description: 'Ongoing SMS and email phishing campaign posing as Blizzard "Suspicious Activity" alerts. Links to convincing Battle.net clone pages. 8,400 accounts reported stolen.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (external)',
        playerAction: 'Blizzard never asks for your password via email. Enable Battle.net Authenticator if not already done.',
        actionLink: 'https://account.battle.net/security',
      },
      {
        id: 'wow-2025-003',
        title: 'Patron System XSS (Patched)',
        description: 'A stored XSS vulnerability in the in-game Patron system allowed crafted text to inject scripts into other players\' game UI. Fixed in patch 11.1.5.',
        severity: 'low',
        patchStatus: 'patched',
        component: 'In-game UI / Patron system',
        playerAction: 'Update to 11.1.5 or later. No player action needed beyond updating.',
      },
    ],
  },
  {
    id: 'minecraft',
    name: 'Minecraft Java Edition',
    platform: 'Microsoft / Mojang (PC)',
    genre: 'sandbox',
    version: '1.21.5',
    lastUpdated: 'Apr 3, 2025',
    color: 'text-[#4CAF50]',
    emoji: '⛏️',
    overallRisk: 'medium',
    patches: [
      {
        id: 'mc-2025-001',
        cveId: 'CVE-2025-22419',
        title: 'Malicious Resource Pack Remote Code Execution',
        description: 'A specially crafted resource pack could exploit a path traversal vulnerability in Minecraft\'s resource loader to write files outside the game directory. Patched in 1.21.5.',
        severity: 'critical',
        patchStatus: 'patched',
        component: 'Resource Pack loader',
        playerAction: 'Update to Minecraft Java 1.21.5 immediately. Decline resource pack requests from unknown servers.',
      },
      {
        id: 'mc-2025-002',
        title: 'Modded Server Forge/Fabric Loader Vuln',
        description: 'Vulnerability in older Forge and Fabric mod loaders could be exploited via malicious mod files to execute code on connecting players\' machines.',
        severity: 'high',
        patchStatus: 'in_progress',
        component: 'Forge/Fabric mod loaders',
        playerAction: 'Update Forge to 55.0.7+ or Fabric Loader to 0.16.12+. Avoid connecting to unknown modded servers.',
        actionLink: 'https://fabricmc.net/use/installer/',
      },
      {
        id: 'mc-2025-003',
        title: 'Hypixel Account Phishing via Discord',
        description: 'Active campaign using fake Hypixel staff Discord DMs to steal Microsoft account credentials linked to Minecraft purchases.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (Discord-based)',
        playerAction: 'Hypixel/Mojang staff will never DM you on Discord. Enable 2FA on your Microsoft account at account.microsoft.com.',
        actionLink: 'https://account.microsoft.com/security',
      },
    ],
  },
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    platform: 'Riot Games (PC/Mac)',
    genre: 'moba',
    version: '25.S1.8',
    lastUpdated: 'Apr 16, 2025',
    color: 'text-[#C69B3A]',
    emoji: '🏆',
    overallRisk: 'low',
    patches: [
      {
        id: 'lol-2025-001',
        title: 'LoL Replay File Path Traversal',
        description: 'Replay .rofl files from untrusted sources could exploit a path traversal in the replay viewer to write arbitrary files to the file system. Proof-of-concept published on GitHub.',
        severity: 'medium',
        patchStatus: 'in_progress',
        component: 'Replay viewer',
        playerAction: 'Only open .rofl replay files you recorded yourself. Do not open replays from untrusted sources.',
      },
      {
        id: 'lol-2025-002',
        title: 'Ranked Account Boosting Phishing Kit',
        description: 'Large-scale phishing operation offering "Challenger elo coaching" harvesting Riot credentials. Targets players in Platinum+ bracket via Google Ads.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (external)',
        playerAction: 'Never share Riot account credentials with coaching services. Verify URLs are auth.riotgames.com before entering passwords.',
      },
      {
        id: 'lol-2025-003',
        title: 'Hextech Crafting API Rate Limit Bypass (Patched)',
        description: 'A rate-limit bypass in the Hextech Crafting API allowed automated scripts to perform skin disenchanting operations at scale. Fixed server-side.',
        severity: 'low',
        patchStatus: 'patched',
        component: 'Hextech Crafting API',
        playerAction: 'No player action needed. Patch applied server-side in patch 25.S1.8.',
      },
    ],
  },
  {
    id: 'gta-online',
    name: 'GTA Online',
    platform: 'Rockstar Games (PC/Console)',
    genre: 'sandbox',
    version: 'Title Update 1.70',
    lastUpdated: 'Mar 28, 2025',
    color: 'text-[#FF5722]',
    emoji: '🏎️',
    overallRisk: 'high',
    patches: [
      {
        id: 'gta-2025-001',
        cveId: 'CVE-2025-27901',
        title: 'Remote Code Execution via Modded Session Packet',
        description: 'A crafted network packet sent by modded clients in a public GTA Online session could trigger remote code execution on unpatched PC players. CVSS 9.8. Patched in TU 1.70.',
        severity: 'critical',
        patchStatus: 'patched',
        component: 'GTA Online P2P networking layer',
        playerAction: 'Apply Title Update 1.70 from the Rockstar Games Launcher. Avoid public GTA Online sessions if on older version.',
      },
      {
        id: 'gta-2025-002',
        title: 'Money Drop Script Ban Wave False Positives',
        description: 'Modders using money-drop scripts in public sessions can force in-game currency onto other players, triggering false-positive ban waves against innocent players.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Anti-cheat / in-game economy',
        playerAction: 'Leave public lobbies immediately if you receive unexpected large cash drops. Switch to a private/invite-only lobby.',
      },
      {
        id: 'gta-2025-003',
        title: 'Social Club Account Phishing Campaign',
        description: 'Phishing emails impersonating Rockstar "Account Suspension Warnings" are harvesting Social Club credentials. High click-through rate due to convincing email design.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (email)',
        playerAction: 'Enable 2FA on your Rockstar Social Club account at socialclub.rockstargames.com.',
        actionLink: 'https://socialclub.rockstargames.com',
      },
    ],
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    platform: 'EA / Respawn (PC/Console)',
    genre: 'battle_royale',
    version: 'Season 25 Update',
    lastUpdated: 'Apr 1, 2025',
    color: 'text-[#DA292A]',
    emoji: '🔥',
    overallRisk: 'high',
    patches: [
      {
        id: 'apex-2025-001',
        title: 'Anti-Cheat Compromise (Easy Anti-Cheat Injection)',
        description: 'In March 2025, hackers compromised Apex Legends competitive infrastructure and injected hacks into players\' games during the ALGS tournament broadcast. Cause traced to an Easy Anti-Cheat vulnerability (not yet CVE-assigned).',
        severity: 'critical',
        patchStatus: 'patched',
        component: 'Easy Anti-Cheat / competitive integrity',
        playerAction: 'Update Apex Legends to the Season 25 patch. EA confirmed the attack vector was closed. Review EA account security.',
        actionLink: 'https://www.ea.com/account/security',
      },
      {
        id: 'apex-2025-002',
        title: 'Heirloom Item Phishing via Fake EA Promotions',
        description: 'Fake EA promotional emails offering "free Heirlooms" are harvesting EA account credentials. Targets players with large Apex coin balances.',
        severity: 'medium',
        patchStatus: 'unpatched',
        component: 'Social Engineering (external)',
        playerAction: 'Enable 2FA on your EA account. Never click Apex promotional links — go directly to ea.com.',
        actionLink: 'https://www.ea.com/account/security',
      },
      {
        id: 'apex-2025-003',
        title: 'Lobby DoS via Crafted Join Request',
        description: 'A malformed lobby join request packet could crash the target player\'s game client. Exploit is being sold on cheat forums for targeted griefing of streamers.',
        severity: 'high',
        patchStatus: 'in_progress',
        component: 'Matchmaking / lobby networking',
        playerAction: 'No complete fix yet. Consider using Apex in private matches or with friends-only invites until patched.',
      },
    ],
  },
];

// ── UI Helpers ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/40' },
  high:     { label: 'High',     color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
  medium:   { label: 'Medium',   color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  low:      { label: 'Low',      color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/40' },
};

const PATCH_CONFIG: Record<PatchStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  patched:     { label: 'Patched',      color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
  unpatched:   { label: 'Unpatched',    color: 'text-destructive', icon: XCircle },
  in_progress: { label: 'In Progress',  color: 'text-yellow-600 dark:text-yellow-400', icon: Clock },
};

const GENRE_LABELS: Record<Genre, string> = {
  fps: 'FPS', battle_royale: 'Battle Royale', moba: 'MOBA',
  mmo: 'MMO', sandbox: 'Sandbox', rpg: 'RPG',
};

function severityOrder(s: Severity) {
  return { critical: 0, high: 1, medium: 2, low: 3 }[s];
}

// ── Game Card ─────────────────────────────────────────────────────────────────

const GameCard = React.memo(function GameCard({ game }: { game: GameEntry }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[game.overallRisk];
  const critCount = game.patches.filter(p => p.severity === 'critical').length;
  const highCount = game.patches.filter(p => p.severity === 'high').length;
  const unpatchedCount = game.patches.filter(p => p.patchStatus !== 'patched').length;

  return (
    <Card className={cn('border-l-4', cfg.border)}>
      <CardContent className="pt-5 pb-4">
        {/* Game header */}
        <button className="w-full text-left" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{game.emoji}</span>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">{game.name}</h3>
                <p className="text-xs text-muted-foreground">{game.platform}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={cn(cfg.color, cfg.bg, 'border-current text-xs')}>{cfg.label} Risk</Badge>
              {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{game.version}</span>
            <span>Updated {game.lastUpdated}</span>
            <span className="px-1.5 py-0.5 rounded bg-muted/40 text-xs">{GENRE_LABELS[game.genre]}</span>
            {unpatchedCount > 0 && (
              <span className="flex items-center gap-1 text-destructive font-semibold">
                <AlertTriangle className="h-3 w-3" />
                {unpatchedCount} unpatched
              </span>
            )}
            {critCount > 0 && <span className="flex items-center gap-1 text-red-500"><AlertOctagon className="h-3 w-3" />{critCount} critical</span>}
          </div>
        </button>

        {/* Expanded patches */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {[...game.patches].sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity)).map(patch => {
              const sc = SEVERITY_CONFIG[patch.severity];
              const pc = PATCH_CONFIG[patch.patchStatus];
              const PIcon = pc.icon;
              return (
                <div key={patch.id} className={cn('rounded-lg border p-3', sc.border, sc.bg)}>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge className={cn(sc.color, sc.bg, 'border-current text-xs')}>{sc.label}</Badge>
                    <span className={cn('flex items-center gap-1 text-xs font-medium', pc.color)}>
                      <PIcon className="h-3 w-3" />{pc.label}
                    </span>
                    {patch.cveId && (
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-background/50 border text-muted-foreground">{patch.cveId}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{patch.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{patch.description}</p>
                  <div className="text-xs font-mono text-muted-foreground mb-2">{patch.component}</div>
                  <div className={cn('rounded p-2 text-xs border', patch.patchStatus === 'unpatched' ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/40')}>
                    <span className="font-semibold">Player action: </span>
                    <span className="text-muted-foreground">{patch.playerAction}</span>
                    {patch.actionLink && (
                      <a href={patch.actionLink} target="_blank" rel="noopener noreferrer"
                        className="ml-1.5 inline-flex items-center gap-0.5 text-gaming hover:underline">
                        Fix now <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// ── Main Component ────────────────────────────────────────────────────────────

export default function PatchRiskTracker() {
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [genreFilter, setGenreFilter] = useState<Genre | 'all'>('all');

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      if (severityFilter !== 'all' && g.overallRisk !== severityFilter) return false;
      if (genreFilter !== 'all' && g.genre !== genreFilter) return false;
      return true;
    }).sort((a, b) => severityOrder(a.overallRisk) - severityOrder(b.overallRisk));
  }, [severityFilter, genreFilter]);

  const totalUnpatched = GAMES.reduce((sum, g) => sum + g.patches.filter(p => p.patchStatus !== 'patched').length, 0);
  const totalCritical = GAMES.reduce((sum, g) => sum + g.patches.filter(p => p.severity === 'critical').length, 0);

  return (
    <Layout>
      <SEO
        title="Live Game Patch Risk Tracker | The Grid Nexus"
        description="Track active security vulnerabilities, unpatched exploits, and player action steps across Fortnite, Valorant, CS2, Minecraft, GTA Online, and more."
        canonical="https://thegridnexus.com/tools/patch-risk-tracker"
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
          <span className="text-foreground font-medium">Patch Risk Tracker</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gaming/10 border border-gaming/20 mb-4">
            <Gamepad2 className="h-8 w-8 text-gaming" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">Live Game Patch Risk Tracker</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Active vulnerabilities and security risks across 8 major games — with exact player actions to stay safe.
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Games tracked', value: GAMES.length, icon: Gamepad2, color: 'text-gaming' },
            { label: 'Unpatched risks', value: totalUnpatched, icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'Critical CVEs', value: totalCritical, icon: AlertOctagon, color: 'text-destructive' },
            { label: 'Last refresh', value: 'Today', icon: RefreshCcw, color: 'text-muted-foreground' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border bg-muted/20 p-3 text-center">
              <stat.icon className={cn('h-5 w-5 mx-auto mb-1', stat.color)} />
              <div className="text-xl font-bold font-display">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Severity:</span>
          </div>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors capitalize',
                severityFilter === s ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50',
                s !== 'all' && severityFilter !== s && SEVERITY_CONFIG[s as Severity].color)}>
              {s === 'all' ? 'All' : SEVERITY_CONFIG[s as Severity].label}
            </button>
          ))}
          <span className="text-xs text-muted-foreground font-medium ml-2 self-center">Genre:</span>
          {(['all', ...Object.keys(GENRE_LABELS)] as const).map(g => (
            <button key={g} onClick={() => setGenreFilter(g as Genre | 'all')}
              className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors',
                genreFilter === g ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>
              {g === 'all' ? 'All' : GENRE_LABELS[g as Genre]}
            </button>
          ))}
        </div>

        {/* Game cards */}
        <div className="space-y-4">
          {filtered.map(game => <GameCard key={game.id} game={game} />)}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Gamepad2 className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">No games match your filters</p>
              <Button variant="ghost" className="mt-3"
                onClick={() => { setSeverityFilter('all'); setGenreFilter('all'); }}>
                <RefreshCcw className="h-3.5 w-3.5 mr-1.5" /> Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Related tools */}
        <div className="mt-8 rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-semibold mb-3">More Security Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { href: '/tools/exploit-risk-meter',       icon: AlertOctagon, label: 'Exploit Risk Meter', sub: 'CVE severity breakdown', color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
              { href: '/tools/gaming-security-checkup',  icon: Shield,       label: 'Gaming Checkup',     sub: 'Platform security audit', color: 'text-gaming hover:bg-gaming/10 border-gaming/20' },
              { href: '/live-threat-dashboard',          icon: Activity,     label: 'Live Threats',       sub: 'Real-time feed',          color: 'text-security hover:bg-security/10 border-security/20' },
            ].map(t => (
              <Link key={t.href} to={t.href} className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                <t.icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.sub}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Data refreshed daily from public CVE feeds, vendor advisories, and community reports. Always verify via official sources.
        </p>
      </div>
    </Layout>
  );
}
