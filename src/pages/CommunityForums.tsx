import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Hash, Clock, TrendingUp, Star, Pin, Lock, Eye, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';

export default function CommunityForums() {
  const [activeTab, setActiveTab] = useState('forums');
  const [selectedForum, setSelectedForum] = useState('tech-discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const mockForums = [
    {
      id: 'tech-discussions',
      title: 'Tech Discussions',
      description: 'Latest technology news, hardware reviews, and technical discussions',
      category: 'Technology',
      posts: 1247,
      views: 45678,
      lastActivity: '2 minutes ago',
      isLocked: false,
      tags: ['programming', 'hardware', 'ai', 'cybersecurity']
    },
    {
      id: 'security-talk',
      title: 'Security Talk',
      description: 'Cybersecurity news, threat analysis, and security best practices',
      category: 'Security',
      posts: 892,
      views: 23456,
      lastActivity: '5 minutes ago',
      isLocked: false,
      tags: ['malware', 'network-security', 'encryption', 'threats']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/forums" className="text-primary border-b-2 border-primary px-1 pb-4">
                Forums
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Forums
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockForums.map((forum) => (
                      <div 
                        key={forum.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                          selectedForum === forum.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedForum(forum.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary rounded-lg flex items-center justify-center">
                              <Hash className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                              <div className="font-semibold">{forum.title}</div>
                              <div className="text-sm text-muted-foreground">{forum.description}</div>
                            </div>
                          </div>
                          <Badge variant={forum.isLocked ? 'secondary' : 'default'}>
                            {forum.isLocked ? 'Locked' : 'Open'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{forum.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{forum.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{forum.lastActivity}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {forum.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">No posts found</h4>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Forum Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Total Posts</h4>
                      <div className="text-2xl font-bold">6,047</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Total Members</h4>
                      <div className="text-2xl font-bold">12,456</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Active Today</h4>
                      <div className="text-2xl font-bold text-green-600">892</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
