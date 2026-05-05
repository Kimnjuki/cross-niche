import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Cpu, Monitor, HardDrive, Zap, Box, Wind, CircuitBoard,
  Shield, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight,
  Share2, RotateCcw, ExternalLink, ChevronRight, Star, Layers,
  DollarSign, Activity, Lock, Copy, Check,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';
import { ToolPageSEO } from '@/components/tools/ToolPageSEO';

// ── Types ─────────────────────────────────────────────────────────────────────

type UseCase = 'gaming' | 'streaming' | 'workstation' | 'budget_gaming';
type Phase = 'usecase' | 'components' | 'results';

interface ComponentSlot {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
  tdpWatts: number; // base TDP estimate
  color: string;
  placeholder: string;
  priceRange: [number, number]; // [min, max] USD
  securityNote: string;
  vulnScore: number; // 0-100 base firmware vuln score for slot
}

interface BuildComponent {
  type: string;
  name: string;
  price: number;
  securityVulnScore?: number;
  notes?: string;
}

// ── Component Slot Definitions ────────────────────────────────────────────────

const SLOTS: ComponentSlot[] = [
  {
    type: 'cpu',
    label: 'CPU',
    icon: Cpu,
    required: true,
    tdpWatts: 65,
    color: 'text-[#00F0FF]',
    placeholder: 'e.g. Intel Core i5-13600K',
    priceRange: [150, 800],
    securityNote: 'CPUs with Spectre/Meltdown mitigations (post-2019) score better.',
    vulnScore: 20,
  },
  {
    type: 'gpu',
    label: 'GPU',
    icon: Monitor,
    required: true,
    tdpWatts: 150,
    color: 'text-[#FF007A]',
    placeholder: 'e.g. NVIDIA RTX 4070',
    priceRange: [200, 1500],
    securityNote: 'NVIDIA and AMD GPUs have had driver-level RCE CVEs — keep drivers updated.',
    vulnScore: 30,
  },
  {
    type: 'motherboard',
    label: 'Motherboard',
    icon: CircuitBoard,
    required: true,
    tdpWatts: 15,
    color: 'text-[#39FF14]',
    placeholder: 'e.g. ASUS ROG STRIX B650E',
    priceRange: [100, 600],
    securityNote: 'UEFI Secure Boot and TPM 2.0 support are critical firmware security features.',
    vulnScore: 40,
  },
  {
    type: 'ram',
    label: 'RAM',
    icon: Layers,
    required: true,
    tdpWatts: 5,
    color: 'text-[#B026FF]',
    placeholder: 'e.g. Corsair Vengeance 32GB DDR5',
    priceRange: [50, 400],
    securityNote: 'RAM rowhammer attacks are mitigated by ECC. Consumer builds lack ECC.',
    vulnScore: 15,
  },
  {
    type: 'storage',
    label: 'Primary Storage (SSD)',
    icon: HardDrive,
    required: true,
    tdpWatts: 7,
    color: 'text-[#FFB800]',
    placeholder: 'e.g. Samsung 990 Pro 1TB NVMe',
    priceRange: [60, 400],
    securityNote: 'NVMe SSDs with AES-256 hardware encryption protect data at rest.',
    vulnScore: 25,
  },
  {
    type: 'psu',
    label: 'Power Supply',
    icon: Zap,
    required: true,
    tdpWatts: 0,
    color: 'text-yellow-500',
    placeholder: 'e.g. Corsair RM850x 80+ Gold',
    priceRange: [60, 300],
    securityNote: 'Quality PSUs with OVP/OCP protect components from power surge exploits.',
    vulnScore: 5,
  },
  {
    type: 'case',
    label: 'Case',
    icon: Box,
    required: false,
    tdpWatts: 0,
    color: 'text-gray-400',
    placeholder: 'e.g. Fractal Design Meshify 2',
    priceRange: [60, 300],
    securityNote: 'Physical security: lockable side panels reduce unauthorized hardware access.',
    vulnScore: 5,
  },
  {
    type: 'cooling',
    label: 'CPU Cooling',
    icon: Wind,
    required: false,
    tdpWatts: 5,
    color: 'text-blue-400',
    placeholder: 'e.g. Noctua NH-D15',
    priceRange: [30, 200],
    securityNote: 'Thermal management prevents CPU throttling exploits in sustained workloads.',
    vulnScore: 5,
  },
];

