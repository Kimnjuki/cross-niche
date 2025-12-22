import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Award, Star, DollarSign } from 'lucide-react';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import type { ProductComparison as ComparisonType, Product } from '@/types/products';

// Mock comparison data
const mockComparison: ComparisonType = {
  id: 'gpu-comparison-2024',
  title: 'Best Gaming GPUs 2024: RTX 5090 vs RTX 4090 vs RX 7900 XTX',
  description: 'Comprehensive comparison of the top gaming graphics cards for 2024',
  products: ['rtx-5090', 'rtx-4090', 'rx-7900-xtx'],
  comparisonFields: [
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      values: {
        'rtx-5090': 1999,
        'rtx-4090': 1599,
        'rx-7900-xtx': 999,
      },
      winner: 'rx-7900-xtx',
    },
    {
      name: 'performance',
      label: 'Performance (4K)',
      type: 'rating',
      values: {
        'rtx-5090': 9.8,
        'rtx-4090': 9.2,
        'rx-7900-xtx': 8.5,
      },
      winner: 'rtx-5090',
    },
    {
      name: 'rayTracing',
      label: 'Ray Tracing',
      type: 'rating',
      values: {
        'rtx-5090': 10,
        'rtx-4090': 9.5,
        'rx-7900-xtx': 7.5,
      },
      winner: 'rtx-5090',
    },
    {
      name: 'powerConsumption',
      label: 'Power Consumption (TDP)',
      type: 'number',
      values: {
        'rtx-5090': 575,
        'rtx-4090': 450,
        'rx-7900-xtx': 355,
      },
      winner: 'rx-7900-xtx',
    },
    {
      name: 'value',
      label: 'Value for Money',
      type: 'rating',
      values: {
        'rtx-5090': 8.5,
        'rtx-4090': 8.8,
        'rx-7900-xtx': 9.2,
      },
      winner: 'rx-7900-xtx',
    },
    {
      name: 'dlss',
      label: 'DLSS Support',
      type: 'boolean',
      values: {
        'rtx-5090': true,
        'rtx-4090': true,
        'rx-7900-xtx': false,
      },
    },
  ],
  winner: 'rtx-5090',
  publishedAt: '2024-12-18',
};

const mockProducts: Record<string, Partial<Product>> = {
  'rtx-5090': {
    id: 'rtx-5090',
    name: 'NVIDIA RTX 5090',
    brand: 'NVIDIA',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&q=80',
    price: { current: 1999, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 9.8, breakdown: {}, reviewCount: 0, userRating: 0, userReviewCount: 0 },
  },
  'rtx-4090': {
    id: 'rtx-4090',
    name: 'NVIDIA RTX 4090',
    brand: 'NVIDIA',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&q=80',
    price: { current: 1599, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 9.2, breakdown: {}, reviewCount: 0, userRating: 0, userReviewCount: 0 },
  },
  'rx-7900-xtx': {
    id: 'rx-7900-xtx',
    name: 'AMD RX 7900 XTX',
    brand: 'AMD',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&q=80',
    price: { current: 999, currency: 'USD', availability: 'in-stock' },
    rating: { overall: 8.5, breakdown: {}, reviewCount: 0, userRating: 0, userReviewCount: 0 },
  },
};

export default function ProductComparison() {
  const { id } = useParams<{ id: string }>();
  const comparison = mockComparison; // In production, fetch by ID
  const products = comparison.products.map(pid => mockProducts[pid]).filter(Boolean) as Partial<Product>[];

  if (!comparison) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <h1>Comparison Not Found</h1>
        </div>
      </Layout>
    );
  }

  const formatValue = (field: typeof comparison.comparisonFields[0], productId: string) => {
    const value = field.values[productId];
    if (field.type === 'boolean') {
      return value ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />;
    }
    if (field.type === 'rating') {
      return <ArticleRating score={value as number} size="sm" showLabel={false} />;
    }
    if (field.type === 'number' && field.name.includes('price')) {
      return `$${(value as number).toLocaleString()}`;
    }
    if (field.type === 'number' && field.name.includes('power')) {
      return `${value}W`;
    }
    return String(value);
  };

  return (
    <Layout>
      <SEOHead
        title={comparison.title}
        description={comparison.description}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-4">{comparison.title}</h1>
          <p className="text-lg text-muted-foreground">{comparison.description}</p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {products.map((product, idx) => {
            const isWinner = comparison.winner === product.id;
            return (
              <Card
                key={product.id}
                className={cn(
                  'relative',
                  isWinner && 'border-primary border-2'
                )}
              >
                {isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Award className="h-3 w-3" />
                      Winner
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.brand}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">
                      ${product.price?.current.toLocaleString()}
                    </div>
                    <ArticleRating score={product.rating?.overall || 0} size="sm" />
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/review/${product.id}`}>View Review</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of key features and specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {products.map((product) => (
                      <TableHead key={product.id} className="text-center">
                        {product.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparison.comparisonFields.map((field) => (
                    <TableRow key={field.name}>
                      <TableCell className="font-medium">{field.label}</TableCell>
                      {comparison.products.map((productId) => {
                        const isWinner = field.winner === productId;
                        return (
                          <TableCell
                            key={productId}
                            className={cn(
                              'text-center',
                              isWinner && 'bg-primary/10 font-semibold'
                            )}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {formatValue(field, productId)}
                              {isWinner && (
                                <Award className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Verdict */}
        {comparison.winner && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Our Verdict
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                After comprehensive testing and analysis, we recommend the{' '}
                <strong>{mockProducts[comparison.winner]?.name}</strong> as the best overall choice.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => {
                  const isWinner = comparison.winner === product.id;
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        isWinner
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background'
                      )}
                    >
                      <div className="font-semibold mb-2">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {isWinner
                          ? 'Best overall performance and features'
                          : 'Great alternative with different strengths'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

