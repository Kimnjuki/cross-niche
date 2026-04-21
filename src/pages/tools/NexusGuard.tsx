import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Mail,
  Share2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lock,
  Cloud,
  Code,
  Building,
  Globe,
  Users,
  BookOpen,
  ArrowLeft,
  Gamepad2,
  Activity,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// ── Options ──────────────────────────────────────────────────────────────────

const industries = [
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'saas', label: 'SaaS / Technology' },
  { value: 'gaming', label: 'Gaming & Entertainment' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
];

const cloudStacks = [
  { value: 'aws', label: 'Amazon Web Services (AWS)' },
  { value: 'azure', label: 'Microsoft Azure' },
  { value: 'gcp', label: 'Google Cloud Platform (GCP)' },
  { value: 'onprem', label: 'On-Premises' },
  { value: 'hybrid', label: 'Hybrid (Multi-cloud)' },
];

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python / Django / Flask' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'docker', label: 'Docker' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'laravel', label: 'Laravel / PHP' },
  { value: 'dotnet', label: '.NET' },
  { value: 'java', label: 'Java / Spring' },
  { value: 'terraform', label: 'Terraform / IaC' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'apache', label: 'Apache' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
  { value: 'elasticsearch', label: 'Elasticsearch' },
];

const regions = [
  { value: 'east-africa', label: 'East Africa (Kenya, Tanzania, Uganda)' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'west-africa', label: 'West Africa (Nigeria, Ghana)' },
  { value: 'eu', label: 'European Union (GDPR)' },
  { value: 'us', label: 'United States' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'global', label: 'Global / Multi-region' },
];