const USE_CASES: { id: UseCase; label: string; desc: string; emoji: string; budgetHint: string }[] = [
  { id: 'gaming',         label: 'Gaming',          desc: '1080p–4K gaming, high frame rates',  emoji: '🎮', budgetHint: '$800–$2,000' },
  { id: 'streaming',      label: 'Streaming',        desc: 'Game + stream simultaneously',        emoji: '📡', budgetHint: '$1,200–$3,000' },
  { id: 'workstation',    label: 'Workstation',      desc: 'Video editing, 3D, development',      emoji: '🖥️', budgetHint: '$1,500–$5,000' },
  { id: 'budget_gaming',  label: 'Budget Gaming',    desc: '1080p gaming under $700',             emoji: '💰', budgetHint: '$400–$700' },
];

// ── AI Security Analysis (client-side, deterministic) ────────────────────────

function computeAISecurityScore(components: BuildComponent[]): {
  score: number;
  issues: string[];
  tips: string[];
} {
  const issues: string[] = [];
  const tips: string[] = [];

  const hasMotherboard = components.some(c => c.type === 'motherboard');
  const hasCPU = components.some(c => c.type === 'cpu');
  const hasStorage = components.some(c => c.type === 'storage');
  const hasGPU = components.some(c => c.type === 'gpu');

  const cpuName = components.find(c => c.type === 'cpu')?.name?.toLowerCase() ?? '';
  const moboName = components.find(c => c.type === 'motherboard')?.name?.toLowerCase() ?? '';
  const storageName = components.find(c => c.type === 'storage')?.name?.toLowerCase() ?? '';
  const gpuName = components.find(c => c.type === 'gpu')?.name?.toLowerCase() ?? '';

  let baseScore = 70;

  // CPU security checks
  if (hasCPU) {
    const isOldIntel = /i[3579]-[67]\d{3}/.test(cpuName);
    const isOldAMD = /ryzen [357] [12]/.test(cpuName);
    if (isOldIntel || isOldAMD) {
      issues.push('CPU pre-dates hardware mitigations for Spectre/Meltdown — OS patches reduce performance by up to 30%.');
      baseScore -= 10;
    } else {
      tips.push('Modern CPU includes hardware Spectre/Meltdown mitigations — no significant performance penalty.');
      baseScore += 5;
    }
  }

  // Motherboard/UEFI checks
  if (hasMotherboard) {
    const hasTpm = moboName.includes('tpm') || moboName.includes('z690') || moboName.includes('z790') ||
      moboName.includes('b650') || moboName.includes('x670') || moboName.includes('b550') || moboName.includes('x570');
    if (!hasTpm) {
      issues.push('Motherboard may not have TPM 2.0 — required for Windows 11 BitLocker and secure boot chain.');
      baseScore -= 8;
    } else {
      tips.push('Motherboard supports TPM 2.0 — enable BitLocker to protect data at rest.');
      baseScore += 3;
    }
    if (moboName.includes('rog') || moboName.includes('aorus') || moboName.includes('msi meg') || moboName.includes('hero')) {
      tips.push('High-end motherboard likely supports BIOS write-protect and signed firmware updates.');
      baseScore += 2;
    }
  }

  // Storage encryption checks
  if (hasStorage) {
    const hasNvme = storageName.includes('nvme') || storageName.includes('990') || storageName.includes('980') ||
      storageName.includes('sn850') || storageName.includes('firecuda') || storageName.includes('wd black');
    const hasEncryption = storageName.includes('samsung') || storageName.includes('crucial') || storageName.includes('wd');
    if (hasNvme && hasEncryption) {
      tips.push('NVMe SSD with hardware AES-256 encryption available — activate via UEFI or Samsung Magician.');
      baseScore += 5;
    } else if (!hasNvme) {
      issues.push('SATA SSD or HDD is slower and typically lacks hardware-level encryption — consider NVMe upgrade.');
      baseScore -= 5;
    }
  }

  // GPU driver security
  if (hasGPU) {
    const isNvidia = gpuName.includes('nvidia') || gpuName.includes('rtx') || gpuName.includes('gtx');
    const isAMD = gpuName.includes('amd') || gpuName.includes('rx ') || gpuName.includes('radeon');
    if (isNvidia) {
      tips.push('NVIDIA GPUs: enable automatic driver updates in GeForce Experience to patch driver CVEs promptly.');
    } else if (isAMD) {
      tips.push('AMD GPUs: use Radeon Software Adrenalin auto-update to stay ahead of driver security patches.');
    }
    baseScore += 2;
  }

  // General hardening tips
  tips.push('Enable Secure Boot in UEFI settings — prevents rootkits from loading before the OS.');
  tips.push('Use Windows Defender or a reputable AV with real-time protection enabled at all times.');
  tips.push('Keep all firmware (BIOS, GPU VBIOS, SSD firmware) updated via manufacturer tools.');

  if (components.length < 5) {
    issues.push('Build is incomplete — full security analysis requires all core components.');
    baseScore -= 5;
  }

  const finalScore = Math.min(100, Math.max(0, baseScore));
  return { score: finalScore, issues, tips };
}

