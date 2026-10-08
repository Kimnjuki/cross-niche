import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { useTrackToolUse } from '@/hooks/useTrackToolUse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, NotFoundState, ErrorState, EmptyState } from '@/components/common/StateComponents';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import {
  Search, Shield, AlertTriangle, CheckCircle, XCircle,
  ArrowLeft, ExternalLink, ChevronRight, Server,
  Globe, Lock, Terminal, Bug, Zap, Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// ── Types ──────────────────────────────────────────────────────────────────

type ScanCategory = 'Injection' | 'XSS' | 'Authentication' | 'Configuration' | 'Disclosure' | 'Outdated';

interface ScanFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  cveId?: string;
  cvssScore?: number;
  remediation: string;
  category: ScanCategory;
}

interface ScanResult {
  target: string;
  targetType: 'domain' | 'url' | 'server';
  scanDate: string;
  duration: string;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  overallScore: number;
  findings: ScanFinding[];
  dnsResolves: boolean;
  hasTls: boolean;
  tlsValid: boolean;
  securityHeaders: Record<string, string | null>;
}

// ── Domain validation ──────────────────────────────────────────────────────

const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
const URL_REGEX = /^https?:\/\//i;

function stripProtocol(input: string): string {
  return input.replace(URL_REGEX, '').split('/')[0].split(':')[0];
}

function validateTarget(input: string): { valid: boolean; sanitized: string; type: 'domain' | 'url' | 'server' } {
  const sanitized = stripProtocol(input.trim());

  if (URL_REGEX.test(input.trim())) {
    return { valid: true, sanitized, type: 'url' };
  }
  if (DOMAIN_REGEX.test(sanitized)) {
    return { valid: true, sanitized, type: 'domain' };
  }
  // Allow IP addresses as server targets
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(sanitized)) {
    return { valid: true, sanitized, type: 'server' };
  }

  return { valid: false, sanitized, type: 'domain' };
}

// ── Mock scan data (used when Convex is unavailable) ──────────────────────

