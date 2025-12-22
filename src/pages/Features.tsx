import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Search, 
  Folder, 
  Rss, 
  Users, 
  FileText, 
  Shield, 
  Zap,
  Brain,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content Curation',
    description: 'Intelligent content discovery and ranking using advanced AI algorithms to surface the most relevant articles.',
    category: 'AI',
  },
  {
    icon: Search,
    title: 'Advanced Search & Filters',
    description: 'Powerful search across all content with filters by niche, date, author, and more.',
    category: 'Discovery',
  },
  {
    icon: Folder,
    title: 'Smart Collections',
    description: 'Organize articles into collections with tags, public/private settings, and easy sharing.',
    category: 'Organization',
  },
  {
    icon: Rss,
    title: 'RSS Feed Aggregation',
    description: 'Aggregate content from multiple RSS and Atom feeds in one place.',
    category: 'Aggregation',
  },
  {
    icon: Brain,
    title: 'AI Writing Assistant',
    description: 'Enhance your writing with AI-powered expansion, simplification, rewriting, and summarization.',
    category: 'AI',
  },
  {
    icon: FileText,
    title: 'Rich Text Editor',
    description: 'Professional editor with AI integration for creating and editing content.',
    category: 'Editor',
  },
  {
    icon: Users,
    title: 'Collaboration Tools',
    description: 'Work together with your team on content curation and creation.',
    category: 'Collaboration',
  },
  {
    icon: Shield,
    title: 'Security Intelligence',
    description: 'Stay ahead of threats with real-time security alerts and analysis.',
    category: 'Security',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Get instant notifications on breaking news and important updates.',
    category: 'Real-Time',
  },
  {
    icon: Globe,
    title: 'Cross-Niche Discovery',
    description: 'Discover unexpected connections between tech, security, and gaming content.',
    category: 'Discovery',
  },
];

const categories = ['All', 'AI', 'Discovery', 'Organization', 'Aggregation', 'Editor', 'Collaboration', 'Security', 'Real-Time'];

export default function Features() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatures = selectedCategory === 'All' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to stay informed and create amazing content
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{feature.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

