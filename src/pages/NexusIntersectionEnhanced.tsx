import React, { memo, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import {
  Shield, AlertTriangle, X, ChevronRight, ExternalLink,
  Gamepad2, Twitch, Youtube, Users, Cpu, Cloud,
  Smartphone, Brain, DollarSign, Server, Zap, Globe,
  ArrowLeft, Info, TrendingUp, Lock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 0 | 1 | 2 | 3 | 4; // 0=none, 1=low, 2=medium, 3=high, 4=critical

interface CellDetail {
  riskLevel: RiskLevel;
  headline: string;
  description: string;
  recentExample?: string;
  mitigation: string;
  tools: { label: string; to: string }[];
}

interface Platform {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface Threat {
  id: string;
  label: string;
  shortLabel: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  { id: 'steam',      label: 'Steam / PC Gaming',     icon: Gamepad2, description: 'PC gaming storefronts, game libraries, mods' },
  { id: 'console',    label: 'Console Gaming',         icon: Gamepad2, description: 'PlayStation, Xbox, Nintendo — platform ecosystems' },
  { id: 'mobile',     label: 'Mobile Gaming',          icon: Smartphone, description: 'iOS/Android gaming apps, in-app purchases' },
  { id: 'discord',    label: 'Discord',                icon: Users, description: 'Gaming communities, servers, bots, OAuth integrations' },
  { id: 'twitch',     label: 'Twitch',                 icon: Twitch, description: 'Live streaming, monetisation, creator accounts' },
  { id: 'youtube',    label: 'YouTube Gaming',         icon: Youtube, description: 'VODs, gaming channels, YouTube Premium creators' },
  { id: 'mods',       label: 'Game Mods / Platforms',  icon: Cpu, description: 'Nexus Mods, mod.io, user-generated content' },
  { id: 'esports',    label: 'Esports / Tournaments',  icon: TrendingUp, description: 'Competition platforms, prize pools, player orgs' },
  { id: 'indiedev',   label: 'Indie Dev / SaaS',       icon: Server, description: 'Solo devs, small studios, SaaS tools in gaming' },
  { id: 'aitools',    label: 'AI Tools (Gaming)',       icon: Brain, description: 'AI-assisted game dev, AI NPCs, cheat-detection AI' },
  { id: 'cloudstor',  label: 'Cloud Storage / Backup',  icon: Cloud, description: 'Game save sync, asset backups, cloud gaming (GeForce NOW)' },
  { id: 'africamm',   label: 'Mobile Money Africa',    icon: DollarSign, description: 'M-Pesa, MTN MoMo — gaming monetisation in Africa' },
];

const THREATS: Threat[] = [
  { id: 'ato',        label: 'Account Takeover',       shortLabel: 'ATO' },
  { id: 'phishing',   label: 'Phishing',               shortLabel: 'Phishing' },
  { id: 'malware',    label: 'Malware / RAT',          shortLabel: 'Malware' },
  { id: 'databreach', label: 'Data Breach',            shortLabel: 'Data Breach' },
  { id: 'ransomware', label: 'Ransomware',             shortLabel: 'Ransomware' },
  { id: 'cheat',      label: 'Cheat / Exploit',        shortLabel: 'Cheat' },
  { id: 'supplychain',label: 'Supply Chain',           shortLabel: 'Supply Chain' },
  { id: 'cryptoscam', label: 'Crypto Scam',            shortLabel: 'Crypto Scam' },
  { id: 'ddos',       label: 'DDoS',                   shortLabel: 'DDoS' },
  { id: 'aigenattack',label: 'AI-Generated Attacks',   shortLabel: 'AI Attacks' },
  { id: 'regulatory', label: 'Regulatory Risk',        shortLabel: 'Regulatory' },
];

// Risk matrix: PLATFORMS (rows) × THREATS (cols)
// Format: [ato, phishing, malware, databreach, ransomware, cheat, supplychain, cryptoscam, ddos, aigenattack, regulatory]
const RISK_MATRIX: RiskLevel[][] = [
  // steam
  [4, 3, 4, 3, 3, 4, 4, 2, 2, 3, 1],
  // console
  [3, 2, 2, 3, 1, 4, 2, 2, 3, 2, 2],
  // mobile
  [4, 4, 4, 3, 2, 3, 3, 4, 2, 4, 3],
  // discord
  [4, 4, 3, 3, 2, 1, 2, 4, 3, 4, 1],
  // twitch
  [4, 3, 2, 3, 1, 1, 2, 3, 2, 3, 2],
  // youtube
  [3, 3, 2, 2, 1, 1, 2, 3, 1, 3, 2],
  // mods
  [2, 2, 4, 2, 3, 3, 4, 2, 1, 3, 2],
  // esports
  [3, 3, 2, 3, 2, 4, 2, 3, 4, 2, 3],
  // indiedev
  [2, 3, 3, 4, 4, 2, 3, 2, 2, 3, 3],
  // aitools
  [2, 3, 3, 3, 2, 3, 4, 2, 1, 4, 4],
  // cloudstor
  [3, 2, 3, 4, 4, 1, 2, 1, 1, 2, 3],
  // africamm
  [3, 4, 3, 3, 2, 1, 1, 4, 2, 3, 4],
];

// Detailed cell data keyed as `${platformId}_${threatId}`
const CELL_DETAILS: Record<string, CellDetail> = {
  steam_ato: {
    riskLevel: 4,
    headline: 'Steam Account Takeover — Critical Risk',
    description: 'Steam accounts hold high-value inventories (CS2 skins, rare items) making them top targets for credential stuffing, phishing, and session cookie theft. Once stolen, accounts are liquidated via the Steam marketplace.',
    recentExample: 'CS2 inventory drains averaging $2,000–$50,000 per victim reported throughout 2024.',
    mitigation: 'Enable Steam Guard Mobile Authenticator. Never enter credentials on non-steam.com domains.',
    tools: [{ label: 'Steam Security Scanner', to: '/tools/steam-security-scanner' }, { label: 'Security Score', to: '/security-score' }],
  },
  steam_malware: {
    riskLevel: 4,
    headline: 'Steam Malware Distribution — Critical',
    description: 'Game mods, free cheats, and cracked games distributed outside Steam are primary malware vectors. Info-stealers (RedLine, Lumma) specifically target Steam session tokens and crypto wallets.',
    recentExample: 'Fake CS2 skin checker tools distributed via YouTube video descriptions in 2024.',
    mitigation: 'Only install games/mods from trusted sources. Use separate browser profile for Steam.',
    tools: [{ label: 'IOC Lookup', to: '/tools/ioc-lookup' }, { label: 'Breach Sim', to: '/breach-sim' }],
  },
  steam_cheat: {
    riskLevel: 4,
    headline: 'Steam Cheat Software — Critical Supply Chain Risk',
    description: 'Cheat software for Steam games routinely bundles RATs, keyloggers, and crypto miners. Users voluntarily disable antivirus and grant admin privileges — ideal attack conditions.',
    recentExample: 'Multiple cheat providers found bundling Azorult and RedLine stealers throughout 2023–2024.',
    mitigation: 'Avoid cheat software entirely. Use VM isolation if testing unknown executables.',
    tools: [{ label: 'Exploit Risk Meter', to: '/tools/exploit-risk-meter' }],
  },
  discord_ato: {
    riskLevel: 4,
    headline: 'Discord Account Takeover — Critical',
    description: 'Discord accounts are primary targets due to OAuth integrations, server admin powers, and the value of large community servers. Token theft via malicious bots and browser extensions is widespread.',
    recentExample: 'Discord malware targeting browser token storage active across gaming communities in 2024.',
    mitigation: 'Enable 2FA. Audit OAuth app permissions. Never run .exe files shared in Discord.',
    tools: [{ label: 'Security Score', to: '/security-score' }, { label: 'Breach Sim', to: '/breach-sim' }],
  },
  discord_phishing: {
    riskLevel: 4,
    headline: 'Discord Phishing — Critical',
    description: 'Discord is the #1 phishing vector in gaming. Fake NFT mints, free Nitro scams, "beta testing" invites, and fake support DMs are sent to millions of users. Server compromises enable mass DM campaigns.',
    recentExample: 'Discord Nitro phishing cost gaming community servers $1.2M in Q3 2024.',
    mitigation: 'Never click unsolicited DM links. Enable friend request filtering.',
    tools: [{ label: 'IOC Lookup', to: '/tools/ioc-lookup' }],
  },
  discord_cryptoscam: {
    riskLevel: 4,
    headline: 'Discord Crypto Scams — Critical',
    description: 'Gaming Discord servers are primary venues for NFT rug pulls, fake P2E game launches, and "exclusive whitelist" scams. Compromised server admin accounts send mass crypto scam announcements.',
    mitigation: 'Never send crypto to addresses in Discord DMs. Verify all mint links through official project websites.',
    tools: [{ label: 'Breach Sim', to: '/breach-sim' }],
  },
  mobile_ato: {
    riskLevel: 4,
    headline: 'Mobile Gaming ATO — Critical',
    description: 'Mobile gaming accounts are highly vulnerable due to SMS-based authentication, weak passwords, and the popularity of account selling/trading. High-value accounts (Clash of Clans, PUBG Mobile) fetch hundreds of dollars.',
    mitigation: 'Replace SMS 2FA with authenticator app. Use unique email per major game.',
    tools: [{ label: 'Security Score', to: '/security-score' }, { label: 'Breach Sim', to: '/breach-sim' }],
  },
  mobile_phishing: {
    riskLevel: 4,
    headline: 'Mobile Gaming Phishing — Critical',
    description: 'Fake mobile game links distributed via SMS, WhatsApp, and social ads. Fraudulent "free gems" sites harvest credentials and payment methods. Malicious APKs distributed as modded games.',
    mitigation: 'Only install games from official app stores. Verify URLs before entering credentials.',
    tools: [{ label: 'IOC Lookup', to: '/tools/ioc-lookup' }],
  },
  mobile_malware: {
    riskLevel: 4,
    headline: 'Mobile Gaming Malware — Critical',
    description: 'Modded APKs, "hacked" game files, and fake game launchers distribute mobile banking trojans and spyware. SpyNote and Cerberus RATs are frequently repackaged as popular mobile games.',
    mitigation: 'Never install APKs from outside official stores. Use separate device/profile for sensitive apps.',
    tools: [{ label: 'Exploit Risk Meter', to: '/tools/exploit-risk-meter' }],
  },
  mobile_aigenattack: {
    riskLevel: 4,
    headline: 'AI-Generated Mobile Scams — Critical',
    description: 'AI-generated fake game trailers, deepfake "developer" testimonials, and AI-crafted phishing pages targeting mobile gamers have exploded. Scam apps mimic legitimate games with AI-generated screenshots.',
    mitigation: 'Verify games through official developer accounts. Check review authenticity.',
    tools: [{ label: 'AI Pulse', to: '/ai-pulse' }],
  },
  africamm_phishing: {
    riskLevel: 4,
    headline: 'Mobile Money Phishing — Critical (Africa)',
    description: 'M-Pesa, MTN MoMo, and Airtel Money phishing targeting gamers in East and West Africa. Fake "gaming prize" SMS messages lead to credential-harvesting pages mimicking mobile money portals.',
    recentExample: 'M-Pesa gaming prize scam reported across Kenya, Tanzania in Q1 2025.',
    mitigation: 'Never follow payment links from unsolicited SMS. Verify via official carrier app.',
    tools: [{ label: 'Live Threat Dashboard', to: '/live-threat-dashboard' }],
  },
  africamm_cryptoscam: {
    riskLevel: 4,
    headline: 'P2E Crypto Scams via Mobile Money (Africa) — Critical',
    description: 'Play-to-earn crypto scams targeting African mobile gamers promise earnings payable via M-Pesa/MoMo. Initial small payouts build trust before larger "registration fee" theft.',
    mitigation: 'Independently verify P2E project legitimacy. Never pay "gas fees" via mobile money.',
    tools: [{ label: 'AI Pulse', to: '/ai-pulse' }],
  },
  africamm_regulatory: {
    riskLevel: 4,
    headline: 'Mobile Money Gaming Regulation — Critical (Africa)',
    description: 'Regulatory crackdowns on gambling-adjacent gaming (loot boxes, P2E) via mobile money are accelerating across Kenya, Nigeria, Ghana. Non-compliant gaming apps face payment processor blocks.',
    mitigation: 'Monitor CBK, CBN, and BoG guidance on gaming transactions. Implement KYC where required.',
    tools: [{ label: 'AI Pulse', to: '/ai-pulse' }, { label: 'NexusGuard', to: '/nexus-guard' }],
  },
  mods_malware: {
    riskLevel: 4,
    headline: 'Game Mod Malware — Critical',
    description: 'Malicious mods distributed through Nexus Mods, third-party sites, and mod Discord channels are a primary malware vector. Mods require .dll injection — identical to RAT installation techniques.',
    recentExample: 'Malicious Skyrim/Fallout 4 mods distributed via compromised Nexus Mods accounts in 2024.',
    mitigation: 'Only install mods from trusted authors with substantial track record. Use modded game sandboxing.',
    tools: [{ label: 'Exploit Risk Meter', to: '/tools/exploit-risk-meter' }],
  },
  mods_supplychain: {
    riskLevel: 4,
    headline: 'Mod Platform Supply Chain — Critical',
    description: 'Compromised mod platform accounts allow attackers to push malicious updates to thousands of users who auto-update mods. The trust relationship between modders and users is systematically exploited.',
    mitigation: 'Disable auto-update for mods. Review mod changelogs before updating.',
    tools: [{ label: 'Breach Sim', to: '/breach-sim' }],
  },
  aitools_aigenattack: {
    riskLevel: 4,
    headline: 'AI Tool Supply Chain in Gaming — Critical',
    description: 'AI tools marketed to game developers (texture generation, code assist, NPC dialogue) increasingly vector for supply chain compromise. Malicious PyPI/npm packages target AI/ML developer workflows.',
    mitigation: 'Audit AI tool dependencies. Use isolated environments for AI-assisted development.',
    tools: [{ label: 'AI Pulse', to: '/ai-pulse' }, { label: 'NexusGuard', to: '/nexus-guard' }],
  },
  aitools_regulatory: {
    riskLevel: 4,
    headline: 'AI Regulation in Gaming — Critical',
    description: 'EU AI Act, US executive orders, and national AI regulations are creating compliance requirements for AI-powered games (especially AI-generated content, deepfake avatars, AI gambling). Non-compliance risk is high.',
    mitigation: 'Audit AI features against EU AI Act risk categories. Implement AI transparency disclosures.',
    tools: [{ label: 'AI Pulse', to: '/ai-pulse' }],
  },
  indiedev_databreach: {
    riskLevel: 4,
    headline: 'Indie Dev Data Breach — Critical',
    description: 'Solo developers and small studios handling player PII often lack basic data hygiene — plaintext passwords, unencrypted databases, public S3 buckets. Breaches trigger GDPR/CCPA obligations that can bankrupt small studios.',
    mitigation: 'Encrypt all PII at rest. Never store plaintext passwords. Audit cloud storage permissions.',
    tools: [{ label: 'NexusGuard', to: '/nexus-guard' }, { label: 'Breach Sim', to: '/breach-sim' }],
  },
  indiedev_ransomware: {
    riskLevel: 4,
    headline: 'Indie Dev Ransomware — Critical',
    description: 'Game source code, art assets, and marketing materials are highly valuable ransomware targets. Solo developers rarely have offline backups or incident response plans. Release-day ransomware is particularly devastating.',
    mitigation: 'Implement 3-2-1 backup strategy. Offline backups essential. Test restore procedures.',
    tools: [{ label: 'Breach Sim', to: '/breach-sim' }, { label: 'NexusGuard', to: '/nexus-guard' }],
  },
  cloudstor_databreach: {
    riskLevel: 4,
    headline: 'Cloud Storage Data Breach — Critical',
    description: 'Misconfigured cloud storage (S3, GCS, Azure Blob) exposing game save data, player PII, and studio assets. Automated scanners find public buckets within hours of misconfiguration.',
    mitigation: 'Audit cloud bucket permissions weekly. Enable public access blocks by default.',
    tools: [{ label: 'NexusGuard', to: '/nexus-guard' }],
  },
  cloudstor_ransomware: {
    riskLevel: 4,
    headline: 'Cloud Storage Ransomware — Critical',
    description: 'Ransomware targeting cloud sync clients (OneDrive, Dropbox, Google Drive) encrypts local files that then sync to cloud — destroying cloud backups. Gaming asset pipelines are particularly vulnerable.',
    mitigation: 'Enable versioned backups in cloud storage. Maintain offline cold backups.',
    tools: [{ label: 'Breach Sim', to: '/breach-sim' }],
  },
  esports_ddos: {
    riskLevel: 4,
    headline: 'Esports DDoS — Critical',
    description: 'DDoS attacks against esports players (IP-based attacks targeting home connections) and tournament infrastructure are endemic. IP exposure via streaming, game servers, and Discord voice channels enables targeting.',
    recentExample: 'Multiple Apex Legends and Valorant tournament players DDoSed off stage at LAN events in 2024.',
    mitigation: 'Never expose real IP. Use VPN/proxy for all competitive play. Tournament venues use scrubbing.',
    tools: [{ label: 'Security Score', to: '/security-score' }],
  },
  esports_cheat: {
    riskLevel: 4,
    headline: 'Esports Cheating / Exploit — Critical',
    description: 'Cheating at the esports level involves kernel-level cheat software (bypassing anti-cheat), hardware manipulation, and increasingly AI-assisted aimbots. Prize pool stakes drive sophisticated exploit development.',
    mitigation: 'Comprehensive anti-cheat (kernel-level), hardware fingerprinting, and behavioral AI analysis.',
    tools: [{ label: 'Exploit Risk Meter', to: '/tools/exploit-risk-meter' }],
  },
  // Medium-high cells (3)
  steam_phishing: {
    riskLevel: 3,
    headline: 'Steam Phishing — High Risk',
    description: 'Fake Steam login pages, fake game key giveaways, and "Steam Support" impersonation are widespread. Typosquatting domains (steamcommunity[.]co, etc.) target users via social media and Discord.',
    mitigation: 'Verify URL bar before entering Steam credentials. Enable email notifications for logins.',
    tools: [{ label: 'IOC Lookup', to: '/tools/ioc-lookup' }],
  },
  steam_databreach: {
    riskLevel: 3,
    headline: 'Steam Data Breach Risk — High',
    description: 'Third-party gaming sites using Steam login accumulate user data. Breaches at these sites expose email addresses, playtime data, and linked accounts. Steam itself has a strong security record.',
    mitigation: 'Use unique email for Steam. Revoke OAuth access to unused third-party sites.',
    tools: [{ label: 'Security Score', to: '/security-score' }],
  },
  twitch_ato: {
    riskLevel: 4,
    headline: 'Twitch Account Takeover — Critical',
    description: 'Twitch accounts with large followings are highly valuable for scam broadcasting, affiliate monetisation theft, and subscriber data harvesting. Credential stuffing is the primary vector.',
    mitigation: 'Enable Twitch 2FA. Use unique password. Set up login notifications.',
    tools: [{ label: 'Security Score', to: '/security-score' }, { label: 'Breach Sim', to: '/breach-sim' }],
  },
  // Default fallback data for cells without specific entries
};

function getCellDetail(platformId: string, threatId: string): CellDetail {
  const key = `${platformId}_${threatId}`;
  if (CELL_DETAILS[key]) return CELL_DETAILS[key];

  const riskLevel = RISK_MATRIX[
    PLATFORMS.findIndex(p => p.id === platformId)
  ][
    THREATS.findIndex(t => t.id === threatId)
  ] as RiskLevel;

  const platform = PLATFORMS.find(p => p.id === platformId)!;
  const threat = THREATS.find(t => t.id === threatId)!;

  const levelLabel = riskLevel === 4 ? 'Critical' : riskLevel === 3 ? 'High' : riskLevel === 2 ? 'Medium' : 'Low';

  return {
    riskLevel,
    headline: `${threat.label} on ${platform.label} — ${levelLabel} Risk`,
    description: `${threat.label} represents a ${levelLabel.toLowerCase()} risk for ${platform.label} users and operators. This intersection requires awareness and appropriate security controls.`,
    mitigation: `Apply standard ${threat.label.toLowerCase()} mitigations appropriate to ${platform.label}. Review Security Score for personalised recommendations.`,
    tools: [{ label: 'Security Score', to: '/security-score' }],
  };
}

// ─── Risk Level Config ────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { bg: string; hover: string; text: string; label: string; dot: string }> = {
  0: { bg: 'bg-zinc-900',          hover: 'hover:bg-zinc-800',          text: 'text-zinc-700', label: 'None',     dot: 'bg-zinc-700' },
  1: { bg: 'bg-blue-950/60',       hover: 'hover:bg-blue-900/60',       text: 'text-blue-400', label: 'Low',      dot: 'bg-blue-500' },
  2: { bg: 'bg-yellow-950/60',     hover: 'hover:bg-yellow-900/60',     text: 'text-yellow-400', label: 'Medium', dot: 'bg-yellow-500' },
  3: { bg: 'bg-orange-950/60',     hover: 'hover:bg-orange-900/60',     text: 'text-orange-400', label: 'High',   dot: 'bg-orange-500' },
  4: { bg: 'bg-red-950/60',        hover: 'hover:bg-red-900/60',        text: 'text-red-400', label: 'Critical',  dot: 'bg-red-500' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const RiskCell = memo(function RiskCell({
  riskLevel,
  isSelected,
  onClick,
}: {
  riskLevel: RiskLevel;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cfg = RISK_CONFIG[riskLevel];
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full aspect-square rounded transition-all duration-150 flex items-center justify-center relative',
        cfg.bg, cfg.hover,
        isSelected && 'ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-950 scale-110 z-10',
        riskLevel === 0 ? 'cursor-default' : 'cursor-pointer'
      )}
      title={cfg.label}
    >
      {riskLevel > 0 && (
        <div className={cn('w-2 h-2 rounded-full', cfg.dot,
          riskLevel === 4 && 'w-3 h-3',
          riskLevel === 3 && 'w-2.5 h-2.5'
        )} />
      )}
    </button>
  );
});

const DetailPanel = memo(function DetailPanel({
  detail,
  platformLabel,
  threatLabel,
  onClose,
}: {
  detail: CellDetail;
  platformLabel: string;
  threatLabel: string;
  onClose: () => void;
}) {
  const cfg = RISK_CONFIG[detail.riskLevel];
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur overflow-hidden">
      {/* Header */}
      <div className={cn('px-5 py-4 border-b border-white/8 flex items-start justify-between gap-3',
        detail.riskLevel === 4 ? 'bg-red-950/40' :
        detail.riskLevel === 3 ? 'bg-orange-950/40' :
        detail.riskLevel === 2 ? 'bg-yellow-950/40' : 'bg-blue-950/40'
      )}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded', cfg.bg, cfg.text, 'border border-white/10')}>
              {cfg.label.toUpperCase()}
            </span>
            <span className="text-xs text-zinc-500">{platformLabel} × {threatLabel}</span>
          </div>
          <h3 className="font-bold text-white text-sm leading-tight">{detail.headline}</h3>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0 mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        <p className="text-zinc-300 text-sm leading-relaxed">{detail.description}</p>

        {detail.recentExample && (
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">Recent Example</span>
            </div>
            <p className="text-zinc-300 text-xs">{detail.recentExample}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400">Mitigation</span>
          </div>
          <p className="text-zinc-300 text-sm">{detail.mitigation}</p>
        </div>

        {detail.tools.length > 0 && (
          <div>
            <p className="text-xs text-zinc-500 mb-2">Related tools:</p>
            <div className="flex flex-wrap gap-2">
              {detail.tools.map(tool => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-colors"
                >
                  {tool.label} <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const AISidebar = memo(function AISidebar() {
  const criticalCells = useMemo(() => {
    const cells: { platform: string; threat: string; key: string }[] = [];
    PLATFORMS.forEach((p, pi) => {
      THREATS.forEach((t, ti) => {
        if (RISK_MATRIX[pi][ti] === 4) {
          cells.push({ platform: p.label, threat: t.label, key: `${p.id}_${t.id}` });
        }
      });
    });
    return cells.slice(0, 6);
  }, []);

  const platformRiskScore = useMemo(() =>
    PLATFORMS.map((p, pi) => ({
      label: p.label,
      score: RISK_MATRIX[pi].reduce((s, v) => s + v, 0),
    })).sort((a, b) => b.score - a.score).slice(0, 5)
  , []);

  const threatFrequency = useMemo(() =>
    THREATS.map((t, ti) => ({
      label: t.shortLabel,
      criticals: PLATFORMS.filter((_, pi) => RISK_MATRIX[pi][ti] === 4).length,
    })).sort((a, b) => b.criticals - a.criticals).slice(0, 5)
  , []);

  return (
    <div className="space-y-4">
      {/* AI Insight */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-purple-400">AI Insight</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed">
          The highest-risk intersection in 2025 is <strong className="text-white">Mobile Gaming × AI-Generated Attacks</strong>.
          AI-crafted fake apps, deepfake "developer" videos, and AI-generated phishing pages are converging with mobile gaming's
          large, less security-aware user base — especially in emerging markets.
        </p>
      </div>

      {/* Top Critical Cells */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-widest">Top Critical Intersections</h4>
        <div className="space-y-2">
          {criticalCells.map(({ platform, threat, key }) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-zinc-300 truncate">{platform}</span>
              <ChevronRight className="w-3 h-3 text-zinc-600 flex-shrink-0" />
              <span className="text-zinc-400 truncate">{threat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Risk Ranking */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-widest">Highest Risk Platforms</h4>
        <div className="space-y-2.5">
          {platformRiskScore.map(({ label, score }, i) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">{label}</span>
                <span className="text-zinc-500">{score}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: `${(score / 44) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Frequency */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-widest">Most Critical Threats</h4>
        <div className="space-y-1.5">
          {threatFrequency.map(({ label, criticals }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-zinc-300">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(criticals, 8) }).map((_, j) => (
                    <div key={j} className="w-1.5 h-3 rounded-sm bg-red-500/70" />
                  ))}
                </div>
                <span className="text-zinc-500 text-xs">{criticals}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <p className="text-zinc-400 text-xs mb-3">Explore related tools:</p>
        <div className="space-y-2">
          {[
            { label: 'Run a Breach Simulation', to: '/breach-sim', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
            { label: 'Check Security Score', to: '/security-score', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
            { label: 'Live Threat Dashboard', to: '/live-threat-dashboard', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          ].map(({ label, to, color }) => (
            <Link
              key={to}
              to={to}
              className={cn('flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-opacity hover:opacity-80', color)}
            >
              {label} <ExternalLink className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────

const NexusIntersectionEnhanced = memo(function NexusIntersectionEnhanced() {
  const [selectedCell, setSelectedCell] = useState<{ platformIdx: number; threatIdx: number } | null>(null);
  const [filterMin, setFilterMin] = useState<RiskLevel>(0);

  const selectedDetail = useMemo(() => {
    if (!selectedCell) return null;
    const p = PLATFORMS[selectedCell.platformIdx];
    const t = THREATS[selectedCell.threatIdx];
    return {
      detail: getCellDetail(p.id, t.id),
      platformLabel: p.label,
      threatLabel: t.label,
    };
  }, [selectedCell]);

  const handleCellClick = useCallback((pi: number, ti: number) => {
    const risk = RISK_MATRIX[pi][ti];
    if (risk === 0) return;
    setSelectedCell(prev =>
      prev?.platformIdx === pi && prev?.threatIdx === ti ? null : { platformIdx: pi, threatIdx: ti }
    );
  }, []);

  const handleClose = useCallback(() => setSelectedCell(null), []);

  const riskCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    RISK_MATRIX.forEach(row => row.forEach(v => { if (v > 0) counts[v as 1 | 2 | 3 | 4]++; }));
    return counts;
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Nexus Intersection — 12×11 Risk Heatmap"
        description="Interactive risk heatmap across 12 gaming/tech platforms and 11 threat categories. Identify the highest-risk security intersections for gamers, creators, devs, and sysadmins."
        keywords={['risk heatmap', 'gaming security matrix', 'threat intersection', 'MITRE', 'account takeover', 'gaming threats']}
        url={typeof window !== 'undefined' ? window.location.href : '/nexus-intersection'}
        type="website"
      />

      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nexus Intersection</h1>
                <p className="text-zinc-400 text-sm">12 platforms × 11 threats — interactive risk heatmap</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed mt-3">
              Click any cell to explore the risk detail, recent examples, and recommended mitigations for each platform–threat intersection.
              Red = Critical, Orange = High, Yellow = Medium, Blue = Low.
            </p>

            {/* Risk summary */}
            <div className="flex flex-wrap gap-3 mt-4">
              {([4, 3, 2, 1] as RiskLevel[]).map(level => {
                const cfg = RISK_CONFIG[level];
                return (
                  <button
                    key={level}
                    onClick={() => setFilterMin(filterMin === level ? 0 : level)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all',
                      cfg.bg, cfg.text, 'border-white/10',
                      filterMin === level && 'ring-1 ring-white/30'
                    )}
                  >
                    <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                    {cfg.label}: {riskCounts[level as 1 | 2 | 3 | 4] || 0} cells
                  </button>
                );
              })}
              {filterMin > 0 && (
                <button
                  onClick={() => setFilterMin(0)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs hover:text-zinc-200 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex gap-6">

            {/* Heatmap */}
            <div className="flex-1 min-w-0">
              {/* Threat columns header */}
              <div className="flex gap-1 mb-1 pl-[130px]">
                {THREATS.map(threat => (
                  <div
                    key={threat.id}
                    className="flex-1 text-center"
                    style={{ minWidth: 0 }}
                  >
                    <span className="text-zinc-600 text-[9px] leading-tight block truncate px-0.5">
                      {threat.shortLabel}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="space-y-1">
                {PLATFORMS.map((platform, pi) => {
                  const PlatformIcon = platform.icon;
                  return (
                    <div key={platform.id} className="flex gap-1 items-center">
                      {/* Row label */}
                      <div className="w-[130px] flex-shrink-0 flex items-center gap-1.5 pr-2">
                        <PlatformIcon className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                        <span className="text-zinc-400 text-[10px] leading-tight truncate">{platform.label}</span>
                      </div>

                      {/* Cells */}
                      {THREATS.map((threat, ti) => {
                        const risk = RISK_MATRIX[pi][ti] as RiskLevel;
                        const dimmed = filterMin > 0 && risk < filterMin;
                        return (
                          <div key={threat.id} className={cn('flex-1 transition-opacity', dimmed && 'opacity-20')} style={{ minWidth: 0 }}>
                            <RiskCell
                              riskLevel={risk}
                              isSelected={selectedCell?.platformIdx === pi && selectedCell?.threatIdx === ti}
                              onClick={() => handleCellClick(pi, ti)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Detail panel (below heatmap on mobile / below on narrow) */}
              {selectedDetail && (
                <div className="mt-4 xl:hidden">
                  <DetailPanel
                    detail={selectedDetail.detail}
                    platformLabel={selectedDetail.platformLabel}
                    threatLabel={selectedDetail.threatLabel}
                    onClose={handleClose}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 hidden lg:block space-y-4">
              {selectedDetail ? (
                <DetailPanel
                  detail={selectedDetail.detail}
                  platformLabel={selectedDetail.platformLabel}
                  threatLabel={selectedDetail.threatLabel}
                  onClose={handleClose}
                />
              ) : null}
              <AISidebar />
            </div>
          </div>

          {/* Mobile sidebar */}
          <div className="mt-6 lg:hidden">
            <AISidebar />
          </div>

        </div>
      </div>
    </Layout>
  );
});

export default NexusIntersectionEnhanced;
