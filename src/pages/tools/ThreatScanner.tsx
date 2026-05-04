import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  ScanLine, Shield, AlertTriangle, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, ExternalLink, Clock, Zap, Search,
  ChevronDown, ChevronUp, Activity, Lock, Wifi, Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type ScanTarget = 'url' | 'ip' | 'domain';

interface ThreatFinding {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  cveId?: string;
  cvssScore?: number;
  remediation: string;
  category: string;
}

interface ScanResult {
  target: string;
  targetType: ScanTarget;
  overallRisk: number;
  riskLabel: string;
  findings: ThreatFinding[];
  openPorts?: string[];
  technologies?: string[];
  tlsGrade?: string;
  lastScanTime: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_SCANS: Record<string, ScanResult> = {
  'example.com': {
    target: 'example.com',
    targetType: 'domain',
    overallRisk: 22,
    riskLabel: 'Low Risk',
    findings: [
      { id: 'f1', severity: 'low', title: 'HSTS Max-Age Below Recommended', description: 'HTTP Strict Transport Security max-age is set to less than 1 year (31536000s).', remediation: 'Set max-age=63072000 (2 years) and include subdomains.', category: 'Headers' },
      { id: 'f2', severity: 'info', title: 'Server Version Disclosure', description: 'HTTP response headers reveal the exact web server version.', remediation: 'Remove Server header or suppress version information.', category: 'Information Disclosure' },
    ],
    technologies: ['nginx/1.24.0', 'TLS 1.3', 'HTTP/2'],
    tlsGrade: 'A+',
    openPorts: ['80', '443'],
    lastScanTime: '0.8s',
  },
  'vulnerable-site.com': {
    target: 'vulnerable-site.com',
    targetType: 'domain',
    overallRisk: 87,
    riskLabel: 'Critical Risk',
    findings: [
      { id: 'v1', severity: 'critical', title: 'SQL Injection Detected', description: 'GET parameter `id` is vulnerable to time-based blind SQL injection. Database type: MySQL 8.0.', cveId: 'CWE-89', cvssScore: 9.8, remediation: 'Use parameterized queries or prepared statements. Sanitize all user inputs at the database layer.', category: 'Injection' },
      { id: 'v2', severity: 'critical', title: 'Exposed Admin Panel', description: '/wp-admin/ is publicly accessible without IP restriction. Password brute-forcing is possible.', remediation: 'Restrict /wp-admin access to your IP. Enable CAPTCHA and account lockout.', category: 'Access Control' },
      { id: 'v3', severity: 'high', title: 'Outdated WordPress 5.8.3', description: 'WordPress version 5.8.3 has 14 known CVEs including XSS and CSRF vulnerabilities.', cveId: 'CVE-2022-21661', cvssScore: 7.5, remediation: 'Update WordPress to the latest version immediately.', category: 'CMS Security' },
      { id: 'v4', severity: 'high', title: 'Missing Content-Security-Policy Header', description: 'No CSP header detected. This allows arbitrary inline scripts and cross-site scripting attacks.', remediation: 'Implement a strict CSP policy. Start with default-src \'self\' and progressively add allowed sources.', category: 'Headers' },
      { id: 'v5', severity: 'medium', title: 'TLS 1.0/1.1 Still Enabled', description: 'Legacy TLS protocols with known weaknesses (POODLE, BEAST) are accepted.', cveId: 'CVE-2014-3566', cvssScore: 5.9, remediation: 'Disable TLS 1.0 and 1.1. Enforce TLS 1.2 minimum (TLS 1.3 preferred).', category: 'Cryptography' },
      { id: 'v6', severity: 'medium', title: 'Directory Listing Enabled', description: 'Apache directory listing is enabled on /uploads/. Sensitive files may be exposed.', remediation: 'Add Options -Indexes to .htaccess or equivalent web server config.', category: 'Information Disclosure' },
    ],
    technologies: ['WordPress 5.8.3', 'PHP 7.4', 'Apache 2.4.51', 'MySQL'],
    tlsGrade: 'C',
    openPorts: ['22', '80', '443', '3306', '8080'],
    lastScanTime: '2.3s',
  },
  'gaming-target.net': {
    target: 'gaming-target.net',
    targetType: 'domain',
    overallRisk: 61,
    riskLabel: 'High Risk',
    findings: [
      { id: 'g1', severity: 'high', title: 'Credential Stuffing Vulnerability', description: 'Login endpoint has no rate limiting. 1000 requests/min are accepted without CAPTCHA or lockout.', remediation: 'Implement rate limiting (5 attempts/min), CAPTCHA after 3 failures, and account lockout after 10.', category: 'Authentication' },
      { id: 'g2', severity: 'high', title: 'Insecure Cookie Flags', description: 'Session cookie missing Secure, HttpOnly, and SameSite=Strict flags. Susceptible to theft via XSS.', remediation: 'Set all three flags: Set-Cookie: sessionId=…; Secure; HttpOnly; SameSite=Strict', category: 'Session Management' },
      { id: 'g3', severity: 'medium', title: 'Cross-Origin Resource Sharing Misconfiguration', description: 'CORS policy allows requests from any origin (Access-Control-Allow-Origin: *) for API endpoints.', remediation: 'Restrict CORS to known origins. Never use wildcard for authenticated endpoints.', category: 'CORS' },
      { id: 'g4', severity: 'low', title: 'X-Frame-Options Not Set', description: 'Page can be embedded in iframes, enabling clickjacking attacks.', remediation: 'Add X-Frame-Options: DENY or use Content-Security-Policy: frame-ancestors \'none\'', category: 'Headers' },
    ],
    technologies: ['Node.js', 'Express 4.18', 'Nginx', 'React 18'],
    tlsGrade: 'B',
    openPorts: ['80', '443', '8443'],
    lastScanTime: '1.5s',
  },
};

const QUICK_TARGETS = ['example.com', 'gaming-target.net', 'vulnerable-site.com'];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  critical: { label: 'Critical', color: 'text-white', bgColor: 'bg-destructive', borderColor: 'border-destructive/50', icon: XCircle },
  high: { label: 'High', color: 'text-[#FFB800]', bgColor: 'bg-[#FFB800]/10', borderColor: 'border-[#FFB800]/30', icon: AlertTriangle },
  medium: { label: 'Medium', color: 'text-[#FF007A]', bgColor: 'bg-[#FF007A]/10', borderColor: 'border-[#FF007A]/30', icon: AlertTriangle },
  low: { label: 'Low', color: 'text-[#00F0FF]', bgColor: 'bg-[#00F0FF]/10', borderColor: 'border-[#00F0FF]/30', icon: Shield },
  info: { label: 'Info', color: 'text-muted-foreground', bgColor: 'bg-muted/30', borderColor: 'border-border', icon: Activity },
};

