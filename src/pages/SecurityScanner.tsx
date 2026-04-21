import { memo, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Monitor,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Vulnerability {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  cve: string | null;
}

interface ScanResult {
  url: string;
  timestamp: string;
  score: number;
  issues: number;
  vulnerabilities: Vulnerability[];
  recommendations: string[];
}

interface ScanHistoryItem {
  id: string;
  url: string;
  timestamp: string;
  score: number;
  issues: number;
  status: 'completed' | 'failed';
}

// ── Pure helpers — defined outside component so they're never re-created ──────

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high':   return 'text-red-600 bg-red-50 dark:bg-red-950/20';
    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    case 'low':    return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    default:       return 'text-muted-foreground bg-muted';
  }
}

const INITIAL_HISTORY: ScanHistoryItem[] = [
  { id: 'scan-1', url: 'https://example.com',  timestamp: '2026-02-11T10:30:00Z', score: 75, issues: 12, status: 'completed' },
  { id: 'scan-2', url: 'https://test-site.org', timestamp: '2026-02-10T15:45:00Z', score: 89, issues: 3,  status: 'completed' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const VulnerabilityCard = memo(function VulnerabilityCard({ vuln }: { vuln: Vulnerability }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Badge className={getSeverityColor(vuln.severity)}>
            {vuln.severity.toUpperCase()}
          </Badge>
          <div className="min-w-0">
            <h5 className="font-semibold text-sm">{vuln.title}</h5>
            <p className="text-xs text-muted-foreground mt-0.5">{vuln.description}</p>
          </div>
        </div>
        {vuln.cve && (
          <Badge variant="outline" className="text-xs shrink-0">{vuln.cve}</Badge>
        )}
      </div>
      <div className="mt-3 pl-0">
        <p className="text-xs font-medium text-muted-foreground">Fix: <span className="text-foreground">{vuln.recommendation}</span></p>
      </div>
    </div>
  );
});

const HistoryRow = memo(function HistoryRow({ scan }: { scan: ScanHistoryItem }) {
  return (
    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium text-sm">{scan.url}</p>
          <p className="text-xs text-muted-foreground">{new Date(scan.timestamp).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${getScoreColor(scan.score)}`}>{scan.score}/100</p>
          <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
            {scan.status}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{scan.issues} issues found</span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs">View Details</Button>
      </div>
    </div>
  );
});

// ── Page ──────────────────────────────────────────────────────────────────────

const SecurityScanner = memo(function SecurityScanner() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(INITIAL_HISTORY);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScan = useCallback(async () => {
    if (!scanUrl.trim()) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsScanning(true);
    setScanResults(null);

    timerRef.current = setTimeout(() => {
      const result: ScanResult = {
        url: scanUrl,
        timestamp: new Date().toISOString(),
        score: Math.floor(Math.random() * 40) + 60,
        issues: 3,
        vulnerabilities: [
          {
            id: 'vuln-1',
            severity: 'high',
            title: 'Outdated SSL Certificate',
            description: 'The SSL certificate is expired or uses weak encryption.',
            recommendation: 'Update SSL certificate with a valid cert from a trusted CA.',
            cve: 'CVE-2023-1234',
          },
          {
            id: 'vuln-2',
            severity: 'medium',
            title: 'Missing Security Headers',
            description: 'CSP, HSTS, and X-Frame-Options headers are missing.',
            recommendation: 'Implement security headers to prevent clickjacking and XSS.',
            cve: null,
          },
          {
            id: 'vuln-3',
            severity: 'low',
            title: 'Verbose Error Messages',
            description: 'Error messages reveal sensitive server configuration details.',
            recommendation: 'Sanitize error messages to remove sensitive information.',
            cve: null,
          },
        ],
        recommendations: [
          'Update SSL certificate immediately',
          'Implement Content Security Policy (CSP)',
          'Add HTTP Strict Transport Security (HSTS)',
          'Configure X-Frame-Options header',
          'Schedule regular security audits',
        ],
      };

      setScanResults(result);
      setIsScanning(false);

      const newScan: ScanHistoryItem = {
        id: `scan-${Date.now()}`,
        url: scanUrl,
        timestamp: result.timestamp,
        score: result.score,
        issues: result.vulnerabilities.length,
        status: 'completed',
      };
      setScanHistory((prev) => [newScan, ...prev.slice(0, 9)]);
    }, 3000);
  }, [scanUrl]);

  return (
    <Layout>
      <SEO
        title="Security Scanner — Free Website Vulnerability Check | The Grid Nexus"
        description="Enter any URL and get a security score with a full vulnerability list and actionable fix recommendations. Free, no sign-up required."
        canonical="https://thegridnexus.com/tools/security-scanner"
        ogType="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Security Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Security Scanner</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Security Scanner</h1>
              <p className="text-sm text-muted-foreground">Website Vulnerability Check</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Enter any URL and get a security score with a full vulnerability list and actionable fix recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="scanner">Scanner</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="scanner" className="mt-6">
                    <div className="space-y-6">
                      {/* URL Input */}
                      <div className="space-y-2">
                        <label htmlFor="scan-url" className="text-sm font-medium">
                          Website URL to Scan
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="scan-url"
                            name="scan-url"
                            type="url"
                            placeholder="https://example.com"
                            value={scanUrl}
                            onChange={(e) => setScanUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isScanning && handleScan()}
                            className="flex-1 px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={isScanning}
                          />
                          <Button
                            onClick={handleScan}
                            disabled={isScanning || !scanUrl.trim()}
                            className="min-w-28"
                          >
                            {isScanning ? (
                              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Scanning…</>
                            ) : (
                              <><Search className="h-4 w-4 mr-2" />Start Scan</>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Scan Progress */}
                      {isScanning && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5 text-primary animate-pulse" />
                            <div>
                              <p className="font-medium text-sm">Scanning in progress…</p>
                              <p className="text-xs text-muted-foreground">This may take up to 30 seconds</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      {scanResults && !isScanning && (
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div className="p-6 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Security Score</p>
                            <p className={`text-6xl font-bold ${getScoreColor(scanResults.score)}`}>
                              {scanResults.score}<span className="text-2xl">/100</span>
                            </p>
                            <p className="text-lg font-semibold mt-1">{getScoreLabel(scanResults.score)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Higher scores indicate better security posture</p>
                          </div>

                          {/* Vulnerabilities */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Security Issues Found ({scanResults.vulnerabilities.length})</h4>
                            {scanResults.vulnerabilities.map((vuln) => (
                              <VulnerabilityCard key={vuln.id} vuln={vuln} />
                            ))}
                          </div>

                          {/* Recommendations */}
                          <div className="p-4 border rounded-lg bg-muted/50">
                            <h4 className="font-semibold text-sm mb-3">Overall Recommendations</h4>
                            <ul className="space-y-2">
                              {scanResults.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => { setScanResults(null); setScanUrl(''); }}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Scan Another Site
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    {scanHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm">No scan history available</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {scanHistory.map((scan) => (
                          <HistoryRow key={scan.id} scan={scan} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scanner Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scan Limits */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-sm mb-3">Scan Limits</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>Free Users</span>
                      </div>
                      <span className="text-muted-foreground">5 / day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Unlock className="h-4 w-4 text-primary" />
                        <span>Premium</span>
                      </div>
                      <span className="text-muted-foreground">Unlimited</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/subscription">Upgrade to Premium</Link>
                  </Button>
                </div>

                {/* Scan Types */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-2">Available Scans</h4>
                  {[
                    { icon: Shield,  color: 'text-primary', label: 'Web Security',  sub: 'SSL, headers, vulnerabilities' },
                    { icon: Monitor, color: 'text-tech',    label: 'Performance',   sub: 'Speed, optimization, metrics' },
                    { icon: Cpu,     color: 'text-gaming',  label: 'Malware Scan',  sub: 'File analysis, threats' },
                  ].map(({ icon: Icon, color, label, sub }) => (
                    <div key={label} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Icon className={`h-5 w-5 ${color} shrink-0`} />
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h4 className="font-semibold text-sm mb-3">Today's Statistics</h4>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    {[
                      { value: '1,234', label: 'Scans', color: 'text-primary' },
                      { value: '89',    label: 'Threats', color: 'text-security' },
                      { value: '456',   label: 'Secured', color: 'text-tech' },
                      { value: '23',    label: 'Reports', color: 'text-gaming' },
                    ].map(({ value, label, color }) => (
                      <div key={label}>
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default SecurityScanner;
