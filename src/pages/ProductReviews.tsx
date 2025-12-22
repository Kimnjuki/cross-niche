import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Star, 
  TrendingUp,
  Award,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/products';
import { useState } from 'react';

// Mock products for reviews
const mockProducts: Partial<Product>[] = [
  {
    id: 'nvidia-rtx-5090',
    name: 'NVIDIA GeForce RTX 5090',
    brand: 'NVIDIA',
    category: 'hardware',
    niche: 'gaming',
    description: 'Flagship GPU delivering unprecedented ray tracing performance',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&q=80',
    price: { current: 1999, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 9.2, breakdown: {}, reviewCount: 24, userRating: 4.6, userReviewCount: 342 },
    tags: ['GPU', 'Gaming', 'Ray Tracing'],
  },
  {
    id: 'amd-ryzen-9-9950x',
    name: 'AMD Ryzen 9 9950X',
    brand: 'AMD',
    category: 'hardware',
    niche: 'tech',
    description: '16-core processor for gaming and content creation',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop&q=80',
    price: { current: 699, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 9.0, breakdown: {}, reviewCount: 18, userRating: 4.7, userReviewCount: 256 },
    tags: ['CPU', 'Processor', 'Gaming'],
  },
  {
    id: 'bitdefender-total-security',
    name: 'Bitdefender Total Security',
    brand: 'Bitdefender',
    category: 'software',
    niche: 'security',
    description: 'Comprehensive security suite with antivirus, VPN, and privacy tools',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop&q=80',
    price: { current: 49.99, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 8.8, breakdown: {}, reviewCount: 32, userRating: 4.5, userReviewCount: 1240 },
    tags: ['Antivirus', 'Security', 'VPN'],
  },
];

export default function ProductReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');

  const categories = Array.from(new Set(mockProducts.map(p => p.category).filter(Boolean))) as string[];
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesNiche = selectedNiche === 'all' || product.niche === selectedNiche;
    
    return matchesSearch && matchesCategory && matchesNiche;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Product Reviews</h1>
              <p className="text-muted-foreground">Expert reviews and ratings for tech, security, and gaming products</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Tabs value={selectedNiche} onValueChange={(v) => setSelectedNiche(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tech">Tech</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/review/${product.id}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] group">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={cn(
                      product.niche === 'tech' && 'bg-tech/10 text-tech border-tech/20',
                      product.niche === 'security' && 'bg-security/10 text-security border-security/20',
                      product.niche === 'gaming' && 'bg-gaming/10 text-gaming border-gaming/20',
                    )}>
                      {product.brand}
                    </Badge>
                  </div>
                  {product.price?.availability === 'in-stock' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                        In Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <ArticleRating score={product.rating?.overall || 0} size="sm" />
                    <div className="text-sm text-muted-foreground">
                      {product.rating?.reviewCount} reviews
                    </div>
                  </div>
                  
                  {product.price && (
                    <div className="text-2xl font-bold">
                      ${product.price.current.toLocaleString()}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {product.tags?.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" variant="outline">
                    Read Review
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

