import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock } from 'lucide-react';
import { mockArticles } from '@/data/mockData';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Videos() {
  const videoItems = useMemo(() => {
    const collected = mockArticles.flatMap(article => {
      const videos = Array.isArray(article.videos) ? article.videos : [];
      return videos.map(video => ({
        ...video,
        articleTitle: article.title,
        articleSlug: article.slug,
        niche: article.niche,
      }));
    });

    const seen = new Set<string>();
    return collected.filter(item => {
      const key = item.id ?? item.url ?? item.title;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Videos | The Grid Nexus"
        description="Watch expert video coverage on tech, security, and gaming from The Grid Nexus."
        url={typeof window !== 'undefined' ? `${window.location.origin}/videos` : '/videos'}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-2">Videos</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Expert video guides, walkthroughs, and breaking coverage from tech, security, and gaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoItems.map((video) => (
            <Card key={video.id} className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="topic" className="capitalize">{video.niche ?? 'video'}</Badge>
                  {video.duration && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {video.duration}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{video.title}</CardTitle>
                <CardDescription>
                  {video.articleTitle ? `From: ${video.articleTitle}` : 'The Grid Nexus video'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={video.url} target="_blank" rel="noreferrer">
                    <Play className="h-4 w-4 mr-2" />
                    Watch now
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {videoItems.length === 0 && (
          <Card className="mt-8 border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              No videos yet. We’re adding video coverage soon.
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
