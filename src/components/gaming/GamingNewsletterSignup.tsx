import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gamepad2, Shield, Mail, Check, Bell } from 'lucide-react';
import { trackNewsletterSignup } from '@/lib/analytics/ga4';

interface GamingNewsletterSignupProps {
  /** Content type hint for analytics */
  source?: 'article' | 'listing' | 'tools';
}

/**
 * Gaming-focused newsletter signup that slides in after a delay.
 * Offers patch notes + security alerts — the angle that converts gamers.
 */
export function GamingNewsletterSignup({ source = 'listing' }: GamingNewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);

    // GA4 event
    trackNewsletterSignup(email, 'gaming');

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('gaming-subscribers') || '[]');
    existing.push({ email, subscribedAt: Date.now(), source: `gaming-${source}` });
    localStorage.setItem('gaming-subscribers', JSON.stringify(existing));

    // Simulate API call
    await new Promise(r => setTimeout(r, 600));
    setIsSubmitting(false);
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-gaming/10 to-secondary/10 border border-gaming/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gaming/20">
            <Check className="h-5 w-5 text-gaming" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">You're in the squad!</h3>
            <p className="text-sm text-muted-foreground">
              Watch for patch notes, security alerts, and exclusive guides in your inbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gaming/5 via-gaming/10 to-secondary/5 border border-gaming/20 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Icon */}
        <div className="hidden md:flex p-3 rounded-full bg-gaming/20">
          <Gamepad2 className="h-8 w-8 text-gaming" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-gaming" />
            <h3 className="font-display font-bold text-lg">
              Gaming Security Alerts
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get <strong className="text-gaming">patch notes</strong>, 
            <strong className="text-gaming"> security advisories</strong>, and 
            <strong className="text-gaming"> exclusive guides</strong> for the games you play.
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto shrink-0">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="max-w-[220px] bg-background"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="bg-gaming hover:bg-gaming/90 text-white gap-2">
            <Mail className="h-4 w-4" />
            {isSubmitting ? 'Joining...' : 'Join'}
          </Button>
        </form>
      </div>
    </div>
  );
}
