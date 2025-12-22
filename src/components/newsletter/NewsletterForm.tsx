import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { NewsletterSubscriber } from '@/types';
import { Mail, Check } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'hero' | 'inline';
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribers, setSubscribers] = useLocalStorage<NewsletterSubscriber[]>('newsletter-subscribers', []);
  const { toast } = useToast();

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
        preferences: ['tech', 'security', 'gaming'],
      };
      setSubscribers([...subscribers, newSubscriber]);
      toast({
        title: 'Welcome aboard!',
        description: 'You\'ve been subscribed to our newsletter.',
      });
    }

    setEmail('');
    setIsSubmitting(false);
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 bg-background/10 border-border/50 text-foreground placeholder:text-muted-foreground"
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
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <Check className="h-4 w-4" /> : 'Join'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </Button>
    </form>
  );
}
