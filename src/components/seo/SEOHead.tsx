import { Helmet } from 'react-helmet-async';
import { generateArticleSchema, type ArticleSchema } from '@/lib/seo/schema';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keywords?: string[];
  section?: string;
  author?: string;
  publishedAt?: string;
  schema?: ArticleSchema;
}

export function SEOHead({
  title,
  description,
  image,
  url,
  difficultyLevel,
  keywords = [],
  section,
  author,
  publishedAt,
  schema,
}: SEOHeadProps) {
  const fullTitle = difficultyLevel
    ? `${title} | The Grid Nexus - ${difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)} Analysis`
    : `${title} | The Grid Nexus - Security Intelligence`;

  const metaKeywords = [
    ...keywords,
    difficultyLevel && `difficulty-${difficultyLevel}`,
    section && section.toLowerCase(),
  ].filter(Boolean).join(', ');

  const articleSchema = schema || (publishedAt && author
    ? generateArticleSchema(title, description, publishedAt, author, image, difficultyLevel, keywords, section)
    : undefined);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="article" />
      {section && <meta property="article:section" content={section} />}
      {difficultyLevel && <meta property="article:tag" content={`Difficulty: ${difficultyLevel}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Schema */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
}

