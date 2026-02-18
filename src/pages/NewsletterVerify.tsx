import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useConvexDisabled } from '@/components/SafeConvexProvider';

export default function NewsletterVerify() {
  const isDisabled = useConvexDisabled();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') ?? '').trim();

  const verify = useMutation(api.newsletter.verifySubscription);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'invalid' | 'disabled' | 'error'>('idle');

  const canVerify = useMemo(() => !isDisabled && token.length > 0, [isDisabled, token]);

  useEffect(() => {
    if (isDisabled) {
      setStatus('disabled');
      return;
    }
    if (!token) {
      setStatus('invalid');
      return;
    }

    let cancelled = false;
    setStatus('verifying');
    void verify({ token })
      .then((res) => {
        if (cancelled) return;
        setStatus(res?.success ? 'verified' : 'invalid');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [isDisabled, token, verify]);

  return (
    <Layout>
      <SEOHead
        title="Verify Newsletter Subscription | The Grid Nexus"
        description="Verify your email to complete newsletter subscription."
        url={typeof window !== 'undefined' ? window.location.href : '/newsletter/verify'}
        type="website"
        noindex={true}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === 'disabled' ? (
                <div className="text-sm text-muted-foreground">
                  Verification is unavailable because Convex is disabled.
                </div>
              ) : status === 'verifying' ? (
                <div className="text-sm text-muted-foreground">Verifying…</div>
              ) : status === 'verified' ? (
                <div className="text-sm">Your subscription has been verified.</div>
              ) : status === 'invalid' ? (
                <div className="text-sm text-muted-foreground">
                  This verification link is invalid or has expired.
                </div>
              ) : status === 'error' ? (
                <div className="text-sm text-muted-foreground">Verification failed. Please try again.</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {canVerify ? 'Ready to verify.' : 'Missing verification token.'}
                </div>
              )}

              <Button asChild variant="outline" className="w-full">
                <a href="/">Return to home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
