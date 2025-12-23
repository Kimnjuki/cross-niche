import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface HardwareConfig {
  cpu: string;
  gpu: string;
  ram: string;
  resolution: string;
  game: string;
}

const fpsEstimates: Record<string, Record<string, Record<string, number>>> = {
  '1080p': {
    'low': { 'low': 30, 'medium': 60, 'high': 90, 'ultra': 120 },
    'medium': { 'low': 60, 'medium': 90, 'high': 120, 'ultra': 144 },
    'high': { 'low': 90, 'medium': 120, 'high': 144, 'ultra': 165 },
    'ultra': { 'low': 120, 'medium': 144, 'high': 165, 'ultra': 200 },
  },
  '1440p': {
    'low': { 'low': 25, 'medium': 45, 'high': 60, 'ultra': 80 },
    'medium': { 'low': 45, 'medium': 60, 'high': 90, 'ultra': 120 },
    'high': { 'low': 60, 'medium': 90, 'high': 120, 'ultra': 144 },
    'ultra': { 'low': 90, 'medium': 120, 'high': 144, 'ultra': 165 },
  },
  '4k': {
    'low': { 'low': 20, 'medium': 30, 'high': 45, 'ultra': 60 },
    'medium': { 'low': 30, 'medium': 45, 'high': 60, 'ultra': 80 },
    'high': { 'low': 45, 'medium': 60, 'high': 80, 'ultra': 100 },
    'ultra': { 'low': 60, 'medium': 80, 'high': 100, 'ultra': 120 },
  },
};

export default function FPSEstimator() {
  const [config, setConfig] = useState<HardwareConfig>({
    cpu: 'medium',
    gpu: 'medium',
    ram: '16gb',
    resolution: '1080p',
    game: 'medium',
  });

  const getFPS = (): number => {
    const resolutionData = fpsEstimates[config.resolution];
    if (!resolutionData) return 60;

    const gpuTier = config.gpu;
    const gameTier = config.game;

    const baseFPS = resolutionData[gpuTier]?.[gameTier] || 60;

    // CPU adjustment
    const cpuMultiplier: Record<string, number> = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.1,
      'ultra': 1.2,
    };

    // RAM adjustment
    const ramMultiplier: Record<string, number> = {
      '8gb': 0.9,
      '16gb': 1.0,
      '32gb': 1.05,
      '64gb': 1.05,
    };

    const adjustedFPS = Math.round(
      baseFPS * (cpuMultiplier[config.cpu] || 1.0) * (ramMultiplier[config.ram] || 1.0)
    );

    return Math.max(20, Math.min(300, adjustedFPS));
  };

  const estimatedFPS = getFPS();

  const getPerformanceLevel = (fps: number): { level: string; color: string; description: string } => {
    if (fps >= 144) {
      return {
        level: 'Excellent',
        color: 'text-green-500',
        description: 'Smooth gaming experience with high refresh rate support',
      };
    } else if (fps >= 60) {
      return {
        level: 'Good',
        color: 'text-blue-500',
        description: 'Smooth gameplay at standard frame rates',
      };
    } else if (fps >= 30) {
      return {
        level: 'Playable',
        color: 'text-yellow-500',
        description: 'Playable but may experience some stuttering',
      };
    } else {
      return {
        level: 'Poor',
        color: 'text-red-500',
        description: 'May experience significant performance issues',
      };
    }
  };

  const performanceLevel = getPerformanceLevel(estimatedFPS);

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
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">FPS Performance Estimator</h1>
              <p className="text-muted-foreground">Estimate gaming FPS based on your hardware configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hardware Configuration</CardTitle>
                <CardDescription>Select your hardware specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU Tier</Label>
                  <Select value={config.cpu} onValueChange={(value) => setConfig({ ...config, cpu: value })}>
                    <SelectTrigger id="cpu">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Budget CPUs)</SelectItem>
                      <SelectItem value="medium">Medium (Mid-range CPUs)</SelectItem>
                      <SelectItem value="high">High (High-end CPUs)</SelectItem>
                      <SelectItem value="ultra">Ultra (Flagship CPUs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpu">GPU Tier</Label>
                  <Select value={config.gpu} onValueChange={(value) => setConfig({ ...config, gpu: value })}>
                    <SelectTrigger id="gpu">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (GTX 1660 / RX 580)</SelectItem>
                      <SelectItem value="medium">Medium (RTX 3060 / RX 6600)</SelectItem>
                      <SelectItem value="high">High (RTX 4070 / RX 7700 XT)</SelectItem>
                      <SelectItem value="ultra">Ultra (RTX 4090 / RX 7900 XTX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM Amount</Label>
                  <Select value={config.ram} onValueChange={(value) => setConfig({ ...config, ram: value })}>
                    <SelectTrigger id="ram">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8gb">8GB</SelectItem>
                      <SelectItem value="16gb">16GB</SelectItem>
                      <SelectItem value="32gb">32GB</SelectItem>
                      <SelectItem value="64gb">64GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolution</Label>
                  <Select value={config.resolution} onValueChange={(value) => setConfig({ ...config, resolution: value })}>
                    <SelectTrigger id="resolution">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="1440p">1440p (QHD)</SelectItem>
                      <SelectItem value="4k">4K (UHD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game">Game Intensity</Label>
                  <Select value={config.game} onValueChange={(value) => setConfig({ ...config, game: value })}>
                    <SelectTrigger id="game">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Indie, Older Games)</SelectItem>
                      <SelectItem value="medium">Medium (Most AAA Games)</SelectItem>
                      <SelectItem value="high">High (Demanding AAA Games)</SelectItem>
                      <SelectItem value="ultra">Ultra (Most Demanding Games)</SelectItem>
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
                <CardTitle>Estimated Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated FPS</div>
                  <div className="text-5xl font-bold text-primary">{estimatedFPS}</div>
                  <div className="text-xs text-muted-foreground mt-1">Frames Per Second</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Performance Level</div>
                  <Badge className={`text-base px-3 py-1 ${performanceLevel.color} border-current`}>
                    {performanceLevel.level}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    {performanceLevel.description}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Configuration</div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Resolution: {config.resolution}</div>
                    <div>GPU: {config.gpu}</div>
                    <div>CPU: {config.cpu}</div>
                    <div>RAM: {config.ram.toUpperCase()}</div>
                    <div>Game: {config.game}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <strong>Note:</strong> This is an estimate based on typical performance. Actual FPS may vary based on specific game optimization, driver versions, and system configuration.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

