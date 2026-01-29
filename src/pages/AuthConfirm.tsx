import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Intermediate email confirmation page
 * This page handles the confirmation URL from Supabase email links
 * It prevents email prefetching issues by requiring a user click
 */
export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const confirmationUrl = searchParams.get('confirmation_url');
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'signup';
  const code = searchParams.get('code');

  useEffect(() => {
    // If we have a code parameter, exchange it for a session (PKCE flow)
    if (code) {
      handleCodeExchange(code);
    }
  }, [code]);

  const handleCodeExchange = async (exchangeCode: string) => {
    setStatus('loading');
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(exchangeCode);

      if (error) {
        throw error;
      }

      if (data.session) {
        setStatus('success');
        toast.success('Email confirmed successfully!', {
          description: 'You can now access all features.',
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('No session created');
      }
    } catch (error: any) {
      console.error('Code exchange error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to confirm email. The link may have expired.');
      toast.error('Confirmation failed', {
        description: error.message || 'The confirmation link may have expired.',
      });
    }
  };

  const handleConfirmClick = async () => {
    if (!confirmationUrl) {
      setStatus('error');
      setErrorMessage('Missing confirmation URL');
      return;
    }

    setStatus('loading');

    try {
      // Extract the token from the confirmation URL
      const url = new URL(confirmationUrl);
      const tokenHash = url.hash.substring(1); // Remove the # symbol
      const params = new URLSearchParams(tokenHash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type') || 'signup';

      if (accessToken && refreshToken) {
        // Set the session directly
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          toast.success('Email confirmed successfully!', {
            description: 'You can now access all features.',
          });
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error('No session created');
        }
      } else {
        // Try to use the confirmation URL directly
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          toast.success('Email confirmed successfully!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error('No session created');
        }
      }
    } catch (error: any) {
      console.error('Confirmation error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to confirm email. The link may have expired.');
      toast.error('Confirmation failed', {
        description: error.message || 'The confirmation link may have expired.',
      });
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Confirming your email...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (status === 'success') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="font-display text-2xl">Email Confirmed!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. Redirecting you now...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="font-display text-2xl">Confirmation Failed</CardTitle>
              <CardDescription>
                {errorMessage || 'The confirmation link may have expired or is invalid.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/auth?mode=login')}
              >
                Go to Login
              </Button>
              <Button
                variant="link"
                className="w-full"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Sign up again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Pending state - show button to click
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Confirm Your Email</CardTitle>
            <CardDescription>
              Click the button below to confirm your email address and activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This intermediate step prevents email prefetching issues and ensures your confirmation link works properly.
            </p>
            <Button
              onClick={handleConfirmClick}
              className="w-full"
              disabled={!confirmationUrl}
            >
              Confirm Email Address
            </Button>
            {!confirmationUrl && (
              <p className="text-xs text-red-500 text-center">
                Missing confirmation URL. Please use the link from your email.
              </p>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/auth?mode=login')}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}










