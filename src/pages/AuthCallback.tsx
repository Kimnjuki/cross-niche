import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * OAuth callback handler
 * This page handles the redirect from OAuth providers (Google, GitHub, etc.)
 * Also handles PKCE code exchange for email confirmations
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for PKCE code (from email confirmation or OAuth)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        if (code) {
          // PKCE flow - exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          if (data.session) {
            setStatus('success');
            toast.success('Authentication successful!', {
              description: 'You have been logged in.',
            });
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            throw new Error('No session created');
          }
        } else {
          // OAuth flow - get session from URL hash
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            setStatus('success');
            toast.success('Authentication successful!', {
              description: 'You have been logged in.',
            });
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            // Try to get session from hash
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken && refreshToken) {
              const { data, error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (setSessionError) {
                throw setSessionError;
              }

              if (data.session) {
                setStatus('success');
                toast.success('Authentication successful!');
                setTimeout(() => {
                  navigate('/');
                }, 1500);
              } else {
                throw new Error('No session created');
              }
            } else {
              throw new Error('No authentication code or session found');
            }
          }
        }
      } catch (error: any) {
        console.error('Error handling auth callback:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
        toast.error('Authentication failed', {
          description: error.message || 'Please try again.',
        });
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Completing sign in...</p>
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
              <CardTitle className="font-display text-2xl">Success!</CardTitle>
              <CardDescription>
                Redirecting you now...
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
              <CardTitle className="font-display text-2xl">Authentication Failed</CardTitle>
              <CardDescription>
                {errorMessage || 'An error occurred during authentication.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate('/auth?mode=login')}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return null;
}

