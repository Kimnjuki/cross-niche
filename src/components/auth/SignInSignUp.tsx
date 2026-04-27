import React, { useMemo } from ‘react’;
import { SignIn, SignUp, useUser } from ‘@clerk/clerk-react’;
import { Shield, Mail, User } from ‘lucide-react’;
import { useLocation } from ‘react-router-dom’;

export const SignInSignUp: React.FC = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();

  const mode: ‘signin’ | ‘signup’ = useMemo(() => {
    return location.pathname.toLowerCase().startsWith(‘/signup’) ? ‘signup’ : ‘signin’;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="min-h-screen flex">

        {/* Left panel — branding (desktop only) */}
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
              By continuing, you agree to our{‘ ‘}
              <a href="/terms" className="text-nexus-cyan hover:text-blue-400">Terms of Service</a>{‘ ‘}
              and{‘ ‘}
              <a href="/privacy" className="text-nexus-cyan hover:text-blue-400">Privacy Policy</a>.
            </div>
          </div>
        </div>

        {/* Right panel — Clerk UI */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          {isSignedIn ? (
            <div className="text-center text-white">
              <p className="text-lg mb-4">You’re signed in.</p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold"
              >
                Go to homepage
              </a>
            </div>
          ) : mode === ‘signup’ ? (
            <SignUp
              routing="path"
              path="/signup"
              afterSignUpUrl="/"
              appearance={{
                variables: { colorPrimary: ‘#00F0FF’ },
              }}
            />
          ) : (
            <SignIn
              routing="path"
              path="/signin"
              afterSignInUrl="/"
              appearance={{
                variables: { colorPrimary: ‘#00F0FF’ },
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default SignInSignUp;
