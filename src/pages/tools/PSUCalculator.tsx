import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ComponentPower {
  cpu: number;
  gpu: number;
  ram: number;
  storage: number;
  motherboard: number;
  fans: number;
  rgb: number;
  other: number;
}

const componentPowerRanges: Record<string, { min: number; max: number; default: number }> = {
  cpu: { min: 35, max: 300, default: 65 },
  gpu: { min: 30, max: 600, default: 150 },
  ram: { min: 2, max: 20, default: 5 },
  storage: { min: 2, max: 30, default: 5 },
  motherboard: { min: 20, max: 100, default: 50 },
  fans: { min: 1, max: 10, default: 3 },
  rgb: { min: 0, max: 50, default: 10 },
  other: { min: 0, max: 100, default: 20 },
};

export default function PSUCalculator() {
  const [components, setComponents] = useState<ComponentPower>({
    cpu: 65,
    gpu: 150,
    ram: 5,
    storage: 5,
    motherboard: 50,
    fans: 3,
    rgb: 10,
    other: 20,
  });

  const [efficiency, setEfficiency] = useState('80plus-gold');
  const [overhead, setOverhead] = useState(20);

  const calculateTotalPower = () => {
    const total = Object.values(components).reduce((sum, val) => sum + val, 0);
    return total;
  };

  const calculateRecommendedPSU = () => {
    const total = calculateTotalPower();
    const withOverhead = total * (1 + overhead / 100);
    return Math.ceil(withOverhead / 50) * 50; // Round up to nearest 50W
  };

  const efficiencyRatings: Record<string, { name: string; efficiency: number }> = {
    '80plus': { name: '80 Plus', efficiency: 80 },
    '80plus-bronze': { name: '80 Plus Bronze', efficiency: 82 },
    '80plus-silver': { name: '80 Plus Silver', efficiency: 85 },
    '80plus-gold': { name: '80 Plus Gold', efficiency: 87 },
    '80plus-platinum': { name: '80 Plus Platinum', efficiency: 90 },
    '80plus-titanium': { name: '80 Plus Titanium', efficiency: 92 },
  };

  const recommendedPSU = calculateRecommendedPSU();
  const totalPower = calculateTotalPower();
  const efficiencyInfo = efficiencyRatings[efficiency];

  const updateComponent = (key: keyof ComponentPower, value: number) => {
    const range = componentPowerRanges[key];
    const clamped = Math.max(range.min, Math.min(range.max, value));
    setComponents(prev => ({ ...prev, [key]: clamped }));
  };

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
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">PSU Calculator</h1>
              <p className="text-muted-foreground">Calculate the power supply wattage needed for your PC build</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Component Power Consumption</CardTitle>
                <CardDescription>Enter the power consumption of each component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU (W)</Label>
                  <Input
                    id="cpu"
                    type="number"
                    min={componentPowerRanges.cpu.min}
                    max={componentPowerRanges.cpu.max}
                    value={components.cpu}
                    onChange={(e) => updateComponent('cpu', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.cpu.min}W - {componentPowerRanges.cpu.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpu">GPU (W)</Label>
                  <Input
                    id="gpu"
                    type="number"
                    min={componentPowerRanges.gpu.min}
                    max={componentPowerRanges.gpu.max}
                    value={components.gpu}
                    onChange={(e) => updateComponent('gpu', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.gpu.min}W - {componentPowerRanges.gpu.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM (W)</Label>
                  <Input
                    id="ram"
                    type="number"
                    min={componentPowerRanges.ram.min}
                    max={componentPowerRanges.ram.max}
                    value={components.ram}
                    onChange={(e) => updateComponent('ram', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.ram.min}W - {componentPowerRanges.ram.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage (W)</Label>
                  <Input
                    id="storage"
                    type="number"
                    min={componentPowerRanges.storage.min}
                    max={componentPowerRanges.storage.max}
                    value={components.storage}
                    onChange={(e) => updateComponent('storage', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.storage.min}W - {componentPowerRanges.storage.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherboard">Motherboard (W)</Label>
                  <Input
                    id="motherboard"
                    type="number"
                    min={componentPowerRanges.motherboard.min}
                    max={componentPowerRanges.motherboard.max}
                    value={components.motherboard}
                    onChange={(e) => updateComponent('motherboard', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.motherboard.min}W - {componentPowerRanges.motherboard.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fans">Fans (W per fan)</Label>
                  <Input
                    id="fans"
                    type="number"
                    min={componentPowerRanges.fans.min}
                    max={componentPowerRanges.fans.max}
                    value={components.fans}
                    onChange={(e) => updateComponent('fans', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.fans.min}W - {componentPowerRanges.fans.max}W per fan
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rgb">RGB Lighting (W)</Label>
                  <Input
                    id="rgb"
                    type="number"
                    min={componentPowerRanges.rgb.min}
                    max={componentPowerRanges.rgb.max}
                    value={components.rgb}
                    onChange={(e) => updateComponent('rgb', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.rgb.min}W - {componentPowerRanges.rgb.max}W
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other">Other Components (W)</Label>
                  <Input
                    id="other"
                    type="number"
                    min={componentPowerRanges.other.min}
                    max={componentPowerRanges.other.max}
                    value={components.other}
                    onChange={(e) => updateComponent('other', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Range: {componentPowerRanges.other.min}W - {componentPowerRanges.other.max}W
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PSU Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="efficiency">Efficiency Rating</Label>
                  <Select value={efficiency} onValueChange={setEfficiency}>
                    <SelectTrigger id="efficiency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(efficiencyRatings).map(([key, rating]) => (
                        <SelectItem key={key} value={key}>
                          {rating.name} ({rating.efficiency}% efficiency)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overhead">Overhead Percentage (%)</Label>
                  <Input
                    id="overhead"
                    type="number"
                    min={0}
                    max={50}
                    value={overhead}
                    onChange={(e) => setOverhead(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Recommended: 20-30% for headroom and future upgrades
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Power Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Component Power</div>
                  <div className="text-3xl font-bold">{totalPower}W</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Recommended PSU Wattage</div>
                  <div className="text-4xl font-bold text-primary">{recommendedPSU}W</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    With {overhead}% overhead
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">PSU Efficiency</div>
                  <Badge variant="outline" className="text-sm">
                    {efficiencyInfo.name} ({efficiencyInfo.efficiency}%)
                  </Badge>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Recommendation</div>
                      <div className="text-muted-foreground">
                        Choose a PSU rated at least <strong>{recommendedPSU}W</strong> with {efficiencyInfo.name} efficiency or better for optimal performance and future-proofing.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Power Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU</span>
                  <span className="font-medium">{components.cpu}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GPU</span>
                  <span className="font-medium">{components.gpu}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>RAM</span>
                  <span className="font-medium">{components.ram}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">{components.storage}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Motherboard</span>
                  <span className="font-medium">{components.motherboard}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fans</span>
                  <span className="font-medium">{components.fans}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>RGB</span>
                  <span className="font-medium">{components.rgb}W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other</span>
                  <span className="font-medium">{components.other}W</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{totalPower}W</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

