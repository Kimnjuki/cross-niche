import React, { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Shield, 
  Mail, 
  User, 
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { isAuth0Enabled } from '@/lib/auth0Config';

export const SignInSignUp: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
  const location = useLocation();

  const mode: 'signin' | 'signup' = useMemo(() => {
    const p = location.pathname.toLowerCase();
    return p.startsWith('/signup') ? 'signup' : 'signin';
  }, [location.pathname]);

  if (!isAuth0Enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <Shield className="w-10 h-10 text-nexus-cyan mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign-in temporarily unavailable</h1>
          <p className="text-gray-400 mb-4">
            Authentication is currently disabled on this environment. You can still browse all public
            articles and tools.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all"
          >
            Back to homepage
          </a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 p-10">
          <div className="w-full max-w-xl mx-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-10 h-10 text-nexus-cyan" />
                <div className="text-white">
                  <div className="text-2xl font-bold">GridNexus</div>
                  <div className="text-sm text-gray-400">Tech • Security • Gaming intelligence</div>
                </div>
              </div>

              <div className="text-gray-200 text-3xl font-semibold leading-tight">
                Stay ahead of breaches, CVEs, and emerging tech.
              </div>
              <div className="mt-4 text-gray-400">
                Sign in to bookmark stories, follow threat alerts, and personalize your feed.
              </div>

              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-tech-green/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-tech-green" />
                  </div>
                  <div className="text-gray-200">Advanced security tools and insights</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-gray-200">Personalized content recommendations</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gaming-purple/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gaming-purple" />
                  </div>
                  <div className="text-gray-200">Real-time updates and alerts</div>
                </div>
              </div>
            </div>

            <div className="text-gray-400 text-sm">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-nexus-cyan hover:text-blue-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-nexus-cyan hover:text-blue-400">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          {isAuthenticated ? (
            <GlassCard className="p-8 max-w-md w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">You're signed in</h2>
                <p className="text-gray-400 mb-6">Continue to your dashboard.</p>

                {user && (
                  <div className="flex flex-col items-center justify-center mb-6">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name ?? 'Profile'}
                        className="w-16 h-16 rounded-full border border-white/20 mb-3"
                      />
                    )}
                    <div className="text-white font-semibold">{user.name ?? user.email}</div>
                    {user.email && (
                      <div className="text-gray-400 text-sm mt-1">{user.email}</div>
                    )}
                  </div>
                )}

                <a
                  href="/"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all"
                >
                  Continue
                </a>
                <button
                  type="button"
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  className="mt-4 inline-flex items-center justify-center w-full px-6 py-3 border border-white/20 text-gray-200 rounded-lg font-semibold hover:bg-white/5 transition-all"
                >
                  Sign out
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="w-full max-w-md">
              <div className="text-center mb-6 lg:hidden">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Shield className="w-9 h-9 text-nexus-cyan" />
                  <h1 className="text-2xl font-bold text-white">GridNexus</h1>
                </div>
                <p className="text-gray-400">
                  {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              <GlassCard className="p-8">
                <div className="flex mb-6 bg-white/5 rounded-lg p-1">
                  <Link
                    to="/signin"
                    className={cn(
                      'flex-1 py-2 rounded-md text-sm font-medium transition-all text-center',
                      mode === 'signin'
                        ? 'bg-nexus-cyan text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={cn(
                      'flex-1 py-2 rounded-md text-sm font-medium transition-all text-center',
                      mode === 'signup'
                        ? 'bg-nexus-cyan text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    Sign Up
                  </Link>
                </div>

                <div className="relative space-y-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      loginWithRedirect({
                        authorizationParams: {
                          screen_hint: mode === 'signup' ? 'signup' : undefined,
                        },
                      })
                    }
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all disabled:opacity-60"
                  >
                    {isLoading
                      ? 'Loading...'
                      : mode === 'signin'
                      ? 'Continue with Auth0'
                      : 'Create account with Auth0'}
                  </button>

                  <p className="text-gray-400 text-sm text-center">
                    You’ll be securely redirected to our authentication provider and then back to
                    GridNexus.
                  </p>
                </div>

                <div className="mt-4 text-center text-sm text-gray-400 lg:hidden">
                  By continuing, you agree to our{' '}
                  <a href="/terms" className="text-nexus-cyan hover:text-blue-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-nexus-cyan hover:text-blue-400">
                    Privacy Policy
                  </a>
                  .
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
