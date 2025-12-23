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

// Mock buying guides - Based on most searched topics on the internet
const mockGuides: BuyingGuide[] = [
  {
    id: 'best-smartphone-2024',
    title: 'Best Smartphones 2024: iPhone vs Android Buying Guide',
    description: 'Complete guide to choosing the best smartphone in 2024. Compare iPhone, Samsung, Google Pixel, and more. Find the perfect phone for your needs and budget.',
    category: 'Smartphones',
    niche: 'tech',
    sections: [
      {
        title: 'iPhone vs Android: Which is Right for You?',
        content: 'Understanding the differences between iOS and Android to make the right choice for your needs.',
      },
      {
        title: 'Budget Range ($200-$400)',
        content: 'Best value smartphones for budget-conscious buyers.',
      },
      {
        title: 'Mid-Range ($400-$800)',
        content: 'Sweet spot for most users with excellent features.',
      },
      {
        title: 'Flagship ($800-$1200)',
        content: 'Premium smartphones with cutting-edge features.',
      },
    ],
    recommendedProducts: ['iphone-15-pro', 'galaxy-s24-ultra', 'pixel-8-pro'],
    budgetRanges: [
      { min: 200, max: 400, label: 'Budget', recommendedProducts: ['pixel-7a', 'galaxy-a54'] },
      { min: 400, max: 800, label: 'Mid-Range', recommendedProducts: ['pixel-8', 'galaxy-s23'] },
      { min: 800, max: 1200, label: 'Flagship', recommendedProducts: ['iphone-15-pro', 'galaxy-s24-ultra'] },
    ],
    publishedAt: '2024-12-19',
    updatedAt: '2024-12-20',
    readTime: 25,
  },
  {
    id: 'best-laptop-students-2024',
    title: 'Best Laptops for Students 2024: Complete Buying Guide',
    description: 'Find the perfect student laptop for remote learning, note-taking, and productivity. Compare budget, mid-range, and premium options.',
    category: 'Laptops',
    niche: 'tech',
    sections: [
      {
        title: 'What Students Need in a Laptop',
        content: 'Essential features and considerations for student laptops.',
      },
      {
        title: 'Budget Range ($300-$600)',
        content: 'Affordable laptops perfect for students on a budget.',
      },
      {
        title: 'Mid-Range ($600-$1000)',
        content: 'Best value laptops with excellent performance.',
      },
      {
        title: 'Premium ($1000-$2000)',
        content: 'High-performance laptops for demanding students.',
      },
    ],
    recommendedProducts: ['macbook-air-m2', 'dell-xps-13', 'surface-laptop-5'],
    budgetRanges: [
      { min: 300, max: 600, label: 'Budget', recommendedProducts: ['chromebook', 'hp-pavilion-15'] },
      { min: 600, max: 1000, label: 'Mid-Range', recommendedProducts: ['macbook-air-m2', 'dell-xps-13'] },
      { min: 1000, max: 2000, label: 'Premium', recommendedProducts: ['macbook-pro-14', 'surface-laptop-studio'] },
    ],
    publishedAt: '2024-12-18',
    updatedAt: '2024-12-20',
    readTime: 22,
  },
  {
    id: 'best-wireless-earbuds-2024',
    title: 'Best Wireless Earbuds 2024: AirPods vs Alternatives',
    description: 'Complete guide to choosing the best wireless earbuds. Compare AirPods, Samsung Galaxy Buds, Sony, and more.',
    category: 'Audio',
    niche: 'tech',
    sections: [
      {
        title: 'Key Features to Consider',
        content: 'Sound quality, battery life, fit, and comfort considerations.',
      },
      {
        title: 'Budget Range ($50-$100)',
        content: 'Affordable earbuds with great value.',
      },
      {
        title: 'Mid-Range ($100-$200)',
        content: 'Best balance of features and price.',
      },
      {
        title: 'Premium ($200+)',
        content: 'Top-tier earbuds with advanced features.',
      },
    ],
    recommendedProducts: ['airpods-pro-2', 'sony-wf-1000xm5', 'galaxy-buds-2-pro'],
    budgetRanges: [
      { min: 50, max: 100, label: 'Budget', recommendedProducts: ['anker-liberty-4', 'galaxy-buds-fe'] },
      { min: 100, max: 200, label: 'Mid-Range', recommendedProducts: ['airpods-3', 'sony-wf-c700n'] },
      { min: 200, max: 400, label: 'Premium', recommendedProducts: ['airpods-pro-2', 'sony-wf-1000xm5'] },
    ],
    publishedAt: '2024-12-17',
    updatedAt: '2024-12-19',
    readTime: 18,
  },
  {
    id: 'best-gaming-console-2024',
    title: 'Best Gaming Consoles 2024: PlayStation vs Xbox vs Switch',
    description: 'Complete guide to choosing the best gaming console. Compare PlayStation 5, Xbox Series X/S, and Nintendo Switch.',
    category: 'Gaming Consoles',
    niche: 'gaming',
    sections: [
      {
        title: 'Console Comparison Overview',
        content: 'Understanding the differences between major console platforms.',
      },
      {
        title: 'PlayStation 5 Options',
        content: 'PS5 Disc vs Digital Edition comparison.',
      },
      {
        title: 'Xbox Series X/S Options',
        content: 'Xbox Series X vs Series S and Game Pass value.',
      },
      {
        title: 'Nintendo Switch Options',
        content: 'Switch OLED vs Switch vs Switch Lite comparison.',
      },
    ],
    recommendedProducts: ['ps5-disc', 'xbox-series-x', 'switch-oled'],
    budgetRanges: [
      { min: 200, max: 300, label: 'Budget', recommendedProducts: ['switch-lite', 'xbox-series-s'] },
      { min: 300, max: 400, label: 'Mid-Range', recommendedProducts: ['switch-oled', 'ps5-digital'] },
      { min: 400, max: 600, label: 'Premium', recommendedProducts: ['ps5-disc', 'xbox-series-x'] },
    ],
    publishedAt: '2024-12-16',
    updatedAt: '2024-12-19',
    readTime: 20,
  },
  {
    id: 'best-smartwatch-2024',
    title: 'Best Smartwatches 2024: Apple Watch vs Samsung vs Fitbit',
    description: 'Complete guide to choosing the best smartwatch. Compare Apple Watch, Samsung Galaxy Watch, Fitbit, and more.',
    category: 'Wearables',
    niche: 'tech',
    sections: [
      {
        title: 'Smartwatch vs Fitness Tracker',
        content: 'Understanding the differences and which is right for you.',
      },
      {
        title: 'Budget Range ($100-$200)',
        content: 'Affordable smartwatches and fitness trackers.',
      },
      {
        title: 'Mid-Range ($200-$400)',
        content: 'Best balance of features and price.',
      },
      {
        title: 'Premium ($400+)',
        content: 'Top-tier smartwatches with advanced features.',
      },
    ],
    recommendedProducts: ['apple-watch-9', 'galaxy-watch-6', 'garmin-venu-3'],
    budgetRanges: [
      { min: 100, max: 200, label: 'Budget', recommendedProducts: ['fitbit-charge-6', 'galaxy-watch-4'] },
      { min: 200, max: 400, label: 'Mid-Range', recommendedProducts: ['apple-watch-se', 'galaxy-watch-6'] },
      { min: 400, max: 1000, label: 'Premium', recommendedProducts: ['apple-watch-9', 'apple-watch-ultra-2'] },
    ],
    publishedAt: '2024-12-15',
    updatedAt: '2024-12-18',
    readTime: 19,
  },
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
  {
    id: 'best-gaming-chair-2024',
    title: 'Best Gaming Chairs 2024: Ergonomic Comfort Guide',
    description: 'Complete guide to choosing the best gaming chair. Compare ergonomic designs, comfort features, and price ranges for long gaming sessions.',
    category: 'Gaming Accessories',
    niche: 'gaming',
    sections: [
      {
        title: 'Why You Need a Gaming Chair',
        content: 'Benefits of proper ergonomic support for gaming.',
      },
      {
        title: 'Budget Range ($100-$200)',
        content: 'Affordable gaming chairs with good value.',
      },
      {
        title: 'Mid-Range ($200-$400)',
        content: 'Best balance of comfort and features.',
      },
      {
        title: 'Premium ($400+)',
        content: 'Top-tier ergonomic gaming chairs.',
      },
    ],
    recommendedProducts: ['secretlab-titan', 'herman-miller-logitech', 'noblechairs-hero'],
    budgetRanges: [
      { min: 100, max: 200, label: 'Budget', recommendedProducts: ['gtracing-pro', 'respawn-110'] },
      { min: 200, max: 400, label: 'Mid-Range', recommendedProducts: ['secretlab-titan', 'noblechairs-hero'] },
      { min: 400, max: 2000, label: 'Premium', recommendedProducts: ['herman-miller-embody', 'steelcase-gesture'] },
    ],
    publishedAt: '2024-12-14',
    updatedAt: '2024-12-17',
    readTime: 16,
  },
  {
    id: 'best-vpn-2024',
    title: 'Best VPN 2024: Complete Security & Privacy Guide',
    description: 'Comprehensive guide to choosing the best VPN service. Compare NordVPN, ExpressVPN, Surfshark, and more for privacy and security.',
    category: 'Security Software',
    niche: 'security',
    sections: [
      {
        title: 'Why You Need a VPN',
        content: 'Privacy protection and security benefits explained.',
      },
      {
        title: 'Budget Range ($0-$5/month)',
        content: 'Free and affordable VPN options.',
      },
      {
        title: 'Mid-Range ($5-$10/month)',
        content: 'Best value VPN services with excellent features.',
      },
      {
        title: 'Premium ($10+/month)',
        content: 'Top-tier VPN services with advanced security.',
      },
    ],
    recommendedProducts: ['nordvpn', 'expressvpn', 'surfshark'],
    budgetRanges: [
      { min: 0, max: 5, label: 'Budget', recommendedProducts: ['protonvpn-free', 'surfshark'] },
      { min: 5, max: 10, label: 'Mid-Range', recommendedProducts: ['nordvpn', 'expressvpn'] },
      { min: 10, max: 15, label: 'Premium', recommendedProducts: ['expressvpn-premium', 'nordvpn-premium'] },
    ],
    publishedAt: '2024-12-13',
    updatedAt: '2024-12-16',
    readTime: 17,
  },
  {
    id: 'best-gaming-monitor-2024',
    title: 'Best Gaming Monitors 2024: 4K, 1440p, and 1080p Guide',
    description: 'Complete guide to choosing the best gaming monitor. Compare refresh rates, resolutions, and panel types for competitive and immersive gaming.',
    category: 'Monitors',
    niche: 'gaming',
    sections: [
      {
        title: 'Understanding Monitor Specifications',
        content: 'Resolution, refresh rate, and response time explained.',
      },
      {
        title: 'Budget Range ($150-$300)',
        content: 'Affordable gaming monitors with good performance.',
      },
      {
        title: 'Mid-Range ($300-$600)',
        content: 'Best value monitors for most gamers.',
      },
      {
        title: 'Premium ($600+)',
        content: 'Top-tier monitors with cutting-edge features.',
      },
    ],
    recommendedProducts: ['lg-27gp850', 'asus-rog-pg279qm', 'alienware-aw3423dw'],
    budgetRanges: [
      { min: 150, max: 300, label: 'Budget', recommendedProducts: ['asus-tuf-vg249q', 'acer-nitro-xf243y'] },
      { min: 300, max: 600, label: 'Mid-Range', recommendedProducts: ['lg-27gp850', 'samsung-odyssey-g7'] },
      { min: 600, max: 2000, label: 'Premium', recommendedProducts: ['asus-rog-pg32ucdm', 'alienware-aw3423dw'] },
    ],
    publishedAt: '2024-12-12',
    updatedAt: '2024-12-15',
    readTime: 21,
  },
  {
    id: 'best-wifi-router-2024',
    title: 'Best Wi-Fi Routers 2024: Mesh vs Traditional Guide',
    description: 'Complete guide to choosing the best Wi-Fi router. Compare mesh systems, traditional routers, and gaming routers for your home network.',
    category: 'Networking',
    niche: 'tech',
    sections: [
      {
        title: 'Router Types Explained',
        content: 'Traditional routers vs mesh systems vs gaming routers.',
      },
      {
        title: 'Budget Range ($50-$150)',
        content: 'Affordable routers with good performance.',
      },
      {
        title: 'Mid-Range ($150-$400)',
        content: 'Best value routers for most homes.',
      },
      {
        title: 'Premium ($400+)',
        content: 'Top-tier routers with advanced features.',
      },
    ],
    recommendedProducts: ['asus-rt-ax86u', 'eero-6-plus', 'asus-rog-gt-ax11000'],
    budgetRanges: [
      { min: 50, max: 150, label: 'Budget', recommendedProducts: ['tp-link-ax21', 'asus-rt-ax55'] },
      { min: 150, max: 400, label: 'Mid-Range', recommendedProducts: ['asus-rt-ax86u', 'eero-6-plus'] },
      { min: 400, max: 2000, label: 'Premium', recommendedProducts: ['asus-rog-gt-ax11000', 'netgear-orbi-rbke963'] },
    ],
    publishedAt: '2024-12-11',
    updatedAt: '2024-12-14',
    readTime: 18,
  },
  {
    id: 'best-gaming-mouse-2024',
    title: 'Best Gaming Mice 2024: Wired vs Wireless Guide',
    description: 'Complete guide to choosing the best gaming mouse. Compare wired and wireless options, sensor types, and DPI settings for FPS, MOBA, and MMO gaming.',
    category: 'Gaming Accessories',
    niche: 'gaming',
    sections: [
      {
        title: 'Wired vs Wireless Gaming Mice',
        content: 'Understanding the differences and which is right for you.',
      },
      {
        title: 'Budget Range ($20-$50)',
        content: 'Affordable gaming mice with good performance.',
      },
      {
        title: 'Mid-Range ($50-$100)',
        content: 'Best balance of features and price.',
      },
      {
        title: 'Premium ($100+)',
        content: 'Top-tier gaming mice with advanced features.',
      },
    ],
    recommendedProducts: ['logitech-g-pro-superlight', 'razer-viper-v2-pro', 'razer-deathadder-v3-pro'],
    budgetRanges: [
      { min: 20, max: 50, label: 'Budget', recommendedProducts: ['logitech-g203', 'razer-deathadder-essential'] },
      { min: 50, max: 100, label: 'Mid-Range', recommendedProducts: ['steelseries-aerox-5', 'logitech-g-pro-superlight'] },
      { min: 100, max: 200, label: 'Premium', recommendedProducts: ['finalmouse-starlight', 'razer-deathadder-v3-pro'] },
    ],
    publishedAt: '2024-12-10',
    updatedAt: '2024-12-13',
    readTime: 17,
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

