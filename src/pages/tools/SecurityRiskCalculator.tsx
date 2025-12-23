import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SecurityConfig {
  os: string;
  antivirus: boolean;
  firewall: boolean;
  vpn: boolean;
  twoFactor: boolean;
  updates: string;
  passwordManager: boolean;
  encryption: boolean;
  backups: string;
}

export default function SecurityRiskCalculator() {
  const [config, setConfig] = useState<SecurityConfig>({
    os: 'windows',
    antivirus: false,
    firewall: false,
    vpn: false,
    twoFactor: false,
    updates: 'manual',
    passwordManager: false,
    encryption: false,
    backups: 'none',
  });

  const calculateRiskScore = (): number => {
    let risk = 100; // Start with maximum risk

    // OS Security
    const osRisk: Record<string, number> = {
      'windows': 20,
      'macos': 15,
      'linux': 10,
      'chromeos': 12,
    };
    risk -= osRisk[config.os] || 20;

    // Security Features
    if (config.antivirus) risk -= 15;
    if (config.firewall) risk -= 10;
    if (config.vpn) risk -= 8;
    if (config.twoFactor) risk -= 12;
    if (config.passwordManager) risk -= 10;
    if (config.encryption) risk -= 10;

    // Updates
    const updateRisk: Record<string, number> = {
      'automatic': -15,
      'regular': -8,
      'manual': 0,
      'never': 10,
    };
    risk += updateRisk[config.updates] || 0;

    // Backups
    const backupRisk: Record<string, number> = {
      'automatic': -10,
      'manual': -5,
      'none': 5,
    };
    risk += backupRisk[config.backups] || 0;

    return Math.max(0, Math.min(100, risk));
  };

  const getRiskLevel = (score: number): { level: string; color: string; description: string } => {
    if (score <= 20) {
      return {
        level: 'Very Low',
        color: 'text-green-500',
        description: 'Excellent security posture. Your system is well-protected.',
      };
    } else if (score <= 40) {
      return {
        level: 'Low',
        color: 'text-green-600',
        description: 'Good security. Minor improvements recommended.',
      };
    } else if (score <= 60) {
      return {
        level: 'Medium',
        color: 'text-yellow-500',
        description: 'Moderate risk. Several security improvements needed.',
      };
    } else if (score <= 80) {
      return {
        level: 'High',
        color: 'text-orange-500',
        description: 'High risk. Immediate security improvements required.',
      };
    } else {
      return {
        level: 'Critical',
        color: 'text-red-500',
        description: 'Critical risk. Your system is highly vulnerable.',
      };
    }
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];

    if (!config.antivirus) {
      recommendations.push('Install and regularly update antivirus software');
    }
    if (!config.firewall) {
      recommendations.push('Enable and configure a firewall');
    }
    if (!config.vpn) {
      recommendations.push('Use a VPN when on public networks');
    }
    if (!config.twoFactor) {
      recommendations.push('Enable two-factor authentication on all accounts');
    }
    if (config.updates === 'manual' || config.updates === 'never') {
      recommendations.push('Enable automatic system updates');
    }
    if (!config.passwordManager) {
      recommendations.push('Use a password manager for secure password storage');
    }
    if (!config.encryption) {
      recommendations.push('Enable disk encryption for sensitive data');
    }
    if (config.backups === 'none') {
      recommendations.push('Set up regular automated backups');
    }

    return recommendations;
  };

  const riskScore = calculateRiskScore();
  const riskLevel = getRiskLevel(riskScore);
  const recommendations = getRecommendations();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Security Risk Calculator</h1>
              <p className="text-muted-foreground">Assess your system's security risk based on configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Select your current security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select value={config.os} onValueChange={(value) => setConfig({ ...config, os: value })}>
                    <SelectTrigger id="os">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="windows">Windows</SelectItem>
                      <SelectItem value="macos">macOS</SelectItem>
                      <SelectItem value="linux">Linux</SelectItem>
                      <SelectItem value="chromeos">Chrome OS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="antivirus">Antivirus Software</Label>
                      <div className="text-sm text-muted-foreground">Installed and updated</div>
                    </div>
                    <Switch
                      id="antivirus"
                      checked={config.antivirus}
                      onCheckedChange={(checked) => setConfig({ ...config, antivirus: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="firewall">Firewall Enabled</Label>
                      <div className="text-sm text-muted-foreground">Active firewall protection</div>
                    </div>
                    <Switch
                      id="firewall"
                      checked={config.firewall}
                      onCheckedChange={(checked) => setConfig({ ...config, firewall: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vpn">VPN Usage</Label>
                      <div className="text-sm text-muted-foreground">Regular VPN usage</div>
                    </div>
                    <Switch
                      id="vpn"
                      checked={config.vpn}
                      onCheckedChange={(checked) => setConfig({ ...config, vpn: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">Enabled on accounts</div>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={config.twoFactor}
                      onCheckedChange={(checked) => setConfig({ ...config, twoFactor: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="passwordManager">Password Manager</Label>
                      <div className="text-sm text-muted-foreground">Using password manager</div>
                    </div>
                    <Switch
                      id="passwordManager"
                      checked={config.passwordManager}
                      onCheckedChange={(checked) => setConfig({ ...config, passwordManager: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="encryption">Disk Encryption</Label>
                      <div className="text-sm text-muted-foreground">Encrypted storage</div>
                    </div>
                    <Switch
                      id="encryption"
                      checked={config.encryption}
                      onCheckedChange={(checked) => setConfig({ ...config, encryption: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="updates">System Updates</Label>
                  <Select value={config.updates} onValueChange={(value) => setConfig({ ...config, updates: value })}>
                    <SelectTrigger id="updates">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="regular">Regular (Weekly)</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backups">Backup Strategy</Label>
                  <Select value={config.backups} onValueChange={(value) => setConfig({ ...config, backups: value })}>
                    <SelectTrigger id="backups">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Security Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Risk Score</div>
                    <div className={`text-2xl font-bold ${riskLevel.color}`}>{riskScore}/100</div>
                  </div>
                  <Progress value={riskScore} className="h-2" />
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                  <Badge className={`text-base px-3 py-1 ${riskLevel.color} border-current`}>
                    {riskLevel.level}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    {riskLevel.description}
                  </div>
                </div>

                {riskScore > 40 && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <div className="font-medium mb-2">Security Recommendations</div>
                        <ul className="space-y-1 text-muted-foreground">
                          {recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {riskScore <= 40 && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Good Security Posture</div>
                        <div className="text-muted-foreground">
                          Your system has strong security measures in place. Continue maintaining these practices.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

