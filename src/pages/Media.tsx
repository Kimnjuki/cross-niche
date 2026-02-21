/**
 * Video & Podcast hub – featured video and podcast content.
 * Placeholder sections; can be wired to Convex content_type or feeds later.
 */

import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Headphones, Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPlaceholderImage } from '@/lib/placeholderImages';

const PLACEHOLDER_VIDEOS = [
  {
    id: '1',
    title: 'AI Security in 2026: What You Need to Know',
    description: 'Expert roundtable on AI-driven threats and defenses.',
    duration: '24:00',
    thumbnail: getPlaceholderImage('security'),
    category: 'Security',
  },
  {
    id: '2',
    title: 'Next-Gen GPUs Compared',
    description: 'Benchmarks and real-world performance for the latest graphics cards.',
    duration: '18:30',
    thumbnail: getPlaceholderImage('tech'),
    category: 'Tech',
  },
  {
    id: '3',
    title: 'Gaming Security: Protecting Your Account',
    description: 'Best practices for keeping your gaming accounts and gear secure.',
    duration: '12:15',
    thumbnail: getPlaceholderImage('gaming'),
    category: 'Gaming',
  },
];

const PLACEHOLDER_PODCASTS = [
  {
    id: '1',
    title: 'The Grid Nexus Weekly',
    description: 'Tech, security, and gaming news in one podcast.',
    episode: 'Episode 42',
    duration: '45 min',
  },
  {
    id: '2',
    title: 'Security Deep Dive',
    description: 'Cybersecurity trends and threat intelligence.',
    episode: 'Episode 18',
    duration: '38 min',
  },
];

export default function Media() {
  return (
    <Layout>
      <SEOHead
        title="Video & Podcast | The Grid Nexus"
        description="Watch and listen: video explainers and podcasts on tech, security, and gaming."
        keywords={['video', 'podcast', 'tech podcast', 'security video', 'gaming stream']}
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-2">
            Video & Podcast
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Watch explainers and listen to our shows on tech, security, and gaming.
          </p>
        </header>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="font-display font-bold text-2xl">Featured Video</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_VIDEOS.map((v) => (
              <Card key={v.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={v.thumbnail}
                    alt={v.title || `Video thumbnail: ${v.description}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="rounded-full bg-primary/90 p-4">
                      <Play className="h-8 w-8 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {v.duration}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="mb-2 w-fit">
                    {v.category}
                  </Badge>
                  <CardTitle className="text-lg line-clamp-2">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Headphones className="h-6 w-6 text-primary" />
            <h2 className="font-display font-bold text-2xl">Podcast</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLACEHOLDER_PODCASTS.map((p) => (
              <Card key={p.id} className="flex flex-row overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-24 flex-shrink-0 bg-muted flex items-center justify-center">
                  <Headphones className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardContent className="flex flex-1 flex-col justify-center py-4">
                  <CardTitle className="text-base mb-1">{p.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{p.episode}</span>
                    <span>·</span>
                    <span>{p.duration}</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground text-sm">
            More video and podcast content is coming soon. In the meantime, explore our{' '}
            <Link to="/" className="text-primary hover:underline">articles</Link> and{' '}
            <Link to="/reviews" className="text-primary hover:underline">reviews</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
