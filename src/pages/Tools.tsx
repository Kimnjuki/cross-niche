import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Cpu, 
  Zap, 
  Shield, 
  TrendingUp,
  Settings,
  Monitor,
  HardDrive,
  Network,
  Lock,
  Wifi,
  Gamepad2,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'hardware' | 'security' | 'performance' | 'gaming';
  niche: 'tech' | 'security' | 'gaming';
  url: string;
  featured?: boolean;
}

const tools: Tool[] = [
  {
    id: 'psu-calculator',
    name: 'PSU Calculator',
    description: 'Calculate the power supply wattage needed for your PC build',
    icon: Zap,
    category: 'hardware',
    niche: 'tech',
    url: '/tools/psu-calculator',
    featured: true,
  },
  {
    id: 'security-risk-calculator',
    name: 'Security Risk Calculator',
    description: 'Assess your system\'s security risk based on hardware and software configuration',
    icon: Shield,
    category: 'security',
    niche: 'security',
    url: '/tools/security-risk',
    featured: true,
  },
  {
    id: 'fps-estimator',
    name: 'FPS Performance Estimator',
    description: 'Estimate gaming FPS based on your hardware configuration',
    icon: TrendingUp,
    category: 'gaming',
    niche: 'gaming',
    url: '/tools/fps-estimator',
    featured: true,
  },
  {
    id: 'compatibility-checker',
    name: 'Build Compatibility Checker',
    description: 'Verify component compatibility for your PC build',
    icon: Settings,
    category: 'hardware',
    niche: 'tech',
    url: '/tools/compatibility',
  },
  {
    id: 'nexus-score-calculator',
    name: 'Nexus Risk Score Calculator',
    description: 'Calculate Nexus Risk Rating for security vulnerabilities',
    icon: Shield,
    category: 'security',
    niche: 'security',
    url: '/tools/nexus-calculator',
  },
  {
    id: 'storage-calculator',
    name: 'Storage Calculator',
    description: 'Calculate storage needs for games, media, and applications',
    icon: HardDrive,
    category: 'hardware',
    niche: 'tech',
    url: '/tools/storage',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure, random passwords with customizable options',
    icon: Lock,
    category: 'security',
    niche: 'security',
    url: '/tools/password-generator',
    featured: true,
  },
  {
    id: 'bandwidth-calculator',
    name: 'Bandwidth Calculator',
    description: 'Calculate internet bandwidth needs for streaming, gaming, and downloads',
    icon: Network,
    category: 'performance',
    niche: 'tech',
    url: '/tools/bandwidth',
  },
  {
    id: 'ping-latency-test',
    name: 'Ping & Latency Test',
    description: 'Test your network latency and ping for optimal gaming performance',
    icon: Wifi,
    category: 'gaming',
    niche: 'gaming',
    url: '/tools/ping-test',
  },
  {
    id: 'file-size-converter',
    name: 'File Size Converter',
    description: 'Convert between different file size units (KB, MB, GB, TB)',
    icon: FileText,
    category: 'hardware',
    niche: 'tech',
    url: '/tools/file-converter',
  },
  {
    id: 'price-per-gb',
    name: 'Price per GB Calculator',
    description: 'Compare storage prices to find the best value per gigabyte',
    icon: DollarSign,
    category: 'hardware',
    niche: 'tech',
    url: '/tools/price-per-gb',
  },
  {
    id: 'download-time',
    name: 'Download Time Calculator',
    description: 'Calculate how long downloads will take based on file size and speed',
    icon: Clock,
    category: 'performance',
    niche: 'tech',
    url: '/tools/download-time',
  },
  {
    id: 'gaming-setup-optimizer',
    name: 'Gaming Setup Optimizer',
    description: 'Optimize your gaming setup for best performance and experience',
    icon: Gamepad2,
    category: 'gaming',
    niche: 'gaming',
    url: '/tools/gaming-optimizer',
  },
];

export default function Tools() {
  const categories = Array.from(new Set(tools.map(t => t.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = tools.filter(tool => 
    selectedCategory === 'all' || tool.category === selectedCategory
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Interactive Tools</h1>
              <p className="text-muted-foreground">Calculators and tools for tech, security, and gaming</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Tools
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Featured Tools */}
        {selectedCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.filter(t => t.featured).map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.id} to={tool.url}>
                    <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            'p-2 rounded-lg',
                            tool.niche === 'tech' && 'bg-tech/10',
                            tool.niche === 'security' && 'bg-security/10',
                            tool.niche === 'gaming' && 'bg-gaming/10',
                          )}>
                            <Icon className={cn(
                              'h-6 w-6',
                              tool.niche === 'tech' && 'text-tech',
                              tool.niche === 'security' && 'text-security',
                              tool.niche === 'gaming' && 'text-gaming',
                            )} />
                          </div>
                          <Badge className={cn(
                            tool.niche === 'tech' && 'bg-tech/10 text-tech border-tech/20',
                            tool.niche === 'security' && 'bg-security/10 text-security border-security/20',
                            tool.niche === 'gaming' && 'bg-gaming/10 text-gaming border-gaming/20',
                          )}>
                            {tool.niche}
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="outline">
                          Use Tool
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Tools */}
        <div>
          {selectedCategory !== 'all' && (
            <h2 className="text-2xl font-semibold mb-4 capitalize">{selectedCategory} Tools</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} to={tool.url}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          'p-2 rounded-lg',
                          tool.niche === 'tech' && 'bg-tech/10',
                          tool.niche === 'security' && 'bg-security/10',
                          tool.niche === 'gaming' && 'bg-gaming/10',
                        )}>
                          <Icon className={cn(
                            'h-5 w-5',
                            tool.niche === 'tech' && 'text-tech',
                            tool.niche === 'security' && 'text-security',
                            tool.niche === 'gaming' && 'text-gaming',
                          )} />
                        </div>
                        <Badge variant="outline" className="capitalize text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors text-lg">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline" size="sm">
                        Use Tool
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

