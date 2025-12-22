import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Check, 
  X, 
  ShoppingCart, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Users,
  Clock,
  Video,
  ChevronRight
} from 'lucide-react';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import type { Product, ExpertReview, UserReview } from '@/types/products';

// Mock product data
const mockProduct: Product = {
  id: 'nvidia-rtx-5090',
  name: 'NVIDIA GeForce RTX 5090',
  brand: 'NVIDIA',
  category: 'hardware',
  subcategory: 'Graphics Card',
  niche: 'gaming',
  description: 'The flagship GPU from NVIDIA\'s latest generation, delivering unprecedented ray tracing performance and AI acceleration.',
  imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=675&fit=crop&q=80',
  price: {
    current: 1999,
    currency: 'USD',
    original: 2299,
    discount: 13,
    availability: 'in-stock',
  },
  rating: {
    overall: 9.2,
    breakdown: {
      performance: 9.8,
      value: 8.5,
      design: 9.0,
      features: 9.5,
      easeOfUse: 9.0,
    },
    reviewCount: 24,
    userRating: 4.6,
    userReviewCount: 342,
  },
  pros: [
    'Exceptional 4K gaming performance',
    'Industry-leading ray tracing',
    'DLSS 3.5 support',
    'Excellent power efficiency',
    'Future-proof architecture',
  ],
  cons: [
    'Very expensive',
    'Requires high-wattage PSU',
    'Large physical size',
    'Limited availability',
  ],
  specifications: {
    'GPU Architecture': 'Blackwell',
    'CUDA Cores': '21,760',
    'Base Clock': '2,235 MHz',
    'Boost Clock': '2,520 MHz',
    'Memory': '32 GB GDDR7',
    'Memory Speed': '28 Gbps',
    'Memory Bus': '512-bit',
    'TDP': '575W',
    'Power Connectors': '16-pin (12V-2x6)',
    'Display Outputs': '3x DisplayPort 2.1, 1x HDMI 2.1',
    'Ray Tracing Cores': '3rd Gen',
    'Tensor Cores': '5th Gen',
  },
  features: [
    'DLSS 3.5 Super Resolution',
    'Ray Reconstruction',
    'Frame Generation',
    'Reflex Low Latency',
    'AV1 Encoding',
    '8K Gaming Support',
  ],
  tags: ['GPU', 'Gaming', 'Ray Tracing', 'AI', '4K', '8K'],
  publishedAt: '2024-12-18',
  updatedAt: '2024-12-20',
  expertReview: {
    id: 'expert-rtx-5090',
    productId: 'nvidia-rtx-5090',
    author: 'Marcus Johnson',
    authorTitle: 'Senior Hardware Reviewer',
    rating: 9.2,
    verdict: 'Buy',
    summary: 'The RTX 5090 is the most powerful consumer GPU available, delivering exceptional performance for 4K and 8K gaming. While expensive, it\'s worth it for enthusiasts who want the absolute best.',
    fullReview: `# NVIDIA GeForce RTX 5090 Expert Review

## Introduction

The NVIDIA GeForce RTX 5090 represents the pinnacle of consumer graphics card technology. Built on the new Blackwell architecture, it delivers unprecedented performance for gaming, content creation, and AI workloads.

## Performance

### Gaming Performance

In our comprehensive testing, the RTX 5090 delivered exceptional frame rates across all tested games:

- **4K Gaming**: Consistently above 120 FPS in modern titles
- **8K Gaming**: Playable frame rates (60+ FPS) with DLSS enabled
- **Ray Tracing**: Industry-leading performance with full ray tracing enabled
- **VR**: Excellent performance for high-end VR headsets

### Content Creation

For content creators, the RTX 5090 offers:

- **Video Encoding**: 2x faster than RTX 4090 with AV1 encoding
- **3D Rendering**: Significant improvements in Blender and other 3D software
- **AI Workloads**: Exceptional performance for Stable Diffusion and other AI tools

## Design and Build Quality

The RTX 5090 features a premium design with:

- Robust cooling solution
- High-quality materials
- Excellent build quality
- RGB lighting (on Founders Edition)

## Value Proposition

At $1,999, the RTX 5090 is expensive but offers:

- Best-in-class performance
- Future-proof architecture
- Excellent feature set
- Strong resale value

## Verdict

**Buy** - If you want the absolute best gaming performance and have the budget, the RTX 5090 is an excellent choice.`,
    pros: [
      'Unmatched gaming performance',
      'Excellent ray tracing',
      'Future-proof architecture',
      'Great for content creation',
    ],
    cons: [
      'Very expensive',
      'High power consumption',
      'Large size',
    ],
    bestFor: [
      '4K and 8K gaming enthusiasts',
      'Content creators',
      'AI researchers',
      'VR users',
    ],
    publishedAt: '2024-12-18',
    readTime: 15,
    images: [],
  },
  videoReviewUrl: 'https://www.youtube.com/watch?v=example',
  affiliateLinks: [
    {
      retailer: 'Amazon',
      url: 'https://amazon.com/rtx-5090',
      price: 1999,
      currency: 'USD',
      inStock: true,
      lastChecked: new Date().toISOString(),
    },
    {
      retailer: 'Newegg',
      url: 'https://newegg.com/rtx-5090',
      price: 1999,
      currency: 'USD',
      inStock: true,
      lastChecked: new Date().toISOString(),
    },
  ],
};

