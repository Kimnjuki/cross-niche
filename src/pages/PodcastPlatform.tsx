import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Share2, Clock, TrendingUp, Rss, Headphones, Mic } from 'lucide-react';

export default function PodcastPlatform() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const podcasts = [
    {
      id: 'tech-talk',
      title: 'Tech Talk',
      description: 'Latest technology trends and interviews with industry experts',
      category: 'technology',
      author: 'The Grid Nexus Team',
      duration: '45:32',
      publishDate: '2026-02-10',
      imageUrl: 'https://picsum.photos/seed/tech-talk/400/300.jpg',
      audioUrl: 'https://example.com/audio/tech-talk.mp3',
      episodes: 24,
      downloads: 1234,
      rating: 4.8,
      tags: ['technology', 'ai', 'innovation']
    },
    {
      id: 'security-briefing',
      title: 'Security Briefing',
      description: 'Weekly cybersecurity news, threat analysis, and expert insights',
      category: 'security',
      author: 'Security Research Team',
      duration: '32:15',
      publishDate: '2026-02-09',
      imageUrl: 'https://picsum.photos/seed/security-briefing/400/300.jpg',
      audioUrl: 'https://example.com/audio/security-briefing.mp3',
      episodes: 18,
      downloads: 892,
      rating: 4.9,
      tags: ['cybersecurity', 'threats', 'malware', 'analysis']
    },
    {
      id: 'gaming-insider',
      title: 'Gaming Insider',
      description: 'Behind-the-scenes gaming industry news, reviews, and developer interviews',
      category: 'gaming',
      author: 'Gaming Editorial Team',
      duration: '58:45',
      publishDate: '2026-02-08',
      imageUrl: 'https://picsum.photos/seed/gaming-insider/400/300.jpg',
      audioUrl: 'https://example.com/audio/gaming-insider.mp3',
      episodes: 42,
      downloads: 2156,
      rating: 4.7,
      tags: ['gaming', 'industry', 'reviews', 'developers']
    }
  ];

  const featuredPodcasts = [
    {
      id: 'ai-revolution',
      title: 'AI Revolution',
      description: 'Exploring artificial intelligence breakthroughs and their impact on society',
      category: 'technology',
      author: 'AI Research Team',
      duration: '52:18',
      publishDate: '2026-02-05',
      imageUrl: 'https://picsum.photos/seed/ai-revolution/400/300.jpg',
      audioUrl: 'https://example.com/audio/ai-revolution.mp3',
      episodes: 36,
      downloads: 3421,
      rating: 4.9,
      tags: ['artificial intelligence', 'machine learning', 'ethics', 'future']
    },
    {
      id: 'cyber-threat-weekly',
      title: 'Cyber Threat Weekly',
      description: 'Comprehensive coverage of latest cybersecurity threats and defense strategies',
      category: 'security',
      author: 'Threat Intelligence Team',
      duration: '48:22',
      publishDate: '2026-02-03',
      imageUrl: 'https://picsum.photos/seed/cyber-threat/400/300.jpg',
      audioUrl: 'https://example.com/audio/cyber-threat.mp3',
      episodes: 89,
      downloads: 5678,
      rating: 4.8,
      tags: ['cybersecurity', 'threats', 'defense', 'intelligence']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Podcast Platform</h1>
                <p className="text-muted-foreground">Your gateway to tech, security, and gaming insights</p>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Mic className="h-4 w-4 mr-2" />
              Start Your Podcast
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Featured Podcasts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredPodcasts.map((podcast) => (
                    <div key={podcast.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <img 
                        src={podcast.imageUrl} 
                        alt={podcast.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{podcast.title}</h3>
                          <Badge variant="secondary">{podcast.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{podcast.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{podcast.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{podcast.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{podcast.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Episodes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Episodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {podcasts.slice(0, 3).map((podcast) => (
                    <div key={podcast.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={podcast.imageUrl} 
                          alt={podcast.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{podcast.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant={podcast.category === 'technology' ? 'default' : 'secondary'}>
                                {podcast.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{podcast.publishDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{podcast.description}</p>
                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-2" />
                              Play Episode
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {podcast.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rss className="h-5 w-5" />
                  Popular & Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full">
                    <TabsTrigger value="browse">Browse</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="browse" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold mb-4">Browse by Category</h4>
                      <div className="space-y-2">
                        {['Technology', 'Security', 'Gaming'].map((category) => (
                          <div key={category} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <span className="font-medium">{category}</span>
                            <Badge variant="outline">12 episodes</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trending" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-4">Trending Topics</h4>
                      <div className="space-y-3">
                        {['Artificial Intelligence', 'Cybersecurity Threats', 'Gaming Industry News', 'Tech Innovations'].map((topic, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{topic}</div>
                              <div className="text-sm text-muted-foreground">12 episodes this week</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