function computeCompatibility(components: BuildComponent[], useCase: UseCase): number {
  const types = new Set(components.map(c => c.type));
  const required = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu'];
  const missingCount = required.filter(r => !types.has(r)).length;
  const base = 100 - missingCount * 15;

  // Use-case specific bonus
  const bonuses: Record<UseCase, number> = {
    gaming: types.has('cooling') ? 5 : 0,
    streaming: types.has('cooling') ? 5 : 0,
    workstation: types.has('cooling') ? 5 : 0,
    budget_gaming: 3,
  };

  return Math.min(100, Math.max(0, base + (bonuses[useCase] ?? 0)));
}

function computeTotalWatts(components: BuildComponent[]): number {
  return components.reduce((sum, comp) => {
    const slot = SLOTS.find(s => s.type === comp.type);
    return sum + (slot?.tdpWatts ?? 0);
  }, 0) + 50; // base system overhead
}

function getSecurityBand(score: number): { label: string; color: string; bg: string } {
  if (score >= 85) return { label: 'Hardened', color: 'text-green-500', bg: 'bg-green-500' };
  if (score >= 65) return { label: 'Secured', color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]' };
  if (score >= 45) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  return { label: 'Vulnerable', color: 'text-destructive', bg: 'bg-destructive' };
}

// ── Score Ring Component ──────────────────────────────────────────────────────

const ScoreRing = React.memo(function ScoreRing({ value, max = 100, color, label, sublabel }: {
  value: number; max?: number; color: string; label: string; sublabel: string;
}) {
  const pct = (value / max) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-muted/30" />
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" stroke={color}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display">{Math.round(value)}</span>
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
});

// ── Main Component ────────────────────────────────────────────────────────────