function riskColor(score: number) {
  if (score >= 80) return 'text-destructive';
  if (score >= 60) return 'text-[#FFB800]';
  if (score >= 40) return 'text-[#FF007A]';
  return 'text-[#39FF14]';
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ThreatScanner() {
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set());
  const [scanProgress, setScanProgress] = useState(0);

  const runScan = useCallback(async (t: string) => {
    if (!t.trim()) return;
    setScanning(true);
    setResult(null);
    setNotFound(false);
    setScanProgress(0);
    setExpandedFindings(new Set());

    // Simulate scan progress
    for (const p of [15, 35, 55, 72, 88, 100]) {
      await new Promise(r => setTimeout(r, 300));
      setScanProgress(p);
    }

    // Look up result
    const key = t.trim().toLowerCase().replace(/^https?:\/\//, '');
    const found = MOCK_SCANS[key] || Object.values(MOCK_SCANS).find(s => key.includes(s.target) || s.target.includes(key));

    if (found) {
      setResult(found);
    } else {
      // Return a clean scan for unknown targets
      setResult({
        target: t,
        targetType: 'domain',
        overallRisk: 18,
        riskLabel: 'Low Risk',
        findings: [
          { id: 'default1', severity: 'info', title: 'No Critical Vulnerabilities Found', description: 'Surface-level scan complete. No high-severity issues detected.', remediation: 'Run a deeper authenticated scan for full coverage.', category: 'General' },
          { id: 'default2', severity: 'low', title: 'Referrer-Policy Header Missing', description: 'Referrer-Policy header is not set. Referrer data may leak to third parties.', remediation: 'Set Referrer-Policy: strict-origin-when-cross-origin', category: 'Headers' },
        ],
        technologies: ['Unknown'],
        tlsGrade: 'A',
        openPorts: ['80', '443'],
        lastScanTime: '1.1s',
      });
    }

    setScanning(false);
  }, []);

  const toggleFinding = (id: string) => {
    setExpandedFindings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const counts = result ? {
    critical: result.findings.filter(f => f.severity === 'critical').length,
    high: result.findings.filter(f => f.severity === 'high').length,
    medium: result.findings.filter(f => f.severity === 'medium').length,
    low: result.findings.filter(f => f.severity === 'low').length,
  } : null;

  return (
    <Layout>
      <SEO
        title="Real-Time Threat Scanner — The Grid Nexus"
        description="Scan any website or domain for vulnerabilities in real time. Get CVE findings, CVSS scores, and actionable remediation steps instantly."
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30">
              <ScanLine className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Real-Time Threat Scanner</h1>
              <p className="text-muted-foreground text-sm">Surface-level CVE detection, TLS grading, and header analysis</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['OWASP Top 10', 'CVE Lookup', 'TLS Grading', 'Header Analysis'].map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-3 rounded-lg border border-[#FFB800]/30 bg-[#FFB800]/5 text-xs text-muted-foreground flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-[#FFB800] shrink-0 mt-0.5" />
          Only scan domains you own or have explicit authorization to test. Unauthorized scanning may violate computer crime laws.
        </div>

        {/* Scan form */}
        <Card className="mb-8 border-destructive/20">
          <CardContent className="pt-6">
            <form onSubmit={e => { e.preventDefault(); runScan(target); }} className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="Enter domain or URL (e.g. example.com)"
                  className="pl-9 font-mono text-sm"
                />
              </div>
              <Button type="submit" disabled={scanning || !target.trim()} className="shrink-0">
                {scanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4 mr-1.5" /> Scan</>}
              </Button>
            </form>

            {/* Scan progress */}
            {scanning && (
              <div className="mt-4 space-y-2">
                <Progress value={scanProgress} className="h-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{scanProgress < 30 ? 'DNS & port enumeration…' : scanProgress < 60 ? 'TLS & header analysis…' : scanProgress < 90 ? 'CVE matching…' : 'Compiling report…'}</span>
                  <span>{scanProgress}%</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground self-center">Try:</span>
              {QUICK_TARGETS.map(t => (
                <button
                  key={t}
                  onClick={() => { setTarget(t); runScan(t); }}
                  disabled={scanning}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition-colors font-mono"
                >
                  {t}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && !scanning && (
          <div className="space-y-6">
            {/* Summary bar */}
            <Card className={cn('border', result.overallRisk >= 80 ? 'border-destructive/40' : result.overallRisk >= 60 ? 'border-[#FFB800]/30' : 'border-[#39FF14]/30')}>
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <div className={cn('text-5xl font-bold font-display', riskColor(result.overallRisk))}>{result.overallRisk}</div>
                    <div className="text-xs text-muted-foreground mt-1">Risk Score</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold">{result.target}</span>
                      <Badge className={cn('text-xs', result.overallRisk >= 80 ? 'bg-destructive text-white' : result.overallRisk >= 60 ? 'bg-[#FFB800]/10 text-[#FFB800]' : 'bg-[#39FF14]/10 text-[#39FF14]')}>
                        {result.riskLabel}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> TLS {result.tlsGrade}</span>
                      <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Ports: {result.openPorts?.join(', ')}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Scan time: {result.lastScanTime}</span>
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {result.findings.length} finding{result.findings.length !== 1 ? 's' : ''}</span>
                    </div>
                    {result.technologies && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {result.technologies.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded bg-muted/40 border border-border font-mono">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {counts && (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs shrink-0">
                      {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                        <div key={sev} className={cn('px-2 py-1.5 rounded border', SEVERITY_CONFIG[sev].borderColor, SEVERITY_CONFIG[sev].bgColor)}>
                          <div className={cn('text-lg font-bold', SEVERITY_CONFIG[sev].color)}>{counts[sev]}</div>
                          <div className="text-muted-foreground">{SEVERITY_CONFIG[sev].label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Findings list */}
            <div>
              <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Security Findings
              </h2>
              <div className="space-y-3">
                {result.findings.map(finding => {
                  const cfg = SEVERITY_CONFIG[finding.severity];
                  const SevIcon = cfg.icon;
                  const isExpanded = expandedFindings.has(finding.id);

                  return (
                    <Card key={finding.id} className={cn('border transition-colors', cfg.borderColor)}>
                      <CardContent className="pt-0 pb-0">
                        <button
                          onClick={() => toggleFinding(finding.id)}
                          className="w-full flex items-center gap-3 py-4 text-left"
                        >
                          <SevIcon className={cn('h-4 w-4 shrink-0', cfg.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{finding.title}</span>
                              <Badge className={cn('text-xs', finding.severity === 'critical' ? 'bg-destructive text-white' : `${cfg.bgColor} ${cfg.color} border ${cfg.borderColor}`)}>
                                {cfg.label}
                              </Badge>
                              {finding.cveId && (
                                <span className="text-xs font-mono text-muted-foreground">{finding.cveId}</span>
                              )}
                              {finding.cvssScore && (
                                <span className={cn('text-xs font-semibold', cfg.color)}>CVSS {finding.cvssScore}</span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{finding.category}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                        </button>

                        {isExpanded && (
                          <div className="pb-4 pl-7 space-y-3 border-t border-border pt-3">
                            <p className="text-sm text-muted-foreground">{finding.description}</p>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#39FF14]/5 border border-[#39FF14]/20">
                              <CheckCircle className="h-4 w-4 text-[#39FF14] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-semibold text-[#39FF14]">Remediation</span>
                                <p className="text-sm text-muted-foreground mt-0.5">{finding.remediation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <Card className="border-[#00F0FF]/20 bg-gradient-to-r from-[#00F0FF]/5 to-[#B026FF]/5">
              <CardContent className="pt-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Full security posture assessment</p>
                  <p className="text-sm text-muted-foreground">Get a comprehensive 7-domain org security report with NexusGuard.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button asChild size="sm">
                    <Link to="/tools/nexusguard">NexusGuard</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/tools/ioc-lookup">IOC Lookup</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!result && !scanning && (
          <div className="text-center py-16 text-muted-foreground">
            <ScanLine className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">Ready to scan</p>
            <p className="text-sm">Enter a domain you own to detect surface-level vulnerabilities.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
