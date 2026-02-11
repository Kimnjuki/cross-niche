import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { NewsletterSubscriber, NewsletterFrequency, NewsletterType, Niche, Article } from '@/types';
import { Mail, Check, Settings, Eye } from 'lucide-react';
import { newsletterEngine } from '@/lib/ai/newsletter';
import { mockArticles } from '@/data/mockData';
import { trackNewsletterSignup } from '@/lib/analytics/ga4';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'hero' | 'inline' | 'advanced';
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState<Niche[]>(['tech', 'security', 'gaming']);
  const [frequency, setFrequency] = useState<NewsletterFrequency>('weekly');
  const [newsletterTypes, setNewsletterTypes] = useState<NewsletterType[]>(['daily-digest', 'weekly-deep-dive']);
  const [topicSubscriptions, setTopicSubscriptions] = useState<string[]>([]);
  const [subscribers, setSubscribers] = useLocalStorage<NewsletterSubscriber[]>('newsletter-subscribers', []);
  const { toast } = useToast();

  const availableTopics = [
    'AI & Machine Learning',
    'Cybersecurity',
    'Gaming Tech',
    'Startups & Funding',
    'Security & Privacy',
    'Hardware',
    'Software Development',
    'Cloud Computing',
    'Mobile Technology',
    'Virtual Reality',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingSubscriber = subscribers.find(s => s.email === email);
    if (existingSubscriber) {
      toast({
        title: 'Already subscribed!',
        description: 'This email is already on our list.',
        variant: 'default',
      });
    } else {
      const newSubscriber: NewsletterSubscriber = {
        id: crypto.randomUUID(),
        email,
        subscribedAt: new Date().toISOString(),
        preferences,
        frequency,
        newsletterTypes,
        topicSubscriptions,
        isActive: true,
      };
      setSubscribers([...subscribers, newSubscriber]);
      trackNewsletterSignup(variant);
      toast({
        title: 'Welcome aboard!',
        description: 'You\'ve been subscribed to our personalized newsletter.',
      });
    }

    setEmail('');
    setIsSubmitting(false);
  };

  const handleNicheChange = (niche: Niche, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, niche]);
    } else {
      setPreferences(preferences.filter(p => p !== niche));
    }
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setTopicSubscriptions([...topicSubscriptions, topic]);
    } else {
      setTopicSubscriptions(topicSubscriptions.filter(t => t !== topic));
    }
  };

  const handleNewsletterTypeChange = (type: NewsletterType, checked: boolean) => {
    if (checked) {
      setNewsletterTypes([...newsletterTypes, type]);
    } else {
      setNewsletterTypes(newsletterTypes.filter(t => t !== type));
    }
  };

  const generatePreview = () => {
    const previewSubscriber: NewsletterSubscriber = {
      id: 'preview',
      email: 'preview@example.com',
      subscribedAt: new Date().toISOString(),
      preferences,
      frequency,
      newsletterTypes,
      topicSubscriptions,
      isActive: true,
    };

    return newsletterEngine.previewNewsletter(previewSubscriber, mockArticles);
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            id="newsletter-email-input"
            name="newsletter-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-12">
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <Input
          type="email"
          id="newsletter-email-inline"
          name="newsletter-email-inline"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-12"
          required
        />
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 px-8">
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          id="newsletter-email-compact"
          name="newsletter-email-compact"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-10"
          required
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <Check className="h-4 w-4" /> : 'Join'}
        </Button>
      </form>
    );
  }

  if (variant === 'advanced') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              id="newsletter-email-advanced"
              name="newsletter-email-advanced"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Content Preferences</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['tech', 'security', 'gaming'] as Niche[]).map((niche) => (
                <div key={niche} className="flex items-center space-x-2">
                  <Checkbox
                    id={`niche-${niche}`}
                    checked={preferences.includes(niche)}
                    onCheckedChange={(checked) => handleNicheChange(niche, checked as boolean)}
                  />
                  <label
                    htmlFor={`niche-${niche}`}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {niche}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Newsletter Frequency</label>
            <Select value={frequency} onValueChange={(value: NewsletterFrequency) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Newsletter Types</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'daily-digest' as NewsletterType, label: 'Daily Digest' },
                { value: 'weekly-deep-dive' as NewsletterType, label: 'Weekly Deep Dive' },
                { value: 'topic-specific' as NewsletterType, label: 'Topic-Specific' },
                { value: 'breaking-news' as NewsletterType, label: 'Breaking News' },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${value}`}
                    checked={newsletterTypes.includes(value)}
                    onCheckedChange={(checked) => handleNewsletterTypeChange(value, checked as boolean)}
                  />
                  <label
                    htmlFor={`type-${value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Topic Subscriptions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableTopics.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={`topic-${topic}`}
                    checked={topicSubscriptions.includes(topic)}
                    onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                  />
                  <label
                    htmlFor={`topic-${topic}`}
                    className="text-sm cursor-pointer"
                  >
                    {topic}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Newsletter Preview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {(() => {
                    const preview = generatePreview();
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-lg">{preview.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Estimated read time: {preview.estimatedReadTime} minutes
                          </p>
                          <div className="flex gap-1 mt-2">
                            {preview.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          {preview.articles.map((article, idx) => (
                            <div key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? idx} className="border rounded-lg p-3">
                              <h4 className="font-medium">{article.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {article.excerpt.substring(0, 100)}...
                              </p>
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{article.readTime} min read</span>
                                <Badge variant="outline" className="capitalize">
                                  {article.niche}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </DialogContent>
            </Dialog>

            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Subscribing...' : 'Subscribe with Preferences'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customize Your Newsletter</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Content Preferences</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['tech', 'security', 'gaming'] as Niche[]).map((niche) => (
                      <div key={niche} className="flex items-center space-x-2">
                        <Checkbox
                          id={`default-niche-${niche}`}
                          checked={preferences.includes(niche)}
                          onCheckedChange={(checked) => handleNicheChange(niche, checked as boolean)}
                        />
                        <label
                          htmlFor={`default-niche-${niche}`}
                          className="text-sm font-medium capitalize cursor-pointer"
                        >
                          {niche}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Newsletter Frequency</label>
                  <Select value={frequency} onValueChange={(value: NewsletterFrequency) => setFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Newsletter Types</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'daily-digest' as NewsletterType, label: 'Daily Digest' },
                      { value: 'weekly-deep-dive' as NewsletterType, label: 'Weekly Deep Dive' },
                      { value: 'topic-specific' as NewsletterType, label: 'Topic-Specific' },
                      { value: 'breaking-news' as NewsletterType, label: 'Breaking News' },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`default-type-${value}`}
                          checked={newsletterTypes.includes(value)}
                          onCheckedChange={(checked) => handleNewsletterTypeChange(value, checked as boolean)}
                        />
                        <label
                          htmlFor={`default-type-${value}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Topic Subscriptions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTopics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`default-topic-${topic}`}
                          checked={topicSubscriptions.includes(topic)}
                          onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                        />
                        <label
                          htmlFor={`default-topic-${topic}`}
                          className="text-sm cursor-pointer"
                        >
                          {topic}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </div>
      </form>
    </div>
  );
}
