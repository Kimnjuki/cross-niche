import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download, 
  Share, 
  Clock, 
  Mic, 
  Headphones, 
  Radio, 
  Settings, 
  Upload, 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Star,
  Heart,
  MessageSquare,
  Users,
  Rss
} from 'lucide-react';

export default function PodcastPlatform() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState(null);
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
      episodes: 24
      downloads: 1234,
      rating: 4.8
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
      episodes: 36,
      downloads: 2341,
      rating: 4.7,
      tags: ['gaming', 'esports', 'reviews', 'industry']
    },
    {
      id: 'ai-pulse',
      title: 'AI Pulse Updates',
      description: 'Artificial intelligence developments and their impact on tech, security, and gaming',
      category: 'ai',
      author: 'AI Research Team',
      duration: '28:12',
      publishDate: '2026-02-11',
      imageUrl: 'https://picsum.photos/seed/ai-pulse/400/300.jpg',
      audioUrl: 'https://example.com/audio/ai-pulse.mp3',
      episodes: 12,
      downloads: 567,
      rating: 4.6,
      tags: ['artificial-intelligence', 'machine-learning', 'automation', 'ethics']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Podcasts', count: 90 },
    { id: 'technology', name: 'Technology', count: 24 },
    { id: 'security', name: 'Security', count: 18 },
    { id: 'gaming', name: 'Gaming', count: 36 },
    { id: 'ai', name: 'Artificial Intelligence', count: 12 }
  ];

  const filteredPodcasts = podcasts.filter(podcast => 
    selectedCategory === 'all' || podcast.category === selectedCategory
  ).filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Headphones className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/podcasts" className="text-primary border-b-2 border-primary px-1 pb-4">
                Podcasts
              </Link>
              <Link to="/subscription" className="text-muted-foreground hover:text-foreground">
                Subscription
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Featured Podcast */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Featured Podcast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <img 
                        src={podcasts[0].imageUrl}
                        alt={podcasts[0].title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{podcasts[0].title}</h3>
                      <p className="text-muted-foreground mb-4">{podcasts[0].description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">{podcasts[0].author}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(podcasts[0].publishDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">{podcasts[0].duration}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {podcasts[0].episodes} episodes
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">{podcasts[0].downloads.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{podcasts[0].rating}</span>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Listen Now
                      </Button>
                    </div>

                    {/* Audio Player */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </div>
                          <div className="bg-background rounded-full h-2 relative">
                            <div 
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

            {/* Browse Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Browse Podcasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search podcasts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 mb-4">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          {category.name}
                          <Badge variant="outline" className="ml-2">
                            {category.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>

                    {/* Podcast Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPodcasts.map((podcast) => (
                        <Card key={podcast.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <div className="relative">
                            <img 
                              src={podcast.imageUrl}
                              alt={podcast.title}
                              className="w-full h-32 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">
                                {podcast.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{podcast.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{podcast.description}</p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">{podcast.author}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(podcast.publishDate).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">{podcast.duration}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {podcast.episodes} episodes
                              </div>
                            </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">{podcast.downloads.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold">{podcast.rating}</span>
                              </div>
                            </div>
                          </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {podcast.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Button className="w-full mt-4">
                              <Play className="h-4 w-4 mr-2" />
                              Listen Now
                            </Button>
                          </CardContent>
                        </Card>
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
                    
                    <TabsContent value="browse" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold mb-4">Most Popular</h4>
                        <div className="space-y-3">
                          {podcasts.slice(0, 5).map((podcast, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                              <span className="text-lg font-bold">{index + 1}</span>
                              <div className="flex-1">
                                <div className="font-medium">{podcast.title}</div>
                                <div className="text-sm text-muted-foreground">{podcast.downloads.toLocaleString()} plays</div>
                              </div>
                              <TrendingUp className="h-4 w-4 text-green-500" />
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
    </div>
  );
}
