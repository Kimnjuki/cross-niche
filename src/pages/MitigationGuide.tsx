import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Cpu, HardDrive, Network } from 'lucide-react';
import { NexusScoreBadge } from '@/components/nexus/NexusScoreBadge';
import { SEOHead } from '@/components/seo/SEOHead';

const hardwareIcons = {
  cpu: Cpu,
  gpu: HardDrive,
  network: Network,
  storage: HardDrive,
};

// Mock mitigation guides - in production, these would come from the database
const mitigationGuides: Record<string, {
  id: string;
  title: string;
  threatTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedHardware: ('cpu' | 'gpu' | 'network' | 'storage')[];
  nexusScore: number;
  steps: Array<{ title: string; description: string; hardware?: string }>;
  prevention: string[];
  relatedThreats: string[];
}> = {
  'gpu-vram-protection': {
    id: 'gpu-vram-protection',
    title: 'GPU VRAM Protection Guide',
    threatTitle: 'GPU Side-Channel Attack: VRAM Data Leak',
    severity: 'critical',
    affectedHardware: ['gpu'],
    nexusScore: 5,
    steps: [
      {
        title: 'Update GPU Drivers',
        description: 'Install the latest GPU drivers from your manufacturer (NVIDIA, AMD, Intel). These updates include security patches for VRAM vulnerabilities.',
        hardware: 'gpu',
      },
      {
        title: 'Enable Browser Security Features',
        description: 'Enable hardware-accelerated GPU sandboxing in your browser settings. Chrome/Edge: chrome://flags/#enable-gpu-sandbox',
        hardware: 'gpu',
      },
      {
        title: 'Limit WebGPU Access',
        description: 'Disable WebGPU API in browser settings if not needed for your workflow. This prevents websites from accessing GPU resources.',
        hardware: 'gpu',
      },
      {
        title: 'Monitor GPU Memory Usage',
        description: 'Use GPU monitoring tools to detect unusual memory access patterns that might indicate an attack.',
        hardware: 'gpu',
      },
    ],
    prevention: [
      'Keep GPU drivers updated automatically',
      'Use browser extensions that block unnecessary GPU access',
      'Avoid visiting untrusted websites while gaming',
      'Enable browser privacy mode for sensitive browsing',
    ],
    relatedThreats: ['WebGPU Exploits', 'Side-Channel Attacks', 'Memory Leaks'],
  },
  'router-security-update': {
    id: 'router-security-update',
    title: 'Router Security Hardening Guide',
    threatTitle: 'Router Firmware Zero-Day Vulnerability',
    severity: 'high',
    affectedHardware: ['network'],
    nexusScore: 4,
    steps: [
      {
        title: 'Update Router Firmware',
        description: 'Log into your router admin panel and check for firmware updates. Apply the latest security patches immediately.',
        hardware: 'network',
      },
      {
        title: 'Change Default Credentials',
        description: 'Change the default admin username and password. Use a strong, unique password.',
        hardware: 'network',
      },
      {
        title: 'Enable WPA3 Encryption',
        description: 'Upgrade your Wi-Fi security to WPA3 if your router supports it. This provides stronger encryption.',
        hardware: 'network',
      },
      {
        title: 'Disable Remote Management',
        description: 'Disable remote management features unless absolutely necessary. This prevents external access to your router.',
        hardware: 'network',
      },
    ],
    prevention: [
      'Enable automatic firmware updates',
      'Use a network firewall',
      'Regularly audit connected devices',
      'Enable MAC address filtering',
    ],
    relatedThreats: ['Router Exploits', 'Network Intrusions', 'DNS Hijacking'],
  },
  'account-security-hardening': {
    id: 'account-security-hardening',
    title: 'Gaming Account Security Hardening',
    threatTitle: 'Gaming Platform Data Breach',
    severity: 'high',
    affectedHardware: ['network'],
    nexusScore: 4,
    steps: [
      {
        title: 'Enable Two-Factor Authentication',
        description: 'Enable 2FA on all gaming accounts (Steam, Epic, Xbox, PlayStation, etc.). Use an authenticator app, not SMS.',
        hardware: 'network',
      },
      {
        title: 'Use Unique Passwords',
        description: 'Create strong, unique passwords for each gaming platform. Use a password manager.',
        hardware: 'network',
      },
      {
        title: 'Review Account Activity',
        description: 'Regularly check your account activity logs for suspicious logins or purchases.',
        hardware: 'network',
      },
      {
        title: 'Enable Login Notifications',
        description: 'Enable email/SMS notifications for new device logins to detect unauthorized access immediately.',
        hardware: 'network',
      },
    ],
    prevention: [
      'Never share account credentials',
      'Avoid phishing emails and fake game websites',
      'Use a VPN when gaming on public networks',
      'Regularly update account recovery information',
    ],
    relatedThreats: ['Account Takeover', 'Credential Stuffing', 'Phishing'],
  },
};

export default function MitigationGuide() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? mitigationGuides[slug] : null;

  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The mitigation guide you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/guides">Browse All Guides</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const HardwareIcon = guide.affectedHardware[0] ? hardwareIcons[guide.affectedHardware[0]] : Shield;

  return (
    <Layout showThreatSidebar>
      <SEOHead
        title={guide.title}
        description={`Mitigation guide for ${guide.threatTitle}. Step-by-step instructions to protect your ${guide.affectedHardware.join(', ')} hardware.`}
        difficultyLevel="intermediate"
        keywords={[...guide.affectedHardware, 'security', 'mitigation', 'hardware protection']}
        section="Security"
      />
      <div className="container mx-auto px-4 py-8">
        <Link to="/security" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Security
        </Link>

        <div className="max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <HardwareIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{guide.title}</h1>
                <p className="text-muted-foreground">Nexus Mitigation Guide</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <NexusScoreBadge nexusScore={guide.nexusScore} variant="default" />
              <Badge variant={guide.severity === 'critical' ? 'destructive' : 'secondary'}>
                {guide.severity.toUpperCase()} Threat
              </Badge>
              {guide.affectedHardware.map((hw) => {
                const Icon = hardwareIcons[hw];
                return (
                  <Badge key={hw} variant="outline" className="gap-1">
                    <Icon className="h-3 w-3" />
                    {hw.toUpperCase()}
                  </Badge>
                );
              })}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Threat Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">{guide.threatTitle}</p>
                <p className="text-muted-foreground">
                  This guide provides step-by-step instructions to mitigate the security threat 
                  affecting your {guide.affectedHardware.join(' and ')} hardware.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mitigation Steps</CardTitle>
              <CardDescription>
                Follow these steps in order to protect your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {guide.steps.map((step, index) => {
                  const StepIcon = step.hardware ? hardwareIcons[step.hardware as keyof typeof hardwareIcons] : Shield;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{step.title}</h3>
                          {step.hardware && (
                            <Badge variant="outline" className="gap-1">
                              <StepIcon className="h-3 w-3" />
                              {step.hardware.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Prevention Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guide.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Related Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.relatedThreats.map((threat) => (
                    <Badge key={threat} variant="outline">
                      {threat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link to="/security">View All Security Alerts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/guides">Browse More Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}



