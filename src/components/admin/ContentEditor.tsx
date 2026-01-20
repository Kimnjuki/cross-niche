import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ContentEditorProps {
  content?: any;
  onClose: () => void;
  onSave: () => void;
}

export function ContentEditor({ content, onClose, onSave }: ContentEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    summary: '',
    status: 'draft',
    content_type: 'article',
    feed_slug: 'innovate',
    niche_name: 'tech',
    is_featured: false,
    is_breaking: false,
    featured_image_url: '',
    read_time_minutes: 5,
    security_score: null as number | null,
    tags: [] as string[],
  });

  useEffect(() => {
    if (content) {
      // Load existing content
      setFormData({
        title: content.title || '',
        slug: content.slug || generateSlug(content.title || ''),
        body: content.content || content.body || '',
        excerpt: content.excerpt || '',
        summary: content.summary || '',
        status: 'published',
        content_type: 'article',
        feed_slug: getFeedSlugFromNiche(content.niche || 'tech'),
        niche_name: content.niche || 'tech',
        is_featured: content.isFeatured || false,
        is_breaking: content.impactLevel === 'high' || false,
        featured_image_url: content.imageUrl || '',
        read_time_minutes: content.readTime || 5,
        security_score: content.securityScore || null,
        tags: content.tags || [],
      });
    }
  }, [content]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getFeedSlugFromNiche = (niche: string): string => {
    const map: Record<string, string> = {
      'tech': 'innovate',
      'security': 'secured',
      'gaming': 'play',
    };
    return map[niche] || 'innovate';
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const calculateReadTime = (text: string): number => {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const handleBodyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      body: value,
      read_time_minutes: calculateReadTime(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured');
      return;
    }

    setIsLoading(true);

    try {
      // Get or create feed
      let { data: feed } = await supabase
        .from('feeds')
        .select('id')
        .eq('slug', formData.feed_slug)
        .maybeSingle();

      if (!feed) {
        const feedNames: Record<string, string> = {
          'innovate': 'Innovate',
          'secured': 'Secured',
          'play': 'Play',
        };

        const { data: newFeed, error: feedError } = await supabase
          .from('feeds')
          .insert({
            slug: formData.feed_slug,
            name: feedNames[formData.feed_slug] || formData.feed_slug,
            is_active: true,
            display_order: 1,
          })
          .select('id')
          .single();

        if (feedError) throw feedError;
        feed = newFeed;
      }

      // Get or create niche
      let { data: niche } = await supabase
        .from('niches')
        .select('id')
        .eq('name', formData.niche_name)
        .maybeSingle();

      if (!niche) {
        const { data: newNiche, error: nicheError } = await supabase
          .from('niches')
          .insert({
            name: formData.niche_name,
            slug: formData.niche_name.toLowerCase(),
            description: `${formData.niche_name} content`,
            is_active: true,
          })
          .select('id')
          .single();

        if (nicheError) throw nicheError;
        niche = newNiche;
      }

      // Create or update content
      const contentData: any = {
        title: formData.title,
        slug: formData.slug,
        body: formData.body,
        excerpt: formData.excerpt || formData.summary || formData.body.substring(0, 200) + '...',
        summary: formData.summary || formData.excerpt || formData.body.substring(0, 200) + '...',
        status: formData.status,
        content_type: formData.content_type,
        is_featured: formData.is_featured,
        is_breaking: formData.is_breaking,
        featured_image_url: formData.featured_image_url || '/placeholder.svg',
        read_time_minutes: formData.read_time_minutes,
        security_score: formData.security_score,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      let contentId: string;

      if (content?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('content')
          .update(contentData)
          .eq('id', content.id);

        if (updateError) throw updateError;
        contentId = content.id;
      } else {
        // Create new
        const { data: newContent, error: createError } = await supabase
          .from('content')
          .insert(contentData)
          .select('id')
          .single();

        if (createError) throw createError;
        contentId = newContent.id;
      }

      // Link to feed
      if (feed) {
        const { data: existingFeed } = await supabase
          .from('content_feeds')
          .select('id')
          .eq('content_id', contentId)
          .eq('feed_id', feed.id)
          .maybeSingle();

        if (!existingFeed) {
          await supabase
            .from('content_feeds')
            .insert({
              content_id: contentId,
              feed_id: feed.id,
              display_order: 0,
            });
        }
      }

      // Link to niche
      if (niche) {
        const { data: existingNiche } = await supabase
          .from('content_niches')
          .select('id')
          .eq('content_id', contentId)
          .eq('niche_id', niche.id)
          .maybeSingle();

        if (!existingNiche) {
          await supabase
            .from('content_niches')
            .insert({
              content_id: contentId,
              niche_id: niche.id,
            });
        }
      }

      toast.success(content?.id ? 'Article updated successfully' : 'Article created successfully');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{content ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          <DialogDescription>
            {content ? 'Update article details' : 'Fill in the details to create a new article'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Article title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                placeholder="url-friendly-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the article"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleBodyChange(e.target.value)}
              required
              placeholder="Article content (HTML supported)"
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Estimated read time: {formData.read_time_minutes} minutes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed">Feed</Label>
              <Select
                value={formData.feed_slug}
                onValueChange={(value) => setFormData(prev => ({ ...prev, feed_slug: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="innovate">Innovate (Tech)</SelectItem>
                  <SelectItem value="secured">Secured (Security)</SelectItem>
                  <SelectItem value="play">Play (Gaming)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select
                value={formData.niche_name}
                onValueChange={(value) => setFormData(prev => ({ ...prev, niche_name: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="breaking"
                checked={formData.is_breaking}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_breaking: checked }))}
              />
              <Label htmlFor="breaking">Breaking News</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                content ? 'Update Article' : 'Create Article'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


