import React, { useState } from 'react';
import { 
  SignIn, 
  SignUp, 
  useUser,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Chrome,
  Github
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';

export const SignInSignUp: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome Back!</h2>
            <p className="text-gray-400 mb-6">You are successfully signed in to GridNexus.</p>
            
            <div className="flex justify-center mb-6">
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "glass border border-white/20 rounded-lg p-2",
                    avatarBox: "w-16 h-16"
                  }
                }}
              />
            </div>
            
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all"
            >
              Continue to Dashboard
            </a>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md mx-4">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-nexus-cyan" />
            <h1 className="text-3xl font-bold text-white">GridNexus</h1>
          </div>
          <p className="text-gray-400">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <GlassCard className="p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMode('signin')}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signin'
                  ? 'bg-nexus-cyan text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signup'
                  ? 'bg-nexus-cyan text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Forms */}
          <div className="relative">
            {mode === 'signin' ? (
              <SignIn
                path="/sign-in"
                routing="path"
                redirectUrl="/"
                appearance={{
                  elements: {
                    rootBox: "space-y-4",
                    card: "glass border-0 bg-transparent shadow-none",
                    headerTitle: "text-white text-xl font-semibold",
                    headerSubtitle: "text-gray-400 text-sm",
                    socialButtonsBlockButton: "glass border border-white/20 bg-white/5 text-white hover:bg-white/10",
                    socialButtonsBlockButtonText: "text-white",
                    formButtonPrimary: "w-full bg-gradient-to-r from-nexus-cyan to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all",
                    formFieldLabel: "text-gray-300 text-sm font-medium",
                    formFieldInput: "bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-nexus-cyan focus:bg-white/10 transition-all rounded-lg",
                    footerActionLink: "text-nexus-cyan hover:text-blue-400 text-sm",
                    dividerText: "text-gray-500 text-sm",
                    identityPreview: "text-white",
                    identityPreviewText: "text-gray-400"
                  }
                }}
              />
            ) : (
              <SignUp
                path="/sign-up"
                routing="path"
                redirectUrl="/"
                appearance={{
                  elements: {
                    rootBox: "space-y-4",
                    card: "glass border-0 bg-transparent shadow-none",
                    headerTitle: "text-white text-xl font-semibold",
                    headerSubtitle: "text-gray-400 text-sm",
                    socialButtonsBlockButton: "glass border border-white/20 bg-white/5 text-white hover:bg-white/10",
                    socialButtonsBlockButtonText: "text-white",
                    formButtonPrimary: "w-full bg-gradient-to-r from-nexus-cyan to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all",
                    formFieldLabel: "text-gray-300 text-sm font-medium",
                    formFieldInput: "bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-nexus-cyan focus:bg-white/10 transition-all rounded-lg",
                    footerActionLink: "text-nexus-cyan hover:text-blue-400 text-sm",
                    dividerText: "text-gray-500 text-sm",
                    identityPreview: "text-white",
                    identityPreviewText: "text-gray-400"
                  }
                }}
              />
            )}
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Why Join GridNexus?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-tech-green/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-tech-green" />
                </div>
                <span className="text-gray-300 text-sm">Advanced security tools and insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-300 text-sm">Personalized content recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gaming-purple/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gaming-purple" />
                </div>
                <span className="text-gray-300 text-sm">Real-time updates and alerts</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-nexus-cyan hover:text-blue-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-nexus-cyan hover:text-blue-400">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
