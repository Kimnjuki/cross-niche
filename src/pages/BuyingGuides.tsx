import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BuyingGuide } from '@/types/products';

// Mock buying guides
const mockGuides: BuyingGuide[] = [
  {
    id: 'best-gaming-gpu-2024',
    title: 'Best Gaming GPUs 2024: Complete Buying Guide',
    description: 'Everything you need to know to choose the perfect graphics card for your gaming setup, from budget to enthusiast level.',
    category: 'Graphics Cards',
    niche: 'gaming',
    sections: [
      {
        title: 'Understanding GPU Specifications',
        content: 'Learn about CUDA cores, memory, clock speeds, and how they affect gaming performance.',
      },
      {
        title: 'Budget Range ($300-$500)',
        content: 'Best value GPUs for 1080p and 1440p gaming without breaking the bank.',
      },
      {
        title: 'Mid-Range ($500-$800)',
        content: 'Sweet spot for 1440p gaming with excellent performance per dollar.',
      },
      {
        title: 'High-End ($800-$1500)',
        content: 'Premium GPUs for 4K gaming and content creation.',
      },
      {
        title: 'Enthusiast ($1500+)',
        content: 'Top-tier GPUs for maximum performance and future-proofing.',
      },
    ],
    recommendedProducts: ['rtx-5090', 'rtx-4090', 'rx-7900-xtx'],
    budgetRanges: [
      {
        min: 300,
        max: 500,
        label: 'Budget',
        recommendedProducts: ['rtx-4060', 'rx-7600'],
      },
      {
        min: 500,
        max: 800,
        label: 'Mid-Range',
        recommendedProducts: ['rtx-4070', 'rx-7700-xt'],
      },
      {
        min: 800,
        max: 1500,
        label: 'High-End',
        recommendedProducts: ['rtx-4080', 'rx-7900-xt'],
      },
      {
        min: 1500,
        max: 3000,
        label: 'Enthusiast',
        recommendedProducts: ['rtx-5090', 'rtx-4090'],
      },
    ],
    publishedAt: '2024-12-18',
    updatedAt: '2024-12-20',
    readTime: 20,
  },
  {
    id: 'best-gaming-keyboard-2024',
    title: 'Best Gaming Keyboards 2024: Mechanical vs Membrane',
    description: 'Complete guide to choosing the perfect gaming keyboard, from mechanical switches to RGB lighting.',
    category: 'Peripherals',
    niche: 'gaming',
    sections: [
      {
        title: 'Mechanical vs Membrane',
        content: 'Understanding the differences and which is right for you.',
      },
      {
        title: 'Switch Types Explained',
        content: 'Linear, tactile, and clicky switches - what they mean for gaming.',
      },
      {
        title: 'Key Features to Consider',
        content: 'RGB lighting, macro keys, wireless options, and more.',
      },
    ],
    recommendedProducts: [],
    budgetRanges: [
      {
        min: 50,
        max: 100,
        label: 'Budget',
        recommendedProducts: [],
      },
      {
        min: 100,
        max: 200,
        label: 'Mid-Range',
        recommendedProducts: [],
      },
      {
        min: 200,
        max: 500,
        label: 'Premium',
        recommendedProducts: [],
      },
    ],
    publishedAt: '2024-12-15',
    updatedAt: '2024-12-18',
    readTime: 15,
  },
  {
    id: 'best-security-software-2024',
    title: 'Best Security Software 2024: Antivirus & VPN Guide',
    description: 'Comprehensive guide to protecting your devices with the best security software and VPNs.',
    category: 'Software',
    niche: 'security',
    sections: [
      {
        title: 'Antivirus vs Internet Security',
        content: 'Understanding the differences and what you need.',
      },
      {
        title: 'VPN Essentials',
        content: 'Why you need a VPN and what to look for.',
      },
      {
        title: 'Free vs Paid Options',
        content: 'When free security software is enough and when to pay.',
      },
    ],
    recommendedProducts: [],
    budgetRanges: [
      {
        min: 0,
        max: 50,
        label: 'Free',
        recommendedProducts: [],
      },
      {
        min: 50,
        max: 100,
        label: 'Budget',
        recommendedProducts: [],
      },
      {
        min: 100,
        max: 200,
        label: 'Premium',
        recommendedProducts: [],
      },
    ],
    publishedAt: '2024-12-10',
    updatedAt: '2024-12-15',
    readTime: 18,
  },
];

export default function BuyingGuides() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');

  const categories = Array.from(new Set(mockGuides.map(g => g.category)));
  const filteredGuides = mockGuides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesNiche = selectedNiche === 'all' || guide.niche === selectedNiche;
    return matchesCategory && matchesNiche;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Buying Guides</h1>
              <p className="text-muted-foreground">Expert recommendations for tech, security, and gaming products</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <Tabs value={selectedNiche} onValueChange={(v) => setSelectedNiche(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All Niches</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Link key={guide.id} to={`/buying-guide/${guide.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={cn(
                      guide.niche === 'tech' && 'bg-tech/10 text-tech border-tech/20',
                      guide.niche === 'security' && 'bg-security/10 text-security border-security/20',
                      guide.niche === 'gaming' && 'bg-gaming/10 text-gaming border-gaming/20',
                    )}>
                      {guide.category}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" />
                      Expert
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Budget Ranges */}
                    <div>
                      <div className="text-sm font-medium mb-2">Budget Ranges</div>
                      <div className="flex flex-wrap gap-2">
                        {guide.budgetRanges.map((range, idx) => (
                          <Badge key={idx} variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            {range.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                      <span>{guide.readTime} min read</span>
                      <span>{guide.sections.length} sections</span>
                      {guide.recommendedProducts.length > 0 && (
                        <span>{guide.recommendedProducts.length} products</span>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      asChild
                    >
                      <Link to={`/buying-guide/${guide.id}`}>
                        Read Guide
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

