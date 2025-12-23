import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import { mockGuides } from '@/data/mockData';

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  advanced: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
};

const nicheColors = {
  tech: 'bg-tech/10 text-tech',
  security: 'bg-security/10 text-security',
  gaming: 'bg-gaming/10 text-gaming',
};

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? mockGuides.find(g => g.id === id) : null;

  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">The guide you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/guides">Browse All Guides</Link>
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
        keywords={[guide.niche, guide.difficulty, ...guide.platform]}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
                  {guide.difficulty}
                </Badge>
                <Badge className={nicheColors[guide.niche]} variant="outline">
                  {guide.niche}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {guide.readTime} min read
                </div>
              </div>
              <h1 className="font-display font-bold text-4xl">{guide.title}</h1>
              <p className="text-xl text-muted-foreground mt-2">{guide.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
              <CardDescription>
                Follow these steps in order to complete this guide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guide.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-semibold text-lg mb-1">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.platform.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guide Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge className={cn(difficultyColors[guide.difficulty], 'capitalize')}>
                    {guide.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge className={nicheColors[guide.niche]} variant="outline">
                    {guide.niche}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read Time:</span>
                  <span className="font-medium">{guide.readTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium">{new Date(guide.publishedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {guide.tools && guide.tools.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Tools</CardTitle>
                <CardDescription>Tools that can help you complete this guide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.tools.map((tool) => (
                    <div key={tool.id} className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.description}</div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Visit Website →
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 pt-4">
            <Button asChild>
              <Link to="/guides">Browse More Guides</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/${guide.niche}`}>View {guide.niche} Content</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