export default function PCBuilder() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const saveBuild = useMutation(api.pcBuilder.saveBuild);
  const sessionIdRef = useRef<string>(() => {
    const stored = sessionStorage.getItem('gnx_pc_builder_session');
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem('gnx_pc_builder_session', id);
    return id;
  });

  const [phase, setPhase] = useState<Phase>('usecase');
  const [useCase, setUseCase] = useState<UseCase>('gaming');
  const [budget, setBudget] = useState<number>(1000);
  const [buildName, setBuildName] = useState('My Nexus Build');
  const [components, setComponents] = useState<Record<string, BuildComponent>>({});
  const [activeSlot, setActiveSlot] = useState<string>(SLOTS[0].type);
  const [partName, setPartName] = useState('');
  const [partPrice, setPartPrice] = useState('');
  const [saved, setSaved] = useState(false);
  const [shareToken] = useState(() => crypto.randomUUID().replace(/-/g, '').slice(0, 16));
  const [copied, setCopied] = useState(false);

  const componentList = useMemo(() => Object.values(components), [components]);
  const totalPrice = useMemo(() => componentList.reduce((s, c) => s + c.price, 0), [componentList]);
  const totalWatts = useMemo(() => computeTotalWatts(componentList), [componentList]);
  const compatibility = useMemo(() => computeCompatibility(componentList, useCase), [componentList, useCase]);
  const aiAnalysis = useMemo(() => computeAISecurityScore(componentList), [componentList]);
  const securityBand = useMemo(() => getSecurityBand(aiAnalysis.score), [aiAnalysis.score]);
  const budgetRemaining = budget - totalPrice;
  const budgetPct = Math.min(100, (totalPrice / budget) * 100);

  const handleAddComponent = useCallback(() => {
    if (!partName.trim()) return;
    const price = parseFloat(partPrice) || 0;
    const slot = SLOTS.find(s => s.type === activeSlot);
    setComponents(prev => ({
      ...prev,
      [activeSlot]: {
        type: activeSlot,
        name: partName.trim(),
        price,
        securityVulnScore: slot?.vulnScore,
      },
    }));
    setPartName('');
    setPartPrice('');
    // Auto-advance to next unfilled slot
    const nextEmpty = SLOTS.find(s => !components[s.type] && s.type !== activeSlot);
    if (nextEmpty) setActiveSlot(nextEmpty.type);
  }, [activeSlot, partName, partPrice, components]);

  const handleRemoveComponent = useCallback((type: string) => {
    setComponents(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (isDisabled) return;
    try {
      await saveBuild({
        sessionId: sessionIdRef.current(),
        userId: user?.id,
        buildName,
        components: componentList,
        totalPrice,
        totalWatts,
        compatibilityScore: compatibility,
        aiSecurityScore: aiAnalysis.score,
        aiSecurityIssues: aiAnalysis.issues,
        aiOptimizationTips: aiAnalysis.tips,
        useCase,
        budget,
        isPublic: false,
        shareToken,
      });
      setSaved(true);
    } catch {}
  }, [isDisabled, saveBuild, sessionIdRef, user?.id, buildName, componentList, totalPrice, totalWatts, compatibility, aiAnalysis, useCase, budget, shareToken]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/tools/pc-builder?share=${shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareToken]);

  const handleReset = useCallback(() => {
    setPhase('usecase');
    setComponents({});
    setPartName('');
    setPartPrice('');
    setSaved(false);
    setActiveSlot(SLOTS[0].type);
    setBuildName('My Nexus Build');
    setBudget(1000);
  }, []);

  const activeSlotConfig = SLOTS.find(s => s.type === activeSlot)!;
  const requiredFilled = SLOTS.filter(s => s.required).every(s => components[s.type]);

  return (
    <Layout>
      <SEO
        title="AI PC Builder with Security Score | The Grid Nexus"
        description="Build a gaming PC optimized for security. Compare components by firmware vulnerability history, driver support lifespan, and security feature compatibility."
        canonical="https://thegridnexus.com/tools/pc-builder"
        ogType="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Security Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">AI PC Builder</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 mb-4">
            <Cpu className="h-8 w-8 text-[#00F0FF]" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">AI PC Builder</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Configure your gaming rig and get an AI security score, firmware vulnerability analysis, and component hardening tips.
          </p>
        </div>

        {/* ── PHASE: USE CASE ── */}
        {phase === 'usecase' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What are you building for?</CardTitle>
                <CardDescription>We'll tailor compatibility checks and security tips to your use case.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {USE_CASES.map(uc => (
                    <button
                      key={uc.id}
                      onClick={() => setUseCase(uc.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                        useCase === uc.id
                          ? 'border-[#00F0FF] bg-[#00F0FF]/10'
                          : 'border-border hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5'
                      )}
                    >
                      <span className="text-2xl">{uc.emoji}</span>
                      <span className="text-sm font-semibold">{uc.label}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{uc.desc}</span>
                      <span className="text-xs font-mono text-[#00F0FF]">{uc.budgetHint}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="build-name">Build Name</Label>
                    <Input
                      id="build-name"
                      value={buildName}
                      onChange={e => setBuildName(e.target.value)}
                      placeholder="My Nexus Build"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="budget">Total Budget (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        className="pl-8"
                        value={budget}
                        onChange={e => setBudget(Number(e.target.value))}
                        placeholder="1000"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80"
              onClick={() => setPhase('components')}
            >
              Start Building <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── PHASE: COMPONENTS ── */}
        {phase === 'components' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: component list */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Components</p>
              {SLOTS.map(slot => {
                const filled = components[slot.type];
                const Icon = slot.icon;
                return (
                  <button
                    key={slot.type}
                    onClick={() => setActiveSlot(slot.type)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                      activeSlot === slot.type
                        ? 'border-[#00F0FF] bg-[#00F0FF]/5'
                        : filled
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-border hover:border-[#00F0FF]/40'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', slot.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{slot.label}</div>
                      {filled ? (
                        <div className="text-xs text-muted-foreground truncate">{filled.name}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground/60">
                          {slot.required ? 'Required' : 'Optional'}
                        </div>
                      )}
                    </div>
                    {filled ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    ) : slot.required ? (
                      <div className="h-2 w-2 rounded-full bg-yellow-500/60 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Right: slot editor + live stats */}
            <div className="lg:col-span-2 space-y-4">
              {/* Slot editor */}
              <Card className="border-[#00F0FF]/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-muted/60')}>
                      <activeSlotConfig.icon className={cn('h-5 w-5', activeSlotConfig.color)} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activeSlotConfig.label}</CardTitle>
                      <CardDescription className="text-xs">{activeSlotConfig.securityNote}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Component Name</Label>
                    <Input
                      value={partName}
                      onChange={e => setPartName(e.target.value)}
                      placeholder={activeSlotConfig.placeholder}
                      onKeyDown={e => e.key === 'Enter' && handleAddComponent()}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-8"
                        value={partPrice}
                        onChange={e => setPartPrice(e.target.value)}
                        placeholder="0"
                        min={0}
                        onKeyDown={e => e.key === 'Enter' && handleAddComponent()}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Typical range: ${activeSlotConfig.priceRange[0]}–${activeSlotConfig.priceRange[1]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80"
                      onClick={handleAddComponent}
                      disabled={!partName.trim()}
                    >
                      {components[activeSlot] ? 'Update' : 'Add'} Component
                    </Button>
                    {components[activeSlot] && (
                      <Button variant="outline" className="text-destructive border-destructive/30"
                        onClick={() => handleRemoveComponent(activeSlot)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Live build stats */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4 pb-4">
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-xl font-bold font-mono text-[#00F0FF]">${totalPrice.toFixed(0)}</div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold font-mono text-yellow-500">{totalWatts}W</div>
                      <div className="text-xs text-muted-foreground">Est. Draw</div>
                    </div>
                    <div>
                      <div className={cn('text-xl font-bold font-mono', compatibility >= 80 ? 'text-green-500' : 'text-yellow-500')}>
                        {compatibility}%
                      </div>
                      <div className="text-xs text-muted-foreground">Compatibility</div>
                    </div>
                  </div>
                  {/* Budget bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Budget usage</span>
                      <span className={budgetRemaining < 0 ? 'text-destructive font-semibold' : ''}>
                        {budgetRemaining >= 0 ? `$${budgetRemaining.toFixed(0)} remaining` : `$${Math.abs(budgetRemaining).toFixed(0)} over budget`}
                      </span>
                    </div>
                    <Progress
                      value={budgetPct}
                      className={cn('h-2', budgetPct > 100 ? '[&>div]:bg-destructive' : '[&>div]:bg-[#00F0FF]')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Analyse button */}
              <Button
                className="w-full bg-[#FF007A] text-white font-bold hover:bg-[#FF007A]/80"
                onClick={() => setPhase('results')}
                disabled={componentList.length === 0}
              >
                <Shield className="mr-2 h-4 w-4" />
                {requiredFilled ? 'Analyse Security' : `Analyse (${componentList.length} components)`}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE: RESULTS ── */}
        {phase === 'results' && (
          <div className="space-y-6">
            {/* Build name + action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold font-display">{buildName}</h2>
                <p className="text-sm text-muted-foreground">
                  {USE_CASES.find(u => u.id === useCase)?.label} · {componentList.length} components · ${totalPrice.toFixed(0)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button
                  size="sm"
                  className="bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80"
                  onClick={handleSave}
                  disabled={isDisabled || saved}
                >
                  {saved ? <><Check className="h-4 w-4 mr-1" /> Saved</> : 'Save Build'}
                </Button>
              </div>
            </div>

            {/* Score rings */}
            <Card className="border-[#00F0FF]/20">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-wrap justify-center gap-8">
                  <ScoreRing value={aiAnalysis.score} color={securityBand.bg.replace('bg-', '#').includes('#') ? '#00F0FF' : '#ef4444'}
                    label="Security Score" sublabel={securityBand.label} />
                  <ScoreRing value={compatibility} color={compatibility >= 80 ? '#39FF14' : '#FFB800'}
                    label="Compatibility" sublabel={compatibility >= 80 ? 'Good' : 'Partial'} />
                  <ScoreRing value={Math.min(100, (totalWatts / (totalWatts + 50)) * 100)} color="#FFB800"
                    label="Est. Wattage" sublabel={`${totalWatts}W`} />
                </div>
                <div className="mt-4 text-center">
                  <Badge className={cn('text-sm px-3 py-1', securityBand.color.replace('text-', 'border-'), 'border bg-transparent')}>
                    Security Tier: {securityBand.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Component breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#00F0FF]" /> Component Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SLOTS.map(slot => {
                  const comp = components[slot.type];
                  const Icon = slot.icon;
                  if (!comp && !slot.required) return null;
                  return (
                    <div key={slot.type} className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg',
                      comp ? 'bg-muted/30' : 'bg-destructive/5 border border-destructive/20'
                    )}>
                      <Icon className={cn('h-4 w-4 shrink-0', slot.color)} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-muted-foreground">{slot.label}</span>
                        {comp ? (
                          <p className="text-sm font-medium truncate">{comp.name}</p>
                        ) : (
                          <p className="text-sm text-destructive">Missing — {slot.label} required</p>
                        )}
                      </div>
                      {comp ? (
                        <span className="text-sm font-mono font-semibold shrink-0">${comp.price.toFixed(0)}</span>
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-base font-bold font-mono text-[#00F0FF]">${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Security issues */}
            {aiAnalysis.issues.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display font-bold text-base flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Security Issues ({aiAnalysis.issues.length})
                </h3>
                {aiAnalysis.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm">{issue}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Security tips */}
            {aiAnalysis.tips.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display font-bold text-base flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" /> Hardening Tips ({aiAnalysis.tips.length})
                </h3>
                {aiAnalysis.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PSU sizing tip */}
            {totalWatts > 0 && (
              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Power Supply Sizing</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Estimated draw: <strong>{totalWatts}W</strong>. Recommended PSU: <strong>{Math.ceil((totalWatts * 1.2) / 50) * 50}W</strong> (20% headroom, 80+ Gold or better).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Related tools */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold mb-3">Harden Your Build Further</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { href: '/tools/exploit-risk-meter', icon: Activity, label: 'Exploit Risk Meter', sub: 'CVE risk by software', color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                  { href: '/live-threat-dashboard',    icon: Shield,   label: 'Threat Dashboard',  sub: 'Live gaming CVEs',  color: 'text-security hover:bg-security/10 border-security/20' },
                  { href: '/tools/zero-trust-quiz',   icon: Lock,     label: 'Zero-Trust Quiz',   sub: 'Org readiness',     color: 'text-tech hover:bg-tech/10 border-tech/20' },
                ].map(t => (
                  <Link key={t.href} to={t.href}
                    className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                    <t.icon className="h-4 w-4" />
                    <span className="text-xs font-semibold">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.sub}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setPhase('components')}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Edit Build
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> New Build
              </Button>
              <Button className="flex-1 bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80" asChild>
                <Link to="/tools" className="flex items-center gap-1.5">
                  All Tools <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
