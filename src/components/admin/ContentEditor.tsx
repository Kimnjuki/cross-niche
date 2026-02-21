import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
    toast.info('Content is managed in Convex. Use the Convex dashboard to edit.');
    onSave();
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