export default function ProductReview() {
  const { id } = useParams<{ id: string }>();
  const product = mockProduct; // In production, fetch by ID

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <h1>Product Not Found</h1>
        </div>
      </Layout>
    );
  }

  const verdictColors = {
    Buy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    Consider: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    Avoid: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    Wait: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <Layout>
      <SEOHead
        title={product.name}
        description={product.description}
        keywords={product.tags}
        imageUrl={product.imageUrl}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/reviews" className="hover:text-foreground">Reviews</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-tech/10 text-tech border-tech/20">
                  {product.brand}
                </Badge>
                <Badge variant="outline">{product.category}</Badge>
                {product.price?.availability === 'in-stock' && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    In Stock
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-4xl mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
              
              {/* Rating and Verdict */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <ArticleRating score={product.rating.overall} size="lg" />
                  <span className="text-sm text-muted-foreground">
                    {product.rating.reviewCount} expert reviews
                  </span>
                </div>
                {product.expertReview && (
                  <Badge className={cn('px-4 py-2', verdictColors[product.expertReview.verdict])}>
                    <Award className="h-4 w-4 mr-2" />
                    {product.expertReview.verdict}
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.videoReviewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Button size="lg" className="gap-2">
                    <Video className="h-5 w-5" />
                    Watch Video Review
                  </Button>
                </div>
              )}
            </div>

            {/* Expert Review */}
            {product.expertReview && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Expert Review</CardTitle>
                      <CardDescription>
                        By {product.expertReview.author} • {product.expertReview.authorTitle}
                      </CardDescription>
                    </div>
                    <ArticleRating score={product.expertReview.rating} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{product.expertReview.fullReview}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Check className="h-5 w-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <X className="h-5 w-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Reviews ({product.rating.userReviewCount})
                </CardTitle>
                <CardDescription>
                  Average rating: {product.rating.userRating.toFixed(1)} / 5.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock user reviews */}
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i < Math.floor(product.rating.userRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">John D.</span>
                      <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Absolutely incredible performance. Worth every penny for 4K gaming."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Price and Buy */}
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  {product.price?.original && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">
                        ${product.price.current.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground line-through">
                        ${product.price.original.toLocaleString()}
                      </span>
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                        {product.price.discount}% off
                      </Badge>
                    </div>
                  )}
                  {!product.price?.original && (
                    <div className="text-2xl font-bold">
                      ${product.price?.current.toLocaleString()}
                    </div>
                  )}
                </div>

                {product.affiliateLinks && product.affiliateLinks.length > 0 && (
                  <div className="space-y-2">
                    {product.affiliateLinks.map((link, idx) => (
                      <Button
                        key={idx}
                        className="w-full justify-between"
                        variant={idx === 0 ? 'default' : 'outline'}
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <span>Buy on {link.retailer}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Last updated: {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {product.rating.userReviewCount} user reviews
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(product.rating.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm font-medium">{value.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Best For */}
            {product.expertReview?.bestFor && (
              <Card>
                <CardHeader>
                  <CardTitle>Best For</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.expertReview.bestFor.map((use, idx) => (
                      <Badge key={idx} variant="outline">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}

