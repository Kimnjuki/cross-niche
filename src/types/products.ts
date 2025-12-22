/**
 * Product Review and Comparison Types
 * Based on competitor analysis (TechRadar, PCMag, Digital Trends)
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'hardware' | 'software' | 'service' | 'accessory';
  subcategory: string;
  niche: 'tech' | 'security' | 'gaming';
  description: string;
  imageUrl: string;
  price?: {
    current: number;
    currency: string;
    original?: number;
    discount?: number;
    availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  };
  rating: {
    overall: number; // 1-10 scale
    breakdown: {
      performance: number;
      value: number;
      design: number;
      features: number;
      easeOfUse: number;
    };
    reviewCount: number;
    userRating: number; // Average user rating
    userReviewCount: number;
  };
  pros: string[];
  cons: string[];
  specifications: Record<string, string | number>;
  features: string[];
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  expertReview?: ExpertReview;
  userReviews?: UserReview[];
  relatedProducts?: string[]; // Product IDs
  alternatives?: string[]; // Alternative product IDs
  buyingGuide?: string; // Guide ID
  videoReviewUrl?: string;
  affiliateLinks?: AffiliateLink[];
}

export interface ExpertReview {
  id: string;
  productId: string;
  author: string;
  authorTitle: string;
  authorImage?: string;
  rating: number; // 1-10
  verdict: 'Buy' | 'Consider' | 'Avoid' | 'Wait';
  summary: string;
  fullReview: string;
  pros: string[];
  cons: string[];
  bestFor: string[]; // Use cases
  publishedAt: string;
  readTime: number;
  images: string[];
  videoUrl?: string;
}

export interface UserReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number; // 1-5 stars
  title: string;
  review: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  publishedAt: string;
  updatedAt?: string;
}

export interface ProductComparison {
  id: string;
  title: string;
  description: string;
  products: string[]; // Product IDs
  comparisonFields: ComparisonField[];
  winner?: string; // Product ID
  publishedAt: string;
}

export interface ComparisonField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'rating' | 'boolean' | 'badge';
  values: Record<string, string | number | boolean>;
  winner?: string; // Product ID with best value
}

export interface BuyingGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  niche: 'tech' | 'security' | 'gaming';
  sections: BuyingGuideSection[];
  recommendedProducts: string[]; // Product IDs
  budgetRanges: BudgetRange[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
}

export interface BuyingGuideSection {
  title: string;
  content: string;
  products?: string[]; // Featured products in this section
}

export interface BudgetRange {
  min: number;
  max: number;
  label: string; // e.g., "Budget", "Mid-Range", "Premium"
  recommendedProducts: string[];
}

export interface AffiliateLink {
  retailer: string;
  url: string;
  price: number;
  currency: string;
  inStock: boolean;
  lastChecked: string;
}

export interface PriceHistory {
  productId: string;
  prices: PricePoint[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

export interface PricePoint {
  date: string;
  price: number;
  retailer: string;
  currency: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  notified: boolean;
  createdAt: string;
}

