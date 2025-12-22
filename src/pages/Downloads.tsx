import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Search, 
  Shield, 
  Wrench, 
  FileText, 
  TrendingDown,
  CheckCircle2,
  ExternalLink,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'utility' | 'diagnostic' | 'recovery';
  downloadUrl: string;
  version?: string;
  fileSize?: string;
  downloads?: number;
  rating?: number;
  isVerified?: boolean;
  isFree?: boolean;
  platform?: 'windows' | 'macos' | 'linux' | 'all';
  tags: string[];
}

const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    name: 'Qualys BrowserCheck',
    description: 'Check your browser for security vulnerabilities and outdated plugins',
    category: 'security',
    downloadUrl: '#',
    version: '2.0.1',
    fileSize: '2.5 MB',
    downloads: 1250000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'all',
    tags: ['browser', 'security', 'scan'],
  },
  {
    id: '2',
    name: 'STOPDecrypter',
    description: 'Decrypt files encrypted by STOP/Djvu ransomware variants',
    category: 'recovery',
    downloadUrl: '#',
    version: '1.0.0',
    fileSize: '1.2 MB',
    downloads: 850000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['ransomware', 'decrypt', 'recovery'],
  },
  {
    id: '3',
    name: 'AdwCleaner',
    description: 'Remove adware, PUPs, toolbars, and unwanted programs',
    category: 'utility',
    downloadUrl: '#',
    version: '8.4.2',
    fileSize: '8.7 MB',
    downloads: 2100000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['adware', 'cleanup', 'malware'],
  },
  {
    id: '4',
    name: 'RKill',
    description: 'Terminate malicious processes before running malware removal tools',
    category: 'diagnostic',
    downloadUrl: '#',
    version: '2.9.1',
    fileSize: '1.8 MB',
    downloads: 950000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['process', 'malware', 'diagnostic'],
  },
  {
    id: '5',
    name: 'ComboFix',
    description: 'Advanced malware removal tool for persistent infections',
    category: 'utility',
    downloadUrl: '#',
    version: '15.0.1',
    fileSize: '5.3 MB',
    downloads: 1800000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['malware', 'removal', 'advanced'],
  },
  {
    id: '6',
    name: 'Junkware Removal Tool',
    description: 'Remove junkware, adware, and potentially unwanted programs',
    category: 'utility',
    downloadUrl: '#',
    version: '2.8.0',
    fileSize: '3.1 MB',
    downloads: 1400000,
    rating: 4.4,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['junkware', 'cleanup', 'adware'],
  },
];

const categoryIcons = {
  security: Shield,
  utility: Wrench,
  diagnostic: FileText,
  recovery: TrendingDown,
};

const platformIcons = {
  windows: '🪟',
  macos: '🍎',
  linux: '🐧',
  all: '🌐',
};

export default function Downloads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDownloads = mockDownloads.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedDownloads = [...filteredDownloads].sort((a, b) => {
    return (b.downloads || 0) - (a.downloads || 0);
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Downloads</h1>
              <p className="text-muted-foreground">Security tools and utilities</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Download verified security tools, malware removal utilities, and diagnostic software. 
            All tools are free and verified safe.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search downloads... (e.g., 'malware removal', 'browser check')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="utility">Utility</TabsTrigger>
              <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="utility" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="diagnostic" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="recovery" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDownloads.map((item) => {
            const CategoryIcon = categoryIcons[item.category];
            
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                    {item.isVerified && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {item.version && (
                        <span>v{item.version}</span>
                      )}
                      {item.fileSize && (
                        <>
                          <span>•</span>
                          <span>{item.fileSize}</span>
                        </>
                      )}
                      {item.platform && (
                        <>
                          <span>•</span>
                          <span>{platformIcons[item.platform]}</span>
                        </>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        {item.downloads && (
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{(item.downloads / 1000).toFixed(0)}K</span>
                          </div>
                        )}
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Download Button */}
                    <Button className="w-full gap-2" asChild>
                      <a href={item.downloadUrl} download>
                        <Download className="h-4 w-4" />
                        Download
                        {item.isFree && (
                          <Badge variant="secondary" className="ml-auto">
                            Free
                          </Badge>
                        )}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedDownloads.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No downloads found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Important Notice:</p>
          <p>
            All tools are provided as-is. Always download from official sources and verify file hashes. 
            Use at your own risk. We are not responsible for any damage caused by these tools.
          </p>
        </div>
      </div>
    </Layout>
  );
}

