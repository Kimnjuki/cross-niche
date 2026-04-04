/**
 * NexusGuard - AI Security Brief Generator
 * 
 * Users input their tech stack, industry, region, and company size.
 * The tool generates a personalized security risk brief with severity ratings,
 * affected components, patch recommendations, and direct links to relevant articles.
 */

import { useState } from 'react';
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
import {
  Checkbox
} from '@/components/ui/checkbox';
import {
  Shield,
  AlertTriangle,
  AlertCircle,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

// Options for the wizard
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
  { value: 'startup', label: 'Startup (1-50 employees)' },
  { value: 'small', label: 'Small Business (51-200 employees)' },
  { value: 'medium', label: 'Medium Enterprise (201-1000 employees)' },
  { value: 'large', label: 'Large Enterprise (1000+ employees)' },
];

type Step = 'industry' | 'cloud' | 'frameworks' | 'region' | 'company' | 'generating' | 'results';

interface BriefData {
  industry: string;
  cloudStack: string;
  frameworks: string[];
  region: string;
  companySize: string;
}

interface SeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
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

export default function NexusGuardPage() {
  const [currentStep, setCurrentStep] = useState<Step>('industry');
  const [briefData, setBriefData] = useState<BriefData>({
    industry: '',
    cloudStack: '',
    frameworks: [],
    region: '',
    companySize: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);
  const [severitySummary, setSeveritySummary] = useState<SeveritySummary | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'industry', label: 'Industry', icon: Building },
    { id: 'cloud', label: 'Cloud Stack', icon: Cloud },
    { id: 'frameworks', label: 'Technologies', icon: Code },
    { id: 'region', label: 'Region', icon: Globe },
    { id: 'company', label: 'Company Size', icon: Users },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: Step[] = ['industry', 'cloud', 'frameworks', 'region', 'company', 'generating'];
    const nextIndex = stepOrder.indexOf(currentStep) + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['industry', 'cloud', 'frameworks', 'region', 'company'];
    const prevIndex = stepOrder.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleGenerate = async () => {
    setCurrentStep('generating');
    setIsGenerating(true);

    // Simulate API call (in production, this would call the Convex action)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock response for demonstration
    const mockBrief: GeneratedBrief = {
      executive_summary: `Based on your ${briefData.industry} organization using ${briefData.cloudStack} with ${briefData.frameworks.length} technologies, we've identified several security concerns that require immediate attention. Your security posture shows ${briefData.companySize}-specific risks that need to be addressed.`,
      critical_threats: [
        {
          title: 'Outdated OpenSSL Version',
          description: 'Your stack includes components using OpenSSL versions with known critical vulnerabilities.',
          cveId: 'CVE-2024-0001',
          severity: 'critical',
          affected: 'OpenSSL < 3.0.13',
        },
      ],
      high_threats: [
        {
          title: 'Kubernetes RBAC Misconfiguration',
          description: 'Default service accounts with excessive permissions detected.',
          cveId: 'CVE-2024-0002',
          severity: 'high',
          affected: 'Kubernetes clusters',
        },
        {
          title: 'Node.js Package Vulnerability',
          description: 'Multiple npm packages with known high-severity vulnerabilities.',
          severity: 'high',
          affected: 'Node.js dependencies',
        },
      ],
      medium_threats: [
        {
          title: 'Missing Security Headers',
          description: 'HTTP security headers not properly configured.',
          severity: 'medium',
          affected: 'Web servers',
        },
      ],
      low_threats: [
        {
          title: 'Verbose Error Messages',
          description: 'Application error messages may leak sensitive information.',
          severity: 'low',
          affected: 'Application layer',
        },
      ],
      patch_checklist: [
        'Update OpenSSL to version 3.0.13 or higher',
        'Review and restrict Kubernetes RBAC permissions',
        'Run npm audit fix to update vulnerable packages',
        'Configure security headers (CSP, X-Frame-Options, etc.)',
        'Implement proper error handling and logging',
        'Enable WAF rules for additional protection',
      ],
      compliance_notes: `For ${briefData.region} region, ensure compliance with local data protection regulations. Consider implementing additional controls for ${briefData.industry} industry requirements.`,
      article_recommendations: [
        { title: 'Kubernetes Security Best Practices', url: '/articles/kubernetes-security' },
        { title: 'Node.js Security Checklist', url: '/articles/nodejs-security' },
        { title: 'Cloud Security Fundamentals', url: '/articles/cloud-security' },
      ],
    };

    setGeneratedBrief(mockBrief);
    setSeveritySummary({
      critical: mockBrief.critical_threats.length,
      high: mockBrief.high_threats.length,
      medium: mockBrief.medium_threats.length,
      low: mockBrief.low_threats.length,
    });
    setShareToken('mock-share-token-123');
    setIsGenerating(false);
    setCurrentStep('results');
  };

  const toggleFramework = (framework: string) => {
    setBriefData((prev) => ({
      ...prev,
      frameworks: prev.frameworks.includes(framework)
        ? prev.frameworks.filter((f) => f !== framework)
        : [...prev.frameworks, framework],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'industry':
        return !!briefData.industry;
      case 'cloud':
        return !!briefData.cloudStack;
      case 'frameworks':
        return briefData.frameworks.length > 0;
      case 'region':
        return !!briefData.region;
      case 'company':
        return !!briefData.companySize;
      default:
        return true;
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityBadgeColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Helmet>
        <title>NexusGuard - Free AI Security Risk Assessment Tool | The Grid Nexus</title>
        <meta
          name="description"
          content="Generate a personalized AI-powered security risk brief for your tech stack. Free security assessment tool with CVE analysis, patch recommendations, and compliance guidance."
        />
        <meta
          name="keywords"
          content="free security risk assessment tool, AI cybersecurity brief generator, CVE alert by tech stack, security posture report generator free"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'NexusGuard Security Brief Generator',
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList:
              'AI-powered security analysis, CVE tracking, Personalized recommendations, Compliance guidance',
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">NexusGuard</h1>
              <p className="text-sm text-muted-foreground">AI Security Brief Generator</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get a personalized security risk assessment powered by AI. Input your tech stack and
            receive actionable insights, CVE alerts, and patch recommendations.
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep !== 'results' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={cn('flex items-center gap-2', index !== steps.length - 1 && 'flex-1')}
                    >
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-sm hidden md:inline',
                          isActive ? 'font-medium' : 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </span>
                      {index !== steps.length - 1 && (
                        <div
                          className={cn(
                            'h-0.5 flex-1 mx-2',
                            isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 'results'
                ? 'Your Security Brief'
                : currentStep === 'generating'
                ? 'Generating Your Brief...'
                : `Step ${currentStepIndex + 1}: Select your ${steps[currentStepIndex]?.label.toLowerCase()}`}
            </CardTitle>
            {currentStep !== 'results' && currentStep !== 'generating' && (
              <CardDescription>
                {currentStep === 'industry' && 'What industry does your organization operate in?'}
                {currentStep === 'cloud' && 'Which cloud platform(s) do you use?'}
                {currentStep === 'frameworks' && 'Select all technologies in your stack (multi-select)'}
                {currentStep === 'region' && 'Where is your organization primarily located?'}
                {currentStep === 'company' && 'How large is your organization?'}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* Industry Selection */}
            {currentStep === 'industry' && (
              <div className="space-y-4">
                <Select
                  value={briefData.industry}
                  onValueChange={(value) => setBriefData({ ...briefData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Cloud Stack Selection */}
            {currentStep === 'cloud' && (
              <div className="space-y-4">
                <Select
                  value={briefData.cloudStack}
                  onValueChange={(value) => setBriefData({ ...briefData, cloudStack: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary cloud platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {cloudStacks.map((stack) => (
                      <SelectItem key={stack.value} value={stack.value}>
                        {stack.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Frameworks Selection */}
            {currentStep === 'frameworks' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {frameworks.map((framework) => (
                    <div
                      key={framework.value}
                      className={cn(
                        'flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors',
                        briefData.frameworks.includes(framework.value)
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      )}
                      onClick={() => toggleFramework(framework.value)}
                    >
                      <Checkbox
                        checked={briefData.frameworks.includes(framework.value)}
                        onCheckedChange={() => toggleFramework(framework.value)}
                      />
                      <Label className="cursor-pointer text-sm">{framework.label}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {briefData.frameworks.length} technologies
                </p>
              </div>
            )}

            {/* Region Selection */}
            {currentStep === 'region' && (
              <div className="space-y-4">
                <Select
                  value={briefData.region}
                  onValueChange={(value) => setBriefData({ ...briefData, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Company Size Selection */}
            {currentStep === 'company' && (
              <div className="space-y-4">
                <Select
                  value={briefData.companySize}
                  onValueChange={(value) => setBriefData({ ...briefData, companySize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Generating State */}
            {currentStep === 'generating' && (
              <div className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse" />
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-cyan-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Security Posture</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI is scanning CVE databases, threat intelligence feeds, and generating
                  personalized recommendations...
                </p>
                <div className="max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching latest CVE data...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing threat intelligence...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating personalized brief...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {currentStep === 'results' && generatedBrief && severitySummary && (
              <div className="space-y-6">
                {/* Severity Summary */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="text-3xl font-bold text-red-600">{severitySummary.critical}</div>
                    <div className="text-sm text-red-600">Critical</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <div className="text-3xl font-bold text-orange-600">{severitySummary.high}</div>
                    <div className="text-sm text-orange-600">High</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="text-3xl font-bold text-yellow-600">{severitySummary.medium}</div>
                    <div className="text-sm text-yellow-600">Medium</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="text-3xl font-bold text-green-600">{severitySummary.low}</div>
                    <div className="text-sm text-green-600">Low</div>
                  </div>
                </div>

                {/* Executive Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{generatedBrief.executive_summary}</p>
                  </CardContent>
                </Card>

                {/* Threats */}
                {generatedBrief.critical_threats.length > 0 && (
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Critical Threats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generatedBrief.critical_threats.map((threat, i) => (
                          <div key={i} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{threat.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {threat.description}
                                </p>
                                {threat.cveId && (
                                  <Badge className="mt-2" variant="destructive">
                                    {threat.cveId}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {generatedBrief.high_threats.length > 0 && (
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        High Severity Threats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generatedBrief.high_threats.map((threat, i) => (
                          <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                            <h4 className="font-semibold">{threat.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {threat.description}
                            </p>
                            {threat.cveId && (
                              <Badge className="mt-2 bg-orange-100 text-orange-800">
                                {threat.cveId}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Patch Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedBrief.patch_checklist.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-500"
                          />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Compliance Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Compliance Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{generatedBrief.compliance_notes}</p>
                  </CardContent>
                </Card>

                {/* Article Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recommended Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatedBrief.article_recommendations.map((article, i) => (
                        <a
                          key={i}
                          href={article.url}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-primary hover:underline">{article.title}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmailModal(true)}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email This Brief
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Download as PDF (in production, use a PDF library)
                      alert('PDF download would be implemented here');
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/tools/nexusguard/${shareToken}`
                      );
                    }}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep('industry');
                      setBriefData({
                        industry: '',
                        cloudStack: '',
                        frameworks: [],
                        region: '',
                        companySize: '',
                      });
                    }}
                    className="flex-1"
                  >
                    New Brief
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 'generating' && currentStep !== 'results' && (
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={currentStep === 'company' ? handleGenerate : handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  {currentStep === 'company' ? (
                    <>
                      Generate Brief
                      <Shield className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Email This Brief</CardTitle>
                <CardDescription>
                  Enter your email to receive this security brief and subscribe to our
                  weekly security updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In production, call the Convex mutation to save email
                      alert('Brief sent to ' + email);
                      setShowEmailModal(false);
                    }}
                    className="flex-1"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}