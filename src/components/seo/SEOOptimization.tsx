// src/components/seo/SEOOptimization.tsx
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';

interface SEOOptimizationProps {
  contentId?: string;
}

export const SEOOptimization: React.FC<SEOOptimizationProps> = ({ contentId }) => {
  const [activeTab, setActiveTab] = useState('structured-data');
  const [schemaType, setSchemaType] = useState('NewsArticle');
  const [priority, setPriority] = useState('normal');
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [isOptimizingVitals, setIsOptimizingVitals] = useState(false);
  const [isOptimizingGoogleNews, setIsOptimizingGoogleNews] = useState(false);
  const [isSubmittingIndexing, setIsSubmittingIndexing] = useState(false);

  // SEO mutations and queries
  const generateStructuredData = useMutation(api.seoOptimization.generateStructuredData);
  const optimizeForCoreWebVitals = useMutation(api.seoOptimization.optimizeForCoreWebVitals);
  const optimizeForGoogleNews = useMutation(api.seoOptimization.optimizeForGoogleNews);
  const getSEOContent = useQuery(
    api.seoOptimization.getSEOContent,
    contentId ? { slug: contentId } : 'skip'
  );

  const handleGenerateStructuredData = async () => {
    if (!contentId) return;

    setIsGeneratingSchema(true);
    try {
      const result = await generateStructuredData({
        contentId: contentId as any,
        schemaType,
      });
      
      console.log('Structured data generated:', result);
    } catch (error) {
      console.error('Failed to generate structured data:', error);
    } finally {
      setIsGeneratingSchema(false);
    }
  };

  const handleCoreWebVitalsOptimization = async () => {
    if (!contentId) return;

    setIsOptimizingVitals(true);
    try {
      const result = await optimizeForCoreWebVitals({
        contentId: contentId as any,
      });
      
      console.log('Core Web Vitals optimization:', result);
    } catch (error) {
      console.error('Failed to optimize for Core Web Vitals:', error);
    } finally {
      setIsOptimizingVitals(false);
    }
  };

  const handleGoogleNewsOptimization = async () => {
    if (!contentId) return;

    setIsOptimizingGoogleNews(true);
    try {
      const result = await optimizeForGoogleNews({
        contentId: contentId as any,
      });
      
      console.log('Google News optimization:', result);
    } catch (error) {
      console.error('Failed to optimize for Google News:', error);
    } finally {
      setIsOptimizingGoogleNews(false);
    }
  };

  const handleImmediateIndexing = async () => {
    if (!contentId) return;

    setIsSubmittingIndexing(true);
    try {
      const result = await optimizeForGoogleNews({
        contentId: contentId as any,
      });
      
      console.log('Immediate indexing triggered:', result);
    } catch (error) {
      console.error('Failed to trigger immediate indexing:', error);
    } finally {
      setIsSubmittingIndexing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 SEO Dominance Strategy
            <Badge variant="secondary">Google Top Stories</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structured-data">Schema Markup</TabsTrigger>
              <TabsTrigger value="core-vitals">Core Web Vitals</TabsTrigger>
              <TabsTrigger value="google-news">Google News</TabsTrigger>
            </TabsList>

            <TabsContent value="structured-data" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schema-type">Schema Type</Label>
                  <select
                    id="schema-type"
                    value={schemaType}
                    onChange={(e) => setSchemaType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="NewsArticle">NewsArticle</option>
                    <option value="LiveBlogPosting">LiveBlogPosting</option>
                    <option value="FAQPage">FAQPage</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Required Fields for {schemaType}:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {schemaType === 'NewsArticle' && (
                      <>
                        <div className="p-2 bg-muted rounded">
                          <strong>headline</strong>
                          <p>Article title</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>datePublished</strong>
                          <p>Publication date</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>author</strong>
                          <p>Author information</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>publisher</strong>
                          <p>Organization details</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>image</strong>
                          <p>Featured image URL</p>
                        </div>
                      </>
                    )}
                    
                    {schemaType === 'LiveBlogPosting' && (
                      <>
                        <div className="p-2 bg-muted rounded">
                          <strong>coverageStartTime</strong>
                          <p>Live coverage start</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>coverageEndTime</strong>
                          <p>Live coverage end</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>liveBlogUpdate</strong>
                          <p>Real-time updates</p>
                        </div>
                      </>
                    )}
                    
                    {schemaType === 'FAQPage' && (
                      <>
                        <div className="p-2 bg-muted rounded">
                          <strong>mainEntity</strong>
                          <p>Q&A pairs</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>Question</strong>
                          <p>User questions</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <strong>acceptedAnswer</strong>
                          <p>Expert answers</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateStructuredData}
                  disabled={!contentId || isGeneratingSchema}
                  className="w-full"
                >
                  {isGeneratingSchema ? 'Generating...' : 'Generate Schema Markup'}
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>🎯 Triggers Google Top Stories carousel placement</p>
                  <p>📝 Captures 'People also ask' snippets</p>
                  <p>🔴 Enables Live blog red-badge in search</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="core-vitals" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <h5 className="font-medium text-green-600">LCP Target</h5>
                    <p className="text-2xl font-bold">&lt; 1.2s</p>
                    <p className="text-sm text-muted-foreground">Largest Contentful Paint</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded">
                    <h5 className="font-medium text-blue-600">CLS Target</h5>
                    <p className="text-2xl font-bold">0.05</p>
                    <p className="text-sm text-muted-foreground">Cumulative Layout Shift</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded">
                    <h5 className="font-medium text-orange-600">FID Target</h5>
                    <p className="text-2xl font-bold">&lt; 100ms</p>
                    <p className="text-sm text-muted-foreground">First Input Delay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Optimization Actions:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Switch id="lazy-loading" />
                      <Label htmlFor="lazy-loading">Lazy loading below-fold images</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch id="critical-css" />
                      <Label htmlFor="critical-css">Critical CSS inlining</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch id="resource-hints" />
                      <Label htmlFor="resource-hints">Resource hints (preload/prefetch)</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCoreWebVitalsOptimization}
                  disabled={!contentId || isOptimizingVitals}
                  className="w-full"
                >
                  {isOptimizingVitals ? 'Optimizing...' : 'Apply Optimizations'}
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>⚡ Targets Lighthouse score &gt; 95</p>
                  <p>🖼️ Image optimization and modern formats</p>
                  <p>📱 Mobile-first performance focus</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="google-news" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Google News Publisher Center</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 border rounded">
                      <h5 className="font-medium mb-2">Status</h5>
                      <Badge variant="secondary">Must be verified</Badge>
                      <p className="text-muted-foreground">Submit for Google News approval</p>
                    </div>
                    
                    <div className="p-3 border rounded">
                      <h5 className="font-medium mb-2">RSS Feeds</h5>
                      <div className="space-y-1">
                        <div>📰 Tech RSS: /rss/tech</div>
                        <div>🔒 Security RSS: /rss/security</div>
                        <div>🎮 Gaming RSS: /rss/gaming</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Google Discover Optimization:</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">Image Requirements</h5>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                        <li>• Size: 1200px+ minimum</li>
                        <li>• Aspect ratio: 16:9 recommended</li>
                        <li>• Text overlays: Emotional/urgent text</li>
                        <li>• Quality: High resolution</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <h5 className="font-medium text-green-900 dark:text-green-100">Content Strategy</h5>
                      <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                        <li>• Daily publish of trend pieces</li>
                        <li>• Example: "Why RTX 5090 changes everything"</li>
                        <li>• Example: "Critical Windows vulnerability discovered"</li>
                        <li>• Example: "Next-gen gaming console leaks revealed"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Immediate Indexing:</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    
                    <Button 
                      onClick={handleImmediateIndexing}
                      disabled={!contentId || isSubmittingIndexing}
                      className="w-full"
                      variant={priority === 'critical' || priority === 'urgent' ? 'destructive' : 'default'}
                    >
                      {isSubmittingIndexing ? 'Submitting...' : `Submit to Indexing API (${priority})`}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>🚀 Speed-to-Index for critical security alerts</p>
                    <p>📡 Uses Google Indexing API</p>
                    <p>⚡ Immediate search result placement</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
