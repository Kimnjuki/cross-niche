import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ComponentSelection {
  cpu: string;
  motherboard: string;
  gpu: string;
  ram: string;
  storage: string;
  psu: string;
  case: string;
  cooler: string;
}

interface CompatibilityIssue {
  component: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
}

export default function CompatibilityChecker() {
  const [components, setComponents] = useState<ComponentSelection>({
    cpu: '',
    motherboard: '',
    gpu: '',
    ram: '',
    storage: '',
    psu: '',
    case: '',
    cooler: '',
  });

  const cpuOptions = [
    { value: 'intel-12th', label: 'Intel 12th Gen (LGA 1700)' },
    { value: 'intel-13th', label: 'Intel 13th Gen (LGA 1700)' },
    { value: 'intel-14th', label: 'Intel 14th Gen (LGA 1700)' },
    { value: 'amd-am4', label: 'AMD AM4 (Ryzen 5000/3000)' },
    { value: 'amd-am5', label: 'AMD AM5 (Ryzen 7000/8000)' },
  ];

  const motherboardOptions = [
    { value: 'intel-z690', label: 'Intel Z690 (LGA 1700)', socket: 'intel-12th' },
    { value: 'intel-z790', label: 'Intel Z790 (LGA 1700)', socket: 'intel-13th' },
    { value: 'amd-b550', label: 'AMD B550 (AM4)', socket: 'amd-am4' },
    { value: 'amd-x570', label: 'AMD X570 (AM4)', socket: 'amd-am4' },
    { value: 'amd-b650', label: 'AMD B650 (AM5)', socket: 'amd-am5' },
    { value: 'amd-x670', label: 'AMD X670 (AM5)', socket: 'amd-am5' },
  ];

  const gpuOptions = [
    { value: 'rtx-4060', label: 'NVIDIA RTX 4060', length: 240, power: 115 },
    { value: 'rtx-4070', label: 'NVIDIA RTX 4070', length: 242, power: 200 },
    { value: 'rtx-4080', label: 'NVIDIA RTX 4080', length: 304, power: 320 },
    { value: 'rtx-4090', label: 'NVIDIA RTX 4090', length: 304, power: 450 },
    { value: 'rx-7600', label: 'AMD RX 7600', length: 204, power: 165 },
    { value: 'rx-7700', label: 'AMD RX 7700 XT', length: 267, power: 245 },
    { value: 'rx-7900', label: 'AMD RX 7900 XTX', length: 287, power: 355 },
  ];

  const ramOptions = [
    { value: 'ddr4-8gb', label: 'DDR4 8GB', type: 'ddr4' },
    { value: 'ddr4-16gb', label: 'DDR4 16GB', type: 'ddr4' },
    { value: 'ddr4-32gb', label: 'DDR4 32GB', type: 'ddr4' },
    { value: 'ddr5-16gb', label: 'DDR5 16GB', type: 'ddr5' },
    { value: 'ddr5-32gb', label: 'DDR5 32GB', type: 'ddr5' },
    { value: 'ddr5-64gb', label: 'DDR5 64GB', type: 'ddr5' },
  ];

  const checkCompatibility = (): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    // CPU-Motherboard socket check
    if (components.cpu && components.motherboard) {
      const cpu = cpuOptions.find(c => c.value === components.cpu);
      const mobo = motherboardOptions.find(m => m.value === components.motherboard);
      
      if (cpu && mobo) {
        const cpuSocket = cpu.value.split('-').slice(0, 2).join('-');
        const moboSocket = mobo.socket;
        
        if (!cpuSocket.includes(moboSocket.split('-')[1]) && !moboSocket.includes(cpuSocket.split('-')[1])) {
          issues.push({
            component: 'CPU-Motherboard',
            issue: `Socket mismatch: ${cpu.label} is not compatible with ${mobo.label}`,
            severity: 'error',
          });
        }
      }
    }

    // RAM-Motherboard compatibility
    if (components.ram && components.motherboard) {
      const ram = ramOptions.find(r => r.value === components.ram);
      const mobo = motherboardOptions.find(m => m.value === components.motherboard);
      
      if (ram && mobo) {
        const isAM5 = mobo.value.includes('am5');
        const isDDR5 = ram.type === 'ddr5';
        
        if (isAM5 && !isDDR5) {
          issues.push({
            component: 'RAM-Motherboard',
            issue: 'AM5 motherboards require DDR5 RAM',
            severity: 'error',
          });
        }
        
        if (!isAM5 && isDDR5 && !mobo.value.includes('z790')) {
          issues.push({
            component: 'RAM-Motherboard',
            issue: 'This motherboard may not support DDR5 RAM',
            severity: 'warning',
          });
        }
      }
    }

    // GPU-PSU power check
    if (components.gpu && components.psu) {
      const gpu = gpuOptions.find(g => g.value === components.gpu);
      const psuWattage = parseInt(components.psu) || 0;
      
      if (gpu) {
        const estimatedTotalPower = gpu.power + 200; // GPU + CPU + other components
        
        if (psuWattage < estimatedTotalPower) {
          issues.push({
            component: 'GPU-PSU',
            issue: `PSU wattage (${psuWattage}W) may be insufficient for ${gpu.label} (recommended: ${estimatedTotalPower}W+)`,
            severity: 'warning',
          });
        }
      }
    }

    // GPU-Case length check
    if (components.gpu && components.case) {
      const gpu = gpuOptions.find(g => g.value === components.gpu);
      const caseLength = parseInt(components.case) || 0;
      
      if (gpu && caseLength > 0 && gpu.length > caseLength) {
        issues.push({
          component: 'GPU-Case',
          issue: `GPU length (${gpu.length}mm) exceeds case clearance (${caseLength}mm)`,
          severity: 'error',
        });
      }
    }

    // Storage compatibility (all modern motherboards support SATA and NVMe)
    if (components.storage && components.motherboard) {
      const storage = components.storage.toLowerCase();
      if (storage.includes('nvme') && components.motherboard.includes('b550')) {
        issues.push({
          component: 'Storage',
          issue: 'Some B550 motherboards may have limited NVMe slots',
          severity: 'info',
        });
      }
    }

    return issues;
  };

  const issues = checkCompatibility();
  const hasErrors = issues.some(i => i.severity === 'error');
  const hasWarnings = issues.some(i => i.severity === 'warning');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Build Compatibility Checker</h1>
              <p className="text-muted-foreground">Verify component compatibility for your PC build</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Components</CardTitle>
                <CardDescription>Choose your PC components to check compatibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Select
                    value={components.cpu}
                    onValueChange={(value) => setComponents({ ...components, cpu: value })}
                  >
                    <SelectTrigger id="cpu">
                      <SelectValue placeholder="Select CPU" />
                    </SelectTrigger>
                    <SelectContent>
                      {cpuOptions.map((cpu) => (
                        <SelectItem key={cpu.value} value={cpu.value}>
                          {cpu.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherboard">Motherboard</Label>
                  <Select
                    value={components.motherboard}
                    onValueChange={(value) => setComponents({ ...components, motherboard: value })}
                  >
                    <SelectTrigger id="motherboard">
                      <SelectValue placeholder="Select Motherboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {motherboardOptions.map((mobo) => (
                        <SelectItem key={mobo.value} value={mobo.value}>
                          {mobo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpu">GPU</Label>
                  <Select
                    value={components.gpu}
                    onValueChange={(value) => setComponents({ ...components, gpu: value })}
                  >
                    <SelectTrigger id="gpu">
                      <SelectValue placeholder="Select GPU" />
                    </SelectTrigger>
                    <SelectContent>
                      {gpuOptions.map((gpu) => (
                        <SelectItem key={gpu.value} value={gpu.value}>
                          {gpu.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Select
                    value={components.ram}
                    onValueChange={(value) => setComponents({ ...components, ram: value })}
                  >
                    <SelectTrigger id="ram">
                      <SelectValue placeholder="Select RAM" />
                    </SelectTrigger>
                    <SelectContent>
                      {ramOptions.map((ram) => (
                        <SelectItem key={ram.value} value={ram.value}>
                          {ram.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage Type</Label>
                  <Select
                    value={components.storage}
                    onValueChange={(value) => setComponents({ ...components, storage: value })}
                  >
                    <SelectTrigger id="storage">
                      <SelectValue placeholder="Select Storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sata-ssd">SATA SSD</SelectItem>
                      <SelectItem value="nvme-pcie3">NVMe PCIe 3.0</SelectItem>
                      <SelectItem value="nvme-pcie4">NVMe PCIe 4.0</SelectItem>
                      <SelectItem value="nvme-pcie5">NVMe PCIe 5.0</SelectItem>
                      <SelectItem value="hdd">HDD (SATA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="psu">PSU Wattage (W)</Label>
                  <Select
                    value={components.psu}
                    onValueChange={(value) => setComponents({ ...components, psu: value })}
                  >
                    <SelectTrigger id="psu">
                      <SelectValue placeholder="Select PSU Wattage" />
                    </SelectTrigger>
                    <SelectContent>
                      {[450, 550, 650, 750, 850, 1000, 1200, 1500].map((wattage) => (
                        <SelectItem key={wattage} value={wattage.toString()}>
                          {wattage}W
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case">Case GPU Clearance (mm)</Label>
                  <Select
                    value={components.case}
                    onValueChange={(value) => setComponents({ ...components, case: value })}
                  >
                    <SelectTrigger id="case">
                      <SelectValue placeholder="Select Case Clearance" />
                    </SelectTrigger>
                    <SelectContent>
                      {[200, 250, 300, 350, 400, 450].map((length) => (
                        <SelectItem key={length} value={length.toString()}>
                          {length}mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooler">CPU Cooler</Label>
                  <Select
                    value={components.cooler}
                    onValueChange={(value) => setComponents({ ...components, cooler: value })}
                  >
                    <SelectTrigger id="cooler">
                      <SelectValue placeholder="Select Cooler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock Cooler</SelectItem>
                      <SelectItem value="air-small">Air Cooler (Small)</SelectItem>
                      <SelectItem value="air-large">Air Cooler (Large)</SelectItem>
                      <SelectItem value="aio-120">AIO 120mm</SelectItem>
                      <SelectItem value="aio-240">AIO 240mm</SelectItem>
                      <SelectItem value="aio-360">AIO 360mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className={hasErrors ? 'border-red-500/20 bg-red-500/5' : hasWarnings ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-green-500/20 bg-green-500/5'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {hasErrors ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : hasWarnings ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  Compatibility Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {issues.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold text-green-500">All Components Compatible</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Your selected components are compatible with each other
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          issue.severity === 'error'
                            ? 'border-red-500/20 bg-red-500/10'
                            : issue.severity === 'warning'
                            ? 'border-yellow-500/20 bg-yellow-500/10'
                            : 'border-blue-500/20 bg-blue-500/10'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {issue.severity === 'error' ? (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          ) : issue.severity === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{issue.component}</div>
                            <div className="text-xs text-muted-foreground">{issue.issue}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(components).map(([key, value]) => {
                  if (!value) return null;
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
                {Object.values(components).every(v => !v) && (
                  <div className="text-center text-muted-foreground py-4">
                    No components selected
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

