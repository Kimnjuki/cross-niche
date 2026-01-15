import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

/**
 * OAuth callback handler
 * This page handles the redirect from OAuth providers (Google, GitHub, etc.)
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          navigate('/auth?mode=login&error=oauth_failed');
          return;
        }

        if (session) {
          // Successfully authenticated, redirect to home
          navigate('/');
        } else {
          // No session found, redirect to login
          navigate('/auth?mode=login');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/auth?mode=login&error=oauth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    </Layout>
  );
}

