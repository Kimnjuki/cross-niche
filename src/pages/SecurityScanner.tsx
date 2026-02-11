import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Clock, 
  Cpu, 
  Monitor,
  Activity,
  Zap,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';

export default function SecurityScanner() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 'scan-1',
      url: 'https://example.com',
      timestamp: '2026-02-11T10:30:00Z',
      score: 75,
      issues: 12,
      status: 'completed'
    },
    {
      id: 'scan-2',
      url: 'https://test-site.org',
      timestamp: '2026-02-10T15:45:00Z',
      score: 89,
      issues: 3,
      status: 'completed'
    }
  ]);

  const handleScan = async () => {
    if (!scanUrl.trim()) return;
    
    setIsScanning(true);
    setScanResults(null);
    
    // Simulate scan process
    setTimeout(() => {
      const mockResults = {
        url: scanUrl,
        timestamp: new Date().toISOString(),
        score: Math.floor(Math.random() * 40) + 60,
        issues: Math.floor(Math.random() * 20) + 5,
        vulnerabilities: [
          {
            id: 'vuln-1',
            severity: 'high',
            title: 'Outdated SSL Certificate',
            description: 'The SSL certificate is expired or uses weak encryption',
            recommendation: 'Update SSL certificate with a valid certificate from a trusted CA',
            cve: 'CVE-2023-1234'
          },
          {
            id: 'vuln-2',
            severity: 'medium',
            title: 'Missing Security Headers',
            description: 'Important security headers like CSP, HSTS, and X-Frame-Options are missing',
            recommendation: 'Implement security headers to prevent clickjacking and XSS attacks',
            cve: null
          },
          {
            id: 'vuln-3',
            severity: 'low',
            title: 'Information Disclosure in Error Messages',
            description: 'Error messages reveal sensitive information about the server configuration',
            recommendation: 'Sanitize error messages to remove sensitive information',
            cve: null
          }
        ],
        recommendations: [
          'Update SSL certificate immediately',
          'Implement Content Security Policy (CSP)',
          'Add HTTP Strict Transport Security (HSTS)',
          'Configure X-Frame-Options header',
          'Regular security audits recommended'
        ]
      };
      
      setScanResults(mockResults);
      setIsScanning(false);
      
      // Add to history
      const newScan = {
        id: `scan-${Date.now()}`,
        url: scanUrl,
        timestamp: mockResults.timestamp,
        score: mockResults.score,
        issues: mockResults.vulnerabilities.length,
        status: 'completed'
      };
      setScanHistory([newScan, ...scanHistory.slice(0, 9)]);
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/tools" className="text-primary border-b-2 border-primary px-1 pb-4">
                Security Tools
              </Link>
              <Link to="/subscription" className="text-muted-foreground hover:text-foreground">
                Subscription
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Website URL to Scan</label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={scanUrl}
                              onChange={(e) => setScanUrl(e.target.value)}
                              className="flex-1 px-4 py-2 border rounded-md bg-background"
                              disabled={isScanning}
                            />
                            <Button 
                              onClick={handleScan}
                              disabled={isScanning || !scanUrl.trim()}
                              className="min-w-24"
                            >
                              {isScanning ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Scanning...
                                </>
                              ) : (
                                <>
                                  <Search className="h-4 w-4 mr-2" />
                                  Start Scan
                                </>
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
                                <div className="font-medium">Scanning in progress...</div>
                                <div className="text-sm text-muted-foreground">This may take up to 30 seconds</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Results */}
                        {scanResults && !isScanning && (
                          <div className="space-y-6">
                            {/* Overall Score */}
                            <div className="p-6 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                              <div className="text-center">
                                <div className="text-4xl font-bold mb-2">
                                  Security Score
                                </div>
                                <div className={`text-6xl font-bold ${getScoreColor(scanResults.score)}`}>
                                  {scanResults.score}/100
                                </div>
                                <div className="text-lg font-medium">
                                  {getScoreLabel(scanResults.score)}
                                </div>
                                <div className="text-sm text-muted-foreground mt-2">
                                  Higher scores indicate better security posture
                                </div>
                              </div>
                            </div>

                            {/* Vulnerabilities */}
                            <div className="space-y-4">
                              <h4 className="font-semibold mb-4">Security Issues Found</h4>
                              {scanResults.vulnerabilities.map((vuln, index) => (
                                <div key={vuln.id} className="p-4 border rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className={getSeverityColor(vuln.severity)}>
                                        {vuln.severity.toUpperCase()}
                                      </Badge>
                                      <div>
                                        <h5 className="font-semibold">{vuln.title}</h5>
                                        <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                                      </div>
                                    </div>
                                    {vuln.cve && (
                                      <Badge variant="outline" className="text-xs">
                                        {vuln.cve}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-sm font-medium mb-2">Recommendation:</div>
                                    <div className="text-sm text-muted-foreground">{vuln.recommendation}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Recommendations */}
                            <div className="p-4 border rounded-lg bg-muted/50">
                              <h4 className="font-semibold mb-4">Overall Recommendations</h4>
                              <ul className="space-y-2">
                                {scanResults.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                              <Button className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Download Report
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Scan Another Site
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                      <div className="space-y-4">
                        {scanHistory.length === 0 ? (
                          <div className="text-center py-8">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No scan history available</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {scanHistory.map((scan) => (
                              <div key={scan.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <div className="font-medium">{scan.url}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(scan.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className={`text-lg font-bold ${getScoreColor(scan.score)}`}>
                                      {scan.score}/100
                                    </div>
                                    <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                                      {scan.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>{scan.issues} issues found</span>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Scanner Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Free vs Premium */}
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-3">Scan Limits</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Free Users</span>
                          </div>
                          <div className="text-sm text-muted-foreground">5 scans per day</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Unlock className="h-4 w-4 text-primary" />
                            <span className="text-sm">Premium Users</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Unlimited scans</div>
                        </div>
                      </div>
                      <Button className="w-full mt-4">
                        Upgrade to Premium
                      </Button>
                    </div>

                    {/* Scan Types */}
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-3">Available Scans</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Shield className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">Web Security</div>
                            <div className="text-sm text-muted-foreground">SSL, headers, vulnerabilities</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Monitor className="h-5 w-5 text-tech" />
                          <div>
                            <div className="font-medium">Performance</div>
                            <div className="text-sm text-muted-foreground">Speed, optimization, metrics</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Cpu className="h-5 w-5 text-gaming" />
                          <div>
                            <div className="font-medium">Malware Scan</div>
                            <div className="text-sm text-muted-foreground">File analysis, threats</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 border rounded-lg bg-primary/5">
                      <h4 className="font-semibold mb-3">Today's Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">1,234</div>
                          <div className="text-sm text-muted-foreground">Scans Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-security">89</div>
                          <div className="text-sm text-muted-foreground">Threats Detected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-tech">456</div>
                          <div className="text-sm text-muted-foreground">Sites Secured</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gaming">23</div>
                          <div className="text-sm text-muted-foreground">Reports Generated</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
