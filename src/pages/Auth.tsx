import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login'; // login, signup, forgot-password, reset-password
  
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  
  const { login, signup, user, resetPassword, updatePassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();

  // Handle OAuth callback
  const handleOAuthCallback = async () => {
    // This will be handled by Supabase automatically
    // The auth state change listener will pick it up
  };

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'forgot-password') {
        const result = await resetPassword(email);
        if (result.success) {
          setForgotPasswordSent(true);
          toast.success('Password reset email sent!', {
            description: 'Check your inbox for instructions to reset your password.',
          });
        } else {
          toast.error('Failed to send reset email', {
            description: result.error,
          });
        }
        setIsLoading(false);
        return;
      }

      if (mode === 'reset-password') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const result = await updatePassword(password);
        if (result.success) {
          toast.success('Password updated successfully!');
          navigate('/auth?mode=login');
        } else {
          toast.error('Failed to update password', {
            description: result.error,
          });
        }
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          toast.success('Welcome back!', {
            description: 'You have been logged in successfully.',
          });
          navigate('/');
        } else {
          toast.error('Login failed', {
            description: result.error,
          });
        }
      } else {
        if (!name.trim()) {
          toast.error('Name required', {
            description: 'Please enter your name.',
          });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const result = await signup(email, password, name);
        if (result.success) {
          toast.success('Account created!', {
            description: 'Please check your email to verify your account.',
          });
          navigate('/');
        } else {
          toast.error('Signup failed', {
            description: result.error,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        toast.error('Google sign in failed', {
          description: result.error,
        });
        setIsLoading(false);
      }
      // OAuth redirect will happen automatically
    } catch (error) {
      toast.error('An error occurred during Google sign in');
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGitHub();
      if (!result.success) {
        toast.error('GitHub sign in failed', {
          description: result.error,
        });
        setIsLoading(false);
      }
      // OAuth redirect will happen automatically
    } catch (error) {
      toast.error('An error occurred during GitHub sign in');
      setIsLoading(false);
    }
  };

  if (mode === 'forgot-password' && forgotPasswordSent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="font-display text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setForgotPasswordSent(false);
                  navigate('/auth?mode=login');
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl gradient-hero mx-auto mb-4" />
            <CardTitle className="font-display text-2xl">
              {mode === 'forgot-password' && 'Reset Password'}
              {mode === 'reset-password' && 'Set New Password'}
              {mode !== 'forgot-password' && mode !== 'reset-password' && (isLogin ? 'Welcome Back' : 'Create Account')}
            </CardTitle>
            <CardDescription>
              {mode === 'forgot-password' && 'Enter your email to receive password reset instructions'}
              {mode === 'reset-password' && 'Enter your new password'}
              {mode !== 'forgot-password' && mode !== 'reset-password' && (
                isLogin
                  ? 'Sign in to access your bookmarks and comments'
                  : 'Join our community of tech enthusiasts'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode !== 'forgot-password' && mode !== 'reset-password' && (
              <>
                {/* Social Sign In Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGitHubSignIn}
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && mode !== 'forgot-password' && mode !== 'reset-password' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              {(!isLogin || mode === 'reset-password') && mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              {isLogin && mode !== 'forgot-password' && mode !== 'reset-password' && (
                <div className="flex items-center justify-end">
                  <Link
                    to="/auth?mode=forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Please wait...' : (
                  mode === 'forgot-password' ? 'Send Reset Link' :
                  mode === 'reset-password' ? 'Update Password' :
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center space-y-2">
              {mode === 'forgot-password' ? (
                <button
                  type="button"
                  onClick={() => navigate('/auth?mode=login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              ) : mode === 'reset-password' ? (
                <button
                  type="button"
                  onClick={() => navigate('/auth?mode=login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    navigate(`/auth?mode=${!isLogin ? 'login' : 'signup'}`);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
