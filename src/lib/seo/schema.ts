/**
 * JSON-LD Schema Generator for SEO
 * Includes difficultyLevel for SERP enhancement
 */

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  keywords?: string[];
  articleSection?: string;
}

export function generateArticleSchema(
  title: string,
  description: string,
  publishedAt: string,
  author: string,
  imageUrl?: string,
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  keywords?: string[],
  section?: string
): ArticleSchema {
  const difficultyMap: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cross-Niche Nexus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cross-niche-nexus.com/logo.png',
      },
    },
    ...(difficultyLevel && { difficultyLevel: difficultyMap[difficultyLevel] }),
    ...(keywords && keywords.length > 0 && { keywords }),
    ...(section && { articleSection: section }),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}



