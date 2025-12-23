import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  Star,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import type { BuyingGuide } from '@/types/products';

// Mock buying guide data (in production, fetch from API)
const mockGuides: Record<string, BuyingGuide> = {
  'best-gaming-gpu-2024': {
    id: 'best-gaming-gpu-2024',
    title: 'Best Gaming GPUs 2024: Complete Buying Guide',
    description: 'Everything you need to know to choose the perfect graphics card for your gaming setup, from budget to enthusiast level.',
    category: 'Graphics Cards',
    niche: 'gaming',
    sections: [
      {
        title: 'Understanding GPU Specifications',
        content: `When shopping for a gaming GPU, understanding the key specifications is crucial:

**CUDA Cores / Stream Processors**: The number of processing units. More cores generally mean better performance, but architecture matters too.

**Memory (VRAM)**: Video RAM stores textures and game data. For 1080p gaming, 8GB is sufficient. For 1440p, aim for 12GB+. For 4K, 16GB+ is recommended.

**Memory Bus Width**: Wider buses allow faster data transfer. 256-bit is standard for mid-range, 384-bit+ for high-end.

**Clock Speeds**: Base and boost clocks determine how fast the GPU processes data. Higher is generally better, but real-world performance depends on the game.

**TDP (Thermal Design Power)**: Power consumption in watts. Higher TDP means more heat and requires a better PSU.

**Ray Tracing Cores**: Dedicated hardware for real-time ray tracing. NVIDIA's RT cores and AMD's RT accelerators handle this.

**Tensor Cores / AI Accelerators**: Used for DLSS, FSR, and other AI-enhanced features.`,
      },
      {
        title: 'Budget Range ($300-$500)',
        content: `For budget-conscious gamers, these GPUs offer excellent value:

**NVIDIA RTX 4060** ($299)
- 8GB GDDR6
- Excellent 1080p performance
- DLSS 3 support
- Low power consumption (115W)
- Best for: 1080p gaming, entry-level 1440p

**AMD RX 7600** ($269)
- 8GB GDDR6
- Strong 1080p performance
- FSR 2/3 support
- Great value proposition
- Best for: 1080p gaming, budget builds

**Recommendation**: The RTX 4060 offers better ray tracing and DLSS, while the RX 7600 provides better raw performance per dollar.`,
        products: ['rtx-4060', 'rx-7600'],
      },
      {
        title: 'Mid-Range ($500-$800)',
        content: `The sweet spot for most gamers, offering excellent 1440p performance:

**NVIDIA RTX 4070** ($599)
- 12GB GDDR6X
- Excellent 1440p performance
- DLSS 3 support
- Efficient power usage
- Best for: 1440p gaming, entry-level 4K with DLSS

**AMD RX 7700 XT** ($449)
- 12GB GDDR6
- Strong 1440p performance
- FSR support
- Great value
- Best for: 1440p gaming, high refresh rate

**Recommendation**: The RTX 4070 is the better choice for ray tracing and AI features, while the RX 7700 XT offers better value for pure rasterization performance.`,
        products: ['rtx-4070', 'rx-7700-xt'],
      },
      {
        title: 'High-End ($800-$1500)',
        content: `Premium GPUs for 4K gaming and content creation:

**NVIDIA RTX 4080** ($1,199)
- 16GB GDDR6X
- Excellent 4K performance
- DLSS 3 support
- Strong ray tracing
- Best for: 4K gaming, content creation, VR

**AMD RX 7900 XT** ($899)
- 20GB GDDR6
- Strong 4K performance
- FSR support
- More VRAM
- Best for: 4K gaming, high refresh rate 1440p

**Recommendation**: The RTX 4080 excels in ray tracing and AI features, while the RX 7900 XT offers more VRAM and better value.`,
        products: ['rtx-4080', 'rx-7900-xt'],
      },
      {
        title: 'Enthusiast ($1500+)',
        content: `The absolute best GPUs money can buy:

**NVIDIA RTX 5090** ($1,999)
- 32GB GDDR7
- Unmatched 4K/8K performance
- DLSS 3.5 support
- Industry-leading ray tracing
- Best for: 4K/8K gaming, professional content creation, AI workloads

**NVIDIA RTX 4090** ($1,599)
- 24GB GDDR6X
- Excellent 4K performance
- DLSS 3 support
- Still very powerful
- Best for: 4K gaming, content creation

**Recommendation**: The RTX 5090 is the ultimate choice if budget allows. The RTX 4090 remains excellent and offers better value.`,
        products: ['rtx-5090', 'rtx-4090'],
      },
      {
        title: 'What to Consider',
        content: `Beyond raw performance, consider:

**Power Supply**: High-end GPUs require 750W+ PSUs. Check your PSU's capacity and connectors.

**Case Size**: Modern GPUs are large. Ensure your case can accommodate the length and height.

**Cooling**: Good airflow is essential. Consider case fans and GPU cooling solutions.

**Monitor Resolution**: Match your GPU to your monitor. 1080p doesn't need a 4090.

**Future-Proofing**: Consider how long you want to keep the GPU. Higher-end models last longer.

**Ray Tracing**: If you care about ray tracing, NVIDIA has the advantage.

**VRAM**: More VRAM helps with high-resolution textures and future-proofing.`,
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
  'best-gaming-keyboard-2024': {
    id: 'best-gaming-keyboard-2024',
    title: 'Best Gaming Keyboards 2024: Mechanical vs Membrane',
    description: 'Complete guide to choosing the perfect gaming keyboard, from mechanical switches to RGB lighting.',
    category: 'Peripherals',
    niche: 'gaming',
    sections: [
      {
        title: 'Mechanical vs Membrane',
        content: `**Mechanical Keyboards**:
- Individual switches for each key
- Tactile feedback and audible click
- Longer lifespan (50-100 million keystrokes)
- More expensive
- Better for gaming and typing

**Membrane Keyboards**:
- Rubber dome switches
- Quieter operation
- Lower cost
- Shorter lifespan
- Adequate for casual gaming

**Recommendation**: For serious gaming, mechanical keyboards offer better responsiveness and durability.`,
      },
      {
        title: 'Switch Types Explained',
        content: `**Linear Switches** (Red, Black):
- Smooth keystroke with no tactile bump
- Quiet operation
- Best for: Gaming, fast typing
- Examples: Cherry MX Red, Gateron Red

**Tactile Switches** (Brown, Clear):
- Tactile bump when key activates
- No audible click
- Best for: Typing, general use
- Examples: Cherry MX Brown, Gateron Brown

**Clicky Switches** (Blue, Green):
- Tactile bump with audible click
- Satisfying feedback
- Best for: Typing (can be loud)
- Examples: Cherry MX Blue, Gateron Blue`,
      },
      {
        title: 'Key Features to Consider',
        content: `**RGB Lighting**: Customizable lighting for aesthetics and visibility in dark environments.

**Macro Keys**: Programmable keys for complex commands and shortcuts.

**Wireless Options**: Bluetooth or 2.4GHz wireless for cleaner setups.

**Build Quality**: Metal construction, PBT keycaps, and robust switches.

**Software**: Customization software for key mapping and lighting.

**N-Key Rollover**: Ability to press multiple keys simultaneously without conflicts.`,
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
  'best-security-software-2024': {
    id: 'best-security-software-2024',
    title: 'Best Security Software 2024: Antivirus & VPN Guide',
    description: 'Comprehensive guide to protecting your devices with the best security software and VPNs.',
    category: 'Software',
    niche: 'security',
    sections: [
      {
        title: 'Antivirus vs Internet Security',
        content: `**Antivirus Software**:
- Basic malware protection
- Real-time scanning
- Lower cost
- Essential for all users

**Internet Security Suites**:
- Antivirus + firewall + VPN + more
- Comprehensive protection
- Higher cost
- Best for: Users who want all-in-one solution

**Recommendation**: For most users, a good antivirus is sufficient. Internet Security suites are better for families or users who want comprehensive protection.`,
      },
      {
        title: 'VPN Essentials',
        content: `**Why You Need a VPN**:
- Encrypts internet traffic
- Hides your IP address
- Bypasses geo-restrictions
- Protects on public Wi-Fi

**What to Look For**:
- No-logs policy
- Strong encryption (AES-256)
- Kill switch
- Fast speeds
- Server locations

**Best VPNs**: NordVPN, ExpressVPN, Surfshark, ProtonVPN`,
      },
      {
        title: 'Free vs Paid Options',
        content: `**Free Antivirus**:
- Basic protection
- Limited features
- May include ads
- Good for: Budget users, basic protection

**Paid Antivirus**:
- Advanced protection
- No ads
- Additional features
- Better support
- Good for: Serious protection needs

**Recommendation**: Free antivirus is better than nothing, but paid options offer significantly better protection and features.`,
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
};

export default function BuyingGuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? mockGuides[id] : null;

  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">The buying guide you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/buying-guides">Browse All Guides</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={guide.title}
        description={guide.description}
        keywords={[guide.category, guide.niche]}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/buying-guides" className="hover:text-foreground">Buying Guides</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{guide.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          to="/buying-guides"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buying Guides
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={cn(
                  guide.niche === 'tech' && 'bg-tech/10 text-tech border-tech/20',
                  guide.niche === 'security' && 'bg-security/10 text-security border-security/20',
                  guide.niche === 'gaming' && 'bg-gaming/10 text-gaming border-gaming/20',
                )}>
                  {guide.category}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3" />
                  Expert Guide
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {guide.readTime} min read
                </div>
              </div>
              <h1 className="font-display font-bold text-4xl mb-4">{guide.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{guide.description}</p>
            </div>

            {/* Guide Sections */}
            <div className="space-y-8">
              {guide.sections.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {idx + 1}
                      </span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap">{section.content}</div>
                    </div>
                    
                    {/* Featured Products in Section */}
                    {section.products && section.products.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-semibold mb-3">Featured Products</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {section.products.map((productId) => (
                            <Button
                              key={productId}
                              variant="outline"
                              className="justify-start h-auto p-4"
                              asChild
                            >
                              <Link to={`/review/${productId}`}>
                                <div className="text-left">
                                  <div className="font-medium">View {productId}</div>
                                  <div className="text-xs text-muted-foreground">Product Review</div>
                                </div>
                                <ExternalLink className="h-4 w-4 ml-auto" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Budget Ranges Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.budgetRanges.map((range, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{range.label}</Badge>
                        <span className="text-sm font-medium">
                          ${range.min.toLocaleString()} - ${range.max.toLocaleString()}
                        </span>
                      </div>
                      {range.recommendedProducts.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {range.recommendedProducts.map((productId) => (
                            <Link
                              key={productId}
                              to={`/review/${productId}`}
                              className="text-sm text-primary hover:underline block"
                            >
                              → {productId}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Guide Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <Badge>{guide.category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Read Time</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {guide.readTime} minutes
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Sections</div>
                  <div>{guide.sections.length} sections</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                  <div>{new Date(guide.updatedAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            {guide.recommendedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guide.recommendedProducts.map((productId) => (
                      <Button
                        key={productId}
                        variant="outline"
                        className="w-full justify-between"
                        asChild
                      >
                        <Link to={`/review/${productId}`}>
                          <span>{productId}</span>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Guides */}
            <Card>
              <CardHeader>
                <CardTitle>Related Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.values(mockGuides)
                    .filter(g => g.id !== guide.id && g.category === guide.category)
                    .slice(0, 3)
                    .map((relatedGuide) => (
                      <Link
                        key={relatedGuide.id}
                        to={`/buying-guide/${relatedGuide.id}`}
                        className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                      >
                        <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {relatedGuide.title}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{relatedGuide.readTime} min</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