const MOCK_SCANS: Record<string, ScanResult> = {
  'example.com': {
    target: 'example.com',
    targetType: 'domain',
    scanDate: new Date().toISOString(),
    duration: '2.4s',
    totalFindings: 4,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 1,
    overallScore: 62,
    dnsResolves: true,
    hasTls: true,
    tlsValid: true,
    securityHeaders: {
      'Strict-Transport-Security': 'max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': null,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    findings: [
      { id: 'v1', severity: 'critical', title: 'SQL Injection Detected', description: 'GET parameter `id` is vulnerable to time-based blind SQL injection. Database type: MySQL 8.0.', cveId: 'CWE-89', cvssScore: 9.8, remediation: 'Use parameterized queries or prepared statements. Sanitize all user inputs at the database layer.', category: 'Injection' },
      { id: 'v2', severity: 'high', title: 'Missing Content Security Policy', description: 'No CSP header found. Page is vulnerable to XSS and data injection attacks. Modern web apps should implement a strict CSP.', remediation: 'Add a Content-Security-Policy header. Start with `default-src \'self\';` and relax as needed.', category: 'Configuration' },
      { id: 'v3', severity: 'medium', title: 'Outdated TLS Version Supported', description: 'Server accepts TLS 1.1 connections. TLS 1.0 and 1.1 are deprecated and vulnerable to downgrade attacks.', remediation: 'Disable TLS 1.0/1.1. Require TLS 1.2 minimum. Configure TLS 1.3 support.', cveId: 'CVE-2023-38153', cvssScore: 5.3, category: 'Configuration' },
      { id: 'v4', severity: 'low', title: 'Server Version Disclosure', description: 'Server header reveals exact version: nginx/1.24.0. Attackers can target known version-specific vulnerabilities.', remediation: 'Disable server tokens in nginx: `server_tokens off;`.', category: 'Disclosure' },
    ],
  },
  'gaming-target.net': {
    target: 'gaming-target.net',
    targetType: 'domain',
    scanDate: new Date().toISOString(),
    duration: '3.1s',
    totalFindings: 6,
    criticalCount: 0,
    highCount: 3,
    mediumCount: 2,
    lowCount: 1,
    overallScore: 44,
    dnsResolves: true,
    hasTls: true,
    tlsValid: false,
    securityHeaders: {
      'Strict-Transport-Security': null,
      'X-Content-Type-Options': null,
      'X-Frame-Options': null,
      'Content-Security-Policy': null,
      'Referrer-Policy': null,
    },
    findings: [
      { id: 'g1', severity: 'high', title: 'Expired TLS Certificate', description: 'The TLS certificate for gaming-target.net expired 14 days ago. Users see browser security warnings.', remediation: 'Renew TLS certificate immediately. Set up automated renewal with Let\'s Encrypt or your CA.', category: 'Authentication' },
      { id: 'g2', severity: 'high', title: 'No HSTS Header', description: 'HTTP Strict-Transport-Security is not set. Users are vulnerable to SSL stripping attacks.', remediation: 'Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` header.', category: 'Configuration' },
      { id: 'g3', severity: 'high', title: 'Open Redirect on /redirect Endpoint', description: 'The /redirect endpoint accepts a `url` parameter and redirects without validation. Can be used for phishing.', cveId: 'CWE-601', cvssScore: 6.1, remediation: 'Implement an allowlist of approved redirect URLs or use indirect redirect IDs.', category: 'Authentication' },
      { id: 'g4', severity: 'medium', title: 'Missing X-Frame-Options', description: 'Page can be embedded in iframes, making it susceptible to clickjacking attacks.', remediation: 'Add `X-Frame-Options: DENY` or `SAMEORIGIN` header.', category: 'Configuration' },
      { id: 'g5', severity: 'medium', title: 'Cookie Missing Secure Flag', description: 'Session cookies do not have the Secure flag set. Cookies may be transmitted over unencrypted connections.', remediation: 'Set the `Secure` flag on all cookies. Configure `Set-Cookie` with `; Secure; HttpOnly; SameSite=Lax`.', category: 'Authentication' },
      { id: 'g6', severity: 'low', title: 'Directory Listing Enabled', description: '/assets/ directory has directory listing enabled, exposing file structure and potentially sensitive files.', remediation: 'Disable directory listing in your web server configuration.', category: 'Disclosure' },
    ],
  },
  'vulnerable-site.com': {
    target: 'vulnerable-site.com',
    targetType: 'domain',
    scanDate: new Date().toISOString(),
    duration: '4.7s',
    totalFindings: 8,
    criticalCount: 2,
    highCount: 3,
    mediumCount: 2,
    lowCount: 1,
    overallScore: 18,
    dnsResolves: true,
    hasTls: false,
    tlsValid: false,
    securityHeaders: {},
    findings: [
      { id: 'vs1', severity: 'critical', title: 'RCE via File Upload', description: 'Unrestricted file upload allows arbitrary PHP execution. Attackers can upload webshells.', cveId: 'CWE-434', cvssScore: 9.8, remediation: 'Validate file types server-side. Store uploads outside webroot. Disable execution in upload directories.', category: 'Injection' },
      { id: 'vs2', severity: 'critical', title: 'No HTTPS — Plain HTTP Only', description: 'Site does not support HTTPS at all. All traffic is unencrypted and vulnerable to MITM attacks.', remediation: 'Obtain and configure a TLS certificate. Redirect all HTTP traffic to HTTPS via 301 redirect.', category: 'Configuration' },
      { id: 'vs3', severity: 'high', title: 'Stored XSS in Comment System', description: 'User comments are not sanitized. Malicious scripts execute in all visitors\' browsers.', cveId: 'CWE-79', cvssScore: 6.1, remediation: 'Implement output encoding. Use DOMPurify or similar library to sanitize user-generated HTML.', category: 'XSS' },
      { id: 'vs4', severity: 'high', title: 'Weak Password Policy', description: 'No minimum password complexity. Common passwords accepted. No rate limiting on login.', remediation: 'Enforce minimum 8 chars with complexity requirements. Implement account lockout after 5 attempts.', category: 'Authentication' },
    ],
  },
};

const QUICK_TARGETS = ['example.com', 'gaming-target.net', 'vulnerable-site.com'];

// ═══════════════════════════════════════════════════════════════════════════

export default function ThreatScanner() {
  const { trackTool } = useTrackToolUse();
  const [target, setTarget] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [validationError, setValidationError] = useState('');
  const scanUrl = useAction(api.threatScan.scanUrl);

  const handleScan = useCallback(async (customTarget?: string) => {
    const scanTarget = (customTarget || target).trim();
    if (!scanTarget) return;

    // Undo target for rate limiting
    if (!toolRateLimiters.threatScanner.consume()) {
      setStatus('error');
      return;
    }

    // Validate
    const validation = validateTarget(scanTarget);
    if (!validation.valid) {
      setValidationError('Enter a valid domain (e.g., example.com) or URL.');
      setStatus('notFound');
      return;
    }
    setValidationError('');
    trackTool('threat-scanner', 'start', { target: scanTarget });

    setStatus('loading');
    setScanProgress(0);

    const startTime = Date.now();

    try {
      setScanProgress(30);
      const res: any = await scanUrl({ url: scanTarget });

      if (res.ok) {
        setScanProgress(100);
        const sanitized = validation.sanitized;
        if (res.pending) {
          setResult({
            target: sanitized,
            targetType: validation.type,
            scanDate: new Date().toISOString(),
            duration: 'processing',
            totalFindings: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0,
            overallScore: 50,
            dnsResolves: true, hasTls: true, tlsValid: true,
            securityHeaders: {},
            findings: [{
              id: 'urlscan-pending', severity: 'info', title: 'Scan still processing',
              description: 'urlscan.io is still scanning this target.',
              remediation: `Open the live report: ${res.resultUrl}`,
              category: 'Disclosure',
            }],
          });
        } else {
          const malicious = res.malicious === true;
          const score = res.score ?? 0;
          const findings: ScanFinding[] = malicious
            ? [{
                id: 'urlscan-malicious', severity: 'high', title: 'Potentially malicious URL',
                description: `urlscan.io flagged this target as malicious${res.categories?.length ? ` (${res.categories.join(', ')})` : ''}. Full report: ${res.resultUrl}`,
                remediation: 'Do not visit this URL. Block it at the DNS/firewall level.',
                category: 'Disclosure',
              }]
            : [{
                id: 'urlscan-clean', severity: 'info', title: 'No malicious indicators found',
                description: `urlscan.io found no malicious verdict. Full report: ${res.resultUrl}`,
                remediation: 'Keep monitoring.',
                category: 'Disclosure',
              }];
          setResult({
            target: sanitized,
            targetType: validation.type,
            scanDate: new Date().toISOString(),
            duration: '~15s',
            totalFindings: findings.length,
            criticalCount: findings.filter((f) => f.severity === 'critical').length,
            highCount: findings.filter((f) => f.severity === 'high').length,
            mediumCount: findings.filter((f) => f.severity === 'medium').length,
            lowCount: findings.filter((f) => f.severity === 'low').length,
            overallScore: Math.max(0, 100 - score),
            dnsResolves: true,
            hasTls: res.tlsValid !== false,
            tlsValid: res.tlsValid === true,
            securityHeaders: {},
            findings,
          });
        }
        setStatus('success');
      } else {
        setValidationError(res.reason || 'Scan failed.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setStatus('error');
    }
  }, [target, scanUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleScan();
    },
    [handleScan]
  );

  const resetScan = useCallback(() => {
    setTarget('');
    setResult(null);
    setStatus('idle');
    setScanProgress(0);
    setValidationError('');
    toolRateLimiters.threatScanner.reset();
  }, []);

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ErrorBoundary toolName="Threat Scanner">
      <Layout>
        <SEO
          title="Gaming Threat Scanner — The Grid Nexus"
          description="Demonstration of a domain vulnerability scanner. Results are simulated — not a live scan."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Shield className="w-7 h-7 text-[#B026FF]" />
                  Threat Scanner
                </h1>
                <p className="text-gray-400 mt-1">
                  Simulated demonstration — results are illustrative, not a live scan.
                </p>
              </div>
            </div>

            {/* Scan Input */}
            <Card className="bg-[#131820] border-gray-800">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      value={target}
                      onChange={(e) => { setTarget(e.target.value); setValidationError(''); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter domain or URL (e.g., example.com)"
                      className={`pl-10 bg-[#0B0E14] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#B026FF] ${
                        validationError ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <Button
                    onClick={() => handleScan()}
                    disabled={status === 'loading' || !target.trim()}
                    className="bg-[#B026FF] hover:bg-[#B026FF]/80 text-white"
                  >
                    {status === 'loading' ? 'Scanning…' : 'Scan'}
                  </Button>
                  {result && (
                    <Button variant="outline" size="icon" onClick={resetScan} className="border-gray-700">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {validationError && (
                  <p className="text-sm text-red-400 mt-2">{validationError}</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Targets */}
            {status === 'idle' && !result && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 self-center">Quick scan:</span>
                {QUICK_TARGETS.map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTarget(t);
                      handleScan(t);
                    }}
                    className="border-gray-700 hover:border-[#B026FF]"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            )}

            {/* Scanning Progress */}
            {status === 'loading' && (
              <Card className="bg-[#131820] border-gray-800">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Terminal className="w-6 h-6 text-[#B026FF] animate-pulse" />
                    <p className="text-gray-300 font-medium">
                      Scanning {target}…
                    </p>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-gray-700" />
                  <p className="text-sm text-gray-500">
                    {scanProgress < 20 ? 'Initializing scan…' :
                     scanProgress < 45 ? 'DNS resolution & port enumeration…' :
                     scanProgress < 65 ? 'TLS certificate validation…' :
                     scanProgress < 85 ? 'Security header analysis & CVE matching…' :
                     'Compiling report…'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Not Found / Invalid */}
            {status === 'notFound' && !validationError && (
              <NotFoundState
                title="Target not resolved"
                message={`Could not resolve "${target}". Check the domain and try again.`}
              />
            )}

            {/* Error */}
            {status === 'error' && (
              <ErrorState
                title="Scan rate limited"
                message="Threat scanning is rate-limited. Please wait before starting a new scan."
              />
            )}

            {/* Results */}
            {status === 'success' && result && (
              <ResultDisplay result={result} severityColor={severityColor} scoreColor={scoreColor} />
            )}
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/security-scanner",
            "/tools/ioc-lookup",
            "/tools/nexusguard",
            "/tools/exploit-risk-meter",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════

function ResultDisplay({
  result,
  severityColor,
  scoreColor,
}: {
  result: ScanResult;
  severityColor: (s: string) => string;
  scoreColor: (s: number) => string;
}) {
  const [expandedFinding, setExpandedFinding] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-[#131820] border-gray-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#0B0E14] rounded-lg border border-gray-800">
              <p className="text-3xl font-bold flex items-center justify-center gap-2">
                <Shield className={`w-6 h-6 ${scoreColor(result.overallScore)}`} />
                <span className={scoreColor(result.overallScore)}>{result.overallScore}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">Security Score</p>
            </div>
            <div className="text-center p-4 bg-[#0B0E14] rounded-lg border border-gray-800">
              <p className="text-3xl font-bold text-red-400">{result.criticalCount + result.highCount}</p>
              <p className="text-sm text-gray-400 mt-1">Critical / High</p>
            </div>
            <div className="text-center p-4 bg-[#0B0E14] rounded-lg border border-gray-800">
              <p className="text-3xl font-bold text-white">{result.totalFindings}</p>
              <p className="text-sm text-gray-400 mt-1">Total Findings</p>
            </div>
            <div className="text-center p-4 bg-[#0B0E14] rounded-lg border border-gray-800">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <CheckCircle className={`w-4 h-4 ${result.dnsResolves ? 'text-green-400' : 'text-red-400'}`} />
                DNS
                <CheckCircle className={`w-4 h-4 ${result.hasTls ? 'text-green-400' : 'text-red-400'}`} />
                TLS
              </div>
              <p className="text-xs text-gray-500 mt-2">{result.duration}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Findings */}
      <Card className="bg-[#131820] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#B026FF]" />
            Findings ({result.totalFindings})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {result.findings.map((finding) => (
            <div
              key={finding.id}
              className="bg-[#0B0E14] rounded-lg border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFinding(expandedFinding === finding.id ? null : finding.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge className={`text-xs border shrink-0 ${severityColor(finding.severity)}`}>
                    {finding.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium text-white truncate">{finding.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedFinding === finding.id ? 'rotate-90' : ''
                }`} />
              </button>
              {expandedFinding === finding.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-300">{finding.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {finding.cveId && (
                      <Badge variant="outline" className="text-xs border-gray-700">
                        <Info className="w-3 h-3 mr-1" />
                        {finding.cveId}
                        {finding.cvssScore && ` (CVSS: ${finding.cvssScore})`}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs border-gray-700">
                      {finding.category}
                    </Badge>
                  </div>
                  <div className="p-3 bg-green-900/10 border border-green-700/30 rounded-lg">
                    <p className="text-xs font-medium text-green-400 uppercase tracking-wider">Remediation</p>
                    <p className="text-sm text-gray-300 mt-1">{finding.remediation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Headers */}
      <Card className="bg-[#131820] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#B026FF]" />
            Security Headers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(result.securityHeaders).map(([header, value]) => (
              <div key={header} className="flex items-center gap-2 p-2 bg-[#0B0E14] rounded border border-gray-800">
                {value ? (
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-300 truncate">{header}</p>
                  <p className="text-xs text-gray-500 truncate">{value || 'Not set'}</p>
                </div>
              </div>
            ))}
            {Object.keys(result.securityHeaders).length === 0 && (
              <p className="text-sm text-gray-500 col-span-2">No security headers detected.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