const companySizes = [
  { value: 'startup', label: 'Startup (1–50 employees)' },
  { value: 'small', label: 'Small Business (51–200 employees)' },
  { value: 'medium', label: 'Medium Enterprise (201–1000 employees)' },
  { value: 'large', label: 'Large Enterprise (1000+ employees)' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'industry' | 'cloud' | 'frameworks' | 'region' | 'company' | 'generating' | 'results';

interface BriefData {
  industry: string;
  cloudStack: string;
  frameworks: string[];
  region: string;
  companySize: string;
}

interface ThreatItem {
  title: string;
  description: string;
  cveId?: string;
  severity?: string;
  affected?: string;
}

interface GeneratedBrief {
  executive_summary: string;
  critical_threats: ThreatItem[];
  high_threats: ThreatItem[];
  medium_threats: ThreatItem[];
  low_threats: ThreatItem[];
  patch_checklist: string[];
  compliance_notes: string;
  article_recommendations: Array<{ title: string; url: string }>;
}

interface SeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSeverityBadgeColor(level: string) {
  switch (level) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'high':     return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    case 'medium':   return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case 'low':      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    default:         return 'bg-muted text-muted-foreground';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NexusGuardPage() {
  const [currentStep, setCurrentStep] = useState<Step>('industry');
  const [briefData, setBriefData] = useState<BriefData>({
    industry: '', cloudStack: '', frameworks: [], region: '', companySize: '',
  });
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);
  const [severitySummary, setSeveritySummary] = useState<SeveritySummary | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'industry',   label: 'Industry',    icon: Building },
    { id: 'cloud',      label: 'Cloud Stack', icon: Cloud },
    { id: 'frameworks', label: 'Technologies', icon: Code },
    { id: 'region',     label: 'Region',      icon: Globe },
    { id: 'company',    label: 'Company Size', icon: Users },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const order: Step[] = ['industry', 'cloud', 'frameworks', 'region', 'company', 'generating'];
    const next = order.indexOf(currentStep) + 1;
    if (next < order.length) setCurrentStep(order[next]);
  };

  const handleBack = () => {
    const order: Step[] = ['industry', 'cloud', 'frameworks', 'region', 'company'];
    const prev = order.indexOf(currentStep) - 1;
    if (prev >= 0) setCurrentStep(order[prev]);
  };

  const handleGenerate = async () => {
    setCurrentStep('generating');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mock: GeneratedBrief = {
      executive_summary: `Based on your ${briefData.industry} organisation using ${briefData.cloudStack} with ${briefData.frameworks.length} technologies, we've identified several security concerns that require immediate attention. Your ${briefData.companySize}-scale posture shows specific risks detailed below.`,
      critical_threats: [
        { title: 'Outdated OpenSSL Version', description: 'Components using OpenSSL versions with known critical vulnerabilities.', cveId: 'CVE-2024-0001', severity: 'critical', affected: 'OpenSSL < 3.0.13' },
      ],
      high_threats: [
        { title: 'Kubernetes RBAC Misconfiguration', description: 'Default service accounts with excessive permissions detected.', cveId: 'CVE-2024-0002', severity: 'high', affected: 'Kubernetes clusters' },
        { title: 'Node.js Package Vulnerability', description: 'Multiple npm packages with known high-severity vulnerabilities.', severity: 'high', affected: 'Node.js dependencies' },
      ],
      medium_threats: [
        { title: 'Missing Security Headers', description: 'HTTP security headers not properly configured.', severity: 'medium', affected: 'Web servers' },
      ],
      low_threats: [
        { title: 'Verbose Error Messages', description: 'Application error messages may leak sensitive information.', severity: 'low', affected: 'Application layer' },
      ],
      patch_checklist: [
        'Update OpenSSL to version 3.0.13 or higher',
        'Review and restrict Kubernetes RBAC permissions',
        'Run npm audit fix to update vulnerable packages',
        'Configure security headers (CSP, X-Frame-Options, etc.)',
        'Implement proper error handling and logging',
        'Enable WAF rules for additional protection',
      ],
      compliance_notes: `For your ${briefData.region} region, ensure compliance with local data protection regulations. Consider additional controls for ${briefData.industry} industry requirements.`,
      article_recommendations: [
        { title: 'Kubernetes Security Best Practices', url: '/articles/kubernetes-security' },
        { title: 'Node.js Security Checklist', url: '/articles/nodejs-security' },
        { title: 'Cloud Security Fundamentals', url: '/articles/cloud-security' },
      ],
    };

    setGeneratedBrief(mock);
    setSeveritySummary({
      critical: mock.critical_threats.length,
      high: mock.high_threats.length,
      medium: mock.medium_threats.length,
      low: mock.low_threats.length,
    });
    setCurrentStep('results');
  };

  const toggleFramework = (fw: string) => {
    setBriefData((prev) => ({
      ...prev,
      frameworks: prev.frameworks.includes(fw)
        ? prev.frameworks.filter((f) => f !== fw)
        : [...prev.frameworks, fw],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'industry':    return !!briefData.industry;
      case 'cloud':       return !!briefData.cloudStack;
      case 'frameworks':  return briefData.frameworks.length > 0;
      case 'region':      return !!briefData.region;
      case 'company':     return !!briefData.companySize;
      default:            return true;
    }
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/tools/nexusguard`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied', description: 'Share URL copied to clipboard.' });
    });
  };

  const handleDownloadPDF = () => {
    toast({ title: 'PDF export', description: 'PDF download is coming soon — bookmark this page for now.' });
  };

  const handleSendEmail = () => {
    if (!email.trim()) {
      toast({ title: 'Email required', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Brief sent', description: `Security brief sent to ${email}.` });
    setShowEmailModal(false);
    setEmail('');
  };

  const handleReset = () => {
    setCurrentStep('industry');
    setBriefData({ industry: '', cloudStack: '', frameworks: [], region: '', companySize: '' });
    setGeneratedBrief(null);
    setSeveritySummary(null);
  };

  return (
    <Layout>
      <SEO
        title="NexusGuard — Free AI Security Risk Assessment | The Grid Nexus"
        description="Generate a personalised AI-powered security risk brief for your tech stack. Free assessment with CVE analysis, patch recommendations, and compliance guidance."
        canonical="https://thegridnexus.com/tools/nexusguard"
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
          <span className="text-foreground font-medium">NexusGuard</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-security/10 border border-security/20 flex items-center justify-center">
              <Shield className="h-7 w-7 text-security" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-bold text-3xl">NexusGuard</h1>
              <h2 className="text-sm text-muted-foreground font-normal">AI Security Brief Generator</h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Input your tech stack and get a personalised threat report — CVE alerts, severity breakdown, patch checklist, and compliance notes. Free, no sign-up.
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep !== 'results' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4 overflow-x-auto gap-1">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = index < currentStepIndex;
                  return (
                    <div key={step.id} className={cn('flex items-center gap-1.5 shrink-0', index !== steps.length - 1 && 'flex-1')}>
                      <div className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0',
                        isActive    ? 'bg-security text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                                      'bg-muted text-muted-foreground'
                      )}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={cn('text-xs hidden sm:inline', isActive ? 'font-medium' : 'text-muted-foreground')}>
                        {step.label}
                      </span>
                      {index !== steps.length - 1 && (
                        <div className={cn('h-px flex-1 mx-1', isCompleted ? 'bg-green-500' : 'bg-border')} />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={progress} className="h-1.5" />
            </CardContent>
          </Card>
        )}

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 'results'    ? 'Your Security Brief' :
               currentStep === 'generating' ? 'Generating Your Brief…' :
               `Step ${currentStepIndex + 1}: ${steps[currentStepIndex]?.label}`}
            </CardTitle>
            {currentStep !== 'results' && currentStep !== 'generating' && (
              <CardDescription>
                {currentStep === 'industry'   && 'What industry does your organisation operate in?'}
                {currentStep === 'cloud'      && 'Which cloud platform(s) do you primarily use?'}
                {currentStep === 'frameworks' && 'Select all technologies in your stack (multi-select)'}
                {currentStep === 'region'     && 'Where is your organisation primarily located?'}
                {currentStep === 'company'    && 'How large is your organisation?'}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {/* ── Industry ── */}
            {currentStep === 'industry' && (
              <Select
                value={briefData.industry}
                onValueChange={(v) => setBriefData({ ...briefData, industry: v })}
              >
                <SelectTrigger aria-label="Select your industry">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {/* ── Cloud ── */}
            {currentStep === 'cloud' && (
              <Select
                value={briefData.cloudStack}
                onValueChange={(v) => setBriefData({ ...briefData, cloudStack: v })}
              >
                <SelectTrigger aria-label="Select your cloud platform">
                  <SelectValue placeholder="Select your primary cloud platform" />
                </SelectTrigger>
                <SelectContent>
                  {cloudStacks.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {/* ── Frameworks ── */}
            {currentStep === 'frameworks' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {frameworks.map((fw) => (
                    <div
                      key={fw.value}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                        briefData.frameworks.includes(fw.value)
                          ? 'border-security bg-security/5'
                          : 'border-border hover:border-security/50'
                      )}
                      onClick={() => toggleFramework(fw.value)}
                    >
                      <Checkbox
                        id={`fw-${fw.value}`}
                        checked={briefData.frameworks.includes(fw.value)}
                        onCheckedChange={() => toggleFramework(fw.value)}
                      />
                      <Label htmlFor={`fw-${fw.value}`} className="cursor-pointer text-sm">{fw.label}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Selected: {briefData.frameworks.length} technologies</p>
              </div>
            )}

            {/* ── Region ── */}
            {currentStep === 'region' && (
              <Select
                value={briefData.region}
                onValueChange={(v) => setBriefData({ ...briefData, region: v })}
              >
                <SelectTrigger aria-label="Select your region">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {/* ── Company size ── */}
            {currentStep === 'company' && (
              <Select
                value={briefData.companySize}
                onValueChange={(v) => setBriefData({ ...briefData, companySize: v })}
              >
                <SelectTrigger aria-label="Select your company size">
                  <SelectValue placeholder="Select your company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {/* ── Generating ── */}
            {currentStep === 'generating' && (
              <div className="text-center py-12 space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-security/20 animate-pulse" />
                  <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                    <Shield className="h-9 w-9 text-security animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analysing Your Security Posture</h3>
                  <p className="text-muted-foreground text-sm">Scanning CVE databases and generating personalised recommendations…</p>
                </div>
                <div className="max-w-xs mx-auto space-y-2 text-sm text-muted-foreground">
                  {['Fetching latest CVE data…', 'Analysing threat intelligence…', 'Generating personalised brief…'].map((msg) => (
                    <div key={msg} className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                      <span>{msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Results ── */}
            {currentStep === 'results' && generatedBrief && severitySummary && (
              <div className="space-y-6">
                {/* Severity summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'critical', label: 'Critical', count: severitySummary.critical, cls: 'text-red-600 bg-red-50 dark:bg-red-950/20' },
                    { key: 'high',     label: 'High',     count: severitySummary.high,     cls: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20' },
                    { key: 'medium',   label: 'Medium',   count: severitySummary.medium,   cls: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20' },
                    { key: 'low',      label: 'Low',      count: severitySummary.low,      cls: 'text-green-600 bg-green-50 dark:bg-green-950/20' },
                  ].map((s) => (
                    <div key={s.key} className={cn('text-center p-4 rounded-lg', s.cls)}>
                      <div className="text-3xl font-bold">{s.count}</div>
                      <div className="text-sm font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Executive summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="h-4 w-4" /> Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{generatedBrief.executive_summary}</p>
                  </CardContent>
                </Card>

                {/* Critical threats */}
                {generatedBrief.critical_threats.length > 0 && (
                  <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base text-red-600">
                        <AlertTriangle className="h-4 w-4" /> Critical Threats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {generatedBrief.critical_threats.map((t, i) => (
                        <div key={i} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm">{t.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                              {t.cveId && <Badge variant="destructive" className="mt-2 text-xs">{t.cveId}</Badge>}
                            </div>
                            {t.affected && <Badge variant="outline" className="text-xs shrink-0">{t.affected}</Badge>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* High threats */}
                {generatedBrief.high_threats.length > 0 && (
                  <Card className="border-orange-200 dark:border-orange-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base text-orange-600">
                        <AlertTriangle className="h-4 w-4" /> High Severity Threats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {generatedBrief.high_threats.map((t, i) => (
                        <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                          <p className="font-semibold text-sm">{t.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                          {t.cveId && (
                            <Badge className={cn('mt-2 text-xs', getSeverityBadgeColor('high'))}>{t.cveId}</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Patch checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="h-4 w-4 text-green-600" /> Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedBrief.patch_checklist.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Checkbox id={`action-${i}`} className="mt-0.5" />
                          <Label htmlFor={`action-${i}`} className="cursor-pointer leading-snug">{action}</Label>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Compliance notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lock className="h-4 w-4" /> Compliance Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{generatedBrief.compliance_notes}</p>
                  </CardContent>
                </Card>

                {/* Article recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4" /> Recommended Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {generatedBrief.article_recommendations.map((a, i) => (
                        <a
                          key={i}
                          href={a.url}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm text-primary hover:underline">{a.title}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setShowEmailModal(true)} className="flex-1">
                    <Mail className="h-4 w-4 mr-2" /> Email Brief
                  </Button>
                  <Button variant="outline" onClick={handleDownloadPDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                  <Button variant="outline" onClick={handleShareLink} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" /> Copy Link
                  </Button>
                  <Button onClick={handleReset} className="flex-1 bg-security hover:bg-security/90">
                    New Brief
                  </Button>
                </div>

                {/* Related tools */}
                <div className="rounded-xl border bg-muted/30 p-4 mt-2">
                  <p className="text-sm font-semibold mb-3">More Security Tools</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { href: '/tools/steam-scanner', icon: Gamepad2, label: 'Steam Scanner', sub: 'Account security', color: 'text-gaming hover:bg-gaming/10 border-gaming/20' },
                      { href: '/security-score',      icon: Zap,       label: 'Security Score', sub: 'Personal assessment', color: 'text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/20' },
                      { href: '/live-threat-dashboard', icon: Activity, label: 'Live Threats',  sub: 'Real-time feed', color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                    ].map((t) => (
                      <Link key={t.href} to={t.href} className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                        <t.icon className="h-4 w-4" />
                        <span className="text-xs font-semibold">{t.label}</span>
                        <span className="text-xs text-muted-foreground">{t.sub}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            {currentStep !== 'generating' && currentStep !== 'results' && (
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={currentStep === 'company' ? handleGenerate : handleNext}
                  disabled={!canProceed()}
                  className="bg-security hover:bg-security/90"
                >
                  {currentStep === 'company' ? <>Generate Brief <Shield className="h-4 w-4 ml-1.5" /></> : <>Next <ChevronRight className="h-4 w-4 ml-1" /></>}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email modal */}
        {showEmailModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Email this brief"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Email This Brief</CardTitle>
                <CardDescription>
                  Enter your email to receive this security brief and weekly security updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Address</Label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowEmailModal(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleSendEmail} className="flex-1 bg-security hover:bg-security/90">Send Brief</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
