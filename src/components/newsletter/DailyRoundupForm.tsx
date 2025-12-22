import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function DailyRoundupForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast({
        title: 'Success',
        description: 'You\'ve been subscribed to the Daily Security & Gaming Roundup!',
      });
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Check className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">You're Subscribed!</h3>
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation. You'll receive your first roundup tomorrow.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Daily Security & Gaming Roundup
        </CardTitle>
        <CardDescription>
          Get the free daily briefing on threats, tech, and gaming news.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe Free'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Join 12,000+ subscribers • No spam • Unsubscribe anytime
          </p>
        </form>
      </CardContent>
    </Card>
  );
}



